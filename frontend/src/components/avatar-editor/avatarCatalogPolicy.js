export const AVATAR_CATALOG_STATE = Object.freeze({
  loading: 'loading',
  ready: 'ready',
  error: 'error',
});

const CATALOG_SENSITIVE_KEYS = new Set([
  'head',
  'hair',
  'eyes',
  'mouth',
  'hat',
  'face_extra',
  'outfit_pattern',
  'pet',
  'accessory',
  'accessories',
]);

export function canRandomiseAvatar(catalogState) {
  return catalogState === AVATAR_CATALOG_STATE.ready;
}

export function canCommitAvatarCatalogChange(catalogState, configKey) {
  return catalogState !== AVATAR_CATALOG_STATE.loading || !CATALOG_SENSITIVE_KEYS.has(configKey);
}

export function getAvatarCatalogNotice(catalogState) {
  if (catalogState === AVATAR_CATALOG_STATE.loading) return 'Checking avatar unlocks...';
  if (catalogState === AVATAR_CATALOG_STATE.error) {
    return 'Unlock status unavailable. Randomise is disabled.';
  }
  return '';
}

export function buildAvatarEntitlementMaps(items) {
  if (!Array.isArray(items)) throw new TypeError('Avatar entitlement response must be an array');

  const lockedByCategory = {};
  const itemMetaByCategory = {};
  for (const item of items) {
    if (!itemMetaByCategory[item.category]) itemMetaByCategory[item.category] = new Map();
    itemMetaByCategory[item.category].set(item.item_id, item);
    if (!item.unlocked && !item.is_default) {
      if (!lockedByCategory[item.category]) lockedByCategory[item.category] = new Set();
      lockedByCategory[item.category].add(item.item_id);
    }
  }
  return { lockedByCategory, itemMetaByCategory };
}
