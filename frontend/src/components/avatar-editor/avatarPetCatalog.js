function freezeOptions(options) {
  return Object.freeze(options.map((option) => Object.freeze(option)));
}

export const PET_OPTIONS = freezeOptions([
  { id: 'none', label: 'None' },
  { id: 'cat', label: 'Cat' },
  { id: 'dog', label: 'Dog' },
  { id: 'dragon', label: 'Dragon' },
  { id: 'owl', label: 'Owl' },
  { id: 'bunny', label: 'Bunny' },
  { id: 'phoenix', label: 'Phoenix' },
]);

export const PET_POSITION_OPTIONS = freezeOptions([
  { id: 'right', label: 'Right' },
  { id: 'left', label: 'Left' },
  { id: 'head', label: 'Head' },
  { id: 'custom', label: 'Custom' },
]);

export const PET_ACCESSORY_OPTIONS = freezeOptions([
  { id: 'none', label: 'None' },
  { id: 'crown', label: 'Crown' },
  { id: 'party_hat', label: 'Party Hat' },
  { id: 'bow', label: 'Bow' },
  { id: 'bandana', label: 'Bandana' },
  { id: 'halo', label: 'Halo' },
  { id: 'flower', label: 'Flower' },
]);

export const PET_COLORS = Object.freeze([
  '#8b4513', '#4a3728', '#f39c12', '#ef4444',
  '#10b981', '#a855f7', '#ecf0f1', '#1a1a2e',
  '#c0c0c0', '#ff6b9d', '#06b6d4', '#f59e0b',
]);

export const PET_LEVEL_THRESHOLDS = Object.freeze([0, 50, 150, 350, 700, 1200, 2000, 3500]);
export const PET_LEVEL_NAMES = Object.freeze(['', 'Hatchling', 'Youngling', 'Companion', 'Loyal', 'Brave', 'Mighty', 'Majestic', 'Legendary']);
export const PET_LEVEL_COLORS = Object.freeze(['', '#94a3b8', '#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#f97316', '#ef4444', '#d946ef']);

export const PET_COLOR_RESET_PATCH = Object.freeze({
  pet_color_ears: '',
  pet_color_tail: '',
  pet_color_accent: '',
});

export function getPetLevelInfo(petXp) {
  let level = 1;
  for (let index = 0; index < PET_LEVEL_THRESHOLDS.length; index += 1) {
    if (petXp >= PET_LEVEL_THRESHOLDS[index]) level = index + 1;
  }
  const threshold = PET_LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = PET_LEVEL_THRESHOLDS[level] || null;
  const progress = nextThreshold ? (petXp - threshold) / (nextThreshold - threshold) : 1;
  return {
    level,
    name: PET_LEVEL_NAMES[level],
    nextName: PET_LEVEL_NAMES[level + 1] || null,
    xp: petXp,
    threshold,
    nextThreshold,
    progress,
  };
}

export function getPetXpForPet(config, petType) {
  if (!petType || petType === 'none') return 0;
  const xpMap = config.pet_xp_map || {};
  return petType in xpMap ? xpMap[petType] : (config.pet_xp || 0);
}
