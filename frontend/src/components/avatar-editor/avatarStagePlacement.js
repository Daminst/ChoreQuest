import {
  AVATAR_CANVAS,
  AVATAR_PET_PLACEMENT,
  mapAvatarPetCanvasPointToLegacy,
} from '../avatar-illustration/avatarGeometry.js';

const { min: MIN_PET_COORDINATE, max: MAX_PET_COORDINATE } = AVATAR_PET_PLACEMENT.saved;

const PET_KEYBOARD_MOVES = Object.freeze({
  ArrowLeft: Object.freeze([-1, 0]),
  ArrowRight: Object.freeze([1, 0]),
  ArrowUp: Object.freeze([0, -1]),
  ArrowDown: Object.freeze([0, 1]),
});

export function getAvatarStageCharacterClassName() {
  return 'avatar-stage__character';
}

export function getAvatarStageMotionClassName(placementMode) {
  return `avatar-stage__motion${placementMode ? '' : ' avatar-idle'}`;
}

export function clampPetCoordinate(value) {
  return Math.max(MIN_PET_COORDINATE, Math.min(MAX_PET_COORDINATE, value));
}

export function mapPetPointerPosition(clientX, clientY, rect) {
  const canvasX = ((clientX - rect.left) / rect.width) * AVATAR_CANVAS.width;
  const canvasY = ((clientY - rect.top) / rect.height) * AVATAR_CANVAS.height;
  return mapAvatarPetCanvasPointToLegacy(canvasX, canvasY);
}

export function movePetWithKeyboard(x, y, key) {
  const delta = PET_KEYBOARD_MOVES[key];
  if (!delta) return null;
  return {
    x: clampPetCoordinate(x + delta[0]),
    y: clampPetCoordinate(y + delta[1]),
  };
}

export function resolvePetPlacementKey(x, y, key) {
  if (key === 'Enter' || key === ' ') return { x, y };
  return movePetWithKeyboard(x, y, key);
}
