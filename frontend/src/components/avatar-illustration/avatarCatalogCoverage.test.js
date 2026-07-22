import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_CATALOG } from '../avatar-editor/avatarCatalog.js';
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
