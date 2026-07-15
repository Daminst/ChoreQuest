import { Crosshair, LockKeyhole } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';

const MIN_PET_COORDINATE = 4;
const MAX_PET_COORDINATE = 28;

function clampPetCoordinate(value) {
  return Math.max(MIN_PET_COORDINATE, Math.min(MAX_PET_COORDINATE, value));
}

export function AvatarStage({ config, placementMode = false, previewMessage = '', onPlacePet }) {
  const petX = config.pet_x ?? 26;
  const petY = config.pet_y ?? 20;

  const place = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 32);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 32);
    onPlacePet?.(clampPetCoordinate(x), clampPetCoordinate(y));
  };

  const moveWithKeyboard = (event) => {
    const moves = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const delta = moves[event.key];
    if (!delta) return;
    event.preventDefault();
    onPlacePet?.(
      clampPetCoordinate(petX + delta[0]),
      clampPetCoordinate(petY + delta[1]),
    );
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
