import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CSJ-wkBB.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_D-DFcKx_.mjs';
export { renderers } from '../renderers.mjs';

const $$BsButton = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `The \`<button>\` element itself. Carries Bootstrap's \`.btn\` and variant class (e.g. \`.btn-primary\`). All pointer, focus, and keyboard events are attached here.

Bootstrap sets \`display: inline-flex\`, \`user-select: none\`, and a consistent padding scale via its CSS custom properties.`
    },
    {
      id: "icon",
      name: "Icon",
      description: `An optional leading icon rendered via Bootstrap Icons SVG. Marked \`aria-hidden="true"\` \u2014 the label is the accessible name.

Bootstrap does not define an icon slot natively; this is a common pattern in consuming design systems.`
    },
    {
      id: "label",
      name: "Label",
      description: `The visible button text. In plain Bootstrap usage this is a direct text node inside the \`<button>\`. Wrapping it in a \`<span>\` enables independent truncation and styling without affecting the button's flex layout.`
    },
    {
      id: "spinner",
      name: "Spinner",
      description: `A Bootstrap \`.spinner-border\` or \`.spinner-grow\` element shown during async operations.

Typically toggled via \`aria-disabled\` and class manipulation. Communicates loading state to both visual and assistive technology users via \`role="status"\`.`
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Bootstrap Button" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Bootstrap Button</h1> <p class="page-subtitle">
Bootstrap v5 · <code>.btn .btn-primary</code> — hover a part or the component to explore.
</p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` <button data-part="root" type="button" class="btn btn-primary d-inline-flex align-items-center gap-2"> <span data-part="icon" aria-hidden="true"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path> </svg> </span> <span data-part="label">Add item</span> <span data-part="spinner" class="spinner-border spinner-border-sm ms-1" role="status" aria-label="Loading" style="display:none"></span> </button> ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-button.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-button.astro";
const $$url = "/bs-button";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BsButton,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
