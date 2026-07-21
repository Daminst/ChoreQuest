import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(name, import.meta.url), 'utf8');

test('pet placement overlay shares the transformed character coordinate box', () => {
  const stage = read('./AvatarStage.jsx');

  assert.match(
    stage,
    /getAvatarStageCharacterClassName\(placementMode\)[\s\S]*<AvatarDisplay[\s\S]*avatar-stage__placement[\s\S]*<\/div>/,
  );
  assert.match(stage, /aria-describedby="avatar-stage-placement-instructions"/);
  assert.match(stage, /Strzałki przesuwają[\s\S]*Enter lub Spacja/);
});

test('pet tabs expose roving focus and standard horizontal keyboard navigation', () => {
  const pet = read('./PetCustomizer.jsx');

  assert.match(pet, /tabIndex={section\.id === effectiveSection \? 0 : -1}/);
  assert.match(pet, /onKeyDown={\(event\) => handleTabKeyDown\(event, index\)}/);
  assert.match(pet, /tabRefs\.current\[nextIndex\]\?\.focus\(\)/);
});

test('locked option preview events are routed through composed interaction sources', () => {
  const controls = read('./AvatarOptionControls.jsx');

  assert.match(controls, /useId\(\)/);
  assert.match(controls, /transitionLockedPreviewSources/);
  assert.match(controls, /transition\.sourceActivated[\s\S]*onPreview\?\.\(sourceId, configKey, option\.id\)/);
  assert.match(controls, /onPreviewEnd\?\.\(sourceId\)/);
  assert.match(controls, /useEffect\(\(\) => \(\) => \{[\s\S]*previewSourcesRef\.current\.size > 0[\s\S]*sourceId/);
  assert.match(controls, /updatePreviewSource\('hover', true\)/);
  assert.match(controls, /updatePreviewSource\('hover', false\)/);
  assert.match(controls, /updatePreviewSource\('press', true\)/);
  assert.match(controls, /updatePreviewSource\('press', false\)/);
  assert.match(controls, /updatePreviewSource\('focus', true\)/);
  assert.match(controls, /updatePreviewSource\('focus', false\)/);
});

test('editor owns the cross-card preview registry and clears it at session boundaries', () => {
  const editor = read('../AvatarEditor.jsx');

  assert.match(editor, /createAvatarPreviewRegistry/);
  assert.match(editor, /const startPreview = useCallback\(\(sourceId, key, value\)/);
  assert.match(editor, /startAvatarPreview\(previewRegistryRef\.current, sourceId, key, value\)/);
  assert.match(editor, /const endPreview = useCallback\(\(sourceId\)/);
  assert.match(editor, /endAvatarPreview\(previewRegistryRef\.current, sourceId\)/);
  assert.match(editor, /const clearPreviews = useCallback/);
  assert.match(editor, /clearAvatarPreviews\(previewRegistryRef\.current\)/);
});

test('selected swatch check uses the same contrast badge on light and dark colours', () => {
  const controls = read('./AvatarOptionControls.jsx');
  const css = read('./avatarEditor.css');
  const rule = css.match(/\.avatar-colour-swatch\[aria-pressed="true"\]\s+svg\s*\{([^}]*)\}/)?.[1] || '';

  assert.match(controls, /aria-pressed={selected === color}/);
  assert.match(controls, /style=\{\{ '--swatch': color \}\}/);
  assert.match(rule, /color:\s*white/);
  assert.match(rule, /background:\s*#0b1117/);
  assert.match(rule, /border-radius:\s*50%/);
  assert.doesNotMatch(rule, /--swatch|color-mix/);
});
