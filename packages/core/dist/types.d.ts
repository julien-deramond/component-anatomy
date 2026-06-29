export type AnatomyPartDefinition = {
    /** Matches the value of data-part="..." on the DOM element */
    id: string;
    /** Display name shown in the documentation panel */
    name: string;
    /** Raw Markdown string — rendered by the integration layer */
    description?: string;
};
export type AnatomyEvent = 'part:enter' | 'part:leave';
export type AnatomyEventHandler = (partId: string) => void;
export type AnatomyOptions = {
    /** The component preview container — where data-part elements live */
    root: HTMLElement;
    /** The documentation panel container — where data-anatomy-item elements live */
    panel?: HTMLElement;
    /** Part definitions. If omitted, auto-discovers from data-part values in the DOM */
    parts?: AnatomyPartDefinition[];
};
export type AnatomyController = {
    /** Programmatically activate a part (overlay + panel highlight) */
    highlight(partId: string): void;
    /** Deactivate all parts */
    unhighlight(): void;
    /** Re-query the DOM — call after dynamic updates */
    refresh(): void;
    /** Tear down all listeners and overlays */
    destroy(): void;
    /** Subscribe to part activation events. Returns an unsubscribe function. */
    on(event: AnatomyEvent, handler: AnatomyEventHandler): () => void;
};
//# sourceMappingURL=types.d.ts.map