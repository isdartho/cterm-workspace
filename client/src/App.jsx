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
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import PaneLayout from './components/PaneLayout';
import { sessionManager } from './services/TerminalSessionManager';

const isDev = window.location.port !== '';
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '3001';
const BACKEND_URL = isDev ? `${window.location.protocol}//${window.location.hostname}:${BACKEND_PORT}` : window.location.origin;

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

  const handleLogout = () => {
    sessionStorage.removeItem('cterm_auth_token');
    setIsAuthenticated(false);
  };

  // Trigger terminal refit on sidebar transition completion
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 260); // slightly longer than width transition
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed]);

  const [workspaces, setWorkspaces] = useState(() => {
    const saved = localStorage.getItem('cterm_workspaces');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.workspaces || [];
      } catch (e) {
        console.error('Failed to parse saved workspaces:', e);
      }
    }
    return [];
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    const saved = localStorage.getItem('cterm_workspaces');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.activeWorkspaceId || null;
      } catch (e) {
        console.error('Failed to parse saved activeWorkspaceId:', e);
      }
    }
    return null;
  });
  
  // Custom workspace renaming state
  const [editingWorkspaceId, setEditingWorkspaceId] = useState(null);
  const [editingWorkspaceText, setEditingWorkspaceText] = useState('');

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

  // Load workspaces from localStorage or initialize
  useEffect(() => {
    const loadWorkspaces = async () => {
      const saved = localStorage.getItem('cterm_workspaces');
      if (!saved) {
        // Create initial workspace with a new terminal session
        await createWorkspace('Default Workspace');
      }
    };
    loadWorkspaces();
  }, []);

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    if (workspaces.length > 0) {
      localStorage.setItem('cterm_workspaces', JSON.stringify({
        workspaces,
        activeWorkspaceId
      }));
    } else {
      localStorage.removeItem('cterm_workspaces');
    }
  }, [workspaces, activeWorkspaceId]);

  // Get active workspace node structure
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);

  // --- Backend API Integration ---
  
  const spawnBackendSession = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/terminals`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('cterm_auth_token') || ''}`
        },
        body: JSON.stringify({ cols: 80, rows: 24 })
      });
      if (response.status === 401) {
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

  const terminateBackendSession = async (sessionId) => {
    // Clean up local cache
    sessionManager.closeSession(sessionId);
    // Terminate on backend
    try {
      const response = await fetch(`${BACKEND_URL}/api/terminals/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('cterm_auth_token') || ''}`
        }
      });
      if (response.status === 401) {
        handleLogout();
      }
    } catch (e) {
      console.error('Failed to terminate session on backend:', e);
    }
  };

  // --- Workspace Management ---

  const createWorkspace = async (name = 'New Workspace') => {
    const sessionId = await spawnBackendSession();
    const workspaceId = genId('ws');
    
    const newWorkspace = {
      id: workspaceId,
      name,
      layout: {
        id: genId('pane'),
        type: 'terminal',
        sessionId: sessionId,
        title: 'Terminal'
      },
      activeSessionId: sessionId
    };

    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(workspaceId);
  };

  const closeWorkspace = (workspaceId, e) => {
    e.stopPropagation();
    
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
      sessionIds.forEach(id => terminateBackendSession(id));
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
    const newSessionId = await spawnBackendSession();
    
    const splitMutator = (node) => {
      if (node.type === 'terminal' && node.id === targetPaneId) {
        return {
          id: genId('split'),
          type: 'split',
          direction,
          sizes: [50, 50],
          children: [
            { id: genId('pane'), type: 'terminal', sessionId: node.sessionId, title: node.title || 'Terminal' },
            { id: genId('pane'), type: 'terminal', sessionId: newSessionId, title: 'Terminal Split' }
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
    await terminateBackendSession(sessionId);

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
    const swapMutator = (node) => {
      if (node.type === 'terminal') {
        if (node.sessionId === sourceSessionId) {
          return { ...node, sessionId: targetSessionId };
        }
        if (node.sessionId === targetSessionId) {
          return { ...node, sessionId: sourceSessionId };
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
              onClick={() => createWorkspace()}
              style={{
                background: 'var(--color-primary-glow)',
                border: '1px solid var(--color-border-active)',
                borderRadius: '6px',
                padding: '4px 8px',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
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

              return (
                <div 
                  key={workspace.id}
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--bg-active-tab)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--color-border-active)' : 'transparent',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'var(--transition-smooth)',
                    boxShadow: isActive ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'
                  }}
                  onClick={() => !isEditing && setActiveWorkspaceId(workspace.id)}
                  className="tab-item"
                >
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
                      <div 
                        style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', flex: 1 }}
                        onDoubleClick={(e) => startRenameWorkspace(workspace.id, workspace.name, e)}
                      >
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
                          onClick={(e) => closeWorkspace(workspace.id, e)}
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
          gap: '12px',
          backgroundColor: 'rgba(0,0,0,0.15)'
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
            <div style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
              {isPreferencesCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>

          {!isPreferencesCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeIn 0.2s ease' }}>
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
          )}
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
              onRenamePane={handleRenamePane}
              isSinglePane={activeWorkspace.layout.type === 'terminal'}
            />
          </div>
        ) : (
          /* Empty Workspace state */
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justify: 'center', gap: '16px', color: 'var(--color-text-muted)'
          }}>
            <Activity size={48} className="text-primary animate-pulse" />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#ffffff' }}>No active workspaces</h3>
            <button 
              onClick={() => createWorkspace()}
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
      `}</style>
    </div>
  );
}
