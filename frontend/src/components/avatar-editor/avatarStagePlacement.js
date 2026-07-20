const MIN_PET_COORDINATE = 4;
const MAX_PET_COORDINATE = 28;
const PET_STAGE_SIZE = 32;

const PET_KEYBOARD_MOVES = Object.freeze({
  ArrowLeft: Object.freeze([-1, 0]),
  ArrowRight: Object.freeze([1, 0]),
  ArrowUp: Object.freeze([0, -1]),
  ArrowDown: Object.freeze([0, 1]),
});

export function clampPetCoordinate(value) {
  return Math.max(MIN_PET_COORDINATE, Math.min(MAX_PET_COORDINATE, value));
}

export function getContainedSquareRect(rect) {
  const size = Math.min(rect.width, rect.height);
  return {
    left: rect.left + ((rect.width - size) / 2),
    top: rect.top + ((rect.height - size) / 2),
    width: size,
    height: size,
  };
}

export function mapPetPointerPosition(clientX, clientY, rect) {
  const coordinateBox = getContainedSquareRect(rect);
  const x = Math.round(((clientX - coordinateBox.left) / coordinateBox.width) * PET_STAGE_SIZE);
  const y = Math.round(((clientY - coordinateBox.top) / coordinateBox.height) * PET_STAGE_SIZE);
  return { x: clampPetCoordinate(x), y: clampPetCoordinate(y) };
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
