import React, { useState, useRef, useEffect } from 'react';
import FlowVisualizer from './components/FlowVisualizer';
import '@xyflow/react/dist/style.css';

function App() {
  const [gatewayUrl] = useState('http://localhost:3001');
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRun = async (e) => {
    if (e) e.preventDefault();
    if (!command.trim() || isRunning) return;
    
    setIsRunning(true);
    setLogs([]);
    
    try {
      const response = await fetch(`${gatewayUrl}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: command.trim() }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      
      const task = await response.json();
      window.dispatchEvent(new CustomEvent('frogui:task-created', { detail: task }));
      
      // We will listen to stdout for logs in this component too
      const es = new EventSource(`${gatewayUrl}${task.stream_url}`);
      es.addEventListener('stdout', (e) => {
        const payload = JSON.parse(e.data);
        setLogs(prev => [...prev, payload.content]);
      });
      es.addEventListener('exit', () => {
        es.close();
        setIsRunning(false);
      });
      es.onerror = () => {
        es.close();
        setIsRunning(false);
      };
      
      // store it to close later if user clicks stop
      window.__currentStream = es;
      
    } catch (err) {
      setLogs(prev => [...prev, `Error: ${err.message}`]);
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    if (window.__currentStream) {
      window.__currentStream.close();
      window.__currentStream = null;
    }
    setIsRunning(false);
    window.dispatchEvent(new CustomEvent('frogui:task-stop'));
  };

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="topbar-left">
          <span className="logo-icon" style={{ fontSize: '26px', lineHeight: 1 }}>🐸</span>
          <strong style={{
            color: 'var(--frog-color-brass)', 
            letterSpacing: '1.5px', 
            fontSize: '16px',
            fontFamily: 'var(--frog-font-sans)',
            fontWeight: 700
          }}>FROGUI</strong>
        </div>
        <div className="topbar-center" style={{ 
          position: 'absolute', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          fontWeight: '500', 
          color: 'rgba(242, 238, 229, 0.9)',
          fontSize: '14px',
          letterSpacing: '0.5px'
        }}>
          FrogUI Agent Workspace
        </div>
        <div className="topbar-right">
          <span style={{ 
            color: 'var(--frog-color-olive)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            <span style={{ fontSize: '10px' }}>●</span> Active
          </span>
        </div>
      </header>

      <div className="main-content">
        <section className="canvas-area">
          <FlowVisualizer gatewayUrl={gatewayUrl} />
          <div className="floating-controls">
            <button 
              className={`btn-toggle ${!isRunning ? 'active-run' : ''}`} 
              onClick={handleRun} 
              disabled={isRunning}
              title="Run Agent"
            >
              <span className="material-icons-round">play_arrow</span>
            </button>
            <button 
              className={`btn-toggle ${isRunning ? 'active-stop' : ''}`} 
              onClick={handleStop} 
              disabled={!isRunning}
              title="Stop Agent"
            >
              <span className="material-icons-round">stop</span>
            </button>
          </div>
        </section>
        
        <section className="bottom-panel">
          <div className="pane pane-left">
            <div className="pane-header">Chat Input</div>
            <div className="pane-content">
              Enter a prompt below to see the visual workflow execution.
            </div>
            <div className="chat-input-wrapper">
              <form onSubmit={handleRun}>
                <input 
                  type="text" 
                  className="chat-input" 
                  placeholder="Type a message, or press 'up' arrow for previous one"
                  value={command}
                  onChange={e => setCommand(e.target.value)}
                  disabled={isRunning}
                />
              </form>
            </div>
          </div>
          
          <div className="pane pane-right">
            <div className="pane-header">Latest Logs from Agent</div>
            <div className="pane-content" style={{ whiteSpace: 'pre-wrap' }}>
              {logs.length === 0 ? <span style={{opacity: 0.5}}>Waiting for execution...</span> : null}
              {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
