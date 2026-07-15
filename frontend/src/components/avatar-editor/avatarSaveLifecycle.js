export function isCurrentAvatarSave(mounted, currentRequest, requestToken) {
  return mounted && currentRequest === requestToken;
}
