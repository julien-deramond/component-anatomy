import React, { useEffect, useState } from 'react';
import { useChannel, useParameter, useStorybookApi } from 'storybook/manager-api';
import type { AnatomyPartDefinition } from '@component-anatomy/core';

import { EVENTS, PARAM_KEY } from './constants.js';
import type { AnatomyParameters } from './types.js';

const ACCENT_FALLBACK = '#4f46e5';

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px 16px',
    fontFamily:
      '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontSize: 13,
    lineHeight: 1.5,
  },
  empty: {
    color: '#6b7280',
  },
  code: {
    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Mono", monospace',
    fontSize: '0.85em',
    background: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    padding: '1px 5px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  entry: {
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid transparent',
    cursor: 'default',
    outline: 'none',
    transition: 'background 120ms ease, border-color 120ms ease',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    border: '2px solid #d1d5db',
    flexShrink: 0,
    transition: 'background 120ms ease, border-color 120ms ease',
  },
  name: {
    fontWeight: 700,
    flex: 1,
  },
  id: {
    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Mono", monospace',
    fontSize: 10,
    padding: '1px 6px',
    borderRadius: 4,
    background: 'rgba(0,0,0,0.05)',
    border: '1px solid rgba(0,0,0,0.08)',
    color: '#6b7280',
    flexShrink: 0,
  },
  description: {
    margin: '4px 0 0',
    paddingLeft: 16,
    color: '#6b7280',
  },
};

export const Panel: React.FC = () => {
  const params = useParameter<AnatomyParameters | undefined>(PARAM_KEY, undefined);
  const api = useStorybookApi();
  const storyId = api.getUrlState().storyId;

  const [discovered, setDiscovered] = useState<AnatomyPartDefinition[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const emit = useChannel({
    [EVENTS.PARTS]: ({ parts }: { parts: AnatomyPartDefinition[] }) => setDiscovered(parts),
    [EVENTS.PART_ENTER]: ({ partId }: { partId: string }) => setActiveId(partId),
    [EVENTS.PART_LEAVE]: () => setActiveId(null),
  });

  // Ask the preview for the current part list on mount / story change.
  useEffect(() => {
    setDiscovered([]);
    setActiveId(null);
    emit(EVENTS.PARTS_REQUEST);
  }, [storyId]);

  const parts = params?.parts ?? discovered;
  const accent = params?.theme?.accent ?? ACCENT_FALLBACK;

  if (!params || params.disable) {
    return (
      <div style={styles.container}>
        <p style={styles.empty}>
          No anatomy configured for this story. Add{' '}
          <code style={styles.code}>parameters.anatomy</code> and annotate elements with{' '}
          <code style={styles.code}>data-part="name"</code>.
        </p>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.empty}>
          No parts found. Annotate elements in your story with{' '}
          <code style={styles.code}>data-part="name"</code> or pass{' '}
          <code style={styles.code}>parameters.anatomy.parts</code>.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <ul style={styles.list} role="list" aria-label="Anatomy parts">
        {parts.map((part) => {
          const active = activeId === part.id;
          return (
            <li
              key={part.id}
              role="listitem"
              tabIndex={0}
              aria-label={part.name}
              style={{
                ...styles.entry,
                background: active ? `color-mix(in srgb, ${accent} 7%, transparent)` : undefined,
                borderColor: active ? `color-mix(in srgb, ${accent} 20%, transparent)` : 'transparent',
              }}
              onMouseEnter={() => emit(EVENTS.HOVER_ITEM, { partId: part.id })}
              onMouseLeave={() => emit(EVENTS.LEAVE_ITEM)}
              onFocus={() => emit(EVENTS.HOVER_ITEM, { partId: part.id })}
              onBlur={() => emit(EVENTS.LEAVE_ITEM)}
            >
              <div style={styles.header}>
                <span
                  aria-hidden="true"
                  style={{
                    ...styles.indicator,
                    background: active ? accent : undefined,
                    borderColor: active ? accent : '#d1d5db',
                  }}
                />
                <span style={{ ...styles.name, color: active ? accent : undefined }}>
                  {part.name}
                </span>
                <code style={styles.id}>{part.id}</code>
              </div>
              {part.description && <p style={styles.description}>{part.description}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
