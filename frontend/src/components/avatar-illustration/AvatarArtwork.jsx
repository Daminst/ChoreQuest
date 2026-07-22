import { useId, useMemo } from 'react';

import { buildAvatarPalette } from '../avatar/avatarPaint.js';
import { AvatarDefs } from './AvatarDefs.jsx';
import { normalizeAvatarIllustrationConfig } from './avatarConfig.js';
import {
  AVATAR_POSE_ANCHORS,
  getAvatarCameraTransform,
  getAvatarFrame,
  getAvatarHeadFeatureTransform,
  getAvatarHeadMarginTransform,
  getAvatarHeadRigTransform,
} from './avatarGeometry.js';
import { Anatomy } from './parts/anatomy.jsx';
import {
  BODY_RENDERERS,
  EYE_RENDERERS,
  FACE_EXTRA_RENDERERS,
  FaceModeling,
  HAIR_RENDERERS,
  HAT_RENDERERS,
  HEAD_FEATURE_OFFSETS,
  HEAD_RENDERERS,
  MOUTH_RENDERERS,
  OUTFIT_PATTERN_RENDERERS,
  resolveAvatarPart,
} from './registry.js';
import './avatarIllustration.css';

const EMPTY_CONFIG = Object.freeze({});
const UNSAFE_ID_CHARACTERS = /[^a-zA-Z0-9_-]/g;
const CONTACT_SHADOW_Y = Math.max(
  AVATAR_POSE_ANCHORS.soles.free.y,
  AVATAR_POSE_ANCHORS.soles.weight.y,
) - 1;

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
  const Hat = resolveAvatarPart(HAT_RENDERERS, normalizedConfig.hat, 'none');
  const Body = resolveAvatarPart(BODY_RENDERERS, normalizedConfig.body, 'regular');
  const OutfitPattern = resolveAvatarPart(
    OUTFIT_PATTERN_RENDERERS,
    normalizedConfig.outfit_pattern,
    'none',
  );
  const cameraTransform = getAvatarCameraTransform(crop);
  const headRigTransform = getAvatarHeadRigTransform();
  const headFeatureOffset = HEAD_FEATURE_OFFSETS[normalizedConfig.head] || HEAD_FEATURE_OFFSETS.round;
  const headFeatureTransform = getAvatarHeadFeatureTransform(headFeatureOffset);
  const frontHairMarginTransform = getAvatarHeadMarginTransform(Hair.marginTop);
  const rearHairMarginTransform = frontHairMarginTransform;

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
      <g data-avatar-camera={crop} transform={cameraTransform}>
        <g data-avatar-layer="rear-effects">
          <ellipse
            className="avatar-contact-shadow avatar-detail"
            cx="120"
            cy={CONTACT_SHADOW_Y}
            rx="58"
            ry="4"
            fill={palette.background.deep}
            opacity="0.24"
            filter={`url(#${ids.silhouetteShadow})`}
          />
        </g>
        <g data-avatar-layer="rear-pet" />
        <g data-avatar-layer="rear-accessories" />
        <g data-avatar-layer="rear-hair" transform={rearHairMarginTransform}>
          <g data-avatar-head-rig="true" transform={headRigTransform}>
            <Hair.Rear config={normalizedConfig} palette={palette} paints={paints} />
          </g>
        </g>
        <g data-avatar-layer="legs">
          <Anatomy palette={palette} paints={paints} build={normalizedConfig.body} section="legs" />
          <Body config={normalizedConfig} palette={palette} paints={paints} section="legs" />
        </g>
        <g data-avatar-layer="torso-arms">
          <Anatomy palette={palette} paints={paints} build={normalizedConfig.body} section="torso-arms" />
          <Body config={normalizedConfig} palette={palette} paints={paints} section="torso-arms" />
          <OutfitPattern config={normalizedConfig} palette={palette} paints={paints} />
        </g>
        <g data-avatar-layer="neck-ears">
          <g data-avatar-head-rig="true" transform={headRigTransform}>
            <Anatomy palette={palette} paints={paints} build={normalizedConfig.body} />
          </g>
        </g>
        <g data-avatar-layer="head">
          <g data-avatar-head-rig="true" transform={headRigTransform}>
            <Head config={normalizedConfig} palette={palette} paints={paints} />
          </g>
        </g>
        <g data-avatar-layer="face">
          <g data-avatar-head-rig="true" transform={headRigTransform}>
            <g data-avatar-face-features="true" transform={headFeatureTransform}>
              <FaceModeling config={normalizedConfig} palette={palette} paints={paints} />
              <FaceExtra config={normalizedConfig} palette={palette} paints={paints} />
              <Eyes config={normalizedConfig} palette={palette} paints={paints} />
              <Mouth config={normalizedConfig} palette={palette} paints={paints} />
            </g>
          </g>
        </g>
        <g data-avatar-layer="front-hair" transform={frontHairMarginTransform}>
          <g data-avatar-head-rig="true" transform={headRigTransform}>
            <Hair.Front config={normalizedConfig} palette={palette} paints={paints} />
          </g>
        </g>
        <g data-avatar-layer="hat">
          <g data-avatar-head-rig="true" transform={headRigTransform}>
            <Hat config={normalizedConfig} palette={palette} paints={paints} />
          </g>
        </g>
        <g data-avatar-layer="front-accessories" />
        <g data-avatar-layer="pet" />
        <g data-avatar-layer="finish" />
      </g>
    </svg>
  );
}

export default AvatarArtwork;
