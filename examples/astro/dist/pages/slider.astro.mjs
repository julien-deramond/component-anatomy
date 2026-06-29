import { c as createComponent, m as maybeRenderHead, d as addAttribute, a as renderTemplate, b as createAstro, r as renderComponent } from '../chunks/astro/server_C3j9ucX4.mjs';
import 'kleur/colors';
import { $ as $$Base } from '../chunks/Base_CSJ-wkBB.mjs';
import { $ as $$ComponentAnatomy } from '../chunks/ComponentAnatomy_D-DFcKx_.mjs';
import 'clsx';
/* empty css                                  */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Slider$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Slider$1;
  const { value = 40, min = 0, max = 100 } = Astro2.props;
  const pct = (value - min) / (max - min) * 100;
  return renderTemplate`${maybeRenderHead()}<div data-part="root" class="slider" role="none" data-astro-cid-txmsbymr> <div data-part="track" class="slider-track" data-astro-cid-txmsbymr> <div data-part="range" class="slider-range"${addAttribute(`width: ${pct}%`, "style")} data-astro-cid-txmsbymr></div> <div data-part="thumb" class="slider-thumb"${addAttribute(`left: ${pct}%`, "style")} role="slider"${addAttribute(min, "aria-valuemin")}${addAttribute(max, "aria-valuemax")}${addAttribute(value, "aria-valuenow")} tabindex="0" data-astro-cid-txmsbymr></div> </div> <div data-part="output" class="slider-output" aria-live="polite" data-astro-cid-txmsbymr> ${value} </div> </div> `;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/components/Slider.astro", void 0);

const $$Slider = createComponent(($$result, $$props, $$slots) => {
  const parts = [
    {
      id: "root",
      name: "Root",
      description: `
The outermost container. Sets the width context for the track and coordinates
keyboard and pointer events across all child parts.
    `.trim()
    },
    {
      id: "track",
      name: "Track",
      description: `
The horizontal rail that represents the full range of values.

The track is a positioned container \u2014 both the range fill and the thumb are
absolutely positioned relative to it. Its height and border-radius define
the visual style of the slider line.
    `.trim()
    },
    {
      id: "range",
      name: "Range",
      description: `
The filled portion of the track from the minimum to the current value.

Its width is set inline as a percentage: \`width: ${40}%\`. It is
purely decorative and carries \`pointer-events: none\` so clicks pass
through to the track.
    `.trim()
    },
    {
      id: "thumb",
      name: "Thumb",
      description: `
The draggable handle that represents the current value.

Receives \`role="slider"\` and exposes \`aria-valuenow\`, \`aria-valuemin\`,
and \`aria-valuemax\` for assistive technology. Keyboard interaction:
\`ArrowLeft\` / \`ArrowRight\` decrement / increment the value by one step.
    `.trim()
    },
    {
      id: "output",
      name: "Output",
      description: `
Displays the current numeric value as text.

Uses \`aria-live="polite"\` so screen readers announce value changes
without interrupting the user. Updates in sync with the thumb position.
    `.trim()
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Slider" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title">Slider</h1> <p class="page-subtitle">
A range input for selecting a numeric value within a defined interval.
    Hover a part name or the live component to explore the anatomy.
</p> <div class="section"> <p class="section-label">Anatomy</p> ${renderComponent($$result2, "ComponentAnatomy", $$ComponentAnatomy, { "parts": parts }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "Slider", $$Slider$1, { "value": 40 })} ` })} </div> ` })}`;
}, "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/slider.astro", void 0);

const $$file = "/sessions/blissful-eloquent-ptolemy/mnt/component-anatomy/examples/astro/src/pages/slider.astro";
const $$url = "/slider";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Slider,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
