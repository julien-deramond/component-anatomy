# Releasing

This repo publishes each package under `packages/*` (`@component-anatomy/core`,
`@component-anatomy/astro`, and any future `@component-anatomy/*` package)
**independently**, using [Changesets](https://github.com/changesets/changesets).

Releasing is a **manual, local process** — there is no CI automation that
versions or publishes packages for you. `.github/workflows/` only runs CI
(build/typecheck) and the GitHub Pages example deploy; publishing to npm
always happens from your machine, on purpose.

This repo is **pnpm-only**. That's a deliberate choice (see "Why pnpm-only"
below) — npm workspaces are not supported here.

You never hand-edit a `version` field. Changesets computes it for you, and
it handles one important rule automatically:

> **If `core` changes, every package that depends on `core` gets a patch
> bump too — even if you didn't touch that package.** If you only fix the
> Astro plugin, only the Astro plugin bumps.

This document explains why, and exactly what to run.

## Why pnpm-only

Internal dependencies between packages use the `workspace:^` protocol —
e.g. `packages/astro/package.json` has:

```json
"dependencies": {
  "@component-anatomy/core": "workspace:^"
}
```

`workspace:^` means "always resolve to whatever's in `packages/core` right
now, in this repo, regardless of its version field." That's what lets you
develop `core` and `astro` together without ever bumping a version or
publishing just to test a change locally.

At publish time, Changesets/pnpm automatically rewrites `workspace:^` to a
real semver range based on `core`'s version at that moment (e.g.
`^1.2.0`) before the package is published to npm — so consumers who install
`@component-anatomy/astro` from the registry get a correct, real
constraint, never the literal string `workspace:^`.

**The catch: only pnpm and Yarn Berry understand the `workspace:` protocol.
npm does not** (still true as of npm 11 / 2026). If you tried to `npm
install` in this repo, it would fail trying to resolve `workspace:^` as
if it were a package name. That's the tradeoff for getting "always use the
locally developed version" for free — this repo can't support npm
workspaces alongside it. If you don't have pnpm, see the Prerequisites in
[CONTRIBUTING.md](./CONTRIBUTING.md).

## How versioning works here

Each package has its own version number and its own `CHANGELOG.md`. There is
**no lockstep** — `@component-anatomy/astro` might be on `1.4.0` while
`@component-anatomy/core` is on `1.2.0`.

The one exception is dependency propagation: because `astro` depends on
`core` via `workspace:^`, whenever `core` gets a version bump, Changesets
automatically:

1. Bumps `astro` (and any other package that depends on `core`) by a
   **patch**, even with no changeset written for it.
2. Resolves the `workspace:^` range to the correct concrete semver range
   for publishing.
3. Adds a `CHANGELOG.md` entry: `Updated dependencies: @component-anatomy/core@x.y.z`.

This is controlled by `.changeset/config.json`:

```json
{
  "fixed": [],
  "linked": [],
  "updateInternalDependencies": "patch",
  "ignore": ["examples-astro", "examples-plain-html"]
}
```

- `fixed` / `linked` are intentionally **empty** — those would force
  packages to always share one version number, which is the opposite of
  what we want.
- `ignore` excludes the example apps in `examples/*`. They're private, not
  published, and should never be touched by a version bump even though they
  depend on the packages.

This cascade behavior was validated locally before writing this doc: a test
changeset against `core` produced a patch bump on `core` *and* an automatic
patch bump + changelog entry on `astro` — confirming the mechanism works as
designed.

## Day-to-day workflow

**1. Make your change** on a branch, in whichever package(s) it touches.
Since dependencies use `workspace:^`, `astro` always sees your local
`core` changes immediately (after a rebuild) — no version bump needed
during development.

**2. Add a changeset** describing it:

```bash
pnpm changeset
```

This asks which package(s) changed, what kind of bump each needs
(`patch` / `minor` / `major`), and for a human-readable summary (this becomes
the changelog entry). It writes a markdown file into `.changeset/`. Commit
that file along with your code change and open a PR (or commit directly if
you're working solo).

- Only select the package(s) you actually changed. Don't manually select
  `astro` just because it depends on `core` — the cascade handles that for
  you at version time.
- A single PR/commit can include multiple changesets if it touches multiple
  packages independently.

**3. Merge to `main`.** Changesets pile up in `.changeset/` until you
decide to cut a release — merging doesn't publish anything.

## Cutting a release (all manual)

When you're ready to actually release whatever changesets have accumulated
on `main`:

```bash
# 1. Pull the latest main
git checkout main && git pull

# 2. Apply pending changesets: bumps every changed package's version
#    (+ cascades patch bumps to dependents), updates each CHANGELOG.md,
#    and deletes the consumed changeset files.
pnpm run version

# 3. Review the diff — check versions and changelog entries look right.
git diff

# 4. Commit the version bump.
git add -A
git commit -m "chore: version packages"

# 5. Build every publishable package, then publish to npm. This is also
#    the step where `workspace:^` gets rewritten to a real semver range
#    in the published package.json — your local package.json files still
#    show `workspace:^` afterward, that's expected.
pnpm run release

# 6. Push the commit and the git tags changeset publish created.
git push --follow-tags
```

You'll need to be logged into npm (`npm whoami`) with publish rights on the
`@component-anatomy` scope before step 5 — `pnpm publish` (used internally
by `changeset publish`) still publishes to the npm registry regardless of
pnpm being your workspace tool.

`pnpm run version` and `pnpm run release` are just aliases:

- `"version": "changeset version"`
- `"release": "pnpm run build:packages && changeset publish"`

## First release: 0.0.1

Every package currently starts at `0.0.1`. This initial version was set
directly in each `package.json` — there's no prior published version for
Changesets to diff against, so the normal changeset-driven bump flow doesn't
apply for a package's very first release. Once `0.0.1` is published for a
package, all *subsequent* changes to it go through the workflow above.

To ship `0.0.1` for the first time:

```bash
pnpm install
pnpm run build:packages
pnpm run typecheck
pnpm run release   # runs `changeset publish`; publishes any package whose
                    # version isn't yet on the npm registry
git push --follow-tags
```

## Required setup

- You (or whoever runs the release) need an npm account with publish
  rights on the `@component-anatomy` scope, logged in locally via
  `npm login` (or `npm adduser`) before running `pnpm run release`. This
  is about npm registry auth, unrelated to using pnpm as the workspace
  tool.
- Scoped packages (`@component-anatomy/*`) default to *restricted* on npm.
  Each publishable package sets `"publishConfig": { "access": "public" }`
  in its `package.json` so publishing doesn't fail on a free npm account.
- No GitHub secrets are needed — nothing in CI touches npm.

## Adding a new package later (React, Storybook, …)

When `packages/react` or `packages/storybook` is created:

1. Give it `"version": "0.0.1"` and `"publishConfig": { "access": "public" }`,
   matching the pattern in `packages/core` and `packages/astro`.
2. If it depends on `@component-anatomy/core`, declare it as
   `"@component-anatomy/core": "workspace:^"` — never a plain semver range
   or `"*"`. This is what makes local development always use the in-repo
   `core`, and lets Changesets rewrite it to a real range at publish time.
3. That's it. Because it lives under `packages/*`, `pnpm-workspace.yaml`
   and `.changeset/config.json` already pick it up — no extra Changesets
   config needed. It will version independently and inherit the same
   core-changes-cascade behavior automatically.
4. Add it to `build:packages` in the root `package.json` so `pnpm run
   release` builds it too.

For its own first release, publish `0.0.1` the same way as above — it isn't
tied to whatever version `core` or `astro` happen to be on at the time.
