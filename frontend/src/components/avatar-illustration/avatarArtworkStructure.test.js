import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8');

test('public display delegates to v3 and stage requests a full crop', () => {
  assert.match(source('../AvatarDisplay.jsx'), /from '.\/avatar-illustration\/AvatarArtwork'/);
  assert.match(source('../avatar-editor/AvatarStage.jsx'), /crop="full"/);
});

test('option cards choose crops by editor category', () => {
  assert.match(source('../avatar-editor/AvatarOptionControls.jsx'), /getAvatarOptionCrop\(category\)/);
  assert.match(source('../avatar-editor/AvatarOptionsPanel.jsx'), /category=/);
  assert.match(source('../avatar-editor/PetCustomizer.jsx'), /category="pet"/);
});

test('full artwork is not circularly clipped', () => {
  const display = source('../AvatarDisplay.jsx');
  assert.match(display, /crop === 'full'/);
  assert.doesNotMatch(display, /crop === 'full'[^;]+overflow-hidden/s);
});

test('stage and option previews own configuration-aware scenery', () => {
  const stage = source('../avatar-editor/AvatarStage.jsx');
  const controls = source('../avatar-editor/AvatarOptionControls.jsx');
  const css = source('../avatar-editor/avatarEditor.css');

  assert.match(stage, /'--avatar-stage-bg': config\.bg_color \|\| '#1a1a2e'/);
  assert.match(controls, /'--avatar-preview-bg': previewConfig\.bg_color \|\| '#1a1a2e'/);
  assert.match(css, /var\(--avatar-stage-bg\)/);
  assert.match(css, /var\(--avatar-preview-bg\)/);
});

test('stage and option cards reserve crop-aware artwork boxes', () => {
  const css = source('../avatar-editor/avatarEditor.css');

  assert.match(css, /height:\s*min\(72vh,\s*620px\)/);
  assert.match(css, /height:\s*clamp\(230px,\s*29dvh,\s*270px\)/);
  assert.match(css, /\.avatar-option-card__preview\.is-full[\s\S]*aspect-ratio:\s*3\s*\/\s*4/);
  assert.match(css, /\.avatar-option-card__preview\.is-portrait[\s\S]*aspect-ratio:\s*1/);
});
