import React, { useState, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Plus, 
  Trash2, 
  Sliders, 
  Palette, 
  Type, 
  Activity, 
  Edit2,
  Check,
  FolderOpen,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Server,
  Monitor
} from 'lucide-react';
import PaneLayout from './components/PaneLayout';
import { sessionManager } from './services/TerminalSessionManager';

const isDev = window.location.port !== '';
const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || window.location.hostname;
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '3001';
const BACKEND_URL = isDev ? `${window.location.protocol}//${BACKEND_HOST}:${BACKEND_PORT}` : window.location.origin;

const namelist_a = [
    "Alpha", "Apex", "Astro", "Blaze", "Chaos", "Cosmic", "Cyber", "Dark", 
    "Doom", "Echo", "Electric", "Elite", "Fatal", "Frost", "Ghost", "Hyper", 
    "Iron", "Lunar", "Matrix", "Mega", "Mystic", "Neon", "Nova", "Omega", 
    "Phantom", "Pixel", "Quantum", "Radical", "Rogue", "Shadow", "Solar", 
    "Sonic", "Spectral", "Static", "Stealth", "Storm", "Toxic", "Turbo", 
    "Vortex", "Zephyr"
];

const namelist_b = [
    "Assassin", "Beast", "Blade", "Bolt", "Cobra", "Crusader", "Cyborg", "Demon", 
    "Dragon", "Eagle", "Falcon", "Fury", "Glitch", "Hacker", "Hunter", "Hydra", 
    "Knight", "Laser", "Legend", "Lynx", "Mamba", "Matrix", "Ninja", "Nomad", 
    "Outlaw", "Panther", "Pharaoh", "Phoenix", "Pulse", "Raven", "Reaper", "Rider", 
    "Samurai", "Scorpion", "Shark", "Sniper", "Titan", "Viper", "Warlock", "Wolf"
];

const getMixedName = () => `${namelist_a[Math.floor(Math.random() * namelist_a.length)]} ${namelist_b[Math.floor(Math.random() * namelist_b.length)]}`;

