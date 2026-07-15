import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(name, import.meta.url), 'utf8');
const readIfPresent = (name) => {
  const url = new URL(name, import.meta.url);
  return fs.existsSync(url) ? fs.readFileSync(url, 'utf8') : '';
};

test('option cards and colour swatches expose selected state without colour alone', () => {
  const source = read('./AvatarOptionControls.jsx');
  assert.match(source, /aria-pressed=/);
  assert.match(source, /Check/);
  assert.match(source, /AvatarDisplay/);
  assert.match(source, /onPointerEnter/);
  assert.match(source, /onPointerLeave/);
});

test('category navigation and toolbar expose semantic state and named actions', () => {
  const rail = read('./AvatarCategoryRail.jsx');
  const toolbar = read('./AvatarEditorToolbar.jsx');
  const dialog = read('./AvatarDiscardDialog.jsx');
  assert.match(rail, /aria-current=/);
  assert.match(toolbar, /Randomise/);
  assert.match(toolbar, /Undo/);
  assert.match(toolbar, /Save/);
  assert.match(toolbar, /disabled={!canUndo}/);
  assert.match(dialog, /role="dialog"/);
  assert.match(dialog, /Keep editing/);
  assert.match(dialog, /Discard/);
});

test('editor composes the studio instead of the legacy category strip', () => {
  const editor = read('../AvatarEditor.jsx');
  assert.match(editor, /AvatarEditorToolbar/);
  assert.match(editor, /AvatarCategoryRail/);
  assert.match(editor, /AvatarStage/);
  assert.match(editor, /AvatarOptionsPanel/);
  assert.doesNotMatch(editor, /function CategoryStrip/);
  assert.doesNotMatch(editor, /function ShapeSelector/);
});

test('pet patches cross the options panel boundary as one atomic editor commit', () => {
  const editor = read('../AvatarEditor.jsx');
  const panel = readIfPresent('./AvatarOptionsPanel.jsx');
  assert.match(panel, /onPatch/);
  assert.match(panel, /<PetCustomizer[\s\S]*onPatch={onPatch}/);
  assert.match(editor, /const patchConfig = useCallback/);
  assert.match(editor, /commitChange\(normalizeAvatarPetColors\(\{ \.\.\.config, \.\.\.patch \}\)\)/);
  assert.match(editor, /<AvatarOptionsPanel[\s\S]*onPatch={patchConfig}/);
});

test('the editor and options panel cover all thirteen studio categories explicitly', () => {
  const editor = read('../AvatarEditor.jsx');
  const panel = readIfPresent('./AvatarOptionsPanel.jsx');
  const categories = [
    'head', 'skin', 'hair', 'eyes', 'mouth', 'body', 'outfit',
    'pattern', 'background', 'hat', 'face', 'accessory', 'pet',
  ];
  for (const category of categories) {
    assert.match(editor, new RegExp(`id: '${category}'`));
    assert.match(panel, new RegExp(`category === '${category}'`));
  }
});

test('discard dialog contains keyboard focus for its open lifetime and restores it', () => {
  const dialog = read('./AvatarDiscardDialog.jsx');
  assert.match(dialog, /previousFocusRef\.current = document\.activeElement/);
  assert.match(dialog, /document\.addEventListener\('keydown', handleKeyDown\)/);
  assert.match(dialog, /document\.removeEventListener\('keydown', handleKeyDown\)/);
  assert.match(dialog, /event\.key === 'Escape'/);
  assert.match(dialog, /event\.key !== 'Tab'/);
  assert.match(dialog, /event\.shiftKey/);
  assert.match(dialog, /dialogRef\.current\?\.contains\(activeElement\)/);
  assert.match(dialog, /previousFocus\.focus\(\)/);
  assert.doesNotMatch(dialog, /<motion\.section[^>]*onKeyDown=/s);
});

