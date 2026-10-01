import { AnatomyRegistry } from './registry.js';
import { AnatomyOverlay } from './overlay.js';
import { resolveThemeVars } from './theme.js';
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

  const registry = new AnatomyRegistry(root, { shadowParts: options.shadowParts });
  const overlay = new AnatomyOverlay(
    resolveThemeVars(options.preset, options.theme),
    options.overlay ?? {}
  );

  // Resolve part definitions: explicit or auto-discovered
  const discoverParts = (): AnatomyPartDefinition[] =>
    registry.partIds().map((id) => ({ id, name: idToName(id) }));

  let parts: AnatomyPartDefinition[] = options.parts ?? discoverParts();

  /** Re-runs auto-discovery; tells subscribers when the part list changed. */
  function rediscoverParts() {
    if (options.parts) return;
    const previous = parts.map((p) => p.id).join('\n');
    parts = discoverParts();
    if (parts.map((p) => p.id).join('\n') !== previous) emit('parts:change', '');
  }

  function findPart(partId: string): AnatomyPartDefinition {
    return parts.find((p) => p.id === partId) ?? { id: partId, name: idToName(partId) };
  }

  // Event emitter
  const listeners = new Map<AnatomyEvent, Set<AnatomyEventHandler>>();

  function emit(event: AnatomyEvent, partId: string) {
    listeners.get(event)?.forEach((fn) => fn(partId));
  }

  // Element and panel listeners — torn down and re-attached on every refresh
  const cleanupFns: Array<() => void> = [];
  // The MutationObserver outlives refreshes
  let stopObserving: (() => void) | null = null;

  function highlight(partId: string, source: 'preview' | 'panel' = 'panel') {
    const elements = registry.query().get(partId) ?? [];
    overlay.show(elements, findPart(partId));

    // Mark matching panel items active + scroll into view when triggered from preview
    if (panel) {
      panel.querySelectorAll<HTMLElement>('[data-anatomy-item]').forEach((el) => {
        if (el.dataset.anatomyItem === partId) {
          el.setAttribute('data-active', '');
          // Only auto-scroll when hover comes from the component, not the panel itself
          if (source === 'preview') {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
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

  /** Part ids in the order they are documented: `parts`, else the panel's entries. */
  function documentedOrder(): string[] {
    if (options.parts) return options.parts.map((p) => p.id);
    if (!panel) return [];
    return Array.from(panel.querySelectorAll<HTMLElement>('[data-anatomy-item]'))
      .map((el) => el.dataset.anatomyItem ?? '');
  }

  function attachElementListeners() {
    const documented = documentedOrder();

    registry.elements().forEach(([el, ids]) => {
      // Hovering an element with several part names (`part="tab selected"`)
      // highlights one: the first documented, else the element's first name.
      const partId = ids.length === 1
        ? ids[0]
        : documented.find((id) => ids.includes(id)) ?? ids[0];

      // Mouse only — no focus/blur here.
      // Preview elements are a live component; adding tabstops breaks
      // their natural tab order and confuses assistive technology.
      // Keyboard navigation is handled via the panel entries only.
      const enter = () => highlight(partId, 'preview');
      const leave = () => unhighlight();
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      cleanupFns.push(() => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    });

    // `scroll` doesn't cross shadow boundaries, so the window listener below
    // never hears a scroller inside a web component.
    registry.shadowRoots().forEach((shadow) => {
      shadow.addEventListener('scroll', onScroll, { passive: true, capture: true });
      cleanupFns.push(() => shadow.removeEventListener('scroll', onScroll, { capture: true }));
    });
  }

  function attachPanelListeners() {
    if (!panel) return;

    panel.querySelectorAll<HTMLElement>('[data-anatomy-item]').forEach((el) => {
      const partId = el.dataset.anatomyItem ?? '';
      const enter = () => highlight(partId, 'panel');
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
    stopObserving = registry.observe(() => {
      teardownListeners();
      // Re-resolve auto-discovered parts if none were explicitly provided
      rediscoverParts();
      attachElementListeners();
      attachPanelListeners();
    });
  }

  function teardownListeners() {
    cleanupFns.forEach((fn) => fn());
    cleanupFns.length = 0;
  }

  setup();

  return {
    highlight,
    unhighlight,

    refresh() {
      unhighlight();
      teardownListeners();
      rediscoverParts();
      attachElementListeners();
      attachPanelListeners();
    },

    destroy() {
      unhighlight();
      teardownListeners();
      stopObserving?.();
      stopObserving = null;
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

    getParts() {
      return parts.slice();
    },

    setTheme(theme, preset) {
      overlay.setVars(resolveThemeVars(preset, theme));
    },
  };
}
