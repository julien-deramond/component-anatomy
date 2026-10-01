import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { AnatomyParameters } from '@component-anatomy/storybook';

import './lit-components.js';

/**
 * Real Lit components, rendered through the web-components renderer from a
 * Lit template. Lit renders into an open shadow root asynchronously, after
 * the story mounted.
 */
const meta: Meta = {
  title: 'Web Components/Lit',
};

export default meta;
type Story = StoryObj;

/** A Lit component of your own, annotated with `data-part` inside its template. */
export const DataPart: Story = {
  render: () => html`<sb-lit-rating value="3"></sb-lit-rating>`,
  parameters: {
    anatomy: {
      parts: [
        { id: 'stars', name: 'Stars', description: 'The `role="radiogroup"` wrapping the five stars.' },
        { id: 'star', name: 'Star', description: 'One `role="radio"` button per value. All five highlight together.' },
        { id: 'value', name: 'Value', description: 'The current rating, as text. Click a star: it re-renders in place.' },
      ],
    } satisfies AnatomyParameters,
  },
};

/**
 * The component exposes its anatomy with native `part` names only, and binds
 * the selected tab's: `part=${selected ? 'tab selected' : 'tab'}`. Pick
 * another tab, then hover **Selected**: the highlight follows.
 */
export const ShadowParts: Story = {
  render: () => html`<sb-lit-tabs></sb-lit-tabs>`,
  parameters: {
    anatomy: {
      shadowParts: true,
      parts: [
        { id: 'tablist', name: 'Tab list', description: '`part="tablist"`, the `role="tablist"` row.' },
        { id: 'tab', name: 'Tab', description: '`part="tab"`, every tab.' },
        { id: 'selected', name: 'Selected', description: 'Bound to state: only the selected tab carries `part="tab selected"`.' },
        { id: 'panel', name: 'Panel', description: '`part="panel"`, the selected tab\'s content.' },
      ],
    } satisfies AnatomyParameters,
  },
};
