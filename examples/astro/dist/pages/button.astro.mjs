import { c as createComponent, m as maybeRenderHead, r as renderTemplate, a as createAstro, b as renderComponent } from '../chunks/astro/server_BgZlRxbh.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CRvh2TnG.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_DuJ8-mVO.mjs';
import 'clsx';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Button$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Button$1;
  const { label = "Save changes", icon = true } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<button data-part="root" class="btn" type="button" data-astro-cid-vnzlvqnm> ${icon && renderTemplate`<span data-part="icon" class="btn-icon" aria-hidden="true" data-astro-cid-vnzlvqnm> <svg width="16" height="16" viewBox="0 0 16 16" fill="none" data-astro-cid-vnzlvqnm> <path d="M2 8.5L6 12.5L14 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-vnzlvqnm></path> </svg> </span>`} <span data-part="label" class="btn-label" data-astro-cid-vnzlvqnm>${label}</span> </button> `;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/components/Button.astro", void 0);

const $$Button = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `
The outer \`<button>\` element. It is the interactive, focusable container
for the entire component.

Carries \`type="button"\` to prevent accidental form submission, and
receives all native button attributes like \`disabled\`, \`aria-label\`, etc.
    `.trim()
    },
    {
      id: "icon",
      name: "Icon",
      description: `
An optional decorative icon rendered before the label.

Marked \`aria-hidden="true"\` so screen readers skip it \u2014 the label
carries the accessible name. The icon slot accepts any inline SVG
or icon component.
    `.trim()
    },
    {
      id: "label",
      name: "Label",
      description: `
The visible text content of the button.

Wrapped in a \`<span>\` to allow independent styling (truncation,
font-weight overrides) without affecting the root's layout. This
span is the primary source of the button's accessible name when
no explicit \`aria-label\` is set.
    `.trim()
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Button" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Button</h1> <p class="page-subtitle">
A pressable element that triggers an action. Hover a part name or the live
    component to explore the anatomy.
</p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Button", $$Button$1, {})} ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/button.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/button.astro";
const $$url = "/button";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Button,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
