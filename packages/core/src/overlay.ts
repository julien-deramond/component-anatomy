/**
 * AnatomyOverlay — renders position:fixed highlight boxes over target elements.
 * Injected into document.body to escape ancestor stacking contexts and transforms.
 */

const OVERLAY_CLASS = 'ca-overlay';
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
      background: var(--ca-overlay-bg, rgba(99, 102, 241, 0.10));
      outline: 2px solid var(--ca-overlay-border, rgba(99, 102, 241, 0.55));
      outline-offset: 1px;
      z-index: var(--ca-overlay-z, 9999);
      transition: opacity 120ms ease;
    }
    .${OVERLAY_CLASS}.ca-overlay--hidden {
      opacity: 0;
    }
  `;
  document.head.appendChild(style);
}

export class AnatomyOverlay {
  private overlays: HTMLDivElement[] = [];
  private activeElements: HTMLElement[] = [];
  private rafId: number | null = null;

  constructor() {
    injectStyles();
  }

  /**
   * Show highlight overlays over each of the given elements.
   * Replaces any existing overlays.
   */
  show(elements: HTMLElement[]): void {
    this.hide();
    this.activeElements = elements;

    elements.forEach((el) => {
      const div = document.createElement('div');
      div.className = `${OVERLAY_CLASS} ca-overlay--hidden`;
      div.setAttribute('aria-hidden', 'true');
      document.body.appendChild(div);
      this.overlays.push(div);
    });

    // Position after paint so getBoundingClientRect is accurate
    requestAnimationFrame(() => {
      this._position();
      this.overlays.forEach((o) => o.classList.remove('ca-overlay--hidden'));
    });
  }

  /**
   * Remove all overlays from the DOM.
   */
  hide(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.overlays.forEach((o) => o.remove());
    this.overlays = [];
    this.activeElements = [];
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
    this.activeElements.forEach((el, i) => {
      const overlay = this.overlays[i];
      if (!overlay) return;

      const rect = el.getBoundingClientRect();
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
    });
  }
}
