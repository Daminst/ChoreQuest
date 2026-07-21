import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createAvatarExternalConflictState,
  getPersistentAvatarStatus,
  observeIncomingAvatarConfig,
  reconcileIncomingAvatarConfig,
  settleAvatarSaveConflict,
  synchronizeAvatarConflictWhenClean,
} from './avatarConfigReconciliation.js';

test('semantically equivalent refresh preserves a dirty draft and its undo history', () => {
  const savedConfig = { head: 'round', accessories: ['cape'] };
  const config = { head: 'oval', accessories: ['cape'] };
  const history = [{ head: 'round', accessories: ['cape'] }];

  const result = reconcileIncomingAvatarConfig({
    incomingConfig: { accessories: ['cape'], head: 'round' },
    config,
    savedConfig,
    history,
  });

  assert.equal(result.action, 'ignore');
  assert.equal(result.config, config);
  assert.equal(result.savedConfig, savedConfig);
  assert.equal(result.history, history);
  assert.equal(result.status, null);
});

test('a clean editor adopts a genuinely changed server config', () => {
  const config = { head: 'round' };
  const history = [];
  const incomingConfig = { head: 'oval' };

  const result = reconcileIncomingAvatarConfig({
    incomingConfig,
    config,
    savedConfig: config,
    history,
  });

  assert.equal(result.action, 'synchronize');
  assert.equal(result.config, incomingConfig);
  assert.equal(result.savedConfig, incomingConfig);
  assert.deepEqual(result.history, []);
  assert.match(result.status, /serwera/i);
});

test('a changed server config reports a Polish conflict without replacing a dirty draft', () => {
  const savedConfig = { head: 'round' };
  const config = { head: 'oval' };
  const history = [{ head: 'round' }];

  const result = reconcileIncomingAvatarConfig({
    incomingConfig: { head: 'square' },
    config,
    savedConfig,
    history,
  });

  assert.equal(result.action, 'conflict');
  assert.equal(result.config, config);
  assert.equal(result.savedConfig, savedConfig);
  assert.equal(result.history, history);
  assert.match(result.status, /lokalne zmiany/i);
});

test('dirty conflict status survives subsequent edit and undo status resets', () => {
  const observation = observeIncomingAvatarConfig({
    state: createAvatarExternalConflictState(),
    incomingConfig: { head: 'square' },
    saving: false,
    config: { head: 'oval' },
    savedConfig: { head: 'round' },
    history: [{ head: 'round' }],
  });

  assert.equal(observation.reconciliation.action, 'conflict');
  assert.match(getPersistentAvatarStatus('', observation.state), /lokalne zmiany/i);
  assert.match(
    getPersistentAvatarStatus('Nie udało się cofnąć zmiany.', observation.state),
    /lokalne zmiany/i,
  );
});

test('incoming config observed during a save is reconciled after a failed save', () => {
  const queued = observeIncomingAvatarConfig({
    state: createAvatarExternalConflictState(),
    incomingConfig: { head: 'square' },
    saving: true,
    config: { head: 'oval' },
    savedConfig: { head: 'round' },
    history: [{ head: 'round' }],
  });

  assert.equal(queued.reconciliation, null);
  assert.deepEqual(queued.state.queuedIncomingConfig, { head: 'square' });

  const failed = settleAvatarSaveConflict({
    state: queued.state,
    succeeded: false,
    config: { head: 'oval' },
    savedConfig: { head: 'round' },
    history: [{ head: 'round' }],
  });

  assert.equal(failed.reconciliation.action, 'conflict');
  assert.deepEqual(failed.state.conflictConfig, { head: 'square' });
  assert.equal(failed.state.queuedIncomingConfig, null);
  assert.match(getPersistentAvatarStatus('Nie udało się zapisać.', failed.state), /lokalne zmiany/i);
});

test('successful save clears both an existing conflict and queued incoming config', () => {
  const state = {
    conflictConfig: { head: 'square' },
    queuedIncomingConfig: { head: 'diamond' },
  };

  const succeeded = settleAvatarSaveConflict({
    state,
    succeeded: true,
    config: { head: 'oval' },
    savedConfig: { head: 'round' },
    history: [{ head: 'round' }],
  });

  assert.equal(succeeded.reconciliation, null);
  assert.deepEqual(succeeded.state, createAvatarExternalConflictState());
  assert.equal(getPersistentAvatarStatus('Zapisano!', succeeded.state), 'Zapisano!');
});

