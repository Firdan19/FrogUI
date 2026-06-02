import React from 'react';
import { FrogAgentStream, FrogCommandPanel } from '@frogui/react-adapter';

export function App() {
  const gatewayUrl = 'http://localhost:3001';

  return (
    <main>
      <FrogCommandPanel gatewayUrl={gatewayUrl} />
      <FrogAgentStream gatewayUrl={gatewayUrl} />
    </main>
  );
}

