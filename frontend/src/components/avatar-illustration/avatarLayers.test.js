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
