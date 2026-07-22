import { ACCESSORY_RENDERERS } from './parts/accessories.jsx';
import {
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  MOUTH_RENDERERS,
} from './parts/faces.jsx';
import { HAIR_RENDERERS } from './parts/hair.jsx';
import { HAT_RENDERERS } from './parts/hats.jsx';
import { HEAD_FEATURE_OFFSETS, HEAD_RENDERERS } from './parts/heads.jsx';
import { BODY_RENDERERS, OUTFIT_PATTERN_RENDERERS } from './parts/outfits.jsx';
import { PET_ACCESSORY_RENDERERS, PET_RENDERERS, PetArtwork } from './parts/pets.jsx';

export {
  ACCESSORY_RENDERERS,
  BODY_RENDERERS,
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  HAIR_RENDERERS,
  HAT_RENDERERS,
  HEAD_FEATURE_OFFSETS,
  HEAD_RENDERERS,
  MOUTH_RENDERERS,
  OUTFIT_PATTERN_RENDERERS,
  PET_ACCESSORY_RENDERERS,
  PET_RENDERERS,
  PetArtwork,
};

export function resolveAvatarPart(registry, id, fallbackId) {
  return registry[id] || registry[fallbackId];
}
