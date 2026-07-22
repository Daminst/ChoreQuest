import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_CATALOG } from '../avatar-editor/avatarCatalog.js';
import {
  PET_ACCESSORY_OPTIONS,
  PET_OPTIONS,
} from '../avatar-editor/avatarPetCatalog.js';
import {
  AVATAR_CAMERAS,
  AVATAR_HEAD_RIG,
  getAvatarFrame,
  getAvatarHeadMarginTransform,
} from './avatarGeometry.js';

const ids = (entry) => entry.options.map((option) => option.id).sort();

const registryKeys = (file, exportName) => {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const match = source.match(
    new RegExp(`export const ${exportName} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`),
  );
  assert.ok(match, `missing ${exportName}`);
  return [...match[1].matchAll(/^  ([a-z][a-z0-9_]*):/gm)]
    .map((entry) => entry[1])
    .sort();
};

const registryEntries = (source, exportName) => {
  const match = source.match(
    new RegExp(`export const ${exportName} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`),
  );
  assert.ok(match, `missing ${exportName}`);
  return [...match[1].matchAll(/^  ([a-z][a-z0-9_]*): ([A-Z][A-Za-z0-9_]*),$/gm)]
    .map(([, id, renderer]) => ({ id, renderer }));
};

const accessoryRegistryEntries = (source) => {
  const match = source.match(
    /export const ACCESSORY_RENDERERS = Object\.freeze\(\{([\s\S]*?)\n\}\);/,
  );
  assert.ok(match, 'missing ACCESSORY_RENDERERS');
  return [...match[1].matchAll(
    /^  ([a-z][a-z0-9_]*): Object\.freeze\(\{ layer: '(rear|front)', Component: ([A-Z][A-Za-z0-9_]*) \}\),$/gm,
  )].map(([, id, layer, Component]) => ({ id, layer, Component }));
};

const hairEntry = (source, constantName) => {
  const match = source.match(
    new RegExp(
      `const ${constantName} = Object\\.freeze\\(\\{ Rear: ([A-Z][A-Za-z0-9]*), Front: ([A-Z][A-Za-z0-9]*), marginTop: (-?\\d+(?:\\.\\d+)?) \\}\\);`,
    ),
  );
  assert.ok(match, `${constantName} must be a frozen exact hair entry`);
  return { Rear: match[1], Front: match[2], marginTop: Number(match[3]) };
};

const literalAttribute = (body, attribute) => {
  const match = body.match(new RegExp(`${attribute}="([^"]+)"`));
  assert.ok(match, `missing literal ${attribute}`);
  return match[1];
};

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

const comparableRendererSource = (source, renderer) => functionSource(source, renderer)
  .replace(new RegExp(`export function ${renderer}`), 'export function Renderer')
  .replace(/data-avatar-variant="[^"]+"/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const PATH_COMMAND = /^[MLCZ]$/;
const PORTRAIT_SAFETY_INSET = 1;

const cubicAt = (start, control1, control2, end, t) => {
  const inverse = 1 - t;
  return (inverse ** 3 * start)
    + (3 * inverse ** 2 * t * control1)
    + (3 * inverse * t ** 2 * control2)
    + (t ** 3 * end);
};

const cubicMinimum = (start, control1, control2, end) => {
  const cubic = -start + (3 * control1) - (3 * control2) + end;
  const quadratic = (3 * start) - (6 * control1) + (3 * control2);
  const linear = (-3 * start) + (3 * control1);
  const a = 3 * cubic;
  const b = 2 * quadratic;
  const candidates = [start, end];

  if (Math.abs(a) < 1e-12) {
    if (Math.abs(b) >= 1e-12) {
      const root = -linear / b;
      if (root > 0 && root < 1) candidates.push(cubicAt(start, control1, control2, end, root));
    }
  } else {
    const discriminant = (b ** 2) - (4 * a * linear);
    if (discriminant >= 0) {
      const squareRoot = Math.sqrt(discriminant);
      for (const root of [(-b + squareRoot) / (2 * a), (-b - squareRoot) / (2 * a)]) {
        if (root > 0 && root < 1) candidates.push(cubicAt(start, control1, control2, end, root));
      }
    }
  }
  return Math.min(...candidates);
};

const svgPathTop = (pathData) => {
  const tokens = pathData.match(/[MLCZ]|-?(?:\d+\.?\d*|\.\d+)/g) || [];
  let index = 0;
  let command = null;
  let x = 0;
  let y = 0;
  let subpathX = 0;
  let subpathY = 0;
  let top = Infinity;

  while (index < tokens.length) {
    if (PATH_COMMAND.test(tokens[index])) command = tokens[index++];
    assert.ok(command, 'path data lost its command near ' + tokens[index]);

    if (command === 'Z') {
      x = subpathX;
      y = subpathY;
      top = Math.min(top, y);
      command = null;
      continue;
    }
    if (command === 'M') {
      x = Number(tokens[index++]);
      y = Number(tokens[index++]);
      subpathX = x;
      subpathY = y;
      top = Math.min(top, y);
      command = 'L';
      continue;
    }
    if (command === 'L') {
      x = Number(tokens[index++]);
      y = Number(tokens[index++]);
      top = Math.min(top, y);
      continue;
    }
    if (command === 'C') {
      const control1X = Number(tokens[index++]);
      const control1Y = Number(tokens[index++]);
      const control2X = Number(tokens[index++]);
      const control2Y = Number(tokens[index++]);
      const endX = Number(tokens[index++]);
      const endY = Number(tokens[index++]);
      void control1X;
      void control2X;
      top = Math.min(top, cubicMinimum(y, control1Y, control2Y, endY));
      x = endX;
      y = endY;
      continue;
    }
    assert.fail('unsupported authored path command ' + command);
  }
  return top;
};

const literalStrokeWidth = (tag) => {
  if (!/\bstroke=/.test(tag) || /\bstroke="none"/.test(tag)) return 0;
  const match = tag.match(/\bstrokeWidth="([\d.]+)"/);
  return match ? Number(match[1]) : 1;
};

const rendererPaintBounds = (body, finishKind) => {
  const bounds = [];
  const finishStrokes = finishKind === 'hair'
    ? { baseD: 3.2, shadowD: 0, highlightD: 2.15, strandD: 1.35, detailD: 1.55 }
    : { baseD: 3, shadowD: 0, highlightD: 2.05, detailD: 1.4 };

  for (const [attribute, strokeWidth] of Object.entries(finishStrokes)) {
    const match = body.match(new RegExp(attribute + '="([^"]+)"'));
    if (match) bounds.push({ geometryTop: svgPathTop(match[1]), strokeWidth });
  }
  for (const match of body.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*\/>/g)) {
    bounds.push({ geometryTop: svgPathTop(match[1]), strokeWidth: literalStrokeWidth(match[0]) });
  }
  for (const match of body.matchAll(/<circle\b[^>]*\bcy="([\d.]+)"[^>]*\br="([\d.]+)"[^>]*\/>/g)) {
    bounds.push({
      geometryTop: Number(match[1]) - Number(match[2]),
      strokeWidth: literalStrokeWidth(match[0]),
    });
  }

  return Object.freeze({
    geometryTop: Math.min(...bounds.map(({ geometryTop }) => geometryTop)),
    paintedTop: Math.min(...bounds.map(({ geometryTop, strokeWidth }) => geometryTop - (strokeWidth / 2))),
  });
};

