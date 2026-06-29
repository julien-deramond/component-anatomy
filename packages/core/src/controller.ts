import { AnatomyRegistry } from './registry.js';
import { AnatomyOverlay } from './overlay.js';
import type {
  AnatomyOptions,
  AnatomyController,
  AnatomyEvent,
  AnatomyEventHandler,
  AnatomyPartDefinition,
} from './types.js';

/** Capitalizes an ID like "slider-thumb" → "Slider Thumb" */
function idToName(id: string): string {
  return id
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function createController(options: AnatomyOptions): AnatomyController {
  const { root, panel } = options;

  const registry = new AnatomyRegistry(root);
  const overlay = new AnatomyOverlay();

  // Resolve part definitions: explicit or auto-discovered
  let parts: AnatomyPartDefinition[] = options.parts ??
    registry.partIds().map((id) => ({ id, name: idToName(id) }));

  // Event emitter
  const listeners = new Map<AnatomyEvent, Set<AnatomyEventHandler>>();

  function emit(event: AnatomyEvent, partId: string) {
    listeners.get(event)?.forEach((fn) => fn(partId));
  }

  // Cleanup registry
  const cleanupFns: Array<() => void> = [];

  function highlight(partId: string) {
    const elements = registry.query().get(partId) ?? [];
    overlay.show(elements);

    // Mark matching panel items active
    if (panel) {
      panel.querySelectorAll<HTMLElement>('[data-anatomy-item]').forEach((el) => {
        if (el.dataset.anatomyItem === partId) {
          el.setAttribute('data-active', '');
        } else {
          el.removeAttribute('data-active');
        }
      });
    }

    emit('part:enter', partId);
  }

  function unhighlight() {
    overlay.hide();

    if (panel) {
      panel.querySelectorAll<HTMLElement>('[data-anatomy-item]').forEach((el) => {
        el.removeAttribute('data-active');
      });
    }

    // emit part:leave with empty string as signal (last active unknown at this point)
    emit('part:leave', '');
  }

  function attachElementListeners() {
    const map = registry.query();

    map.forEach((elements, partId) => {
      elements.forEach((el) => {
        const enter = () => highlight(partId);
        const leave = () => unhighlight();
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        el.addEventListener('focus', enter);
        el.addEventListener('blur', leave);
        cleanupFns.push(() => {
          el.removeEventListener('mouseenter', enter);
          el.removeEventListener('mouseleave', leave);
          el.removeEventListener('focus', enter);
          el.removeEventListener('blur', leave);
        });
      });
    });
  }

  function attachPanelListeners() {
    if (!panel) return;

    panel.querySelectorAll<HTMLElement>('[data-anatomy-item]').forEach((el) => {
      const partId = el.dataset.anatomyItem ?? '';
      const enter = () => highlight(partId);
      const leave = () => unhighlight();
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      el.addEventListener('focus', enter);
      el.addEventListener('blur', leave);
      cleanupFns.push(() => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
        el.removeEventListener('focus', enter);
        el.removeEventListener('blur', leave);
      });
    });
  }

  // Scroll + resize → reposition active overlays
  const onScroll = () => overlay.reposition();
  const onResize = () => overlay.reposition();

  const resizeObserver = new ResizeObserver(() => overlay.reposition());

  function setup() {
    attachElementListeners();
    attachPanelListeners();

    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onResize, { passive: true });
    resizeObserver.observe(root);

    // Watch for dynamic DOM changes
    const stopObserving = registry.observe(() => {
      teardownListeners();
      // Re-resolve auto-discovered parts if none were explicitly provided
      if (!options.parts) {
        parts = registry.partIds().map((id) => ({ id, name: idToName(id) }));
      }
      attachElementListeners();
      attachPanelListeners();
    });
    cleanupFns.push(stopObserving);
  }

  function teardownListeners() {
    // Run all registered cleanup functions except the MutationObserver (last one)
    // We rebuild element/panel listeners on refresh but keep the observer running
    const observerCleanup = cleanupFns.pop(); // MutationObserver cleanup is last
    cleanupFns.forEach((fn) => fn());
    cleanupFns.length = 0;
    if (observerCleanup) cleanupFns.push(observerCleanup); // put it back
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
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onResize);
      resizeObserver.disconnect();
      overlay.destroy();
      registry.destroy();
      listeners.clear();
    },

    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(handler);
      return () => listeners.get(event)?.delete(handler);
    },
  };
}
