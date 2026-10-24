import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { AVATAR_CANVAS, mapLegacyPetPoint } from '../avatar-illustration/avatarGeometry.js';

const loadPlacement = () => import('./avatarStagePlacement.js');

test('pet coordinates clamp to the safe 4..28 stage range', async () => {
  const { clampPetCoordinate } = await loadPlacement();

  assert.equal(clampPetCoordinate(-100), 4);
  assert.equal(clampPetCoordinate(4), 4);
  assert.equal(clampPetCoordinate(16), 16);
  assert.equal(clampPetCoordinate(28), 28);
  assert.equal(clampPetCoordinate(100), 28);
});

test('rendered pet anchors round-trip through pointer mapping on an actual 3:4 stage', async () => {
  const { mapPetPointerPosition } = await loadPlacement();
  const rect = { left: 100, top: 50, width: 465, height: 620 };

  for (const saved of [
    { x: 4, y: 4 },
    { x: 28, y: 4 },
    { x: 4, y: 28 },
    { x: 28, y: 28 },
    { x: 16, y: 16 },
  ]) {
    const renderedAnchor = mapLegacyPetPoint(saved.x, saved.y);
    const clientX = rect.left + ((renderedAnchor.x / AVATAR_CANVAS.width) * rect.width);
    const clientY = rect.top + ((renderedAnchor.y / AVATAR_CANVAS.height) * rect.height);
    assert.deepEqual(mapPetPointerPosition(clientX, clientY, rect), saved);
  }

  assert.deepEqual(mapPetPointerPosition(rect.left, rect.top, rect), { x: 4, y: 4 });
  assert.deepEqual(
    mapPetPointerPosition(rect.left + rect.width, rect.top + rect.height, rect),
    { x: 28, y: 28 },
  );
});

test('placement marker uses the renderer pet anchor on the full avatar frame', () => {
  const stage = readFileSync(new URL('./AvatarStage.jsx', import.meta.url), 'utf8');

  assert.match(stage, /const petMarker = mapLegacyPetPoint\(petX, petY\)/);
  assert.match(stage, /viewBox=\{PET_PLACEMENT_FRAME\.viewBox\}/);
  assert.match(stage, /cx=\{petMarker\.x\}/);
  assert.match(stage, /cy=\{petMarker\.y\}/);
});

test('arrow movement is clamped and ignores unrelated keys', async () => {
  const { movePetWithKeyboard } = await loadPlacement();

  assert.deepEqual(movePetWithKeyboard(4, 4, 'ArrowLeft'), { x: 4, y: 4 });
  assert.deepEqual(movePetWithKeyboard(4, 4, 'ArrowUp'), { x: 4, y: 4 });
  assert.deepEqual(movePetWithKeyboard(28, 28, 'ArrowRight'), { x: 28, y: 28 });
  assert.deepEqual(movePetWithKeyboard(16, 16, 'ArrowDown'), { x: 16, y: 17 });
  assert.equal(movePetWithKeyboard(16, 16, 'Enter'), null);
});

test('placement keyboard interaction moves in two dimensions and confirms with Enter or Space', async () => {
  const { resolvePetPlacementKey } = await loadPlacement();

  assert.deepEqual(resolvePetPlacementKey(16, 16, 'ArrowLeft'), { x: 15, y: 16 });
  assert.deepEqual(resolvePetPlacementKey(16, 16, 'ArrowDown'), { x: 16, y: 17 });
  assert.deepEqual(resolvePetPlacementKey(16, 16, 'Enter'), { x: 16, y: 16 });
  assert.deepEqual(resolvePetPlacementKey(16, 16, ' '), { x: 16, y: 16 });
  assert.equal(resolvePetPlacementKey(16, 16, 'Escape'), null);
});

test('placement mode keeps centering and internal motion on separate elements without a second idle sway', async () => {
  const {
    getAvatarStageCharacterClassName,
    getAvatarStageMotionClassName,
  } = await loadPlacement();

  assert.equal(getAvatarStageCharacterClassName(false), 'avatar-stage__character');
  assert.equal(getAvatarStageCharacterClassName(true), 'avatar-stage__character');
  assert.equal(getAvatarStageMotionClassName(false), 'avatar-stage__motion');
  assert.equal(getAvatarStageMotionClassName(true), 'avatar-stage__motion');

  const stage = readFileSync(new URL('./AvatarStage.jsx', import.meta.url), 'utf8');
  assert.match(stage, /className=\{getAvatarStageCharacterClassName\(placementMode\)\}/);
  assert.match(stage, /className=\{getAvatarStageMotionClassName\(placementMode\)\}[\s\S]*<AvatarDisplay/);
  assert.match(stage, /<AvatarDisplay[\s\S]*animate=\{!placementMode\}/);
  assert.match(stage, /data-avatar-placement-active=\{placementMode \? 'true' : 'false'\}/);
  assert.match(stage, /data-avatar-motion=\{placementMode \? 'off' : 'on'\}/);
});
