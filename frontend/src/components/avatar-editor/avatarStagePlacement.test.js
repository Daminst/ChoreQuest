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

test('arrow movement is clamped and ignores unrelated keys', async () => {
  const { movePetWithKeyboard } = await loadPlacement();

  assert.deepEqual(movePetWithKeyboard(4, 4, 'ArrowLeft'), { x: 4, y: 4 });
  assert.deepEqual(movePetWithKeyboard(4, 4, 'ArrowUp'), { x: 4, y: 4 });
  assert.deepEqual(movePetWithKeyboard(28, 28, 'ArrowRight'), { x: 28, y: 28 });
  assert.deepEqual(movePetWithKeyboard(16, 16, 'ArrowDown'), { x: 16, y: 17 });
  assert.equal(movePetWithKeyboard(16, 16, 'Enter'), null);
});
