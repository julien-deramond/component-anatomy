#!/usr/bin/env node
// Regenerates the hover-sync demo from the built Astro example:
//   examples/astro/public/demo/anatomy.mp4         docs home loop
//   examples/astro/public/demo/anatomy-poster.png  docs home poster (and reduced-motion still)
//   docs/media/anatomy.gif                         README hero (kept under 2 MB)
//
// Usage: pnpm run demo [-- --skip-build]
//
// The script builds the example, serves it with `astro preview`, drives it with Playwright
// (Chromium) and encodes the recording with the ffmpeg binary from `ffmpeg-static`, so nothing
// has to be installed on the machine besides `pnpm install` and
// `pnpm exec playwright install chromium`.
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4399;
const URL = `http://localhost:${PORT}/`;
const VIEWPORT = { width: 1440, height: 900 };
const OUT_VIDEO = join(root, 'examples/astro/public/demo/anatomy.mp4');
const OUT_POSTER = join(root, 'examples/astro/public/demo/anatomy-poster.png');
const OUT_GIF = join(root, 'docs/media/anatomy.gif');
const GIF_LIMIT = 2 * 1024 * 1024;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const even = (n) => Math.round(n / 2) * 2;

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: root, stdio: 'inherit', ...opts });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed (${r.status})`);
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(URL)).ok) return;
    } catch {}
    await sleep(500);
  }
  throw new Error(`preview server did not start on ${URL}`);
}

if (!process.argv.includes('--skip-build')) {
  run('pnpm', ['run', 'build:packages']);
  run('pnpm', ['--filter', 'examples-astro', 'build']);
}

mkdirSync(dirname(OUT_VIDEO), { recursive: true });
mkdirSync(dirname(OUT_GIF), { recursive: true });
const tmp = mkdtempSync(join(tmpdir(), 'anatomy-demo-'));

const server = spawn('pnpm', ['--filter', 'examples-astro', 'exec', 'astro', 'preview', '--port', String(PORT)], {
  cwd: root,
  stdio: 'ignore',
});

let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: tmp, size: VIEWPORT },
  });
  const t0 = Date.now();
  const page = await context.newPage();
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);
  const demo = page.locator('.demo');
  await demo.scrollIntoViewIfNeeded();
  await page.mouse.move(VIEWPORT.width / 2, VIEWPORT.height - 40);
  await sleep(500);

  const box = await demo.boundingBox();
  const centre = async (locator) => {
    const b = await locator.boundingBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  };
  const hover = async (locator, hold) => {
    const { x, y } = await centre(locator);
    await page.mouse.move(x, y, { steps: 24 });
    await sleep(hold);
  };
  const entry = (id) => page.locator(`.demo [data-anatomy-item="${id}"]`);
  const home = { x: VIEWPORT.width / 2, y: VIEWPORT.height - 40 };

  // Storyboard (about 7 s). Hover only, and it ends where it starts, so the loop is seamless.
  const start = Date.now() - t0;
  await sleep(700); // idle
  await hover(entry('track'), 1000); // panel entry -> overlay on the live track
  await hover(entry('thumb'), 900); // panel entry -> overlay on the live thumb
  await page.screenshot({ path: OUT_POSTER, clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
  await hover(page.locator('.demo [data-part="thumb"]'), 1300); // live thumb -> panel entry follows
  await hover(page.locator('.demo [data-part="output"]'), 1000); // live output
  await page.mouse.move(home.x, home.y, { steps: 30 });
  await sleep(700); // idle again
  const end = Date.now() - t0;

  const video = page.video();
  await context.close();
  const webm = await video.path();

  // Crop to the demo block (plus a small margin), trim the page load.
  const pad = 16;
  const cw = even(box.width + pad * 2);
  const ch = even(box.height + pad * 2);
  const cx = Math.max(0, even(box.x - pad));
  const cy = Math.max(0, even(box.y - pad));
  const crop = `crop=${cw}:${ch}:${cx}:${cy}`;
  const trim = ['-ss', (start / 1000).toFixed(2), '-t', ((end - start) / 1000).toFixed(2)];

  run(ffmpegPath, ['-y', '-loglevel', 'error', ...trim, '-i', webm, '-vf', `${crop},fps=30`, '-an',
    '-c:v', 'libx264', '-crf', '24', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT_VIDEO]);

  // GIF: try the widest width that fits under the limit.
  for (const [width, fps] of [[800, 15], [720, 12], [640, 12], [560, 10]]) {
    const filter = `${crop},fps=${fps},scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;
    run(ffmpegPath, ['-y', '-loglevel', 'error', ...trim, '-i', webm, '-filter_complex', filter, '-loop', '0', OUT_GIF]);
    const size = statSync(OUT_GIF).size;
    console.log(`gif ${width}px @${fps}fps: ${(size / 1024).toFixed(0)} KB`);
    if (size <= GIF_LIMIT) break;
  }
  if (statSync(OUT_GIF).size > GIF_LIMIT) throw new Error('GIF is still over 2 MB at the smallest size');
  console.log(`mp4: ${(statSync(OUT_VIDEO).size / 1024).toFixed(0)} KB`);
} finally {
  await browser?.close();
  server.kill();
  rmSync(tmp, { recursive: true, force: true });
}
