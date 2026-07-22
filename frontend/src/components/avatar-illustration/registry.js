import {
  EmptyPart,
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  MOUTH_RENDERERS,
} from './parts/faces.jsx';
import { ShortHairFront } from './parts/hair.jsx';
import { HEAD_FEATURE_OFFSETS, HEAD_RENDERERS } from './parts/heads.jsx';
import { RegularOutfit } from './parts/outfits.jsx';

export const HAIR_RENDERERS = Object.freeze({
  short: Object.freeze({ Rear: EmptyPart, Front: ShortHairFront, marginTop: 0 }),
  none: Object.freeze({ Rear: EmptyPart, Front: EmptyPart, marginTop: 0 }),
});
export const BODY_RENDERERS = Object.freeze({ regular: RegularOutfit });
export const OUTFIT_PATTERN_RENDERERS = Object.freeze({ none: EmptyPart });

export {
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  HEAD_FEATURE_OFFSETS,
  HEAD_RENDERERS,
  MOUTH_RENDERERS,
};

export function resolveAvatarPart(registry, id, fallbackId) {
  return registry[id] || registry[fallbackId];
}
