import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CSJ-wkBB.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_D-DFcKx_.mjs';
export { renderers } from '../renderers.mjs';

const $$BsBadge = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `The outer container \u2014 here a \`<button>\` \u2014 that the badge is attached to. Bootstrap does not define a formal wrapper; the badge is typically an inline child of its host element.

The host element provides the positioning context (\`position: relative\`) when the badge is used in "counter" mode.`
    },
    {
      id: "label",
      name: "Label",
      description: `The host element's visible text. In a button, this is the button label. The badge visually modifies the label's meaning (e.g. "Messages" + "4 unread").`
    },
    {
      id: "badge",
      name: "Badge",
      description: `The \`.badge\` element itself. A \`<span>\` with \`display: inline-flex\`, \`white-space: nowrap\`, \`border-radius\`, and a contextual background.

For counters, add a visually hidden \`<span class="visually-hidden">\` inside the badge to provide context for screen readers \u2014 e.g. "4 unread messages" rather than just "4".`
    },
    {
      id: "sr-hint",
      name: "Screen reader hint",
      description: `A \`.visually-hidden\` (or \`.visually-hidden-focusable\`) span inside or adjacent to the badge that provides context for assistive technology.

Bootstrap's \`.visually-hidden\` applies a CSS-clip technique: the element is 1\xD71px and clipped, remaining in the accessibility tree without affecting visual layout.`
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Bootstrap Badge" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Bootstrap Badge</h1> <p class="page-subtitle">
Bootstrap v5 · <code>.badge</code> — a small status and count indicator.
</p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` <button data-part="root" type="button" class="btn btn-secondary d-inline-flex align-items-center gap-2"> <span data-part="label">Messages</span> <span data-part="badge" class="badge bg-danger rounded-pill">
4
<span data-part="sr-hint" class="visually-hidden">unread messages</span> </span> </button> ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-badge.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-badge.astro";
const $$url = "/bs-badge";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BsBadge,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
