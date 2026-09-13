# @component-anatomy/storybook

## 0.4.0

### Minor Changes

- [#29](https://github.com/julien-deramond/component-anatomy/pull/29) [`e43d243`](https://github.com/julien-deramond/component-anatomy/commit/e43d243fd8b31525440e8443bd7b7e809b6e642d) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Storybook 11 support ([#28](https://github.com/julien-deramond/component-anatomy/issues/28)).

  The addon is built and tested against Storybook 11, and keeps working on
  Storybook 10. The panel, the canvas overlays, the two-way hover sync and both
  MDX doc blocks are unchanged.

  **Added — CSF Next registration.** The package's default export is now a
  preview addon, for a `preview.ts` written with `definePreview`:

  ```ts
  // .storybook/preview.ts
  import { definePreview } from "@storybook/your-framework";
  import componentAnatomy from "@component-anatomy/storybook";

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

## 0.3.0

### Minor Changes

- [#25](https://github.com/julien-deramond/component-anatomy/pull/25) [`ce64d5e`](https://github.com/julien-deramond/component-anatomy/commit/ce64d5e3d91b087a75f0bbc6fbb5bed403d9e01e) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Add `<Anatomy>`, a doc block that pairs the canvas with its table and tightens the gap between them ([#13](https://github.com/julien-deramond/component-anatomy/issues/13#issuecomment-5475936860)).

  Until now, `<Anatomy>` rendered the table alone, and every MDX example paired it by hand with a `<Canvas of={…} />` above it — each carrying its own show-code button and Storybook's default ~40px canvas margin, both mostly noise for an anatomy example. `<Anatomy>` now renders the canvas and the table together, drops the canvas's show-code button by default (`sourceState="none"`, overridable), and tightens the canvas's bottom margin — no `preview-head.html` setup required, the block injects its own scoped rule.

  The table-only block is still available, renamed to `<AnatomyTable>`, for a hand-placed `<Canvas>` — a custom layout, or one that keeps its source panel:

  ```mdx
  import { Anatomy } from "@component-anatomy/storybook/blocks";

  <Anatomy of={ButtonStories.Anatomy} />
  ```

  ```mdx
  import { Canvas } from "@storybook/addon-docs/blocks";
  import { AnatomyTable } from "@component-anatomy/storybook/blocks";

  <Canvas of={ButtonStories.Anatomy} />
  <AnatomyTable of={ButtonStories.Anatomy} />
  ```

  **Breaking:** anyone already importing `<Anatomy>` for the table-only behavior needs to switch that usage to `<AnatomyTable>` — `<Anatomy>` now always renders a canvas too. The package is still pre-1.0, where semver itself treats a minor bump as license to break: nothing here has a stability guarantee yet, so the rename ships as the change it actually is rather than routing around it with a second, differently-named export.

## 0.2.0

### Minor Changes

- [#20](https://github.com/julien-deramond/component-anatomy/pull/20) [`a59d9d2`](https://github.com/julien-deramond/component-anatomy/commit/a59d9d204f16e733913054d9d9cb09ee759f0fb8) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Make the anatomy table follow the story's `preset` and `theme`, and keep its accent legible on the panel it is drawn on ([#13](https://github.com/julien-deramond/component-anatomy/issues/13#issuecomment-5475258915)).

  The table accented its active row with the built-in indigo unless a story set `anatomy.theme.accent`. A `preset` was ignored, so `preset: 'contrast'` painted black-and-yellow overlays on the canvas while the panel beside them stayed indigo. Both the addon panel and the `<Anatomy>` doc block now resolve the same `--ca-label-bg` the overlays use, whichever preset is in play.

  Because a preset is designed against your component and not against Storybook's own panel — which is dark by default — the resolved accent is also checked for contrast there and adjusted when it falls under WCAG AA. `contrast` keeps its black on a light panel and takes its yellow on a dark one; a color you chose yourself is darkened or lightened rather than swapped for one you did not choose. The built-in indigo, previously sitting at 2.5:1 in a dark docs page, is lifted instead of left unreadable. Light-panel rendering is unchanged for every preset.

### Patch Changes

- [#22](https://github.com/julien-deramond/component-anatomy/pull/22) [`35ca199`](https://github.com/julien-deramond/component-anatomy/commit/35ca1994aa8b08d79bb694d37921289072adbac9) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Render the `<Anatomy>` block's "no parts found" message as markup instead of markdown.

  Both variants of it were plain strings carrying markdown backticks — `` `of` ``, `` `parts` ``, `` `<Canvas of={…} />` `` — which a docs page shows verbatim, backticks and all. They now use the same inline-code styling as every other message the block renders.

- Updated dependencies [[`35ca199`](https://github.com/julien-deramond/component-anatomy/commit/35ca1994aa8b08d79bb694d37921289072adbac9), [`c2e503d`](https://github.com/julien-deramond/component-anatomy/commit/c2e503d339948f780b28d202138bd3db2878e74c)]:
  - @component-anatomy/core@0.1.0

## 0.1.0

### Minor Changes

- [#17](https://github.com/julien-deramond/component-anatomy/pull/17) [`b852107`](https://github.com/julien-deramond/component-anatomy/commit/b8521071775d6218d9242b403c2b46cc7a209816) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Add an `<Anatomy>` doc block so the anatomy table can be rendered in MDX, alongside the preview ([#13](https://github.com/julien-deramond/component-anatomy/issues/13)).

  ```mdx
  import { Canvas, Meta } from "@storybook/addon-docs/blocks";
  import { Anatomy } from "@component-anatomy/storybook/blocks";

  import * as ButtonStories from "./Button.stories";

  <Meta of={ButtonStories} />

  <Canvas of={ButtonStories.Anatomy} />
  <Anatomy of={ButtonStories.Anatomy} />
  ```

  `of` accepts a CSF story export (reads its `parameters.anatomy`) or a whole CSF module (reads the meta's). On an attached docs page it can be omitted, falling back to the page's current story. Two-way hover sync with the canvas works exactly as it does in the panel, and auto-discovery works too when the story is rendered on the page. `parts` overrides the resolved list; `sync={false}` renders a static table.

  `@storybook/addon-docs` and `react` are optional peer dependencies — only `@component-anatomy/storybook/blocks` needs them, and the addon panel is unaffected.

  Alongside this:

  - Channel events now carry the `storyId` they concern, and every listener filters on it. A docs page mounts several stories at once, so without addressing, hovering a part in one block highlighted the matching part in every other story on the page. A missing id on either side still matches, so mixed builds interoperate.
  - The table resolves its chrome colors and fonts from Storybook's theme instead of hardcoded light-theme values, so it reads correctly in a dark docs page. The accent color is unchanged.

## 0.0.2

### Patch Changes

- [#16](https://github.com/julien-deramond/component-anatomy/pull/16) [`153a7ef`](https://github.com/julien-deramond/component-anatomy/commit/153a7ef80ab7e4d154b975a9fe0509937d6e8874) Thanks [@julien-deramond](https://github.com/julien-deramond)! - Fix the published package shipping with no TypeScript declaration files.

  `packages/storybook/tsconfig.json` had `"noEmit": true`, which silently
  suppressed the `tsc --emitDeclarationOnly` step in `build.mjs` — `tsc`
  exited 0 having emitted nothing, so the build script reported success
  while `dist/` never got `index.d.ts`, `manager.d.ts`, or `preview.d.ts`,
  even though `package.json`'s `types` and `exports` fields promised them.
  Consumers under strict TypeScript settings saw an `any` fallback or a
  module resolution failure ([#12](https://github.com/julien-deramond/component-anatomy/issues/12)).
