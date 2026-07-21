import assert from 'node:assert/strict';
import test from 'node:test';

const loadNavigation = () => import('./petTabNavigation.js');

test('horizontal tab navigation wraps and skips disabled tabs', async () => {
  const { getNextPetTabIndex } = await loadNavigation();
  const enabled = [true, false, true, true];

  assert.equal(getNextPetTabIndex(0, 'ArrowRight', enabled), 2);
  assert.equal(getNextPetTabIndex(2, 'ArrowRight', enabled), 3);
  assert.equal(getNextPetTabIndex(3, 'ArrowRight', enabled), 0);
  assert.equal(getNextPetTabIndex(0, 'ArrowLeft', enabled), 3);
});

test('Home and End move to the first and last enabled pet tabs', async () => {
  const { getNextPetTabIndex } = await loadNavigation();
  const enabled = [false, true, false, true];

  assert.equal(getNextPetTabIndex(3, 'Home', enabled), 1);
  assert.equal(getNextPetTabIndex(1, 'End', enabled), 3);
});

test('tab navigation ignores unrelated keys and stays put with one enabled tab', async () => {
  const { getNextPetTabIndex } = await loadNavigation();

  assert.equal(getNextPetTabIndex(0, 'ArrowRight', [true, false, false, false]), 0);
  assert.equal(getNextPetTabIndex(0, 'Enter', [true, true]), null);
});
