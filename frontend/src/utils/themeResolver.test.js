import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SPECIAL_THEMES,
  SPECIAL_THEME_IDS,
  canManageSpecialTheme,
  resolveEffectiveTheme,
} from './themeResolver.js';

const EXPECTED_SPECIAL_THEME_IDS = [
  'none', 'easter', 'christmas', 'birthday', 'halloween',
  'april_fools', 'wet_monday', 'summer_vacation',
];


test('catalog exposes every family special theme in stable order', () => {
  assert.deepEqual(SPECIAL_THEME_IDS, EXPECTED_SPECIAL_THEME_IDS);
  assert.deepEqual(SPECIAL_THEMES.map(({ id }) => id), EXPECTED_SPECIAL_THEME_IDS);
});


test('every decorative theme overrides a personal theme', () => {
  for (const themeId of EXPECTED_SPECIAL_THEME_IDS.slice(1)) {
    assert.equal(resolveEffectiveTheme('forest', themeId), themeId);
  }
});


test('special theme overrides a personal theme', () => {
  assert.equal(resolveEffectiveTheme('forest', 'christmas'), 'christmas');
  assert.equal(resolveEffectiveTheme('rose', 'easter'), 'easter');
});

test('none restores the personal theme', () => {
  assert.equal(resolveEffectiveTheme('galaxy', 'none'), 'galaxy');
});

test('invalid values fall back safely', () => {
  assert.equal(resolveEffectiveTheme('unknown', 'none'), 'default');
  assert.equal(resolveEffectiveTheme('forest', 'unknown'), 'forest');
});

test('only parents and admins manage special themes', () => {
  assert.equal(canManageSpecialTheme('kid'), false);
  assert.equal(canManageSpecialTheme('parent'), true);
  assert.equal(canManageSpecialTheme('admin'), true);
});
