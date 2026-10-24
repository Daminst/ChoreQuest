export const AVATAR_LAYER_ORDER = Object.freeze([
  'rear-effects', 'rear-pet', 'rear-accessories', 'rear-hair', 'legs', 'torso-arms',
  'neck-ears', 'head', 'face', 'front-hair', 'hat', 'front-accessories', 'pet', 'finish',
]);

export function getAvatarLayerOrder() {
  return [...AVATAR_LAYER_ORDER];
}
