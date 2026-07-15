import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyAvatarChange,
  buildDisplayConfig,
  configsEqual,
  pushAvatarHistory,
  randomiseAvatarConfig,
  toggleAvatarAccessory,
  undoAvatarChange,
} from './avatarEditorState.js';

test('history is immutable, capped at 30 snapshots, and undo returns the latest snapshot', () => {
  let history = [];
  let config = { head: 'round', accessories: [] };
  for (let index = 0; index < 35; index += 1) {
    history = pushAvatarHistory(history, config);
    config = { ...config, head: `head-${index}` };
  }
  assert.equal(history.length, 30);
  const undone = undoAvatarChange(history, config);
  assert.equal(undone.config.head, 'head-33');
  assert.equal(undone.history.length, 29);
});

test('pet changes refresh legacy pet_xp without mutating pet_xp_map', () => {
  const original = { pet: 'cat', pet_xp: 10, pet_xp_map: { cat: 10, dog: 42 } };
  const changed = applyAvatarChange(original, 'pet', 'dog');
  assert.deepEqual(changed, { pet: 'dog', pet_xp: 42, pet_xp_map: { cat: 10, dog: 42 } });
  assert.equal(original.pet, 'cat');
});

test('preview and accessory helpers do not mutate the saved session config', () => {
  const original = { hair: 'short', accessory: 'none', accessories: [] };
  assert.deepEqual(buildDisplayConfig(original, { key: 'hair', value: 'long' }), {
    hair: 'long', accessory: 'none', accessories: [],
  });
  assert.deepEqual(toggleAvatarAccessory(original, 'cape'), {
    hair: 'short', accessory: 'cape', accessories: ['cape'],
  });
  assert.deepEqual(buildDisplayConfig({ ...original, accessory: 'cape', accessories: ['cape'] }, { key: 'accessory', value: 'shield' }), {
    hair: 'short', accessory: 'shield', accessories: ['cape', 'shield'],
  });
  assert.deepEqual(original.accessories, []);
});

test('randomise excludes locked choices and preserves pet identity and progression', () => {
  const config = {
    head: 'round', hair: 'short', head_color: '#111111',
    pet: 'dragon', pet_xp: 350, pet_xp_map: { dragon: 350 },
    pet_position: 'head', pet_color_body: '#222222',
  };
  const recipe = {
    optionGroups: [
      { key: 'head', itemCategory: 'head', options: [{ id: 'round' }, { id: 'oval' }] },
      { key: 'hair', itemCategory: 'hair', options: [{ id: 'short' }, { id: 'long' }] },
    ],
    colourGroups: [{ key: 'head_color', values: ['#111111', '#eeeeee'] }],
    accessoryGroup: {
      itemCategory: 'accessory',
      options: [{ id: 'cape' }, { id: 'shield' }],
      chance: 0.5,
    },
  };
  const values = [0.999, 0.999, 0.999, 0.1, 0.999];
  const randomised = randomiseAvatarConfig(
    config,
    recipe,
    { head: new Set(['oval']), accessory: new Set(['cape']) },
    () => values.shift(),
  );
  assert.equal(randomised.head, 'round');
  assert.equal(randomised.hair, 'long');
  assert.equal(randomised.head_color, '#eeeeee');
  assert.deepEqual(randomised.accessories, ['shield']);
  assert.equal(randomised.accessory, 'shield');
  assert.equal(randomised.pet, 'dragon');
  assert.equal(randomised.pet_xp, 350);
  assert.equal(randomised.pet_position, 'head');
  assert.equal(randomised.pet_color_body, '#222222');
});

test('dirty comparison treats cloned nested avatar data as equal', () => {
  const config = { head: 'round', accessories: ['cape'], pet_xp_map: { cat: 50 } };
  assert.equal(configsEqual(config, structuredClone(config)), true);
  assert.equal(configsEqual(config, { ...config, head: 'oval' }), false);
});
