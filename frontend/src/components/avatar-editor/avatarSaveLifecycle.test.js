import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const lifecycleUrl = new URL('./avatarSaveLifecycle.js', import.meta.url);

test('a save completion is current only while mounted and its request token still matches', async () => {
  assert.equal(fs.existsSync(lifecycleUrl), true, 'expected the save lifecycle helper to exist');
  const { isCurrentAvatarSave } = await import(lifecycleUrl);

  assert.equal(isCurrentAvatarSave(true, 4, 4), true);
  assert.equal(isCurrentAvatarSave(false, 4, 4), false);
  assert.equal(isCurrentAvatarSave(true, 5, 4), false);
});
