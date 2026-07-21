export function isCurrentAvatarSave(mounted, currentRequest, requestToken) {
  return mounted && currentRequest === requestToken;
}

export function getAvatarSaveErrorMessage(error) {
  if (error?.code === 'avatar_items_locked') {
    return 'Nie możesz zapisać zablokowanych elementów awatara. Wybierz odblokowane elementy i spróbuj ponownie.';
  }
  return error?.message || 'Nie udało się zapisać awatara. Spróbuj ponownie.';
}
