export const AVATAR_CANVAS = Object.freeze({ width: 240, height: 320 });

export const AVATAR_FRAMES = Object.freeze({
  full: Object.freeze({ viewBox: '0 0 240 320', circular: false }),
  portrait: Object.freeze({ viewBox: '48 4 144 144', circular: true }),
  icon: Object.freeze({ viewBox: '42 18 156 156', circular: true }),
});

const PORTRAIT_CATEGORIES = new Set(['head', 'skin', 'hair', 'eyes', 'mouth', 'hat', 'face']);
const FULL_CATEGORIES = new Set(['body', 'outfit', 'pattern', 'background', 'accessory', 'pet']);

export function getAvatarFrame(crop = 'icon') {
  return AVATAR_FRAMES[crop] || AVATAR_FRAMES.icon;
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
