import { DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';

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
