import { c as createComponent, m as maybeRenderHead, d as addAttribute, e as renderSlot, u as unescapeHTML, a as renderTemplate, b as createAstro } from './astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import 'clsx';
import { marked } from 'marked';
/* empty css                            */

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
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["ca-root", className], "class:list")}${addAttribute(instanceId, "data-anatomy-root")}${addAttribute(label, "aria-label")} data-astro-cid-llzpouwe> <!-- Left: live component preview with dot-grid background --> <div class="ca-preview"${addAttribute(instanceId, "data-anatomy-preview")} data-astro-cid-llzpouwe> <div class="ca-preview-inner" data-astro-cid-llzpouwe> ${renderSlot($$result, $$slots["default"])} </div> </div> <!-- Right: documentation panel --> <div class="ca-panel-wrapper" data-astro-cid-llzpouwe> <!-- Sticky "active part" indicator — visible when scrolled past the active entry --> <div class="ca-active-pill"${addAttribute(instanceId, "data-anatomy-pill")} aria-hidden="true" data-astro-cid-llzpouwe> <span class="ca-active-pill-dot" data-astro-cid-llzpouwe></span> <span class="ca-active-pill-name" data-astro-cid-llzpouwe></span> </div> <div class="ca-panel"${addAttribute(instanceId, "data-anatomy-panel")} role="list" aria-label="Anatomy parts" data-astro-cid-llzpouwe> ${renderedParts.length > 0 ? renderedParts.map((part) => renderTemplate`<div class="ca-part-entry"${addAttribute(part.id, "data-anatomy-item")} role="listitem" tabindex="0"${addAttribute(part.name, "aria-label")} data-astro-cid-llzpouwe> <div class="ca-part-header" data-astro-cid-llzpouwe> <span class="ca-part-indicator" aria-hidden="true" data-astro-cid-llzpouwe></span> <span class="ca-part-name" data-astro-cid-llzpouwe>${part.name}</span> <code class="ca-part-id" data-astro-cid-llzpouwe>${part.id}</code> </div> ${part.html && renderTemplate`<div class="ca-part-description" data-astro-cid-llzpouwe>${unescapeHTML(part.html)}</div>`} </div>`) : renderTemplate`<p class="ca-no-parts" data-astro-cid-llzpouwe>
No parts defined. Add <code data-astro-cid-llzpouwe>data-part="name"</code> to your component elements.
</p>`} </div> </div> </div>  `;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/packages/astro/src/ComponentAnatomy.astro", void 0);

export { $$ComponentAnatomy as $ };
