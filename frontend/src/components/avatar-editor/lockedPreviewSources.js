export function transitionLockedPreviewSources(activeSources, source, active) {
  const wasActive = activeSources.size > 0;
  const sources = new Set(activeSources);
  if (active) sources.add(source);
  else sources.delete(source);

  const isActive = sources.size > 0;
  let action = null;
  if (!wasActive && isActive) action = 'start';
  if (wasActive && !isActive) action = 'end';
  return { sources, action };
}
