/**
 * Regression fixture for the `./blocks` subpath, mirroring
 * `consumer-types.ts` for issue #12.
 *
 * Type-checks against the package's *built* declaration output
 * (`dist/blocks.d.ts`), the way a consumer's MDX would resolve it — not
 * against `src/`. A build that emits `dist/blocks.js` but no declarations
 * type-checks perfectly at source and still ships broken; only a check
 * rooted in `dist` catches that.
 */
import React from 'react';
import { Anatomy, AnatomyTable } from '../dist/blocks.js';
import type { AnatomyProps, AnatomyTableProps } from '../dist/blocks.js';

declare const Primary: { name: string };

// The three documented shapes: resolved from a story, from a curated part
// list, and from the current story of an attached docs page.
export const FromStory = <AnatomyTable of={Primary} />;
export const Curated = (
  <AnatomyTable
    of={Primary}
    parts={[{ id: 'label', name: 'Label', description: 'The visible action text.' }]}
    sync={false}
  />
);
export const FromDocsContext = <AnatomyTable />;

const tableProps: AnatomyTableProps = { of: Primary, sync: true };
void tableProps;

// `<Anatomy>` — canvas and table together — takes the same props plus
// `sourceState`, passed through to its `<Canvas>`.
export const CanvasAndTable = <Anatomy of={Primary} sourceState="shown" />;

const props: AnatomyProps = { of: Primary, sync: true, sourceState: 'none' };
void props;

// If `dist/blocks.d.ts` went missing, `Anatomy` degrades to `any`, this
// assignment stops erroring, and the unused `@ts-expect-error` becomes an
// error itself — the check fails either way.
// @ts-expect-error - `bogusProp` is not part of AnatomyProps
export const Invalid = <Anatomy of={Primary} bogusProp />;

void React;