test('undoing back to a clean draft synchronizes and resolves the stored conflict', () => {
  const result = synchronizeAvatarConflictWhenClean({
    state: {
      conflictConfig: { head: 'square' },
      queuedIncomingConfig: null,
    },
    saving: false,
    config: { head: 'round' },
    savedConfig: { head: 'round' },
    history: [],
  });

  assert.equal(result.reconciliation.action, 'synchronize');
  assert.deepEqual(result.reconciliation.config, { head: 'square' });
  assert.deepEqual(result.state, createAvatarExternalConflictState());
});

test('latest baseline refresh clears an older conflict without touching the dirty draft', () => {
  const config = { head: 'oval' };
  const savedConfig = { head: 'round' };
  const history = [{ head: 'round' }];
  const result = observeIncomingAvatarConfig({
    state: {
      conflictConfig: { head: 'square' },
      queuedIncomingConfig: { head: 'diamond' },
    },
    incomingConfig: { head: 'round' },
    saving: false,
    config,
    savedConfig,
    history,
  });

  assert.equal(result.reconciliation.action, 'ignore');
  assert.equal(result.reconciliation.config, config);
  assert.equal(result.reconciliation.savedConfig, savedConfig);
  assert.equal(result.reconciliation.history, history);
  assert.deepEqual(result.state, createAvatarExternalConflictState());
  assert.equal(getPersistentAvatarStatus('', result.state), '');
  assert.equal(synchronizeAvatarConflictWhenClean({
    state: result.state,
    saving: false,
    config: savedConfig,
    savedConfig,
    history: [],
  }).reconciliation, null);
});

test('latest refresh matching the dirty draft adopts it as the clean baseline', () => {
  const config = { head: 'oval' };
  const result = observeIncomingAvatarConfig({
    state: {
      conflictConfig: { head: 'square' },
      queuedIncomingConfig: null,
    },
    incomingConfig: { head: 'oval' },
    saving: false,
    config,
    savedConfig: { head: 'round' },
    history: [{ head: 'round' }],
  });

  assert.equal(result.reconciliation.action, 'synchronize');
  assert.equal(result.reconciliation.config, config);
  assert.deepEqual(result.reconciliation.savedConfig, { head: 'oval' });
  assert.deepEqual(result.reconciliation.history, []);
  assert.deepEqual(result.state, createAvatarExternalConflictState());
});

test('failed save processes queued baseline and current-draft equivalents as resolutions', () => {
  const savedConfig = { head: 'round' };
  const config = { head: 'oval' };
  const history = [{ head: 'round' }];
  const staleConflict = {
    conflictConfig: { head: 'square' },
    queuedIncomingConfig: null,
  };

  const queuedBaseline = observeIncomingAvatarConfig({
    state: staleConflict,
    incomingConfig: { head: 'round' },
    saving: true,
    config,
    savedConfig,
    history,
  });
  assert.deepEqual(queuedBaseline.state.queuedIncomingConfig, { head: 'round' });
  const baselineFailure = settleAvatarSaveConflict({
    state: queuedBaseline.state,
    succeeded: false,
    config,
    savedConfig,
    history,
  });
  assert.equal(baselineFailure.reconciliation.action, 'ignore');
  assert.deepEqual(baselineFailure.state, createAvatarExternalConflictState());

  const queuedDraft = observeIncomingAvatarConfig({
    state: staleConflict,
    incomingConfig: { head: 'oval' },
    saving: true,
    config,
    savedConfig,
    history,
  });
  const draftFailure = settleAvatarSaveConflict({
    state: queuedDraft.state,
    succeeded: false,
    config,
    savedConfig,
    history,
  });
  assert.equal(draftFailure.reconciliation.action, 'synchronize');
  assert.deepEqual(draftFailure.reconciliation.savedConfig, { head: 'oval' });
  assert.deepEqual(draftFailure.reconciliation.history, []);
  assert.deepEqual(draftFailure.state, createAvatarExternalConflictState());
});
