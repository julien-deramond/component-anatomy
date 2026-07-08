# Contributing to Component Anatomy

Thank you for considering a contribution! This document covers how to set up the project locally, how to submit changes, and the conventions we follow.

---

## Project structure

```
component-anatomy/
├── packages/
│   ├── core/          # @component-anatomy/core — framework-agnostic runtime
│   └── astro/         # @component-anatomy/astro — Astro integration
├── examples/
│   ├── astro/         # Astro docs site (runs at localhost:4321)
│   └── plain-html/    # Single-file IIFE demo
├── docs/              # Architecture and product notes
└── research/          # Competitive analysis
```

## Prerequisites

- Node.js — this repo tracks the latest LTS via [`.nvmrc`](./.nvmrc); run `nvm use` if you use nvm (minimum supported: Node ≥ 22.12, required by Astro 7)
- pnpm ≥ 9 (this repo is pnpm-only — see [RELEASING.md](./RELEASING.md) for why)

## Setting up locally

```bash
git clone https://github.com/julien-deramond/component-anatomy
cd component-anatomy
pnpm install
```

## Development workflow

Build the core package first — all other packages depend on it:

```bash
pnpm run build              # builds packages/core
```

Then start the example dev server to see changes live:

```bash
pnpm run dev                # runs examples/astro at localhost:4321
```

To typecheck:

```bash
pnpm run typecheck
```

Internal packages reference each other with the `workspace:^` protocol
(e.g. `packages/astro` depends on `"@component-anatomy/core": "workspace:^"`),
so any change you make in `packages/core` is picked up immediately by
`packages/astro` and the examples — no need to publish or bump a version
while developing.

## Making changes

1. Fork the repo and create a branch from `main`: `git checkout -b feat/my-change`
2. Make your changes, keeping the same code style (2 spaces, LF line endings — `.editorconfig` handles this automatically in most editors)
3. If you touched `packages/core`, rebuild before testing: `pnpm run build`
4. Verify the example site still works: `pnpm run dev` and check the relevant pages
5. If your change should ship in the next release, add a changeset: `pnpm changeset` (see [RELEASING.md](./RELEASING.md))
6. Open a pull request against `main` with a clear description of what changed and why

## Commit conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add keyboard navigation support in panel
fix: overlay position off by 1px on scrolled pages
docs: update API reference for AnatomyOptions
chore: upgrade esbuild to 0.22
```

Common prefixes: `feat`, `fix`, `docs`, `test`, `chore`, `refactor`, `style`, `perf`

## Reporting issues

Open an issue at <https://github.com/julien-deramond/component-anatomy/issues>.

Please include:
- What you expected to happen
- What actually happened
- A minimal reproduction (a CodePen or a link to a branch works well)
- Browser and Node version

## License

By contributing you agree that your contributions will be licensed under the [MIT License](./LICENSE).
