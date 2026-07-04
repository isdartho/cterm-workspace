import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { Terminal as TerminalIcon, Wifi, WifiOff, RefreshCw, SquareSplitHorizontal, SquareSplitVertical, X } from 'lucide-react';
import { THEMES } from '../services/TerminalSessionManager';

const BACKEND_WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const isDev = window.location.port !== '';
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '3001';
const BACKEND_WS_HOST = isDev ? `${window.location.hostname}:${BACKEND_PORT}` : window.location.host;

export default function TerminalInstance({ 
  sessionId, 
  active, 
  settings, 
  onClose,
  onSplitHorizontal,
  onSplitVertical,
  canClose = true,
  onSetActive,
  title,
  onRename
}) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleText, setEditingTitleText] = useState(title || 'Terminal');

  useEffect(() => {
    setEditingTitleText(title || 'Terminal');
  }, [title]);

  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);
  const wsRef = useRef(null);

  // Manage terminal and websocket lifecycle locally
  useEffect(() => {
    if (!containerRef.current) return;

    // Create a new Terminal instance
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

    // Bind terminal to container
    term.open(containerRef.current);
    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    // Trigger initial fit
    const timer = setTimeout(() => {
      try {
        fitAddon.fit();
        if (active) {
          term.focus();
        }
      } catch (e) {
        console.warn('Failed to fit terminal on mount:', e);
      }
    }, 50);

    // Setup WebSocket
    const token = sessionStorage.getItem('cterm_auth_token') || '';
    const wsUrl = `${BACKEND_WS_PROTOCOL}//${BACKEND_WS_HOST}/terminals/${sessionId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('connected');
      if (term.cols && term.rows) {
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
          setStatus('disconnected');
          term.write('\r\n\x1b[31m[Session terminated by remote host]\x1b[0m\r\n');
        } else if (msg.type === 'error') {
          setStatus('error');
          setErrorMessage(msg.message);
          term.write(`\r\n\x1b[31mError: ${msg.message}\x1b[0m\r\n`);
        }
      } catch (err) {
        term.write(event.data);
      }
    };

    ws.onclose = () => {
      setStatus(curr => curr === 'connected' ? 'disconnected' : curr);
    };

    ws.onerror = (err) => {
      console.error('WS Error:', err);
      setStatus('error');
      setErrorMessage('Failed to connect to terminal backend');
    };

    // Terminal data input handler
    const dataListener = term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'input', data }));
      }
    });

    // Terminal resize handler
    const resizeListener = term.onResize((size) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'resize',
          cols: size.cols,
          rows: size.rows
        }));
      }
    });

    // Cleanup: Dispose terminal and close socket
    return () => {
      clearTimeout(timer);
      dataListener.dispose();
      resizeListener.dispose();
      ws.close();
      term.dispose();
      terminalRef.current = null;
      wsRef.current = null;
      fitAddonRef.current = null;
    };
  }, [sessionId]);

  // Handle click to activate session using native capture listener
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onSetActive) return;

    const handleMouseDown = () => {
      if (onSetActive) {
        onSetActive(sessionId);
      }
    };

    // Listen in the capture phase (third arg: true) to intercept clicks before xterm blocks them
    el.addEventListener('mousedown', handleMouseDown, true);
    return () => {
      el.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [sessionId, onSetActive]);

  // Handle active states (focus)
  useEffect(() => {
    if (active && terminalRef.current && fitAddonRef.current) {
      const timer = setTimeout(() => {
        try {
          fitAddonRef.current.fit();
          terminalRef.current.focus();
        } catch (e) {}
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [active]);

  // Handle settings update
  useEffect(() => {
    const term = terminalRef.current;
    if (term) {
      term.options.fontSize = settings.fontSize;
      term.options.cursorBlink = settings.cursorBlink;
      term.options.cursorStyle = settings.cursorStyle;
      term.options.theme = THEMES[settings.theme] || THEMES.dracula;
      
      const timer = setTimeout(() => {
        try {
          fitAddonRef.current?.fit();
        } catch (e) {}
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  // Listen for window resizes
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch (e) {}
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sessionId);
  };

  return (
    <div 
      className={`terminal-pane ${active ? 'active' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        background: THEMES[settings.theme]?.background || '#181a23',
        borderRadius: '8px',
        overflow: 'hidden',
        border: active ? '1px solid var(--color-border-active)' : '1px solid var(--color-border)',
        boxShadow: active ? '0 0 15px var(--color-primary-glow)' : 'inset 0 4px 20px rgba(0, 0, 0, 0.4)',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Terminal Title Bar */}
      <div 
        className="terminal-header" 
        draggable
        onDragStart={handleDragStart}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          cursor: 'grab',
          userSelect: 'none',
          height: '38px',
        }}
      >
        {/* Title */}
        {isEditingTitle ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-sans)', fontWeight: 500 }} onClick={(e) => e.stopPropagation()}>
            <TerminalIcon size={13} className={active ? "text-primary" : ""} />
            <input 
              type="text" 
              value={editingTitleText}
              onChange={(e) => setEditingTitleText(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false);
                if (editingTitleText.trim() && editingTitleText.trim() !== title) {
                  onRename(editingTitleText.trim());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                  if (editingTitleText.trim() && editingTitleText.trim() !== title) {
                    onRename(editingTitleText.trim());
                  }
                }
                if (e.key === 'Escape') {
                  setIsEditingTitle(false);
                  setEditingTitleText(title);
                }
              }}
              autoFocus
              style={{
                background: '#090a0f',
                border: '1px solid var(--color-primary)',
                borderRadius: '4px',
                padding: '1px 6px',
                color: '#ffffff',
                fontSize: '11px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                width: '100px'
              }}
            />
          </div>
        ) : (
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: active ? '#ffffff' : 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', fontWeight: 500, cursor: 'text' }}
            onDoubleClick={() => setIsEditingTitle(true)}
            title="Double click to rename pane"
          >
            <TerminalIcon size={13} className={active ? "text-primary" : ""} />
            <span style={{ fontWeight: 600, color: active ? '#ffffff' : 'var(--color-text-main)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title || 'Terminal'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              ({sessionId.substring(0, 8)})
            </span>
            
            {status === 'connecting' && (
              <RefreshCw size={10} className="animate-spin" style={{ color: '#ffbd2e', animation: 'spin 1.5s linear infinite' }} />
            )}
            {status === 'connected' && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
            )}
            {status === 'disconnected' && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ff5f56' }} title="Disconnected" />
            )}
          </div>
        )}

        {/* Header Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={onSplitHorizontal}
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '3px', borderRadius: '4px', display: 'flex', alignItems: 'center', transition: 'var(--transition-smooth)'
            }}
            className="header-btn"
            title="Split Horizontally"
          >
            <SquareSplitHorizontal size={13} />
          </button>
          
          <button 
            onClick={onSplitVertical}
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '3px', borderRadius: '4px', display: 'flex', alignItems: 'center', transition: 'var(--transition-smooth)'
            }}
            className="header-btn"
            title="Split Vertically"
          >
            <SquareSplitVertical size={13} />
          </button>

          {canClose && (
            <button 
              onClick={onClose}
              style={{
                background: 'none', border: 'none', color: '#ff5f56', cursor: 'pointer', padding: '3px', borderRadius: '4px', display: 'flex', alignItems: 'center', transition: 'var(--transition-smooth)'
              }}
              className="header-btn close-btn"
              title="Close Pane"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Node mount */}
      <div 
        ref={containerRef} 
        style={{
          flex: 1,
          width: '100%',
          height: 'calc(100% - 38px)',
          overflow: 'hidden',
        }}
      />
      
      <style>{`
        .header-btn:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.08);
        }
        .header-btn.close-btn:hover {
          background-color: rgba(255, 95, 86, 0.15);
        }
        .terminal-header:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}
