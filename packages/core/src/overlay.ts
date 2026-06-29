/**
 * AnatomyOverlay — renders position:fixed highlight boxes + name label chips
 * over target elements. Injected into document.body to escape ancestor
 * stacking contexts and CSS transforms.
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
      outline: 2px solid var(--ca-overlay-border, rgba(99, 102, 241, 0.75));
      outline-offset: 1px;
      z-index: var(--ca-overlay-z, 9998);
      transition: opacity 150ms ease;
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
      font-family: ui-monospace, 'Cascadia Code', 'Fira Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      white-space: nowrap;
      line-height: 1.6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      transition: opacity 150ms ease;
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
      background: rgba(255,255,255,0.6);
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);
}

export class AnatomyOverlay {
  private overlays: HTMLDivElement[] = [];
  private labels: HTMLDivElement[] = [];
  private activeElements: HTMLElement[] = [];
  private activePartName: string = '';
  private rafId: number | null = null;

  constructor() {
    injectStyles();
  }

  /**
   * Show highlight overlays + label chip over each of the given elements.
   * partName is shown in the floating chip.
   */
  show(elements: HTMLElement[], partName: string = ''): void {
    this.hide();
    this.activeElements = elements;
    this.activePartName = partName;

    elements.forEach(() => {
      const div = document.createElement('div');
      div.className = `${OVERLAY_CLASS} ca-overlay--hidden`;
      div.setAttribute('aria-hidden', 'true');
      document.body.appendChild(div);
      this.overlays.push(div);

      // One label per overlay element
      const label = document.createElement('div');
      label.className = `${LABEL_CLASS} ca-overlay--hidden`;
      label.setAttribute('aria-hidden', 'true');
      label.textContent = partName;
      document.body.appendChild(label);
      this.labels.push(label);
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
    this.activePartName = '';
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

    this.activeElements.forEach((el, i) => {
      const overlay = this.overlays[i];
      const label = this.labels[i];
      if (!overlay) return;

      const rect = el.getBoundingClientRect();

      // Position the highlight box
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;

      if (!label) return;

      // Place label chip above the overlay; flip below if too close to top
      const labelTop = rect.top - LABEL_HEIGHT - LABEL_OFFSET;
      const finalTop = labelTop < 4 ? rect.bottom + LABEL_OFFSET : labelTop;
      label.style.top = `${finalTop}px`;
      label.style.left = `${rect.left}px`;
    });
  }
}
