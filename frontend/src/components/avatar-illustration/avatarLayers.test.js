import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_LAYER_ORDER, getAvatarLayerOrder } from './avatarLayers.js';

const functionSource = (source, functionName) => {
  const match = new RegExp(`(?:export )?function ${functionName}\\(`).exec(source);
  assert.ok(match, `missing function ${functionName}`);
  const rest = source.slice(match.index + match[0].length);
  const next = /\n(?:export )?function [A-Z]/.exec(rest);
  const registry = /\nexport const [A-Z_]+ = Object\.freeze/.exec(rest);
  const ends = [next, registry].filter(Boolean).map((entry) => entry.index);
  const end = ends.length ? Math.min(...ends) : rest.length;
  return source.slice(match.index, match.index + match[0].length + end);
};

test('avatar layer order is deterministic and immutable', () => {
  assert.deepEqual(getAvatarLayerOrder(), [
    'rear-effects', 'rear-pet', 'rear-accessories', 'rear-hair', 'legs', 'torso-arms',
    'neck-ears', 'head', 'face', 'front-hair', 'hat', 'front-accessories', 'pet', 'finish',
  ]);
  assert.ok(Object.isFrozen(AVATAR_LAYER_ORDER));
});

test('compositor exposes every named layer in contract order', () => {
  const source = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  let cursor = -1;
  for (const layer of getAvatarLayerOrder()) {
    const next = source.indexOf(`data-avatar-layer=\"${layer}\"`);
    assert.ok(next > cursor, `${layer} must appear after the preceding layer`);
    cursor = next;
  }
});

