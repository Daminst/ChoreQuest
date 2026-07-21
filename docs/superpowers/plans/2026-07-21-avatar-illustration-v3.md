# Avatar Illustration v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat portrait avatar with a polished, full-body modular chibi illustration while preserving every saved configuration, editor interaction, entitlement rule, and pet behavior.

**Architecture:** `AvatarDisplay` remains the public boundary, but delegates to a new portrait-oriented SVG compositor in `components/avatar-illustration/`. Pure JavaScript modules own catalog data, crop geometry, normalization, palette rules, and layer order; focused JSX registries own each artwork family. The same figure is rendered as `full`, `portrait`, or `icon`, while `AvatarStage` exclusively owns the podium and spotlight.

**Tech Stack:** React 18, JSX/SVG, CSS, Vite 6, Node built-in test runner, FastAPI static hosting, ImageGen for an original non-runtime art-direction reference.

## Global Constraints

- Use an internal `0 0 240 320` full-body canvas.
- Support exactly three crop modes: `full`, `portrait`, and `icon`.
- `studio` defaults to `full`; `option` defaults by editor category; small application avatars default to `icon`.
- In `full`, `size` is the rendered height and width is derived from the 3:4 canvas. `portrait` and `icon` remain square.
- Never apply circular clipping or `overflow-hidden` to `full`; circular clipping is limited to `portrait` and `icon`.
- Keep the current `avatar_config` schema and `_v` value. Do not add a required persisted field.
- Preserve every current option identifier, color, multi-accessory rule, entitlement, pet position, pet XP value, and fallback.
- Runtime artwork must be modular SVG. Do not ship pre-rendered whole-character combinations or third-party game assets.
- `AvatarStage`, not `AvatarDisplay`, owns the podium, spotlight, and stage background effects.
- Respect `prefers-reduced-motion`; pet placement mode must use a transform-stable character.
- Do not publish a partial catalog. The vertical slice is an internal checkpoint only.
- The final verified Vite build and committed `static/` bundle must be byte-for-byte from the same build run.
- Before artwork implementation, use `imagegen`; before React edits use `build-web-apps:frontend-app-builder` and `build-web-apps:react-best-practices`; before browser QA use `build-web-apps:frontend-testing-debugging`; before completion use `superpowers:verification-before-completion`.

## File Structure

### Create

- `frontend/src/components/avatar-editor/avatarCatalog.js` — canonical editor choices, colors, default config, and randomize recipe.
- `frontend/src/components/avatar-illustration/avatarGeometry.js` — canvas, crop, dimension, category-crop, and pet-coordinate helpers.
- `frontend/src/components/avatar-illustration/avatarGeometry.test.js` — pure geometry and crop contract tests.
- `frontend/src/components/avatar-illustration/avatarConfig.js` — normalization and compatibility fallbacks.
- `frontend/src/components/avatar-illustration/avatarConfig.test.js` — immutability and legacy compatibility tests.
- `frontend/src/components/avatar-illustration/avatarLayers.js` — canonical layer order.
- `frontend/src/components/avatar-illustration/avatarLayers.test.js` — layer-order and compositor-structure tests.
- `frontend/src/components/avatar-illustration/AvatarDefs.jsx` — per-instance gradients, masks, and filters.
- `frontend/src/components/avatar-illustration/AvatarArtwork.jsx` — SVG compositor.
- `frontend/src/components/avatar-illustration/avatarIllustration.css` — figure-only motion and crop styling.
- `frontend/src/components/avatar-illustration/registry.js` — one registry boundary for all artwork families.
- `frontend/src/components/avatar-illustration/parts/anatomy.jsx` — legs, torso, arms, hands, neck, ears, socks, and shoes.
- `frontend/src/components/avatar-illustration/parts/heads.jsx` — nine head silhouettes.
- `frontend/src/components/avatar-illustration/parts/faces.jsx` — eyes, brows, nose, mouths, and face extras.
- `frontend/src/components/avatar-illustration/parts/hair.jsx` — rear/front layers for 21 hairstyles.
- `frontend/src/components/avatar-illustration/parts/hats.jsx` — 17 headwear variants.
- `frontend/src/components/avatar-illustration/parts/outfits.jsx` — three body builds, outfit surface, seams, and ten patterns.
- `frontend/src/components/avatar-illustration/parts/accessories.jsx` — ten front/rear equipment variants.
- `frontend/src/components/avatar-illustration/parts/pets.jsx` — six pets, six pet accessories, and level effects.
- `frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js` — exact catalog-to-registry coverage.
- `frontend/src/components/avatar-illustration/avatarArtworkStructure.test.js` — source-level finish, accessibility, and performance guardrails.
- `frontend/scripts/publish-static.mjs` — cross-platform `dist` to `static` publication.
- `frontend/scripts/publish-static.test.js` — isolated publication test using temporary directories.
- `docs/superpowers/art/avatar-v3-art-direction.png` — original art-direction sheet generated for this feature, not loaded at runtime.

### Modify

- `frontend/src/components/AvatarEditor.jsx` — import the extracted catalog without changing session behavior.
- `frontend/src/components/AvatarDisplay.jsx` — delegate to `AvatarArtwork` and implement crop-aware dimensions/wrappers.
- `frontend/src/components/avatar/avatarPaint.js` — add contrast-safe outline and cheek colors.
- `frontend/src/components/avatar/avatarPaint.test.js` — cover new paint tokens and extreme colors.
- `frontend/src/components/avatar-editor/AvatarStage.jsx` — request `full` explicitly and preserve pet-placement semantics.
- `frontend/src/components/avatar-editor/AvatarOptionControls.jsx` — choose crop by category.
- `frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx` — pass the active editor category to cards.
- `frontend/src/components/avatar-editor/PetCustomizer.jsx` — use the new pet artwork boundary.
- `frontend/src/components/avatar-editor/avatarPetCatalog.js` — own pure pet palette and level helpers used by tests and artwork.
- `frontend/src/components/avatar-editor/avatarPetCatalog.test.js` — cover pet palette overrides and exact level boundaries.
- `frontend/src/components/avatar-editor/avatarEditor.css` — fit a 3:4 figure on desktop and mobile; refine stage light and option-card aspect ratios.
- `frontend/src/components/avatar/avatarArtwork.test.js` — point finish and legacy-ID assertions at the v3 files.
- `frontend/src/App.css` — keep generic avatar animation selectors compatible with the new wrapper.
- `frontend/package.json` — use the cross-platform publisher.
- `static/` — replace with the final verified production build.

### Delete after migration

- `frontend/src/components/avatar/index.js`
- `frontend/src/components/avatar/heads.jsx`
- `frontend/src/components/avatar/eyes.jsx`
- `frontend/src/components/avatar/mouths.jsx`
- `frontend/src/components/avatar/faceExtras.jsx`
- `frontend/src/components/avatar/hair.jsx`
- `frontend/src/components/avatar/bodies.jsx`
- `frontend/src/components/avatar/hats.jsx`
- `frontend/src/components/avatar/accessories.jsx`
- `frontend/src/components/avatar/pets.jsx`

---

### Task 1: Extract the catalog and lock the geometry contract

**Files:**
- Create: `frontend/src/components/avatar-editor/avatarCatalog.js`
- Create: `frontend/src/components/avatar-illustration/avatarGeometry.js`
- Create: `frontend/src/components/avatar-illustration/avatarGeometry.test.js`
- Modify: `frontend/src/components/AvatarEditor.jsx`

**Interfaces:**
- Produces: `DEFAULT_CONFIG`, `AVATAR_CATALOG`, `RANDOMISE_RECIPE`, and named option/color arrays from `avatarCatalog.js`.
- Produces: `AVATAR_CANVAS`, `AVATAR_FRAMES`, `getAvatarFrame(crop)`, `getAvatarRenderDimensions(size, crop)`, `getAvatarOptionCrop(category)`, and `mapLegacyPetPoint(x, y)`.

