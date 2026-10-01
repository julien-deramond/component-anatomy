import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

import { defineStepper } from './web-components.js';

/**
 * A vanilla custom element with an open shadow root. Like Lit or Stencil, it
 * renders into its shadow root asynchronously, after the story mounted it.
 *
 * Its buttons and value live in the shadow tree; the label is a slotted child
 * in the light DOM. The addon finds both.
 */
const meta: Meta = {
  title: 'Web Components/Vanilla',
  render: () => {
    const stepper = document.createElement(defineStepper('sb-stepper', 'data-part'));
    stepper.innerHTML = `<span slot="label" data-part="label">Quantity</span>`;
    return stepper;
  },
};

export default meta;
type Story = StoryObj;

export const Anatomy: Story = {
  parameters: {
    anatomy: {
      parts: [
        { id: 'label', name: 'Label', description: 'Slotted: a light-DOM child of `<sb-stepper>`, rendered through `<slot name="label">`.' },
        { id: 'decrement', name: 'Decrement', description: 'In the shadow root. Lowers the value by one.' },
        { id: 'value', name: 'Value', description: 'In the shadow root. The current quantity.' },
        { id: 'increment', name: 'Increment', description: 'In the shadow root. Raises the value by one.' },
      ],
    } satisfies AnatomyParameters,
  },
};

/**
 * No `parts`: the list comes from the `data-part` attributes found in the
 * shadow root once the component has rendered.
 */
export const AutoDiscovered: Story = {
  parameters: {
    anatomy: {} satisfies AnatomyParameters,
  },
};

/**
 * This stepper carries no `data-part` at all — only the native `part`
 * attributes it exposes for `::part()` styling. `shadowParts: true` reads them.
 */
export const NativeParts: Story = {
  render: () => {
    const stepper = document.createElement(defineStepper('sb-native-stepper', 'part'));
    stepper.innerHTML = `<span slot="label">Quantity</span>`;
    return stepper;
  },
  parameters: {
    anatomy: { shadowParts: true } satisfies AnatomyParameters,
  },
};