test('vertical slice contains complete anatomy and illustration finish markers', () => {
  const files = ['parts/anatomy.jsx', 'parts/heads.jsx', 'parts/faces.jsx', 'parts/hair.jsx', 'parts/outfits.jsx'];
  const source = files.map((file) => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n');
  for (const marker of [
    'avatar-leg-left', 'avatar-leg-right', 'avatar-hand-left', 'avatar-hand-right',
    'avatar-shoe-left', 'avatar-shoe-right', 'avatar-outline', 'avatar-highlight',
    'avatar-detail', 'avatar-cheek', 'avatar-hair-strand', 'avatar-outfit-seam',
  ]) {
    assert.match(source, new RegExp(marker), `missing ${marker}`);
  }
});

test('vertical slice models hair, face, hoodie, shorts, and shoes with distinct finish planes', () => {
  const files = ['parts/anatomy.jsx', 'parts/heads.jsx', 'parts/faces.jsx', 'parts/hair.jsx', 'parts/outfits.jsx'];
  const source = files.map((file) => readFileSync(new URL(file, import.meta.url), 'utf8')).join('\n');
  for (const marker of [
    'avatar-hair-lock', 'avatar-hair-plane', 'avatar-face-plane', 'avatar-hood-volume',
    'avatar-sleeve-fold', 'avatar-ribbing', 'avatar-pocket-stitch',
    'avatar-shorts-panel', 'avatar-shoe-panel', 'avatar-hair-root-shadow',
    'avatar-hair-boundary', 'avatar-hair-directional-highlight',
    'avatar-jaw-plane', 'avatar-upper-eye-plane', 'avatar-nose-plane',
  ]) {
    assert.match(source, new RegExp(marker), `missing ${marker}`);
  }
});

test('short hair opens both brows and reserves lifted paint for selective highlights', () => {
  const source = readFileSync(new URL('parts/hair.jsx', import.meta.url), 'utf8');

  assert.match(source, /avatar-brow-window-left/, 'missing left brow window');
  assert.match(source, /avatar-brow-window-right/, 'missing right brow window');
  assert.doesNotMatch(
    source,
    /fill=\{palette\.hair\.lifted\}/,
    'lifted hair paint must not fill broad crown or lock shapes',
  );
  assert.match(
    source,
    /avatar-hair-directional-highlight[\s\S]*?fill="none"[\s\S]*?stroke=\{palette\.hair\.lifted\}/,
    'lifted hair paint must be limited to an open directional highlight',
  );
});

test('face finish uses localized planes and the modeled-eye primitive owns two small highlights', () => {
  const heads = readFileSync(new URL('parts/heads.jsx', import.meta.url), 'utf8');
  const faces = readFileSync(new URL('parts/faces.jsx', import.meta.url), 'utf8');

  assert.match(heads, /avatar-cheek-plane/, 'missing curved cheek plane');
  assert.match(heads, /avatar-jaw-plane/, 'missing localized jaw plane');
  assert.doesNotMatch(faces, /avatar-eye-shadow/, 'broad eye socket masks must be removed');
  const openEye = faces.match(/function OpenEye\([\s\S]*?\n\}\n\nfunction OpenEyePair/);
  assert.ok(openEye, 'missing shared modeled-eye primitive');
  assert.equal(
    (openEye[0].match(/avatar-eye-highlight-small/g) || []).length,
    2,
    'each modeled open eye must own exactly two small highlights',
  );
});

test('instance-local material paints are passed to and consumed by major masses', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const anatomy = readFileSync(new URL('parts/anatomy.jsx', import.meta.url), 'utf8');
  const heads = readFileSync(new URL('parts/heads.jsx', import.meta.url), 'utf8');
  const hair = readFileSync(new URL('parts/hair.jsx', import.meta.url), 'utf8');
  const outfits = readFileSync(new URL('parts/outfits.jsx', import.meta.url), 'utf8');

  assert.match(compositor, /const reactId = useId\(\);[\s\S]*?const prefix = `cq-avatar-\$\{reactId\.replace/);
  for (const [id, suffix] of Object.entries({
    skinGradient: 'skin-gradient',
    hairGradient: 'hair-gradient',
    outfitGradient: 'outfit-gradient',
    hatGradient: 'hat-gradient',
    gearGradient: 'gear-gradient',
    petGradient: 'pet-gradient',
    backgroundGradient: 'background-gradient',
    silhouetteShadow: 'silhouette-shadow',
  })) {
    const idSource = `${id}: \`\${prefix}-${suffix}\`,`;
    assert.ok(compositor.includes(idSource), `${id} must derive from the useId-backed prefix`);
  }
  assert.match(compositor, /function buildAvatarPaints\(ids\)[\s\S]*?Object\.freeze\(\{/);
  for (const material of ['skin', 'hair', 'outfit', 'hat', 'gear', 'pet', 'background']) {
    const gradient = `${material}Gradient`;
    const paintSource = `${material}: \`url(#\${ids.${gradient}})\``;
    assert.ok(
      compositor.includes(paintSource),
      `${material} paint must reference its current instance id`,
    );
  }
  for (const part of ['Hair.Rear', 'Anatomy', 'Body', 'Head', 'Eyes', 'Mouth', 'FaceExtra', 'Hair.Front', 'Hat']) {
    assert.match(
      compositor,
      new RegExp(`<${part.replace('.', '\\.')}[\\s\\S]*?paints=\\{paints\\}`),
      `${part} must receive the shared paint map`,
    );
  }
  assert.match(heads, /fill=\{paints\.skin\}/, 'head mass must consume skin paint');
  assert.match(hair, /fill=\{paints\.hair\}/, 'hair mass must consume hair paint');
  assert.match(anatomy, /fill=\{paints\.outfit\}/, 'torso mass must consume outfit paint');
  assert.match(anatomy, /fill=\{paints\.gear\}/, 'shoe mass must consume gear paint');
  assert.match(outfits, /fill=\{paints\.outfit\}/, 'outfit surface must consume outfit paint');
});

test('one camera wrapper owns one literal sequence of all named artwork layers', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  assert.equal(
    (compositor.match(/data-avatar-camera=/g) || []).length,
    1,
    'compositor must render one shared camera-wrapped artwork tree',
  );
  assert.match(compositor, /const cameraTransform = getAvatarCameraTransform\(crop\);/);
  assert.match(
    compositor,
    /<g data-avatar-camera=\{crop\} transform=\{cameraTransform\}>[\s\S]*?<g data-avatar-layer="finish"\s*\/>\s*<\/g>/,
    'every named layer must live inside the same camera wrapper',
  );
  for (const layer of getAvatarLayerOrder()) {
    assert.equal(
      (compositor.match(new RegExp(`data-avatar-layer="${layer}"`, 'g')) || []).length,
      1,
      `${layer} must occur once in the shared artwork tree`,
    );
  }
});

test('all head-attached layers share a nested rig while hair margin stays outside it', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const anatomy = readFileSync(new URL('parts/anatomy.jsx', import.meta.url), 'utf8');
  const outfits = readFileSync(new URL('parts/outfits.jsx', import.meta.url), 'utf8');

  for (const layer of ['rear-hair', 'neck-ears', 'head', 'face', 'hat']) {
    assert.match(
      compositor,
      new RegExp(`data-avatar-layer="${layer}"[^>]*>[\\s\\S]*?<g data-avatar-head-rig="true" transform=\\{headRigTransform\\}`),
      `${layer} must contain the shared head rig`,
    );
  }
  assert.match(
    compositor,
    /data-avatar-layer="front-hair"[^>]*transform=\{frontHairMarginTransform\}>\s*<g data-avatar-head-rig="true" transform=\{headRigTransform\}/,
    'front hair margin must be the outer transform around the shared head rig',
  );
  assert.match(
    compositor,
    /data-avatar-layer="rear-hair"[^>]*transform=\{rearHairMarginTransform\}>\s*<g data-avatar-head-rig="true" transform=\{headRigTransform\}/,
    'rear hair margin must use the same outer unscaled transform as front hair',
  );
  assert.match(compositor, /getAvatarHeadMarginTransform\(Hair\.marginTop\)/);
  assert.doesNotMatch(compositor, /getAvatarHeadRigTransform\(Hair\.marginTop\)/);
  assert.match(anatomy, /AVATAR_POSE_ANCHORS/);
  assert.match(outfits, /AVATAR_POSE_ANCHORS/);
  assert.match(anatomy, /AVATAR_BODY_PROPORTIONS/);
  assert.match(outfits, /AVATAR_BODY_PROPORTIONS/);
});

