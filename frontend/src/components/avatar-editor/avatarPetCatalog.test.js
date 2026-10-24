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
  const {
    PET_LEVEL_SCALES,
    getPetLevelInfo,
    getPetLevelScale,
    getPetXpForPet,
  } = await loadCatalog();

  assert.equal(getPetLevelInfo(49).level, 1);
  const exactBoundaries = [
    [0, 1, 0, 50],
    [50, 2, 50, 150],
    [150, 3, 150, 350],
    [350, 4, 350, 700],
    [700, 5, 700, 1200],
    [1200, 6, 1200, 2000],
    [2000, 7, 2000, 3500],
    [3500, 8, 3500, null],
  ];
  for (const [xp, level, threshold, nextThreshold] of exactBoundaries) {
    assert.deepEqual(
      {
        level: getPetLevelInfo(xp).level,
        threshold: getPetLevelInfo(xp).threshold,
        nextThreshold: getPetLevelInfo(xp).nextThreshold,
      },
      { level, threshold, nextThreshold },
      `${xp} XP must begin level ${level}`,
    );
  }
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
  assert.deepEqual(PET_LEVEL_SCALES, [1, 1.04, 1.08, 1.12, 1.16, 1.2, 1.24, 1.28]);
  assert.equal(Object.isFrozen(PET_LEVEL_SCALES), true);
  for (let level = 1; level <= 8; level += 1) {
    assert.equal(getPetLevelScale(level), PET_LEVEL_SCALES[level - 1]);
  }
  assert.equal(getPetLevelScale(0), 1);
  assert.equal(getPetLevelScale(99), 1.28);
  const config = { pet_xp: 75, pet_xp_map: { cat: 0, dog: 150 } };
  assert.equal(getPetXpForPet(config, 'cat'), 0);
  assert.equal(getPetXpForPet(config, 'dog'), 150);
  assert.equal(getPetXpForPet(config, 'owl'), 75);
  assert.equal(getPetXpForPet(config, 'none'), 0);
});

test('pet colours honor body ears tail and accent overrides without mutating input', async () => {
  const { buildPetColors } = await loadCatalog();
  const config = Object.freeze({
    pet_color: '#111111',
    pet_color_body: '#222222',
    pet_color_ears: '#333333',
    pet_color_tail: '#444444',
    pet_color_accent: '#555555',
  });

  const colors = buildPetColors(config);

  assert.deepEqual(colors, {
    body: '#222222',
    ears: '#333333',
    tail: '#444444',
    accent: '#555555',
  });
  assert.equal(Object.isFrozen(colors), true);
  assert.deepEqual(config, {
    pet_color: '#111111',
    pet_color_body: '#222222',
    pet_color_ears: '#333333',
    pet_color_tail: '#444444',
    pet_color_accent: '#555555',
  });
  assert.deepEqual(buildPetColors({ pet_color: '#abcdef' }), {
    body: '#abcdef',
    ears: '#abcdef',
    tail: '#abcdef',
    accent: '#abcdef',
  });
  assert.deepEqual(buildPetColors({}), {
    body: '#8b4513',
    ears: '#8b4513',
    tail: '#8b4513',
    accent: '#8b4513',
  });
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
