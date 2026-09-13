---
'@component-anatomy/storybook': minor
---

Storybook 11 support ([#28](https://github.com/julien-deramond/component-anatomy/issues/28)).

The addon is built and tested against Storybook 11, and keeps working on
Storybook 10. The panel, the canvas overlays, the two-way hover sync and both
MDX doc blocks are unchanged.

**Added — CSF Next registration.** The package's default export is now a
preview addon, for a `preview.ts` written with `definePreview`:

```ts
// .storybook/preview.ts
import { definePreview } from '@storybook/your-framework';
import componentAnatomy from '@component-anatomy/storybook';

export default definePreview({
  addons: [componentAnatomy()], // 👈
});
```

This is not optional for CSF Next projects: Storybook composes a
`definePreview` project from its own `addons` array and discards the preview
annotations that `.storybook/main.ts` contributes, so without the call above
the canvas decorator never mounts and the Anatomy panel stays empty. Keep the
`main.ts` entry as well — that is what loads the panel — and note the two paths
are mutually exclusive, so the decorator is composed exactly once either way. A
`preview.ts` that is still a plain object needs no change.

Registering this way also types `parameters.anatomy` across the preview's metas
and stories.

**BREAKING — Storybook 9 is no longer supported.** `peerDependencies` moves
from `storybook: >=9.0.0` to `storybook: ^10.0.0 || ^11.0.0-0` (same for the
optional `@storybook/addon-docs` peer). CSF Next registration needs
`definePreviewAddon`, which Storybook only ships from 9.1 onwards. Stay on
`@component-anatomy/storybook@0.3.x` for Storybook 9.

**BREAKING — the package is ESM-only.** The `dist/index.cjs` build and the
`require` export condition are gone. Storybook itself has been ESM-only since
9, and the main entry now pulls in the preview annotations, so a CJS build
would `require()` `storybook/preview-api` and throw on load. The `./manager`
and `./preview` subpaths now also publish their type declarations.
