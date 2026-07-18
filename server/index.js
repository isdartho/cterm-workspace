import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import pty from 'node-pty';
import os from 'os';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { execSync } from 'child_process';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static client build files in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Map to store active terminal sessions
// key: sessionId, value: { ptyProcess, buffer: Array, clients: Set, cols: number, rows: number }
const sessions = new Map();

// Set to store active auth tokens
const activeTokens = new Set();

// Middleware to verify auth tokens
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  
  const token = authHeader.split(' ')[1];
  const sharedSecret = process.env.PTY_SHARED_SECRET;
  
  if (!activeTokens.has(token) && (!sharedSecret || token !== sharedSecret)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  
  next();
};

// Login endpoint checking credentials in environment variables
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const envUsername = process.env.AUTH_USERNAME || 'admin';
  const envPassword = process.env.AUTH_PASSWORD || 'admin';

  if (username === envUsername && password === envPassword) {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    activeTokens.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// Path to workspaces JSON database file
const WORKSPACES_FILE = path.join(__dirname, 'workspaces.json');

// Fetch workspaces configuration
app.get('/api/workspaces', authenticate, async (req, res) => {
  try {
    const data = await fs.readFile(WORKSPACES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.json({ workspaces: [], activeWorkspaceId: null });
    }
    console.error('Failed to read workspaces:', error);
    res.status(500).json({ error: 'Failed to read workspaces from database' });
  }
});

// Update/Save workspaces configuration
app.post('/api/workspaces', authenticate, async (req, res) => {
  const { workspaces, activeWorkspaceId } = req.body;
  try {
    await fs.writeFile(WORKSPACES_FILE, JSON.stringify({ workspaces, activeWorkspaceId }, null, 2), 'utf8');
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save workspaces:', error);
    res.status(500).json({ error: 'Failed to save workspaces to database' });
  }
});

// Helper to get default shell for the platform
const getDefaultShell = () => {
  if (os.platform() === 'win32') {
    return 'powershell.exe';
  }
  return process.env.SHELL || (os.platform() === 'darwin' ? '/bin/zsh' : '/bin/bash');
};

// Create a new terminal session
app.post('/api/terminals', authenticate, (req, res) => {
  const { cols = 80, rows = 24 } = req.body;
  const sessionId = Math.random().toString(36).substring(2, 15);
  
  const shell = getDefaultShell();
  
  try {
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols: cols,
      rows: rows,
      cwd: process.env.HOME || process.cwd(),
      env: {
        ...process.env,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor'
      }
    });

    const sessionData = {
      id: sessionId,
      ptyProcess,
      buffer: [], // Stores last 500 lines/chunks for UI restore
      clients: new Set(),
      cols: cols,
      rows: rows,
      createdAt: new Date()
    };

    // Buffer limit to prevent memory leak
    const MAX_BUFFER_LINES = 1000;

    ptyProcess.onData((data) => {
      // Add data to buffer
      sessionData.buffer.push(data);
      if (sessionData.buffer.length > MAX_BUFFER_LINES) {
        sessionData.buffer.shift();
      }

      // Broadcast output to all attached clients
      const message = JSON.stringify({ type: 'output', data });
      sessionData.clients.forEach((client) => {
        if (client.readyState === 1) { // OPEN
          client.send(message);
        }
      });
    });

    ptyProcess.onExit(({ exitCode, signal }) => {
      console.log(`Session ${sessionId} exited with code ${exitCode}`);
      // Notify clients that session has ended
      const message = JSON.stringify({ type: 'exit', exitCode, signal });
      sessionData.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
      sessions.delete(sessionId);
    });

    sessions.set(sessionId, sessionData);

    res.json({
      sessionId,
      shell: shell.split('/').pop(),
      createdAt: sessionData.createdAt
    });
  } catch (error) {
    console.error('Failed to spawn pty:', error);
    res.status(500).json({ error: 'Failed to spawn terminal process' });
  }
});

// List all active sessions
app.get('/api/terminals', authenticate, (req, res) => {
  const activeSessions = Array.from(sessions.entries()).map(([id, session]) => ({
    sessionId: id,
    cols: session.cols,
    rows: session.rows,
    createdAt: session.createdAt
  }));
  res.json(activeSessions);
});

// Terminate a session
app.delete('/api/terminals/:sessionId', authenticate, (req, res) => {
  const { sessionId } = req.params;
  const session = sessions.get(sessionId);
  
  if (session) {
    session.ptyProcess.kill();
    sessions.delete(sessionId);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// Handle WebSocket upgrade
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname;
  
  // Validate auth token
  const token = url.searchParams.get('token');
  const sharedSecret = process.env.PTY_SHARED_SECRET;
  
  if (!token || (!activeTokens.has(token) && (!sharedSecret || token !== sharedSecret))) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // URL path should match /terminals/:sessionId
  const match = pathname.match(/^\/terminals\/([^/]+)$/);
  
  if (match) {
    const sessionId = match[1];
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, sessionId);
    });
  } else {
    socket.destroy();
  }
});

// WebSocket Server connection handler
wss.on('connection', (ws, request, sessionId) => {
  const session = sessions.get(sessionId);
  
  if (!session) {
    ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }));
    ws.close();
    return;
  }

  // Attach client to session
  session.clients.add(ws);
  console.log(`Client attached to terminal session: ${sessionId}. Total clients: ${session.clients.size}`);

  // Send buffer history to catch up the terminal UI
  if (session.buffer.length > 0) {
    ws.send(JSON.stringify({
      type: 'restore',
      data: session.buffer.join('')
    }));
  }

  // Handle incoming messages from the frontend
  ws.on('message', (messageStr) => {
    try {
      const message = JSON.parse(messageStr);
      
      switch (message.type) {
        case 'input':
          // Write frontend keystrokes/data to the pty process
          session.ptyProcess.write(message.data);
          break;
          
        case 'resize':
          // Resize the actual pty terminal
          const { cols, rows } = message;
          if (cols && rows) {
            session.cols = cols;
            session.rows = rows;
            session.ptyProcess.resize(cols, rows);
          }
          break;
          
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (err) {
      console.error('Error handling WS message:', err);
    }
  });

  ws.on('close', () => {
    session.clients.delete(ws);
    console.log(`Client detached from terminal session: ${sessionId}. Remaining clients: ${session.clients.size}`);
    
    // Optional: Auto-kill session after some time if no clients are attached
    // For now we keep sessions active in memory for reconnection, but we can set a timeout
    setTimeout(() => {
      const currentSession = sessions.get(sessionId);
      if (currentSession && currentSession.clients.size === 0) {
        console.log(`Cleaning up idle session ${sessionId}`);
        currentSession.ptyProcess.kill();
        sessions.delete(sessionId);
      }
    }, 10 * 60 * 1000); // 10 minutes timeout
  });
});

// Serve index.html for any frontend client-side router requests in production
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/terminals')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
