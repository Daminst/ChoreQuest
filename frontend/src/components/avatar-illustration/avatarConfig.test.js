import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';
import * as avatarConfig from './avatarConfig.js';

const { normalizeAvatarIllustrationConfig } = avatarConfig;

test('normalization is immutable and migrates legacy renderer aliases in memory', () => {
  const source = { hair_style: 'long', accessory: 'cape', accessories: [] };
  const normalized = normalizeAvatarIllustrationConfig(source);
  assert.notEqual(normalized, source);
  assert.equal(normalized.hair, 'long');
  assert.deepEqual(normalized.accessories, ['cape']);
  assert.deepEqual(source, { hair_style: 'long', accessory: 'cape', accessories: [] });
});

test('normalization keeps unknown values for registry-level fallback', () => {
  const normalized = normalizeAvatarIllustrationConfig({ head: 'future-head', pet_x: 99 });
  assert.equal(normalized.head, 'future-head');
  assert.equal(normalized.pet_x, 99);
  assert.equal(normalized._v, 2);
});

test('normalization preserves accessory order and duplicates while filtering empty values immutably', () => {
  const accessories = Object.freeze(['cape', 'none', 'future-accessory', 'shield', 'cape', null]);
  const source = Object.freeze({ accessories });
  const normalized = normalizeAvatarIllustrationConfig(source);

  assert.deepEqual(normalized.accessories, ['cape', 'future-accessory', 'shield', 'cape']);
  assert.notEqual(normalized.accessories, accessories);
  assert.deepEqual(source.accessories, ['cape', 'none', 'future-accessory', 'shield', 'cape', null]);
});

test('selection feedback key changes for every user-visible default configuration field', () => {
  assert.equal(typeof avatarConfig.getAvatarSelectionKey, 'function');

  const mutations = Object.freeze({
    head: 'oval',
    hair: 'long',
    eyes: 'happy',
    mouth: 'grin',
    body: 'broad',
    head_color: '#010101',
    hair_color: '#020202',
    eye_color: '#030303',
    mouth_color: '#040404',
    body_color: '#050505',
    bg_color: '#060606',
    hat: 'crown',
    hat_color: '#070707',
    accessory: 'cape',
    accessories: ['shield', 'cape'],
    accessory_color: '#080808',
    face_extra: 'freckles',
    outfit_pattern: 'stripes',
    pet: 'dragon',
    pet_color: '#090909',
    pet_color_body: '#101010',
    pet_color_ears: '#111111',
    pet_color_tail: '#121212',
    pet_color_accent: '#131313',
    pet_position: 'custom',
    pet_x: 4,
    pet_y: 28,
    pet_accessory: 'crown',
  });
  const defaultVisibleFields = Object.keys(DEFAULT_CONFIG).filter((field) => field !== '_v');

  assert.deepEqual(Object.keys(mutations).sort(), defaultVisibleFields.sort());

  const baseline = avatarConfig.getAvatarSelectionKey(DEFAULT_CONFIG);
  for (const [field, value] of Object.entries(mutations)) {
    const changed = avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, [field]: value });
    assert.notEqual(changed, baseline, `${field} must replay selection feedback`);
  }
});

test('selection feedback key is property-order independent and preserves compatibility and accessory order', () => {
  assert.equal(typeof avatarConfig.getAvatarSelectionKey, 'function');

  const reversedDefaults = Object.fromEntries(Object.entries(DEFAULT_CONFIG).reverse());
  assert.equal(
    avatarConfig.getAvatarSelectionKey(reversedDefaults),
    avatarConfig.getAvatarSelectionKey(DEFAULT_CONFIG),
  );
  assert.equal(
    avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, hair: '', hair_style: 'long' }),
    avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, hair: 'long' }),
  );
  assert.equal(
    avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, accessory: 'cape', accessories: [] }),
    avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, accessory: 'none', accessories: ['cape'] }),
  );
  assert.notEqual(
    avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, accessories: ['cape', 'shield'] }),
    avatarConfig.getAvatarSelectionKey({ ...DEFAULT_CONFIG, accessories: ['shield', 'cape'] }),
  );
});
