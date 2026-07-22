import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_CATALOG } from '../avatar-editor/avatarCatalog.js';

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
      `const ${constantName} = Object\\.freeze\\(\\{ Rear: ([A-Z][A-Za-z0-9]*), Front: ([A-Z][A-Za-z0-9]*), marginTop: (-?\\d+) \\}\\);`,
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
    assert.ok(marginTop <= 0, `${id} marginTop must never move hair downward`);
    if (marginTop < 0) {
      assert.ok(
        ['spiky', 'mohawk', 'bun', 'afro', 'twin_buns'].includes(id),
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
