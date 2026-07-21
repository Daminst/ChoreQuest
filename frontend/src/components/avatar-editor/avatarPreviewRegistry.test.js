import assert from 'node:assert/strict';
import test from 'node:test';

const loadRegistry = () => import('./avatarPreviewRegistry.js');

test('ending card A cannot clear a newer active preview owned by card B', async () => {
  const { createAvatarPreviewRegistry, startAvatarPreview, endAvatarPreview } = await loadRegistry();
  let registry = createAvatarPreviewRegistry();

  let transition = startAvatarPreview(registry, 'card-a', 'head', 'heart');
  registry = transition.registry;
  assert.deepEqual(transition.preview, { key: 'head', value: 'heart' });

  transition = startAvatarPreview(registry, 'card-b', 'head', 'diamond');
  registry = transition.registry;
  assert.deepEqual(transition.preview, { key: 'head', value: 'diamond' });

  transition = endAvatarPreview(registry, 'card-a');
  assert.deepEqual(transition.preview, { key: 'head', value: 'diamond' });
  assert.deepEqual([...transition.registry.sources.keys()], ['card-b']);
});

test('ending or unmounting the newest card falls back to the newest remaining owner', async () => {
  const { createAvatarPreviewRegistry, startAvatarPreview, endAvatarPreview } = await loadRegistry();
  let registry = createAvatarPreviewRegistry();
  registry = startAvatarPreview(registry, 'card-a', 'hair', 'wavy').registry;
  registry = startAvatarPreview(registry, 'card-b', 'hair', 'bob').registry;

  const unmountedB = endAvatarPreview(registry, 'card-b');
  assert.deepEqual(unmountedB.preview, { key: 'hair', value: 'wavy' });

  const unmountedA = endAvatarPreview(unmountedB.registry, 'card-a');
  assert.equal(unmountedA.preview, null);
  assert.equal(unmountedA.registry.sources.size, 0);
});

test('reactivating an existing owner promotes it and clearing drops every owner', async () => {
  const {
    clearAvatarPreviews,
    createAvatarPreviewRegistry,
    startAvatarPreview,
    endAvatarPreview,
  } = await loadRegistry();
  let registry = createAvatarPreviewRegistry();
  registry = startAvatarPreview(registry, 'card-a', 'eyes', 'happy').registry;
  registry = startAvatarPreview(registry, 'card-b', 'eyes', 'wide').registry;

  const promotedA = startAvatarPreview(registry, 'card-a', 'eyes', 'wink');
  assert.deepEqual(promotedA.preview, { key: 'eyes', value: 'wink' });
  const withoutA = endAvatarPreview(promotedA.registry, 'card-a');
  assert.deepEqual(withoutA.preview, { key: 'eyes', value: 'wide' });

  const cleared = clearAvatarPreviews(withoutA.registry);
  assert.equal(cleared.preview, null);
  assert.equal(cleared.registry.sources.size, 0);
});
