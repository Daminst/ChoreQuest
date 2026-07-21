import { configsEqual } from './avatarEditorState.js';

export const AVATAR_EXTERNAL_CONFLICT_STATUS = 'Awatar zmienił się na serwerze. Zapisz lub odrzuć lokalne zmiany.';
export const AVATAR_EXTERNAL_SYNC_STATUS = 'Wczytano zmiany awatara z serwera.';

export function reconcileIncomingAvatarConfig({ incomingConfig, config, savedConfig, history }) {
  if (configsEqual(incomingConfig, savedConfig)) {
    return { action: 'ignore', config, savedConfig, history, status: null };
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
