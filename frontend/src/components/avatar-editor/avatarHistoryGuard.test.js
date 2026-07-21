import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAvatarExitNavigation,
  readHistoryIndex,
  shouldBlockAvatarNavigation,
} from './avatarHistoryGuard.js';

test('reads only finite integer React Router history indexes without throwing', () => {
  assert.equal(readHistoryIndex({ idx: 7 }), 7);
  assert.equal(readHistoryIndex({ idx: 0 }), 0);
  assert.equal(readHistoryIndex({ idx: 1.5 }), null);
  assert.equal(readHistoryIndex({ idx: '7' }), null);
  assert.equal(readHistoryIndex(null), null);
});

test('editor exit goes Back when the router has a prior history entry', () => {
  assert.deepEqual(getAvatarExitNavigation({ idx: 4 }), {
    to: -1,
    options: undefined,
  });
});

test('editor exit replaces with home at direct idx zero or missing router state', () => {
  for (const state of [{ idx: 0 }, {}, null, { idx: '1' }]) {
    assert.deepEqual(getAvatarExitNavigation(state), {
      to: '/',
      options: { replace: true },
    });
  }
});

test('dirty and saving navigations block unless an intentional exit consumes a bypass', () => {
  assert.equal(shouldBlockAvatarNavigation({ dirty: true, saving: false, bypass: false }), true);
  assert.equal(shouldBlockAvatarNavigation({ dirty: false, saving: true, bypass: false }), true);
  assert.equal(shouldBlockAvatarNavigation({ dirty: true, saving: true, bypass: true }), false);
  assert.equal(shouldBlockAvatarNavigation({ dirty: false, saving: false, bypass: false }), false);
});
