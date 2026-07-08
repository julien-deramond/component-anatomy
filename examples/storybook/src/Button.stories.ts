import type { Meta, StoryObj } from '@storybook/html-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

const meta: Meta = {
  title: 'Components/Button',
  render: () => {
    const btn = document.createElement('button');
    btn.className = 'sb-btn';
    btn.innerHTML = `
      <span data-part="icon">★</span>
      <span data-part="label">Favorite</span>
      <span class="sb-btn-badge" data-part="badge">12</span>
    `;
    return btn;
  },
};

export default meta;
type Story = StoryObj;

const anatomy: AnatomyParameters = {
  parts: [
    { id: 'icon', name: 'Icon', description: 'Optional leading glyph reinforcing the action.' },
    { id: 'label', name: 'Label', description: 'The visible action text. Keep it a verb.' },
    { id: 'badge', name: 'Badge', description: 'Numeric counter for associated items.' },
  ],
};

export const Anatomy: Story = {
  parameters: { anatomy },
};

export const CustomTheme: Story = {
  parameters: {
    anatomy: {
      ...anatomy,
      preset: 'blueprint',
      overlayPadding: 2,
    } satisfies AnatomyParameters,
  },
};
