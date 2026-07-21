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

test('locked avatar rejection is localized without exposing server item names', async () => {
  const { getAvatarSaveErrorMessage } = await import(lifecycleUrl);
  const error = Object.assign(
    new Error('Locked avatar items cannot be equipped: Crown, Dragon'),
    { code: 'avatar_items_locked', status: 403 },
  );

  const message = getAvatarSaveErrorMessage(error);

  assert.equal(message, 'Nie możesz zapisać zablokowanych elementów awatara. Wybierz odblokowane elementy i spróbuj ponownie.');
  assert.doesNotMatch(message, /Crown|Dragon|Locked/);
});
