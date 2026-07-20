const isHistoryIndex = (value) => Number.isInteger(value) && Number.isFinite(value);

export function readHistoryIndex(state) {
  return isHistoryIndex(state?.idx) ? state.idx : null;
}

export function createAvatarHistoryGuardSession(editorIndex) {
  if (!isHistoryIndex(editorIndex)) {
    throw new TypeError('Avatar history guard requires a finite integer history index');
  }

  return {
    editorIndex,
    currentIndex: editorIndex,
    pendingExitTargetIndex: null,
    allowedTargetIndex: null,
    restoring: false,
  };
}

function popResult(session, kind, navigationDelta = null, openDiscard = false) {
  return { session, kind, navigationDelta, openDiscard };
}

export function planAvatarHistoryPop(session, targetIndex, { dirty, saving }) {
  if (!isHistoryIndex(targetIndex)) {
    return popResult(session, 'allow');
  }

  if (session.allowedTargetIndex === targetIndex) {
    return popResult({
      ...session,
      currentIndex: targetIndex,
      allowedTargetIndex: null,
      restoring: false,
    }, 'allow');
  }

  if (session.restoring && targetIndex === session.editorIndex) {
    return popResult({
      ...session,
      currentIndex: targetIndex,
      restoring: false,
    }, 'restored');
  }

  if (!dirty && !saving) {
    return popResult({ ...session, currentIndex: targetIndex }, 'allow');
  }

  if (targetIndex === session.editorIndex) {
    return popResult({
      ...session,
      currentIndex: targetIndex,
      restoring: false,
    }, 'restored');
  }

  return popResult({
    ...session,
    currentIndex: targetIndex,
    pendingExitTargetIndex: saving ? null : targetIndex,
    allowedTargetIndex: null,
    restoring: true,
  }, 'restore', session.editorIndex - targetIndex, dirty && !saving);
}

export function queueAvatarHistoryExit(session, navigationDelta = -1) {
  return {
    ...session,
    pendingExitTargetIndex: session.editorIndex + navigationDelta,
  };
}

export function cancelAvatarHistoryExit(session) {
  return {
    ...session,
    pendingExitTargetIndex: null,
    allowedTargetIndex: null,
  };
}

function authorizeTarget(session, targetIndex) {
  return {
    session: {
      ...session,
      pendingExitTargetIndex: null,
      allowedTargetIndex: targetIndex,
      restoring: false,
    },
    navigationDelta: targetIndex - session.currentIndex,
  };
}

export function confirmAvatarHistoryExit(session, fallbackDelta = -1) {
  const targetIndex = session.pendingExitTargetIndex
    ?? session.editorIndex + fallbackDelta;
  return authorizeTarget(session, targetIndex);
}

export function authorizeAvatarHistoryExit(session, navigationDelta = -1) {
  return authorizeTarget(session, session.editorIndex + navigationDelta);
}
