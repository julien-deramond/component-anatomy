import React from 'react';
import { addons, types } from 'storybook/manager-api';
import { AddonPanel } from 'storybook/internal/components';

import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants.js';
import { Panel } from './Panel.js';

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Anatomy',
    paramKey: PARAM_KEY,
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active }) => (
      <AddonPanel active={!!active}>
        <Panel />
      </AddonPanel>
    ),
  });
});
