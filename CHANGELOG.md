# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `@component-anatomy/core` — framework-agnostic runtime with `createAnatomy()` API
- `@component-anatomy/astro` — Astro integration with SSR Markdown rendering and client hydration
- Bidirectional hover sync: component preview ↔ anatomy documentation panel
- Floating label chip above overlay (DevTools-style part name indicator)
- Scroll-into-view on the panel when hovering a component element
- Sticky active-part pill for panels with many entries
- Auto-discovery mode: infers part names from `data-part` attributes when no definitions are provided
- `MutationObserver` support for dynamic DOM updates
- Keyboard navigation via panel entries (`tabindex="0"`, focus triggers overlay)
- Preview area made non-focusable (`aria-hidden`, `tabindex="-1"` on all interactive children)
- CSS custom properties for full theming (`--ca-overlay-bg`, `--ca-overlay-border`, etc.)
- Example: `examples/astro` — Astro docs site with 7 component pages (custom + Bootstrap v5)
- Example: `examples/plain-html` — single-file demo using the IIFE build, no build step
