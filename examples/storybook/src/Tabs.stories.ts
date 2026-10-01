import type { Meta, StoryObj } from '@storybook/html-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

const meta: Meta = {
  title: 'Components/Tabs',
  render: () => {
    const el = document.createElement('div');
    el.className = 'sb-tabs';
    el.innerHTML = `
      <div class="sb-tabs-list" data-part="tablist">
        <button class="sb-tab is-active" data-part="tab">Overview</button>
        <button class="sb-tab" data-part="tab">Specs</button>
        <button class="sb-tab" data-part="tab">Reviews</button>
        <div class="sb-tabs-indicator" data-part="indicator"></div>
      </div>
      <div class="sb-tabs-panel" data-part="tabpanel">The overview content lives here.</div>
    `;
    return el;
  },
};

export default meta;
type Story = StoryObj;

/**
 * Parts are auto-discovered from `data-part` attributes — no explicit
 * part list needed. Names are derived from the ids.
 */
export const AutoDiscovered: Story = {
  parameters: {
    anatomy: {} satisfies AnatomyParameters,
  },
};

const parts = [
  { id: 'tablist', name: 'Tab list', description: 'Container for the tab buttons.' },
  { id: 'tab', name: 'Tab', description: 'One selector per panel — all three highlight together.' },
  { id: 'indicator', name: 'Indicator', description: 'Underline marking the active tab.' },
  { id: 'tabpanel', name: 'Tab panel', description: 'Content region controlled by the active tab.' },
];

export const HighContrast: Story = {
  parameters: {
    anatomy: { preset: 'contrast', parts } satisfies AnatomyParameters,
  },
};

/**
 * The same preset with a brand `accent` on top. The accent takes the three
 * tokens it derives — overlay border, background wash and label chip — while
 * the rest of `contrast` stays: the 3px square border, the yellow label text.
 */
export const HighContrastBranded: Story = {
  parameters: {
    anatomy: {
      preset: 'contrast',
      theme: { accent: '#0d9488' },
      parts,
    } satisfies AnatomyParameters,
  },
};
