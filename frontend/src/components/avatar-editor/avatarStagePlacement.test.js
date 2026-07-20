import assert from 'node:assert/strict';
import test from 'node:test';

const loadPlacement = () => import('./avatarStagePlacement.js');

test('pet coordinates clamp to the safe 4..28 stage range', async () => {
  const { clampPetCoordinate } = await loadPlacement();

  assert.equal(clampPetCoordinate(-100), 4);
  assert.equal(clampPetCoordinate(4), 4);
  assert.equal(clampPetCoordinate(16), 16);
  assert.equal(clampPetCoordinate(28), 28);
  assert.equal(clampPetCoordinate(100), 28);
});

test('pointer coordinates map through the 32x32 stage before clamping', async () => {
  const { mapPetPointerPosition } = await loadPlacement();
  const rect = { left: 100, top: 50, width: 320, height: 160 };

  assert.deepEqual(mapPetPointerPosition(260, 130, rect), { x: 16, y: 16 });
  assert.deepEqual(mapPetPointerPosition(100, 50, rect), { x: 4, y: 4 });
  assert.deepEqual(mapPetPointerPosition(420, 210, rect), { x: 28, y: 28 });
});

test('pointer coordinates ignore horizontal letterboxing around a square avatar', async () => {
  const { mapPetPointerPosition } = await loadPlacement();
  const rect = { left: 100, top: 50, width: 320, height: 160 };

  assert.deepEqual(mapPetPointerPosition(180, 130, rect), { x: 4, y: 16 });
  assert.deepEqual(mapPetPointerPosition(220, 130, rect), { x: 8, y: 16 });
  assert.deepEqual(mapPetPointerPosition(340, 130, rect), { x: 28, y: 16 });
});

test('pointer coordinates ignore vertical letterboxing around a square avatar', async () => {
  const { mapPetPointerPosition } = await loadPlacement();
  const rect = { left: 40, top: 20, width: 180, height: 360 };

  assert.deepEqual(mapPetPointerPosition(130, 110, rect), { x: 16, y: 4 });
  assert.deepEqual(mapPetPointerPosition(130, 155, rect), { x: 16, y: 8 });
  assert.deepEqual(mapPetPointerPosition(130, 290, rect), { x: 16, y: 28 });
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

test('placement mode keeps the shared pet coordinate frame still while normal preview remains animated', async () => {
  const { getAvatarStageCharacterClassName } = await loadPlacement();

  assert.equal(getAvatarStageCharacterClassName(false), 'avatar-stage__character avatar-idle');
  assert.equal(getAvatarStageCharacterClassName(true), 'avatar-stage__character');
});