const mergePaintBounds = (...bounds) => Object.freeze({
  geometryTop: Math.min(...bounds.map(({ geometryTop }) => geometryTop)),
  paintedTop: Math.min(...bounds.map(({ paintedTop }) => paintedTop)),
});

const translationY = (transform) => {
  const match = transform.match(/^translate\(0 (-?[\d.]+)\)$/);
  assert.ok(match, 'expected an outer vertical translation, received ' + transform);
  return Number(match[1]);
};

const portraitHeadTop = (sourceTop, outerOffset = 0) => {
  const riggedTop = AVATAR_HEAD_RIG.anchor.y
    + ((sourceTop - AVATAR_HEAD_RIG.anchor.y) * AVATAR_HEAD_RIG.scaleY);
  const camera = AVATAR_CAMERAS.portrait;
  return camera.targetAnchor.y
    + (((riggedTop + outerOffset) - camera.sourceAnchor.y) * camera.scaleY);
};

const roundUpHundredth = (value) => Math.ceil((value - 1e-9) * 100) / 100;

test('head and face registries exactly cover the editor catalog', () => {
  assert.deepEqual(registryKeys('./parts/heads.jsx', 'HEAD_RENDERERS'), ids(AVATAR_CATALOG.head));
  assert.deepEqual(registryKeys('./parts/faces.jsx', 'EYE_RENDERERS'), ids(AVATAR_CATALOG.eyes));
  assert.deepEqual(registryKeys('./parts/faces.jsx', 'MOUTH_RENDERERS'), ids(AVATAR_CATALOG.mouth));
  assert.deepEqual(
    registryKeys('./parts/faces.jsx', 'FACE_EXTRA_RENDERERS'),
    ids(AVATAR_CATALOG.face),
  );
});

test('hair and hat registries exactly cover the editor catalog', () => {
  assert.deepEqual(registryKeys('./parts/hair.jsx', 'HAIR_RENDERERS'), ids(AVATAR_CATALOG.hair));
  assert.deepEqual(registryKeys('./parts/hats.jsx', 'HAT_RENDERERS'), ids(AVATAR_CATALOG.hat));
});

test('body and outfit-pattern registries exactly cover the editor catalog', () => {
  assert.deepEqual(registryKeys('./parts/outfits.jsx', 'BODY_RENDERERS'), ids(AVATAR_CATALOG.body));
  assert.deepEqual(
    registryKeys('./parts/outfits.jsx', 'OUTFIT_PATTERN_RENDERERS'),
    ids(AVATAR_CATALOG.pattern),
  );
});

test('pet registries exactly cover the pet catalogs', () => {
  assert.deepEqual(
    registryKeys('./parts/pets.jsx', 'PET_RENDERERS'),
    PET_OPTIONS.map((option) => option.id).sort(),
  );
  assert.deepEqual(
    registryKeys('./parts/pets.jsx', 'PET_ACCESSORY_RENDERERS'),
    PET_ACCESSORY_OPTIONS.map((option) => option.id).sort(),
  );
});

