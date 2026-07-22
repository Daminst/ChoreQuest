import {
  EmptyPart,
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  MOUTH_RENDERERS,
} from './parts/faces.jsx';
import { HAIR_RENDERERS } from './parts/hair.jsx';
import { HAT_RENDERERS } from './parts/hats.jsx';
import { HEAD_FEATURE_OFFSETS, HEAD_RENDERERS } from './parts/heads.jsx';
import { RegularOutfit } from './parts/outfits.jsx';

export const BODY_RENDERERS = Object.freeze({ regular: RegularOutfit });
export const OUTFIT_PATTERN_RENDERERS = Object.freeze({ none: EmptyPart });

export {
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  HAIR_RENDERERS,
  HAT_RENDERERS,
  HEAD_FEATURE_OFFSETS,
  HEAD_RENDERERS,
  MOUTH_RENDERERS,
};

export function resolveAvatarPart(registry, id, fallbackId) {
  return registry[id] || registry[fallbackId];
}
