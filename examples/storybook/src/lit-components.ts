/**
 * Two small Lit components for the Lit stories. Lit attaches an open shadow
 * root and renders into it asynchronously, after the element is connected.
 */
import { LitElement, css, html } from 'lit';

/** A star rating whose anatomy is annotated with `data-part`. */
export class SbLitRating extends LitElement {
  static properties = { value: { type: Number } };

  static styles = css`
    :host { display: inline-flex; align-items: center; gap: 0.75rem; font-family: inherit; }
    .stars { display: inline-flex; gap: 0.125rem; }
    button { padding: 0; border: 0; background: none; font-size: 1.5rem; line-height: 1; color: #d4d4d8; cursor: pointer; }
    button[aria-checked='true'] { color: #f59e0b; }
    output { font-size: 0.85rem; color: #52525b; font-variant-numeric: tabular-nums; }
  `;

  declare value: number;

  constructor() {
    super();
    this.value = 3;
  }

  render() {
    return html`
      <div class="stars" data-part="stars" role="radiogroup" aria-label="Rating">
        ${[1, 2, 3, 4, 5].map(
          (n) => html`<button
            type="button"
            role="radio"
            data-part="star"
            aria-checked=${n <= this.value}
            aria-label="${n} star${n > 1 ? 's' : ''}"
            @click=${() => (this.value = n)}
          >★</button>`
        )}
      </div>
      <output data-part="value">${this.value} / 5</output>
    `;
  }
}

/**
 * Tabs exposing their anatomy the way most libraries do: native `part`
 * names, with the selected tab's name bound to state —
 * `part=${selected ? 'tab selected' : 'tab'}`.
 */
export class SbLitTabs extends LitElement {
  static properties = { selected: { type: Number } };

  static styles = css`
    :host { display: block; width: 300px; font-family: inherit; }
    [part~='tablist'] { display: flex; gap: 0.25rem; border-bottom: 1px solid #e4e4e7; }
    [part~='tab'] { padding: 0.5rem 0.75rem; border: 0; border-bottom: 2px solid transparent; background: none; font: inherit; font-size: 0.9rem; color: #52525b; cursor: pointer; }
    [part~='selected'] { border-bottom-color: #4f46e5; color: #18181b; }
    [part~='panel'] { padding: 0.75rem 0; font-size: 0.9rem; color: #3f3f46; }
  `;

  declare selected: number;
  private tabs = ['Overview', 'Specs', 'Reviews'];

  constructor() {
    super();
    this.selected = 0;
  }

  render() {
    return html`
      <div part="tablist" role="tablist">
        ${this.tabs.map(
          (label, i) => html`<button
            type="button"
            role="tab"
            part=${i === this.selected ? 'tab selected' : 'tab'}
            aria-selected=${i === this.selected}
            @click=${() => (this.selected = i)}
          >${label}</button>`
        )}
      </div>
      <div part="panel" role="tabpanel">${this.tabs[this.selected]} content.</div>
    `;
  }
}

if (!customElements.get('sb-lit-rating')) customElements.define('sb-lit-rating', SbLitRating);
if (!customElements.get('sb-lit-tabs')) customElements.define('sb-lit-tabs', SbLitTabs);