- [ ] **Step 1: Write the failing geometry and catalog tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AVATAR_CANVAS,
  getAvatarFrame,
  getAvatarOptionCrop,
  getAvatarRenderDimensions,
  mapLegacyPetPoint,
} from './avatarGeometry.js';
import { AVATAR_CATALOG, DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';

test('full artwork uses a 3:4 240x320 canvas', () => {
  assert.deepEqual(AVATAR_CANVAS, { width: 240, height: 320 });
  assert.equal(getAvatarFrame('full').viewBox, '0 0 240 320');
  assert.deepEqual(getAvatarRenderDimensions(420, 'full'), { width: 315, height: 420 });
  assert.deepEqual(getAvatarRenderDimensions(76, 'portrait'), { width: 76, height: 76 });
});

test('editor categories choose a crop that exposes the changed part', () => {
  for (const category of ['head', 'skin', 'hair', 'eyes', 'mouth', 'hat', 'face']) {
    assert.equal(getAvatarOptionCrop(category), 'portrait');
  }
  for (const category of ['body', 'outfit', 'pattern', 'background', 'accessory', 'pet']) {
    assert.equal(getAvatarOptionCrop(category), 'full');
  }
});

test('legacy pet points map into the full-body canvas and clamp safely', () => {
  assert.deepEqual(mapLegacyPetPoint(4, 4), { x: 36, y: 64 });
  assert.deepEqual(mapLegacyPetPoint(28, 28), { x: 204, y: 280 });
  assert.deepEqual(mapLegacyPetPoint(-20, 80), { x: 36, y: 280 });
});

test('catalog remains complete and default config keeps version two', () => {
  assert.equal(AVATAR_CATALOG.head.options.length, 9);
  assert.equal(AVATAR_CATALOG.hair.options.length, 21);
  assert.equal(AVATAR_CATALOG.eyes.options.length, 15);
  assert.equal(AVATAR_CATALOG.mouth.options.length, 14);
  assert.equal(AVATAR_CATALOG.hat.options.length, 17);
  assert.equal(DEFAULT_CONFIG._v, 2);
});
```

- [ ] **Step 2: Run the new test and verify the missing modules fail**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarGeometry.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `avatarGeometry.js` or `avatarCatalog.js`.

- [ ] **Step 3: Move catalog literals without changing their values**

Move `HEAD_OPTIONS` through `ACCESSORY_COLORS`, `AVATAR_CONFIG_VERSION`, `DEFAULT_CONFIG`, `AVATAR_CATALOG`, and `RANDOMISE_RECIPE` from `AvatarEditor.jsx` into `avatar-editor/avatarCatalog.js`. Export every moved constant, freeze the top-level structures, and replace the removed block in `AvatarEditor.jsx` with:

```js
import {
  AVATAR_CATALOG,
  DEFAULT_CONFIG,
  RANDOMISE_RECIPE,
} from './avatar-editor/avatarCatalog';
```

The literal option IDs and order must remain byte-for-byte equivalent to the definitions in the pre-task `AvatarEditor.jsx`; themed entries still come from `THEMED_AVATAR_OPTIONS`, and pets still come from `avatarPetCatalog.js`.

- [ ] **Step 4: Implement the pure geometry helpers**

```js
export const AVATAR_CANVAS = Object.freeze({ width: 240, height: 320 });

export const AVATAR_FRAMES = Object.freeze({
  full: Object.freeze({ viewBox: '0 0 240 320', circular: false }),
  portrait: Object.freeze({ viewBox: '28 8 184 184', circular: true }),
  icon: Object.freeze({ viewBox: '42 18 156 156', circular: true }),
});

const PORTRAIT_CATEGORIES = new Set(['head', 'skin', 'hair', 'eyes', 'mouth', 'hat', 'face']);
const FULL_CATEGORIES = new Set(['body', 'outfit', 'pattern', 'background', 'accessory', 'pet']);

export function getAvatarFrame(crop = 'icon') {
  return AVATAR_FRAMES[crop] || AVATAR_FRAMES.icon;
}

export function getAvatarRenderDimensions(size, crop = 'icon') {
  const height = Number.isFinite(Number(size)) ? Number(size) : 64;
  return crop === 'full'
    ? { width: Math.round(height * AVATAR_CANVAS.width / AVATAR_CANVAS.height), height }
    : { width: height, height };
}

export function getAvatarOptionCrop(category) {
  if (PORTRAIT_CATEGORIES.has(category)) return 'portrait';
  if (FULL_CATEGORIES.has(category)) return 'full';
  return 'icon';
}

export function mapLegacyPetPoint(x, y) {
  const clamp = (value) => Math.min(28, Math.max(4, Number(value) || 4));
  return {
    x: Math.round(36 + ((clamp(x) - 4) / 24) * 168),
    y: Math.round(64 + ((clamp(y) - 4) / 24) * 216),
  };
}
```

- [ ] **Step 5: Run focused and full frontend tests**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarGeometry.test.js`  
Expected: 4 tests pass.  
Run: `cd frontend && node --test`  
Expected: 140 tests pass, 0 fail.

- [ ] **Step 6: Commit the catalog and geometry contract**

```bash
git add frontend/src/components/AvatarEditor.jsx frontend/src/components/avatar-editor/avatarCatalog.js frontend/src/components/avatar-illustration/avatarGeometry.js frontend/src/components/avatar-illustration/avatarGeometry.test.js
git commit -m "refactor: define avatar catalog and geometry contract"
```

### Task 2: Normalize legacy configurations and expand the paint system

**Files:**
- Create: `frontend/src/components/avatar-illustration/avatarConfig.js`
- Create: `frontend/src/components/avatar-illustration/avatarConfig.test.js`
- Modify: `frontend/src/components/avatar/avatarPaint.js`
- Modify: `frontend/src/components/avatar/avatarPaint.test.js`

**Interfaces:**
- Consumes: `DEFAULT_CONFIG` from Task 1.
- Produces: `normalizeAvatarIllustrationConfig(config)` and a palette whose finishes contain `base`, `light`, `highlight`, `shadow`, `deep`, `outline`, and `cheek` where applicable.

- [ ] **Step 1: Write failing compatibility and extreme-color tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAvatarIllustrationConfig } from './avatarConfig.js';

test('normalization is immutable and migrates legacy renderer aliases in memory', () => {
  const source = { hair_style: 'long', accessory: 'cape', accessories: [] };
  const normalized = normalizeAvatarIllustrationConfig(source);
  assert.notEqual(normalized, source);
  assert.equal(normalized.hair, 'long');
  assert.deepEqual(normalized.accessories, ['cape']);
  assert.deepEqual(source, { hair_style: 'long', accessory: 'cape', accessories: [] });
});

