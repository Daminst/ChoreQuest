function getNewestPreview(sources) {
  let newest = null;
  for (const entry of sources.values()) {
    if (!newest || entry.order > newest.order) newest = entry;
  }
  return newest ? { key: newest.key, value: newest.value } : null;
}

export function createAvatarPreviewRegistry() {
  return { sources: new Map(), nextOrder: 0 };
}

export function startAvatarPreview(registry, sourceId, key, value) {
  const sources = new Map(registry.sources);
  const nextOrder = registry.nextOrder + 1;
  sources.set(sourceId, { key, value, order: nextOrder });
  return {
    registry: { sources, nextOrder },
    preview: { key, value },
  };
}

export function endAvatarPreview(registry, sourceId) {
  const sources = new Map(registry.sources);
  sources.delete(sourceId);
  return {
    registry: { sources, nextOrder: registry.nextOrder },
    preview: getNewestPreview(sources),
  };
}

export function clearAvatarPreviews() {
  return {
    registry: createAvatarPreviewRegistry(),
    preview: null,
  };
}
