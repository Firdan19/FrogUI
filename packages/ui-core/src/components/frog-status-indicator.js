const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      color: #f2eee5;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      min-height: 52px;
      padding: 0 18px;
      background: rgba(216, 199, 163, 0.13);
      backdrop-filter: blur(18px);
    }

    .label {
      min-width: 0;
      color: rgba(242, 238, 229, 0.82);
      overflow-wrap: anywhere;
    }

    .mark {
      width: 8px;
      height: 8px;
      background: #d8c7a3;
    }
  </style>
  <div class="status">
    <span class="label"></span>
    <span class="mark" aria-hidden="true"></span>
  </div>
`;

export class FrogStatusIndicator extends HTMLElement {
  static observedAttributes = ['label'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const label = this.shadowRoot.querySelector('.label');
    if (label) {
      label.textContent = this.getAttribute('label') ?? 'Runtime';
    }
  }
}

customElements.define('frog-status-indicator', FrogStatusIndicator);

