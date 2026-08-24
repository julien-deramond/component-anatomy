---
"@component-anatomy/storybook": patch
---

Fix the published package shipping with no TypeScript declaration files.

`packages/storybook/tsconfig.json` had `"noEmit": true`, which silently
suppressed the `tsc --emitDeclarationOnly` step in `build.mjs` — `tsc`
exited 0 having emitted nothing, so the build script reported success
while `dist/` never got `index.d.ts`, `manager.d.ts`, or `preview.d.ts`,
even though `package.json`'s `types` and `exports` fields promised them.
Consumers under strict TypeScript settings saw an `any` fallback or a
module resolution failure (#12).
