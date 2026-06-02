import { GatewayClient } from '../client/gateway-client.js';

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      min-width: 0;
      color: var(--frog-color-ivory, #f2eee5);
      font-family: var(--frog-font-sans, 'Outfit', sans-serif);
    }

    .panel {
      display: grid;
      gap: 20px;
      padding: 24px;
      background: var(--frog-glass-strong, rgba(242, 238, 229, 0.08));
      backdrop-filter: blur(22px);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
      border-radius: 16px;
      border: 1px solid rgba(242, 238, 229, 0.05);
      transition: border-color 0.3s ease;
    }

    .panel:focus-within {
      border-color: rgba(216, 199, 163, 0.3);
    }

    .label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: rgba(242, 238, 229, 0.68);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    textarea {
      min-height: 220px;
      resize: vertical;
      border: 0;
      outline: 0;
      padding: 0;
      background: transparent;
      color: #f2eee5;
      font: inherit;
      font-size: 18px;
      line-height: 1.6;
    }

    textarea::placeholder {
      color: rgba(242, 238, 229, 0.36);
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .state {
      min-width: 0;
      color: rgba(242, 238, 229, 0.58);
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    button {
      min-height: 44px;
      border: 0;
      border-radius: 8px;
      padding: 0 24px;
      background: var(--frog-color-brass, #d8c7a3);
      color: #171918;
      cursor: pointer;
      font: inherit;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(216, 199, 163, 0.3);
    }

    button:active:not(:disabled) {
      transform: translateY(0);
    }

    button:disabled {
      cursor: progress;
      opacity: 0.58;
    }
  </style>
  <form class="panel">
    <div class="label">
      <span>FrogUI Command</span>
      <span>Single-user runtime</span>
    </div>
    <textarea name="command" placeholder="Type a precise agent instruction..."></textarea>
    <div class="actions">
      <span class="state">Ready</span>
      <button type="submit">Run</button>
    </div>
  </form>
`;

export class FrogCommandPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.form = this.shadowRoot.querySelector('form');
    this.textarea = this.shadowRoot.querySelector('textarea');
    this.button = this.shadowRoot.querySelector('button');
    this.state = this.shadowRoot.querySelector('.state');
    this.form.addEventListener('submit', this.handleSubmit);
  }

  disconnectedCallback() {
    this.form?.removeEventListener('submit', this.handleSubmit);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const command = this.textarea.value.trim();
    if (!command) {
      this.state.textContent = 'Command is empty';
      return;
    }

    this.button.disabled = true;
    this.state.textContent = 'Dispatching through gateway';

    try {
      const client = new GatewayClient({ 
        gatewayUrl: this.getAttribute('gateway-url') ?? '',
        jwtToken: this.getAttribute('jwt-token') ?? '',
      });
      const task = await client.createCommand(command);
      this.state.textContent = `Task ${task.task_id}`;
      this.dispatchEvent(new CustomEvent('frog-command', {
        bubbles: true,
        composed: true,
        detail: task,
      }));
      window.dispatchEvent(new CustomEvent('frogui:task-created', { detail: task }));
    } catch (error) {
      this.state.textContent = error.message;
    } finally {
      this.button.disabled = false;
    }
  };
}

customElements.define('frog-command-panel', FrogCommandPanel);

