# @component-anatomy/storybook

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
