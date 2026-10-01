import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

import { createClosedElement, createLateElement } from './web-components.js';

/**
 * Web components at the edges of what the addon can see.
 */
const meta: Meta = {
  title: 'Edge cases/Web Components',
};

export default meta;
type Story = StoryObj;

/**
 * The element is on the canvas before its tag is defined — what an
 * autoloader or a lazy bundle does. Defining it a second later upgrades it in
 * place, which no DOM observer can see: the addon waits on
 * `customElements.whenDefined()` instead. The panel starts with "No parts
 * found", then lists the parts once the element is defined.
 */
export const DefinedLate: Story = {
  render: () => createLateElement(1000),
  parameters: {
    anatomy: {} satisfies AnatomyParameters,
  },
};

/**
 * `attachShadow({ mode: 'closed' })` hides the shadow tree from any code
 * outside the component — the addon included. Its `data-part` stays unseen
 * and the panel says "No parts found". Annotate the host or slotted children.
 */
export const ClosedShadowRoot: Story = {
  render: createClosedElement,
  parameters: {
    anatomy: {} satisfies AnatomyParameters,
  },
};
