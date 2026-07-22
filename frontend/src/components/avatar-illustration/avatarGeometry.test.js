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

test('visible crown-to-sole ratio uses the same crown as visible head height', () => {
  const {
    AVATAR_HEAD_RIG,
    AVATAR_POSE_ANCHORS,
  } = avatarGeometry;
  assert.ok(AVATAR_HEAD_RIG, 'missing shared head-rig geometry contract');
  assert.ok(AVATAR_POSE_ANCHORS, 'missing shared pose-anchor contract');
  assert.ok(Object.isFrozen(AVATAR_HEAD_RIG));
  assert.ok(Object.isFrozen(AVATAR_HEAD_RIG.sourceBounds));

  const {
    anchor, scaleX, scaleY, sourceBounds,
  } = AVATAR_HEAD_RIG;
  const visibleCrown = anchor.y + ((sourceBounds.visibleCrown - anchor.y) * scaleY);
  const visibleChin = anchor.y + ((sourceBounds.visibleChin - anchor.y) * scaleY);
  const lowestSole = Math.max(
    AVATAR_POSE_ANCHORS.soles.free.y,
    AVATAR_POSE_ANCHORS.soles.weight.y,
  );
  const visibleHeadHeight = visibleChin - visibleCrown;
  const figureHeight = lowestSole - visibleCrown;
  const headRatio = figureHeight / visibleHeadHeight;

  assert.ok(headRatio >= 3.25 && headRatio <= 3.75, `head ratio ${headRatio} is out of range`);
  assert.ok(visibleCrown >= 8, 'visible crown needs useful top safety in the full frame');
  assert.ok(lowestSole <= 316, 'lowest sole needs useful bottom safety in the full frame');
});

test('body rebalance is authored in final canvas anchors without vertical scaling', () => {
  const { AVATAR_POSE_ANCHORS, getAvatarBuildTransform } = avatarGeometry;
  assert.equal(AVATAR_POSE_ANCHORS.soles.free.y, 310);
  assert.equal(AVATAR_POSE_ANCHORS.soles.weight.y, 315);
  assert.equal(AVATAR_POSE_ANCHORS.knees.free.y, 262);
  assert.equal(AVATAR_POSE_ANCHORS.knees.weight.y, 256);
  assert.equal(
    getAvatarBuildTransform('regular'),
    'translate(120 0) scale(1 1) translate(-120 0)',
    'body geometry must not rely on an anisotropic camera-like stretch',
  );
});

test('hood and upper torso stay compact against the transformed chin', () => {
  const {
    AVATAR_BODY_PROPORTIONS,
    AVATAR_HEAD_RIG,
    AVATAR_POSE_ANCHORS,
  } = avatarGeometry;
  assert.ok(AVATAR_BODY_PROPORTIONS, 'missing shared body-proportion contract');
  assert.ok(Object.isFrozen(AVATAR_BODY_PROPORTIONS));
  assert.ok(Object.isFrozen(AVATAR_BODY_PROPORTIONS.upperBody));

  const { anchor, scaleY, sourceBounds } = AVATAR_HEAD_RIG;
  const visibleChin = anchor.y + ((sourceBounds.visibleChin - anchor.y) * scaleY);
  const shoulderTop = Math.min(
    AVATAR_POSE_ANCHORS.shoulders.left.y,
    AVATAR_POSE_ANCHORS.shoulders.right.y,
  );
  const { hoodTop, hoodBottom, torsoTop } = AVATAR_BODY_PROPORTIONS.upperBody;

  assert.ok(hoodBottom - hoodTop <= 42, 'hood must read as a shallow collar, not a tall oval');
  assert.ok(hoodTop - visibleChin >= 4, 'short neck must remain visible above the collar');
  assert.ok(hoodTop - visibleChin <= 14, 'collar must stay visually attached to the neck');
  assert.ok(shoulderTop - visibleChin <= 24, 'shoulders must remain close to the chin');
  assert.ok(torsoTop - visibleChin <= 20, 'upper torso must not detach from the head');
});

test('authored leg silhouettes keep controlled thigh and knee volume', () => {
  const { AVATAR_BODY_PROPORTIONS, AVATAR_POSE_ANCHORS } = avatarGeometry;
  assert.ok(AVATAR_BODY_PROPORTIONS, 'missing shared body-proportion contract');
  assert.ok(Object.isFrozen(AVATAR_BODY_PROPORTIONS.legs));

  for (const side of ['free', 'weight']) {
    const leg = AVATAR_BODY_PROPORTIONS.legs[side];
    assert.ok(Object.isFrozen(leg));
    assert.ok(leg.thighRight - leg.thighLeft >= 35, `${side} thigh is too narrow`);
    assert.ok(leg.kneeRight - leg.kneeLeft >= 30, `${side} knee is too narrow`);
    assert.ok(
      leg.thighLeft < AVATAR_POSE_ANCHORS.hips[side].x
        && leg.thighRight > AVATAR_POSE_ANCHORS.hips[side].x,
      `${side} thigh must carry volume around its hip anchor`,
    );
  }
});

