import { useId, useMemo } from 'react';

import { buildAvatarPalette } from '../avatar/avatarPaint.js';
import { AvatarDefs } from './AvatarDefs.jsx';
import { normalizeAvatarIllustrationConfig } from './avatarConfig.js';
import { getAvatarFrame } from './avatarGeometry.js';
import { Anatomy } from './parts/anatomy.jsx';
import {
  BODY_RENDERERS,
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  HAIR_RENDERERS,
  HEAD_RENDERERS,
  MOUTH_RENDERERS,
  OUTFIT_PATTERN_RENDERERS,
  resolveAvatarPart,
} from './registry.js';
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
  const Head = resolveAvatarPart(HEAD_RENDERERS, normalizedConfig.head, 'round');
  const Eyes = resolveAvatarPart(EYE_RENDERERS, normalizedConfig.eyes, 'normal');
  const Mouth = resolveAvatarPart(MOUTH_RENDERERS, normalizedConfig.mouth, 'smile');
  const FaceExtra = resolveAvatarPart(FACE_EXTRA_RENDERERS, normalizedConfig.face_extra, 'none');
  const Hair = resolveAvatarPart(HAIR_RENDERERS, normalizedConfig.hair, 'short');
  const Body = resolveAvatarPart(BODY_RENDERERS, normalizedConfig.body, 'regular');
  const OutfitPattern = resolveAvatarPart(
    OUTFIT_PATTERN_RENDERERS,
    normalizedConfig.outfit_pattern,
    'none',
  );

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
      <g data-avatar-layer="rear-hair">
        <Hair.Rear config={normalizedConfig} palette={palette} />
      </g>
      <g data-avatar-layer="legs">
        <Anatomy palette={palette} build={normalizedConfig.body} section="legs" />
        <Body config={normalizedConfig} palette={palette} section="legs" />
      </g>
      <g data-avatar-layer="torso-arms">
        <Anatomy palette={palette} build={normalizedConfig.body} section="torso-arms" />
        <Body config={normalizedConfig} palette={palette} section="torso-arms" />
        <OutfitPattern config={normalizedConfig} palette={palette} />
      </g>
      <g data-avatar-layer="neck-ears">
        <Anatomy palette={palette} build={normalizedConfig.body} />
      </g>
      <g data-avatar-layer="head">
        <Head config={normalizedConfig} palette={palette} />
      </g>
      <g data-avatar-layer="face">
        <Eyes config={normalizedConfig} palette={palette} />
        <Mouth config={normalizedConfig} palette={palette} />
        <FaceExtra config={normalizedConfig} palette={palette} />
      </g>
      <g data-avatar-layer="front-hair" transform={`translate(0 ${Hair.marginTop})`}>
        <Hair.Front config={normalizedConfig} palette={palette} />
      </g>
      <g data-avatar-layer="hat" />
      <g data-avatar-layer="front-accessories" />
      <g data-avatar-layer="pet" />
      <g data-avatar-layer="finish">
        <ellipse
          className="avatar-detail"
          cx="120"
          cy="296"
          rx="54"
          ry="5"
          fill={palette.background.deep}
          opacity="0.2"
          filter={`url(#${ids.silhouetteShadow})`}
        />
      </g>
    </svg>
  );
}

export default AvatarArtwork;
