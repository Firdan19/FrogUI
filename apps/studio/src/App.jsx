import React, { useState } from 'react';
import FlowVisualizer from './components/FlowVisualizer';
import '@xyflow/react/dist/style.css';

function App() {
  const [gatewayUrl] = useState('http://localhost:3001');

  return (
    <main className="studio-shell">
      <section className="studio-command-surface">
        <frog-status-indicator label="Private Runtime"></frog-status-indicator>
        <frog-command-panel gateway-url={gatewayUrl}></frog-command-panel>
      </section>

      <section className="studio-stream-surface" style={{ padding: 0, overflow: 'hidden' }}>
        <FlowVisualizer gatewayUrl={gatewayUrl} />
      </section>
    </main>
  );
}

export default App;
