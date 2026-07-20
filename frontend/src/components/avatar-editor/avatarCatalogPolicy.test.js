import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AVATAR_CATALOG_STATE,
  buildAvatarEntitlementMaps,
  canCommitAvatarCatalogChange,
  canRandomiseAvatar,
  getAvatarCatalogNotice,
} from './avatarCatalogPolicy.js';

test('catalog policy blocks randomise until authoritative entitlement data is ready', () => {
  assert.equal(canRandomiseAvatar(AVATAR_CATALOG_STATE.loading), false);
  assert.equal(canRandomiseAvatar(AVATAR_CATALOG_STATE.error), false);
  assert.equal(canRandomiseAvatar(AVATAR_CATALOG_STATE.ready), true);
});

test('loading blocks catalog-sensitive choices but still permits colour and placement edits', () => {
  for (const key of ['head', 'hair', 'eyes', 'mouth', 'hat', 'face_extra', 'outfit_pattern', 'pet', 'accessory', 'accessories']) {
    assert.equal(canCommitAvatarCatalogChange(AVATAR_CATALOG_STATE.loading, key), false, key);
  }
  for (const key of ['head_color', 'hair_color', 'bg_color', 'body_color', 'pet_color', 'pet_position', 'pet_accessory']) {
    assert.equal(canCommitAvatarCatalogChange(AVATAR_CATALOG_STATE.loading, key), true, key);
  }
});

test('manual choices fail open after a catalog error while randomise remains disabled', () => {
  assert.equal(canCommitAvatarCatalogChange(AVATAR_CATALOG_STATE.error, 'hat'), true);
  assert.equal(canCommitAvatarCatalogChange(AVATAR_CATALOG_STATE.error, 'pet'), true);
  assert.equal(canRandomiseAvatar(AVATAR_CATALOG_STATE.error), false);
  assert.match(getAvatarCatalogNotice(AVATAR_CATALOG_STATE.error), /Randomise is disabled/);
});

test('ready catalog data builds authoritative lock and metadata maps', () => {
  const { lockedByCategory, itemMetaByCategory } = buildAvatarEntitlementMaps([
    { category: 'hat', item_id: 'none', unlocked: true, is_default: true },
    { category: 'hat', item_id: 'crown', unlocked: false, is_default: false },
  ]);

  assert.deepEqual([...lockedByCategory.hat], ['crown']);
  assert.equal(itemMetaByCategory.hat.get('crown').item_id, 'crown');
  assert.equal(getAvatarCatalogNotice(AVATAR_CATALOG_STATE.ready), '');
  assert.throws(() => buildAvatarEntitlementMaps({}), /array/);
});
