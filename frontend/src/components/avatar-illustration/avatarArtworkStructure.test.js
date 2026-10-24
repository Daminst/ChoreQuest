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

test('illustration exposes restrained transform-only motion and a reduced-motion fallback', () => {
  const css = source('./avatarIllustration.css');
  const expectedKeyframes = [
    'avatar-figure-breathe',
    'avatar-eyelid-blink',
    'avatar-hair-secondary',
    'avatar-selection-flash',
    'avatar-pet-float',
  ];

  for (const name of expectedKeyframes) {
    assert.match(css, new RegExp(`@keyframes ${name}`), `missing ${name}`);
  }
  assert.doesNotMatch(
    css,
    /@keyframes[\s\S]*?\b(?:top|right|bottom|left|width|height|margin|padding):/,
    'avatar keyframes may animate only transform and opacity',
  );
  assert.match(css, /translateY\(-1\.5px\) scaleY\(1\.006\)/);
  assert.match(css, /rotate\(0\.7deg\)/);
  assert.match(css, /translateY\(-2px\) rotate\(1deg\)/);
  assert.match(css, /avatar-eyelid-blink 7s/);
  assert.match(css, /47%,\s*49%[\s\S]*?48%/);
  assert.match(css, /\[data-avatar-motion='off'\][\s\S]*animation:\s*none\s*!important[\s\S]*transform:\s*none\s*!important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none\s*!important[\s\S]*transform:\s*none\s*!important/);
});

test('compositor exposes stable motion hooks and compact-detail metadata on one artwork tree', () => {
  const artwork = source('./AvatarArtwork.jsx');
  const defs = source('./AvatarDefs.jsx');

  for (const hook of [
    'avatar-figure-breath',
    'avatar-eyelids',
    'avatar-hair-secondary',
    'avatar-selection-flash',
    'avatar-pet-motion',
  ]) {
    const family = hook === 'avatar-eyelids' ? source('./parts/faces.jsx') : `${artwork}\n${source('./parts/pets.jsx')}`;
    assert.match(family, new RegExp(hook), `missing ${hook}`);
  }
  assert.match(artwork, /data-avatar-motion=\{motionEnabled \? 'on' : 'off'\}/);
  assert.match(artwork, /data-avatar-detail=\{isCompact \? 'compact' : 'full'\}/);
  assert.match(artwork, /<AvatarDefs[\s\S]*?compact=\{isCompact\}/);
  assert.match(defs, /compact\s*=\s*false/);
  assert.match(defs, /\{!compact\s*\?\s*\([\s\S]*?<filter/);
});

test('compact mode removes only optional finish work while retaining identity layers', () => {
  const css = source('./avatarIllustration.css');
  const artwork = source('./AvatarArtwork.jsx');

  assert.match(css, /\[data-avatar-detail='compact'\][\s\S]*?\.avatar-compact-optional[\s\S]*?display:\s*none/);
  assert.match(css, /\.avatar-artwork--portrait[\s\S]*?avatar-shoe-lace[\s\S]*?display:\s*none/);
  assert.match(artwork, /avatar-fabric-microdetail avatar-compact-optional/);
  for (const identityLayer of ['face', 'front-hair', 'hat', 'front-accessories', 'pet']) {
    assert.match(artwork, new RegExp(`data-avatar-layer="${identityLayer}"`));
  }
  assert.doesNotMatch(css, /\[data-avatar-detail='compact'\][^{]*avatar-(?:hair|hat|face|accessory-base|pet-base)/);
});

test('studio enables internal v3 motion once and placement disables it without moving the anchor box', () => {
  const stage = source('../avatar-editor/AvatarStage.jsx');
  const placement = source('../avatar-editor/avatarStagePlacement.js');
  const display = source('../AvatarDisplay.jsx');

  assert.match(stage, /<AvatarDisplay[\s\S]*?animate=\{!placementMode\}/);
  assert.match(placement, /return 'avatar-stage__motion';/);
  assert.doesNotMatch(placement, /avatar-idle/);
  assert.match(display, /motionEnabled=\{animate\}/);
  assert.equal((stage.match(/avatar-idle/g) || []).length, 0);
});

test('runtime source no longer imports legacy drawing modules, including Pet Care', () => {
  const display = source('../AvatarDisplay.jsx');
  const petCustomizer = source('../avatar-editor/PetCustomizer.jsx');
  const kidDashboard = source('../../pages/KidDashboard.jsx');

  assert.doesNotMatch(display, /from '.\/avatar'/);
  assert.doesNotMatch(petCustomizer, /avatar\/pets/);
  assert.doesNotMatch(kidDashboard, /from '..\/components\/avatar'/);
  assert.doesNotMatch(kidDashboard, /renderPet(?:Extras|Accessory)?\(/);
  assert.match(kidDashboard, /PetArtwork/);
  assert.match(kidDashboard, /avatar-editor\/avatarPetCatalog/);
});

test('standalone pet previews make motion intent explicit', () => {
  const css = source('./avatarIllustration.css');
  const petCustomizer = source('../avatar-editor/PetCustomizer.jsx');

  assert.match(css, /\[data-pet-motion='on'\]\s*>\s*\.avatar-pet-motion/);
  assert.match(css, /\[data-pet-motion='off'\]\s*>\s*\.avatar-pet-motion[\s\S]*?animation:\s*none\s*!important/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\[data-pet-motion\]\s*>\s*\.avatar-pet-motion[\s\S]*?animation:\s*none\s*!important/);
  assert.match(petCustomizer, /<PetArtwork[\s\S]*?compact[\s\S]*?motionEnabled=\{false\}/);
});
