import { DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';

export const AVATAR_VISIBLE_SELECTION_FIELDS = Object.freeze([
  'head',
  'hair',
  'eyes',
  'mouth',
  'body',
  'head_color',
  'hair_color',
  'eye_color',
  'mouth_color',
  'body_color',
  'bg_color',
  'hat',
  'hat_color',
  'accessory_color',
  'face_extra',
  'outfit_pattern',
  'pet',
  'pet_color',
  'pet_color_body',
  'pet_color_ears',
  'pet_color_tail',
  'pet_color_accent',
  'pet_position',
  'pet_x',
  'pet_y',
  'pet_accessory',
]);

export function normalizeAvatarIllustrationConfig(config = {}) {
  const input = config && typeof config === 'object' ? config : {};
  const legacyAccessories = input.accessory && input.accessory !== 'none' ? [input.accessory] : [];
  const accessories = Array.isArray(input.accessories) && input.accessories.length
    ? input.accessories.filter((item) => item && item !== 'none')
    : legacyAccessories;

  return {
    ...DEFAULT_CONFIG,
    ...input,
    hair: input.hair || input.hair_style || DEFAULT_CONFIG.hair,
    accessories: [...accessories],
  };
}

export function getAvatarSelectionKey(config = {}) {
  const normalized = normalizeAvatarIllustrationConfig(config);
  const projection = AVATAR_VISIBLE_SELECTION_FIELDS.map((field) => [field, normalized[field]]);
  projection.push(['accessories', [...normalized.accessories]]);
  return JSON.stringify(projection);
}
