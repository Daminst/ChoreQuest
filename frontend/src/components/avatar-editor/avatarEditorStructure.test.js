import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(name, import.meta.url), 'utf8');

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