test('head rig scales uniformly and keeps the visible crown near y=12', () => {
  const { AVATAR_HEAD_RIG, getAvatarHeadRigTransform } = avatarGeometry;
  assert.ok(AVATAR_HEAD_RIG);
  assert.equal(typeof getAvatarHeadRigTransform, 'function');
  assert.ok(Object.isFrozen(AVATAR_HEAD_RIG.anchor));

  const {
    anchor, scaleX, scaleY, sourceBounds,
  } = AVATAR_HEAD_RIG;
  assert.equal(scaleX, scaleY, 'head rig must not flatten heads, strokes, or future parts');
  assert.equal(sourceBounds.visibleCrown, 12);
  assert.equal(sourceBounds.visibleChin, 136);
  const visibleCrown = anchor.y + ((sourceBounds.visibleCrown - anchor.y) * scaleY);
  const visibleChin = anchor.y + ((sourceBounds.visibleChin - anchor.y) * scaleY);
  const visibleNeckHeight = (sourceBounds.neckBottom - sourceBounds.visibleChin) * scaleY;

  assert.ok(Math.abs(visibleCrown - 12) <= 1, `visible crown moved to ${visibleCrown}`);
  assert.ok(visibleChin > 100 && visibleChin < 110, `visible chin moved to ${visibleChin}`);
  assert.ok(visibleNeckHeight <= 5, 'uniformly scaled neck must remain compact');
  assert.match(AVATAR_HEAD_RIG.transform, /scale\([^\s)]+\)/, 'head scale must have one axis value');
  assert.equal(getAvatarHeadRigTransform(), AVATAR_HEAD_RIG.transform);
});

test('crop cameras are frozen uniform transforms over the unchanged frames', () => {
  const {
    AVATAR_CAMERAS,
    AVATAR_HEAD_RIG,
    getAvatarCameraTransform,
  } = avatarGeometry;
  assert.ok(AVATAR_CAMERAS, 'missing shared crop-camera contract');
  assert.equal(typeof getAvatarCameraTransform, 'function');
  assert.ok(Object.isFrozen(AVATAR_CAMERAS));

  for (const crop of ['full', 'portrait', 'icon']) {
    const camera = AVATAR_CAMERAS[crop];
    assert.ok(Object.isFrozen(camera), `${crop} camera must be immutable`);
    assert.ok(Object.isFrozen(camera.sourceAnchor));
    assert.ok(Object.isFrozen(camera.targetAnchor));
    assert.equal(camera.scaleX, camera.scaleY, `${crop} camera must remain uniform`);
    assert.match(camera.transform, /scale\([^\s)]+\)/, `${crop} camera needs one scale value`);
    assert.equal(getAvatarCameraTransform(crop), camera.transform);
  }

  const portrait = AVATAR_CAMERAS.portrait;
  const visibleHeadHeight = (
    AVATAR_HEAD_RIG.sourceBounds.visibleChin - AVATAR_HEAD_RIG.sourceBounds.visibleCrown
  ) * AVATAR_HEAD_RIG.scaleY;
  const portraitFrameHeight = Number(getAvatarFrame('portrait').viewBox.split(' ')[3]);
  const portraitOccupancy = (visibleHeadHeight * portrait.scaleY) / portraitFrameHeight;
  assert.ok(portraitOccupancy >= 0.84, `portrait head occupancy ${portraitOccupancy} is too small`);
  assert.equal(getAvatarFrame('portrait').viewBox, '48 4 144 144');
  assert.equal(getAvatarFrame('icon').viewBox, '42 18 156 156');
});

test('hair margin stays an exact outer canvas translation', () => {
  const {
    AVATAR_HEAD_RIG,
    getAvatarHeadMarginTransform,
    getAvatarHeadRigTransform,
  } = avatarGeometry;
  assert.equal(typeof getAvatarHeadMarginTransform, 'function');
  assert.equal(getAvatarHeadMarginTransform(-20), 'translate(0 -20)');
  assert.equal(
    getAvatarHeadRigTransform(-20),
    AVATAR_HEAD_RIG.transform,
    'head rig must ignore margin metadata instead of scaling it internally',
  );
});

test('head feature transforms stay anchored to the shared face center', () => {
  const { getAvatarHeadFeatureTransform } = avatarGeometry;
  assert.equal(typeof getAvatarHeadFeatureTransform, 'function');
  assert.equal(
    getAvatarHeadFeatureTransform({ x: 2, y: 3, scaleX: 0.9, scaleY: 1.1 }),
    'translate(120 88) translate(2 3) scale(0.9 1.1) translate(-120 -88)',
  );
  assert.equal(
    getAvatarHeadFeatureTransform(),
    'translate(120 88) translate(0 0) scale(1 1) translate(-120 -88)',
  );
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
