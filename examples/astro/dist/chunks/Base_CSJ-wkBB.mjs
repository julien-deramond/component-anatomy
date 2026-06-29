import { c as createComponent, f as renderHead, d as addAttribute, e as renderSlot, a as renderTemplate, b as createAstro } from './astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                            */

const $$Astro = createAstro();
const $$Base = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Base;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-5hce7sga> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Component Anatomy</title><!-- Bootstrap v5 (used by Bootstrap example pages) --><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" crossorigin="anonymous">${renderHead()}</head> <body data-astro-cid-5hce7sga> <header class="site-header" data-astro-cid-5hce7sga> <a href="/" class="site-logo" data-astro-cid-5hce7sga>Component Anatomy</a> <nav class="site-nav" data-astro-cid-5hce7sga> <a href="/button"${addAttribute(Astro2.url.pathname === "/button" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>Button</a> <a href="/slider"${addAttribute(Astro2.url.pathname === "/slider" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>Slider</a> <span class="site-nav-sep" data-astro-cid-5hce7sga>·</span> <a href="/bs-button"${addAttribute(Astro2.url.pathname === "/bs-button" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>BS Button</a> <a href="/bs-alert"${addAttribute(Astro2.url.pathname === "/bs-alert" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>BS Alert</a> <a href="/bs-card"${addAttribute(Astro2.url.pathname === "/bs-card" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>BS Card</a> <a href="/bs-badge"${addAttribute(Astro2.url.pathname === "/bs-badge" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>BS Badge</a> <a href="/bs-navbar"${addAttribute(Astro2.url.pathname === "/bs-navbar" ? "page" : void 0, "aria-current")} data-astro-cid-5hce7sga>BS Navbar</a> </nav> </header> <main class="page" data-astro-cid-5hce7sga> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/layouts/Base.astro", void 0);

export { $$Base as $ };
