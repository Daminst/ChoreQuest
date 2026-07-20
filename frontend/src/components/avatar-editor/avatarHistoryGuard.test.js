import assert from 'node:assert/strict';
import test from 'node:test';

import {
  authorizeAvatarHistoryExit,
  cancelAvatarHistoryExit,
  confirmAvatarHistoryExit,
  createAvatarHistoryGuardSession,
  planAvatarHistoryPop,
  queueAvatarHistoryExit,
  readHistoryIndex,
} from './avatarHistoryGuard.js';

const guardDirtyPop = (session, targetIndex) => (
  planAvatarHistoryPop(session, targetIndex, { dirty: true, saving: false })
);

test('reads only finite integer React Router history indexes', () => {
  assert.equal(readHistoryIndex({ idx: 7 }), 7);
  assert.equal(readHistoryIndex({ idx: 0 }), 0);
  assert.equal(readHistoryIndex({ idx: 1.5 }), null);
  assert.equal(readHistoryIndex({ idx: '7' }), null);
  assert.equal(readHistoryIndex(null), null);
});

test('dirty Back restores the editor and confirmation continues to the attempted entry', () => {
  const initial = createAvatarHistoryGuardSession(5);
  const attempted = guardDirtyPop(initial, 4);

  assert.equal(attempted.kind, 'restore');
  assert.equal(attempted.navigationDelta, 1);
  assert.equal(attempted.openDiscard, true);
  assert.equal(attempted.session.pendingExitTargetIndex, 4);

  const restored = guardDirtyPop(attempted.session, 5);
  assert.equal(restored.kind, 'restored');
  assert.equal(restored.navigationDelta, null);
  assert.equal(restored.openDiscard, false);
  assert.equal(restored.session.pendingExitTargetIndex, 4);

  const confirmed = confirmAvatarHistoryExit(restored.session);
  assert.equal(confirmed.navigationDelta, -1);
  assert.equal(confirmed.session.allowedTargetIndex, 4);

  const allowed = guardDirtyPop(confirmed.session, 4);
  assert.equal(allowed.kind, 'allow');
  assert.equal(allowed.navigationDelta, null);
  assert.equal(allowed.session.allowedTargetIndex, null);
});

test('dirty Forward restores the editor and confirmation preserves the forward delta', () => {
  const initial = createAvatarHistoryGuardSession(5);
  const attempted = guardDirtyPop(initial, 7);

  assert.equal(attempted.kind, 'restore');
  assert.equal(attempted.navigationDelta, -2);
  assert.equal(attempted.session.pendingExitTargetIndex, 7);

  const restored = guardDirtyPop(attempted.session, 5);
  const confirmed = confirmAvatarHistoryExit(restored.session);
  assert.equal(confirmed.navigationDelta, 2);
  assert.equal(confirmed.session.allowedTargetIndex, 7);

  const allowed = guardDirtyPop(confirmed.session, 7);
  assert.equal(allowed.kind, 'allow');
  assert.equal(allowed.session.allowedTargetIndex, null);
});

test('cancelling a restored traversal keeps the editor and clears the attempted destination', () => {
  const attempted = guardDirtyPop(createAvatarHistoryGuardSession(3), 2);
  const restored = guardDirtyPop(attempted.session, 3);
  const cancelled = cancelAvatarHistoryExit(restored.session);

  assert.equal(cancelled.currentIndex, 3);
  assert.equal(cancelled.pendingExitTargetIndex, null);
  assert.equal(cancelled.allowedTargetIndex, null);

  const nextAttempt = guardDirtyPop(cancelled, 4);
  assert.equal(nextAttempt.kind, 'restore');
  assert.equal(nextAttempt.navigationDelta, -1);
  assert.equal(nextAttempt.session.pendingExitTargetIndex, 4);
});

test('a pending save restores both Back and Forward without opening discard UI', () => {
  for (const targetIndex of [4, 8]) {
    const attempted = planAvatarHistoryPop(
      createAvatarHistoryGuardSession(6),
      targetIndex,
      { dirty: true, saving: true },
    );

    assert.equal(attempted.kind, 'restore');
    assert.equal(attempted.navigationDelta, 6 - targetIndex);
    assert.equal(attempted.openDiscard, false);
    assert.equal(attempted.session.pendingExitTargetIndex, null);

    const restored = planAvatarHistoryPop(
      attempted.session,
      6,
      { dirty: true, saving: true },
    );
    assert.equal(restored.kind, 'restored');
    assert.equal(restored.navigationDelta, null);
  }
});

test('toolbar or Escape queues the default Back target before discard confirmation', () => {
  const queued = queueAvatarHistoryExit(createAvatarHistoryGuardSession(9), -1);
  assert.equal(queued.pendingExitTargetIndex, 8);

  const confirmed = confirmAvatarHistoryExit(queued);
  assert.equal(confirmed.navigationDelta, -1);
  assert.equal(confirmed.session.allowedTargetIndex, 8);
});

test('authorized save navigation is consumed once and cannot create an allow loop', () => {
  const authorized = authorizeAvatarHistoryExit(createAvatarHistoryGuardSession(4), -1);
  assert.equal(authorized.navigationDelta, -1);

  const allowed = guardDirtyPop(authorized.session, 3);
  assert.equal(allowed.kind, 'allow');
  assert.equal(allowed.session.allowedTargetIndex, null);

  const laterAttempt = guardDirtyPop(allowed.session, 2);
  assert.equal(laterAttempt.kind, 'restore');
  assert.equal(laterAttempt.navigationDelta, 2);
});

test('clean traversal is allowed without mutating the editor origin', () => {
  const result = planAvatarHistoryPop(
    createAvatarHistoryGuardSession(2),
    1,
    { dirty: false, saving: false },
  );

  assert.equal(result.kind, 'allow');
  assert.equal(result.session.editorIndex, 2);
  assert.equal(result.session.currentIndex, 1);
});
