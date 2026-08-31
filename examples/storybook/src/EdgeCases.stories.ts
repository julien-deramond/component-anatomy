import type { Meta, StoryObj } from '@storybook/html-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

/**
 * The states the addon shows when there is *nothing* to show.
 *
 * They are stories rather than prose so the empty states are exercised on
 * every run — they render in the panel, in the `<Anatomy>` doc block, and in
 * any visual-regression run that walks this Storybook.
 */
const meta: Meta = {
  title: 'Edge cases',
};

export default meta;
type Story = StoryObj;

/** The button from Components/Button, with its `data-part` annotations. */
const annotatedButton = () => {
  const btn = document.createElement('button');
  btn.className = 'sb-btn';
  btn.innerHTML = `
    <span data-part="icon">★</span>
    <span data-part="label">Favorite</span>
    <span class="sb-btn-badge" data-part="badge">12</span>
  `;
  return btn;
};

/**
 * `parameters.anatomy = {}` asks for auto-discovery, but nothing in this story
 * carries a `data-part` attribute — the same markup with the annotations
 * stripped. The panel says so instead of rendering an empty list.
 */
export const NoParts: Story = {
  render: () => {
    const btn = document.createElement('button');
    btn.className = 'sb-btn';
    btn.innerHTML = `
      <span>★</span>
      <span>Favorite</span>
      <span class="sb-btn-badge">12</span>
    `;
    return btn;
  },
  parameters: {
    anatomy: {} satisfies AnatomyParameters,
  },
};

/**
 * `disable: true` turns the addon off for one story. The parts are still
 * declared and the markup is still annotated — nothing is highlighted, and no
 * controller is mounted over the canvas, so hovering the button does nothing.
 *
 * Note the **Anatomy** tab is missing from the panel below. That is Storybook
 * itself: it drops any addon panel whose `paramKey` parameter carries
 * `disable`, before the addon is asked to render anything. In a docs page
 * there is no tab bar to drop, so the `<Anatomy>` block says it in words —
 * see Docs → Anatomy in MDX.
 */
export const Disabled: Story = {
  render: annotatedButton,
  parameters: {
    anatomy: {
      disable: true,
      parts: [
        { id: 'icon', name: 'Icon', description: 'Never rendered — the addon is off here.' },
        { id: 'label', name: 'Label', description: 'Never rendered — the addon is off here.' },
      ],
    } satisfies AnatomyParameters,
  },
};

/**
 * No `anatomy` parameter at all — the state every story in a Storybook that
 * has just installed the addon starts in. The canvas is annotated, so adding
 * `anatomy: {}` is all this story would need.
 */
export const NotConfigured: Story = {
  render: annotatedButton,
};
