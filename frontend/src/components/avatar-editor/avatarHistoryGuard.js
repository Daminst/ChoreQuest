export function readHistoryIndex(state) {
  return Number.isInteger(state?.idx) && Number.isFinite(state.idx)
    ? state.idx
    : null;
}

export function getAvatarExitNavigation(historyState) {
  const historyIndex = readHistoryIndex(historyState);
  if (historyIndex !== null && historyIndex > 0) {
    return { to: -1, options: undefined };
  }
  return { to: '/', options: { replace: true } };
}

export function shouldBlockAvatarNavigation({ dirty, saving, bypass }) {
  return !bypass && (dirty || saving);
}
