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
  return [...match[1].matchAll(/^  ([a-z][a-z0-9_]*): ([A-Z][A-Za-z0-9]*),$/gm)]
    .map(([, id, renderer]) => ({ id, renderer }));
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
