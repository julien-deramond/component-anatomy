/**
 * Shared channel payload contract between the preview decorator, the manager
 * panel, and the MDX doc block.
 *
 * Every payload carries the `storyId` it refers to. In story view this is
 * redundant — only one story is mounted — but a docs page mounts *many*
 * stories at once, each with its own controller, and each `<Anatomy>` block
 * must talk to exactly one of them. Without addressing, hovering a part in
 * one block highlights the matching part in every other story on the page.
 */
import type { AnatomyPartDefinition } from '@component-anatomy/core';

/** preview → consumers: the resolved part list for one story. */
export type PartsEvent = { storyId?: string; parts: AnatomyPartDefinition[] };

/** preview → consumers: a part became active in that story's canvas. */
export type PartEnterEvent = { storyId?: string; partId: string };

/** consumer → preview: highlight this part in that story's canvas. */
export type HoverItemEvent = { storyId?: string; partId: string };

/** Payload for the events that only need to name a story. */
export type StoryScopedEvent = { storyId?: string };

/**
 * Whether an event addressed to `eventStoryId` concerns `storyId`.
 *
 * A missing id on *either* side matches everything. That keeps the protocol
 * backward compatible: a manager panel from a newer build still understands
 * an older preview bundle that emits unaddressed events, and vice versa.
 */
export const matchesStory = (
  eventStoryId: string | undefined,
  storyId: string | undefined
): boolean => !eventStoryId || !storyId || eventStoryId === storyId;