test('selected headwear is resolved once and painted after front hair inside the shared head rig', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const registry = readFileSync(new URL('./registry.js', import.meta.url), 'utf8');
  const hats = readFileSync(new URL('parts/hats.jsx', import.meta.url), 'utf8');

  assert.match(registry, /import \{ HAT_RENDERERS \} from '\.\/parts\/hats\.jsx';/);
  assert.match(registry, /export \{[\s\S]*?HAIR_RENDERERS,[\s\S]*?HAT_RENDERERS,/);
  assert.match(compositor, /const Hat = resolveAvatarPart\(HAT_RENDERERS, normalizedConfig\.hat, 'none'\);/);
  assert.equal((compositor.match(/<Hat\b/g) || []).length, 1, 'one selected hat renderer is enough');
  assert.match(
    compositor,
    /data-avatar-layer="front-hair"[\s\S]*?data-avatar-layer="hat"[^>]*>\s*<g data-avatar-head-rig="true" transform=\{headRigTransform\}>\s*<Hat config=\{normalizedConfig\} palette=\{palette\} paints=\{paints\} \/>/,
    'hat must paint over front hair in the same head-source coordinate system',
  );
  assert.match(hats, /avatar-hood-occluder/, 'hood occlusion must be authored in headwear artwork');
});

test('contact shadow is painted in rear effects and finish stays semantically empty', () => {
  const source = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const rearEffects = source.indexOf('data-avatar-layer="rear-effects"');
  const rearPet = source.indexOf('data-avatar-layer="rear-pet"');
  const contactShadow = source.indexOf('avatar-contact-shadow');
  const finish = source.indexOf('data-avatar-layer="finish"');

  assert.ok(rearEffects >= 0 && rearPet > rearEffects);
  assert.ok(contactShadow > rearEffects && contactShadow < rearPet, 'shadow must be inside rear-effects');
  assert.ok(contactShadow < finish, 'shadow must be behind the figure');
  assert.match(source, /<g data-avatar-layer="finish"\s*\/>/);
});

