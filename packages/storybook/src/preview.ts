/**
 * Preview-side (iframe) entry. Registers a global decorator that mounts a
 * component-anatomy controller over the story canvas and syncs hover state
 * with the manager panel over the addon channel.
 */
import { addons, useEffect } from 'storybook/preview-api';
import type { Renderer, PartialStoryFn, StoryContext } from 'storybook/internal/types';
import { createAnatomy } from '@component-anatomy/core';

import { EVENTS, PARAM_KEY } from './constants.js';
import type { AnatomyParameters } from './types.js';

export const withComponentAnatomy = (
  storyFn: PartialStoryFn<Renderer>,
  context: StoryContext<Renderer>
) => {
  const params = context.parameters?.[PARAM_KEY] as AnatomyParameters | undefined;

  useEffect(() => {
    if (!params || params.disable) return;

    const channel = addons.getChannel();
    const canvas = context.canvasElement as unknown as HTMLElement;
    if (!canvas) return;

    const root = params.root
      ? canvas.querySelector<HTMLElement>(params.root) ?? canvas
      : canvas;

    const controller = createAnatomy({
      root,
      parts: params.parts,
      preset: params.preset,
      theme: params.theme,
      overlay: {
        label: params.overlayLabel !== false,
        padding: params.overlayPadding,
      },
    });

    const announceParts = () =>
      channel.emit(EVENTS.PARTS, { storyId: context.id, parts: controller.getParts() });

    announceParts();

    const offEnter = controller.on('part:enter', (partId) =>
      channel.emit(EVENTS.PART_ENTER, { partId })
    );
    const offLeave = controller.on('part:leave', () =>
      channel.emit(EVENTS.PART_LEAVE, {})
    );

    const onHoverItem = ({ partId }: { partId: string }) => controller.highlight(partId);
    const onLeaveItem = () => controller.unhighlight();

    channel.on(EVENTS.HOVER_ITEM, onHoverItem);
    channel.on(EVENTS.LEAVE_ITEM, onLeaveItem);
    // The panel may mount after the story rendered — let it ask for the list.
    channel.on(EVENTS.PARTS_REQUEST, announceParts);

    return () => {
      channel.off(EVENTS.HOVER_ITEM, onHoverItem);
      channel.off(EVENTS.LEAVE_ITEM, onLeaveItem);
      channel.off(EVENTS.PARTS_REQUEST, announceParts);
      offEnter();
      offLeave();
      controller.destroy();
    };
  }, [context.id]);

  return storyFn();
};

export const decorators = [withComponentAnatomy];
