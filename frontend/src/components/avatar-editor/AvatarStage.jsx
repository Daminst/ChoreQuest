import { Crosshair, LockKeyhole } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';
import { mapPetPointerPosition, movePetWithKeyboard } from './avatarStagePlacement';

export function AvatarStage({ config, placementMode = false, previewMessage = '', onPlacePet }) {
  const petX = config.pet_x ?? 26;
  const petY = config.pet_y ?? 20;

  const place = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const next = mapPetPointerPosition(event.clientX, event.clientY, rect);
    onPlacePet?.(next.x, next.y);
  };

  const moveWithKeyboard = (event) => {
    const next = movePetWithKeyboard(petX, petY, event.key);
    if (!next) return;
    event.preventDefault();
    onPlacePet?.(next.x, next.y);
  };

  return (
    <section className="avatar-stage" aria-label="Live avatar preview">
      <div className="avatar-stage__spotlight" aria-hidden="true" />
      <div className="avatar-stage__character avatar-idle">
        <AvatarDisplay config={config} size="studio" />
      </div>
      <div className="avatar-stage__plinth" aria-hidden="true" />
      {placementMode && (
        <svg
          className="avatar-stage__placement"
          viewBox="0 0 32 32"
          role="button"
          aria-label="Tap to place your pet"
          tabIndex={0}
          onClick={place}
          onKeyDown={moveWithKeyboard}
        >
          <circle cx={petX} cy={petY} r="1.6" />
          <path d={`M${petX - 2} ${petY}h4M${petX} ${petY - 2}v4`} />
        </svg>
      )}
      <p className="avatar-stage__hint" aria-live="polite">
        {placementMode ? (
          <><Crosshair size={14} aria-hidden="true" />Tap to place your pet</>
        ) : previewMessage ? (
          <><LockKeyhole size={14} aria-hidden="true" />{previewMessage}</>
        ) : (
          'Preview updates instantly'
        )}
      </p>
    </section>
  );
}
