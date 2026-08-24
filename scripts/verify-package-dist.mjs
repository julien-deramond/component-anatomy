#!/usr/bin/env node
/**
 * Verifies that every publishable package's built output actually matches
 * what its package.json promises consumers (main/module/types/exports).
 *
 * This exists because a build tool can exit 0 having emitted nothing — see
 * issue #12: @component-anatomy/storybook shipped to npm 0.0.1 with
 * `types`/`exports["."].types` pointing at `dist/index.d.ts`, a file the
 * build never actually produced (a stray `"noEmit": true` in that
 * package's tsconfig.json silently swallowed the declaration-emit step).
 *
 * `pnpm run typecheck` checks *source* correctness, which says nothing
 * about whether the build actually wrote what package.json promises. This
 * script checks that contract instead, after the build has run.
 *
 * Run after `pnpm run build:packages`. Wired into CI (.github/workflows/ci.yml)
 * and into the root `release` script so `pnpm run release` refuses to hand
 * a broken package to `changeset publish`.
 */
import { readFileSync, statSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const packagesDir = join(rootDir, 'packages');

/** Recursively collects every string leaf value out of a package.json "exports" field. */
function collectExportPaths(exportsField, out) {
  if (exportsField == null) return;
  if (typeof exportsField === 'string') {
    out.add(exportsField);
    return;
  }
  if (typeof exportsField === 'object') {
    for (const value of Object.values(exportsField)) {
      collectExportPaths(value, out);
    }
  }
}

/** Returns a list of human-readable problems for one package, empty if all good. */
function checkPackage(pkgDir, pkg) {
  const paths = new Set();

  for (const field of ['main', 'module', 'types']) {
    if (typeof pkg[field] === 'string') paths.add(pkg[field]);
  }
  collectExportPaths(pkg.exports, paths);

  const problems = [];
  for (const relPath of paths) {
    // Skip subpath patterns (none today, but exports can use "*" wildcards)
    // and the always-present package.json self-export.
    if (relPath.includes('*') || relPath === './package.json') continue;

    const abs = join(pkgDir, relPath);
    let stat;
    try {
      stat = statSync(abs);
    } catch {
      problems.push(`${relPath} (missing)`);
      continue;
    }
    if (!stat.isFile() || stat.size === 0) {
      problems.push(`${relPath} (empty)`);
    }
  }
  return problems;
}

const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(packagesDir, entry.name));

let hasFailures = false;
let checkedAny = false;

for (const pkgDir of packageDirs) {
  const pkgJsonPath = join(pkgDir, 'package.json');
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
  } catch {
    continue;
  }

  // Only packages meant to be published to npm carry this contract.
  if (!pkg.publishConfig || pkg.publishConfig.access !== 'public') continue;

  checkedAny = true;
  const problems = checkPackage(pkgDir, pkg);
  if (problems.length > 0) {
    hasFailures = true;
    console.error(`✗ ${pkg.name}: package.json promises files that don't exist (or are empty):`);
    for (const problem of problems) console.error(`    - ${problem}`);
  } else {
    console.log(`✓ ${pkg.name}: dist matches package.json`);
  }
}

if (!checkedAny) {
  console.error('No publishable packages found under packages/* — check publishConfig.access.');
  process.exit(1);
}

if (hasFailures) {
  console.error(
    '\nRun `pnpm run build:packages` and re-check, or inspect the failing ' +
      "package's build script/tsconfig.json — a stray \"noEmit\": true, or a " +
      'missing "rootDir"/"outDir" pair, is a common cause (see issue #12).'
  );
  process.exit(1);
}
