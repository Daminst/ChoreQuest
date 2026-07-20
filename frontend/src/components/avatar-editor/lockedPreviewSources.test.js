import assert from 'node:assert/strict';
import test from 'node:test';

const loadSources = () => import('./lockedPreviewSources.js');

test('locked preview stays active until hover, press, and focus sources all end', async () => {
  const { transitionLockedPreviewSources } = await loadSources();
  const initial = new Set();

  const hovered = transitionLockedPreviewSources(initial, 'hover', true);
  assert.equal(hovered.action, 'start');
  assert.deepEqual([...hovered.sources], ['hover']);
  assert.deepEqual([...initial], []);

  const focused = transitionLockedPreviewSources(hovered.sources, 'focus', true);
  assert.equal(focused.action, null);
  assert.deepEqual([...focused.sources], ['hover', 'focus']);

  const pressed = transitionLockedPreviewSources(focused.sources, 'press', true);
  assert.equal(pressed.action, null);
  assert.deepEqual([...pressed.sources], ['hover', 'focus', 'press']);

  const left = transitionLockedPreviewSources(pressed.sources, 'hover', false);
  assert.equal(left.action, null);
  assert.deepEqual([...left.sources], ['focus', 'press']);

  const released = transitionLockedPreviewSources(left.sources, 'press', false);
  assert.equal(released.action, null);
  assert.deepEqual([...released.sources], ['focus']);

  const blurred = transitionLockedPreviewSources(released.sources, 'focus', false);
  assert.equal(blurred.action, 'end');
  assert.deepEqual([...blurred.sources], []);
});

test('redundant source events do not restart or end a locked preview', async () => {
  const { transitionLockedPreviewSources } = await loadSources();

  const inactiveLeave = transitionLockedPreviewSources(new Set(), 'hover', false);
  assert.equal(inactiveLeave.action, null);

  const focused = transitionLockedPreviewSources(new Set(), 'focus', true);
  const repeatedFocus = transitionLockedPreviewSources(focused.sources, 'focus', true);
  assert.equal(repeatedFocus.action, null);
  assert.deepEqual([...repeatedFocus.sources], ['focus']);
});
