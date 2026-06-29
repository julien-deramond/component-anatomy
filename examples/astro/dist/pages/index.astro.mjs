import { c as createComponent, b as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BgZlRxbh.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CRvh2TnG.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Home" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Component Anatomy</h1> <p class="page-subtitle">
Interactive anatomy documentation for your design system components.
</p> <div style="display:flex; gap:1rem; flex-wrap:wrap;"> <a href="/button" style="
      display:inline-flex; align-items:center; gap:0.4rem;
      padding:0.6rem 1.2rem; border-radius:6px;
      background:#4f46e5; color:#fff;
      font-size:0.875rem; font-weight:500;
      text-decoration:none;
    ">
Button anatomy →
</a> <a href="/slider" style="
      display:inline-flex; align-items:center; gap:0.4rem;
      padding:0.6rem 1.2rem; border-radius:6px;
      border:1px solid #e5e7eb; color:#374151;
      font-size:0.875rem; font-weight:500;
      text-decoration:none;
    ">
Slider anatomy →
</a> </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/index.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
