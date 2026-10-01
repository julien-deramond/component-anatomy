import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

import { defineCustomElements } from '@ionic/core/loader';

// Stencil's lazy loader: every tag is defined right away as a lightweight
// proxy, and a component's code is only fetched — and rendered into its
// shadow root — once one is on the page. The anatomy is there late.
defineCustomElements(window);

/**
 * A component from Ionic, the most used library built with Stencil, loaded
 * through Stencil's lazy loader. No `data-part` added: `shadowParts` reads
 * the `part` names Ionic documents for `::part()`.
 */
const meta: Meta = {
  title: 'Web Components/Ionic (Stencil)',
};

export default meta;
type Story = StoryObj;

export const Toggle: Story = {
  render: () => html`<ion-toggle checked>Notifications</ion-toggle>`,
  parameters: {
    anatomy: {
      shadowParts: true,
      parts: [
        { id: 'label', name: 'Label', description: '`ion-toggle::part(label)`, wrapping the default slot.' },
        { id: 'track', name: 'Track', description: '`ion-toggle::part(track)`, the background the handle slides on.' },
        { id: 'handle', name: 'Handle', description: '`ion-toggle::part(handle)`, the knob.' },
      ],
    } satisfies AnatomyParameters,
  },
};
