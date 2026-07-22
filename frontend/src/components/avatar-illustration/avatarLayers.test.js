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
    'avatar-jaw-plane', 'avatar-upper-eye-plane', 'avatar-nose-plane',
  ]) {
    assert.match(source, new RegExp(marker), `missing ${marker}`);
  }
});

test('short hair opens both brows and reserves lifted paint for selective highlights', () => {
  const source = readFileSync(new URL('parts/hair.jsx', import.meta.url), 'utf8');

  assert.match(source, /avatar-brow-window-left/, 'missing left brow window');
  assert.match(source, /avatar-brow-window-right/, 'missing right brow window');
  assert.doesNotMatch(
    source,
    /fill=\{palette\.hair\.lifted\}/,
    'lifted hair paint must not fill broad crown or lock shapes',
  );
  assert.match(
    source,
    /avatar-hair-directional-highlight[\s\S]*?fill="none"[\s\S]*?stroke=\{palette\.hair\.lifted\}/,
    'lifted hair paint must be limited to an open directional highlight',
  );
});

test('face finish uses localized planes and two small highlights per eye', () => {
  const heads = readFileSync(new URL('parts/heads.jsx', import.meta.url), 'utf8');
  const faces = readFileSync(new URL('parts/faces.jsx', import.meta.url), 'utf8');

  assert.match(heads, /avatar-cheek-plane/, 'missing curved cheek plane');
  assert.match(heads, /avatar-jaw-plane/, 'missing localized jaw plane');
  assert.doesNotMatch(faces, /avatar-eye-shadow/, 'broad eye socket masks must be removed');
  assert.equal(
    (faces.match(/avatar-eye-highlight-small/g) || []).length,
    4,
    'each eye must have exactly two small highlights',
  );
});
