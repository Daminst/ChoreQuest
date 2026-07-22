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
  ACCESSORY_RENDERERS,
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
  PetArtwork,
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
    outfitClip: `${prefix}-outfit-clip`,
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

function renderAccessoryItem({ id, index, entry }, config, palette, paints) {
  const Accessory = entry.Component;
  return (
    <Accessory
      key={`${id}-${index}`}
      config={config}
      palette={palette}
      paints={paints}
    />
  );
}

export function AvatarArtwork({
  config = EMPTY_CONFIG,
  crop = 'icon',
  label = 'ChoreQuest avatar',
  motionEnabled = true,
}) {
  const frame = getAvatarFrame(crop);
  const normalizedConfig = useMemo(() => normalizeAvatarIllustrationConfig(config), [config]);
  const palette = useMemo(() => buildAvatarPalette(normalizedConfig), [normalizedConfig]);
  const reactId = useId();
  const prefix = `cq-avatar-${reactId.replace(UNSAFE_ID_CHARACTERS, '') || 'instance'}`;
  const ids = useMemo(() => buildAvatarIds(prefix), [prefix]);
  const paints = useMemo(() => buildAvatarPaints(ids), [ids]);
  const isCompact = crop === 'icon';
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
  const resolvedAccessories = normalizedConfig.accessories.map((id, index) => ({ id, index, entry: ACCESSORY_RENDERERS[id] }));
  const rearAccessories = resolvedAccessories.filter(({ entry }) => entry && entry.layer === 'rear');
  const frontAccessories = resolvedAccessories.filter(({ entry }) => entry && entry.layer === 'front');
  const selectionKey = [
    normalizedConfig.head,
    normalizedConfig.hair,
    normalizedConfig.eyes,
    normalizedConfig.mouth,
    normalizedConfig.hat,
    normalizedConfig.body,
    normalizedConfig.outfit_pattern,
    normalizedConfig.face_extra,
    normalizedConfig.pet,
    ...normalizedConfig.accessories,
  ].join('|');

  return (
    <svg
      className={`avatar-artwork avatar-artwork--${crop}`}
      viewBox={frame.viewBox}
      role="img"
      aria-label={label}
      data-avatar-motion={motionEnabled ? 'on' : 'off'}
      data-avatar-detail={isCompact ? 'compact' : 'full'}
      preserveAspectRatio="xMidYMid meet"
    >
      <AvatarDefs
        ids={ids}
        palette={palette}
        build={normalizedConfig.body}
        compact={isCompact}
      />
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
            className="avatar-contact-shadow avatar-detail avatar-compact-optional"
            cx="120"
            cy={CONTACT_SHADOW_Y}
            rx="58"
            ry="4"
            fill={palette.background.deep}
            opacity="0.24"
            filter={isCompact ? undefined : `url(#${ids.silhouetteShadow})`}
          />
        </g>
        <g data-avatar-layer="rear-pet" />
        <g className="avatar-figure-breath">
          <g data-avatar-layer="rear-accessories">
            {rearAccessories.map((item) => renderAccessoryItem(item, normalizedConfig, palette, paints))}
          </g>
          <g data-avatar-layer="rear-hair" transform={rearHairMarginTransform}>
            <g data-avatar-head-rig="true" transform={headRigTransform}>
              <Hair.Rear config={normalizedConfig} palette={palette} paints={paints} />
            </g>
          </g>
          <g data-avatar-layer="legs">
            <Anatomy palette={palette} paints={paints} build={normalizedConfig.body} section="legs" />
          </g>
          <g data-avatar-layer="torso-arms">
            <Anatomy palette={palette} paints={paints} build={normalizedConfig.body} section="torso-arms" />
            <Body config={normalizedConfig} palette={palette} paints={paints} section="base" />
            <OutfitPattern
              patternId={normalizedConfig.outfit_pattern}
              palette={palette}
              clipId={ids.outfitClip}
            />
            <g className="avatar-fabric-microdetail avatar-compact-optional">
              <Body config={normalizedConfig} palette={palette} paints={paints} section="finish" />
            </g>
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
              <g className="avatar-hair-secondary">
                <Hair.Front config={normalizedConfig} palette={palette} paints={paints} />
              </g>
            </g>
          </g>
          <g data-avatar-layer="hat">
            <g data-avatar-head-rig="true" transform={headRigTransform}>
              <Hat config={normalizedConfig} palette={palette} paints={paints} />
            </g>
          </g>
          <g data-avatar-layer="front-accessories">
            {frontAccessories.map((item) => renderAccessoryItem(item, normalizedConfig, palette, paints))}
          </g>
        </g>
        <g data-avatar-layer="pet">
          <PetArtwork
            config={normalizedConfig}
            position={normalizedConfig.pet_position}
            motionEnabled={motionEnabled}
          />
        </g>
        <g data-avatar-layer="finish">
          <g
            key={selectionKey}
            className="avatar-selection-flash avatar-compact-optional"
            aria-hidden="true"
          >
            <path d="M64 81 L67 87 L73 90 L67 93 L64 99 L61 93 L55 90 L61 87 Z" fill={palette.gear.highlight} />
            <path d="M176 72 L178 77 L183 79 L178 81 L176 86 L174 81 L169 79 L174 77 Z" fill={palette.gear.highlight} />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default AvatarArtwork;
