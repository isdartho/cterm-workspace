import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';

const THEMES = {
  dracula: {
    background: '#181a23',
    foreground: '#f8f8f2',
    cursor: '#f8f8f0',
    cursorAccent: '#181a23',
    selectionBackground: 'rgba(255, 255, 255, 0.15)',
    black: '#21222c', red: '#ff5555', green: '#50fa7b', yellow: '#f1fa8c', blue: '#bd93f9', magenta: '#ff79c6', cyan: '#8be9fd', white: '#f8f8f2',
    brightBlack: '#6272a4', brightRed: '#ff6e6e', brightGreen: '#69ff94', brightYellow: '#ffffa5', brightBlue: '#d6acff', brightMagenta: '#ff92df', brightCyan: '#a4ffff', brightWhite: '#ffffff',
  },
  nord: {
    background: '#161920',
    foreground: '#d8dee9',
    cursor: '#88c0d0',
    cursorAccent: '#161920',
    selectionBackground: 'rgba(136, 192, 208, 0.3)',
    black: '#3b4252', red: '#bf616a', green: '#a3be8c', yellow: '#ebcb8b', blue: '#81a1c1', magenta: '#b48ead', cyan: '#88c0d0', white: '#e5e9f0',
    brightBlack: '#4c566a', brightRed: '#bf616a', brightGreen: '#a3be8c', brightYellow: '#ebcb8b', brightBlue: '#81a1c1', brightMagenta: '#b48ead', brightCyan: '#8fbcbb', brightWhite: '#eceff4',
  },
  cyberpunk: {
    background: '#090514',
    foreground: '#00ff66',
    cursor: '#00e5ff',
    cursorAccent: '#090514',
    selectionBackground: 'rgba(0, 229, 255, 0.3)',
    black: '#1a0f30', red: '#ff0055', green: '#00ff66', yellow: '#ffe600', blue: '#00e5ff', magenta: '#ff00ff', cyan: '#00ffff', white: '#ffffff',
    brightBlack: '#555555', brightRed: '#ff0055', brightGreen: '#00ff66', brightYellow: '#ffe600', brightBlue: '#00e5ff', brightMagenta: '#ff00ff', brightCyan: '#00ffff', brightWhite: '#ffffff',
  },
  oneDark: {
    background: '#1e222a',
    foreground: '#abb2bf',
    cursor: '#528bff',
    cursorAccent: '#1e222a',
    selectionBackground: 'rgba(82, 139, 255, 0.3)',
    black: '#282c34', red: '#e06c75', green: '#98c379', yellow: '#d19a66', blue: '#61afef', magenta: '#c678dd', cyan: '#56b6c2', white: '#abb2bf',
    brightBlack: '#5c6370', brightRed: '#e06c75', brightGreen: '#98c379', brightYellow: '#d19a66', brightBlue: '#61afef', brightMagenta: '#c678dd', brightCyan: '#56b6c2', brightWhite: '#ffffff',
  },
  light: {
    background: '#ffffff',
    foreground: '#24292e',
    cursor: '#24292e',
    cursorAccent: '#ffffff',
    selectionBackground: 'rgba(3, 102, 214, 0.2)',
    black: '#24292e', red: '#d73a49', green: '#28a745', yellow: '#dbab09', blue: '#0366d6', magenta: '#ea4aaa', cyan: '#0598bc', white: '#6a737d',
    brightBlack: '#959da5', brightRed: '#cb2431', brightGreen: '#22863a', brightYellow: '#f9c513', brightBlue: '#005cc5', brightMagenta: '#d03592', brightCyan: '#3192aa', brightWhite: '#d1d5da',
  }
};

class TerminalSessionManager {
  constructor() {
    this.sessions = new Map(); // key: sessionId, value: sessionObject
  }

  getOrCreateSession(sessionId, settings) {
    if (this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId);
      this.updateSessionSettings(sessionId, settings);
      return session;
    }

    const term = new Terminal({
      cursorBlink: settings.cursorBlink,
      cursorStyle: settings.cursorStyle,
      fontSize: settings.fontSize,
      fontFamily: "'JetBrains Mono', Courier, monospace",
      theme: THEMES[settings.theme] || THEMES.dracula,
      scrollback: 5000,
      drawBoldTextInBrightColors: true,
      allowProposedApi: true
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const isDev = window.location.port !== '';
    const wsHost = isDev ? `${window.location.hostname}:3001` : window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/terminals/${sessionId}`;

    const ws = new WebSocket(wsUrl);

    const session = {
      sessionId,
      term,
      fitAddon,
      ws,
      status: 'connecting',
      error: '',
      onStatusChange: null, // React callback to notify active components of state changes
      dataListener: null,
      resizeListener: null
    };

    ws.onopen = () => {
      session.status = 'connected';
      if (session.onStatusChange) session.onStatusChange('connected');
      
      // Initial sizing
      if (term.element && term.cols && term.rows) {
        ws.send(JSON.stringify({
          type: 'resize',
          cols: term.cols,
          rows: term.rows
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'output' || msg.type === 'restore') {
          term.write(msg.data);
        } else if (msg.type === 'exit') {
          session.status = 'disconnected';
          if (session.onStatusChange) session.onStatusChange('disconnected');
          term.write('\r\n\x1b[31m[Session terminated by remote host]\x1b[0m\r\n');
        } else if (msg.type === 'error') {
          session.status = 'error';
          session.error = msg.message;
          if (session.onStatusChange) session.onStatusChange('error', msg.message);
          term.write(`\r\n\x1b[31mError: ${msg.message}\x1b[0m\r\n`);
        }
      } catch (err) {
        term.write(event.data);
      }
    };

    ws.onclose = () => {
      if (session.status === 'connected') {
        session.status = 'disconnected';
        if (session.onStatusChange) session.onStatusChange('disconnected');
      }
    };

    ws.onerror = (err) => {
      console.error(`WS error for session ${sessionId}:`, err);
      session.status = 'error';
      session.error = 'Failed to connect to backend';
      if (session.onStatusChange) session.onStatusChange('error', 'Failed to connect to backend');
    };

    // Keep references to listeners to dispose them later
    session.dataListener = term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'input', data }));
      }
    });

    session.resizeListener = term.onResize((size) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'resize',
          cols: size.cols,
          rows: size.rows
        }));
      }
    });

    this.sessions.set(sessionId, session);
    return session;
  }

  updateSessionSettings(sessionId, settings) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const term = session.term;
    term.options.fontSize = settings.fontSize;
    term.options.cursorBlink = settings.cursorBlink;
    term.options.cursorStyle = settings.cursorStyle;
    term.options.theme = THEMES[settings.theme] || THEMES.dracula;
  }

  closeSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    try {
      if (session.dataListener) session.dataListener.dispose();
      if (session.resizeListener) session.resizeListener.dispose();
      if (session.ws) session.ws.close();
      if (session.term) session.term.dispose();
    } catch (err) {
      console.warn(`Error disposing session ${sessionId}:`, err);
    }

    this.sessions.delete(sessionId);
  }

  closeAll() {
    for (const sessionId of this.sessions.keys()) {
      this.closeSession(sessionId);
    }
  }
}

export const sessionManager = new TerminalSessionManager();
export { THEMES };
