import React, { useRef, useState } from 'react';
import TerminalInstance from './TerminalInstance';

export default function PaneLayout({ 
  node, 
  settings, 
  activeSessionId, 
  onSetActive,
  onSplit, 
  onClosePane, 
  onResize, 
  onSwap,
  isSinglePane,
  onRenamePane
}) {
  const containerRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // --- Rendering split pane node ---
  if (node.type === 'split') {
    const isHorizontal = node.direction === 'horizontal';
    
    // MouseDown handler for the resizer bar
    const handleMouseDown = (e) => {
      e.preventDefault();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      const handleMouseMove = (moveEvent) => {
        let newPercentage;
        if (isHorizontal) {
          const offsetX = moveEvent.clientX - rect.left;
          newPercentage = (offsetX / rect.width) * 100;
        } else {
          const offsetY = moveEvent.clientY - rect.top;
          newPercentage = (offsetY / rect.height) * 100;
        }
        
        // Clamp split percentage to prevent collapsing panes entirely
        newPercentage = Math.max(10, Math.min(90, newPercentage));
        onResize(node.id, newPercentage);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
        
        // Trigger window resize event to force xterm.js fit addon execution
        window.dispatchEvent(new Event('resize'));
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
    };

    const firstSize = node.sizes[0];
    const secondSize = node.sizes[1];

    return (
      <div 
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        {/* First Child Pane */}
        <div style={{ flex: `${firstSize} 1 0%`, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
          <PaneLayout 
            node={node.children[0]} 
            settings={settings}
            activeSessionId={activeSessionId}
            onSetActive={onSetActive}
            onSplit={onSplit}
            onClosePane={onClosePane}
            onResize={onResize}
            onSwap={onSwap}
            onRenamePane={onRenamePane}
            isSinglePane={false}
          />
        </div>

        {/* Resizer Splitter Bar */}
        <div 
          onMouseDown={handleMouseDown}
          style={{
            width: isHorizontal ? '6px' : '100%',
            height: isHorizontal ? '100%' : '6px',
            cursor: isHorizontal ? 'col-resize' : 'row-resize',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 5,
            transition: 'background-color 0.2s ease',
          }}
          className="splitter-bar"
        />

        {/* Second Child Pane */}
        <div style={{ flex: `${secondSize} 1 0%`, overflow: 'hidden', minWidth: 0, minHeight: 0 }}>
          <PaneLayout 
            node={node.children[1]} 
            settings={settings}
            activeSessionId={activeSessionId}
            onSetActive={onSetActive}
            onSplit={onSplit}
            onClosePane={onClosePane}
            onResize={onResize}
            onSwap={onSwap}
            onRenamePane={onRenamePane}
            isSinglePane={false}
          />
        </div>

        <style>{`
          .splitter-bar:hover, .splitter-bar:active {
            background-color: var(--color-primary) !important;
            box-shadow: 0 0 10px var(--color-primary);
          }
        `}</style>
      </div>
    );
  }

  // --- Rendering terminal leaf node ---
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const srcSessionId = e.dataTransfer.getData('text/plain');
    if (srcSessionId && srcSessionId !== node.sessionId) {
      onSwap(srcSessionId, node.sessionId);
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        padding: '2px',
        overflow: 'hidden'
      }}
      onMouseDownCapture={() => onSetActive(node.sessionId)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <TerminalInstance
        sessionId={node.sessionId}
        active={node.sessionId === activeSessionId}
        settings={settings}
        onClose={() => onClosePane(node.id, node.sessionId)}
        onSplitHorizontal={() => onSplit(node.id, 'horizontal')}
        onSplitVertical={() => onSplit(node.id, 'vertical')}
        canClose={!isSinglePane}
        onSetActive={onSetActive}
        title={node.title || 'Terminal'}
        onRename={(newTitle) => onRenamePane(node.id, newTitle)}
      />

      {/* Drag-over indicator overlay */}
      {isDragOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(124, 77, 255, 0.25)',
          border: '2px dashed var(--color-primary)',
          borderRadius: '8px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '14px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          Swap Shell Locations
        </div>
      )}
    </div>
  );
}
