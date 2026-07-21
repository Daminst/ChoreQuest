const PET_TAB_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'Home', 'End']);

export function getNextPetTabIndex(currentIndex, key, enabledTabs) {
  if (!PET_TAB_KEYS.has(key)) return null;

  const enabledIndexes = [];
  for (let index = 0; index < enabledTabs.length; index += 1) {
    if (enabledTabs[index]) enabledIndexes.push(index);
  }
  if (enabledIndexes.length === 0) return null;
  if (key === 'Home') return enabledIndexes[0];
  if (key === 'End') return enabledIndexes[enabledIndexes.length - 1];

  const enabledPosition = enabledIndexes.indexOf(currentIndex);
  if (enabledPosition === -1) return enabledIndexes[0];
  const direction = key === 'ArrowRight' ? 1 : -1;
  const nextPosition = (enabledPosition + direction + enabledIndexes.length) % enabledIndexes.length;
  return enabledIndexes[nextPosition];
}