test('all six pets are distinct modeled companions on one frozen anchor contract', () => {
  const petUrl = new URL('./parts/pets.jsx', import.meta.url);
  assert.doesNotThrow(() => readFileSync(petUrl), 'missing v3 pets artwork module');
  const source = readFileSync(petUrl, 'utf8');
  const entries = registryEntries(source, 'PET_RENDERERS');

  assert.deepEqual(Object.fromEntries(entries.map(({ id, renderer }) => [id, renderer])), {
    none: 'EmptyPart',
    cat: 'CatPet',
    dog: 'DogPet',
    dragon: 'DragonPet',
    owl: 'OwlPet',
    bunny: 'BunnyPet',
    phoenix: 'PhoenixPet',
  });
  assert.match(source, /export const PET_POSITION_ANCHORS = Object\.freeze\(\{/);
  for (const [id, x, y] of [['left', 40, 252], ['right', 200, 252], ['head', 120, 36]]) {
    assert.match(
      source,
      new RegExp(`^  ${id}: Object\\.freeze\\(\\{ x: ${x}, y: ${y} \\}\\),$`, 'm'),
      `${id} must preserve its full-canvas anchor`,
    );
  }
  assert.match(source, /import \{ mapLegacyPetPoint \} from '\.\.\/avatarGeometry\.js';/);
  assert.match(source, /mapLegacyPetPoint\(config\.pet_x, config\.pet_y\)/);

  const silhouettes = [];
  for (const { id, renderer } of entries.filter(({ id }) => id !== 'none')) {
    const body = functionSource(source, renderer);
    assert.match(body, new RegExp(`data-avatar-variant="pet:${id}"`));
    assert.match(body, /<PetEyePair\b/, `${id} needs two modeled eyes`);
    assert.match(body, /avatar-pet-base/, `${id} needs a primary body mass`);
    assert.match(body, /avatar-pet-shadow/, `${id} needs a body shadow plane`);
    assert.match(body, /avatar-pet-highlight/, `${id} needs a body highlight plane`);
    assert.match(body, /avatar-outline/, `${id} needs a colored outline`);
    assert.match(body, /avatar-pet-accent/, `${id} needs a separate accent surface`);
    assert.match(body, /data-pet-ground="0"/, `${id} must share the same local foot line`);
    const silhouette = body.match(/className="avatar-pet-base avatar-outline"[\s\S]*?d="([^"]+)"/);
    assert.ok(silhouette, `${id} needs an inspectable authored silhouette`);
    silhouettes.push(silhouette[1]);
  }
  assert.equal(new Set(silhouettes).size, 6, 'pet silhouettes cannot alias one another');
  assert.doesNotMatch(source, /\.map\s*\(/, 'pet artwork cannot allocate authored geometry arrays per render');
});

test('pet accessories are explicit unique modeled variants', () => {
  const source = readFileSync(new URL('./parts/pets.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'PET_ACCESSORY_RENDERERS');
  assert.deepEqual(Object.fromEntries(entries.map(({ id, renderer }) => [id, renderer])), {
    none: 'EmptyPart',
    crown: 'PetCrown',
    party_hat: 'PetPartyHat',
    bow: 'PetBow',
    bandana: 'PetBandana',
    halo: 'PetHalo',
    flower: 'PetFlower',
  });
  assert.equal(new Set(entries.map(({ renderer }) => renderer)).size, entries.length);
  for (const { id, renderer } of entries) {
    const body = functionSource(source, renderer);
    if (id === 'none') {
      assert.match(body, /return null;/);
      continue;
    }
    assert.match(body, new RegExp(`data-avatar-variant="pet-accessory:${id}"`));
    assert.match(body, /avatar-pet-accessory-highlight/);
    assert.match(body, /avatar-outline/);
  }
});

test('pet accessories use frozen semantic attachment roles and bandanas stay on every species neck', () => {
  const source = readFileSync(new URL('./parts/pets.jsx', import.meta.url), 'utf8');
  const expectedAttachments = {
    none: { role: 'none', offsetX: 0, offsetY: 0 },
    crown: { role: 'head', offsetX: 0, offsetY: 0 },
    party_hat: { role: 'head', offsetX: 0, offsetY: 0 },
    bow: { role: 'ear', offsetX: 0, offsetY: 0 },
    bandana: { role: 'neck', offsetX: 0, offsetY: 0 },
    halo: { role: 'head', offsetX: 0, offsetY: -5 },
    flower: { role: 'ear', offsetX: 0, offsetY: 0 },
  };
  const attachmentMatch = source.match(
    /export const PET_ACCESSORY_ATTACHMENTS = Object\.freeze\(\{([\s\S]*?)\n\}\);/,
  );
  assert.ok(attachmentMatch, 'missing frozen pet accessory attachment map');
  const actualAttachments = Object.fromEntries(
    [...attachmentMatch[1].matchAll(
      /^  ([a-z][a-z0-9_]*): Object\.freeze\(\{ role: '(none|head|ear|neck)', offsetX: (-?\d+), offsetY: (-?\d+) \}\),$/gm,
    )].map(([, id, role, offsetX, offsetY]) => [id, {
      role,
      offsetX: Number(offsetX),
      offsetY: Number(offsetY),
    }]),
  );
  assert.deepEqual(actualAttachments, expectedAttachments);
  assert.deepEqual(Object.keys(actualAttachments).sort(), PET_ACCESSORY_OPTIONS.map(({ id }) => id).sort());

  const expectedAnchors = {
    cat: { head: [0, -49], ear: [-15, -43], neck: [0, -9] },
    dog: { head: [0, -47], ear: [-17, -39], neck: [0, -9] },
    dragon: { head: [0, -53], ear: [-14, -47], neck: [0, -9] },
    owl: { head: [0, -52], ear: [-15, -46], neck: [0, -9] },
    bunny: { head: [0, -59], ear: [-12, -48], neck: [0, -9] },
    phoenix: { head: [0, -57], ear: [-14, -48], neck: [0, -9] },
  };
  const anchorsMatch = source.match(
    /export const PET_ACCESSORY_ANCHORS = Object\.freeze\(\{([\s\S]*?)\n\}\);/,
  );
  assert.ok(anchorsMatch, 'missing frozen per-species accessory anchor map');
  const actualAnchors = Object.fromEntries(
    [...anchorsMatch[1].matchAll(
      /^  ([a-z]+): Object\.freeze\(\{ head: Object\.freeze\(\{ x: (-?\d+), y: (-?\d+) \}\), ear: Object\.freeze\(\{ x: (-?\d+), y: (-?\d+) \}\), neck: Object\.freeze\(\{ x: (-?\d+), y: (-?\d+) \}\) \}\),$/gm,
    )].map(([, id, headX, headY, earX, earY, neckX, neckY]) => [id, {
      head: [Number(headX), Number(headY)],
      ear: [Number(earX), Number(earY)],
      neck: [Number(neckX), Number(neckY)],
    }]),
  );
  assert.deepEqual(actualAnchors, expectedAnchors);
  assert.deepEqual(Object.keys(actualAnchors).sort(), PET_OPTIONS.filter(({ id }) => id !== 'none').map(({ id }) => id).sort());
  for (const [species, anchors] of Object.entries(actualAnchors)) {
    assert.ok(anchors.neck[1] >= -10 && anchors.neck[1] <= -7, `${species} bandana must sit on the lower neck/chest`);
    assert.ok(anchors.neck[1] >= anchors.head[1] + 38, `${species} bandana cannot reuse the forehead anchor`);
  }

  const bandana = functionSource(source, 'PetBandana');
  assert.match(bandana, /d="M-20,-1 Q0,4 20,-1 L16,3 Q0,7 -16,3 Z"/);
  assert.match(bandana, /d="M15,2 L22,7 L16,7 L11,4 Z"/);
  assert.match(source, /const accessoryAttachment = PET_ACCESSORY_ATTACHMENTS\[accessoryType\][\s\S]*?PET_ACCESSORY_ATTACHMENTS\.none;/);
  assert.match(source, /const accessoryAnchor = accessoryAnchors\[accessoryAttachment\.role\][\s\S]*?accessoryAnchors\.head;/);
  assert.match(source, /data-pet-accessory-role=\{accessoryAttachment\.role\}/);
  assert.match(source, /data-pet-accessory-anchor=\{`\$\{accessoryX\},\$\{accessoryY\}`\}/);
  assert.match(source, /transform=\{`translate\(\$\{accessoryX\} \$\{accessoryY\}\)`\}/);
});

test('pet progression maps exact scale and cumulative face-safe effect semantics', () => {
  const source = readFileSync(new URL('./parts/pets.jsx', import.meta.url), 'utf8');
  assert.match(source, /const levelScale = getPetLevelScale\(resolvedLevel\);/);
  assert.match(source, /data-pet-level-scale=\{levelScale\.toFixed\(2\)\}/);
  const expectedEffects = {
    2: 'aura',
    3: 'gem-collar',
    4: 'eye-shine',
    5: 'sparkles',
    6: 'shimmer',
    7: 'glow',
    8: 'gold-sparkles',
  };
  for (const [level, effect] of Object.entries(expectedEffects)) {
    assert.match(
      source,
      new RegExp(`level >= ${level}[\\s\\S]*?data-pet-effect="${effect}"`),
      `level ${level} must add ${effect}`,
    );
  }
  assert.match(source, /data-pet-effect-zone="outside-face"/);
  assert.match(source, /data-pet-motion=\{motionEnabled \? 'on' : 'off'\}/);
  assert.doesNotMatch(source, /id="(?:pet|avatar)-/, 'pet SVG ids cannot be global literals');
});

test('every hat owns an exact measured head-perch profile with truthful render metadata', () => {
  const source = readFileSync(new URL('./parts/pets.jsx', import.meta.url), 'utf8');
  const expectedProfileByHat = {
    none: 'center',
    crown: 'sideRight',
    wizard: 'sideRight',
    beanie: 'sideRight',
    cap: 'sideRight',
    pirate: 'sideRight',
    headphones: 'sideRight',
    tiara: 'sideRight',
    horns: 'centerRaised',
    bunny_ears: 'centerRaised',
    cat_ears: 'centerHigh',
    halo: 'sideRight',
    viking: 'sideRight',
    star_headset: 'sideRight',
    hunter_hood: 'sideRight',
    kitty_bow_ears: 'centerHigh',
    mischief_hood: 'sideRight',
  };
  const profileMapMatch = source.match(
    /export const PET_HEAD_PERCH_PROFILE_BY_HAT = Object\.freeze\(\{([\s\S]*?)\n\}\);/,
  );
  assert.ok(profileMapMatch, 'missing frozen per-hat head-perch profile map');
  const actualProfileByHat = Object.fromEntries(
    [...profileMapMatch[1].matchAll(/^  ([a-z][a-z0-9_]*): '([A-Za-z]+)',$/gm)]
      .map(([, hat, profile]) => [hat, profile]),
  );
  assert.deepEqual(actualProfileByHat, expectedProfileByHat);
  assert.deepEqual(Object.keys(actualProfileByHat).sort(), ids(AVATAR_CATALOG.hat));

  const expectedProfiles = {
    center: { baselineX: 120, baselineY: 47, placementScale: 0.44, facing: 1, perchMode: 'center' },
    centerRaised: { baselineX: 120, baselineY: 35, placementScale: 0.32, facing: 1, perchMode: 'center' },
    centerHigh: { baselineX: 120, baselineY: 27, placementScale: 0.25, facing: 1, perchMode: 'center' },
    sideRight: { baselineX: 203, baselineY: 94, placementScale: 0.72, facing: -1, perchMode: 'side' },
  };
  const profileMatch = source.match(
    /export const PET_HEAD_PERCH_PROFILES = Object\.freeze\(\{([\s\S]*?)\n\}\);/,
  );
  assert.ok(profileMatch, 'missing frozen measured head-perch profiles');
  const actualProfiles = Object.fromEntries(
    [...profileMatch[1].matchAll(
      /^  ([A-Za-z]+): Object\.freeze\(\{ baselineX: (-?[\d.]+), baselineY: (-?[\d.]+), placementScale: ([\d.]+), facing: (-?\d+), perchMode: '([a-z-]+)' \}\),$/gm,
    )].map(([, id, baselineX, baselineY, placementScale, facing, perchMode]) => [
      id,
      {
        baselineX: Number(baselineX),
        baselineY: Number(baselineY),
        placementScale: Number(placementScale),
        facing: Number(facing),
        perchMode,
      },
    ]),
  );
  assert.deepEqual(actualProfiles, expectedProfiles);
  assert.doesNotMatch(source, /config\.hat\s*&&\s*config\.hat\s*!==\s*'none'/);
  assert.match(source, /PET_HEAD_PERCH_PROFILE_BY_HAT\[config\.hat\][\s\S]*?PET_HEAD_PERCH_PROFILE_BY_HAT\.none/);
  assert.match(source, /const headProfile = PET_HEAD_PERCH_PROFILES\[headProfileId\];/);
  assert.match(source, /data-pet-saved-anchor=\{`\$\{placement\.anchorX\},\$\{placement\.anchorY\}`\}/);
  assert.match(source, /data-pet-render-anchor=\{`\$\{placement\.baselineX\},\$\{placement\.baselineY\}`\}/);
  assert.match(source, /data-pet-perch-profile=\{placement\.perchProfile\}/);
  assert.match(source, /data-pet-perch=\{placement\.perchMode\}/);

  const centeredBaseline = expectedProfiles.center.baselineY;
  assert.ok(centeredBaseline + (-59 - 24) * 1.28 * 0.44 >= 0, 'a tall pet accessory stays inside the canvas');
  assert.ok(centeredBaseline + 3 * 1.28 * 0.44 < 50, 'the centered perch stays above the face-safe line');
});

test('compact preview contains the tallest level-eight pet and accessory combination', () => {
  const source = readFileSync(new URL('./parts/pets.jsx', import.meta.url), 'utf8');
  const compactViewBox = source.match(/const COMPACT_VIEW_BOX = '([^']+)';/)?.[1]
    .split(' ')
    .map(Number);
  assert.deepEqual(compactViewBox, [154, 200, 92, 120]);

  const [, top, , height] = compactViewBox;
  const partyHatTop = 310 + (-59 - 24) * 1.28;
  const levelEightGlowBottom = 310 + 3 * 1.28;
  assert.ok(top <= partyHatTop, 'the level-eight bunny party hat must remain visible');
  assert.ok(top + height >= levelEightGlowBottom, 'the level-eight glow must remain visible');
});

test('main compositor and level rail share PetArtwork without legacy imports', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const registry = readFileSync(new URL('./registry.js', import.meta.url), 'utf8');
  const customizer = readFileSync(new URL('../avatar-editor/PetCustomizer.jsx', import.meta.url), 'utf8');

  assert.match(registry, /import \{ PET_ACCESSORY_RENDERERS, PET_RENDERERS, PetArtwork \} from '\.\/parts\/pets\.jsx';/);
  assert.match(registry, /export \{[\s\S]*?PET_ACCESSORY_RENDERERS,[\s\S]*?PET_RENDERERS,[\s\S]*?PetArtwork,/);
  assert.match(
    compositor,
    /data-avatar-layer="pet"[^>]*>[\s\S]*?<PetArtwork[\s\S]*?config=\{normalizedConfig\}[\s\S]*?motionEnabled=\{motionEnabled\}/,
  );
  assert.match(customizer, /import \{ PetArtwork \} from '\.\.\/avatar-illustration\/parts\/pets';/);
  assert.doesNotMatch(customizer, /from '\.\.\/avatar\/pets'/);
  assert.match(customizer, /function PetPreview\(\{ config, level \}\)/);
  assert.match(customizer, /<PetArtwork[\s\S]*?pet_xp: PET_LEVEL_THRESHOLDS\[level - 1\][\s\S]*?pet_xp_map: \{\}[\s\S]*?position="right"[\s\S]*?level=\{level\}[\s\S]*?compact/);
});

test('equipment registry exactly covers the catalog with the frozen layer map', () => {
  const accessoryUrl = new URL('./parts/accessories.jsx', import.meta.url);
  assert.doesNotThrow(() => readFileSync(accessoryUrl), 'missing accessories artwork module');
  const source = readFileSync(accessoryUrl, 'utf8');
  const entries = accessoryRegistryEntries(source);

  assert.deepEqual(entries.map(({ id }) => id).sort(), ids(AVATAR_CATALOG.accessory));
  assert.equal(entries.length, AVATAR_CATALOG.accessory.options.length);
  assert.deepEqual(
    Object.fromEntries(entries.map(({ id, layer, Component }) => [id, { layer, Component }])),
    {
      scarf: { layer: 'front', Component: 'Scarf' },
      necklace: { layer: 'front', Component: 'Necklace' },
      bow_tie: { layer: 'front', Component: 'BowTie' },
      cape: { layer: 'rear', Component: 'Cape' },
      wings: { layer: 'rear', Component: 'Wings' },
      shield: { layer: 'front', Component: 'Shield' },
      sword: { layer: 'rear', Component: 'Sword' },
      stage_mic: { layer: 'front', Component: 'StageMic' },
      spirit_blade: { layer: 'rear', Component: 'SpiritBlade' },
      bell_collar: { layer: 'front', Component: 'BellCollar' },
    },
  );
});

test('compositor resolves accessories once and places rear equipment before front equipment', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const registry = readFileSync(new URL('./registry.js', import.meta.url), 'utf8');

  assert.match(registry, /import \{ ACCESSORY_RENDERERS \} from '\.\/parts\/accessories\.jsx';/);
  assert.match(registry, /export \{[\s\S]*?ACCESSORY_RENDERERS,/);
  assert.equal(
    (compositor.match(/normalizedConfig\.accessories\.map\s*\(/g) || []).length,
    1,
    'the normalized saved array must be resolved exactly once',
  );
  assert.match(
    compositor,
    /const rearAccessories = resolvedAccessories\.filter\(\(\{ entry \}\) => entry && entry\.layer === 'rear'\);/,
  );
  assert.match(
    compositor,
    /const frontAccessories = resolvedAccessories\.filter\(\(\{ entry \}\) => entry && entry\.layer === 'front'\);/,
  );

  const rearExpression = compositor.indexOf("entry.layer === 'rear'");
  const frontExpression = compositor.indexOf("entry.layer === 'front'");
  assert.ok(rearExpression >= 0 && frontExpression > rearExpression);
  assert.match(
    compositor,
    /<g data-avatar-layer="rear-accessories">\s*\{rearAccessories\.map\([\s\S]*?\}\s*<\/g>/,
  );
  assert.match(
    compositor,
    /<g data-avatar-layer="front-accessories">\s*\{frontAccessories\.map\([\s\S]*?\}\s*<\/g>/,
  );
});

test('all ten equipment renderers are unique modeled gear with safe declared bounds', () => {
  const accessoryUrl = new URL('./parts/accessories.jsx', import.meta.url);
  assert.doesNotThrow(() => readFileSync(accessoryUrl), 'missing accessories artwork module');
  const source = readFileSync(accessoryUrl, 'utf8');
  const entries = accessoryRegistryEntries(source);
  const comparableRenderers = [];

  assert.equal(new Set(entries.map(({ Component }) => Component)).size, 10);
  for (const { id, layer, Component } of entries) {
    const body = functionSource(source, Component);
    assert.equal(
      (body.match(/(?:export )?function [A-Z][A-Za-z0-9_]*\(/g) || []).length,
      1,
      `${id} renderer cannot define another component during render`,
    );
    assert.match(body, /\{\s*config\s*,\s*palette\s*,\s*paints\s*\}/);
    assert.match(body, new RegExp(`data-avatar-variant="accessory:${id}"`));
    assert.match(body, /className="[^"]*avatar-accessory-base[^"]*avatar-outline[^"]*"/);
    assert.match(body, /fill=\{paints\.gear\}/, `${id} must consume its instance-local gear paint`);
    assert.match(body, /stroke=\{palette\.gear\.outline\}/, `${id} needs a colored gear outline`);
    assert.match(
      body,
      /className="[^"]*avatar-accessory-highlight[^"]*"[\s\S]*?(?:fill|stroke)=\{palette\.gear\.(?:light|highlight)\}/,
      `${id} needs a palette-derived highlight`,
    );
    assert.match(body, /className="[^"]*avatar-accessory-detail[^"]*"/);
    assert.match(body, /data-avatar-material="(?:fabric|metal|feather|gem|leather|mesh)"/);

    const boundsMatch = body.match(/data-avatar-bounds="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/);
    assert.ok(boundsMatch, `${id} needs inspectable full-canvas bounds metadata`);
    const [minX, minY, maxX, maxY] = boundsMatch.slice(1).map(Number);
    assert.ok(minX >= 0 && minY >= 0 && maxX <= 240 && maxY <= 320, `${id} exceeds full frame`);
    assert.ok(maxX > minX && maxY > minY, `${id} bounds must have positive area`);
    if (layer === 'front') {
      assert.ok(minY >= 110, `${id} enters the two-eye safety zone`);
    }

    comparableRenderers.push(
      body
        .replace(new RegExp(Component, 'g'), 'AccessoryRenderer')
        .replace(new RegExp(`accessory:${id}`, 'g'), 'accessory:variant')
        .replace(/\s+/g, ' ')
        .trim(),
    );
  }

  assert.equal(new Set(comparableRenderers).size, 10, 'equipment cannot alias placeholder geometry');
});

test('equipment rendering preserves saved order and duplicate legacy IDs without mutation', () => {
  const compositor = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  const renderer = functionSource(compositor, 'renderAccessoryItem');

  assert.match(
    compositor,
    /normalizedConfig\.accessories\.map\(\(id, index\) => \(\{ id, index, entry: ACCESSORY_RENDERERS\[id\] \}\)\)/,
  );
  assert.match(renderer, /const Accessory = entry\.Component;/);
  assert.match(renderer, /key=\{`\$\{id\}-\$\{index\}`\}/);
  assert.match(renderer, /config=\{config\}/);
  assert.match(renderer, /palette=\{palette\}/);
  assert.match(renderer, /paints=\{paints\}/);
  assert.doesNotMatch(
    compositor,
    /(?:normalizedConfig\.accessories|resolvedAccessories|rearAccessories|frontAccessories)\.(?:sort|reverse|splice|copyWithin)\s*\(/,
  );
  assert.doesNotMatch(compositor, /normalizedConfig\.accessories\s*=/);
  assert.doesNotMatch(compositor, /config\.accessories\s*=/);
  assert.equal((compositor.match(/data-avatar-layer="rear-accessories"/g) || []).length, 1);
  assert.equal((compositor.match(/data-avatar-layer="front-accessories"/g) || []).length, 1);
});

test('three body builds are frozen unique renderers with semantic surfaces', () => {
  const source = readFileSync(new URL('./parts/outfits.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'BODY_RENDERERS');
  assert.deepEqual(Object.fromEntries(entries.map(({ id, renderer }) => [id, renderer])), {
    slim: 'SlimBody',
    regular: 'RegularBody',
    broad: 'BroadBody',
  });
  assert.equal(new Set(entries.map(({ renderer }) => renderer)).size, 3);

  for (const { id, renderer } of entries) {
    const body = functionSource(source, renderer);
    assert.match(body, new RegExp(`data-avatar-variant="body:${id}"`));
    assert.match(body, new RegExp(`build="${id}"`));
  }

  assert.doesNotMatch(source, /\.map\s*\(/, 'body surfaces must not allocate mapped arrays per render');
});

test('every non-none outfit pattern is a distinct clipped semantic renderer', () => {
  const source = readFileSync(new URL('./parts/outfits.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'OUTFIT_PATTERN_RENDERERS');
  const expectedRenderers = Object.freeze({
    none: 'EmptyPart',
    stripes: 'StripesPattern',
    stars: 'StarsPattern',
    camo: 'CamoPattern',
    tie_dye: 'TieDyePattern',
    plaid: 'PlaidPattern',
    neon_pulse: 'NeonPulsePattern',
    moon_sigil: 'MoonSigilPattern',
    tiny_bows: 'TinyBowsPattern',
    bat_stars: 'BatStarsPattern',
  });
  assert.deepEqual(Object.fromEntries(entries.map(({ id, renderer }) => [id, renderer])), expectedRenderers);

  const patternedEntries = entries.filter(({ id }) => id !== 'none');
  assert.equal(new Set(patternedEntries.map(({ renderer }) => renderer)).size, 9);
  const geometries = [];
  for (const { id, renderer } of patternedEntries) {
    const body = functionSource(source, renderer);
    assert.match(body, /\{\s*patternId\s*,\s*palette\s*,\s*clipId\s*\}/);
    assert.match(body, new RegExp(`data-avatar-variant="pattern:${id}"`));
    assert.match(body, /data-pattern-id=\{patternId\}/);
    assert.match(body, /clipPath=\{`url\(#\$\{clipId\}\)`\}/);
    geometries.push(
      body
        .replace(new RegExp(`pattern:${id}`, 'g'), 'pattern:variant')
        .replace(new RegExp(renderer, 'g'), 'PatternRenderer')
        .replace(/\s+/g, ' ')
        .trim(),
    );
  }
  assert.equal(new Set(geometries).size, 9, 'patterns must differ beyond their semantic labels');
  assert.doesNotMatch(source, /\.map\s*\(/, 'pattern renderers must not allocate mapped arrays per render');
});

test('hair entries are frozen two-pass contracts with unique authored fronts', () => {
  const source = readFileSync(new URL('./parts/hair.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'HAIR_RENDERERS');
  const expectedConstants = Object.freeze({
    none: 'NONE_HAIR',
    short: 'SHORT_HAIR',
    long: 'LONG_HAIR',
    spiky: 'SPIKY_HAIR',
    curly: 'CURLY_HAIR',
    mohawk: 'MOHAWK_HAIR',
    buzz: 'BUZZ_HAIR',
    ponytail: 'PONYTAIL_HAIR',
    bun: 'BUN_HAIR',
    pigtails: 'PIGTAILS_HAIR',
    afro: 'AFRO_HAIR',
    braids: 'BRAIDS_HAIR',
    wavy: 'WAVY_HAIR',
    side_part: 'SIDE_PART_HAIR',
    fade: 'FADE_HAIR',
    dreadlocks: 'DREADLOCKS_HAIR',
    bob: 'BOB_HAIR',
    shoulder: 'SHOULDER_HAIR',
    undercut: 'UNDERCUT_HAIR',
    twin_buns: 'TWIN_BUNS_HAIR',
    idol_waves: 'IDOL_WAVES_HAIR',
  });
  assert.deepEqual(Object.fromEntries(entries.map(({ id, renderer }) => [id, renderer])), expectedConstants);

  const contracts = entries.map(({ id, renderer }) => ({ id, ...hairEntry(source, renderer) }));
  const fronts = contracts.filter(({ id }) => id !== 'none').map(({ Front }) => Front);
  assert.equal(new Set(fronts).size, fronts.length, 'each hairstyle needs a unique front renderer');

  const basePaths = [];
  for (const { id, Front, marginTop } of contracts) {
    assert.ok(marginTop <= 0, `${id} marginTop must remain non-positive overshoot metadata`);
    if (marginTop < 0) {
      assert.ok(
        ['spiky', 'bun', 'afro', 'twin_buns'].includes(id),
        `${id} may not claim tall-hair margin metadata`,
      );
    }
    if (id === 'none') continue;
    const body = functionSource(source, Front);
    assert.match(body, new RegExp(`data-avatar-variant="hair:${id}:front"`));
    assert.match(body, /<HairFinish\b/, `${id} must use the modeled hair finish`);
    for (const attribute of ['baseD', 'shadowD', 'highlightD', 'strandD']) {
      literalAttribute(body, attribute);
    }
    basePaths.push(literalAttribute(body, 'baseD'));
  }
  assert.equal(new Set(basePaths).size, basePaths.length, 'front silhouettes must be authored distinctly');
});

test('hair overshoot metadata is derived from each real authored minimum after the shared head scale', () => {
  const source = readFileSync(new URL('./parts/hair.jsx', import.meta.url), 'utf8');
  const contracts = registryEntries(source, 'HAIR_RENDERERS')
    .map(({ id, renderer }) => ({ id, ...hairEntry(source, renderer) }));
  const mismatches = [];

  for (const contract of contracts) {
    if (contract.id === 'none') continue;
    const bounds = mergePaintBounds(
      rendererPaintBounds(functionSource(source, contract.Rear), 'hair'),
      rendererPaintBounds(functionSource(source, contract.Front), 'hair'),
    );
    const outerOvershoot = Math.max(
      0,
      (AVATAR_HEAD_RIG.sourceBounds.visibleCrown - bounds.geometryTop) * AVATAR_HEAD_RIG.scaleY,
    );
    const expectedMarginTop = outerOvershoot > 0 ? -roundUpHundredth(outerOvershoot) : 0;
    if (contract.marginTop !== expectedMarginTop) {
      mismatches.push({
        id: contract.id,
        sourceMinY: Number(bounds.geometryTop.toFixed(3)),
        expectedMarginTop,
        actualMarginTop: contract.marginTop,
      });
    }
  }

  assert.deepEqual(mismatches, []);
});

test('all 21 hair entries keep their final painted top inside the portrait safety inset', () => {
  const source = readFileSync(new URL('./parts/hair.jsx', import.meta.url), 'utf8');
  const contracts = registryEntries(source, 'HAIR_RENDERERS')
    .map(({ id, renderer }) => ({ id, ...hairEntry(source, renderer) }));
  const frameTop = Number(getAvatarFrame('portrait').viewBox.split(' ')[1]);
  const safeTop = frameTop + PORTRAIT_SAFETY_INSET;
  const clipped = [];
  let emptyEntries = 0;

  for (const contract of contracts) {
    if (contract.id === 'none') {
      emptyEntries += 1;
      continue;
    }
    const bounds = mergePaintBounds(
      rendererPaintBounds(functionSource(source, contract.Rear), 'hair'),
      rendererPaintBounds(functionSource(source, contract.Front), 'hair'),
    );
    const outerOffset = translationY(getAvatarHeadMarginTransform(contract.marginTop));
    const finalTop = portraitHeadTop(bounds.paintedTop, outerOffset);
    if (finalTop < safeTop) {
      clipped.push({
        id: contract.id,
        paintedSourceMinY: Number(bounds.paintedTop.toFixed(3)),
        finalTop: Number(finalTop.toFixed(3)),
        safeTop,
      });
    }
  }

  assert.equal(contracts.length, 21);
  assert.equal(emptyEntries, 1);
  assert.deepEqual(clipped, []);
});

test('required long and voluminous hairstyles own visible unique rear artwork', () => {
  const source = readFileSync(new URL('./parts/hair.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'HAIR_RENDERERS');
  const requiredRear = [
    'long', 'ponytail', 'bun', 'pigtails', 'afro', 'braids', 'wavy', 'dreadlocks',
    'bob', 'shoulder', 'twin_buns', 'idol_waves',
  ];
  const rearRenderers = [];

  for (const id of requiredRear) {
    const constantName = entries.find((entry) => entry.id === id)?.renderer;
    assert.ok(constantName, `missing ${id} registry entry`);
    const { Rear } = hairEntry(source, constantName);
    assert.notEqual(Rear, 'EmptyHairPart', `${id} needs visible rear artwork`);
    const body = functionSource(source, Rear);
    assert.match(body, new RegExp(`data-avatar-variant="hair:${id}:rear"`));
    assert.match(body, /<HairFinish\b/);
    rearRenderers.push(Rear);
  }
  assert.equal(new Set(rearRenderers).size, rearRenderers.length, 'rear silhouettes must not alias');
});

test('modeled hair finish includes base, root shadow, colored outline, directional light, and strand work', () => {
  const source = readFileSync(new URL('./parts/hair.jsx', import.meta.url), 'utf8');
  const finish = functionSource(source, 'HairFinish');
  for (const marker of [
    'avatar-hair-base',
    'avatar-hair-shadow',
    'avatar-hair-root-shadow',
    'avatar-hair-directional-highlight',
    'avatar-hair-strand',
    'avatar-outline',
  ]) {
    assert.match(finish, new RegExp(marker), `HairFinish is missing ${marker}`);
  }
  assert.match(finish, /fill=\{paints\.hair\}/);
  assert.match(finish, /stroke=\{palette\.hair\.outline\}/);
  assert.match(finish, /stroke=\{palette\.hair\.lifted\}/);
  assert.doesNotMatch(source, /\.map\s*\(/, 'hair renderers must not allocate mapped elements');
});

test('hat catalog uses unique modeled renderers anchored to the shared skull contract', () => {
  const source = readFileSync(new URL('./parts/hats.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'HAT_RENDERERS');
  const expectedRenderers = Object.freeze({
    none: 'EmptyPart',
    crown: 'Crown',
    wizard: 'WizardHat',
    beanie: 'Beanie',
    cap: 'Cap',
    pirate: 'PirateHat',
    headphones: 'Headphones',
    tiara: 'Tiara',
    horns: 'Horns',
    bunny_ears: 'BunnyEars',
    cat_ears: 'CatEars',
    halo: 'Halo',
    viking: 'VikingHelmet',
    star_headset: 'StarHeadset',
    hunter_hood: 'HunterHood',
    kitty_bow_ears: 'KittyBowEars',
    mischief_hood: 'MischiefHood',
  });
  assert.deepEqual(Object.fromEntries(entries.map(({ id, renderer }) => [id, renderer])), expectedRenderers);
  assert.match(source, /import \{ AVATAR_HEADWEAR_ANCHORS \} from '\.\.\/avatarGeometry\.js';/);

  const modeledEntries = entries.filter(({ id }) => id !== 'none');
  assert.equal(
    new Set(modeledEntries.map(({ renderer }) => renderer)).size,
    modeledEntries.length,
    'hat variants must not alias renderer functions',
  );
  const basePaths = [];
  for (const { id, renderer } of modeledEntries) {
    const body = functionSource(source, renderer);
    assert.match(body, /\{\s*config\s*,\s*palette\s*,\s*paints\s*\}/);
    assert.match(body, new RegExp(`data-avatar-variant="hat:${id}"`));
    assert.match(body, /data-avatar-skull-anchor=\{AVATAR_HEADWEAR_ANCHORS\.skullTop\.y\}/);
    assert.match(body, /data-hair-coverage="(?:covers|reveals|occludes)"/);
    assert.match(body, /<HatFinish\b/, `${id} must use the modeled hat finish`);
    for (const attribute of ['baseD', 'shadowD', 'highlightD', 'detailD']) {
      literalAttribute(body, attribute);
    }
    basePaths.push(literalAttribute(body, 'baseD'));
  }
  assert.equal(new Set(basePaths).size, basePaths.length, 'hat silhouettes must be authored distinctly');
  assert.doesNotMatch(source, /\.map\s*\(/, 'hat renderers must not allocate mapped elements');
});

test('all 17 headwear entries keep high decorative details inside the portrait safety inset', () => {
  const source = readFileSync(new URL('./parts/hats.jsx', import.meta.url), 'utf8');
  const entries = registryEntries(source, 'HAT_RENDERERS');
  const frameTop = Number(getAvatarFrame('portrait').viewBox.split(' ')[1]);
  const safeTop = frameTop + PORTRAIT_SAFETY_INSET;
  const clipped = [];
  let emptyEntries = 0;

  for (const { id, renderer } of entries) {
    if (id === 'none') {
      emptyEntries += 1;
      continue;
    }
    const bounds = rendererPaintBounds(functionSource(source, renderer), 'hat');
    const finalTop = portraitHeadTop(bounds.paintedTop);
    if (finalTop < safeTop) {
      clipped.push({
        id,
        paintedSourceMinY: Number(bounds.paintedTop.toFixed(3)),
        finalTop: Number(finalTop.toFixed(3)),
        safeTop,
      });
    }
  }

  assert.equal(entries.length, 17);
  assert.equal(emptyEntries, 1);
  assert.deepEqual(clipped, []);
});

test('modeled headwear has material planes and both hoods paint real evenodd hair occluders', () => {
  const source = readFileSync(new URL('./parts/hats.jsx', import.meta.url), 'utf8');
  const finish = functionSource(source, 'HatFinish');
  for (const marker of [
    'avatar-hat-base', 'avatar-hat-shadow', 'avatar-hat-highlight', 'avatar-hat-detail',
    'avatar-outline',
  ]) {
    assert.match(finish, new RegExp(marker), `HatFinish is missing ${marker}`);
  }
  assert.match(finish, /fill=\{paints\.hat\}/);
  assert.match(finish, /stroke=\{palette\.hat\.outline\}/);

  for (const renderer of ['HunterHood', 'MischiefHood']) {
    const body = functionSource(source, renderer);
    assert.match(body, /className="avatar-hood-occluder avatar-outline"/);
    assert.match(body, /fill=\{paints\.hat\}/);
    assert.match(body, /fillRule="evenodd"/);
    assert.match(body, /clipRule="evenodd"/);
  }
});

test('revealing halo uses a real evenodd opening and never paints a background-colored disk', () => {
  const source = readFileSync(new URL('./parts/hats.jsx', import.meta.url), 'utf8');
  const finish = functionSource(source, 'HatFinish');
  const halo = functionSource(source, 'Halo');

  assert.match(finish, /fillRule = 'nonzero'/);
  assert.match(finish, /fillRule=\{fillRule\}/);
  assert.match(halo, /data-hair-coverage="reveals"/);
  assert.match(halo, /<HatFinish[\s\S]*?fillRule="evenodd"/);
  assert.match(
    halo,
    /className="avatar-halo-opening avatar-outline"[\s\S]*?fill="none"/,
    'halo opening must be a transparent stroked boundary rather than a painted disk',
  );
  assert.doesNotMatch(halo, /palette\.background/, 'revealing halo may not simulate transparency');
});

test('head feature offsets exactly cover the catalog and freeze every entry', () => {
  const source = readFileSync(new URL('./parts/heads.jsx', import.meta.url), 'utf8');
  assert.deepEqual(registryKeys('./parts/heads.jsx', 'HEAD_FEATURE_OFFSETS'), ids(AVATAR_CATALOG.head));
  for (const id of ids(AVATAR_CATALOG.head)) {
    assert.match(
      source,
      new RegExp(`^  ${id}: Object\\.freeze\\(\\{[^\\n]+\\}\\),$`, 'm'),
      `${id} feature offset must be frozen`,
    );
  }
});

test('every catalog ID owns a unique named renderer with a semantic root', () => {
  const families = [
    ['./parts/heads.jsx', 'HEAD_RENDERERS', 'head'],
    ['./parts/faces.jsx', 'EYE_RENDERERS', 'eyes'],
    ['./parts/faces.jsx', 'MOUTH_RENDERERS', 'mouth'],
    ['./parts/faces.jsx', 'FACE_EXTRA_RENDERERS', 'face'],
  ];

  for (const [file, exportName, family] of families) {
    const source = readFileSync(new URL(file, import.meta.url), 'utf8');
    const entries = registryEntries(source, exportName);
    assert.equal(
      new Set(entries.map(({ renderer }) => renderer)).size,
      entries.length,
      `${exportName} must not alias renderer functions`,
    );

    for (const { id, renderer } of entries) {
      const body = functionSource(source, renderer);
      assert.match(body, /\{\s*config\s*,\s*palette\b/, `${renderer} must accept config and palette`);
      if (id === 'none') {
        assert.match(body, /return null;/, `${renderer} must explicitly render no part`);
      } else {
        assert.match(body, /return\s*\(\s*<g\b/, `${renderer} must return one root group`);
        assert.match(
          body,
          new RegExp(`data-avatar-variant="${family}:${id}"`),
          `${renderer} needs its semantic variant marker`,
        );
      }
    }
  }
});

test('head silhouettes carry complete finish planes and unique authored geometry', () => {
  const source = readFileSync(new URL('./parts/heads.jsx', import.meta.url), 'utf8');
  const silhouettes = [];
  for (const { id, renderer } of registryEntries(source, 'HEAD_RENDERERS')) {
    const body = functionSource(source, renderer);
    for (const marker of [
      'avatar-head-silhouette',
      'avatar-outline',
      'avatar-jaw-plane',
      'avatar-cheek-plane',
      'avatar-highlight',
    ]) {
      assert.match(body, new RegExp(marker), `${id} is missing ${marker}`);
    }
    const silhouette = body.match(/className="avatar-head-silhouette avatar-outline"[\s\S]*?d="([^"]+)"/);
    assert.ok(silhouette, `${id} must expose its literal silhouette path`);
    silhouettes.push(silhouette[1]);
  }
  assert.equal(new Set(silhouettes).size, silhouettes.length, 'head silhouettes must be distinct');
});

test('facial families differ structurally beyond their variant labels', () => {
  const source = readFileSync(new URL('./parts/faces.jsx', import.meta.url), 'utf8');
  for (const exportName of ['EYE_RENDERERS', 'MOUTH_RENDERERS', 'FACE_EXTRA_RENDERERS']) {
    const renderers = registryEntries(source, exportName)
      .filter(({ id }) => id !== 'none')
      .map(({ renderer }) => comparableRendererSource(source, renderer));
    assert.equal(
      new Set(renderers).size,
      renderers.length,
      `${exportName} variants must not be geometry aliases`,
    );
  }
});

test('open-eye variants use the complete modeled-eye primitive and expression brows', () => {
  const source = readFileSync(new URL('./parts/faces.jsx', import.meta.url), 'utf8');
  const openEye = functionSource(source, 'OpenEye');
  for (const marker of [
    'avatar-eye-sclera',
    'avatar-eye-iris',
    'avatar-eye-pupil',
    'avatar-eye-highlight-small',
    'avatar-upper-lid',
  ]) {
    assert.match(openEye, new RegExp(marker), `OpenEye is missing ${marker}`);
  }
  assert.equal(
    (openEye.match(/avatar-eye-highlight-small/g) || []).length,
    2,
    'OpenEye must provide two compact highlights',
  );

  for (const id of ['normal', 'wide', 'angry', 'glasses', 'crying']) {
    const renderer = registryEntries(source, 'EYE_RENDERERS').find((entry) => entry.id === id).renderer;
    const body = functionSource(source, renderer);
    assert.match(body, /<OpenEyePair\b/, `${id} must render two modeled open eyes`);
    assert.match(body, /<ExpressionBrows\b/, `${id} must render separate brows`);
  }
  for (const id of ['wink', 'eye_patch']) {
    const renderer = registryEntries(source, 'EYE_RENDERERS').find((entry) => entry.id === id).renderer;
    const body = functionSource(source, renderer);
    assert.match(body, /<OpenEye\b/, `${id} must retain its eligible modeled open eye`);
    assert.match(body, /<ExpressionBrows\b/, `${id} must render separate brows`);
  }
});

test('face overlays remain separately targetable and render without per-render arrays', () => {
  const source = readFileSync(new URL('./parts/faces.jsx', import.meta.url), 'utf8');
  for (const marker of [
    'avatar-eye-tears',
    'avatar-eyewear',
    'avatar-eye-patch',
    'avatar-mouth-mask',
    'avatar-facial-hair',
  ]) {
    assert.match(source, new RegExp(marker), `missing separate ${marker} group`);
  }
  assert.doesNotMatch(source, /\.map\s*\(/, 'face renderers must not allocate mapped arrays per render');
});

test('one face wrapper consumes the selected head offset and preserves overlay order', () => {
  const source = readFileSync(new URL('./AvatarArtwork.jsx', import.meta.url), 'utf8');
  assert.match(source, /HEAD_FEATURE_OFFSETS/);
  assert.match(source, /getAvatarHeadFeatureTransform/);
  assert.match(
    source,
    /const headFeatureOffset = HEAD_FEATURE_OFFSETS\[normalizedConfig\.head\] \|\| HEAD_FEATURE_OFFSETS\.round;/,
  );
  assert.match(source, /const headFeatureTransform = getAvatarHeadFeatureTransform\(headFeatureOffset\);/);
  assert.equal((source.match(/data-avatar-face-features="true"/g) || []).length, 1);
  assert.match(
    source,
    /data-avatar-face-features="true" transform=\{headFeatureTransform\}>[\s\S]*?<FaceExtra\b[\s\S]*?<Eyes\b[\s\S]*?<Mouth\b[\s\S]*?<\/g>/,
    'face paint must stay below eyewear, masks, and facial hair in one transformed tree',
  );
});
