#!/usr/bin/env node
/**
 * Type-checks a single fixture file in strict mode, standing in for what an
 * external consumer's TypeScript compiler would see — resolved against the
 * package's *built* `dist/` output, not its source or workspace tsconfig.
 *
 * This is the regression coverage for issue #12: a package's source can
 * type-check perfectly (that's all `tsc --noEmit` via the `typecheck`
 * script proves) while its build silently fails to emit the declaration
 * files that source compiles down to. A fixture that imports from `dist`
 * catches exactly that gap.
 *
 * Usage: node scripts/typecheck-fixture.mjs <fixture.ts> [cwd]
 * `cwd` defaults to the current working directory; pass it when invoking
 * from the repo root (e.g. `pnpm --filter` runs commands from the package
 * dir already, so it's rarely needed there).
 */
import { execFileSync } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const tsc = resolve(rootDir, 'node_modules/.bin/tsc');

const [, , fixtureRelPath, cwdArg] = process.argv;
if (!fixtureRelPath) {
  console.error('Usage: node scripts/typecheck-fixture.mjs <fixture.ts> [cwd]');
  process.exit(1);
}

const cwd = cwdArg ? resolve(process.cwd(), cwdArg) : process.cwd();

execFileSync(
  tsc,
  [
    '--ignoreConfig', // ignore any tsconfig.json in `cwd` — options below are explicit
    '--noEmit',
    '--strict',
    '--moduleResolution',
    'bundler',
    '--module',
    'ESNext',
    '--target',
    'ES2020',
    '--jsx',
    'react',
    '--skipLibCheck',
    fixtureRelPath,
  ],
  { stdio: 'inherit', cwd }
);

console.log(`✓ ${fixtureRelPath} type-checks against built output`);
