import {
  createAnatomy,
  type AnatomyController,
  type AnatomyPartDefinition,
  type AnatomyPresetName,
} from '@component-anatomy/core';

/* ────────────────────────── helpers ────────────────────────── */

/** Builds the documentation panel entries (data-anatomy-item) for a demo. */
function buildPanel(panel: HTMLElement, parts: AnatomyPartDefinition[]) {
  panel.innerHTML = '';
  parts.forEach((part) => {
    const entry = document.createElement('div');
    entry.className = 'panel-entry';
    entry.dataset.anatomyItem = part.id;
    entry.tabIndex = 0;
    entry.innerHTML = `
      <div class="panel-entry-head">
        <span class="panel-dot"></span>
        <span class="panel-name">${part.name}</span>
        <code class="panel-id">${part.id}</code>
      </div>
      ${part.description ? `<p class="panel-desc">${part.description}</p>` : ''}
    `;
    panel.appendChild(entry);
  });
}

function demo(id: string) {
  const section = document.getElementById(id)!;
  return {
    root: section.querySelector<HTMLElement>('[data-demo-root]')!,
    panel: section.querySelector<HTMLElement>('[data-demo-panel]')!,
  };
}

/* ────────────────── 1. Button — zero-config default ────────────────── */
{
  const { root, panel } = demo('demo-button');
  const parts: AnatomyPartDefinition[] = [
    { id: 'icon', name: 'Icon', description: 'Optional leading glyph reinforcing the action.' },
    { id: 'label', name: 'Label', description: 'The visible action text. Keep it a verb.' },
    { id: 'badge', name: 'Badge', description: 'Numeric counter for associated items.' },
  ];
  buildPanel(panel, parts);
  createAnatomy({ root, panel, parts });
}

/* ────────────── 2. Slider — presets & live theme switching ────────────── */
{
  const { root, panel } = demo('demo-slider');
  const parts: AnatomyPartDefinition[] = [
    { id: 'track', name: 'Track', description: 'The rail the thumb travels along.' },
    { id: 'fill', name: 'Fill', description: 'Visualizes the selected portion of the range.' },
    { id: 'thumb', name: 'Thumb', description: 'The draggable handle. Focusable, arrow-key operable.' },
    { id: 'mark', name: 'Mark', description: 'Optional tick marks — note all three highlight together.' },
  ];
  buildPanel(panel, parts);
  const controller: AnatomyController = createAnatomy({ root, panel, parts });

  const presetSelect = document.getElementById('preset-select') as HTMLSelectElement;
  const accentInput = document.getElementById('accent-input') as HTMLInputElement;
  const accentEnabled = document.getElementById('accent-enabled') as HTMLInputElement;

  const applyTheme = () => {
    const preset = presetSelect.value as AnatomyPresetName;
    const theme = accentEnabled.checked ? { accent: accentInput.value } : {};
    controller.setTheme(theme, preset);
  };
  presetSelect.addEventListener('change', applyTheme);
  accentInput.addEventListener('input', applyTheme);
  accentEnabled.addEventListener('change', applyTheme);
}

/* ──────────────────── 3. Tabs — overlay hooks ──────────────────── */
{
  const { root, panel } = demo('demo-tabs');
  const parts: AnatomyPartDefinition[] = [
    { id: 'tablist', name: 'Tab list', description: 'Container for the tab buttons. role="tablist".' },
    { id: 'tab', name: 'Tab', description: 'One selector per panel. Three matches — labels are numbered by <code>renderLabel</code>.' },
    { id: 'indicator', name: 'Indicator', description: 'Animated underline marking the active tab.' },
    { id: 'tabpanel', name: 'Tab panel', description: 'The content region controlled by the active tab.' },
  ];
  buildPanel(panel, parts);

  createAnatomy({
    root,
    panel,
    parts,
    theme: { accent: '#0d9488' },
    overlay: {
      padding: 3,
      className: 'sandbox-overlay',
      renderLabel: ({ part, index }) =>
        part.id === 'tab' ? `${part.name} #${index + 1}` : part.name,
      decorateOverlay: (box) => {
        const corner = document.createElement('span');
        corner.className = 'overlay-corner';
        box.appendChild(corner);
      },
    },
  });
}

/* ────────── 4. Input — auto-discovery & dynamic DOM updates ────────── */
{
  const { root, panel } = demo('demo-input');

  // No parts passed: the controller derives them from data-part attributes.
  const controller = createAnatomy({ root, preset: 'minimal', panel });

  const syncPanel = () => buildPanel(panel, controller.getParts());
  syncPanel();

  // Toggle a clear button inside the field — the MutationObserver picks it up.
  const fieldBox = root.querySelector<HTMLElement>('.field-box')!;
  document.getElementById('toggle-clear')!.addEventListener('click', () => {
    const existing = fieldBox.querySelector('[data-part="clear-button"]');
    if (existing) {
      existing.remove();
    } else {
      const btn = document.createElement('button');
      btn.className = 'field-clear';
      btn.dataset.part = 'clear-button';
      btn.textContent = '×';
      fieldBox.appendChild(btn);
    }
    // Panel entries are ours to rebuild; the controller re-syncs listeners itself.
    requestAnimationFrame(() => {
      syncPanel();
      controller.refresh();
    });
  });
}
