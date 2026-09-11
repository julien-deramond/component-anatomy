---
'@component-anatomy/storybook': major
---

Add Storybook 11 support.

- The package root now default-exports a [CSF Next](https://storybook.js.org/docs/api/csf/csf-next) addon factory (`definePreviewAddon`). CSF Next users register the addon's preview annotations in `.storybook/preview.ts` with `addons: [componentAnatomy()]`, and get typed `parameters.anatomy` via the new `AnatomyTypes` interface.
- The `./preview` entry now default-exports its project annotations (the `decorators` named export was removed). Classic CSF projects that register the addon in `.storybook/main.ts` are unaffected.
- Peer dependency range changed from `storybook >=9.0.0` to `^10.0.0 || ^11.0.0`. Storybook 9 is no longer supported; stay on the previous major if you need it.
