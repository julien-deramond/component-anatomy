/**
 * Docs blocks entry — the `<Anatomy>` block for MDX pages.
 *
 * Unlike the addon panel, this runs in the **preview iframe**, where
 * `storybook/manager-api` does not exist. It reaches the story's controller
 * over the addon channel instead: `Channel.emit` dispatches to local
 * listeners as well as across transports, so a block and the decorator that
 * mounted the story talk to each other directly, in-frame, with no extra
 * plumbing.
 *
 * ```mdx
 * import { Meta, Canvas } from '@storybook/addon-docs/blocks';
 * import { Anatomy } from '@component-anatomy/storybook/blocks';
 * import * as ButtonStories from './Button.stories';
 *
 * <Meta of={ButtonStories} />
 *
 * <Canvas of={ButtonStories.Anatomy} />
 * <Anatomy of={ButtonStories.Anatomy} />
 * ```
 */
import React, { useEffect, useState } from 'react';
import { addons } from 'storybook/preview-api';
import { Unstyled, useOf } from '@storybook/addon-docs/blocks';
import type { Of } from '@storybook/addon-docs/blocks';
import type { AnatomyPartDefinition } from '@component-anatomy/core';

import { EVENTS, PARAM_KEY } from './constants.js';
import { matchesStory } from './channel.js';
import type { PartEnterEvent, PartsEvent, StoryScopedEvent } from './channel.js';
import { AnatomyCode, AnatomyMessage, AnatomyTable } from './AnatomyTable.js';
import type { AnatomyParameters } from './types.js';

export type AnatomyBlockProps = {
  /**
   * The CSF export to document — a story export, or the whole module export
   * of a CSF file to read the meta's parameters.
   *
   * Omit it on an attached docs page (one with `<Meta of={...} />`, or an
   * autodocs page) to fall back to the page's current story, mirroring how
   * the other docs blocks resolve `of`.
   */
  of?: Of;
  /**
   * Part list override. Skips both `parameters.anatomy.parts` and
   * auto-discovery — useful for a hand-curated subset in prose.
   */
  parts?: AnatomyPartDefinition[];
  /**
   * Two-way hover sync with the rendered story. Default: `true`. Set to
   * `false` for a purely static table (also skips auto-discovery, since that
   * arrives over the channel).
   */
  sync?: boolean;
};

/**
 * `addons.getChannel()` throws when no channel is installed. That should not
 * happen inside a rendered docs page, but an MDX page is user-authored
 * content and a throw here would blank the whole page — degrade to a static
 * table instead.
 */
function getChannelSafely() {
  try {
    return addons.getChannel();
  } catch {
    return null;
  }
}

export const Anatomy: React.FC<AnatomyBlockProps> = ({ of, parts: partsProp, sync = true }) => {
  const resolved = useOf(of ?? 'story', ['story', 'meta']);

  const params = (
    resolved.type === 'meta'
      ? resolved.preparedMeta.parameters?.[PARAM_KEY]
      : resolved.story.parameters?.[PARAM_KEY]
  ) as AnatomyParameters | undefined;

  // Only a story has a canvas to sync with. `of={SomeStories}` (a meta)
  // documents the component as a whole and can render static parts only.
  const storyId = resolved.type === 'story' ? resolved.story.id : undefined;

  const [discovered, setDiscovered] = useState<AnatomyPartDefinition[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const staticParts = partsProp ?? params?.parts;
  // Hover sync is wired even when the parts are static — an explicit list
  // still wants the canvas to light up. Only discovery depends on the channel.
  const wired = sync && !!storyId;

  useEffect(() => {
    setDiscovered([]);
    setActiveId(null);
    if (!wired) return;

    const channel = getChannelSafely();
    if (!channel) return;

    const onParts = (event: PartsEvent) => {
      if (!matchesStory(event?.storyId, storyId)) return;
      setDiscovered(event.parts);
    };
    const onEnter = (event: PartEnterEvent) => {
      if (!matchesStory(event?.storyId, storyId)) return;
      setActiveId(event.partId);
    };
    const onLeave = (event: StoryScopedEvent = {}) => {
      if (!matchesStory(event?.storyId, storyId)) return;
      setActiveId(null);
    };

    channel.on(EVENTS.PARTS, onParts);
    channel.on(EVENTS.PART_ENTER, onEnter);
    channel.on(EVENTS.PART_LEAVE, onLeave);

    // The block usually mounts before the story below it finishes rendering;
    // the request covers the other order.
    channel.emit(EVENTS.PARTS_REQUEST, { storyId } satisfies StoryScopedEvent);

    return () => {
      channel.off(EVENTS.PARTS, onParts);
      channel.off(EVENTS.PART_ENTER, onEnter);
      channel.off(EVENTS.PART_LEAVE, onLeave);
    };
  }, [wired, storyId]);

  const parts = staticParts ?? discovered;

  const emitHover = (partId: string) => {
    if (!wired) return;
    getChannelSafely()?.emit(EVENTS.HOVER_ITEM, { storyId, partId });
  };
  const emitLeave = () => {
    if (!wired) return;
    getChannelSafely()?.emit(EVENTS.LEAVE_ITEM, { storyId } satisfies StoryScopedEvent);
  };

  // `Unstyled` keeps the docs page's prose CSS (`.sbdocs` restyles ul/li/p/
  // code) from reaching the table.
  if (!params && !partsProp) {
    return (
      <Unstyled>
        <AnatomyMessage>
          No anatomy configured. Add <AnatomyCode>parameters.anatomy</AnatomyCode> to the story you
          pass to <AnatomyCode>of</AnatomyCode>, or pass a{' '}
          <AnatomyCode>parts</AnatomyCode> list to this block.
        </AnatomyMessage>
      </Unstyled>
    );
  }

  if (params?.disable && !partsProp) {
    return (
      <Unstyled>
        <AnatomyMessage>
          Anatomy is disabled for this story (<AnatomyCode>anatomy.disable</AnatomyCode>).
        </AnatomyMessage>
      </Unstyled>
    );
  }

  if (parts.length === 0) {
    return (
      <Unstyled>
        <AnatomyMessage>
          {resolved.type === 'meta' ? (
            <>
              No parts found. A meta has no canvas to discover parts from — pass a story to{' '}
              <AnatomyCode>of</AnatomyCode>, or list <AnatomyCode>parts</AnatomyCode> explicitly.
            </>
          ) : (
            <>
              No parts found. Auto-discovery reads the rendered story, so make sure it is on this
              page (e.g. with a <AnatomyCode>{'<Canvas of={…} />'}</AnatomyCode> block above), or
              list <AnatomyCode>parts</AnatomyCode> explicitly.
            </>
          )}
        </AnatomyMessage>
      </Unstyled>
    );
  }

  return (
    <Unstyled>
      <AnatomyTable
        parts={parts}
        activeId={activeId}
        preset={params?.preset}
        theme={params?.theme}
        onItemEnter={emitHover}
        onItemLeave={emitLeave}
      />
    </Unstyled>
  );
};
