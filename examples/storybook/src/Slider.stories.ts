import type { Meta, StoryObj } from '@storybook/html-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

const meta: Meta = {
  title: 'Components/Slider',
  render: () => {
    const el = document.createElement('div');
    el.className = 'sb-slider';
    el.innerHTML = `
      <div class="sb-slider-track" data-part="track">
        <div class="sb-slider-fill" data-part="fill"></div>
        <div class="sb-slider-thumb" data-part="thumb"></div>
      </div>
    `;
    return el;
  },
};

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  parameters: {
    anatomy: {
      parts: [
        { id: 'track', name: 'Track', description: 'The rail the thumb travels along.' },
        { id: 'fill', name: 'Fill', description: 'Visualizes the selected portion of the range.' },
        { id: 'thumb', name: 'Thumb', description: 'The draggable handle. Focusable and arrow-key operable.' },
      ],
      theme: { accent: '#0d9488' },
    } satisfies AnatomyParameters,
  },
};
