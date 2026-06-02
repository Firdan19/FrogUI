import '@frogui/ui-core';
import React from 'react';

export function FrogCommandPanel({ gatewayUrl, onCommand }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || !onCommand) {
      return undefined;
    }

    const handler = (event) => onCommand(event.detail);
    element.addEventListener('frog-command', handler);
    return () => element.removeEventListener('frog-command', handler);
  }, [onCommand]);

  return <frog-command-panel ref={ref} gateway-url={gatewayUrl ?? ''} />;
}

