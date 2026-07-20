import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(name, import.meta.url), 'utf8');

test('pet placement overlay shares the transformed character coordinate box', () => {
  const stage = read('./AvatarStage.jsx');

  assert.match(
    stage,
    /avatar-stage__character avatar-idle[\s\S]*<AvatarDisplay[\s\S]*avatar-stage__placement[\s\S]*<\/div>/,
  );
  assert.match(stage, /aria-describedby="avatar-stage-placement-instructions"/);
  assert.match(stage, /Arrow keys[\s\S]*Enter or Space/);
});

test('pet tabs expose roving focus and standard horizontal keyboard navigation', () => {
  const pet = read('./PetCustomizer.jsx');

  assert.match(pet, /tabIndex={section\.id === effectiveSection \? 0 : -1}/);
  assert.match(pet, /onKeyDown={\(event\) => handleTabKeyDown\(event, index\)}/);
  assert.match(pet, /tabRefs\.current\[nextIndex\]\?\.focus\(\)/);
});

test('locked option previews have pointer and focus parity', () => {
  const controls = read('./AvatarOptionControls.jsx');

  assert.match(controls, /onFocus={\(\) => locked && onPreview\?\.\(configKey, option\.id\)}/);
  assert.match(controls, /onBlur={\(\) => locked && onPreviewEnd\?\.\(\)}/);
});
