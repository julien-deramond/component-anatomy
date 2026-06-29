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

- Node.js ≥ 18
- npm ≥ 8 (or pnpm ≥ 8)

## Setting up locally

```bash
git clone https://github.com/julienderamond/component-anatomy
cd component-anatomy
npm install
```

## Development workflow

Build the core package first — all other packages depend on it:

```bash
npm run build              # builds packages/core
```

Then start the example dev server to see changes live:

```bash
npm run dev                # runs examples/astro at localhost:4321
```

To typecheck:

```bash
npm run typecheck
```

## Making changes

1. Fork the repo and create a branch from `main`: `git checkout -b feat/my-change`
2. Make your changes, keeping the same code style (2 spaces, LF line endings — `.editorconfig` handles this automatically in most editors)
3. If you touched `packages/core`, rebuild before testing: `npm run build`
4. Verify the example site still works: `npm run dev` and check the relevant pages
5. Open a pull request against `main` with a clear description of what changed and why

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

Open an issue at <https://github.com/julienderamond/component-anatomy/issues>.

Please include:
- What you expected to happen
- What actually happened
- A minimal reproduction (a CodePen or a link to a branch works well)
- Browser and Node version

## License

By contributing you agree that your contributions will be licensed under the [MIT License](./LICENSE).
