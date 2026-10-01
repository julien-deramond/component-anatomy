/**
 * Vanilla custom elements for the web component stories. No library: what
 * matters is the shape — an open shadow root, rendered asynchronously once
 * connected, as Lit and Stencil do.
 */

const STEPPER_STYLES = `
  :host { display: inline-flex; align-items: center; gap: 0.75rem; font-family: inherit; }
  .controls { display: inline-flex; align-items: center; border: 1px solid #d4d4d8; border-radius: 8px; overflow: hidden; }
  button { width: 2rem; height: 2rem; border: 0; background: #f4f4f5; font: inherit; font-size: 1rem; cursor: pointer; }
  button:hover { background: #e4e4e7; }
  output { min-width: 2.5rem; text-align: center; font-variant-numeric: tabular-nums; }
`;

/**
 * Defines (once) a quantity stepper whose shadow parts are named with `attr`:
 * `data-part` for the addon's own convention, `part` for CSS Shadow Parts.
 * Returns the tag name.
 */
export function defineStepper(tag: string, attr: 'data-part' | 'part'): string {
  if (customElements.get(tag)) return tag;

  customElements.define(tag, class extends HTMLElement {
    private value = 1;

    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.addEventListener('click', (event) => {
        const step = (event.target as HTMLElement).closest('button')?.dataset.step;
        if (!step) return;
        this.value = Math.max(0, this.value + Number(step));
        shadow.querySelector('output')!.textContent = String(this.value);
      });
    }

    connectedCallback() {
      Promise.resolve().then(() => {
        if (this.shadowRoot!.hasChildNodes()) return;
        this.shadowRoot!.innerHTML = `
          <style>${STEPPER_STYLES}</style>
          <slot name="label"></slot>
          <span class="controls">
            <button type="button" ${attr}="decrement" data-step="-1" aria-label="Decrease">−</button>
            <output ${attr}="value">${this.value}</output>
            <button type="button" ${attr}="increment" data-step="1" aria-label="Increase">+</button>
          </span>
        `;
      });
    }
  });

  return tag;
}

let lateCount = 0;

/**
 * An element whose definition only runs `delay` ms after it is on the page —
 * what an autoloader (Shoelace, Web Awesome) or a lazy bundle does. Each call
 * returns a fresh tag, so the story shows the late upgrade on every render.
 */
export function createLateElement(delay: number): HTMLElement {
  const tag = `sb-late-badge-${++lateCount}`;
  const el = document.createElement(tag);

  setTimeout(() => {
    customElements.define(tag, class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' }).innerHTML = `
          <style>
            span { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.25rem 0.625rem; border-radius: 99px; background: #eef2ff; color: #3730a3; font-size: 0.85rem; }
            b { display: inline-grid; place-items: center; min-width: 1.25rem; height: 1.25rem; border-radius: 99px; background: #4f46e5; color: #fff; font-size: 0.72rem; }
          </style>
          <span data-part="badge"><i data-part="text">Upgraded</i><b data-part="count">3</b></span>
        `;
      }
    });
  }, delay);

  return el;
}

/** A custom element whose shadow root is closed: unreachable from outside. */
export function createClosedElement(): HTMLElement {
  const tag = 'sb-closed-badge';
  if (!customElements.get(tag)) {
    customElements.define(tag, class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'closed' }).innerHTML = `
          <span data-part="badge" style="padding: 0.25rem 0.625rem; border-radius: 99px; background: #f4f4f5;">Closed shadow root</span>
        `;
      }
    });
  }
  return document.createElement(tag);
}
