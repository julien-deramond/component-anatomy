import React, { useEffect, useState } from 'react';
import { useChannel, useParameter, useStorybookApi } from 'storybook/manager-api';
import type { AnatomyPartDefinition } from '@component-anatomy/core';

import { EVENTS, PARAM_KEY } from './constants.js';
import { matchesStory } from './channel.js';
import type { PartEnterEvent, PartsEvent, StoryScopedEvent } from './channel.js';
import { ACCENT_FALLBACK, AnatomyCode, AnatomyMessage, AnatomyTable } from './AnatomyTable.js';
import type { AnatomyParameters } from './types.js';

export const Panel: React.FC = () => {
  const params = useParameter<AnatomyParameters | undefined>(PARAM_KEY, undefined);
  const api = useStorybookApi();
  const storyId = api.getUrlState().storyId;

  const [discovered, setDiscovered] = useState<AnatomyPartDefinition[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // `useChannel` captures its handlers on the given deps — `storyId` has to be
  // listed or the filters below would close over a stale story.
  const emit = useChannel(
    {
      [EVENTS.PARTS]: (event: PartsEvent) => {
        if (!matchesStory(event?.storyId, storyId)) return;
        setDiscovered(event.parts);
      },
      [EVENTS.PART_ENTER]: (event: PartEnterEvent) => {
        if (!matchesStory(event?.storyId, storyId)) return;
        setActiveId(event.partId);
      },
      [EVENTS.PART_LEAVE]: (event: StoryScopedEvent = {}) => {
        if (!matchesStory(event?.storyId, storyId)) return;
        setActiveId(null);
      },
    },
    [storyId]
  );

  // Ask the preview for the current part list on mount / story change.
  useEffect(() => {
    setDiscovered([]);
    setActiveId(null);
    emit(EVENTS.PARTS_REQUEST, { storyId } satisfies StoryScopedEvent);
  }, [storyId]);

  const parts = params?.parts ?? discovered;
  const accent = params?.theme?.accent ?? ACCENT_FALLBACK;

  if (!params || params.disable) {
    return (
      <AnatomyMessage>
        No anatomy configured for this story. Add <AnatomyCode>parameters.anatomy</AnatomyCode> and
        annotate elements with <AnatomyCode>data-part="name"</AnatomyCode>.
      </AnatomyMessage>
    );
  }

  if (parts.length === 0) {
    return (
      <AnatomyMessage>
        No parts found. Annotate elements in your story with{' '}
        <AnatomyCode>data-part="name"</AnatomyCode> or pass{' '}
        <AnatomyCode>parameters.anatomy.parts</AnatomyCode>.
      </AnatomyMessage>
    );
  }

  return (
    <AnatomyTable
      parts={parts}
      activeId={activeId}
      accent={accent}
      onItemEnter={(partId) => emit(EVENTS.HOVER_ITEM, { storyId, partId })}
      onItemLeave={() => emit(EVENTS.LEAVE_ITEM, { storyId })}
    />
  );
};
