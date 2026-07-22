export const AVATAR_CANVAS = Object.freeze({ width: 240, height: 320 });

function freezePoint(x, y, role) {
  return Object.freeze(role ? { x, y, role } : { x, y });
}

const HEAD_RIG_ANCHOR = freezePoint(120, 12);
const HEAD_RIG_SCALE = 0.75;
const HEAD_FEATURE_ANCHOR = freezePoint(120, 88);

export const AVATAR_HEAD_RIG = Object.freeze({
  anchor: HEAD_RIG_ANCHOR,
  scaleX: HEAD_RIG_SCALE,
  scaleY: HEAD_RIG_SCALE,
  sourceBounds: Object.freeze({
    visibleCrown: 12,
    visibleChin: 136,
    neckBottom: 142,
  }),
  transform: `translate(${HEAD_RIG_ANCHOR.x} ${HEAD_RIG_ANCHOR.y}) scale(${HEAD_RIG_SCALE}) translate(${-HEAD_RIG_ANCHOR.x} ${-HEAD_RIG_ANCHOR.y})`,
});

export const AVATAR_HEADWEAR_ANCHORS = Object.freeze({
  skullTop: freezePoint(120, 30),
  band: Object.freeze({
    left: freezePoint(76, 52),
    right: freezePoint(164, 52),
  }),
  temples: Object.freeze({
    left: freezePoint(78, 78),
    right: freezePoint(162, 78),
  }),
});

export const AVATAR_POSE_ANCHORS = Object.freeze({
  shoulders: Object.freeze({
    left: freezePoint(94, 132),
    right: freezePoint(150, 127),
  }),
  hips: Object.freeze({
    free: freezePoint(104, 216),
    weight: freezePoint(139, 220),
  }),
  knees: Object.freeze({
    free: freezePoint(94, 262),
    weight: freezePoint(140, 256),
  }),
  soles: Object.freeze({
    free: freezePoint(78, 310),
    weight: freezePoint(150, 315),
  }),
  hands: Object.freeze({
    hip: freezePoint(80, 203, 'hip'),
    relaxed: freezePoint(169, 224, 'relaxed'),
  }),
});

export const AVATAR_BODY_PROPORTIONS = Object.freeze({
  upperBody: Object.freeze({
    hoodTop: 116,
    hoodBottom: 158,
    torsoTop: 124,
  }),
  legs: Object.freeze({
    free: Object.freeze({
      thighLeft: 84,
      thighRight: 121,
      kneeLeft: 79,
      kneeRight: 111,
    }),
    weight: Object.freeze({
      thighLeft: 120,
      thighRight: 161,
      kneeLeft: 126,
      kneeRight: 156,
    }),
  }),
});

const AVATAR_BUILD_SCALE_X = Object.freeze({ slim: 0.9, regular: 1, broad: 1.12 });

export const AVATAR_FRAMES = Object.freeze({
  full: Object.freeze({ viewBox: '0 0 240 320', circular: false }),
  portrait: Object.freeze({ viewBox: '48 4 144 144', circular: true }),
  icon: Object.freeze({ viewBox: '42 18 156 156', circular: true }),
});

function freezeCamera(scale, targetY) {
  const sourceAnchor = freezePoint(120, 12);
  const targetAnchor = freezePoint(120, targetY);
  return Object.freeze({
    sourceAnchor,
    targetAnchor,
    scaleX: scale,
    scaleY: scale,
    transform: `translate(${targetAnchor.x} ${targetAnchor.y}) scale(${scale}) translate(${-sourceAnchor.x} ${-sourceAnchor.y})`,
  });
}

export const AVATAR_CAMERAS = Object.freeze({
  full: freezeCamera(1, 12),
  portrait: freezeCamera(1.32, 7),
  icon: freezeCamera(1.18, 20),
});

const PORTRAIT_CATEGORIES = new Set(['head', 'skin', 'hair', 'eyes', 'mouth', 'hat', 'face']);
const FULL_CATEGORIES = new Set(['body', 'outfit', 'pattern', 'background', 'accessory', 'pet']);

export function getAvatarFrame(crop = 'icon') {
  return AVATAR_FRAMES[crop] || AVATAR_FRAMES.icon;
}

export function getAvatarCameraTransform(crop = 'icon') {
  return (AVATAR_CAMERAS[crop] || AVATAR_CAMERAS.icon).transform;
}

export function getAvatarHeadRigTransform() {
  return AVATAR_HEAD_RIG.transform;
}

export function getAvatarHeadMarginTransform(offsetY = 0) {
  const offset = Number(offsetY);
  const overshootCorrection = Number.isFinite(offset) && offset < 0 ? -offset : 0;
  return `translate(0 ${overshootCorrection})`;
}

export function getAvatarHeadFeatureTransform(offset = {}) {
  const xValue = Number(offset.x);
  const yValue = Number(offset.y);
  const scaleXValue = Number(offset.scaleX);
  const scaleYValue = Number(offset.scaleY);
  const x = Number.isFinite(xValue) ? xValue : 0;
  const y = Number.isFinite(yValue) ? yValue : 0;
  const scaleX = Number.isFinite(scaleXValue) && scaleXValue > 0 ? scaleXValue : 1;
  const scaleY = Number.isFinite(scaleYValue) && scaleYValue > 0 ? scaleYValue : 1;
  return `translate(${HEAD_FEATURE_ANCHOR.x} ${HEAD_FEATURE_ANCHOR.y}) translate(${x} ${y}) scale(${scaleX} ${scaleY}) translate(${-HEAD_FEATURE_ANCHOR.x} ${-HEAD_FEATURE_ANCHOR.y})`;
}

export function getAvatarBuildTransform(build = 'regular') {
  const scaleX = AVATAR_BUILD_SCALE_X[build] || AVATAR_BUILD_SCALE_X.regular;
  return `translate(120 0) scale(${scaleX} 1) translate(-120 0)`;
}

export function getAvatarRenderDimensions(size, crop = 'icon') {
  const height = Number.isFinite(Number(size)) ? Number(size) : 64;
  return crop === 'full'
    ? { width: Math.round(height * AVATAR_CANVAS.width / AVATAR_CANVAS.height), height }
    : { width: height, height };
}

export function getAvatarOptionCrop(category) {
  if (PORTRAIT_CATEGORIES.has(category)) return 'portrait';
  if (FULL_CATEGORIES.has(category)) return 'full';
  return 'icon';
}

export function mapLegacyPetPoint(x, y) {
  const clamp = (value) => Math.min(28, Math.max(4, Number(value) || 4));
  return {
    x: Math.round(36 + ((clamp(x) - 4) / 24) * 168),
    y: Math.round(64 + ((clamp(y) - 4) / 24) * 216),
  };
}