test('normalization keeps unknown values for registry-level fallback', () => {
  const normalized = normalizeAvatarIllustrationConfig({ head: 'future-head', pet_x: 99 });
  assert.equal(normalized.head, 'future-head');
  assert.equal(normalized.pet_x, 99);
  assert.equal(normalized._v, 2);
});
```

Extend `avatarPaint.test.js` with:

```js
test('illustration finishes provide readable outlines for light and dark bases', () => {
  const light = buildAvatarPalette({ head_color: '#ffffff' }).skin;
  const dark = buildAvatarPalette({ head_color: '#000000' }).skin;
  assert.match(light.outline, /^#[0-9a-f]{6}$/);
  assert.match(dark.outline, /^#[0-9a-f]{6}$/);
  assert.notEqual(light.outline, light.base);
  assert.notEqual(dark.outline, dark.base);
  assert.match(light.cheek, /^#[0-9a-f]{6}$/);
});
```

- [ ] **Step 2: Run tests and verify the new exports fail**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarConfig.test.js src/components/avatar/avatarPaint.test.js`  
Expected: FAIL because `avatarConfig.js`, `outline`, and `cheek` do not exist.

- [ ] **Step 3: Implement immutable normalization**

```js
import { DEFAULT_CONFIG } from '../avatar-editor/avatarCatalog.js';

export function normalizeAvatarIllustrationConfig(config = {}) {
  const input = config && typeof config === 'object' ? config : {};
  const legacyAccessories = input.accessory && input.accessory !== 'none' ? [input.accessory] : [];
  const accessories = Array.isArray(input.accessories) && input.accessories.length
    ? input.accessories.filter((item) => item && item !== 'none')
    : legacyAccessories;
  return {
    ...DEFAULT_CONFIG,
    ...input,
    hair: input.hair || input.hair_style || DEFAULT_CONFIG.hair,
    accessories: [...accessories],
  };
}
```

- [ ] **Step 4: Add contrast-safe paint tokens**

Extend `finish(base)` in `avatarPaint.js` so it returns:

```js
const perceivedLightness = (hex) => {
  const value = expandHex(hex).slice(1);
  const [r, g, b] = [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000;
};

function finish(base, { skin = false } = {}) {
  const normalized = expandHex(base);
  const outlineTarget = perceivedLightness(normalized) < 54 ? '#334155' : '#1b1020';
  return {
    base: normalized,
    light: mixHex(normalized, '#ffffff', 0.28),
    highlight: mixHex(normalized, '#ffffff', 0.5),
    shadow: mixHex(normalized, '#000000', 0.25),
    deep: mixHex(normalized, '#000000', 0.42),
    outline: mixHex(normalized, outlineTarget, perceivedLightness(normalized) < 54 ? 0.58 : 0.72),
    ...(skin ? { cheek: mixHex(normalized, '#e97878', 0.34) } : {}),
  };
}
```

Call `finish(value, { skin: true })` only for the skin palette.

- [ ] **Step 5: Run focused and full tests**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarConfig.test.js src/components/avatar/avatarPaint.test.js`  
Expected: all focused tests pass.  
Run: `cd frontend && node --test`  
Expected: all tests pass.

- [ ] **Step 6: Commit compatibility and paint foundations**

```bash
git add frontend/src/components/avatar-illustration/avatarConfig.js frontend/src/components/avatar-illustration/avatarConfig.test.js frontend/src/components/avatar/avatarPaint.js frontend/src/components/avatar/avatarPaint.test.js
git commit -m "feat: add avatar illustration compatibility palette"
```

### Task 3: Create the art-direction reference and SVG compositor shell

**Files:**
- Create: `docs/superpowers/art/avatar-v3-art-direction.png`
- Create: `frontend/src/components/avatar-illustration/avatarLayers.js`
- Create: `frontend/src/components/avatar-illustration/avatarLayers.test.js`
- Create: `frontend/src/components/avatar-illustration/AvatarDefs.jsx`
- Create: `frontend/src/components/avatar-illustration/AvatarArtwork.jsx`
- Create: `frontend/src/components/avatar-illustration/avatarIllustration.css`

**Interfaces:**
- Consumes: geometry, normalized config, and palette from Tasks 1–2.
- Produces: `AVATAR_LAYER_ORDER`, `getAvatarLayerOrder()`, `AvatarDefs`, and `AvatarArtwork`.

- [ ] **Step 1: Generate and inspect the original art-direction sheet**

Use the `imagegen` skill with the attached concept only as a quality/composition reference and this exact prompt:

```text
Create an original character-design sheet for a family chore game called ChoreQuest. Show one friendly full-body chibi child hero in a relaxed asymmetric pose, large expressive brown eyes, detailed layered brown hair, teal hoodie with seams and drawstrings, shorts, socks, and sneakers. Include three views on one dark neutral sheet: full-body hero, head-and-shoulders portrait crop, and small circular icon crop. Polished 2D game illustration, clean dark colored outlines, cel shading, soft top-left key light, subtle rim light, material details, no text, no logos, no UI, no copyrighted characters, transparent or plain charcoal background. The three views must clearly depict the same character and art style.
```

Inspect the generated result at original detail. Reject and regenerate if it lacks full hands/feet, has inconsistent crops, unreadable dark areas, or resembles a named franchise. Save the accepted result to `docs/superpowers/art/avatar-v3-art-direction.png`. This PNG is design documentation only and must never be imported by runtime code.

- [ ] **Step 2: Write the failing layer-order test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_LAYER_ORDER, getAvatarLayerOrder } from './avatarLayers.js';

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
```

- [ ] **Step 3: Run the layer test and verify it fails**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarLayers.test.js`  
Expected: FAIL because the layer modules do not exist.

- [ ] **Step 4: Implement the layer constant and compositor shell**

```js
export const AVATAR_LAYER_ORDER = Object.freeze([
  'rear-effects', 'rear-pet', 'rear-accessories', 'rear-hair', 'legs', 'torso-arms',
  'neck-ears', 'head', 'face', 'front-hair', 'hat', 'front-accessories', 'pet', 'finish',
]);

export function getAvatarLayerOrder() {
  return [...AVATAR_LAYER_ORDER];
}
```

`AvatarArtwork.jsx` must render a semantic `<svg role="img">`, use the selected frame's `viewBox`, render `AvatarDefs`, and include one literal `<g data-avatar-layer="…">` for every layer in the exact tested order. Before the named groups, render the palette background gradient only for `portrait` and `icon`; `full` stays transparent so `AvatarStage` and full option-card wrappers own their scenery. At this stage groups may be empty, because the component is not connected to `AvatarDisplay` until Task 10.

`AvatarArtwork.jsx` must derive a sanitized prefix from `useId()`, build the complete ID map once, pass it to `AvatarDefs`, and pass the corresponding `url(#id)` paints to parts. `AvatarDefs.jsx` receives `{ ids, palette }` and defines skin, hair, outfit, hat, gear, pet, and background gradients plus a modest silhouette shadow. No two SVG instances may reference a fixed global ID.

- [ ] **Step 5: Run tests and production build**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarLayers.test.js`  
Expected: 2 tests pass.  
Run: `cd frontend && npm run build`  
Expected: Vite build succeeds.

- [ ] **Step 6: Commit the reference and compositor shell**

```bash
git add docs/superpowers/art/avatar-v3-art-direction.png frontend/src/components/avatar-illustration/avatarLayers.js frontend/src/components/avatar-illustration/avatarLayers.test.js frontend/src/components/avatar-illustration/AvatarDefs.jsx frontend/src/components/avatar-illustration/AvatarArtwork.jsx frontend/src/components/avatar-illustration/avatarIllustration.css
git commit -m "feat: establish avatar v3 art direction and compositor"
```

### Task 4: Build the full-body base rig and default vertical slice

**Files:**
- Create: `frontend/src/components/avatar-illustration/parts/anatomy.jsx`
- Create: `frontend/src/components/avatar-illustration/parts/heads.jsx`
- Create: `frontend/src/components/avatar-illustration/parts/faces.jsx`
- Create: `frontend/src/components/avatar-illustration/parts/hair.jsx`
- Create: `frontend/src/components/avatar-illustration/parts/outfits.jsx`
- Create: `frontend/src/components/avatar-illustration/registry.js`
- Modify: `frontend/src/components/avatar-illustration/AvatarArtwork.jsx`
- Modify: `frontend/src/components/avatar-illustration/avatarLayers.test.js`

**Interfaces:**
- Produces: `Anatomy`, `HEAD_RENDERERS`, `EYE_RENDERERS`, `MOUTH_RENDERERS`, `FACE_EXTRA_RENDERERS`, `HAIR_RENDERERS`, `BODY_RENDERERS`, and `OUTFIT_PATTERN_RENDERERS`.
- Each hair entry has `{ Rear, Front, marginTop }`; every other registry entry is a React component.
- `registry.js` exports `resolveAvatarPart(registry, id, fallbackId)`.

- [ ] **Step 1: Add a failing structural test for a genuinely full figure**

Append to `avatarLayers.test.js`:

```js
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
```

- [ ] **Step 2: Run the test and confirm the art modules are missing**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarLayers.test.js`  
Expected: FAIL with `ENOENT` for the first missing part file.

- [ ] **Step 3: Implement a complete default anatomy, not a bust**

Use these fixed anchors from the spec: head center `(120,82)`, neck `y=132`, shoulders `y=145`, torso center `(120,188)`, knees `y=246`, and soles `y=292`. `Anatomy` must return named groups in this shape:

```jsx
export function Anatomy({ palette, build = 'regular', section }) {
  const scaleX = build === 'slim' ? 0.9 : build === 'broad' ? 1.12 : 1;
  if (section === 'legs') return (
    <g transform={`translate(120 0) scale(${scaleX} 1) translate(-120 0)`}>
      <path className="avatar-leg-left avatar-outline" d="M88 214 C88 235 90 261 94 278 L114 278 L116 214 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="3" />
      <path className="avatar-leg-right avatar-outline" d="M124 214 L126 278 L146 278 C150 257 152 234 152 214 Z" fill={palette.outfit.shadow} stroke={palette.outfit.outline} strokeWidth="3" />
      <path className="avatar-shoe-left avatar-outline" d="M88 272 C96 268 108 270 116 279 L113 293 H72 C72 282 78 276 88 272 Z" fill={palette.gear.base} stroke={palette.gear.outline} strokeWidth="3" />
      <path className="avatar-shoe-right avatar-outline" d="M128 278 C138 269 151 269 160 275 C168 280 171 286 169 293 H126 Z" fill={palette.gear.base} stroke={palette.gear.outline} strokeWidth="3" />
      <path className="avatar-highlight" d="M80 283 C90 278 101 278 108 282" fill="none" stroke={palette.gear.highlight} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path className="avatar-detail" d="M132 283 C143 278 153 279 161 284" fill="none" stroke={palette.gear.highlight} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  );
  if (section === 'torso-arms') return (
    <g transform={`translate(120 0) scale(${scaleX} 1) translate(-120 0)`}>
      <path className="avatar-outline" d="M78 153 C91 140 105 137 120 137 C139 137 153 143 162 158 L154 220 C135 227 104 227 84 220 Z" fill={palette.outfit.base} stroke={palette.outfit.outline} strokeWidth="3.5" />
      <path className="avatar-outfit-seam" d="M120 142 V218 M91 191 H149" fill="none" stroke={palette.outfit.shadow} strokeWidth="2" opacity="0.7" />
      <path className="avatar-outline" d="M84 153 C68 166 62 188 67 207 C70 218 79 221 87 213 C81 194 88 174 99 161 Z" fill={palette.outfit.base} stroke={palette.outfit.outline} strokeWidth="3" />
      <path className="avatar-outline" d="M151 153 C165 161 171 180 170 201 C169 211 162 219 153 214 C155 194 149 176 141 163 Z" fill={palette.outfit.shadow} stroke={palette.outfit.outline} strokeWidth="3" />
      <ellipse className="avatar-hand-left avatar-outline" cx="74" cy="213" rx="10" ry="12" fill={palette.skin.base} stroke={palette.skin.outline} strokeWidth="3" />
      <ellipse className="avatar-hand-right avatar-outline" cx="161" cy="217" rx="10" ry="12" fill={palette.skin.base} stroke={palette.skin.outline} strokeWidth="3" />
      <path className="avatar-highlight" d="M91 151 C103 145 117 144 128 146" fill="none" stroke={palette.outfit.light} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
    </g>
  );
  return (
    <g>
      <path className="avatar-outline" d="M108 124 H132 L135 151 H105 Z" fill={palette.skin.base} stroke={palette.skin.outline} strokeWidth="3" />
      <ellipse className="avatar-outline" cx="99" cy="83" rx="10" ry="15" fill={palette.skin.base} stroke={palette.skin.outline} strokeWidth="3" />
      <ellipse className="avatar-outline" cx="141" cy="83" rx="10" ry="15" fill={palette.skin.base} stroke={palette.skin.outline} strokeWidth="3" />
    </g>
  );
}
```

- [ ] **Step 4: Implement the default head, face, hair, and outfit surface**

The default vertical slice must use a round head with cheek shading, two multi-part eyes, brows, a modeled nose, smile, rear/front short hair, hoodie pocket, drawstrings, shorts separation, socks, and shoe soles. Use separate elements carrying the tested finish classes. Do not combine the whole character into one opaque path.

Registry defaults are exact:

```jsx
export const HEAD_RENDERERS = Object.freeze({ round: RoundHead });
export const EYE_RENDERERS = Object.freeze({ normal: NormalEyes });
export const MOUTH_RENDERERS = Object.freeze({ smile: SmileMouth });
export const FACE_EXTRA_RENDERERS = Object.freeze({ none: EmptyPart });
export const HAIR_RENDERERS = Object.freeze({
  short: Object.freeze({ Rear: EmptyPart, Front: ShortHairFront, marginTop: 0 }),
  none: Object.freeze({ Rear: EmptyPart, Front: EmptyPart, marginTop: 0 }),
});
export const BODY_RENDERERS = Object.freeze({ regular: RegularOutfit });
export const OUTFIT_PATTERN_RENDERERS = Object.freeze({ none: EmptyPart });
```

`resolveAvatarPart` must be a pure fallback:

```js
export function resolveAvatarPart(registry, id, fallbackId) {
  return registry[id] || registry[fallbackId];
}
```

- [ ] **Step 5: Fill compositor groups with the vertical slice**

Normalize once, build one palette, resolve components once, and place each resolved part inside its literal layer group. The `head`, `face`, and hair components receive `{ config, palette }`; anatomy receives the selected body build and section. Do not create arrays of React elements on every render when a direct JSX group is sufficient.

- [ ] **Step 6: Run the structural test and build**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarLayers.test.js`  
Expected: 3 tests pass.  
Run: `cd frontend && npm run build`  
Expected: build succeeds with the v3 modules included but not yet used publicly.

- [ ] **Step 7: Render the isolated vertical slice and compare with the art sheet**

Temporarily render `AvatarArtwork` from a local browser snippet or a temporary uncommitted dev import. Inspect at 420 px and 76 px. Continue only if the figure has visible hands and feet, reads as one consistent chibi character, retains facial detail at portrait scale, and matches the art-direction sheet's outline/shading hierarchy. Remove the temporary import before committing.

- [ ] **Step 8: Commit the full-body vertical slice**

```bash
git add frontend/src/components/avatar-illustration/AvatarArtwork.jsx frontend/src/components/avatar-illustration/avatarLayers.test.js frontend/src/components/avatar-illustration/parts/anatomy.jsx frontend/src/components/avatar-illustration/parts/heads.jsx frontend/src/components/avatar-illustration/parts/faces.jsx frontend/src/components/avatar-illustration/parts/hair.jsx frontend/src/components/avatar-illustration/parts/outfits.jsx frontend/src/components/avatar-illustration/registry.js
git commit -m "feat: draw full-body avatar vertical slice"
```

### Task 5: Complete head shapes and facial expression families

**Files:**
- Modify: `frontend/src/components/avatar-illustration/parts/heads.jsx`
- Modify: `frontend/src/components/avatar-illustration/parts/faces.jsx`
- Create: `frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js`
- Modify: `frontend/src/components/avatar-illustration/registry.js`

**Interfaces:**
- Produces complete `HEAD_RENDERERS`, `EYE_RENDERERS`, `MOUTH_RENDERERS`, and `FACE_EXTRA_RENDERERS` maps.
- Every renderer accepts `{ config, palette }` and returns one `<g>` or `null` for `none`.

- [ ] **Step 1: Write failing exact-key coverage tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATAR_CATALOG } from '../avatar-editor/avatarCatalog.js';
const ids = (entry) => entry.options.map((option) => option.id).sort();
const registryKeys = (file, exportName) => {
  const source = readFileSync(new URL(file, import.meta.url), 'utf8');
  const match = source.match(new RegExp(`export const ${exportName} = Object\\.freeze\\(\\{([\\s\\S]*?)\\n\\}\\);`));
  assert.ok(match, `missing ${exportName}`);
  return [...match[1].matchAll(/^  ([a-z][a-z0-9_]*):/gm)].map((entry) => entry[1]).sort();
};

test('head and face registries exactly cover the editor catalog', () => {
  assert.deepEqual(registryKeys('./parts/heads.jsx', 'HEAD_RENDERERS'), ids(AVATAR_CATALOG.head));
  assert.deepEqual(registryKeys('./parts/faces.jsx', 'EYE_RENDERERS'), ids(AVATAR_CATALOG.eyes));
  assert.deepEqual(registryKeys('./parts/faces.jsx', 'MOUTH_RENDERERS'), ids(AVATAR_CATALOG.mouth));
  assert.deepEqual(registryKeys('./parts/faces.jsx', 'FACE_EXTRA_RENDERERS'), ids(AVATAR_CATALOG.face));
});
```

Every renderer registry in the part files must place exactly one top-level key on each line with two-space indentation. This is an intentional source-test contract that lets the current Node runner verify JSX registries without importing JSX.

- [ ] **Step 2: Run the coverage test and verify missing keys fail**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: FAIL with a diff listing the missing head or face identifiers.

- [ ] **Step 3: Draw all nine head silhouettes**

Implement these exact semantic differences while preserving the shared center and feature anchors:

| ID | Required silhouette |
|---|---|
| `round` | balanced oval-round default |
| `oval` | narrower cheeks and longer chin |
| `square` | straighter jaw and broader temples |
| `diamond` | narrow forehead/chin, wide cheekbones |
| `heart` | wide upper face and small rounded chin |
| `long` | extended lower face without moving hairline |
| `triangle` | narrow forehead and wider jaw |
| `pear` | soft narrow temples and full lower cheeks |
| `wide` | broad cheeks and shorter vertical profile |

Each shape includes the shared `avatar-outline`, one skin shadow plane, one highlight plane, and cheek zones. Put shape-specific face transforms in exported immutable `HEAD_FEATURE_OFFSETS`, keyed by the same IDs.

- [ ] **Step 4: Draw all eye, mouth, and face-extra IDs**

Preserve these exact families and meanings:

```js
export const EYE_RENDERERS = Object.freeze({
  normal: NormalEyes,
  happy: HappyEyes,
  wide: WideEyes,
  sleepy: SleepyEyes,
  wink: WinkEyes,
  angry: AngryEyes,
  dot: DotEyes,
  star: StarEyes,
  glasses: GlassesEyes,
  sunglasses: SunglassesEyes,
  eye_patch: EyePatchEyes,
  crying: CryingEyes,
  heart_eyes: HeartEyes,
  dizzy: DizzyEyes,
  closed: ClosedEyes,
});

export const MOUTH_RENDERERS = Object.freeze({
  smile: SmileMouth,
  grin: GrinMouth,
  neutral: NeutralMouth,
  open: OpenMouth,
  tongue: TongueMouth,
  frown: FrownMouth,
  surprised: SurprisedMouth,
  smirk: SmirkMouth,
  braces: BracesMouth,
  vampire: VampireMouth,
  whistle: WhistleMouth,
  mask: MaskMouth,
  beard: BeardMouth,
  moustache: MoustacheMouth,
});

export const FACE_EXTRA_RENDERERS = Object.freeze({
  none: EmptyPart,
  freckles: Freckles,
  blush: Blush,
  face_paint: FacePaint,
  scar: Scar,
  bandage: Bandage,
  stickers: Stickers,
  rune_marks: RuneMarks,
  whiskers: Whiskers,
  mischief_mark: MischiefMark,
});
```

Open eyes must contain sclera, iris, pupil, two highlights, upper lid, and brow unless the selected expression intentionally replaces them. Tears, glasses, masks, facial hair, and patches use separate groups so blink animation can target only eligible eye surfaces.

- [ ] **Step 5: Run focused tests and build**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: head and face coverage passes.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.

- [ ] **Step 6: Commit the completed face families**

```bash
git add frontend/src/components/avatar-illustration/parts/heads.jsx frontend/src/components/avatar-illustration/parts/faces.jsx frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js frontend/src/components/avatar-illustration/registry.js
git commit -m "feat: complete avatar head and expression art"
```

### Task 6: Complete all hairstyles and headwear

**Files:**
- Modify: `frontend/src/components/avatar-illustration/parts/hair.jsx`
- Create: `frontend/src/components/avatar-illustration/parts/hats.jsx`
- Modify: `frontend/src/components/avatar-illustration/registry.js`
- Modify: `frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js`

**Interfaces:**
- Produces complete `HAIR_RENDERERS` and `HAT_RENDERERS`.
- Hair entries remain `{ Rear, Front, marginTop }`; hats remain components accepting `{ config, palette }`.

- [ ] **Step 1: Extend the failing coverage test**

```js
test('hair and hat registries exactly cover the editor catalog', () => {
  assert.deepEqual(registryKeys('./parts/hair.jsx', 'HAIR_RENDERERS'), ids(AVATAR_CATALOG.hair));
  assert.deepEqual(registryKeys('./parts/hats.jsx', 'HAT_RENDERERS'), ids(AVATAR_CATALOG.hat));
});
```

- [ ] **Step 2: Run the test and verify missing hair/headwear keys fail**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: FAIL with the missing hair and hat IDs.

- [ ] **Step 3: Draw the complete two-pass hair registry**

The exact registry keys are:

```js
export const HAIR_RENDERERS = Object.freeze({
  none: NONE_HAIR,
  short: SHORT_HAIR,
  long: LONG_HAIR,
  spiky: SPIKY_HAIR,
  curly: CURLY_HAIR,
  mohawk: MOHAWK_HAIR,
  buzz: BUZZ_HAIR,
  ponytail: PONYTAIL_HAIR,
  bun: BUN_HAIR,
  pigtails: PIGTAILS_HAIR,
  afro: AFRO_HAIR,
  braids: BRAIDS_HAIR,
  wavy: WAVY_HAIR,
  side_part: SIDE_PART_HAIR,
  fade: FADE_HAIR,
  dreadlocks: DREADLOCKS_HAIR,
  bob: BOB_HAIR,
  shoulder: SHOULDER_HAIR,
  undercut: UNDERCUT_HAIR,
  twin_buns: TWIN_BUNS_HAIR,
  idol_waves: IDOL_WAVES_HAIR,
});
```

`long`, `ponytail`, `bun`, `pigtails`, `afro`, `braids`, `wavy`, `dreadlocks`, `bob`, `shoulder`, `twin_buns`, and `idol_waves` require visible rear layers. Every non-`none` style requires at least one directional `avatar-hair-strand`, a base mass, a shadow mass at the roots or underside, a highlight following strand direction, and a colored outline. `marginTop` is negative only for shapes exceeding the standard top boundary.

- [ ] **Step 4: Draw all 17 headwear variants**

Use the exact map:

```js
export const HAT_RENDERERS = Object.freeze({
  none: EmptyPart,
  crown: Crown,
  wizard: WizardHat,
  beanie: Beanie,
  cap: Cap,
  pirate: PirateHat,
  headphones: Headphones,
  tiara: Tiara,
  horns: Horns,
  bunny_ears: BunnyEars,
  cat_ears: CatEars,
  halo: Halo,
  viking: VikingHelmet,
  star_headset: StarHeadset,
  hunter_hood: HunterHood,
  kitty_bow_ears: KittyBowEars,
  mischief_hood: MischiefHood,
});
```

Each variant is positioned against the shared skull line, includes its own outline and material highlight, and deliberately covers or reveals the front hair. `hunter_hood` and `mischief_hood` provide a mask/occluder path so hair does not leak through the hood.

- [ ] **Step 5: Inspect the complete hair/headwear grids**

Render the hair category and hat category at the real option-card size. Capture one screenshot containing all 21 hairstyles and one containing all 17 hats. Reject the pass if two variants are distinguishable only by label, if rear hair crosses the face, or if headwear floats above the skull.

- [ ] **Step 6: Run tests and build**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: hair and hat coverage passes.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.

- [ ] **Step 7: Commit hairstyle and headwear art**

```bash
git add frontend/src/components/avatar-illustration/parts/hair.jsx frontend/src/components/avatar-illustration/parts/hats.jsx frontend/src/components/avatar-illustration/registry.js frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js
git commit -m "feat: complete avatar hair and headwear art"
```

### Task 7: Complete body builds, outfit surfaces, and patterns

**Files:**
- Modify: `frontend/src/components/avatar-illustration/parts/anatomy.jsx`
- Modify: `frontend/src/components/avatar-illustration/parts/outfits.jsx`
- Modify: `frontend/src/components/avatar-illustration/registry.js`
- Modify: `frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js`

**Interfaces:**
- Produces `BODY_RENDERERS` with `slim`, `regular`, and `broad` components.
- Produces `OUTFIT_PATTERN_RENDERERS` with ten pattern components that receive `{ patternId, palette, clipId }` and never paint outside the outfit clip.

- [ ] **Step 1: Add failing body and pattern coverage assertions**

```js
test('body and outfit-pattern registries exactly cover the editor catalog', () => {
  assert.deepEqual(registryKeys('./parts/outfits.jsx', 'BODY_RENDERERS'), ids(AVATAR_CATALOG.body));
  assert.deepEqual(registryKeys('./parts/outfits.jsx', 'OUTFIT_PATTERN_RENDERERS'), ids(AVATAR_CATALOG.pattern));
});
```

- [ ] **Step 2: Run the test and verify missing keys fail**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: FAIL for `slim`, `broad`, and the missing pattern IDs.

- [ ] **Step 3: Finish the three body rigs**

Keep the head, neck, soles, and pet anchors fixed. Apply these width ratios to torso/arms/legs: `slim=0.90`, `regular=1.00`, `broad=1.12`. Do not use one global scale for the head or hands. Each build must keep two legs, two shoes, two arms, and two hands visible, while changing shoulder, torso, and stance width.

- [ ] **Step 4: Draw and clip every outfit pattern**

Use the exact registry:

```js
export const OUTFIT_PATTERN_RENDERERS = Object.freeze({
  none: EmptyPart,
  stripes: StripesPattern,
  stars: StarsPattern,
  camo: CamoPattern,
  tie_dye: TieDyePattern,
  plaid: PlaidPattern,
  neon_pulse: NeonPulsePattern,
  moon_sigil: MoonSigilPattern,
  tiny_bows: TinyBowsPattern,
  bat_stars: BatStarsPattern,
});
```

Every non-`none` component renders inside `clipPath id={clipId}`. Preserve seams, zipper/drawstrings, pocket, cuffs, shorts boundary, sock details, laces, and soles above the pattern layer. Themed patterns must remain original safe motifs already defined by the catalog.

- [ ] **Step 5: Inspect all builds with light and dark color extremes**

Render `slim`, `regular`, and `broad` using `#ecf0f1` and `#1a1a2e` outfits. Confirm limbs do not detach, seams remain visible, and outline contrast survives both extremes. Then inspect the ten-pattern grid in `full` crop.

- [ ] **Step 6: Run focused tests and build**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js src/components/avatar/avatarPaint.test.js`  
Expected: all focused tests pass.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.

- [ ] **Step 7: Commit body and outfit art**

```bash
git add frontend/src/components/avatar-illustration/parts/anatomy.jsx frontend/src/components/avatar-illustration/parts/outfits.jsx frontend/src/components/avatar-illustration/registry.js frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js
git commit -m "feat: complete avatar body and outfit art"
```

### Task 8: Complete equipment and multi-accessory layering

**Files:**
- Create: `frontend/src/components/avatar-illustration/parts/accessories.jsx`
- Modify: `frontend/src/components/avatar-illustration/registry.js`
- Modify: `frontend/src/components/avatar-illustration/AvatarArtwork.jsx`
- Modify: `frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js`

**Interfaces:**
- Produces `ACCESSORY_RENDERERS`; every entry contains `{ layer: 'rear' | 'front', Component }`.
- Compositor consumes the normalized `accessories` array and renders each item exactly once in its declared layer.

- [ ] **Step 1: Add failing registry and placement tests**

```js
test('equipment registry exactly covers the catalog and declares a layer', () => {
  assert.deepEqual(registryKeys('./parts/accessories.jsx', 'ACCESSORY_RENDERERS'), ids(AVATAR_CATALOG.accessory));
  const source = readFileSync(new URL('./parts/accessories.jsx', import.meta.url), 'utf8');
  assert.equal((source.match(/layer: '(?:rear|front)'/g) || []).length, AVATAR_CATALOG.accessory.options.length);
});
```

Add a source assertion that `AvatarArtwork.jsx` filters on `entry.layer === 'rear'` and `entry.layer === 'front'`, with the rear expression appearing first.

- [ ] **Step 2: Run the coverage test and verify it fails**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: FAIL because `ACCESSORY_RENDERERS` is missing.

- [ ] **Step 3: Draw and classify all equipment**

```js
export const ACCESSORY_RENDERERS = Object.freeze({
  scarf: Object.freeze({ layer: 'front', Component: Scarf }),
  necklace: Object.freeze({ layer: 'front', Component: Necklace }),
  bow_tie: Object.freeze({ layer: 'front', Component: BowTie }),
  cape: Object.freeze({ layer: 'rear', Component: Cape }),
  wings: Object.freeze({ layer: 'rear', Component: Wings }),
  shield: Object.freeze({ layer: 'front', Component: Shield }),
  sword: Object.freeze({ layer: 'rear', Component: Sword }),
  stage_mic: Object.freeze({ layer: 'front', Component: StageMic }),
  spirit_blade: Object.freeze({ layer: 'rear', Component: SpiritBlade }),
  bell_collar: Object.freeze({ layer: 'front', Component: BellCollar }),
});
```

Each component must use the gear palette, colored outline, highlight, and at least one material detail. Rear equipment may exceed the standard silhouette but must remain inside the `full` frame. Front equipment must not cover both eyes or the save controls.

- [ ] **Step 4: Render deterministic multi-accessory stacks**

Resolve entries in the saved array order, filter invalid/`none` IDs, and render rear then front groups without mutating or sorting `config.accessories`. Use a stable key `${id}-${index}` so duplicate legacy values do not crash React.

- [ ] **Step 5: Test and visually inspect dense combinations**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js src/components/avatar-editor/avatarEditorState.test.js`  
Expected: all tests pass.  
Inspect `cape + wings + shield + stage_mic`; confirm every item is visible enough to recognize and the face remains unobscured.

- [ ] **Step 6: Commit equipment art**

```bash
git add frontend/src/components/avatar-illustration/parts/accessories.jsx frontend/src/components/avatar-illustration/registry.js frontend/src/components/avatar-illustration/AvatarArtwork.jsx frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js
git commit -m "feat: complete avatar equipment layering"
```

### Task 9: Redraw pets, pet accessories, and level effects

**Files:**
- Create: `frontend/src/components/avatar-illustration/parts/pets.jsx`
- Modify: `frontend/src/components/avatar-illustration/registry.js`
- Modify: `frontend/src/components/avatar-illustration/AvatarArtwork.jsx`
- Modify: `frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js`
- Modify: `frontend/src/components/avatar-editor/PetCustomizer.jsx`
- Modify: `frontend/src/components/avatar-editor/avatarPetCatalog.js`
- Modify: `frontend/src/components/avatar-editor/avatarPetCatalog.test.js`

**Interfaces:**
- Produces `PET_RENDERERS`, `PET_ACCESSORY_RENDERERS`, and `PetArtwork` from `parts/pets.jsx`.
- Produces pure `buildPetColors(config)` and `getPetLevelInfo(petXp)` from `avatarPetCatalog.js`.
- `PetArtwork` accepts `{ config, position, level, compact }` and is shared by the main compositor and the level rail.

- [ ] **Step 1: Add failing pet coverage and compatibility tests**

```js
import { PET_OPTIONS, PET_ACCESSORY_OPTIONS } from '../avatar-editor/avatarPetCatalog.js';
test('pet registries exactly cover pet catalogs', () => {
  assert.deepEqual(registryKeys('./parts/pets.jsx', 'PET_RENDERERS'), PET_OPTIONS.map((option) => option.id).sort());
  assert.deepEqual(registryKeys('./parts/pets.jsx', 'PET_ACCESSORY_RENDERERS'), PET_ACCESSORY_OPTIONS.map((option) => option.id).sort());
});
```

Extend `avatarPetCatalog.test.js` to assert `getPetLevelInfo` at XP `0, 50, 150, 350, 700, 1200, 2000, 3500`, and assert `buildPetColors` respects body, ears, tail, and accent overrides without mutating the config.

- [ ] **Step 2: Run the tests and verify missing pet exports fail**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js`  
Expected: FAIL because the v3 pet registries do not exist.

- [ ] **Step 3: Draw the six pet species and explicit none state**

```js
export const PET_RENDERERS = Object.freeze({
  none: EmptyPart,
  cat: CatPet,
  dog: DogPet,
  dragon: DragonPet,
  owl: OwlPet,
  bunny: BunnyPet,
  phoenix: PhoenixPet,
});

export const PET_ACCESSORY_RENDERERS = Object.freeze({
  none: EmptyPart,
  crown: PetCrown,
  party_hat: PetPartyHat,
  bow: PetBow,
  bandana: PetBandana,
  halo: PetHalo,
  flower: PetFlower,
});
```

Each species must have a recognizable silhouette, two modeled eyes, colored outline, body shadow, highlight, separate ear/tail/accent surfaces where anatomically applicable, and consistent foot contact. Dragon and phoenix may be larger but use the same position anchor.

- [ ] **Step 4: Preserve levels, custom positioning, and effects**

Move the existing `buildPetColors` logic from legacy `avatar/pets.jsx` into `avatarPetCatalog.js`, then use it from both the new art and editor. Use `mapLegacyPetPoint` for custom positions. For named positions use fixed full-canvas anchors: `left=(40,252)`, `right=(200,252)`, `head=(120,36)`. Preserve level thresholds and scale from `1.00` at level 1 through `1.28` at level 8. Map existing effects exactly: level 2 aura, level 3 gem/collar detail, level 4 eye shine, level 5 sparkles, level 6 shimmer, level 7 glow, level 8 gold sparkles. Placement mode must disable pet and figure motion.

- [ ] **Step 5: Replace the pet-level rail's legacy renderer**

Remove imports from `../avatar/pets` in `PetCustomizer.jsx`. Replace `PetPreviewSvg` internals with:

```jsx
function PetPreview({ config, level }) {
  return (
    <PetArtwork
      config={{ ...config, pet_xp: PET_LEVEL_THRESHOLDS[level - 1], pet_xp_map: {} }}
      position="right"
      level={level}
      compact
    />
  );
}
```

Keep the existing tab, XP, reset, and accessibility behavior unchanged.

- [ ] **Step 6: Run pet and editor tests**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarCatalogCoverage.test.js src/components/avatar-editor/avatarPetCatalog.test.js src/components/avatar-editor/petTabNavigation.test.js`  
Expected: all tests pass.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.

- [ ] **Step 7: Inspect all pets at levels 1 and 8**

Capture one grid with all six pets at level 1 and one at level 8. Confirm custom colors remain visible, level effects do not cover faces, and the head position does not collide with tall hats.

- [ ] **Step 8: Commit pet artwork**

```bash
git add frontend/src/components/avatar-illustration/parts/pets.jsx frontend/src/components/avatar-illustration/registry.js frontend/src/components/avatar-illustration/AvatarArtwork.jsx frontend/src/components/avatar-illustration/avatarCatalogCoverage.test.js frontend/src/components/avatar-editor/PetCustomizer.jsx frontend/src/components/avatar-editor/avatarPetCatalog.js frontend/src/components/avatar-editor/avatarPetCatalog.test.js
git commit -m "feat: redraw avatar pets and progression effects"
```

### Task 10: Switch the application to the v3 renderer and crop-aware cards

**Files:**
- Modify: `frontend/src/components/AvatarDisplay.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarStage.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarOptionControls.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx`
- Modify: `frontend/src/components/avatar-editor/PetCustomizer.jsx`
- Modify: `frontend/src/components/avatar-editor/avatarEditor.css`
- Modify: `frontend/src/App.css`

**Interfaces:**
- `AvatarDisplay({ config, size='md', name='', animate=false, crop })` remains backward compatible.
- `AvatarOptionCard` adds required `category` and derives its crop with `getAvatarOptionCrop(category)`.
- `AvatarStage` explicitly calls `<AvatarDisplay size="studio" crop="full" />`.
- `AvatarStage` and option-card wrappers derive their backdrop from `config.bg_color`; the transparent full-body SVG never owns stage scenery.

- [ ] **Step 1: Add failing source-contract assertions**

Extend `avatarArtworkStructure.test.js` with:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = (relative) => readFileSync(new URL(relative, import.meta.url), 'utf8');

test('public display delegates to v3 and stage requests a full crop', () => {
  assert.match(source('../AvatarDisplay.jsx'), /from '.\/avatar-illustration\/AvatarArtwork'/);
  assert.match(source('../avatar-editor/AvatarStage.jsx'), /crop="full"/);
});

test('option cards choose crops by editor category', () => {
  assert.match(source('../avatar-editor/AvatarOptionControls.jsx'), /getAvatarOptionCrop\(category\)/);
  assert.match(source('../avatar-editor/AvatarOptionsPanel.jsx'), /category=/);
});

test('full artwork is not circularly clipped', () => {
  const display = source('../AvatarDisplay.jsx');
  assert.match(display, /crop === 'full'/);
  assert.doesNotMatch(display, /crop === 'full'[^;]+overflow-hidden/s);
});
```

- [ ] **Step 2: Run the structural test and verify integration is absent**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarArtworkStructure.test.js`  
Expected: FAIL because `AvatarDisplay` still imports the legacy `./avatar` renderer.

- [ ] **Step 3: Replace `SvgAvatar` with `AvatarArtwork`**

Preserve the fallback initials path. For real configurations:

```jsx
const SIZE_VALUES = { xs: 24, sm: 32, md: 64, option: 76, lg: 128, xl: 176, studio: 420 };

export default function AvatarDisplay({ config, size = 'md', name = '', animate = false, crop }) {
  const px = typeof size === 'number' ? size : (SIZE_VALUES[size] || SIZE_VALUES.md);
  const effectiveCrop = crop || (size === 'studio' ? 'full' : size === 'option' ? 'portrait' : 'icon');
  const dimensions = getAvatarRenderDimensions(px, effectiveCrop);
  if (config && typeof config === 'object' && Object.keys(config).length > 0) {
    return (
      <div
        className={`avatar-display avatar-display--${effectiveCrop}${animate ? ' avatar-idle' : ''}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <AvatarArtwork config={config} crop={effectiveCrop} animate={animate} />
      </div>
    );
  }
  return renderInitialsFallback({ name, px });
}
```

Keep the deterministic animation delay on the wrapper and keep the current initials fallback inline and behaviorally unchanged.

- [ ] **Step 4: Pass explicit category context to cards**

Add `category` to `AvatarOptionCard`. Render:

```jsx
const crop = getAvatarOptionCrop(category);
<span
  className={`avatar-option-card__preview is-${crop}`}
  style={{ '--avatar-preview-bg': previewConfig.bg_color || '#1a1a2e' }}
>
  <AvatarDisplay config={previewConfig} size="option" crop={crop} />
</span>
```

`AvatarOptionsPanel` passes the editor category, not the persisted config key: head, hair, eyes, mouth, body, pattern, hat, face, accessory. `PetCustomizer` passes `pet` for pet, position, and pet-accessory cards. The option-card preview background uses a radial gradient derived from `--avatar-preview-bg`, so `background` cards visibly differ even though full artwork is transparent.

- [ ] **Step 5: Fit the 3:4 stage without breaking mobile placement**

Set `--avatar-stage-bg: config.bg_color || '#1a1a2e'` on `AvatarStage`. Use it in the stage's radial background and spotlight while keeping the SVG transparent in `full`. Update stage CSS so the desktop character height is `min(72vh, 620px)` with derived width, and mobile height is `clamp(230px, 29dvh, 270px)`. Remove square `aspect-ratio: 1` from the full character container. Keep the placement overlay absolutely inset over the exact `AvatarArtwork` box, not the whole stage. Full-card previews use a 3:4 internal box; portrait cards remain square.

- [ ] **Step 6: Run integration, placement, accessibility, and full tests**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarArtworkStructure.test.js src/components/avatar-editor/avatarStagePlacement.test.js src/components/avatar-editor/avatarInteractionA11y.test.js src/components/avatar-editor/avatarEditorStructure.test.js`  
Expected: all focused tests pass.  
Run: `cd frontend && node --test`  
Expected: all tests pass.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.

- [ ] **Step 7: Commit public integration**

```bash
git add frontend/src/components/AvatarDisplay.jsx frontend/src/components/avatar-editor/AvatarStage.jsx frontend/src/components/avatar-editor/AvatarOptionControls.jsx frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx frontend/src/components/avatar-editor/PetCustomizer.jsx frontend/src/components/avatar-editor/avatarEditor.css frontend/src/App.css frontend/src/components/avatar-illustration/avatarArtworkStructure.test.js
git commit -m "feat: integrate full-body avatar renderer"
```

### Task 11: Finish motion, performance guards, and retire legacy art

**Files:**
- Modify: `frontend/src/components/avatar-illustration/avatarIllustration.css`
- Modify: `frontend/src/components/avatar-illustration/AvatarArtwork.jsx`
- Modify: `frontend/src/components/avatar-illustration/avatarArtworkStructure.test.js`
- Modify: `frontend/src/components/avatar/avatarArtwork.test.js`
- Delete: legacy drawing files listed in File Structure.

**Interfaces:**
- Adds stable class hooks: `.avatar-figure-breath`, `.avatar-eyelids`, `.avatar-hair-secondary`, `.avatar-selection-flash`, `.avatar-pet-motion`.
- Adds `data-avatar-motion="on|off"` and `data-avatar-detail="full|compact"` on the root SVG.

- [ ] **Step 1: Add failing animation and legacy-import guards**

```js
test('illustration exposes transform-only motion and reduced-motion fallback', () => {
  const css = source('./avatarIllustration.css');
  assert.match(css, /@keyframes avatar-figure-breathe/);
  assert.match(css, /@keyframes avatar-eyelid-blink/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /@keyframes[^}]+(?:top|left|width|height):/s);
});

test('runtime source no longer imports legacy drawing modules', () => {
  const display = source('../AvatarDisplay.jsx');
  const pet = source('../avatar-editor/PetCustomizer.jsx');
  assert.doesNotMatch(display, /from '.\/avatar'/);
  assert.doesNotMatch(pet, /avatar\/pets/);
});
```

- [ ] **Step 2: Run the test and verify motion hooks are absent**

Run: `cd frontend && node --test src/components/avatar-illustration/avatarArtworkStructure.test.js`  
Expected: FAIL for missing keyframes or legacy import.

- [ ] **Step 3: Implement low-amplitude figure motion**

Use only `transform` and `opacity` in new keyframes. Breathing is at most `translateY(-1.5px) scaleY(1.006)`, hair secondary motion at most `rotate(0.7deg)`, and pet motion at most `translateY(-2px) rotate(1deg)`. Blink duration is 140 ms within a 6–9 second deterministic cycle. Placement mode sets `data-avatar-motion="off"`; reduced-motion makes every animated group use `animation: none !important` and `transform: none !important`.

- [ ] **Step 4: Add compact-detail behavior without losing identity**

In `icon`, omit only scene-like sparkles, fine fabric micro-details, and expensive blur filters. Keep silhouette, hair style, headwear, face expression, outfit color, and identity accessories. `portrait` keeps facial and hair details but omits feet-only detail. Implement this through `data-avatar-detail` selectors and conditional finish groups, not a second artwork tree.

- [ ] **Step 5: Point artwork tests at v3 and delete unused renderers**

Update `avatar/avatarArtwork.test.js` so `artworkFiles` contains the seven v3 `parts/*.jsx` files and asserts `avatar-(highlight|outline|detail)` in every family. Keep the historical ID assertion, but import/read `avatarCatalog.js` instead of `AvatarEditor.jsx`. Delete `avatar/index.js` and the nine old drawing modules only after `rg` returns no runtime imports.

- [ ] **Step 6: Run all tests, build, and inspect bundle output**

Run: `cd frontend && node --test`  
Expected: all tests pass.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.  
Run: `rg -n "avatar/(heads|eyes|mouths|faceExtras|hair|bodies|hats|accessories|pets)|from './avatar'" frontend/src`  
Expected: no runtime matches; test documentation strings are allowed only if intentional.

- [ ] **Step 7: Commit motion and legacy cleanup**

```bash
git add -A frontend/src/components/avatar frontend/src/components/avatar-illustration frontend/src/components/AvatarDisplay.jsx frontend/src/components/avatar-editor/PetCustomizer.jsx
git commit -m "refactor: finish avatar motion and remove legacy art"
```

### Task 12: Perform browser QA and publish the verified build to static

**Files:**
- Create: `frontend/scripts/publish-static.mjs`
- Create: `frontend/scripts/publish-static.test.js`
- Modify: `frontend/package.json`
- Modify as QA requires: `frontend/src/components/avatar-illustration/*.jsx`
- Modify as QA requires: `frontend/src/components/avatar-illustration/parts/*.jsx`
- Modify as QA requires: `frontend/src/components/avatar-illustration/avatarIllustration.css`
- Modify as QA requires: `frontend/src/components/avatar-editor/avatarEditor.css`
- Replace: `static/**`

**Interfaces:**
- Produces: `publishStatic({ sourceDir, targetDir })` and a cross-platform `npm run deploy`.
- Produces final visual artifacts for desktop, mobile, crop comparison, hair grid, hat grid, pets, color extremes, and placement mode.

- [ ] **Step 1: Write a failing isolated publisher test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publishStatic } from './publish-static.mjs';

