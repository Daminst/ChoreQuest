import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeAvatarIllustrationConfig } from './avatarConfig.js';

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
