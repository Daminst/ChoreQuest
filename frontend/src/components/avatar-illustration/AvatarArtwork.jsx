import { useId, useMemo } from 'react';

import { buildAvatarPalette } from '../avatar/avatarPaint.js';
import { AvatarDefs } from './AvatarDefs.jsx';
import { normalizeAvatarIllustrationConfig } from './avatarConfig.js';
import { getAvatarFrame } from './avatarGeometry.js';
import './avatarIllustration.css';

const EMPTY_CONFIG = Object.freeze({});
const UNSAFE_ID_CHARACTERS = /[^a-zA-Z0-9_-]/g;

function buildAvatarIds(prefix) {
  return Object.freeze({
    skinGradient: `${prefix}-skin-gradient`,
    hairGradient: `${prefix}-hair-gradient`,
    outfitGradient: `${prefix}-outfit-gradient`,
    hatGradient: `${prefix}-hat-gradient`,
    gearGradient: `${prefix}-gear-gradient`,
    petGradient: `${prefix}-pet-gradient`,
    backgroundGradient: `${prefix}-background-gradient`,
    silhouetteShadow: `${prefix}-silhouette-shadow`,
  });
}

function buildAvatarPaints(ids) {
  return Object.freeze({
    skin: `url(#${ids.skinGradient})`,
    hair: `url(#${ids.hairGradient})`,
    outfit: `url(#${ids.outfitGradient})`,
    hat: `url(#${ids.hatGradient})`,
    gear: `url(#${ids.gearGradient})`,
    pet: `url(#${ids.petGradient})`,
    background: `url(#${ids.backgroundGradient})`,
  });
}

export function AvatarArtwork({ config = EMPTY_CONFIG, crop = 'icon', label = 'ChoreQuest avatar' }) {
  const frame = getAvatarFrame(crop);
  const normalizedConfig = useMemo(() => normalizeAvatarIllustrationConfig(config), [config]);
  const palette = useMemo(() => buildAvatarPalette(normalizedConfig), [normalizedConfig]);
  const reactId = useId();
  const prefix = `cq-avatar-${reactId.replace(UNSAFE_ID_CHARACTERS, '') || 'instance'}`;
  const ids = useMemo(() => buildAvatarIds(prefix), [prefix]);
  const paints = useMemo(() => buildAvatarPaints(ids), [ids]);
  const hasBackground = crop === 'portrait' || crop === 'icon';

  return (
    <svg
      className={`avatar-artwork avatar-artwork--${crop}`}
      viewBox={frame.viewBox}
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <AvatarDefs ids={ids} palette={palette} />
      {hasBackground ? (
        <rect
          className="avatar-artwork__background"
          x="0"
          y="0"
          width="240"
          height="320"
          fill={paints.background}
        />
      ) : null}
      <g data-avatar-layer="rear-effects" />
      <g data-avatar-layer="rear-pet" />
      <g data-avatar-layer="rear-accessories" />
      <g data-avatar-layer="rear-hair" />
      <g data-avatar-layer="legs" />
      <g data-avatar-layer="torso-arms" />
      <g data-avatar-layer="neck-ears" />
      <g data-avatar-layer="head" />
      <g data-avatar-layer="face" />
      <g data-avatar-layer="front-hair" />
      <g data-avatar-layer="hat" />
      <g data-avatar-layer="front-accessories" />
      <g data-avatar-layer="pet" />
      <g data-avatar-layer="finish" />
    </svg>
  );
}

export default AvatarArtwork;
