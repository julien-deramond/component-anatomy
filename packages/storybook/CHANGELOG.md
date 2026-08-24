# @component-anatomy/storybook

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