test('body limbs use regional transforms while both hands legs and shoes remain explicit', () => {
  const anatomy = readFileSync(new URL('parts/anatomy.jsx', import.meta.url), 'utf8');
  for (const marker of [
    'avatar-leg-left', 'avatar-leg-right', 'avatar-hand-left', 'avatar-hand-right',
    'avatar-shoe-left', 'avatar-shoe-right',
  ]) {
    assert.equal((anatomy.match(new RegExp(marker, 'g')) || []).length, 1, `${marker} must render once`);
  }
  assert.match(anatomy, /const rig = getAvatarBuildRig\(build\);/);
  assert.match(anatomy, /transform=\{rig\.legs\.free\.transform\}/);
  assert.match(anatomy, /transform=\{rig\.legs\.weight\.transform\}/);
  assert.match(anatomy, /transform=\{rig\.torso\.transform\}/);
  assert.match(anatomy, /transform=\{rig\.hands\.hip\.transform\}/);
  assert.match(anatomy, /transform=\{rig\.hands\.relaxed\.transform\}/);
  assert.doesNotMatch(
    anatomy,
    /<g transform=\{buildTransform\}>[\s\S]*?avatar-hand-/,
    'hands may not inherit the body width scale',
  );
});

test('outfit clip is instance-local and selected pattern sits between base mass and finish', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const defs = readFileSync(new URL('./AvatarDefs.jsx', import.meta.url), 'utf8');
  const registry = readFileSync(new URL('./registry.js', import.meta.url), 'utf8');

  assert.ok(
    compositor.includes('outfitClip: `${prefix}-outfit-clip`,'),
    'outfit clip id must derive from the useId-backed prefix',
  );
  assert.match(compositor, /<AvatarDefs ids=\{ids\} palette=\{palette\} build=\{normalizedConfig\.body\} \/>/);
  assert.match(defs, /<clipPath id=\{ids\.outfitClip\}>/);
  assert.match(defs, /<OutfitClip build=\{build\} \/>/);
  assert.doesNotMatch(defs, /id="[^\"]*outfit[^\"]*"/, 'clip ids may not be global literals');

  const base = compositor.indexOf('<Body config={normalizedConfig} palette={palette} paints={paints} section="base" />');
  const pattern = compositor.indexOf('<OutfitPattern');
  const finish = compositor.indexOf('<Body config={normalizedConfig} palette={palette} paints={paints} section="finish" />');
  assert.ok(base >= 0 && pattern > base && finish > pattern, 'paint order must be base, pattern, finish');
  assert.match(
    compositor,
    /<OutfitPattern[\s\S]*?patternId=\{normalizedConfig\.outfit_pattern\}[\s\S]*?palette=\{palette\}[\s\S]*?clipId=\{ids\.outfitClip\}/,
  );
  assert.match(registry, /BODY_RENDERERS,[\s\S]*?OUTFIT_PATTERN_RENDERERS,/);
});

test('outfit finish owns every seam and footwear detail above the clipped pattern', () => {
  const source = readFileSync(new URL('parts/outfits.jsx', import.meta.url), 'utf8');
  const finish = functionSource(source, 'OutfitFinish');
  for (const marker of [
    'avatar-outfit-seam', 'avatar-drawstring', 'avatar-pocket-stitch', 'avatar-ribbing',
    'avatar-shorts-boundary', 'avatar-sock-detail', 'avatar-shoe-lace', 'avatar-shoe-sole',
  ]) {
    assert.match(finish, new RegExp(marker), `finish must own ${marker}`);
  }
  assert.doesNotMatch(finish, /clipPath=/, 'finish details must remain above, not inside, the pattern clip');
});
