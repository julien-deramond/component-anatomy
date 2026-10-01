import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';

/**
 * A component from Shoelace, a Lit-based library, used as is: no `data-part`
 * added. `shadowParts` reads the `part` names it documents for `::part()`.
 */
const meta: Meta = {
  title: 'Web Components/Shoelace',
};

export default meta;
type Story = StoryObj;

export const Switch: Story = {
  render: () => html`<sl-switch checked>Notifications</sl-switch>`,
  parameters: {
    anatomy: {
      shadowParts: true,
      parts: [
        { id: 'base', name: 'Base', description: '`sl-switch::part(base)`, the component\'s wrapper.' },
        { id: 'control', name: 'Control', description: '`sl-switch::part(control)`, the track.' },
        { id: 'thumb', name: 'Thumb', description: '`sl-switch::part(thumb)`, the handle that slides.' },
        { id: 'label', name: 'Label', description: '`sl-switch::part(label)`, wrapping the default slot.' },
      ],
    } satisfies AnatomyParameters,
  },
};
