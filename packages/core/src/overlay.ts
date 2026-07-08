import type {
  AnatomyPartDefinition,
  OverlayOptions,
  OverlayRenderContext,
} from './types.js';

/**
 * AnatomyOverlay — renders position:fixed highlight boxes + name label chips
 * over target elements. Injected into document.body to escape ancestor
 * stacking contexts and CSS transforms.
 *
 * Theming: the injected stylesheet reads `--ca-*` custom properties with
 * built-in fallbacks (the "default" look). Per-instance themes are applied
 * as inline custom properties on each overlay/label element, so multiple
 * controllers with different themes can coexist on one page while global
 * `--ca-*` variables keep working as a page-wide default.
 */

const OVERLAY_CLASS = 'ca-overlay';
const LABEL_CLASS = 'ca-overlay-label';
const STYLE_ID = 'ca-overlay-styles';

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${OVERLAY_CLASS} {
      position: fixed;
      pointer-events: none;
      box-sizing: border-box;
      border-radius: var(--ca-overlay-radius, 4px);
      background: var(--ca-overlay-bg, rgba(99, 102, 241, 0.18));
      outline: var(--ca-overlay-border-width, 2px)
               var(--ca-overlay-border-style, solid)
               var(--ca-overlay-border, rgba(99, 102, 241, 0.75));
      outline-offset: 1px;
      z-index: var(--ca-overlay-z, 9998);
      transition: opacity var(--ca-transition, 150ms) ease;
    }
    .${OVERLAY_CLASS}.ca-overlay--hidden {
      opacity: 0;
    }

    /* Name label chip — floats above the overlay */
    .${LABEL_CLASS} {
      position: fixed;
      pointer-events: none;
      z-index: var(--ca-overlay-z, 9999);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px 2px 5px;
      border-radius: 4px;
      background: var(--ca-label-bg, rgba(79, 70, 229, 1));
      color: var(--ca-label-fg, #fff);
      font-family: var(--ca-label-font, ui-monospace, 'Cascadia Code', 'Fira Mono', monospace);
      font-size: var(--ca-label-font-size, 11px);
      font-weight: 500;
      letter-spacing: 0.02em;
      white-space: nowrap;
      line-height: 1.6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      transition: opacity var(--ca-transition, 150ms) ease;
    }
    .${LABEL_CLASS}.ca-overlay--hidden {
      opacity: 0;
    }
    .${LABEL_CLASS}::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--ca-label-fg, #fff) 60%, transparent);
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);
}

function applyVars(el: HTMLElement, vars: Record<string, string>) {
  for (const [prop, value] of Object.entries(vars)) {
    el.style.setProperty(prop, value);
  }
}

export class AnatomyOverlay {
  private overlays: HTMLDivElement[] = [];
  private labels: HTMLDivElement[] = [];
  private activeElements: HTMLElement[] = [];
  private activePart: AnatomyPartDefinition | null = null;
  private rafId: number | null = null;

  private vars: Record<string, string>;
  private options: OverlayOptions;

  constructor(vars: Record<string, string> = {}, options: OverlayOptions = {}) {
    this.vars = vars;
    this.options = options;
    injectStyles();
  }

  /**
   * Replace the per-instance theme variables. Re-applies to any overlays
   * currently on screen.
   */
  setVars(vars: Record<string, string>): void {
    this.vars = vars;
    if (this.overlays.length > 0 || this.labels.length > 0) {
      [...this.overlays, ...this.labels].forEach((el) => {
        el.removeAttribute('style'); // clear stale vars (positioning restored below)
        applyVars(el, vars);
      });
      this._position();
    }
  }

  /**
   * Show highlight overlays + label chip over each of the given elements.
   */
  show(elements: HTMLElement[], part: AnatomyPartDefinition): void {
    this.hide();
    this.activeElements = elements;
    this.activePart = part;

    const showLabel = this.options.label !== false;

    elements.forEach((element, index) => {
      const ctx: OverlayRenderContext = { part, element, index };

      const div = document.createElement('div');
      div.className = `${OVERLAY_CLASS} ca-overlay--hidden`;
      if (this.options.className) div.className += ` ${this.options.className}`;
      div.setAttribute('aria-hidden', 'true');
      applyVars(div, this.vars);
      document.body.appendChild(div);
      this.overlays.push(div);

      if (this.options.decorateOverlay) {
        this.options.decorateOverlay(div, ctx);
      }

      if (showLabel) {
        const label = document.createElement('div');
        label.className = `${LABEL_CLASS} ca-overlay--hidden`;
        label.setAttribute('aria-hidden', 'true');
        applyVars(label, this.vars);

        const custom = this.options.renderLabel?.(ctx);
        if (typeof custom === 'string') label.textContent = custom;
        else if (custom instanceof Node) label.appendChild(custom);
        else label.textContent = part.name;

        document.body.appendChild(label);
        this.labels.push(label);
      }
    });

    // Position after paint so getBoundingClientRect is accurate
    requestAnimationFrame(() => {
      this._position();
      this.overlays.forEach((o) => o.classList.remove('ca-overlay--hidden'));
      this.labels.forEach((l) => l.classList.remove('ca-overlay--hidden'));
    });
  }

  /**
   * Remove all overlays and labels from the DOM.
   */
  hide(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.overlays.forEach((o) => o.remove());
    this.labels.forEach((l) => l.remove());
    this.overlays = [];
    this.labels = [];
    this.activeElements = [];
    this.activePart = null;
  }

  /**
   * Recompute overlay positions. Call on scroll or resize.
   */
  reposition(): void {
    if (this.overlays.length === 0) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this._position();
      this.rafId = null;
    });
  }

  destroy(): void {
    this.hide();
  }

  private _position(): void {
    const LABEL_OFFSET = 6; // px gap between label and overlay top edge
    const LABEL_HEIGHT = 22; // approximate label height
    const pad = this.options.padding ?? 0;

    this.activeElements.forEach((el, i) => {
      const overlay = this.overlays[i];
      const label = this.labels[i];
      if (!overlay) return;

      const rect = el.getBoundingClientRect();
      const top = rect.top - pad;
      const left = rect.left - pad;
      const width = rect.width + pad * 2;
      const height = rect.height + pad * 2;

      // Position the highlight box
      overlay.style.top = `${top}px`;
      overlay.style.left = `${left}px`;
      overlay.style.width = `${width}px`;
      overlay.style.height = `${height}px`;

      if (!label) return;

      // Place label chip above the overlay; flip below if too close to top
      const labelTop = top - LABEL_HEIGHT - LABEL_OFFSET;
      const finalTop = labelTop < 4 ? top + height + LABEL_OFFSET : labelTop;
      label.style.top = `${finalTop}px`;
      label.style.left = `${left}px`;
    });
  }
}
