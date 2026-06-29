/**
 * AnatomyRegistry — discovers and tracks [data-part] elements within a root.
 * Intentionally stateless between calls: query() always reads the live DOM.
 */
export declare class AnatomyRegistry {
    private root;
    private observer;
    constructor(root: HTMLElement);
    /**
     * Returns a Map of partId → matching HTMLElements.
     * Always queries the live DOM — never returns a stale cache.
     */
    query(): Map<string, HTMLElement[]>;
    /**
     * Returns all unique part IDs present in the DOM, in document order.
     */
    partIds(): string[];
    /**
     * Watches the root for DOM mutations and calls the callback when [data-part]
     * elements are added or removed. Returns a cleanup function.
     */
    observe(callback: () => void): () => void;
    destroy(): void;
}
//# sourceMappingURL=registry.d.ts.map