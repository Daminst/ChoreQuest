import { configsEqual } from './avatarEditorState.js';

export const AVATAR_EXTERNAL_CONFLICT_STATUS = 'Awatar zmienił się na serwerze. Zapisz lub odrzuć lokalne zmiany.';
export const AVATAR_EXTERNAL_SYNC_STATUS = 'Wczytano zmiany awatara z serwera.';

export function createAvatarExternalConflictState() {
  return { conflictConfig: null, queuedIncomingConfig: null };
}

export function reconcileIncomingAvatarConfig({ incomingConfig, config, savedConfig, history }) {
  if (configsEqual(incomingConfig, savedConfig)) {
    return { action: 'ignore', config, savedConfig, history, status: null };
  }

  if (configsEqual(incomingConfig, config)) {
    return {
      action: 'synchronize',
      config,
      savedConfig: incomingConfig,
      history: [],
      status: AVATAR_EXTERNAL_SYNC_STATUS,
    };
  }

  if (!configsEqual(config, savedConfig)) {
    return {
      action: 'conflict',
      config,
      savedConfig,
      history,
      status: AVATAR_EXTERNAL_CONFLICT_STATUS,
    };
  }

  return {
    action: 'synchronize',
    config: incomingConfig,
    savedConfig: incomingConfig,
    history: [],
    status: AVATAR_EXTERNAL_SYNC_STATUS,
  };
}

export function observeIncomingAvatarConfig({
  state,
  incomingConfig,
  saving,
  config,
  savedConfig,
  history,
}) {
  if (saving) {
    if (
      configsEqual(incomingConfig, savedConfig)
      && !state.conflictConfig
      && !state.queuedIncomingConfig
    ) {
      return { state, reconciliation: null };
    }
    return {
      state: { ...state, queuedIncomingConfig: incomingConfig },
      reconciliation: null,
    };
  }

  const reconciliation = reconcileIncomingAvatarConfig({
    incomingConfig,
    config,
    savedConfig,
    history,
  });
  if (reconciliation.action === 'conflict') {
    return {
      state: { conflictConfig: incomingConfig, queuedIncomingConfig: null },
      reconciliation,
    };
  }
  if (reconciliation.action === 'synchronize' || reconciliation.action === 'ignore') {
    return { state: createAvatarExternalConflictState(), reconciliation };
  }
  return { state, reconciliation };
}

export function settleAvatarSaveConflict({
  state,
  succeeded,
  config,
  savedConfig,
  history,
}) {
  if (succeeded) {
    return { state: createAvatarExternalConflictState(), reconciliation: null };
  }
  if (!state.queuedIncomingConfig) {
    return { state, reconciliation: null };
  }
  return observeIncomingAvatarConfig({
    state,
    incomingConfig: state.queuedIncomingConfig,
    saving: false,
    config,
    savedConfig,
    history,
  });
}

export function synchronizeAvatarConflictWhenClean({
  state,
  saving,
  config,
  savedConfig,
  history,
}) {
  if (saving || !state.conflictConfig || !configsEqual(config, savedConfig)) {
    return { state, reconciliation: null };
  }
  return observeIncomingAvatarConfig({
    state,
    incomingConfig: state.conflictConfig,
    saving: false,
    config,
    savedConfig,
    history,
  });
}

export function getPersistentAvatarStatus(status, state) {
  return state.conflictConfig ? AVATAR_EXTERNAL_CONFLICT_STATUS : status;
}
