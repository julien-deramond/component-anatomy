import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CSJ-wkBB.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_D-DFcKx_.mjs';
export { renderers } from '../renderers.mjs';

const $$BsAlert = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `The outer \`<div>\` with \`.alert\` and a contextual variant class (e.g. \`.alert-warning\`). Sets the background, border, and text color for the entire component via CSS custom properties.

Carries \`role="alert"\` so assistive technology announces the content immediately when it is injected into the DOM.`
    },
    {
      id: "icon",
      name: "Icon",
      description: `A Bootstrap Icons SVG that visually reinforces the alert's severity. \`aria-hidden="true"\` prevents redundant announcements \u2014 the heading and body text carry the meaning.

Color is inherited from the root's contextual variant, so it automatically matches without additional CSS.`
    },
    {
      id: "heading",
      name: "Heading",
      description: `An optional \`.alert-heading\` element \u2014 typically an \`<h4>\` \u2014 that provides a short summary of the alert.

When present, it becomes the primary label for the alert region. Screen readers will announce it as part of the live region update.`
    },
    {
      id: "body",
      name: "Body",
      description: `The main descriptive content of the alert. Can contain inline elements, links (\`.alert-link\`), or block elements.

Bootstrap's \`.alert-link\` class gives anchor tags a matching underline color that stays accessible against the alert background.`
    },
    {
      id: "dismiss",
      name: "Dismiss",
      description: `The close button \u2014 \`<button class="btn-close">\` with \`data-bs-dismiss="alert"\`.

Bootstrap's JavaScript handles removing the alert from the DOM. Carries \`aria-label="Close"\` since the button has no visible text. The \`.alert-dismissible\` class on the root adds padding-end to prevent the body text from sitting behind the button.`
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Bootstrap Alert" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Bootstrap Alert</h1> <p class="page-subtitle">
Bootstrap v5 · <code>.alert .alert-warning .alert-dismissible</code> </p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` <div data-part="root" class="alert alert-warning alert-dismissible d-flex align-items-start gap-3" role="alert" style="max-width: 480px;"> <span data-part="icon" aria-hidden="true" style="flex-shrink:0; margin-top:2px;"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"> <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path> </svg> </span> <div> <h4 data-part="heading" class="alert-heading mb-1" style="font-size:0.95rem;">Storage almost full</h4> <p data-part="body" class="mb-0" style="font-size:0.875rem;">
You've used 90% of your storage quota.
<a href="#" class="alert-link">Upgrade your plan</a> to avoid interruptions.
</p> </div> <button data-part="dismiss" type="button" class="btn-close ms-auto" aria-label="Close"></button> </div> ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-alert.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-alert.astro";
const $$url = "/bs-alert";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BsAlert,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
