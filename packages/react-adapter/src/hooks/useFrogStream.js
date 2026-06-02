import React from 'react';

export function useFrogStream({ gatewayUrl = '', streamUrl } = {}) {
  const [events, setEvents] = React.useState([]);
  const [status, setStatus] = React.useState('idle');

  React.useEffect(() => {
    if (!streamUrl) {
      return undefined;
    }

    setStatus('streaming');
    const source = new EventSource(`${gatewayUrl.replace(/\/$/, '')}${streamUrl}`);
    const eventNames = ['queued', 'gateway', 'memory', 'inference', 'complete', 'final', 'error'];

    const handlers = eventNames.map((eventName) => {
      const handler = (event) => {
        setEvents((current) => [...current, {
          type: eventName,
          payload: JSON.parse(event.data),
        }]);
      };
      source.addEventListener(eventName, handler);
      return [eventName, handler];
    });

    source.onerror = () => setStatus('closed');

    return () => {
      handlers.forEach(([eventName, handler]) => source.removeEventListener(eventName, handler));
      source.close();
      setStatus('closed');
    };
  }, [gatewayUrl, streamUrl]);

  return { events, status };
}

