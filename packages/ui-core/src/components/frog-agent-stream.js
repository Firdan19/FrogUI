import { FrogStreamClient } from '../client/sse-client.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      min-width: 0;
      color: #f2eee5;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .stream {
      min-height: 480px;
      padding: 24px;
      background: rgba(242, 238, 229, 0.06);
      backdrop-filter: blur(24px);
      box-shadow: 0 30px 100px rgba(0, 0, 0, 0.25);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
      color: rgba(242, 238, 229, 0.66);
      font-size: 12px;
      text-transform: uppercase;
    }

    .events {
      display: grid;
      gap: 14px;
    }

    .event {
      display: grid;
      gap: 6px;
      padding: 16px 0;
      border-bottom: 1px solid rgba(242, 238, 229, 0.08);
    }

    .type {
      color: #d8c7a3;
      font-size: 12px;
      text-transform: uppercase;
    }

    .content {
      color: rgba(242, 238, 229, 0.88);
      line-height: 1.55;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .content.streaming::after {
      content: '▋';
      display: inline-block;
      margin-left: 4px;
      animation: blink 1s step-end infinite;
      color: #d8c7a3;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  </style>
  <section class="stream">
    <div class="header">
      <span>Agent Stream</span>
      <span class="task">Idle</span>
    </div>
    <div class="events"></div>
  </section>
`;

export class FrogAgentStream extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.client = null;
    this.activeStreamingNode = null;
  }

  connectedCallback() {
    this.events = this.shadowRoot.querySelector('.events');
    this.task = this.shadowRoot.querySelector('.task');
    window.addEventListener('frogui:task-created', this.handleTaskCreated);
  }

  disconnectedCallback() {
    window.removeEventListener('frogui:task-created', this.handleTaskCreated);
    this.client?.close();
  }

  handleTaskCreated = (event) => {
    const task = event.detail;
    this.task.textContent = task.task_id;
    this.events.innerHTML = '';
    this.activeStreamingNode = null;
    this.client = new FrogStreamClient({ gatewayUrl: this.getAttribute('gateway-url') ?? '' });
    this.client.connect(task.stream_url, {
      onEvent: (message) => this.appendEvent(message),
      onError: () => this.appendEvent({ type: 'error', payload: { content: 'SSE connection closed.' } }),
    });
  };

  appendEvent(message) {
    const typeStr = message.type;
    const contentStr = message.payload.content ?? message.payload.message ?? JSON.stringify(message.payload);

    if (typeStr === 'inference_token') {
      if (!this.activeStreamingNode) {
        // Create new block for inference
        const row = document.createElement('article');
        row.className = 'event';
        const type = document.createElement('div');
        type.className = 'type';
        type.textContent = 'inference';
        this.activeStreamingNode = document.createElement('div');
        this.activeStreamingNode.className = 'content streaming';
        row.append(type, this.activeStreamingNode);
        this.events.appendChild(row);
      }
      this.activeStreamingNode.textContent += contentStr;
      return;
    }

    if (this.activeStreamingNode) {
      this.activeStreamingNode.classList.remove('streaming');
      this.activeStreamingNode = null;
    }

    const row = document.createElement('article');
    row.className = 'event';

    const type = document.createElement('div');
    type.className = 'type';
    type.textContent = typeStr;

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = contentStr;

    row.append(type, content);
    this.events.appendChild(row);
  }
}

customElements.define('frog-agent-stream', FrogAgentStream);

