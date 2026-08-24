import { statSync } from 'fs';

/**
 * Asserts that every path in `paths` exists on disk and is a non-empty
 * file. Throws with a clear, actionable message if any are missing or
 * empty.
 *
 * This exists specifically to guard against build tools that can silently
 * no-op and exit 0 — e.g. `tsc --emitDeclarationOnly` against a tsconfig
 * that has `"noEmit": true` emits nothing and reports success. Without a
 * check like this, a build script has no way to notice its own build
 * failed, and a broken `dist/` can reach npm undetected (see issue #12).
 */
export function assertFilesExist(paths, { packageName } = {}) {
  const problems = [];

  for (const path of paths) {
    let stat;
    try {
      stat = statSync(path);
    } catch {
      problems.push(`${path} (missing)`);
      continue;
    }
    if (!stat.isFile() || stat.size === 0) {
      problems.push(`${path} (empty)`);
    }
  }

  if (problems.length > 0) {
    const label = packageName ? `${packageName}: ` : '';
    throw new Error(
      `${label}build produced no output for:\n` +
        problems.map((p) => `  - ${p}`).join('\n') +
        '\n\nThis usually means a build tool (e.g. tsc) exited 0 without ' +
        'emitting anything — check for a "noEmit": true left in the local ' +
        'tsconfig.json, or a missing "rootDir"/"outDir" pair.'
    );
  }
}