test('publisher replaces stale static files with the exact dist tree', async () => {
  const root = await mkdtemp(join(tmpdir(), 'chorequest-static-'));
  const sourceDir = join(root, 'dist');
  const targetDir = join(root, 'static');
  await mkdir(join(sourceDir, 'assets'), { recursive: true });
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(sourceDir, 'index.html'), '<script src="/assets/new.js"></script>');
  await writeFile(join(sourceDir, 'assets', 'new.js'), 'new-build');
  await writeFile(join(targetDir, 'stale.js'), 'stale-build');
  await publishStatic({ sourceDir, targetDir });
  assert.equal(await readFile(join(targetDir, 'assets', 'new.js'), 'utf8'), 'new-build');
  await assert.rejects(readFile(join(targetDir, 'stale.js'), 'utf8'));
});
```

- [ ] **Step 2: Run the publisher test and verify the module is missing**

Run: `cd frontend && node --test scripts/publish-static.test.js`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement cross-platform publication**

```js
import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function publishStatic({ sourceDir, targetDir }) {
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  await cp(sourceDir, targetDir, { recursive: true, force: true });
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === resolve(scriptPath)) {
  const frontendDir = resolve(dirname(scriptPath), '..');
  await publishStatic({
    sourceDir: resolve(frontendDir, 'dist'),
    targetDir: resolve(frontendDir, '..', 'static'),
  });
}
```

Set the package script exactly to:

```json
"deploy": "vite build && node scripts/publish-static.mjs"
```

- [ ] **Step 4: Run automated verification before browser QA**

Run: `cd frontend && node --test`  
Expected: all frontend tests pass.  
Run: `$env:SECRET_KEY='codex-test-secret-key-not-for-production'; python -m unittest discover backend/tests` from the repository root.  
Expected: 38 tests pass.  
Run: `cd frontend && npm run build`  
Expected: Vite build succeeds.

- [ ] **Step 5: Start the real application and perform desktop QA**

Use the frontend debugging/browser skill against the actual Hero Studio at `1440 × 900`. Exercise save-safe local edits or a disposable test user. Capture:

1. default full-body hero with hair category open;
2. all 21 hair cards;
3. all 17 hat cards;
4. `slim`, `regular`, and `broad` bodies;
5. dark skin + dark hair + dark background;
6. light skin + light hair + light outfit;
7. multiple accessories and a pet;
8. locked preview and selected state;
9. custom pet placement.

Inspect console errors after every category sweep. Any clipping, floating layer, missing identifier, unreadable face, disconnected limb, or console error is a blocking defect and is fixed before proceeding.

- [ ] **Step 6: Perform mobile and crop-consistency QA**

At `390 × 844`, capture the default studio, a full-crop option grid, a portrait grid, and pet placement. Confirm toolbar actions remain reachable, the full figure fits without circular clipping, the category rail scrolls, cards have at least 44 px targets, and no horizontal page overflow appears. Compare `full`, `portrait`, and `icon` for the same config side by side; they must depict the same hair, face, hat, colors, and identity details.

- [ ] **Step 7: Apply visual fixes and repeat the complete focused QA set**

For every visual issue, add or strengthen a structural/pure regression test where feasible, make the smallest artwork/CSS fix, rerun that test, rebuild, and recapture the affected screenshot. Do not weaken the approved 3:4 full-body contract or hide a broken part by changing its card to a portrait crop.

- [ ] **Step 8: Publish once and prove `dist` equals `static`**

Run: `cd frontend && npm run deploy`  
Expected: Vite build succeeds and publication exits 0.  
Run from repository root:

```powershell
function Get-TreeHashes([string]$root) {
  $resolved = (Resolve-Path $root).Path
  Get-ChildItem $resolved -Recurse -File | ForEach-Object {
    [pscustomobject]@{
      Path = $_.FullName.Substring($resolved.Length)
      Hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash
    }
  } | Sort-Object Path
}
Compare-Object (Get-TreeHashes 'frontend/dist') (Get-TreeHashes 'static') -Property Path,Hash
```

Expected: no output; this proves both file paths and every SHA-256 hash match.

- [ ] **Step 9: Verify the FastAPI-served bundle, not only Vite**

Start FastAPI with the test environment, open the served application, revisit Hero Studio, and confirm the loaded hashed asset names match `static/index.html`. Capture one final 1440 × 900 and one final 390 × 844 screenshot from the FastAPI-served app.

- [ ] **Step 10: Run final verification and commit the shipped bundle**

Run: `cd frontend && node --test`  
Expected: all frontend tests pass.  
Run: `$env:SECRET_KEY='codex-test-secret-key-not-for-production'; python -m unittest discover backend/tests`  
Expected: 38 tests pass.  
Run: `cd frontend && npm run build`  
Expected: build succeeds.  
Run: `git diff --check`  
Expected: no output.

```bash
git add frontend/package.json frontend/scripts frontend/src static
git commit -m "build: publish illustrated avatar studio"
```

## Completion Evidence

Before claiming completion, provide:

- the final frontend and backend test counts;
- the production build result;
- proof that `frontend/dist` and `static` contain the same file tree and matching `index.html` hash;
- paths to final desktop and mobile screenshots from the FastAPI-served application;
- paths to the hair, hat, pet, color-extreme, and crop-comparison screenshots;
- confirmation that every catalog-to-registry coverage test passed;
- the final branch status and commit list.
