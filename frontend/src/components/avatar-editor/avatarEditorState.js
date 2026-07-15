export const AVATAR_HISTORY_LIMIT = 30;

export function cloneAvatarConfig(config = {}) {
  const next = { ...config };
  if (Object.hasOwn(config, 'accessories')) {
    next.accessories = Array.isArray(config.accessories) ? [...config.accessories] : [];
  }
  if (Object.hasOwn(config, 'pet_xp_map')) {
    next.pet_xp_map = config.pet_xp_map ? { ...config.pet_xp_map } : config.pet_xp_map;
  }
  return next;
}

function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]));
}

export function configsEqual(left, right) {
  return JSON.stringify(ordered(left)) === JSON.stringify(ordered(right));
}

export function applyAvatarChange(config, key, value) {
  const next = cloneAvatarConfig(config);
  next[key] = value;
  if (key === 'pet') {
    const xpMap = next.pet_xp_map || {};
    next.pet_xp = value && value !== 'none' && value in xpMap ? xpMap[value] : 0;
  }
  return next;
}

export function pushAvatarHistory(history, config, limit = AVATAR_HISTORY_LIMIT) {
  return [...history.slice(-(limit - 1)), cloneAvatarConfig(config)];
}

export function undoAvatarChange(history, currentConfig) {
  if (history.length === 0) return { history, config: currentConfig };
  return {
    history: history.slice(0, -1),
    config: cloneAvatarConfig(history[history.length - 1]),
  };
}

export function buildDisplayConfig(config, preview) {
  if (!preview) return config;
  if (preview.key === 'accessory') {
    const next = cloneAvatarConfig(config);
    next.accessories = [...new Set([...(next.accessories || []), preview.value])];
    next.accessory = preview.value;
    return next;
  }
  return applyAvatarChange(config, preview.key, preview.value);
}

export function toggleAvatarAccessory(config, itemId) {
  const selected = new Set(config.accessories?.length
    ? config.accessories
    : config.accessory && config.accessory !== 'none' ? [config.accessory] : []);
  selected.has(itemId) ? selected.delete(itemId) : selected.add(itemId);
  const accessories = [...selected];
  return { ...cloneAvatarConfig(config), accessories, accessory: accessories[0] || 'none' };
}

export function randomiseAvatarConfig(config, recipe, lockedByCategory = {}, random = Math.random) {
  const next = cloneAvatarConfig(config);
  for (const group of recipe.optionGroups) {
    const locked = lockedByCategory[group.itemCategory] || new Set();
    const available = group.options.filter((option) => !locked.has(option.id));
    if (available.length) next[group.key] = available[Math.floor(random() * available.length)].id;
  }
  for (const group of recipe.colourGroups) {
    if (group.values.length) next[group.key] = group.values[Math.floor(random() * group.values.length)];
  }
  if (recipe.accessoryGroup) {
    const group = recipe.accessoryGroup;
    const locked = lockedByCategory[group.itemCategory] || new Set();
    const available = group.options.filter((option) => !locked.has(option.id));
    if (available.length && random() < group.chance) {
      const item = available[Math.floor(random() * available.length)].id;
      next.accessories = [item];
      next.accessory = item;
    } else {
      next.accessories = [];
      next.accessory = 'none';
    }
  }
  return next;
}
