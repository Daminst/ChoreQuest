import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPECIAL_THEME_IDS } from '../utils/themeResolver.js';

const source = readFileSync(new URL('./SeasonalThemeLayer.jsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
const EXTRA_THEME_IDS = [
  'birthday', 'halloween', 'april_fools', 'wet_monday', 'summer_vacation',
];

test('seasonal layer is decorative and non-interactive', () => {
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /pointer-events-none/);
});

test('seasonal layer routes every configured decorative theme', () => {
  for (const id of SPECIAL_THEME_IDS.filter((value) => value !== 'none')) {
    assert.match(source, new RegExp(`(?:${id}:|['"]${id}['"])`), `missing ${id}`);
  }
});

test('new themes provide dark and light palettes', () => {
  for (const id of EXTRA_THEME_IDS) {
    assert.match(styles, new RegExp(`\\.theme-${id}\\s*\\{`), `missing dark ${id}`);
    assert.match(styles, new RegExp(`\\.theme-${id}\\.light-mode\\s*\\{`), `missing light ${id}`);
  }
});

test('new decorations are disabled for reduced motion', () => {
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.seasonal-top-symbol/);
});
