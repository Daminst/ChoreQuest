import assert from 'node:assert/strict';
import test from 'node:test';

import { api } from './client.js';

test('API errors preserve a stable structured detail code for callers', async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(
    JSON.stringify({ detail: { code: 'avatar_items_locked' } }),
    { status: 403, headers: { 'Content-Type': 'application/json' } },
  );

  await assert.rejects(
    api('/api/avatar', { method: 'PUT', body: { config: { hat: 'crown' } } }),
    (error) => (
      error.code === 'avatar_items_locked'
      && error.status === 403
      && error.message === 'Request failed'
    ),
  );
});
