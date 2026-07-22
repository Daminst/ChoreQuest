import test from 'node:test';
import assert from 'node:assert/strict';
import * as avatarGeometry from './avatarGeometry.js';
import { AVATAR_CATALOG, DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';

const {
  AVATAR_CANVAS,
  getAvatarFrame,
  getAvatarOptionCrop,
  getAvatarRenderDimensions,
  mapLegacyPetPoint,
} = avatarGeometry;

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

test('shared head rig keeps the full figure within 3.25 to 3.75 head heights', () => {
  const { AVATAR_HEAD_RIG, AVATAR_POSE_ANCHORS, getAvatarHeadRigTransform } = avatarGeometry;
  assert.ok(AVATAR_HEAD_RIG, 'missing shared head-rig geometry contract');
  assert.ok(AVATAR_POSE_ANCHORS, 'missing shared pose-anchor contract');
  assert.equal(typeof getAvatarHeadRigTransform, 'function');
  assert.ok(Object.isFrozen(AVATAR_HEAD_RIG));
  assert.ok(Object.isFrozen(AVATAR_HEAD_RIG.anchor));
  assert.ok(Object.isFrozen(AVATAR_HEAD_RIG.sourceBounds));

  const {
    anchor, scaleX, scaleY, sourceBounds,
  } = AVATAR_HEAD_RIG;
  assert.ok(scaleX > scaleY, 'head rig must preserve expressive width while reducing height');
  const headHeight = (sourceBounds.headBottom - sourceBounds.headTop) * scaleY;
  const figureTop = anchor.y + ((sourceBounds.artworkTop - anchor.y) * scaleY);
  const figureBottom = Math.max(
    AVATAR_POSE_ANCHORS.soles.free.y,
    AVATAR_POSE_ANCHORS.soles.weight.y,
  );
  const headRatio = (figureBottom - figureTop) / headHeight;
  const visibleNeckHeight = (sourceBounds.neckBottom - sourceBounds.headBottom) * scaleY;

  assert.ok(headRatio >= 3.25 && headRatio <= 3.75, `head ratio ${headRatio} is out of range`);
  assert.ok(visibleNeckHeight <= 5, 'scaled neck must remain compact under the smaller head');
  assert.equal(getAvatarHeadRigTransform(), AVATAR_HEAD_RIG.transform);
});

test('default pose anchors encode a visible one-leg weight shift and unequal hands', () => {
  const { AVATAR_POSE_ANCHORS } = avatarGeometry;
  assert.ok(AVATAR_POSE_ANCHORS, 'missing shared pose-anchor contract');
  assert.ok(Object.isFrozen(AVATAR_POSE_ANCHORS));

  const { hips, knees, soles, hands, shoulders } = AVATAR_POSE_ANCHORS;
  const weightLegDrift = Math.abs(soles.weight.x - hips.weight.x);
  const freeLegDrift = Math.abs(soles.free.x - hips.free.x);

  assert.ok(weightLegDrift <= 12, 'weight-bearing leg must stay stacked under its hip');
  assert.ok(freeLegDrift >= 24, 'free leg must visibly angle away from its hip');
  assert.ok(Math.abs(soles.weight.x - soles.free.x) >= 68, 'stance must not mirror around center');
  assert.notEqual(knees.free.y, knees.weight.y, 'knees must not share one horizontal line');
  assert.ok(Math.abs(soles.free.y - soles.weight.y) >= 4, 'feet need unequal vertical anchors');
  assert.ok(Math.abs(shoulders.left.y - shoulders.right.y) >= 4, 'shoulders need a visible tilt');
  assert.ok(Math.abs(hips.free.y - hips.weight.y) >= 4, 'hips need a visible tilt');
  assert.equal(hands.hip.role, 'hip');
  assert.equal(hands.relaxed.role, 'relaxed');
  assert.ok(hips.free.x - hands.hip.x >= 22, 'hip hand must sit outside the free-side hip');
  assert.ok(hands.relaxed.y - hands.hip.y >= 18, 'one hand must sit clearly lower than the hip hand');
});
