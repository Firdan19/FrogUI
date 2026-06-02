import React from 'react';

export function useFrogAgent({ gatewayUrl = '' } = {}) {
  const [task, setTask] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isPending, setIsPending] = React.useState(false);

  const run = React.useCallback(async (command) => {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch(`${gatewayUrl.replace(/\/$/, '')}/api/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const nextTask = await response.json();
      setTask(nextTask);
      return nextTask;
    } catch (caught) {
      setError(caught);
      throw caught;
    } finally {
      setIsPending(false);
    }
  }, [gatewayUrl]);

  return { run, task, error, isPending };
}

