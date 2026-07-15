import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(name, import.meta.url), 'utf8');
const readIfPresent = (name) => {
  const url = new URL(name, import.meta.url);
  return fs.existsSync(url) ? fs.readFileSync(url, 'utf8') : '';
};
const extractCssBlock = (source, blockHeader) => {
  const headerStart = source.indexOf(blockHeader);
  if (headerStart === -1) return '';
  const openingBrace = source.indexOf('{', headerStart + blockHeader.length);
  if (openingBrace === -1) return '';

  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] !== '}') continue;
    depth -= 1;
    if (depth === 0) return source.slice(openingBrace + 1, index);
  }
  return '';
};
const extractReducedMotionBlock = (source) => (
  extractCssBlock(source, '@media (prefers-reduced-motion: reduce)')
);

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
  assert.match(toolbar, /disabled={saving \|\| !canUndo}/);
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

test('reduced motion forces the discard dialog to its final visual state', () => {
  const css = read('./avatarEditor.css');
  const dialogOverride = /\.avatar-discard-backdrop,\s*\.avatar-discard-dialog\s*\{[^}]*opacity:\s*1\s*!important;[^}]*transform:\s*none\s*!important;[^}]*\}/;
  const reducedMotion = extractReducedMotionBlock(css);
  assert.match(
    reducedMotion,
    dialogOverride,
  );

  const misplacedOverride = `
    @media (prefers-reduced-motion: reduce) {
      .avatar-editor-shell * { transition-duration: 0.01ms !important; }
    }
    .avatar-discard-backdrop,
    .avatar-discard-dialog {
      opacity: 1 !important;
      transform: none !important;
    }
    .avatar-later-rule { color: red; }
  `;
  assert.doesNotMatch(extractReducedMotionBlock(misplacedOverride), dialogOverride);
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

test('studio stage keeps the hero prominent and the clean save action legible', () => {
  const display = read('../AvatarDisplay.jsx');
  const css = read('./avatarEditor.css');
  const spotlight = extractCssBlock(css, '.avatar-stage__spotlight');
  const plinth = extractCssBlock(css, '.avatar-stage__plinth');
  const disabledSave = extractCssBlock(css, '.avatar-editor-toolbar .avatar-save-button:disabled');
  const mobile = extractCssBlock(css, '@media (max-width: 720px)');

  assert.match(display, /studio:\s*420/);
  assert.match(spotlight, /var\(--color-accent\) 32%/);
  assert.match(plinth, /width:\s*min\(54%,\s*420px\)/);
  assert.match(disabledSave, /color:\s*#061715/);
  assert.match(disabledSave, /opacity:\s*0\.68/);
  assert.match(mobile, /\.avatar-stage__character\s*\{[^}]*position:\s*absolute/s);
  assert.match(mobile, /\.avatar-stage__character\s*\{[^}]*top:\s*50%[^}]*left:\s*50%/s);
  assert.match(mobile, /\.avatar-stage__character\s*\{[^}]*transform:\s*translate\(-50%,\s*-50%\)\s*scale\(0\.56\)/s);
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

test('saving disables every toolbar action and makes the editor workspace inert', () => {
  const editor = read('../AvatarEditor.jsx');
  const toolbar = read('./AvatarEditorToolbar.jsx');
  assert.match(toolbar, /aria-label="Back" disabled={saving}/);
  assert.match(toolbar, /className="avatar-tool-button" disabled={saving} onClick={onRandomise}/);
  assert.match(toolbar, /disabled={saving \|\| !canUndo}/);
  assert.match(toolbar, /disabled={saving \|\| !dirty}/);
  assert.match(editor, /className="avatar-editor-workspace" aria-busy={saving} inert={saving \? '' : undefined}/);
});

test('save transactions are serialized and stale async completions are ignored', () => {
  const editor = read('../AvatarEditor.jsx');
  for (const ref of ['mountedRef', 'savePendingRef', 'saveRequestRef']) {
    assert.match(editor, new RegExp(`const ${ref} = useRef\\(`));
  }
  assert.match(editor, /if \(savePendingRef\.current \|\| !dirty\) return;/);
  assert.match(editor, /savePendingRef\.current = true;/);
  assert.match(editor, /const requestToken = \+\+saveRequestRef\.current;/);
  assert.equal((editor.match(/isCurrentAvatarSave\(mountedRef\.current, saveRequestRef\.current, requestToken\)/g) || []).length, 3);
  assert.match(editor, /mountedRef\.current = false;/);
  assert.match(editor, /saveRequestRef\.current \+= 1;/);
  assert.match(editor, /window\.clearTimeout\(saveNavigationTimerRef\.current\)/);
  assert.doesNotMatch(editor, /finally\s*{/);
  assert.match(editor, /catch \(error\) \{[\s\S]*savePendingRef\.current = false;[\s\S]*setSaving\(false\);/);
  assert.match(editor, /window\.setTimeout\(\(\) => \{[\s\S]*isCurrentAvatarSave[\s\S]*allowNextPopRef\.current = true;[\s\S]*navigate\(-1\)/);
});

test('pending saves guard mutations, exits, previews, unload, and browser traversal', () => {
  const editor = read('../AvatarEditor.jsx');
  for (const callback of [
    'commitChange', 'undo', 'randomise', 'leaveEditor', 'requestExit',
    'cancelDiscard', 'selectCategory', 'startPreview', 'endPreview',
  ]) {
    assert.match(editor, new RegExp(`const ${callback} = useCallback\\([^]*?=> \\{\\s*if \\(savePendingRef\\.current\\) return;`));
  }
  assert.match(editor, /setDiscardOpen\(false\);/);
  assert.match(editor, /if \(event\.key !== 'Escape' \|\| savePendingRef\.current\) return;/);
  assert.match(editor, /if \(!dirty && !savePendingRef\.current\) return;/);
  assert.match(editor, /if \(savePendingRef\.current\) \{[\s\S]*navigate\(1\);[\s\S]*return;[\s\S]*\}/);
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
