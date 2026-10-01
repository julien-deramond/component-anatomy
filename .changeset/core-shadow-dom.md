---
"@component-anatomy/core": minor
---

Web Components support ([#46](https://github.com/julien-deramond/component-anatomy/issues/46)). Parts are now found inside open shadow roots: `data-part` works on a host, on its slotted children, and on elements inside its shadow tree, at any nesting depth.

Web components that render after `createAnatomy()` are picked up too. That covers Lit and Stencil, which render asynchronously, and autoloaders that define elements once they are on the page. The registry watches every open shadow root it finds, and waits on `customElements.whenDefined()` for elements that are not defined yet. A `scroll` inside a shadow root now repositions the overlays as well.

Part names changed in place are now detected too, in the light DOM as in shadow roots. Until now, changing a `data-part` value on an existing element needed a `refresh()`. Libraries like Lit bind attributes, as in `part=${selected ? 'tab selected' : 'tab'}`, so this comes up with web components often.

```js
createAnatomy({ root, shadowParts: true });
// <my-slider> ⟶ #shadow-root ⟶ <div part="track">, <div part="thumb">
```

- **`shadowParts` option (new, off by default):** reads the native `part` attribute (CSS Shadow Parts, the one `::part()` styles) on elements inside shadow trees. Each space-separated name is a part id.
- **`parts:change` event (new):** fires when auto-discovery finds a different set of parts after the DOM changed. Integrations use it to update a panel built before a component rendered. It never fires when `parts` are passed explicitly.

Closed shadow roots cannot be reached from outside a component and stay unsupported.

Also fixes the DOM observer being disconnected after a `refresh()` or after a second dynamic update. Until now, `data-part` elements added later were no longer detected, and some panel listeners were left attached.
