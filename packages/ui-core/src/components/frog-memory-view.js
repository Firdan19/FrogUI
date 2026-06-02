const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      color: #f2eee5;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .memory {
      display: grid;
      gap: 10px;
      padding: 18px 20px;
      background: rgba(242, 238, 229, 0.045);
      backdrop-filter: blur(18px);
    }

    .title {
      color: rgba(242, 238, 229, 0.68);
      font-size: 12px;
      text-transform: uppercase;
    }

    .body {
      color: rgba(242, 238, 229, 0.8);
      line-height: 1.5;
    }
  </style>
  <aside class="memory">
    <div class="title">Semantic Memory</div>
    <div class="body">pgvector-backed memory surface is ready for private agent context.</div>
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

