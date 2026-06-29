// src/registry.ts
var AnatomyRegistry = class {
  constructor(root) {
    this.observer = null;
    this.root = root;
  }
  /**
   * Returns a Map of partId → matching HTMLElements.
   * Always queries the live DOM — never returns a stale cache.
   */
  query() {
    const map = /* @__PURE__ */ new Map();
    const nodes = this.root.querySelectorAll("[data-part]");
    nodes.forEach((el) => {
      const id = el.dataset.part;
      if (!id) return;
      const existing = map.get(id) ?? [];
      existing.push(el);
      map.set(id, existing);
    });
    return map;
  }
  /**
   * Returns all unique part IDs present in the DOM, in document order.
   */
  partIds() {
    const seen = /* @__PURE__ */ new Set();
    const result = [];
    this.root.querySelectorAll("[data-part]").forEach((el) => {
      const id = el.dataset.part;
      if (id && !seen.has(id)) {
        seen.add(id);
        result.push(id);
      }
    });
    return result;
  }
  /**
   * Watches the root for DOM mutations and calls the callback when [data-part]
   * elements are added or removed. Returns a cleanup function.
   */
  observe(callback) {
    this.observer = new MutationObserver((mutations) => {
      const relevant = mutations.some(
        (m) => Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(
          (n) => n instanceof HTMLElement && (n.hasAttribute("data-part") || n.querySelector("[data-part]") !== null)
        )
      );
      if (relevant) callback();
    });
    this.observer.observe(this.root, { childList: true, subtree: true });
    return () => {
      this.observer?.disconnect();
      this.observer = null;
    };
  }
  destroy() {
    this.observer?.disconnect();
    this.observer = null;
  }
};

// src/overlay.ts
var OVERLAY_CLASS = "ca-overlay";
var STYLE_ID = "ca-overlay-styles";
function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
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
var AnatomyOverlay = class {
  constructor() {
    this.overlays = [];
    this.activeElements = [];
    this.rafId = null;
    injectStyles();
  }
  /**
   * Show highlight overlays over each of the given elements.
   * Replaces any existing overlays.
   */
  show(elements) {
    this.hide();
    this.activeElements = elements;
    elements.forEach((el) => {
      const div = document.createElement("div");
      div.className = `${OVERLAY_CLASS} ca-overlay--hidden`;
      div.setAttribute("aria-hidden", "true");
      document.body.appendChild(div);
      this.overlays.push(div);
    });
    requestAnimationFrame(() => {
      this._position();
      this.overlays.forEach((o) => o.classList.remove("ca-overlay--hidden"));
    });
  }
  /**
   * Remove all overlays from the DOM.
   */
  hide() {
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
  reposition() {
    if (this.overlays.length === 0) return;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this._position();
      this.rafId = null;
    });
  }
  destroy() {
    this.hide();
  }
  _position() {
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
};

// src/controller.ts
function idToName(id) {
  return id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
function createController(options) {
  const { root, panel } = options;
  const registry = new AnatomyRegistry(root);
  const overlay = new AnatomyOverlay();
  let parts = options.parts ?? registry.partIds().map((id) => ({ id, name: idToName(id) }));
  const listeners = /* @__PURE__ */ new Map();
  function emit(event, partId) {
    listeners.get(event)?.forEach((fn) => fn(partId));
  }
  const cleanupFns = [];
  function highlight(partId) {
    const elements = registry.query().get(partId) ?? [];
    overlay.show(elements);
    if (panel) {
      panel.querySelectorAll("[data-anatomy-item]").forEach((el) => {
        if (el.dataset.anatomyItem === partId) {
          el.setAttribute("data-active", "");
        } else {
          el.removeAttribute("data-active");
        }
      });
    }
    emit("part:enter", partId);
  }
  function unhighlight() {
    overlay.hide();
    if (panel) {
      panel.querySelectorAll("[data-anatomy-item]").forEach((el) => {
        el.removeAttribute("data-active");
      });
    }
    emit("part:leave", "");
  }
  function attachElementListeners() {
    const map = registry.query();
    map.forEach((elements, partId) => {
      elements.forEach((el) => {
        const enter = () => highlight(partId);
        const leave = () => unhighlight();
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        el.addEventListener("focus", enter);
        el.addEventListener("blur", leave);
        cleanupFns.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
          el.removeEventListener("focus", enter);
          el.removeEventListener("blur", leave);
        });
      });
    });
  }
  function attachPanelListeners() {
    if (!panel) return;
    panel.querySelectorAll("[data-anatomy-item]").forEach((el) => {
      const partId = el.dataset.anatomyItem ?? "";
      const enter = () => highlight(partId);
      const leave = () => unhighlight();
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      el.addEventListener("focus", enter);
      el.addEventListener("blur", leave);
      cleanupFns.push(() => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.removeEventListener("focus", enter);
        el.removeEventListener("blur", leave);
      });
    });
  }
  const onScroll = () => overlay.reposition();
  const onResize = () => overlay.reposition();
  const resizeObserver = new ResizeObserver(() => overlay.reposition());
  function setup() {
    attachElementListeners();
    attachPanelListeners();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize, { passive: true });
    resizeObserver.observe(root);
    const stopObserving = registry.observe(() => {
      teardownListeners();
      if (!options.parts) {
        parts = registry.partIds().map((id) => ({ id, name: idToName(id) }));
      }
      attachElementListeners();
      attachPanelListeners();
    });
    cleanupFns.push(stopObserving);
  }
  function teardownListeners() {
    const observerCleanup = cleanupFns.pop();
    cleanupFns.forEach((fn) => fn());
    cleanupFns.length = 0;
    if (observerCleanup) cleanupFns.push(observerCleanup);
  }
  setup();
  return {
    highlight,
    unhighlight,
    refresh() {
      unhighlight();
      teardownListeners();
      if (!options.parts) {
        parts = registry.partIds().map((id) => ({ id, name: idToName(id) }));
      }
      attachElementListeners();
      attachPanelListeners();
    },
    destroy() {
      unhighlight();
      cleanupFns.forEach((fn) => fn());
      cleanupFns.length = 0;
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      overlay.destroy();
      registry.destroy();
      listeners.clear();
    },
    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, /* @__PURE__ */ new Set());
      listeners.get(event).add(handler);
      return () => listeners.get(event)?.delete(handler);
    }
  };
}
export {
  createController as createAnatomy
};
//# sourceMappingURL=index.js.map
