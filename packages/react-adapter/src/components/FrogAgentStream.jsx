import '@frogui/ui-core';
import React from 'react';

export function FrogAgentStream({ gatewayUrl }) {
  return <frog-agent-stream gateway-url={gatewayUrl ?? ''} />;
}

