import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVATAR_CANVAS,
  getAvatarFrame,
  getAvatarOptionCrop,
  getAvatarRenderDimensions,
  mapLegacyPetPoint,
} from './avatarGeometry.js';
import { AVATAR_CATALOG, DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';

test('full artwork uses a 3:4 240x320 canvas', () => {
  assert.deepEqual(AVATAR_CANVAS, { width: 240, height: 320 });
  assert.equal(getAvatarFrame('full').viewBox, '0 0 240 320');
  assert.equal(getAvatarFrame('portrait').viewBox, '48 4 144 144');
  assert.equal(getAvatarFrame('icon').viewBox, '42 18 156 156');
  assert.deepEqual(getAvatarRenderDimensions(420, 'full'), { width: 315, height: 420 });
  assert.deepEqual(getAvatarRenderDimensions(76, 'portrait'), { width: 76, height: 76 });
});

test('editor categories choose a crop that exposes the changed part', () => {
  for (const category of ['head', 'skin', 'hair', 'eyes', 'mouth', 'hat', 'face']) {
    assert.equal(getAvatarOptionCrop(category), 'portrait');
  }
  for (const category of ['body', 'outfit', 'pattern', 'background', 'accessory', 'pet']) {
    assert.equal(getAvatarOptionCrop(category), 'full');
  }
});

test('legacy pet points map into the full-body canvas and clamp safely', () => {
  assert.deepEqual(mapLegacyPetPoint(4, 4), { x: 36, y: 64 });
  assert.deepEqual(mapLegacyPetPoint(28, 28), { x: 204, y: 280 });
  assert.deepEqual(mapLegacyPetPoint(-20, 80), { x: 36, y: 280 });
});

test('catalog remains complete and default config keeps version two', () => {
  assert.equal(AVATAR_CATALOG.head.options.length, 9);
  assert.equal(AVATAR_CATALOG.hair.options.length, 21);
  assert.equal(AVATAR_CATALOG.eyes.options.length, 15);
  assert.equal(AVATAR_CATALOG.mouth.options.length, 14);
  assert.equal(AVATAR_CATALOG.hat.options.length, 17);
  assert.equal(DEFAULT_CONFIG._v, 2);
});
