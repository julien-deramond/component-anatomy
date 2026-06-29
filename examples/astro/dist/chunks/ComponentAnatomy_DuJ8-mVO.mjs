import { c as createComponent, m as maybeRenderHead, d as addAttribute, e as renderSlot, u as unescapeHTML, r as renderTemplate, a as createAstro } from './astro/server_BgZlRxbh.mjs';
import 'kleur/colors';
import 'clsx';
import { marked } from 'marked';
/* empty css                          */

const $$Astro = createAstro();
const $$ComponentAnatomy = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ComponentAnatomy;
  const { parts, class: className, label = "Component anatomy" } = Astro2.props;
  const instanceId = `ca-${Math.random().toString(36).slice(2, 9)}`;
  const renderedParts = await Promise.all(
    (parts ?? []).map(async (part) => ({
      ...part,
      html: part.description ? await marked.parse(part.description) : null
    }))
  );
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["ca-root", className], "class:list")}${addAttribute(instanceId, "data-anatomy-root")}${addAttribute(label, "aria-label")} data-astro-cid-llzpouwe>  <div class="ca-preview"${addAttribute(instanceId, "data-anatomy-preview")} data-astro-cid-llzpouwe> ${renderSlot($$result, $$slots["default"])} </div>  <div class="ca-panel"${addAttribute(instanceId, "data-anatomy-panel")} role="list" aria-label="Anatomy parts" data-astro-cid-llzpouwe> ${renderedParts.length > 0 ? renderedParts.map((part) => renderTemplate`<div class="ca-part-entry"${addAttribute(part.id, "data-anatomy-item")} role="listitem" tabindex="0"${addAttribute(part.name, "aria-label")} data-astro-cid-llzpouwe> <h3 class="ca-part-name" data-astro-cid-llzpouwe> <span class="ca-part-dot" aria-hidden="true" data-astro-cid-llzpouwe></span> ${part.name} </h3> ${part.html && renderTemplate`<div class="ca-part-description" data-astro-cid-llzpouwe>${unescapeHTML(part.html)}</div>`} </div>`) : renderTemplate`<p class="ca-no-parts" data-astro-cid-llzpouwe>
No parts defined. Add <code data-astro-cid-llzpouwe>data-part="name"</code> to your component elements.
</p>`} </div> </div>    `;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/packages/astro/src/ComponentAnatomy.astro", void 0);

export { $$ComponentAnatomy as $ };
