import { Crosshair, LockKeyhole } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';
import {
  getAvatarFrame,
  mapLegacyPetPoint,
} from '../avatar-illustration/avatarGeometry';
import {
  getAvatarStageCharacterClassName,
  getAvatarStageMotionClassName,
  mapPetPointerPosition,
  resolvePetPlacementKey,
} from './avatarStagePlacement';

const PET_PLACEMENT_FRAME = getAvatarFrame('full');

export function AvatarStage({ config, placementMode = false, previewMessage = '', onPlacePet }) {
  const petX = config.pet_x ?? 26;
  const petY = config.pet_y ?? 20;
  const petMarker = mapLegacyPetPoint(petX, petY);

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
    <section
      className="avatar-stage"
      aria-label="Podgląd awatara na żywo"
      style={{ '--avatar-stage-bg': config.bg_color || '#1a1a2e' }}
    >
      <div className="avatar-stage__spotlight" aria-hidden="true" />
      <div
        className={getAvatarStageCharacterClassName(placementMode)}
        data-avatar-placement-active={placementMode ? 'true' : 'false'}
        data-avatar-motion={placementMode ? 'off' : 'on'}
      >
        <div className={getAvatarStageMotionClassName(placementMode)}>
          <AvatarDisplay
            config={config}
            size="studio"
            crop="full"
            animate={!placementMode}
          />
        </div>
        {placementMode && (
          <svg
            className="avatar-stage__placement"
            viewBox={PET_PLACEMENT_FRAME.viewBox}
            role="button"
            aria-label="Ustaw pupila"
            aria-describedby="avatar-stage-placement-instructions"
            tabIndex={0}
            onClick={place}
            onKeyDown={moveWithKeyboard}
          >
            <circle cx={petMarker.x} cy={petMarker.y} r="8" />
            <path d={`M${petMarker.x - 12} ${petMarker.y}h24M${petMarker.x} ${petMarker.y - 12}v24`} />
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
            Dotknij, aby ustawić pupila
            <span className="sr-only">. Strzałki przesuwają w dwóch wymiarach; Enter lub Spacja zatwierdza.</span>
          </>
        ) : previewMessage ? (
          <><LockKeyhole size={14} aria-hidden="true" />{previewMessage}</>
        ) : (
          'Podgląd aktualizuje się od razu'
        )}
      </p>
    </section>
  );
}
