/**
 * Preview-side (iframe) entry. Registers a global decorator that mounts a
 * component-anatomy controller over the story canvas and syncs hover state
 * with the manager panel — and with any `<Anatomy>` doc block on the same
 * docs page — over the addon channel.
 *
 * The decorator runs in docs view too: the docs `Story` block renders each
 * story through `renderStoryToElement`, which sets `context.canvasElement`
 * exactly as it does in story view. That is what makes auto-discovery and
 * hover sync work inside MDX.
 */
import { addons, useEffect } from 'storybook/preview-api';
import type { Renderer, PartialStoryFn, StoryContext } from 'storybook/internal/types';
import { createAnatomy } from '@component-anatomy/core';

import { EVENTS, PARAM_KEY } from './constants.js';
import { matchesStory } from './channel.js';
import type { HoverItemEvent, StoryScopedEvent } from './channel.js';
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

    const storyId = context.id;

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
      channel.emit(EVENTS.PARTS, { storyId, parts: controller.getParts() });

    announceParts();

    const offEnter = controller.on('part:enter', (partId) =>
      channel.emit(EVENTS.PART_ENTER, { storyId, partId })
    );
    const offLeave = controller.on('part:leave', () =>
      channel.emit(EVENTS.PART_LEAVE, { storyId })
    );

    // A docs page mounts several stories at once, so every controller sees
    // every panel/block event — only act on the ones addressed to this story.
    const onHoverItem = (event: HoverItemEvent) => {
      if (!matchesStory(event?.storyId, storyId)) return;
      controller.highlight(event.partId);
    };
    const onLeaveItem = (event: StoryScopedEvent = {}) => {
      if (!matchesStory(event?.storyId, storyId)) return;
      controller.unhighlight();
    };
    const onPartsRequest = (event: StoryScopedEvent = {}) => {
      if (!matchesStory(event?.storyId, storyId)) return;
      announceParts();
    };

    channel.on(EVENTS.HOVER_ITEM, onHoverItem);
    channel.on(EVENTS.LEAVE_ITEM, onLeaveItem);
    // The panel or block may mount after the story rendered — let it ask for
    // the list rather than racing the first announcement.
    channel.on(EVENTS.PARTS_REQUEST, onPartsRequest);

    return () => {
      channel.off(EVENTS.HOVER_ITEM, onHoverItem);
      channel.off(EVENTS.LEAVE_ITEM, onLeaveItem);
      channel.off(EVENTS.PARTS_REQUEST, onPartsRequest);
      offEnter();
      offLeave();
      controller.destroy();
    };
  }, [context.id]);

  return storyFn();
};

export const decorators = [withComponentAnatomy];
