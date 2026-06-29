"use strict";
var ComponentAnatomy = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    createAnatomy: () => createController
  });

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
  var LABEL_CLASS = "ca-overlay-label";
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
      background: var(--ca-overlay-bg, rgba(99, 102, 241, 0.18));
      outline: 2px solid var(--ca-overlay-border, rgba(99, 102, 241, 0.75));
      outline-offset: 1px;
      z-index: var(--ca-overlay-z, 9998);
      transition: opacity 150ms ease;
    }
    .${OVERLAY_CLASS}.ca-overlay--hidden {
      opacity: 0;
    }

    /* Name label chip \u2014 floats above the overlay */
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
  var AnatomyOverlay = class {
    constructor() {
      this.overlays = [];
      this.labels = [];
      this.activeElements = [];
      this.activePartName = "";
      this.rafId = null;
      injectStyles();
    }
    /**
     * Show highlight overlays + label chip over each of the given elements.
     * partName is shown in the floating chip.
     */
    show(elements, partName = "") {
      this.hide();
      this.activeElements = elements;
      this.activePartName = partName;
      elements.forEach(() => {
        const div = document.createElement("div");
        div.className = `${OVERLAY_CLASS} ca-overlay--hidden`;
        div.setAttribute("aria-hidden", "true");
        document.body.appendChild(div);
        this.overlays.push(div);
        const label = document.createElement("div");
        label.className = `${LABEL_CLASS} ca-overlay--hidden`;
        label.setAttribute("aria-hidden", "true");
        label.textContent = partName;
        document.body.appendChild(label);
        this.labels.push(label);
      });
      requestAnimationFrame(() => {
        this._position();
        this.overlays.forEach((o) => o.classList.remove("ca-overlay--hidden"));
        this.labels.forEach((l) => l.classList.remove("ca-overlay--hidden"));
      });
    }
    /**
     * Remove all overlays and labels from the DOM.
     */
    hide() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.overlays.forEach((o) => o.remove());
      this.labels.forEach((l) => l.remove());
      this.overlays = [];
      this.labels = [];
      this.activeElements = [];
      this.activePartName = "";
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
      const LABEL_OFFSET = 6;
      const LABEL_HEIGHT = 22;
      this.activeElements.forEach((el, i) => {
        const overlay = this.overlays[i];
        const label = this.labels[i];
        if (!overlay) return;
        const rect = el.getBoundingClientRect();
        overlay.style.top = `${rect.top}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.width = `${rect.width}px`;
        overlay.style.height = `${rect.height}px`;
        if (!label) return;
        const labelTop = rect.top - LABEL_HEIGHT - LABEL_OFFSET;
        const finalTop = labelTop < 4 ? rect.bottom + LABEL_OFFSET : labelTop;
        label.style.top = `${finalTop}px`;
        label.style.left = `${rect.left}px`;
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
    function highlight(partId, source = "panel") {
      const elements = registry.query().get(partId) ?? [];
      overlay.show(elements, partId);
      if (panel) {
        panel.querySelectorAll("[data-anatomy-item]").forEach((el) => {
          if (el.dataset.anatomyItem === partId) {
            el.setAttribute("data-active", "");
            if (source === "preview") {
              el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
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
          const enter = () => highlight(partId, "preview");
          const leave = () => unhighlight();
          el.addEventListener("mouseenter", enter);
          el.addEventListener("mouseleave", leave);
          cleanupFns.push(() => {
            el.removeEventListener("mouseenter", enter);
            el.removeEventListener("mouseleave", leave);
          });
        });
      });
    }
    function attachPanelListeners() {
      if (!panel) return;
      panel.querySelectorAll("[data-anatomy-item]").forEach((el) => {
        const partId = el.dataset.anatomyItem ?? "";
        const enter = () => highlight(partId, "panel");
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
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=index.iife.js.map
