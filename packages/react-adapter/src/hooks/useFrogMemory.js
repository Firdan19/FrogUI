import React from 'react';

export function useFrogMemory() {
  const [memories, setMemories] = React.useState([]);

  const hydrate = React.useCallback((items) => {
    setMemories(Array.isArray(items) ? items : []);
  }, []);

  return { memories, hydrate };
}