test('stage owns live preview and pet placement while pet customiser exposes four sections', () => {
  const stage = read('./AvatarStage.jsx');
  const pet = read('./PetCustomizer.jsx');
  assert.match(stage, /AvatarDisplay/);
  assert.match(stage, /avatarStagePlacement/);
  assert.match(stage, /viewBox="0 0 32 32"/);
  assert.match(stage, /Tap to place your pet/);
  for (const label of ['Appearance', 'Colours', 'Position', 'Accessory']) {
    assert.match(pet, new RegExp(label));
  }
  assert.match(pet, /aria-selected=/);
  assert.doesNotMatch(pet, /tabIndex={isActive/);
});

test('pet studio consumes shared semantics and resets colour overrides atomically', () => {
  const editor = read('../AvatarEditor.jsx');
  const pet = read('./PetCustomizer.jsx');
  assert.match(editor, /from '.\/avatar-editor\/avatarPetCatalog'/);
  assert.match(pet, /from '.\/avatarPetCatalog'/);
  for (const source of [editor, pet]) {
    assert.doesNotMatch(source, /const PET_OPTIONS =/);
    assert.doesNotMatch(source, /const PET_POSITION_OPTIONS =/);
    assert.doesNotMatch(source, /const PET_ACCESSORY_OPTIONS =/);
    assert.doesNotMatch(source, /const PET_COLORS =/);
    assert.doesNotMatch(source, /const PET_LEVEL_THRESHOLDS =/);
    assert.doesNotMatch(source, /const PET_LEVEL_NAMES =/);
    assert.doesNotMatch(source, /const PET_LEVEL_COLORS =/);
    assert.doesNotMatch(source, /function getPetLevelInfo/);
    assert.doesNotMatch(source, /function getPetXpForPet/);
  }
  assert.doesNotMatch(editor, /set\('pet_color_body'/);
  assert.equal((pet.match(/onPatch\(PET_COLOR_RESET_PATCH\)/g) || []).length, 1);
  assert.doesNotMatch(pet, /pet_color_body/);
  assert.doesNotMatch(pet, /const resetPartColors = \(\) => \{[^}]*onChange\(/);
});

test('editor boundaries normalize legacy body colour and pet controls emit atomic patches', () => {
  const editor = read('../AvatarEditor.jsx');
  const pet = read('./PetCustomizer.jsx');
  assert.match(editor, /useState\(\(\) => normalizeAvatarPetColors\(\{/);
  assert.match(editor, /const userCfg = normalizeAvatarPetColors\(\{/);
  assert.match(editor, /const persisted = normalizeAvatarPetColors\(/);
  assert.equal((pet.match(/onPatch\(createPetBodyColorPatch\(color\)\)/g) || []).length, 1);
  assert.doesNotMatch(pet, /onChange\('pet_color', color\)/);
});

test('every pet tab controls a mounted labelled panel', () => {
  const pet = read('./PetCustomizer.jsx');
  for (const section of ['appearance', 'colours', 'position', 'accessory']) {
    assert.match(pet, new RegExp(`tabId: 'avatar-pet-tab-${section}'`));
    assert.match(pet, new RegExp(`panelId: 'avatar-pet-panel-${section}'`));
  }
  assert.match(pet, /id={section\.panelId}/);
  assert.match(pet, /aria-controls={section\.panelId}/);
  assert.match(pet, /aria-labelledby={section\.tabId}/);
  assert.match(pet, /const effectiveSection = hasPet \? activeSection : 'appearance'/);
  assert.match(pet, /if \(!hasPet && activeSection !== 'appearance'\)/);
  assert.match(pet, /setActiveSection\('appearance'\)/);
  assert.match(pet, /\[activeSection, hasPet\]/);
  assert.match(pet, /const isActive = effectiveSection === section\.id/);
  assert.match(pet, /hidden={effectiveSection !== section\.id}/);
  assert.doesNotMatch(pet, /hidden={activeSection !== section\.id}/);
  assert.doesNotMatch(pet, /activeSection === 'appearance' && renderAppearanceControls/);
});
