import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_LAYER_ORDER, getAvatarLayerOrder } from './avatarLayers.js';

test('avatar layer order is deterministic and immutable', () => {
  assert.deepEqual(getAvatarLayerOrder(), [
    'rear-effects', 'rear-pet', 'rear-accessories', 'rear-hair', 'legs', 'torso-arms',
    'neck-ears', 'head', 'face', 'front-hair', 'hat', 'front-accessories', 'pet', 'finish',
  ]);
  assert.ok(Object.isFrozen(AVATAR_LAYER_ORDER));
});

test('compositor exposes every named layer in contract order', () => {
  const source = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  let cursor = -1;
  for (const layer of getAvatarLayerOrder()) {
    const next = source.indexOf(`data-avatar-layer=\"${layer}\"`);
    assert.ok(next > cursor, `${layer} must appear after the preceding layer`);
    cursor = next;
  }
});

test('vertical slice contains complete anatomy and illustration finish markers', () => {
  const files = ['parts/anatomy.jsx', 'parts/heads.jsx', 'parts/faces.jsx', 'parts/hair.jsx', 'parts/outfits.jsx'];
  const source = files.map((file) => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n');
  for (const marker of [
    'avatar-leg-left', 'avatar-leg-right', 'avatar-hand-left', 'avatar-hand-right',
    'avatar-shoe-left', 'avatar-shoe-right', 'avatar-outline', 'avatar-highlight',
    'avatar-detail', 'avatar-cheek', 'avatar-hair-strand', 'avatar-outfit-seam',
  ]) {
    assert.match(source, new RegExp(marker), `missing ${marker}`);
  }
});

test('vertical slice models hair, face, hoodie, shorts, and shoes with distinct finish planes', () => {
  const files = ['parts/anatomy.jsx', 'parts/heads.jsx', 'parts/faces.jsx', 'parts/hair.jsx', 'parts/outfits.jsx'];
  const source = files.map((file) => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n');
  for (const marker of [
    'avatar-hair-lock', 'avatar-hair-plane', 'avatar-face-plane', 'avatar-hood-volume',
    'avatar-sleeve-fold', 'avatar-ribbing', 'avatar-pocket-stitch',
    'avatar-shorts-panel', 'avatar-shoe-panel', 'avatar-hair-root-shadow',
    'avatar-hair-boundary', 'avatar-hair-directional-highlight',
    'avatar-jaw-shadow', 'avatar-eye-shadow', 'avatar-nose-plane',
  ]) {
    assert.match(source, new RegExp(marker), `missing ${marker}`);
  }
});
