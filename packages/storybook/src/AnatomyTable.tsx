/**
 * The anatomy part table — pure presentation, no Storybook imports.
 *
 * This module is deliberately free of `storybook/manager-api` and
 * `storybook/preview-api`: it is bundled into *both* the manager entry (the
 * addon panel) and the blocks entry (the `<Anatomy>` MDX doc block), which
 * run in different runtimes and cannot share either of those APIs. Only the
 * data acquisition differs between the two; the markup must not.
 */
import React from 'react';
import { useTheme } from 'storybook/theming';
import { resolvePanelAccent } from '@component-anatomy/core';
import type {
  AnatomyPartDefinition,
  AnatomyPresetName,
  AnatomyTheme,
} from '@component-anatomy/core';

/**
 * The subset of Storybook's theme this table reads. Typed loosely on purpose:
 * `useTheme()` resolves to an empty `Theme` interface (Emotion augmentation),
 * and outside a ThemeProvider it returns `{}` — so every read is optional and
 * every value has a literal fallback below.
 */
type PartialStorybookTheme = {
  fgColor?: { default?: string; muted?: string };
  bgColor?: { default?: string; muted?: string };
  borderColor?: { default?: string };
  typography?: { fonts?: { base?: string; mono?: string } };
};

const FONT_BASE_FALLBACK =
  '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';
const FONT_MONO_FALLBACK = 'ui-monospace, "Cascadia Code", "Fira Mono", monospace';

/**
 * Resolves the table's chrome colors from Storybook's theme so the same
 * markup reads correctly in the manager panel *and* in a docs page under a
 * dark theme.
 *
 * `surfaceBg`/`surfaceFg` are not painted anywhere — they are what the accent
 * is measured against in {@link useAccent}. They carry Storybook's own light
 * defaults as fallbacks so the measurement stays meaningful outside a
 * ThemeProvider, where `useTheme()` returns `{}`.
 */
function usePalette() {
  const theme = useTheme() as PartialStorybookTheme;
  return {
    text: theme.fgColor?.default,
    muted: theme.fgColor?.muted ?? '#6b7280',
    mutedBg: theme.bgColor?.muted ?? 'rgba(0,0,0,0.06)',
    border: theme.borderColor?.default ?? 'rgba(0,0,0,0.08)',
    surfaceBg: theme.bgColor?.default ?? '#ffffff',
    surfaceFg: theme.fgColor?.default ?? '#2e3438',
    fontBase: theme.typography?.fonts?.base ?? FONT_BASE_FALLBACK,
    fontMono: theme.typography?.fonts?.mono ?? FONT_MONO_FALLBACK,
  };
}

type Palette = ReturnType<typeof usePalette>;

/**
 * The accent for the active row — the story's own `{ preset, theme }`, so the
 * table agrees with the overlays it describes, lifted to WCAG AA against the
 * surface it is painted on when the two disagree.
 *
 * The check is not optional polish: `preset: 'contrast'` is black on yellow
 * and the Storybook manager is dark by default, so the preset that exists for
 * users who need contrast is exactly the one that would land at 1.3:1 here.
 */
function useAccent(palette: Palette, preset?: AnatomyPresetName, theme?: AnatomyTheme): string {
  return resolvePanelAccent(preset, theme, {
    background: palette.surfaceBg,
    foreground: palette.surfaceFg,
  });
}

const makeStyles = (p: Palette): Record<string, React.CSSProperties> => ({
  container: {
    padding: '12px 16px',
    fontFamily: p.fontBase,
    fontSize: 13,
    lineHeight: 1.5,
    color: p.text,
  },
  empty: {
    color: p.muted,
    margin: 0,
  },
  code: {
    fontFamily: p.fontMono,
    fontSize: '0.85em',
    background: p.mutedBg,
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
    border: `2px solid ${p.border}`,
    flexShrink: 0,
    transition: 'background 120ms ease, border-color 120ms ease',
  },
  name: {
    fontWeight: 700,
    flex: 1,
  },
  id: {
    fontFamily: p.fontMono,
    fontSize: 10,
    padding: '1px 6px',
    borderRadius: 4,
    background: p.mutedBg,
    border: `1px solid ${p.border}`,
    color: p.muted,
    flexShrink: 0,
  },
  description: {
    margin: '4px 0 0',
    paddingLeft: 16,
    color: p.muted,
  },
});

/**
 * An inline `<code>` styled for the surrounding message text. Exported so
 * both runtimes can compose their own empty-state copy without duplicating
 * the style object.
 */
export const AnatomyCode: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const styles = makeStyles(usePalette());
  return <code style={styles.code}>{children}</code>;
};

/** A padded, muted paragraph — used for every "nothing to show" state. */
export const AnatomyMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const styles = makeStyles(usePalette());
  return (
    <div style={styles.container}>
      <p style={styles.empty}>{children}</p>
    </div>
  );
};

export type AnatomyTableProps = {
  /** Parts to list, in the order they should be shown. */
  parts: AnatomyPartDefinition[];
  /** Id of the part currently highlighted in the canvas, if any. */
  activeId?: string | null;
  /** The story's `anatomy.preset` — the active row follows it. */
  preset?: AnatomyPresetName;
  /** The story's `anatomy.theme` — token overrides on top of the preset. */
  theme?: AnatomyTheme;
  /** Called when the user hovers or focuses an entry. */
  onItemEnter?: (partId: string) => void;
  /** Called when the user leaves or blurs an entry. */
  onItemLeave?: () => void;
};

export const AnatomyTable: React.FC<AnatomyTableProps> = ({
  parts,
  activeId = null,
  preset,
  theme,
  onItemEnter,
  onItemLeave,
}) => {
  const palette = usePalette();
  const styles = makeStyles(palette);
  const accent = useAccent(palette, preset, theme);

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
                borderColor: active
                  ? `color-mix(in srgb, ${accent} 20%, transparent)`
                  : 'transparent',
              }}
              onMouseEnter={() => onItemEnter?.(part.id)}
              onMouseLeave={() => onItemLeave?.()}
              onFocus={() => onItemEnter?.(part.id)}
              onBlur={() => onItemLeave?.()}
            >
              <div style={styles.header}>
                <span
                  aria-hidden="true"
                  style={{
                    ...styles.indicator,
                    background: active ? accent : undefined,
                    borderColor: active ? accent : palette.border,
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
