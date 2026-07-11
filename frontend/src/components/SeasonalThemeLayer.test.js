import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPECIAL_THEME_IDS } from '../utils/themeResolver.js';

const source = readFileSync(new URL('./SeasonalThemeLayer.jsx', import.meta.url), 'utf8');

test('seasonal layer is decorative and non-interactive', () => {
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /pointer-events-none/);
});

test('seasonal layer routes every configured decorative theme', () => {
  for (const id of SPECIAL_THEME_IDS.filter((value) => value !== 'none')) {
    assert.match(source, new RegExp(`(?:${id}:|['"]${id}['"])`), `missing ${id}`);
  }
});