function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLoginSuccess(data.token);
      } else {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at center, #1b1035 0%, #090a0f 100%)',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '380px',
        padding: '40px',
        borderRadius: '16px',
        backgroundColor: 'rgba(18, 20, 30, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(124, 77, 255, 0.25)',
        boxShadow: '0 0 40px rgba(124, 77, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: 'fadeIn 0.5s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            padding: '12px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(124, 77, 255, 0.4)',
            marginBottom: '16px',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TerminalIcon size={24} style={{ color: '#ffffff' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '24px',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            background: 'linear-gradient(135deg, #ffffff 40%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>cTerm Login</h2>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            Authenticate to access terminal sessions
          </p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '12px',
            lineHeight: '1.4'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>USERNAME</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              style={{
                backgroundColor: 'rgba(9, 10, 15, 0.8)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-smooth)'
              }}
              className="login-input"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: 'rgba(9, 10, 15, 0.8)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-smooth)'
              }}
              className="login-input"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, #a78bfa 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(124, 77, 255, 0.4)',
            transition: 'var(--transition-smooth)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '10px'
          }}
          className="login-submit-btn"
        >
          {loading ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : 'Sign In'}
        </button>
      </form>

      <style>{`
        .login-input:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 10px var(--color-primary-glow);
        }
        .login-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(124, 77, 255, 0.5);
        }
        .login-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .login-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

// Helper to generate safe random IDs
const genId = (prefix) => `${prefix}-${Math.random().toString(36).substring(2, 11)}`;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('cterm_auth_token'));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreferencesCollapsed, setIsPreferencesCollapsed] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [isWorkspacesLoaded, setIsWorkspacesLoaded] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('cterm_auth_token');
    setIsAuthenticated(false);
    setIsWorkspacesLoaded(false);
    setWorkspaces([]);
    setActiveWorkspaceId(null);
  };

  // Trigger terminal refit on sidebar transition completion
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 260); // slightly longer than width transition
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed]);
  
  // Custom workspace renaming state
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingWorkspaceText, setEditingWorkspaceText] = useState('');

  // Workspace creation modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createWorkspaceName, setCreateWorkspaceName] = useState('New Workspace');
  const [createWorkspaceServer, setCreateWorkspaceServer] = useState('');
  const [createWorkspaceToken, setCreateWorkspaceToken] = useState('');
  const [createWorkspaceError, setCreateWorkspaceError] = useState('');
  const [createWorkspaceLoading, setCreateWorkspaceLoading] = useState(false);

  const validateServerToken = async (serverUrl, token) => {
    const url = serverUrl ? serverUrl.replace(/\/$/, '') : BACKEND_URL;
    const authHeader = token || sessionStorage.getItem('cterm_auth_token') || '';
    
    try {
      const response = await fetch(`${url}/api/terminals`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authHeader}`
        }
      });
      if (response.ok) {
        return { valid: true };
      }
      if (response.status === 401) {
        return { valid: false, error: 'Invalid API secret / token.' };
      }
      return { valid: false, error: `Server returned status ${response.status}.` };
    } catch (e) {
      return { valid: false, error: 'Could not connect to target server. Check URL and CORS settings.' };
    }
  };

  const handleConfirmCreateWorkspace = async () => {
    setCreateWorkspaceError('');
    setCreateWorkspaceLoading(true);
    
    const name = createWorkspaceName.trim();
    const serverUrl = createWorkspaceServer.trim();
    const token = createWorkspaceToken.trim();

    if (!name) {
      setCreateWorkspaceError('Workspace name is required.');
      setCreateWorkspaceLoading(false);
      return;
    }

    const validation = await validateServerToken(serverUrl, token);
    if (!validation.valid) {
      setCreateWorkspaceError(validation.error);
      setCreateWorkspaceLoading(false);
      return;
    }

    await createWorkspace(name, serverUrl, token);
    setIsCreateModalOpen(false);
    setCreateWorkspaceLoading(false);
    setCreateWorkspaceName('New Workspace');
    setCreateWorkspaceServer('');
    setCreateWorkspaceToken('');
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateWorkspaceError('');
    setCreateWorkspaceLoading(false);
    setCreateWorkspaceName('New Workspace');
    setCreateWorkspaceServer('');
    setCreateWorkspaceToken('');
  };

  // Expand/collapse state for workspaces in the sidebar
  const [expandedWorkspaceIds, setExpandedWorkspaceIds] = useState({});

  // Workspace deletion confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [workspaceToDeleteId, setWorkspaceToDeleteId] = useState(null);
  const [workspaceToDeleteName, setWorkspaceToDeleteName] = useState('');

  const handleDeleteClick = (workspaceId, workspaceName, e) => {
    e.stopPropagation();
    setWorkspaceToDeleteId(workspaceId);
    setWorkspaceToDeleteName(workspaceName);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteWorkspace = () => {
    if (workspaceToDeleteId) {
      closeWorkspace(workspaceToDeleteId);
    }
    setIsDeleteModalOpen(false);
    setWorkspaceToDeleteId(null);
    setWorkspaceToDeleteName('');
  };
  
  const toggleWorkspaceExpand = (workspaceId, e) => {
    e.stopPropagation();
    setExpandedWorkspaceIds(prev => ({
      ...prev,
      [workspaceId]: !prev[workspaceId]
    }));
  };

  const countTerminals = (node) => {
    if (!node) return 0;
    if (node.type === 'terminal') return 1;
    if (node.type === 'split' && node.children) {
      return countTerminals(node.children[0]) + countTerminals(node.children[1]);
    }
    return 0;
  };

  // Global settings
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('cterm_settings');
    return saved ? JSON.parse(saved) : {
      theme: 'dracula',
      fontSize: 14,
      cursorStyle: 'block',
      cursorBlink: true
    };
  });

  // Save settings
  useEffect(() => {
    localStorage.setItem('cterm_settings', JSON.stringify(settings));
  }, [settings]);

  // Load workspaces from backend database on login or startup
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const loadWorkspacesFromBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/workspaces`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('cterm_auth_token') || ''}`
          }
        });
        if (response.status === 401) {
          handleLogout();
          return;
        }
        if (response.ok) {
          const data = await response.json();
          if (data.workspaces && data.workspaces.length > 0) {
            const migrated = data.workspaces.map(w => w.createdAt ? w : { ...w, createdAt: new Date().toISOString() });
            setWorkspaces(migrated);
            setActiveWorkspaceId(data.activeWorkspaceId);
          }
          setIsWorkspacesLoaded(true);
        }
      } catch (e) {
        console.error('Failed to fetch workspaces from backend:', e);
      }
    };
    loadWorkspacesFromBackend();
  }, [isAuthenticated]);

  // Save workspaces to backend database whenever changes occur
  useEffect(() => {
    if (!isAuthenticated || !isWorkspacesLoaded) return;

    const saveWorkspacesToBackend = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/workspaces`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('cterm_auth_token') || ''}`
          },
          body: JSON.stringify({ workspaces, activeWorkspaceId })
        });
        if (response.status === 401) {
          handleLogout();
        }
      } catch (e) {
        console.error('Failed to save workspaces to backend:', e);
      }
    };

    saveWorkspacesToBackend();
  }, [workspaces, activeWorkspaceId, isAuthenticated, isWorkspacesLoaded]);

  // Get active workspace node structure
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  // --- Backend API Integration ---
  
  const spawnBackendSession = async (targetServerUrl, targetServerToken) => {
    const serverUrl = targetServerUrl || BACKEND_URL;
    const token = targetServerToken || sessionStorage.getItem('cterm_auth_token') || '';
    
    try {
      const response = await fetch(`${serverUrl}/api/terminals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cols: 80, rows: 24 })
      });
      if (response.status === 401 && !targetServerUrl) {
        handleLogout();
        return genId('fallback-session');
      }
      if (response.ok) {
        const data = await response.json();
        return data.sessionId;
      }
    } catch (e) {
      console.error('Failed to spawn backend session:', e);
    }
    // Fallback ID if server is offline (will show connection error in UI)
    return genId('fallback-session');
  };

  const terminateBackendSession = async (sessionId, targetServerUrl, targetServerToken) => {
    // Clean up local cache
    sessionManager.closeSession(sessionId);
    // Terminate on backend
    const serverUrl = targetServerUrl || BACKEND_URL;
    const token = targetServerToken || sessionStorage.getItem('cterm_auth_token') || '';
    
    try {
      const response = await fetch(`${serverUrl}/api/terminals/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401 && !targetServerUrl) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to terminate session on backend:', e);
    }
  };

  // --- Workspace Management ---

  const createWorkspace = async (name = 'New Workspace', serverUrl = '', token = '') => {
    const sessionId = await spawnBackendSession(serverUrl, token);
    const workspaceId = genId('ws');
    
    const newWorkspace = {
      id: workspaceId,
      name,
      terminalServer: serverUrl,
      terminalServerToken: token,
      layout: {
        id: genId('pane'),
        type: 'terminal',
        sessionId: sessionId,
        title: getMixedName()
      },
      activeSessionId: sessionId,
      createdAt: new Date().toISOString()
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(workspaceId);
  };

  const closeWorkspace = (workspaceId, e = null) => {
    if (e) e.stopPropagation();
    
    // Find all session IDs inside this workspace to terminate them
    const workspaceToClose = workspaces.find(w => w.id === workspaceId);
    if (workspaceToClose) {
      const sessionIds = [];
      const traverse = (node) => {
        if (node.type === 'terminal') {
          sessionIds.push(node.sessionId);
        } else if (node.type === 'split') {
          traverse(node.children[0]);
          traverse(node.children[1]);
        }
      };
      traverse(workspaceToClose.layout);
      
      // Terminate all processes
      sessionIds.forEach(id => terminateBackendSession(id, workspaceToClose.terminalServer, workspaceToClose.terminalServerToken));
    }

    setWorkspaces(prev => {
      const filtered = prev.filter(w => w.id !== workspaceId);
      if (activeWorkspaceId === workspaceId && filtered.length > 0) {
        setActiveWorkspaceId(filtered[filtered.length - 1].id);
      } else if (filtered.length === 0) {
        setActiveWorkspaceId(null);
      }
      return filtered;
    });
  };

  const startRenameWorkspace = (id, name, e) => {
    e.stopPropagation();
    setEditingWorkspaceId(id);
    setEditingWorkspaceText(name);
  };

  const saveRenameWorkspace = (id) => {
    if (editingWorkspaceText.trim()) {
      setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, name: editingWorkspaceText.trim() } : w));
    }
    setEditingWorkspaceId(null);
  };

  // --- Recursive Layout Tree Mutators ---

  const updateActiveWorkspaceLayout = (layoutMutator, activeSessionIdMutator = null) => {
    setWorkspaces(prev => prev.map(w => {
      if (w.id !== activeWorkspaceId) return w;
      
      const newLayout = layoutMutator(w.layout);
      let newActiveSessionId = w.activeSessionId;
      if (activeSessionIdMutator) {
        newActiveSessionId = activeSessionIdMutator(w.activeSessionId, newLayout);
      }
      
      return {
        ...w,
        layout: newLayout,
        activeSessionId: newActiveSessionId
      };
    }));
  };

  // 1. Split Pane
  const handleSplit = async (targetPaneId, direction) => {
    const ws = activeWorkspace;
    const serverUrl = ws ? ws.terminalServer : null;
    const serverToken = ws ? ws.terminalServerToken : null;
    const newSessionId = await spawnBackendSession(serverUrl, serverToken);
    
    const splitMutator = (node) => {
      if (node.type === 'terminal' && node.id === targetPaneId) {
        return {
          id: genId('split'),
          type: 'split',
          direction,
          sizes: [50, 50],
          children: [
            { id: genId('pane'), type: 'terminal', sessionId: node.sessionId, title: node.title || getMixedName() },
            { id: genId('pane'), type: 'terminal', sessionId: newSessionId, title: getMixedName() }
          ]
        };
      }
      if (node.type === 'split') {
        return {
          ...node,
          children: [
            splitMutator(node.children[0]),
            splitMutator(node.children[1])
          ]
        };
      }
      return node;
    };

    updateActiveWorkspaceLayout(splitMutator, () => newSessionId);
  };

  // 2. Close Pane
  const handleClosePane = async (targetPaneId, sessionId) => {
    // Terminate backend process
    const ws = activeWorkspace;
    const serverUrl = ws ? ws.terminalServer : null;
    const serverToken = ws ? ws.terminalServerToken : null;
    await terminateBackendSession(sessionId, serverUrl, serverToken);

    const closeMutator = (node) => {
      if (node.id === targetPaneId) return null; // shouldn't happen unless root

      if (node.type === 'split') {
        if (node.children[0].id === targetPaneId) {
          return node.children[1];
        }
        if (node.children[1].id === targetPaneId) {
          return node.children[0];
        }

        return {
          ...node,
          children: [
            closeMutator(node.children[0]),
            closeMutator(node.children[1])
          ]
        };
      }
      return node;
    };

    updateActiveWorkspaceLayout(closeMutator, (currentActive, newLayout) => {
      if (currentActive === sessionId) {
        // Find any remaining terminal session to focus
        let fallbackSessionId = null;
        const findFirst = (n) => {
          if (n.type === 'terminal') {
            fallbackSessionId = n.sessionId;
          } else {
            findFirst(n.children[0]);
          }
        };
        findFirst(newLayout);
        return fallbackSessionId;
      }
      return currentActive;
    });
  };

  // 3. Resize Pane Divider
  const handleResize = (splitNodeId, percentage) => {
    const resizeMutator = (node) => {
      if (node.type === 'split') {
        if (node.id === splitNodeId) {
          return {
            ...node,
            sizes: [percentage, 100 - percentage]
          };
        }
        return {
          ...node,
          children: [
            resizeMutator(node.children[0]),
            resizeMutator(node.children[1])
          ]
        };
      }
      return node;
    };

    updateActiveWorkspaceLayout(resizeMutator);
  };

  // 4. Swap Panes (Drag & Drop)
  const handleSwap = (sourceSessionId, targetSessionId) => {
    let sourceTitle = '';
    let targetTitle = '';

    const findTitles = (node) => {
      if (!node) return;
      if (node.type === 'terminal') {
        if (node.sessionId === sourceSessionId) sourceTitle = node.title;
        if (node.sessionId === targetSessionId) targetTitle = node.title;
      } else if (node.type === 'split' && node.children) {
        findTitles(node.children[0]);
        findTitles(node.children[1]);
      }
    };

    if (activeWorkspace && activeWorkspace.layout) {
      findTitles(activeWorkspace.layout);
    }

    const swapMutator = (node) => {
      if (node.type === 'terminal') {
        if (node.sessionId === sourceSessionId) {
          return { ...node, sessionId: targetSessionId, title: targetTitle };
        }
        if (node.sessionId === targetSessionId) {
          return { ...node, sessionId: sourceSessionId, title: sourceTitle };
        }
        return node;
      }
      if (node.type === 'split') {
        return {
          ...node,
          children: [
            swapMutator(node.children[0]),
            swapMutator(node.children[1])
          ]
        };
      }
      return node;
    };

    updateActiveWorkspaceLayout(swapMutator);
  };

  // 5. Rename Pane
  const handleRenamePane = (paneId, newTitle) => {
    const renameMutator = (node) => {
      if (node.type === 'terminal' && node.id === paneId) {
        return {
          ...node,
          title: newTitle
        };
      }
      if (node.type === 'split') {
        return {
          ...node,
          children: [
            renameMutator(node.children[0]),
            renameMutator(node.children[1])
          ]
        };
      }
      return node;
    };
    updateActiveWorkspaceLayout(renameMutator);
  };

  const handleSetActiveSession = (sessionId) => {
    setWorkspaces(prev => prev.map(w => w.id === activeWorkspaceId ? { ...w, activeSessionId: sessionId } : w));
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={(token) => {
      sessionStorage.setItem('cterm_auth_token', token);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(circle at 10% 20%, rgb(9, 10, 15) 0%, rgb(18, 20, 30) 90%)',
      overflow: 'hidden',
    }}>

      {/* Left Sidebar Panel */}
      <aside style={{
        width: isSidebarCollapsed ? '0px' : '280px',
        opacity: isSidebarCollapsed ? 0 : 1,
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: isSidebarCollapsed ? 'none' : '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
        userSelect: 'none',
        zIndex: 10,
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, border-right 0.25s ease'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0 0 15px var(--color-primary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TerminalIcon size={20} style={{ color: '#ffffff' }} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              margin: 0,
              background: 'linear-gradient(135deg, #ffffff 30%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>cTerm Workspace</h1>
          </div>
          
          {/* Collapse Sidebar Trigger */}
          <button
            onClick={() => setIsSidebarCollapsed(true)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'var(--transition-smooth)'
            }}
            className="hover-icon"
            title="Collapse Sidebar"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* Workspaces Section */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '8px',
            paddingRight: '8px'
          }}>
            <span style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FolderOpen size={12} />
              Workspaces
            </span>
            
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                background: 'var(--color-primary-glow)',
                border: '1px solid',
                borderColor: workspaces.length === 0 ? 'var(--color-primary)' : 'var(--color-border-active)',
                borderRadius: '6px',
                padding: '4px 8px',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: workspaces.length === 0 ? '0 0 15px var(--color-primary-glow)' : 'none',
                animation: workspaces.length === 0 ? 'pulse-glow 2s infinite' : 'none'
              }}
              className="hover-glow"
            >
              <Plus size={12} />
              New
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {workspaces.map((workspace) => {
              const isActive = workspace.id === activeWorkspaceId;
              const isEditing = editingWorkspaceId === workspace.id;
              const isExpanded = !!expandedWorkspaceIds[workspace.id];

              return (
                <div 
                  key={workspace.id}
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--bg-active-tab)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-border-active)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition-smooth)',
                    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'
                  }}
                  onClick={() => !isEditing && setActiveWorkspaceId(workspace.id)}
                  className="tab-item"
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    width: '100%'
                  }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="text" 
                          value={editingWorkspaceText}
                          onChange={(e) => setEditingWorkspaceText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRenameWorkspace(workspace.id);
                            if (e.key === 'Escape') setEditingWorkspaceId(null);
                          }}
                          autoFocus
                          style={{
                            flex: 1,
                            background: '#090a0f',
                            border: '1px solid var(--color-primary)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            color: '#ffffff',
                            fontSize: '13px',
                            outline: 'none',
                            fontFamily: 'var(--font-sans)'
                          }}
                        />
                        <button 
                          onClick={() => saveRenameWorkspace(workspace.id)}
                          style={{
                            background: 'none', border: 'none', color: '#27c93f', cursor: 'pointer', display: 'flex', alignItems: 'center'
                          }}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', flex: 1 }}>
                          <button 
                            onClick={(e) => toggleWorkspaceExpand(workspace.id, e)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0.8,
                              transition: 'transform 0.2s ease',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                            }}
                            title={isExpanded ? "Collapse details" : "Expand details"}
                          >
                            <ChevronRight size={14} />
                          </button>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', flex: 1 }}
                            onDoubleClick={(e) => startRenameWorkspace(workspace.id, workspace.name, e)}
                          >
                            {workspace.terminalServer ? (
                              <Server size={13} style={{ color: 'var(--color-accent)', minWidth: '13px' }} title="Remote Workspace" />
                            ) : (
                              <Monitor size={13} style={{ color: '#c084fc', minWidth: '13px' }} title="Local Workspace" />
                            )}
                            <span style={{
                              fontSize: '13px',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? '#ffffff' : 'var(--color-text-main)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {workspace.name}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="tab-actions">
                          <button 
                            onClick={(e) => startRenameWorkspace(workspace.id, workspace.name, e)}
                            style={{
                              background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', opacity: 0.6
                            }}
                            className="hover-icon"
                            title="Rename workspace"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(workspace.id, workspace.name, e)}
                            style={{
                              background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', opacity: 0.6
                            }}
                            className="hover-icon"
                            title="Close workspace"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {isExpanded && !isEditing && (
                    <div 
                      style={{
                        padding: '0px 12px 10px 32px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                        paddingTop: '8px',
                        cursor: 'default',
                        animation: 'fadeIn 0.2s ease-out'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Created:</span>
                        <span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>
                          {workspace.createdAt 
                            ? new Date(workspace.createdAt).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : 'N/A'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Target Server:</span>
                        <span 
                          style={{ 
                            color: 'var(--color-text-main)', 
                            fontWeight: 500,
                            maxWidth: '140px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} 
                          title={workspace.terminalServer || 'Default (Local)'}
                        >
                          {workspace.terminalServer || 'Default (Local)'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Active Terminals:</span>
                        <span style={{
                          color: '#c084fc',
                          fontWeight: 600,
                          backgroundColor: 'rgba(192, 132, 252, 0.12)',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontSize: '10px'
                        }}>
                          {countTerminals(workspace.layout)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Settings Panel */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: isPreferencesCollapsed ? '0px' : '12px',
          backgroundColor: 'rgba(0,0,0,0.15)',
          transition: 'gap 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          <div 
            onClick={() => setIsPreferencesCollapsed(!isPreferencesCollapsed)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              userSelect: 'none',
              padding: '4px 0'
            }}
          >
            <span style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sliders size={12} />
              Preferences
            </span>
            <div style={{ 
              color: 'var(--color-text-muted)', 
              display: 'flex', 
              alignItems: 'center',
              transition: 'transform 0.3s ease',
              transform: isPreferencesCollapsed ? 'rotate(0deg)' : 'rotate(180deg)'
            }}>
              <ChevronUp size={14} />
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px', 
            maxHeight: isPreferencesCollapsed ? '0px' : '400px',
            opacity: isPreferencesCollapsed ? 0 : 1,
            overflow: 'hidden',
            transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, padding 0.3s ease',
            paddingTop: isPreferencesCollapsed ? '0px' : '6px'
          }}>
            {/* Theme */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Palette size={10} />
                Theme
              </label>
              <select 
                value={settings.theme} 
                onChange={(e) => setSettings({...settings, theme: e.target.value})}
                style={{
                  backgroundColor: '#090a0f', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px 8px', color: 'var(--color-text-main)', fontSize: '12px', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)'
                }}
              >
                <option value="dracula">Dracula (Classic)</option>
                <option value="nord">Nord (Frosty Dark)</option>
                <option value="cyberpunk">Cyberpunk (Neon)</option>
                <option value="oneDark">One Dark</option>
                <option value="light">GitHub Light</option>
              </select>
            </div>

            {/* Font Size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Type size={10} />
                Font Size
              </label>
              <select 
                value={settings.fontSize} 
                onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                style={{
                  backgroundColor: '#090a0f', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px 8px', color: 'var(--color-text-main)', fontSize: '12px', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)'
                }}
              >
                <option value="12">12px</option>
                <option value="13">13px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
              </select>
            </div>

            {/* Cursor */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <label style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Cursor Style</label>
                <select 
                  value={settings.cursorStyle} 
                  onChange={(e) => setSettings({...settings, cursorStyle: e.target.value})}
                  style={{
                    backgroundColor: '#090a0f', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '6px 8px', color: 'var(--color-text-main)', fontSize: '12px', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)'
                  }}
                >
                  <option value="block">Block</option>
                  <option value="underline">Underline</option>
                  <option value="bar">Bar</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'flex-end', paddingBottom: '6px' }}>
                <label style={{ 
                  fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none'
                }}>
                  <input 
                    type="checkbox" 
                    checked={settings.cursorBlink}
                    onChange={(e) => setSettings({...settings, cursorBlink: e.target.checked})}
                    style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  Blink
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Logout */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '16px',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.05)',
              color: '#f87171',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
            className="logout-btn"
            title="Sign out of cterm"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0c0d12',
        position: 'relative',
        padding: '16px',
        overflow: 'scroll'
      }}>
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            style={{
              position: 'absolute',
              left: '0px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 40,
              backgroundColor: 'var(--bg-sidebar)',
              border: '1px solid var(--color-border)',
              borderLeft: 'none',
              borderRadius: '0 8px 8px 0',
              padding: '12px 4px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '4px 0 10px rgba(0,0,0,0.3)',
              transition: 'var(--transition-smooth)'
            }}
            className="hover-glow"
            title="Expand Sidebar"
          >
            <PanelLeftOpen size={14} />
          </button>
        )}
        {activeWorkspace ? (
          /* Recursive pane layout render */
          <div style={{ flex: 1, width: '100%', height: '100%', overflow: 'hidden' }}>
            <PaneLayout
              node={activeWorkspace.layout}
              settings={settings}
              activeSessionId={activeWorkspace.activeSessionId}
              onSetActive={handleSetActiveSession}
              onSplit={handleSplit}
              onClosePane={handleClosePane}
              onResize={handleResize}
              onSwap={handleSwap}
              terminalServer={activeWorkspace.terminalServer}
              terminalServerToken={activeWorkspace.terminalServerToken}
              onRenamePane={handleRenamePane}
              isSinglePane={activeWorkspace.layout.type === 'terminal'}
            />
          </div>
        ) : (
          /* Empty Workspace state */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            color: 'var(--color-text-muted)',
            height: '100%'
          }}>
            <Activity size={48} className="text-primary animate-pulse" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>No active workspaces</h3>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #a78bfa 100%)', border: 'none', borderRadius: '8px', padding: '10px 20px', color: '#ffffff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(124, 77, 255, 0.4)', transition: 'var(--transition-smooth)'
              }}
              className="hover-scale"
            >
              Create Workspace
            </button>
          </div>
        )}
      </main>

      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(9, 10, 15, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{
            background: 'rgba(18, 20, 30, 0.85)',
            border: '1px solid var(--color-border-active)',
            borderRadius: '12px',
            padding: '24px',
            width: '400px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px var(--color-primary-glow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Create Workspace
              </h3>
              <button 
                onClick={handleCloseCreateModal}
                disabled={createWorkspaceLoading}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {createWorkspaceError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#f87171',
                fontSize: '12px',
                lineHeight: '1.4'
              }}>
                {createWorkspaceError}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Workspace Name</label>
              <input 
                type="text" 
                value={createWorkspaceName}
                onChange={(e) => setCreateWorkspaceName(e.target.value)}
                placeholder="e.g. My Workspace"
                autoFocus
                disabled={createWorkspaceLoading}
                style={{
                  background: '#090a0f',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  opacity: createWorkspaceLoading ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Terminal Server URL (Optional)</label>
              <input 
                type="text" 
                value={createWorkspaceServer}
                onChange={(e) => setCreateWorkspaceServer(e.target.value)}
                placeholder="http://localhost:3001"
                disabled={createWorkspaceLoading}
                style={{
                  background: '#090a0f',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  opacity: createWorkspaceLoading ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Server Secret / Token (Optional)</label>
              <input 
                type="password" 
                value={createWorkspaceToken}
                onChange={(e) => setCreateWorkspaceToken(e.target.value)}
                placeholder="Token secret"
                disabled={createWorkspaceLoading}
                style={{
                  background: '#090a0f',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  opacity: createWorkspaceLoading ? 0.6 : 1
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button 
                onClick={handleCloseCreateModal}
                disabled={createWorkspaceLoading}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  color: 'var(--color-text-muted)',
                  fontSize: '12px',
                  cursor: createWorkspaceLoading ? 'not-allowed' : 'pointer',
                  opacity: createWorkspaceLoading ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmCreateWorkspace}
                disabled={createWorkspaceLoading}
                style={{
                  background: createWorkspaceLoading 
                    ? 'var(--color-border)' 
                    : 'linear-gradient(135deg, var(--color-primary) 0%, #a78bfa 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: createWorkspaceLoading ? 'not-allowed' : 'pointer',
                  boxShadow: createWorkspaceLoading ? 'none' : '0 4px 15px rgba(124, 77, 255, 0.4)',
                  opacity: createWorkspaceLoading ? 0.8 : 1
                }}
              >
                {createWorkspaceLoading ? 'Validating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(9, 10, 15, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <div style={{
            background: 'rgba(18, 20, 30, 0.85)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            padding: '24px',
            width: '360px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(239, 68, 68, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff', margin: 0 }}>
                Delete Workspace
              </h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-main)', margin: 0, lineHeight: '1.5' }}>
              Are you sure you want to delete workspace <strong style={{ color: '#ef4444' }}>{workspaceToDeleteName}</strong>? This will terminate all active terminal sessions in this workspace.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  color: 'var(--color-text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDeleteWorkspace}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX */}
      <style>{`
        .tab-item:hover {
          background-color: var(--bg-hover-tab);
          border-color: rgba(255, 255, 255, 0.05);
        }
        .tab-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .tab-item:hover .tab-actions {
          opacity: 1;
        }
        .hover-icon:hover {
          opacity: 1 !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .hover-glow:hover {
          box-shadow: 0 0 10px rgba(124, 77, 255, 0.4);
          background-color: rgba(124, 77, 255, 0.25) !important;
        }
        .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.15) !important;
          border-color: rgba(239, 68, 68, 0.4) !important;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
          color: #ef4444 !important;
        }
        .hover-scale:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 77, 255, 0.5);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0% {
            box-shadow: 0 0 5px rgba(167, 139, 250, 0.4);
            border-color: var(--color-border-active);
          }
          50% {
            box-shadow: 0 0 15px rgba(167, 139, 250, 0.8), 0 0 5px var(--color-primary);
            border-color: var(--color-primary);
          }
          100% {
            box-shadow: 0 0 5px rgba(167, 139, 250, 0.4);
            border-color: var(--color-border-active);
          }
        }
      `}</style>
    </div>
  );
}
