import assert from 'node:assert/strict';
import test from 'node:test';

import { reconcileIncomingAvatarConfig } from './avatarConfigReconciliation.js';

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
