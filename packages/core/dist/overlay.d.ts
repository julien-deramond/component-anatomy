/**
 * AnatomyOverlay — renders position:fixed highlight boxes over target elements.
 * Injected into document.body to escape ancestor stacking contexts and transforms.
 */
export declare class AnatomyOverlay {
    private overlays;
    private activeElements;
    private rafId;
    constructor();
    /**
     * Show highlight overlays over each of the given elements.
     * Replaces any existing overlays.
     */
    show(elements: HTMLElement[]): void;
    /**
     * Remove all overlays from the DOM.
     */
    hide(): void;
    /**
     * Recompute overlay positions. Call on scroll or resize.
     */
    reposition(): void;
    destroy(): void;
    private _position;
}
//# sourceMappingURL=overlay.d.ts.map