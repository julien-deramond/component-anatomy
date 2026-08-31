---
'@component-anatomy/core': minor
---

Fix `theme.accent` being ignored when a `preset` is also set.

The documented resolution order is default look → global CSS variables → `preset` → `theme` tokens, and `accent` is a theme token. It was not treated as one: `resolveThemeVars()` merged the preset and the theme into a single object before deriving the accent's tokens, and the merge lost which layer each token came from. A preset that spells out `labelBg` or `overlayBorder` — `contrast` and `blueprint` both do — then overwrote what the accent had derived.

```js
createAnatomy({ root, preset: 'contrast', theme: { accent: '#0d9488' } });
// before: black border and label chip — the accent silently ignored
// after:  teal border, wash and label chip; the rest of the preset kept
```

The layers are now applied in order instead of merged. Within a single layer the shorthand still yields to a token you spell out yourself, so `theme: { accent, overlayBorder }` keeps behaving as before.

This changes rendered overlay colors only for the combination of a preset *and* `theme.accent`, which had no way of working as documented until now. Presets alone, accents alone, and explicit tokens are all unaffected.
