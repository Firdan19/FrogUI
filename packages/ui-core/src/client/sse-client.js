export class FrogStreamClient {
  constructor({ gatewayUrl = '' } = {}) {
    this.gatewayUrl = gatewayUrl.replace(/\/$/, '');
    this.source = null;
  }

  connect(streamUrl, handlers = {}) {
    this.close();
    this.source = new EventSource(`${this.gatewayUrl}${streamUrl}`);

    ['queued', 'gateway', 'memory', 'inference', 'complete', 'final', 'error', 'stdout', 'stderr', 'exit'].forEach((eventName) => {
      this.source.addEventListener(eventName, (event) => {
        handlers.onEvent?.({
          type: eventName,
          payload: JSON.parse(event.data),
        });
      });
    });

    this.source.onerror = () => {
      handlers.onError?.();
    };

    return this.source;
  }

  close() {
    if (this.source) {
      this.source.close();
      this.source = null;
    }
  }
}

