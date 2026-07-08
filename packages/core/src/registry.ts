/**
 * AnatomyRegistry — discovers and tracks [data-part] elements within a root.
 * Intentionally stateless between calls: query() always reads the live DOM.
 */
export class AnatomyRegistry {
  private root: HTMLElement;
  private observer: MutationObserver | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  /**
   * Returns a Map of partId → matching HTMLElements.
   * Always queries the live DOM — never returns a stale cache.
   */
  query(): Map<string, HTMLElement[]> {
    const map = new Map<string, HTMLElement[]>();
    const nodes = this.root.querySelectorAll<HTMLElement>('[data-part]');

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
  partIds(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    this.root.querySelectorAll<HTMLElement>('[data-part]').forEach((el) => {
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
  observe(callback: () => void): () => void {
    this.observer = new MutationObserver((mutations) => {
      const relevant = mutations.some((m) =>
        Array.from(m.addedNodes).concat(Array.from(m.removedNodes)).some(
          (n) =>
            n instanceof HTMLElement &&
            (n.hasAttribute('data-part') ||
              n.querySelector('[data-part]') !== null)
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
}
