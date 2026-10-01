export type RegistryOptions = {
  /** Also read the native `part` attribute on elements inside shadow trees. */
  shadowParts?: boolean;
};

type Scan = {
  /** Every part element in tree order, with the part ids it carries. */
  parts: Array<[HTMLElement, string[]]>;
  /** Every open shadow root under the root, in tree order. */
  shadowRoots: ShadowRoot[];
  /** Custom element tag names under the root that are not defined yet. */
  undefinedTags: Set<string>;
};

const isCustomElement = (el: Element) => el.localName.includes('-');

/**
 * What the registry watches on the root and on every shadow root: elements
 * added or removed, and part names changed in place — Lit and similar
 * libraries bind attributes, e.g. `part=${selected ? 'tab selected' : 'tab'}`.
 */
const OBSERVE_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['data-part', 'part'],
};

/**
 * AnatomyRegistry — discovers and tracks [data-part] elements within a root.
 * Intentionally stateless between calls: query() always reads the live DOM.
 *
 * Discovery walks into open shadow roots, so a web component's parts are
 * found whether they live in its light DOM (the host, slotted children) or
 * in its shadow tree. Closed shadow roots cannot be reached from outside.
 */
export class AnatomyRegistry {
  private root: HTMLElement;
  private shadowParts: boolean;
  private observer: MutationObserver | null = null;
  private onChange: (() => void) | null = null;
  /** Shadow roots the observer already watches — an observer can't list them. */
  private observed = new WeakSet<ShadowRoot>();
  /** Tags already waiting on `customElements.whenDefined()`. */
  private pendingTags = new Set<string>();

  constructor(root: HTMLElement, options: RegistryOptions = {}) {
    this.root = root;
    this.shadowParts = options.shadowParts ?? false;
  }

  /**
   * Returns a Map of partId → matching HTMLElements.
   * Always queries the live DOM — never returns a stale cache.
   */
  query(): Map<string, HTMLElement[]> {
    const map = new Map<string, HTMLElement[]>();

    this.scan().parts.forEach(([el, ids]) => {
      ids.forEach((id) => {
        const existing = map.get(id) ?? [];
        existing.push(el);
        map.set(id, existing);
      });
    });

    return map;
  }

  /**
   * Returns every part element with the part ids it carries, in tree order.
   * An element carries several ids with `shadowParts`: `part="tab selected"`.
   */
  elements(): Array<[HTMLElement, string[]]> {
    return this.scan().parts;
  }

  /**
   * Returns all unique part IDs present in the DOM, in document order.
   */
  partIds(): string[] {
    return Array.from(this.query().keys());
  }

  /**
   * Returns the open shadow roots under the root. Events that don't cross a
   * shadow boundary (`scroll`) have to be listened for on each of them.
   */
  shadowRoots(): ShadowRoot[] {
    return this.scan().shadowRoots;
  }

  /**
   * Watches the root — and every open shadow root inside it — for DOM
   * mutations, and calls the callback when part elements or web components
   * are added or removed, or when a part name changes. Returns a cleanup
   * function.
   */
  observe(callback: () => void): () => void {
    this.destroy();
    this.onChange = callback;

    this.observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((m) =>
        m.type === 'attributes'
          ? m.attributeName === 'data-part' || this.shadowParts
          : Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(
              (n) => n instanceof Element && this.mayHoldParts(n)
            )
      );
      if (relevant) this.changed();
    });

    this.observer.observe(this.root, OBSERVE_OPTIONS);
    this.scan(); // observes the shadow roots already rendered

    return () => this.destroy();
  }

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    this.onChange = null;
    this.observed = new WeakSet();
    this.pendingTags.clear();
  }

  private changed() {
    if (!this.observer) return;
    this.scan(); // a new web component brings a new shadow root to watch
    this.onChange?.();
  }

  /**
   * Whether an added or removed subtree can change the part list: it carries
   * a part, or a web component that may render (or has rendered) some in its
   * shadow root — which a light-DOM check alone cannot see.
   */
  private mayHoldParts(el: Element): boolean {
    if (
      el.hasAttribute('data-part') ||
      (this.shadowParts && el.hasAttribute('part')) ||
      el.shadowRoot ||
      isCustomElement(el)
    ) {
      return true;
    }
    return Array.from(el.children).some((child) => this.mayHoldParts(child));
  }

  private partIdsOf(el: Element, inShadow: boolean): string[] {
    const ids: string[] = [];
    const dataPart = el.getAttribute('data-part');
    if (dataPart) ids.push(dataPart);

    // The `part` attribute only means something inside a shadow tree.
    if (this.shadowParts && inShadow) {
      (el.getAttribute('part') ?? '').split(/\s+/).forEach((id) => {
        if (id && !ids.includes(id)) ids.push(id);
      });
    }
    return ids;
  }

  /**
   * Walks the root in tree order — each host's shadow tree before its light
   * children, the order they usually render in — and, while observing, starts
   * watching any shadow root or undefined custom element seen for the first time.
   */
  private scan(): Scan {
    const result: Scan = { parts: [], shadowRoots: [], undefinedTags: new Set() };

    const enterShadow = (host: Element) => {
      const shadow = host.shadowRoot;
      if (!shadow) return;
      result.shadowRoots.push(shadow);
      visit(shadow, true);
    };

    const visit = (node: ParentNode, inShadow: boolean) => {
      Array.from(node.children).forEach((el) => {
        const ids = this.partIdsOf(el, inShadow);
        if (ids.length > 0) result.parts.push([el as HTMLElement, ids]);
        if (
          isCustomElement(el) &&
          typeof customElements !== 'undefined' &&
          !customElements.get(el.localName)
        ) {
          result.undefinedTags.add(el.localName);
        }
        enterShadow(el);
        visit(el, inShadow);
      });
    };

    // The root itself is never a part (as with querySelectorAll), but it may
    // be a web component — or sit inside one's shadow tree.
    enterShadow(this.root);
    visit(this.root, this.root.getRootNode() instanceof ShadowRoot);

    if (this.observer) this.watch(result);
    return result;
  }

  private watch({ shadowRoots, undefinedTags }: Scan) {
    shadowRoots.forEach((shadow) => {
      if (this.observed.has(shadow)) return;
      this.observed.add(shadow);
      this.observer!.observe(shadow, OBSERVE_OPTIONS);
    });

    // Defining a custom element upgrades it in place: it attaches its shadow
    // root without any mutation the observer could see. Rescan once it's defined.
    undefinedTags.forEach((tag) => {
      if (this.pendingTags.has(tag)) return;
      this.pendingTags.add(tag);
      customElements.whenDefined(tag).then(() => {
        if (!this.pendingTags.delete(tag)) return; // destroyed meanwhile
        this.changed();
      });
    });
  }
}
