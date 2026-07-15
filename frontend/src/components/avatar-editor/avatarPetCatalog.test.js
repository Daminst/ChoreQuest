import assert from 'node:assert/strict';
import test from 'node:test';

const loadCatalog = () => import('./avatarPetCatalog.js');

test('shared pet catalogs preserve the canonical choices and are immutable', async () => {
  const {
    PET_OPTIONS,
    PET_POSITION_OPTIONS,
    PET_ACCESSORY_OPTIONS,
    PET_COLORS,
    PET_LEVEL_THRESHOLDS,
    PET_LEVEL_NAMES,
    PET_LEVEL_COLORS,
  } = await loadCatalog();

  assert.deepEqual(PET_OPTIONS.map(({ id }) => id), ['none', 'cat', 'dog', 'dragon', 'owl', 'bunny', 'phoenix']);
  assert.deepEqual(PET_POSITION_OPTIONS.map(({ id }) => id), ['right', 'left', 'head', 'custom']);
  assert.deepEqual(PET_ACCESSORY_OPTIONS.map(({ id }) => id), ['none', 'crown', 'party_hat', 'bow', 'bandana', 'halo', 'flower']);
  assert.deepEqual(PET_COLORS, ['#8b4513', '#4a3728', '#f39c12', '#ef4444', '#10b981', '#a855f7', '#ecf0f1', '#1a1a2e', '#c0c0c0', '#ff6b9d', '#06b6d4', '#f59e0b']);
  assert.deepEqual(PET_LEVEL_THRESHOLDS, [0, 50, 150, 350, 700, 1200, 2000, 3500]);
  assert.deepEqual(PET_LEVEL_NAMES, ['', 'Hatchling', 'Youngling', 'Companion', 'Loyal', 'Brave', 'Mighty', 'Majestic', 'Legendary']);
  assert.deepEqual(PET_LEVEL_COLORS, ['', '#94a3b8', '#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#f97316', '#ef4444', '#d946ef']);
  for (const catalog of [PET_OPTIONS, PET_POSITION_OPTIONS, PET_ACCESSORY_OPTIONS, PET_COLORS, PET_LEVEL_THRESHOLDS, PET_LEVEL_NAMES, PET_LEVEL_COLORS]) {
    assert.equal(Object.isFrozen(catalog), true);
  }
  assert.equal(PET_OPTIONS.every(Object.isFrozen), true);
});

test('pet level helpers keep threshold boundaries and per-pet XP fallback semantics', async () => {
  const { getPetLevelInfo, getPetXpForPet } = await loadCatalog();

  assert.equal(getPetLevelInfo(49).level, 1);
  assert.deepEqual(getPetLevelInfo(50), {
    level: 2,
    name: 'Youngling',
    nextName: 'Companion',
    xp: 50,
    threshold: 50,
    nextThreshold: 150,
    progress: 0,
  });
  assert.deepEqual(getPetLevelInfo(3500), {
    level: 8,
    name: 'Legendary',
    nextName: null,
    xp: 3500,
    threshold: 3500,
    nextThreshold: null,
    progress: 1,
  });
  const config = { pet_xp: 75, pet_xp_map: { cat: 0, dog: 150 } };
  assert.equal(getPetXpForPet(config, 'cat'), 0);
  assert.equal(getPetXpForPet(config, 'dog'), 150);
  assert.equal(getPetXpForPet(config, 'owl'), 75);
  assert.equal(getPetXpForPet(config, 'none'), 0);
});

test('pet colour reset is one immutable canonical override patch', async () => {
  const { PET_COLOR_RESET_PATCH } = await loadCatalog();

  assert.deepEqual(PET_COLOR_RESET_PATCH, {
    pet_color_ears: '',
    pet_color_tail: '',
    pet_color_accent: '',
  });
  assert.deepEqual(Object.keys(PET_COLOR_RESET_PATCH), ['pet_color_ears', 'pet_color_tail', 'pet_color_accent']);
  assert.equal(Object.isFrozen(PET_COLOR_RESET_PATCH), true);
  assert.equal(Object.hasOwn(PET_COLOR_RESET_PATCH, 'pet_color'), false);
  assert.equal(Object.hasOwn(PET_COLOR_RESET_PATCH, 'pet_color_body'), false);
});

test('editor-boundary normalization migrates a legacy body override without mutating input', async () => {
  const { normalizeAvatarPetColors } = await loadCatalog();
  const legacy = {
    pet_color: '#111111',
    pet_color_body: '#abcdef',
    pet_color_ears: '#222222',
    untouched: true,
  };

  assert.deepEqual(normalizeAvatarPetColors(legacy), {
    pet_color: '#abcdef',
    pet_color_body: '',
    pet_color_ears: '#222222',
    untouched: true,
  });
  assert.deepEqual(legacy, {
    pet_color: '#111111',
    pet_color_body: '#abcdef',
    pet_color_ears: '#222222',
    untouched: true,
  });
  const canonical = { pet_color: '#123456', pet_color_body: '', pet_color_tail: '#654321' };
  assert.equal(normalizeAvatarPetColors(canonical), canonical);
});

test('body colour selection creates one immutable canonical migration patch', async () => {
  const { createPetBodyColorPatch } = await loadCatalog();
  const patch = createPetBodyColorPatch('#fedcba');

  assert.deepEqual(patch, { pet_color: '#fedcba', pet_color_body: '' });
  assert.equal(Object.isFrozen(patch), true);
});
