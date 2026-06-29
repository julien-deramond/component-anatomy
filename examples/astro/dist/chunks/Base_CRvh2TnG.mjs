import { c as createComponent, f as renderHead, d as addAttribute, e as renderSlot, r as renderTemplate, a as createAstro } from './astro/server_BgZlRxbh.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro = createAstro();
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-5hce7sga> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Component Anatomy</title>${renderHead()}</head> <body data-astro-cid-5hce7sga> <header class="site-header" data-astro-cid-5hce7sga> <a href="/" class="site-logo" data-astro-cid-5hce7sga>Component Anatomy</a> <nav class="site-nav" data-astro-cid-5hce7sga> <a href="/button"${addAttribute(Astro2.url.pathname === "/button" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>Button</a> <a href="/slider"${addAttribute(Astro2.url.pathname === "/slider" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>Slider</a> </nav> </header> <main class="page" data-astro-cid-5hce7sga> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/layouts/Base.astro", void 0);

export { $$Base as $ };
