import { Crosshair, LockKeyhole } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';
import {
  getAvatarStageCharacterClassName,
  mapPetPointerPosition,
  resolvePetPlacementKey,
} from './avatarStagePlacement';

export function AvatarStage({ config, placementMode = false, previewMessage = '', onPlacePet }) {
  const petX = config.pet_x ?? 26;
  const petY = config.pet_y ?? 20;

  const place = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = mapPetPointerPosition(event.clientX, event.clientY, rect);
    onPlacePet?.(next.x, next.y);
  };

  const moveWithKeyboard = (event) => {
    const next = resolvePetPlacementKey(petX, petY, event.key);
    if (!next) return;
    event.preventDefault();
    onPlacePet?.(next.x, next.y);
  };

  return (
    <section className="avatar-stage" aria-label="Live avatar preview">
      <div className="avatar-stage__spotlight" aria-hidden="true" />
      <div className={getAvatarStageCharacterClassName(placementMode)}>
        <AvatarDisplay config={config} size="studio" />
        {placementMode && (
          <svg
            className="avatar-stage__placement"
            viewBox="0 0 32 32"
            role="button"
            aria-label="Place your pet"
            aria-describedby="avatar-stage-placement-instructions"
            tabIndex={0}
            onClick={place}
            onKeyDown={moveWithKeyboard}
          >
            <circle cx={petX} cy={petY} r="1.6" />
            <path d={`M${petX - 2} ${petY}h4M${petX} ${petY - 2}v4`} />
          </svg>
        )}
      </div>
      <div className="avatar-stage__plinth" aria-hidden="true" />
      <p
        id={placementMode ? 'avatar-stage-placement-instructions' : undefined}
        className="avatar-stage__hint"
        aria-live="polite"
      >
        {placementMode ? (
          <>
            <Crosshair size={14} aria-hidden="true" />
            Tap to place your pet
            <span className="sr-only">. Arrow keys move in two dimensions; Enter or Space confirms.</span>
          </>
        ) : previewMessage ? (
          <><LockKeyhole size={14} aria-hidden="true" />{previewMessage}</>
        ) : (
          'Preview updates instantly'
        )}
      </p>
    </section>
  );
}
