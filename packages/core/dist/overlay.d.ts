/**
 * AnatomyOverlay — renders position:fixed highlight boxes + name label chips
 * over target elements. Injected into document.body to escape ancestor
 * stacking contexts and CSS transforms.
 */
export declare class AnatomyOverlay {
    private overlays;
    private labels;
    private activeElements;
    private activePartName;
    private rafId;
    constructor();
    /**
     * Show highlight overlays + label chip over each of the given elements.
     * partName is shown in the floating chip.
     */
    show(elements: HTMLElement[], partName?: string): void;
    /**
     * Remove all overlays and labels from the DOM.
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