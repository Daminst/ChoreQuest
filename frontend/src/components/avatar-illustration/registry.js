import { EmptyPart, NormalEyes, SmileMouth } from './parts/faces.jsx';
import { ShortHairFront } from './parts/hair.jsx';
import { RoundHead } from './parts/heads.jsx';
import { RegularOutfit } from './parts/outfits.jsx';

export const HEAD_RENDERERS = Object.freeze({ round: RoundHead });
export const EYE_RENDERERS = Object.freeze({ normal: NormalEyes });
export const MOUTH_RENDERERS = Object.freeze({ smile: SmileMouth });
export const FACE_EXTRA_RENDERERS = Object.freeze({ none: EmptyPart });
export const HAIR_RENDERERS = Object.freeze({
  short: Object.freeze({ Rear: EmptyPart, Front: ShortHairFront, marginTop: 0 }),
  none: Object.freeze({ Rear: EmptyPart, Front: EmptyPart, marginTop: 0 }),
});
export const BODY_RENDERERS = Object.freeze({ regular: RegularOutfit });
export const OUTFIT_PATTERN_RENDERERS = Object.freeze({ none: EmptyPart });

export function resolveAvatarPart(registry, id, fallbackId) {
  return registry[id] || registry[fallbackId];
}
