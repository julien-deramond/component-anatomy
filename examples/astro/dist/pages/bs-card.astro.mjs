import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CSJ-wkBB.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_D-DFcKx_.mjs';
export { renderers } from '../renderers.mjs';

const $$BsCard = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `The outer \`.card\` container. A flex column with a white background, \`1px\` border, and \`border-radius\`. Acts as a visual grouping surface for a related set of content.

Bootstrap sets \`word-wrap: break-word\` so long strings never overflow the card.`
    },
    {
      id: "image",
      name: "Image",
      description: `The \`.card-img-top\` image is flush with the card's top edge, ignoring the card's padding. Bootstrap uses \`border-radius\` inheritance and \`object-fit: cover\` by default.

Always provide a meaningful \`alt\` attribute \u2014 or \`alt=""\` for purely decorative images.`
    },
    {
      id: "body",
      name: "Body",
      description: `The \`.card-body\` wrapper provides consistent \`padding\` around the card's primary content. It is a flex column and grows to fill available space when the card is used in a grid of equal-height cards.`
    },
    {
      id: "title",
      name: "Title",
      description: `The \`.card-title\` element \u2014 semantically an \`<h5>\` in most Bootstrap examples, but should match the correct heading level in context.

Sets \`margin-bottom: 0.5rem\` by default. Colour inherits from the card body.`
    },
    {
      id: "text",
      name: "Text",
      description: `The \`.card-text\` paragraph. Multiple \`.card-text\` elements inside a \`.card-body\` have their last-child bottom margin removed automatically to keep spacing consistent.`
    },
    {
      id: "footer",
      name: "Footer",
      description: `The \`.card-footer\` provides a visually separated bottom section, typically used for metadata, timestamps, or secondary actions.

Background defaults to \`rgba(0,0,0,0.03)\` with a top border. Bootstrap automatically rounds the footer's bottom corners to match the card.`
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Bootstrap Card" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Bootstrap Card</h1> <p class="page-subtitle">
Bootstrap v5 · <code>.card</code> — a flexible content container.
</p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` <div data-part="root" class="card" style="width: 280px; font-size: 0.875rem;"> <div data-part="image" style="height: 120px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: calc(0.375rem - 1px) calc(0.375rem - 1px) 0 0;"></div> <div data-part="body" class="card-body"> <h5 data-part="title" class="card-title">Design Systems</h5> <p data-part="text" class="card-text text-muted">
A collection of reusable components guided by clear standards.
</p> <a href="#" class="btn btn-primary btn-sm">Learn more</a> </div> <div data-part="footer" class="card-footer text-muted" style="font-size: 0.75rem;">
Updated 3 days ago
</div> </div> ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-card.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/bs-card.astro";
const $$url = "/bs-card";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BsCard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
