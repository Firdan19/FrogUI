const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      color: var(--frog-color-ivory, #f2eee5);
      font-family: var(--frog-font-sans, 'Outfit', sans-serif);
    }

    .memory {
      display: grid;
      gap: 10px;
      padding: 18px 20px;
      background: var(--frog-glass-strong, rgba(242, 238, 229, 0.08));
      backdrop-filter: blur(18px);
      border-radius: 12px;
      border: 1px solid rgba(242, 238, 229, 0.05);
    }

    .title {
      color: rgba(242, 238, 229, 0.68);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .body {
      color: rgba(242, 238, 229, 0.8);
      line-height: 1.5;
    }
  </style>
  <aside class="memory">
    <div class="title">Semantic Memory (Coming Soon)</div>
    <div class="body">Long-term vector storage for your CLI agents.</div>
  </aside>
`;

export class FrogMemoryView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('frog-memory-view', FrogMemoryView);

