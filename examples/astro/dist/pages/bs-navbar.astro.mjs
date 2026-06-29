import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CSJ-wkBB.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_D-DFcKx_.mjs';
export { renderers } from '../renderers.mjs';

const $$BsNavbar = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `The \`<nav>\` element with \`.navbar\`. Sets \`display: flex\`, \`flex-wrap: wrap\`, and \`align-items: center\`.

Carries \`aria-label\` or is contained in a \`<header>\` landmark so assistive technology can identify it as site navigation. Bootstrap adds \`position: relative\` to allow dropdowns to escape the flex container.`
    },
    {
      id: "brand",
      name: "Brand",
      description: `The \`.navbar-brand\` \u2014 typically an \`<a>\` linking to the home page. Bootstrap gives it slightly larger font-size and removes the default link underline.

Can contain an image (logo) or text, or both. When both are used, add a small margin between them via Bootstrap's spacing utilities.`
    },
    {
      id: "toggler",
      name: "Toggler",
      description: `The \`.navbar-toggler\` button \u2014 visible only on breakpoints where the nav collapses. Triggers the collapse via \`data-bs-toggle="collapse"\` and \`data-bs-target\`.

Contains a \`.navbar-toggler-icon\` span (CSS hamburger icon). The button itself should carry \`aria-controls\` pointing to the collapse container and \`aria-expanded\` to reflect state.`
    },
    {
      id: "collapse",
      name: "Collapse",
      description: `The \`.collapse.navbar-collapse\` container wraps the nav links and any other right-side content. Bootstrap's JS toggles the \`.show\` class on this element.

Sets \`flex-basis: 100%\` on mobile so the expanded nav takes its own row, and \`flex-grow: 1\` on desktop so it fills the remaining space.`
    },
    {
      id: "nav",
      name: "Nav",
      description: `The \`.navbar-nav\` list \u2014 a \`<ul>\` with \`display: flex\`, \`flex-direction: column\` on mobile and \`row\` on desktop. Each list item is a \`.nav-item\` containing a \`.nav-link\`.

Active links should carry \`aria-current="page"\` rather than just the \`.active\` class.`
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Bootstrap Navbar" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Bootstrap Navbar</h1> <p class="page-subtitle">
Bootstrap v5 · <code>.navbar</code> — responsive navigation header.
</p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` <div style="width: 100%; max-width: 540px;"> <nav data-part="root" class="navbar navbar-expand-lg bg-body-tertiary px-3 rounded" style="border: 1px solid #dee2e6;"> <a data-part="brand" class="navbar-brand fw-semibold" href="#">Acme</a> <button data-part="toggler" class="navbar-toggler" type="button" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <div data-part="collapse" class="collapse navbar-collapse" id="navbarContent"> <ul data-part="nav" class="navbar-nav me-auto mb-2 mb-lg-0"> <li class="nav-item"> <a class="nav-link active" aria-current="page" href="#">Home</a> </li> <li class="nav-item"> <a class="nav-link" href="#">Docs</a> </li> <li class="nav-item"> <a class="nav-link" href="#">Blog</a> </li> </ul> </div> </nav> </div> ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-navbar.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-navbar.astro";
const $$url = "/bs-navbar";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BsNavbar,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
