# Avatar Hero Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat avatar settings screen with a game-style, Create-a-Sim-inspired Hero Studio that uses a dominant live avatar stage, visual option thumbnails, responsive controls, undo/randomise actions, and safe saving without changing the backend avatar format.

**Architecture:** Keep `AvatarEditor` as the session/state orchestrator and move focused UI concerns into `components/avatar-editor/`. Put history, dirty-state, preview, toggle, and randomisation rules in a pure JavaScript model with Node tests. Keep the existing `PUT /api/avatar`, SVG renderers, lock endpoint, avatar catalog, pet XP schema, and Polish runtime overlay.

**Tech Stack:** React 18, React Router 6, Framer Motion 11, Lucide React, Tailwind CSS 4 plus a focused CSS module-like stylesheet, Node `node:test`, Vite 6.

## Global Constraints

- Preserve the current `avatar_config` schema and `PUT /api/avatar` contract.
- Preserve all 13 existing editor categories in their current order.
- Preserve locked-item preview, multi-accessory selection, pet XP/levels, pet part colours, pet accessories, and custom pet placement.
- Randomisation may use only default or unlocked items and must not change pet type, pet XP, pet position, or pet detail colours.
- Keep at most 30 undo snapshots; previews never enter history.
- Use existing Lucide icons and existing SVG avatar renderers; do not add a UI component dependency.
- Use 44 × 44 px minimum touch targets on mobile.
- Support `prefers-reduced-motion`, visible keyboard focus, accessible names, `aria-current`, and `aria-pressed`.
- Keep English source copy compatible with the Polish runtime overlay and update both maintained overlay copies.
- Validate desktop at 1440 × 900 and mobile at 390 × 844.
- Before Task 1, invoke `build-web-apps:frontend-app-builder`, `imagegen`, and `build-web-apps:react-best-practices`. Generate one complete desktop concept and one mobile concept from the approved design spec, show them to the user, and treat the approved images as the fidelity target.
- Before declaring completion, invoke `build-web-apps:frontend-testing-debugging` and `superpowers:verification-before-completion`.

## File Structure

- `frontend/src/components/AvatarEditor.jsx`: session state, lock fetching, history, dirty guard, save, and top-level composition only.
- `frontend/src/components/AvatarDisplay.jsx`: add explicit `option` and `studio` render sizes.
- `frontend/src/components/avatar-editor/avatarEditorState.js`: pure immutable configuration, history, dirty, preview, accessory, and randomisation helpers.
- `frontend/src/components/avatar-editor/avatarEditorState.test.js`: deterministic model tests.
- `frontend/src/components/avatar-editor/AvatarEditorToolbar.jsx`: back, title, randomise, undo, save, and status.
- `frontend/src/components/avatar-editor/AvatarDiscardDialog.jsx`: accessible in-app confirmation for leaving with unsaved changes.
- `frontend/src/components/avatar-editor/AvatarCategoryRail.jsx`: desktop rail and mobile horizontal category navigation.
- `frontend/src/components/avatar-editor/AvatarOptionControls.jsx`: option grid/card and colour palette primitives.
- `frontend/src/components/avatar-editor/AvatarStage.jsx`: dominant live preview and custom pet placement overlay.
- `frontend/src/components/avatar-editor/PetCustomizer.jsx`: pet picker, XP presentation, segmented pet sections, colours, placement, and accessory.
- `frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx`: category-to-controls mapping and multi-accessory behavior.
- `frontend/src/components/avatar-editor/avatarEditorStructure.test.js`: source-level semantic and decomposition invariants for JSX that has no component-test harness.
- `frontend/src/components/avatar-editor/avatarEditor.css`: scoped desktop/mobile layout, stage, cards, focus, and reduced-motion rules.
- `frontend/src/utils/polishOverlayTranslations.test.js`: translation coverage for new visible copy.
- `polish_translation/pl-runtime.js`: canonical Polish overlay entries.
- `frontend/public/local-overrides/pl-runtime.js`: frontend runtime copy kept byte-for-byte aligned with the canonical overlay.

---

## Visual Preflight Gate

- [ ] Invoke `imagegen` through `build-web-apps:frontend-app-builder` and generate a complete 1440 × 900 desktop concept using this exact brief:

```text
Create a polished dark game character creator UI for ChoreQuest called “Hero Studio”. This is an original interface inspired by the interaction model of life-simulation character creators, not by any protected branding or exact game UI. Full 1440×900 product screen. Top toolbar: back, Hero Studio title, subtle unsaved status, Randomise, Undo, prominent teal Save. Left 84px vertical rail with 13 consistent outline icons and short labels. Center is the dominant area: one large friendly flat-vector SVG-style child hero avatar, circular crop, subtle idle pose, soft teal spotlight and a restrained dark plinth. Right 420px options panel: “Style the hair”, one-sentence help, three-column grid of visual avatar thumbnail cards, selected card with crisp teal outline and check, one locked card with amber lock and a short requirement, then a clean colour swatch section. Dark graphite surfaces, active theme teal, readable system typography, modest 8–12px radii, high contrast, sparse purposeful depth, no marketing hero, no fake metrics, no bento layout, no excessive pills, no decorative badge above title. Every UI label and control must be code-native in implementation. Show the complete editor surface with professional spacing and no dead space.
```

- [ ] Generate a coordinated 390 × 844 mobile concept using this exact brief:

```text
Create the mobile companion screen for the approved ChoreQuest Hero Studio design at 390×844. Preserve the exact dark graphite and teal design system. Compact top toolbar with back, title, Undo icon, and teal Save. A permanently visible 260–290px avatar stage with the same large friendly hero, spotlight, and plinth. Directly below it, one horizontally scrolling 68px icon category rail with 44px touch targets. The lower area is a scrollable options panel with “Style the hair”, help text, three compact visual thumbnail cards per row, clear selected and locked states, and 44px colour swatches. No horizontal overflow, no clipped actions, no nested modal, no tiny text, no extra mobile navigation, no marketing content.
```

- [ ] Show both concepts to the user and pause for approval. Save or retain their local output paths for the Task 7 fidelity comparison. If the user requests visual changes, regenerate both coordinated concepts before coding; do not reinterpret the approved text spec during implementation.

---

### Task 1: Build the pure avatar editor session model

**Files:**
- Create: `frontend/src/components/avatar-editor/avatarEditorState.js`
- Create: `frontend/src/components/avatar-editor/avatarEditorState.test.js`

**Interfaces:**
- Produces: `cloneAvatarConfig(config) -> object`
- Produces: `configsEqual(left, right) -> boolean`
- Produces: `applyAvatarChange(config, key, value) -> object`
- Produces: `pushAvatarHistory(history, config, limit = 30) -> object[]`
- Produces: `undoAvatarChange(history, currentConfig) -> { history, config }`
- Produces: `buildDisplayConfig(config, preview) -> object`
- Produces: `toggleAvatarAccessory(config, itemId) -> object`
- Produces: `randomiseAvatarConfig(config, recipe, lockedByCategory, random) -> object`
- Consumes: plain avatar configuration objects, option arrays, colour arrays, and lock sets.

- [ ] **Step 1: Write failing model tests**

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  applyAvatarChange,
  buildDisplayConfig,
  configsEqual,
  pushAvatarHistory,
  randomiseAvatarConfig,
  toggleAvatarAccessory,
  undoAvatarChange,
} from './avatarEditorState.js';

test('history is immutable, capped at 30 snapshots, and undo returns the latest snapshot', () => {
  let history = [];
  let config = { head: 'round', accessories: [] };
  for (let index = 0; index < 35; index += 1) {
    history = pushAvatarHistory(history, config);
    config = { ...config, head: `head-${index}` };
  }
  assert.equal(history.length, 30);
  const undone = undoAvatarChange(history, config);
  assert.equal(undone.config.head, 'head-33');
  assert.equal(undone.history.length, 29);
});

test('pet changes refresh legacy pet_xp without mutating pet_xp_map', () => {
  const original = { pet: 'cat', pet_xp: 10, pet_xp_map: { cat: 10, dog: 42 } };
  const changed = applyAvatarChange(original, 'pet', 'dog');
  assert.deepEqual(changed, { pet: 'dog', pet_xp: 42, pet_xp_map: { cat: 10, dog: 42 } });
  assert.equal(original.pet, 'cat');
});

test('preview and accessory helpers do not mutate the saved session config', () => {
  const original = { hair: 'short', accessory: 'none', accessories: [] };
  assert.deepEqual(buildDisplayConfig(original, { key: 'hair', value: 'long' }), {
    hair: 'long', accessory: 'none', accessories: [],
  });
  assert.deepEqual(toggleAvatarAccessory(original, 'cape'), {
    hair: 'short', accessory: 'cape', accessories: ['cape'],
  });
  assert.deepEqual(buildDisplayConfig({ ...original, accessory: 'cape', accessories: ['cape'] }, { key: 'accessory', value: 'shield' }), {
    hair: 'short', accessory: 'shield', accessories: ['cape', 'shield'],
  });
  assert.deepEqual(original.accessories, []);
});

test('randomise excludes locked choices and preserves pet identity and progression', () => {
  const config = {
    head: 'round', hair: 'short', head_color: '#111111',
    pet: 'dragon', pet_xp: 350, pet_xp_map: { dragon: 350 },
    pet_position: 'head', pet_color_body: '#222222',
  };
  const recipe = {
    optionGroups: [
      { key: 'head', itemCategory: 'head', options: [{ id: 'round' }, { id: 'oval' }] },
      { key: 'hair', itemCategory: 'hair', options: [{ id: 'short' }, { id: 'long' }] },
    ],
    colourGroups: [{ key: 'head_color', values: ['#111111', '#eeeeee'] }],
    accessoryGroup: {
      itemCategory: 'accessory',
      options: [{ id: 'cape' }, { id: 'shield' }],
      chance: 0.5,
    },
  };
  const values = [0.999, 0.999, 0.999, 0.1, 0.999];
  const randomised = randomiseAvatarConfig(
    config,
    recipe,
    { head: new Set(['oval']), accessory: new Set(['cape']) },
    () => values.shift(),
  );
  assert.equal(randomised.head, 'round');
  assert.equal(randomised.hair, 'long');
  assert.equal(randomised.head_color, '#eeeeee');
  assert.deepEqual(randomised.accessories, ['shield']);
  assert.equal(randomised.accessory, 'shield');
  assert.equal(randomised.pet, 'dragon');
  assert.equal(randomised.pet_xp, 350);
  assert.equal(randomised.pet_position, 'head');
  assert.equal(randomised.pet_color_body, '#222222');
});

test('dirty comparison treats cloned nested avatar data as equal', () => {
  const config = { head: 'round', accessories: ['cape'], pet_xp_map: { cat: 50 } };
  assert.equal(configsEqual(config, structuredClone(config)), true);
  assert.equal(configsEqual(config, { ...config, head: 'oval' }), false);
});
```

- [ ] **Step 2: Run the model test and verify the red state**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorState.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `avatarEditorState.js`.

- [ ] **Step 3: Implement the immutable model**

```js
export const AVATAR_HISTORY_LIMIT = 30;

export function cloneAvatarConfig(config = {}) {
  return {
    ...config,
    accessories: Array.isArray(config.accessories) ? [...config.accessories] : [],
    pet_xp_map: config.pet_xp_map ? { ...config.pet_xp_map } : config.pet_xp_map,
  };
}

function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]));
}

export function configsEqual(left, right) {
  return JSON.stringify(ordered(left)) === JSON.stringify(ordered(right));
}

export function applyAvatarChange(config, key, value) {
  const next = cloneAvatarConfig(config);
  next[key] = value;
  if (key === 'pet') {
    const xpMap = next.pet_xp_map || {};
    next.pet_xp = value && value !== 'none' && value in xpMap ? xpMap[value] : 0;
  }
  return next;
}

export function pushAvatarHistory(history, config, limit = AVATAR_HISTORY_LIMIT) {
  return [...history.slice(-(limit - 1)), cloneAvatarConfig(config)];
}

export function undoAvatarChange(history, currentConfig) {
  if (history.length === 0) return { history, config: currentConfig };
  return {
    history: history.slice(0, -1),
    config: cloneAvatarConfig(history[history.length - 1]),
  };
}

export function buildDisplayConfig(config, preview) {
  if (!preview) return config;
  if (preview.key === 'accessory') {
    const next = cloneAvatarConfig(config);
    next.accessories = [...new Set([...(next.accessories || []), preview.value])];
    next.accessory = preview.value;
    return next;
  }
  return applyAvatarChange(config, preview.key, preview.value);
}

export function toggleAvatarAccessory(config, itemId) {
  const selected = new Set(config.accessories?.length
    ? config.accessories
    : config.accessory && config.accessory !== 'none' ? [config.accessory] : []);
  selected.has(itemId) ? selected.delete(itemId) : selected.add(itemId);
  const accessories = [...selected];
  return { ...cloneAvatarConfig(config), accessories, accessory: accessories[0] || 'none' };
}

export function randomiseAvatarConfig(config, recipe, lockedByCategory = {}, random = Math.random) {
  const next = cloneAvatarConfig(config);
  for (const group of recipe.optionGroups) {
    const locked = lockedByCategory[group.itemCategory] || new Set();
    const available = group.options.filter((option) => !locked.has(option.id));
    if (available.length) next[group.key] = available[Math.floor(random() * available.length)].id;
  }
  for (const group of recipe.colourGroups) {
    if (group.values.length) next[group.key] = group.values[Math.floor(random() * group.values.length)];
  }
  if (recipe.accessoryGroup) {
    const group = recipe.accessoryGroup;
    const locked = lockedByCategory[group.itemCategory] || new Set();
    const available = group.options.filter((option) => !locked.has(option.id));
    if (available.length && random() < group.chance) {
      const item = available[Math.floor(random() * available.length)].id;
      next.accessories = [item];
      next.accessory = item;
    } else {
      next.accessories = [];
      next.accessory = 'none';
    }
  }
  return next;
}
```

- [ ] **Step 4: Run focused and full frontend unit tests**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorState.test.js
node --test "frontend/src/**/*.test.js"
```

Expected: all tests PASS.

- [ ] **Step 5: Commit the model**

```powershell
git add frontend/src/components/avatar-editor/avatarEditorState.js frontend/src/components/avatar-editor/avatarEditorState.test.js
git commit -m "test: define avatar editor session model"
```

---

### Task 2: Create semantic visual controls and toolbar

**Files:**
- Create: `frontend/src/components/avatar-editor/AvatarOptionControls.jsx`
- Create: `frontend/src/components/avatar-editor/AvatarCategoryRail.jsx`
- Create: `frontend/src/components/avatar-editor/AvatarEditorToolbar.jsx`
- Create: `frontend/src/components/avatar-editor/AvatarDiscardDialog.jsx`
- Create: `frontend/src/components/avatar-editor/avatarEditorStructure.test.js`
- Modify: `frontend/src/components/AvatarDisplay.jsx:17-23, 226`

**Interfaces:**
- Consumes: `AvatarDisplay`, category objects `{ id, label, icon }`, current configuration, lock state, preview callbacks, save status.
- Produces: `AvatarOptionGrid`, `AvatarOptionCard`, `AvatarColorPalette`, `AvatarCategoryRail`, and `AvatarEditorToolbar` React components.

- [ ] **Step 1: Write failing semantic structure tests**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (name) => fs.readFileSync(new URL(name, import.meta.url), 'utf8');

test('option cards and colour swatches expose selected state without colour alone', () => {
  const source = read('./AvatarOptionControls.jsx');
  assert.match(source, /aria-pressed=/);
  assert.match(source, /Check/);
  assert.match(source, /AvatarDisplay/);
  assert.match(source, /onPointerEnter/);
  assert.match(source, /onPointerLeave/);
});

test('category navigation and toolbar expose semantic state and named actions', () => {
  const rail = read('./AvatarCategoryRail.jsx');
  const toolbar = read('./AvatarEditorToolbar.jsx');
  const dialog = read('./AvatarDiscardDialog.jsx');
  assert.match(rail, /aria-current=/);
  assert.match(toolbar, /Randomise/);
  assert.match(toolbar, /Undo/);
  assert.match(toolbar, /Save/);
  assert.match(toolbar, /disabled={!canUndo}/);
  assert.match(dialog, /role="dialog"/);
  assert.match(dialog, /Keep editing/);
  assert.match(dialog, /Discard/);
});
```

- [ ] **Step 2: Run the structure test and verify the red state**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorStructure.test.js
```

Expected: FAIL because the three JSX files do not exist.

- [ ] **Step 3: Add explicit thumbnail and studio sizes**

Update the size table and numeric fallback in `AvatarDisplay.jsx`:

```js
const SIZES = {
  xs: 24,
  sm: 32,
  md: 64,
  option: 76,
  lg: 128,
  xl: 176,
  studio: 288,
};

export default function AvatarDisplay({ config, size = 'md', name = '', animate = false }) {
  const px = typeof size === 'number' ? size : (SIZES[size] || SIZES.md);
```

- [ ] **Step 4: Implement visual option and colour controls**

```jsx
import { Check, Lock } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';
import { buildDisplayConfig } from './avatarEditorState';

export function AvatarOptionCard({ option, configKey, config, selected, locked = false, lockLabel = '', multiple = false, onSelect, onPreview, onPreviewEnd }) {
  const previewConfig = buildDisplayConfig(config, { key: configKey, value: option.id });
  return (
    <button
      type="button"
      className={`avatar-option-card${selected ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
      aria-pressed={selected}
      aria-label={`${option.label}${locked ? `, locked, ${lockLabel}` : ''}`}
      onClick={() => !locked && onSelect(option.id)}
      onPointerEnter={() => locked && onPreview?.(configKey, option.id)}
      onPointerLeave={() => locked && onPreviewEnd?.()}
      onPointerDown={(event) => event.pointerType !== 'mouse' && locked && onPreview?.(configKey, option.id)}
      onPointerUp={() => locked && onPreviewEnd?.()}
      onPointerCancel={() => locked && onPreviewEnd?.()}
    >
      <span className="avatar-option-card__preview"><AvatarDisplay config={previewConfig} size="option" /></span>
      <span className="avatar-option-card__label">{option.label}</span>
      {locked && lockLabel && <span className="avatar-option-card__requirement">{lockLabel}</span>}
      {locked && <span className="avatar-option-card__lock"><Lock size={13} /></span>}
      {selected && <span className="avatar-option-card__check"><Check size={13} /></span>}
      {multiple && <span className="sr-only">Multiple selection</span>}
    </button>
  );
}

export function AvatarOptionGrid({ children }) {
  return <div className="avatar-option-grid">{children}</div>;
}

export function AvatarColorPalette({ label, colors, selected, onSelect }) {
  return (
    <fieldset className="avatar-colour-fieldset">
      <legend>{label}</legend>
      <div className="avatar-colour-palette">
        {colors.map((color) => (
          <button key={color} type="button" className="avatar-colour-swatch" aria-label={`${label}: ${color}`} aria-pressed={selected === color} style={{ '--swatch': color }} onClick={() => onSelect(color)}>
            {selected === color && <Check size={16} />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 5: Implement category navigation and toolbar**

```jsx
export function AvatarCategoryRail({ categories, activeCategory, onSelect }) {
  return (
    <nav className="avatar-category-rail" aria-label="Avatar categories">
      {categories.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" className="avatar-category-button" aria-current={activeCategory === id ? 'page' : undefined} aria-label={label} title={label} onClick={() => onSelect(id)}>
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
```

```jsx
import { ArrowLeft, Dices, Loader2, RotateCcw, Save } from 'lucide-react';

export function AvatarEditorToolbar({ canUndo, dirty, saving, status, onBack, onRandomise, onUndo, onSave }) {
  return (
    <header className="avatar-editor-toolbar">
      <div className="avatar-editor-toolbar__identity">
        <button type="button" className="avatar-icon-button" aria-label="Back" onClick={onBack}><ArrowLeft size={20} /></button>
        <div><h1>Hero Studio</h1><p>{dirty ? 'Unsaved changes' : 'Your hero is ready'}</p></div>
      </div>
      <div className="avatar-editor-toolbar__actions">
        <button type="button" className="avatar-tool-button" onClick={onRandomise}><Dices size={17} /><span>Randomise</span></button>
        <button type="button" className="avatar-tool-button" disabled={!canUndo} onClick={onUndo}><RotateCcw size={17} /><span>Undo</span></button>
        <button type="button" className="avatar-save-button" disabled={saving || !dirty} onClick={onSave}>
          {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}<span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
      <p className="avatar-save-status" role="status" aria-live="polite">{status}</p>
    </header>
  );
}
```

Implement the discard dialog as code-native UI instead of `window.confirm`, so it matches the studio and can be translated by the DOM overlay:

```jsx
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function AvatarDiscardDialog({ open, onCancel, onDiscard }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="avatar-discard-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section role="dialog" aria-modal="true" aria-labelledby="avatar-discard-title" className="avatar-discard-dialog" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} onKeyDown={(event) => event.key === 'Escape' && onCancel()}>
            <AlertTriangle size={22} />
            <h2 id="avatar-discard-title">Discard changes?</h2>
            <p>Your hero has unsaved changes. Leave without saving?</p>
            <div>
              <button ref={cancelRef} type="button" onClick={onCancel}>Keep editing</button>
              <button type="button" className="is-danger" onClick={onDiscard}>Discard</button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 6: Run semantic tests and build**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorStructure.test.js
npm run build --prefix frontend
```

Expected: semantic tests PASS and Vite build succeeds.

- [ ] **Step 7: Commit the visual primitives**

```powershell
git add frontend/src/components/AvatarDisplay.jsx frontend/src/components/avatar-editor/AvatarOptionControls.jsx frontend/src/components/avatar-editor/AvatarCategoryRail.jsx frontend/src/components/avatar-editor/AvatarEditorToolbar.jsx frontend/src/components/avatar-editor/AvatarDiscardDialog.jsx frontend/src/components/avatar-editor/avatarEditorStructure.test.js
git commit -m "feat: add avatar studio controls"
```

---

### Task 3: Build the avatar stage and structured pet customiser

**Files:**
- Create: `frontend/src/components/avatar-editor/AvatarStage.jsx`
- Create: `frontend/src/components/avatar-editor/PetCustomizer.jsx`
- Modify: `frontend/src/components/avatar-editor/avatarEditorStructure.test.js`

**Interfaces:**
- `AvatarStage({ config, placementMode, previewMessage, onPlacePet })`
- `PetCustomizer({ config, locked, lockedMeta, getUnlockLabel, onChange, onPreview, onPreviewEnd })`
- Consumes: `AvatarDisplay`, pet render helpers, option controls, and current configuration.

- [ ] **Step 1: Extend the failing structure test for stage and pet sections**

```js
test('stage owns live preview and pet placement while pet customiser exposes four sections', () => {
  const stage = read('./AvatarStage.jsx');
  const pet = read('./PetCustomizer.jsx');
  assert.match(stage, /AvatarDisplay/);
  assert.match(stage, /viewBox="0 0 32 32"/);
  assert.match(stage, /Tap to place your pet/);
  for (const label of ['Appearance', 'Colours', 'Position', 'Accessory']) {
    assert.match(pet, new RegExp(label));
  }
  assert.match(pet, /aria-selected=/);
});
```

- [ ] **Step 2: Run the structure test and verify the red state**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorStructure.test.js
```

Expected: FAIL because `AvatarStage.jsx` and `PetCustomizer.jsx` do not exist.

- [ ] **Step 3: Implement the dominant avatar stage and placement overlay**

```jsx
import { Crosshair, LockKeyhole } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';

export function AvatarStage({ config, placementMode = false, previewMessage = '', onPlacePet }) {
  const place = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(4, Math.min(28, Math.round(((event.clientX - rect.left) / rect.width) * 32)));
    const y = Math.max(4, Math.min(28, Math.round(((event.clientY - rect.top) / rect.height) * 32)));
    onPlacePet?.(x, y);
  };
  const petX = config.pet_x ?? 26;
  const petY = config.pet_y ?? 20;
  const moveWithKeyboard = (event) => {
    const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const delta = moves[event.key];
    if (!delta) return;
    event.preventDefault();
    onPlacePet?.(Math.max(4, Math.min(28, petX + delta[0])), Math.max(4, Math.min(28, petY + delta[1])));
  };
  return (
    <section className="avatar-stage" aria-label="Live avatar preview">
      <div className="avatar-stage__spotlight" aria-hidden="true" />
      <div className="avatar-stage__character avatar-idle"><AvatarDisplay config={config} size="studio" /></div>
      <div className="avatar-stage__plinth" aria-hidden="true" />
      {placementMode && (
        <svg className="avatar-stage__placement" viewBox="0 0 32 32" role="button" aria-label="Tap to place your pet" tabIndex="0" onClick={place} onKeyDown={moveWithKeyboard}>
          <circle cx={petX} cy={petY} r="1.6" /><path d={`M${petX - 2} ${petY}h4M${petX} ${petY - 2}v4`} />
        </svg>
      )}
      <p className="avatar-stage__hint">{placementMode ? <><Crosshair size={14} />Tap to place your pet</> : previewMessage ? <><LockKeyhole size={14} />{previewMessage}</> : 'Preview updates instantly'}</p>
    </section>
  );
}
```

- [ ] **Step 4: Move pet rendering and controls into a segmented customiser**

Implement local `activeSection` state with the exact section list:

```jsx
const PET_SECTIONS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'colours', label: 'Colours' },
  { id: 'position', label: 'Position' },
  { id: 'accessory', label: 'Accessory' },
];

export function PetCustomizer({ config, locked, lockedMeta, getUnlockLabel, onChange, onPreview, onPreviewEnd }) {
  const [activeSection, setActiveSection] = useState('appearance');
  const hasPet = config.pet && config.pet !== 'none';
  return (
    <div className="avatar-pet-customiser">
      <div className="avatar-pet-tabs" role="tablist" aria-label="Pet customisation">
        {PET_SECTIONS.map((section) => (
          <button key={section.id} type="button" role="tab" aria-selected={activeSection === section.id} disabled={!hasPet && section.id !== 'appearance'} onClick={() => setActiveSection(section.id)}>{section.label}</button>
        ))}
      </div>
      {activeSection === 'appearance' && renderAppearanceControls({ config, locked, onChange, onPreview, onPreviewEnd })}
      {activeSection === 'colours' && renderColourControls({ config, onChange })}
      {activeSection === 'position' && renderPositionControls({ config, onChange })}
      {activeSection === 'accessory' && renderAccessoryControls({ config, onChange })}
    </div>
  );
}
```

Define the progression model in `PetCustomizer.jsx` with the existing values:

```jsx
const PET_LEVEL_THRESHOLDS = [0, 50, 150, 350, 700, 1200, 2000, 3500];
const PET_LEVEL_NAMES = ['', 'Hatchling', 'Youngling', 'Companion', 'Loyal', 'Brave', 'Mighty', 'Majestic', 'Legendary'];
const PET_LEVEL_COLORS = ['', '#94a3b8', '#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#f97316', '#ef4444', '#d946ef'];

function getPetLevelInfo(petXp) {
  let level = 1;
  for (let index = 0; index < PET_LEVEL_THRESHOLDS.length; index += 1) {
    if (petXp >= PET_LEVEL_THRESHOLDS[index]) level = index + 1;
  }
  const threshold = PET_LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = PET_LEVEL_THRESHOLDS[level] || null;
  const progress = nextThreshold ? (petXp - threshold) / (nextThreshold - threshold) : 1;
  return { level, name: PET_LEVEL_NAMES[level], nextName: PET_LEVEL_NAMES[level + 1] || null, xp: petXp, threshold, nextThreshold, progress };
}

function getPetXpForPet(config, petType) {
  if (!petType || petType === 'none') return 0;
  const xpMap = config.pet_xp_map || {};
  return petType in xpMap ? xpMap[petType] : (config.pet_xp || 0);
}

function PetPreviewSvg({ petType, colors, level = 1 }) {
  if (!petType || petType === 'none') return null;
  const scale = (1 + (level - 1) * 0.04) * 1.3;
  const isBig = ['dragon', 'phoenix'].includes(petType);
  const centerX = isBig ? 25 : 26;
  const centerY = isBig ? 19 : 20;
  const glow = level >= 7 ? '#f59e0b' : level >= 5 ? '#a855f7' : level >= 2 ? '#3b82f6' : null;
  return (
    <svg width="64" height="64" viewBox="0 0 12 12" className="avatar-pet-level-preview">
      <g transform={`translate(6,6) scale(${scale}) translate(${-centerX},${-centerY})`}>
        {glow && <circle cx={centerX} cy={centerY} r="4" fill={glow} opacity={level >= 5 ? 0.25 : 0.18} />}
        {renderPet(petType, colors, 'right', {})}
        {renderPetExtras(petType, level, colors, 'right')}
      </g>
    </svg>
  );
}
```

Render the existing eight-level preview rail in the `appearance` section. Use `AvatarOptionCard` for pet, position, and accessory choices, passing `lockLabel={getUnlockLabel(lockedMeta?.get(option.id))}` for locked pets, and use `AvatarColorPalette` for body, ears, tail, and accent colours. When a part colour equals the body colour, store an empty string so the renderer continues to inherit the body colour.

- [ ] **Step 5: Run semantic tests and build**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorStructure.test.js
npm run build --prefix frontend
```

Expected: tests PASS and build succeeds.

- [ ] **Step 6: Commit the stage and pet customiser**

```powershell
git add frontend/src/components/avatar-editor/AvatarStage.jsx frontend/src/components/avatar-editor/PetCustomizer.jsx frontend/src/components/avatar-editor/avatarEditorStructure.test.js
git commit -m "feat: add avatar stage and pet studio"
```

---

### Task 4: Build the category options panel and integrate Hero Studio state

**Files:**
- Create: `frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx`
- Modify: `frontend/src/components/AvatarEditor.jsx:1-959`
- Modify: `frontend/src/components/avatar-editor/avatarEditorState.test.js`
- Modify: `frontend/src/components/avatar-editor/avatarEditorStructure.test.js`

**Interfaces:**
- `AvatarOptionsPanel({ category, config, lockedByCategory, lockedItemMeta, catalog, onChange, onToggleAccessory, onPreview, onPreviewEnd })`
- `AvatarEditor` supplies `catalog`, state callbacks, display configuration, save state, and lock maps.

- [ ] **Step 1: Add a failing test for one-entry history semantics**

```js
test('one user action stores one undo snapshot even when it updates legacy accessory fields', () => {
  const original = { accessory: 'none', accessories: [] };
  const next = toggleAvatarAccessory(original, 'cape');
  const history = pushAvatarHistory([], original);
  assert.equal(history.length, 1);
  assert.deepEqual(next, { accessory: 'cape', accessories: ['cape'] });
  assert.deepEqual(undoAvatarChange(history, next).config, original);
});
```

Extend `avatarEditorStructure.test.js`:

```js
test('editor composes the studio instead of the legacy category strip', () => {
  const editor = read('../AvatarEditor.jsx');
  assert.match(editor, /AvatarEditorToolbar/);
  assert.match(editor, /AvatarCategoryRail/);
  assert.match(editor, /AvatarStage/);
  assert.match(editor, /AvatarOptionsPanel/);
  assert.doesNotMatch(editor, /function CategoryStrip/);
  assert.doesNotMatch(editor, /function ShapeSelector/);
});
```

- [ ] **Step 2: Run tests and verify the editor structure test fails**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorState.test.js frontend/src/components/avatar-editor/avatarEditorStructure.test.js
```

Expected: model assertions PASS; structure assertion FAILS because the legacy editor is still present.

- [ ] **Step 3: Implement `AvatarOptionsPanel` category mapping**

Use one reusable `renderCards` helper and explicit category branches:

```jsx
const CATEGORY_META = {
  head: { title: 'Choose a head shape', description: 'Start with the silhouette of your hero.' },
  skin: { title: 'Choose a skin tone', description: 'Pick the tone that feels right.' },
  hair: { title: 'Style the hair', description: 'Choose a cut, then finish it with colour.' },
  eyes: { title: 'Choose the eyes', description: 'Give your hero their expression.' },
  mouth: { title: 'Choose the smile', description: 'Finish the expression.' },
  body: { title: 'Choose a build', description: 'Set the hero silhouette.' },
  outfit: { title: 'Choose outfit colour', description: 'Set the main outfit colour.' },
  pattern: { title: 'Choose a pattern', description: 'Add a final outfit detail.' },
  background: { title: 'Choose a backdrop', description: 'Frame your hero.' },
  hat: { title: 'Choose headwear', description: 'Add a signature finishing touch.' },
  face: { title: 'Choose face details', description: 'Add freckles, paint, or stickers.' },
  accessory: { title: 'Choose equipment', description: 'Equip more than one item.' },
  pet: { title: 'Customise your companion', description: 'Style and place your loyal companion.' },
};
```

```jsx
function renderCards({ options, configKey, itemCategory, selected, locked, lockedMeta, config, onSelect, onPreview, onPreviewEnd, multiple = false }) {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);
  return (
    <AvatarOptionGrid>
      {options.map((option) => (
        <AvatarOptionCard key={option.id} option={option} configKey={configKey} config={config} selected={selectedSet.has(option.id)} locked={locked?.has(option.id)} lockLabel={unlockLabel(lockedMeta?.[itemCategory]?.get(option.id))} multiple={multiple} onSelect={onSelect} onPreview={onPreview} onPreviewEnd={onPreviewEnd} />
      ))}
    </AvatarOptionGrid>
  );
}
```

Return a panel with `CATEGORY_META[category]`, the relevant cards, and palettes. For `accessory`, call `onToggleAccessory`; for `pet`, render `PetCustomizer`.

- [ ] **Step 4: Replace local UI helpers in `AvatarEditor` with orchestration state**

Import the category icons and define the category/capability maps beside the existing option arrays:

```jsx
import {
  Accessibility, CircleUserRound, Crown, Eye, Image as ImageIcon,
  Palette, PawPrint, ScanFace, Scissors, Shield, Shirt, Smile, Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'head', label: 'Head', icon: CircleUserRound },
  { id: 'skin', label: 'Skin', icon: Palette },
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'eyes', label: 'Eyes', icon: Eye },
  { id: 'mouth', label: 'Mouth', icon: Smile },
  { id: 'body', label: 'Body', icon: Accessibility },
  { id: 'outfit', label: 'Outfit', icon: Shirt },
  { id: 'pattern', label: 'Pattern', icon: Sparkles },
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'hat', label: 'Hat', icon: Crown },
  { id: 'face', label: 'Face', icon: ScanFace },
  { id: 'accessory', label: 'Equipment', icon: Shield },
  { id: 'pet', label: 'Pet', icon: PawPrint },
];

const AVATAR_CATALOG = {
  head: { configKey: 'head', itemCategory: 'head', options: HEAD_OPTIONS },
  skin: { colourKey: 'head_color', colours: SKIN_COLORS },
  hair: { configKey: 'hair', itemCategory: 'hair', options: HAIR_OPTIONS, colourKey: 'hair_color', colours: HAIR_COLORS },
  eyes: { configKey: 'eyes', itemCategory: 'eyes', options: EYES_OPTIONS, colourKey: 'eye_color', colours: EYE_COLORS },
  mouth: { configKey: 'mouth', itemCategory: 'mouth', options: MOUTH_OPTIONS, colourKey: 'mouth_color', colours: MOUTH_COLORS },
  body: { configKey: 'body', itemCategory: 'body', options: BODY_OPTIONS },
  outfit: { colourKey: 'body_color', colours: BODY_COLORS },
  pattern: { configKey: 'outfit_pattern', itemCategory: 'outfit_pattern', options: OUTFIT_PATTERN_OPTIONS },
  background: { colourKey: 'bg_color', colours: BG_COLORS },
  hat: { configKey: 'hat', itemCategory: 'hat', options: HAT_OPTIONS, colourKey: 'hat_color', colours: HAT_COLORS },
  face: { configKey: 'face_extra', itemCategory: 'face_extra', options: FACE_EXTRA_OPTIONS },
  accessory: { configKey: 'accessory', itemCategory: 'accessory', options: ACCESSORY_OPTIONS, colourKey: 'accessory_color', colours: ACCESSORY_COLORS, multiple: true },
  pet: { itemCategory: 'pet', options: PET_OPTIONS },
};

const RANDOMISE_RECIPE = {
  optionGroups: [
    { key: 'head', itemCategory: 'head', options: HEAD_OPTIONS },
    { key: 'hair', itemCategory: 'hair', options: HAIR_OPTIONS },
    { key: 'eyes', itemCategory: 'eyes', options: EYES_OPTIONS },
    { key: 'mouth', itemCategory: 'mouth', options: MOUTH_OPTIONS },
    { key: 'body', itemCategory: 'body', options: BODY_OPTIONS },
    { key: 'outfit_pattern', itemCategory: 'outfit_pattern', options: OUTFIT_PATTERN_OPTIONS },
    { key: 'hat', itemCategory: 'hat', options: HAT_OPTIONS },
    { key: 'face_extra', itemCategory: 'face_extra', options: FACE_EXTRA_OPTIONS },
  ],
  colourGroups: [
    { key: 'head_color', values: SKIN_COLORS },
    { key: 'hair_color', values: HAIR_COLORS },
    { key: 'eye_color', values: EYE_COLORS },
    { key: 'mouth_color', values: MOUTH_COLORS },
    { key: 'body_color', values: BODY_COLORS },
    { key: 'bg_color', values: BG_COLORS },
    { key: 'hat_color', values: HAT_COLORS },
    { key: 'accessory_color', values: ACCESSORY_COLORS },
  ],
  accessoryGroup: { itemCategory: 'accessory', options: ACCESSORY_OPTIONS, chance: 0.5 },
};
```

Use these state variables and callbacks:

```jsx
const initialConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...(user?.avatar_config || {}) }), [user?.avatar_config]);
const [config, setConfig] = useState(initialConfig);
const [savedConfig, setSavedConfig] = useState(initialConfig);
const [history, setHistory] = useState([]);
const [preview, setPreview] = useState(null);
const [status, setStatus] = useState('');
const [lockedItemMeta, setLockedItemMeta] = useState({});
const [discardOpen, setDiscardOpen] = useState(false);
const allowNextPopRef = useRef(false);
const dirty = !configsEqual(config, savedConfig);
const displayConfig = buildDisplayConfig(config, preview);

const commitChange = useCallback((nextConfig) => {
  if (configsEqual(config, nextConfig)) return;
  setHistory((items) => pushAvatarHistory(items, config));
  setConfig(nextConfig);
  setStatus('');
}, [config]);

const changeValue = useCallback((key, value) => {
  commitChange(applyAvatarChange(config, key, value));
}, [commitChange, config]);

const undo = useCallback(() => {
  const result = undoAvatarChange(history, config);
  setHistory(result.history);
  setConfig(result.config);
  setStatus('');
}, [config, history]);

useEffect(() => {
  setConfig(initialConfig);
  setSavedConfig(initialConfig);
  setHistory([]);
}, [initialConfig]);
```

Replace the existing lock fetch reduction with parallel lock and metadata maps so cards can explain unavailable items:

```jsx
const fetchLocks = useCallback(async () => {
  try {
    const items = await api('/api/avatar/items');
    if (!Array.isArray(items)) return;
    const lockMap = {};
    const metaMap = {};
    for (const item of items) {
      if (!metaMap[item.category]) metaMap[item.category] = new Map();
      metaMap[item.category].set(item.item_id, item);
      if (!item.unlocked && !item.is_default) {
        if (!lockMap[item.category]) lockMap[item.category] = new Set();
        lockMap[item.category].add(item.item_id);
      }
    }
    setLockedByCategory(lockMap);
    setLockedItemMeta(metaMap);
  } catch {
    setLockedByCategory({});
    setLockedItemMeta({});
  }
}, []);
```

In `AvatarOptionsPanel`, derive the exact lock explanation using the same backend fields as `AvatarShop`:

```jsx
function unlockLabel(item) {
  if (!item) return 'Locked';
  if (item.unlock_method === 'shop') return `${item.unlock_value} XP`;
  if (item.unlock_method === 'xp') return `Earn ${item.unlock_value} XP`;
  if (item.unlock_method === 'streak') return `${item.unlock_value}-day streak`;
  if (item.unlock_method === 'quest_drop') return 'Find in quests';
  return 'Locked';
}
```

Pass `lockLabel={unlockLabel(lockedItemMeta?.[itemCategory]?.get(option.id))}` to each locked `AvatarOptionCard`.

For the pet category, pass the backend pet metadata and the same formatter explicitly:

```jsx
if (category === 'pet') {
  return (
    <PetCustomizer
      config={config}
      locked={lockedByCategory.pet || new Set()}
      lockedMeta={lockedItemMeta.pet || new Map()}
      getUnlockLabel={unlockLabel}
      onChange={onChange}
      onPreview={onPreview}
      onPreviewEnd={onPreviewEnd}
    />
  );
}
```

For pet placement, use one `commitChange({ ...config, pet_x: x, pet_y: y })` call. For multi-accessories, use `commitChange(toggleAvatarAccessory(config, id))` so `accessory` and `accessories` share one history snapshot.

- [ ] **Step 5: Add randomise, save, and dirty exit behavior**

Use the exact `RANDOMISE_RECIPE` above, which excludes all pet keys and treats equipment as zero-or-one random item. Implement:

```jsx
const randomise = useCallback(() => {
  commitChange(randomiseAvatarConfig(config, RANDOMISE_RECIPE, lockedByCategory));
}, [commitChange, config, lockedByCategory]);

const leaveEditor = useCallback(() => {
  allowNextPopRef.current = true;
  navigate(-1);
}, [navigate]);

const requestExit = useCallback(() => {
  if (dirty) setDiscardOpen(true);
  else leaveEditor();
}, [dirty, leaveEditor]);

useEffect(() => {
  const beforeUnload = (event) => {
    if (!dirty) return;
    event.preventDefault();
    event.returnValue = '';
  };
  window.addEventListener('beforeunload', beforeUnload);
  return () => window.removeEventListener('beforeunload', beforeUnload);
}, [dirty]);

useEffect(() => {
  const handlePopState = () => {
    if (allowNextPopRef.current) {
      allowNextPopRef.current = false;
      return;
    }
    if (dirty) {
      allowNextPopRef.current = true;
      navigate(1);
      setDiscardOpen(true);
    }
  };
  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, [dirty, navigate]);

const save = useCallback(async () => {
  setSaving(true);
  setStatus('');
  try {
    const response = await api('/api/avatar', { method: 'PUT', body: { config } });
    const persisted = response.avatar_config || config;
    updateUser({ avatar_config: persisted });
    setSavedConfig(persisted);
    setHistory([]);
    setStatus('Saved!');
    allowNextPopRef.current = true;
    window.setTimeout(() => navigate(-1), 600);
  } catch (error) {
    setStatus(error.message || 'Failed to save');
  } finally {
    setSaving(false);
  }
}, [config, navigate, updateUser]);
```

Keep `Escape` routed through `requestExit`. On save success, set `savedConfig` from `res.avatar_config || config`, clear history, set `Saved!`, set `allowNextPopRef.current = true`, and call `navigate(-1)` after 600 ms without routing through the dirty dialog.

- [ ] **Step 6: Compose the new layout**

```jsx
return (
  <div className="avatar-editor-shell">
    <AvatarEditorToolbar canUndo={history.length > 0} dirty={dirty} saving={saving} status={status} onBack={requestExit} onRandomise={randomise} onUndo={undo} onSave={save} />
    <div className="avatar-editor-workspace">
      <AvatarCategoryRail categories={CATEGORIES} activeCategory={openCategory} onSelect={setOpenCategory} />
      <AvatarStage config={displayConfig} placementMode={openCategory === 'pet' && config.pet_position === 'custom' && config.pet !== 'none'} previewMessage={preview ? 'Previewing a locked item' : ''} onPlacePet={(x, y) => commitChange({ ...config, pet_x: x, pet_y: y })} />
      <AvatarOptionsPanel category={openCategory} config={config} lockedByCategory={editorLocks} lockedItemMeta={lockedItemMeta} catalog={AVATAR_CATALOG} onChange={changeValue} onToggleAccessory={(id) => commitChange(toggleAvatarAccessory(config, id))} onPreview={(key, value) => setPreview({ key, value })} onPreviewEnd={() => setPreview(null)} />
    </div>
    <AvatarDiscardDialog open={discardOpen} onCancel={() => setDiscardOpen(false)} onDiscard={leaveEditor} />
  </div>
);
```

- [ ] **Step 7: Run focused tests, full tests, and build**

Run:

```powershell
node --test frontend/src/components/avatar-editor/avatarEditorState.test.js frontend/src/components/avatar-editor/avatarEditorStructure.test.js
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
```

Expected: all tests PASS and build succeeds.

- [ ] **Step 8: Commit integrated behavior**

```powershell
git add frontend/src/components/AvatarEditor.jsx frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx frontend/src/components/avatar-editor/avatarEditorState.test.js frontend/src/components/avatar-editor/avatarEditorStructure.test.js
git commit -m "feat: integrate avatar hero studio"
```

---

### Task 5: Add the accepted visual system and responsive behavior

**Files:**
- Create: `frontend/src/components/avatar-editor/avatarEditor.css`
- Modify: `frontend/src/components/AvatarEditor.jsx:1-20`

**Interfaces:**
- Consumes: accepted desktop/mobile concept images and the class names from Tasks 2–4.
- Produces: exact desktop three-zone layout, mobile fixed preview plus scrolling options, focus states, and reduced-motion behavior.

- [ ] **Step 1: Add the stylesheet import and run a build before the file exists**

Add to `AvatarEditor.jsx`:

```js
import './avatar-editor/avatarEditor.css';
```

Run:

```powershell
npm run build --prefix frontend
```

Expected: FAIL with an unresolved `avatarEditor.css` import.

- [ ] **Step 2: Implement the scoped desktop layout and stage**

```css
.avatar-editor-shell {
  --studio-panel: color-mix(in srgb, var(--color-surface) 92%, black);
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-width: 0;
  min-height: 100dvh;
  overflow: hidden;
  background: var(--color-navy);
  color: var(--color-cream);
}

.avatar-editor-workspace {
  display: grid;
  grid-template-columns: 84px minmax(320px, 1fr) minmax(380px, 440px);
  min-height: 0;
}

.avatar-category-rail,
.avatar-options-panel { background: var(--studio-panel); }

.avatar-stage {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 44%, color-mix(in srgb, var(--color-accent) 14%, transparent) 0 18%, transparent 52%),
    linear-gradient(180deg, var(--color-surface-raised), var(--color-navy));
}

.avatar-stage__character { position: relative; z-index: 2; filter: drop-shadow(0 24px 30px rgb(0 0 0 / .38)); }
.avatar-stage__plinth { position: absolute; z-index: 1; width: min(50%, 340px); height: 52px; bottom: 13%; border-radius: 50%; background: color-mix(in srgb, var(--color-accent) 18%, var(--color-surface)); box-shadow: 0 18px 55px rgb(0 0 0 / .45), inset 0 2px 0 rgb(255 255 255 / .07); }
.avatar-stage__hint { position: absolute; z-index: 4; bottom: 5%; display: flex; align-items: center; gap: 8px; min-height: 36px; color: var(--color-muted); font-size: 12px; }
```

- [ ] **Step 3: Implement card, rail, toolbar, panel, and focus styling**

```css
.avatar-option-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.avatar-option-card { position: relative; display: grid; grid-template-rows: 86px auto; min-width: 0; min-height: 122px; overflow: hidden; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-muted); transition: border-color 160ms ease, background-color 160ms ease, transform 160ms ease; }
.avatar-option-card:hover { border-color: var(--color-border-light); transform: translateY(-1px); }
.avatar-option-card.is-selected { border-color: var(--color-accent); background: color-mix(in srgb, var(--color-accent) 9%, var(--color-surface)); color: var(--color-cream); box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-accent) 35%, transparent); }
.avatar-option-card.is-locked { opacity: .68; }
.avatar-option-card__preview { display: grid; place-items: center; overflow: hidden; background: color-mix(in srgb, var(--color-navy) 72%, var(--color-surface-raised)); }
.avatar-option-card__label { padding: 9px 8px 10px; overflow: hidden; font-size: 12px; font-weight: 600; line-height: 1.25; text-overflow: ellipsis; white-space: nowrap; }
.avatar-option-card__requirement { margin: -6px 8px 9px; overflow: hidden; color: #fbbf24; font-size: 9px; line-height: 1.25; text-overflow: ellipsis; white-space: nowrap; }
.avatar-colour-swatch { display: grid; place-items: center; width: 36px; height: 36px; border: 2px solid transparent; border-radius: 50%; background: var(--swatch); color: white; box-shadow: 0 0 0 1px var(--color-border); }
.avatar-colour-swatch[aria-pressed="true"] { border-color: var(--color-cream); box-shadow: 0 0 0 2px var(--color-accent); }
.avatar-editor-shell button:focus-visible { outline: 2px solid var(--color-accent-light); outline-offset: 3px; }

.avatar-editor-toolbar { position: relative; z-index: 10; display: flex; align-items: center; justify-content: space-between; min-height: 72px; padding: 12px 18px; border-bottom: 1px solid var(--color-border); background: color-mix(in srgb, var(--color-surface) 96%, black); }
.avatar-editor-toolbar__identity,
.avatar-editor-toolbar__actions { display: flex; align-items: center; gap: 10px; }
.avatar-editor-toolbar__identity h1 { margin: 0; color: var(--color-cream); font-size: 17px; font-weight: 700; }
.avatar-editor-toolbar__identity p { margin: 2px 0 0; color: var(--color-muted); font-size: 11px; }
.avatar-icon-button,
.avatar-tool-button,
.avatar-save-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; border: 1px solid var(--color-border); border-radius: 8px; font-size: 12px; font-weight: 650; }
.avatar-icon-button { width: 42px; color: var(--color-muted); background: transparent; }
.avatar-tool-button { padding: 0 13px; color: var(--color-cream); background: var(--color-surface-raised); }
.avatar-save-button { padding: 0 18px; border-color: var(--color-accent); color: #071b18; background: var(--color-accent); }
.avatar-tool-button:disabled,
.avatar-save-button:disabled { cursor: not-allowed; opacity: .42; }
.avatar-save-status { position: absolute; right: 18px; bottom: 2px; margin: 0; color: var(--color-muted); font-size: 10px; }

.avatar-category-rail { display: flex; flex-direction: column; align-items: stretch; gap: 4px; min-width: 0; overflow-y: auto; padding: 10px 8px; border-right: 1px solid var(--color-border); }
.avatar-category-button { position: relative; display: grid; place-items: center; gap: 4px; min-height: 58px; padding: 7px 4px; border: 1px solid transparent; border-radius: 9px; color: var(--color-muted); background: transparent; font-size: 9px; font-weight: 650; }
.avatar-category-button[aria-current="page"] { border-color: color-mix(in srgb, var(--color-accent) 50%, transparent); color: var(--color-accent-light); background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
.avatar-category-button[aria-current="page"]::before { content: ''; position: absolute; left: -8px; width: 3px; height: 28px; border-radius: 0 3px 3px 0; background: var(--color-accent); }

.avatar-options-panel { min-width: 0; overflow-y: auto; padding: 20px; border-left: 1px solid var(--color-border); }
.avatar-options-panel__header { margin-bottom: 18px; }
.avatar-options-panel__header h2 { margin: 0; color: var(--color-cream); font-size: 18px; font-weight: 700; }
.avatar-options-panel__header p { margin: 6px 0 0; color: var(--color-muted); font-size: 12px; line-height: 1.5; }
.avatar-options-panel__section + .avatar-options-panel__section { margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--color-border); }
.avatar-colour-fieldset { margin: 0; padding: 0; border: 0; }
.avatar-colour-fieldset legend { margin-bottom: 10px; color: var(--color-cream); font-size: 12px; font-weight: 650; }
.avatar-colour-palette { display: flex; flex-wrap: wrap; gap: 10px; }

.avatar-option-card__lock,
.avatar-option-card__check { position: absolute; top: 7px; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; }
.avatar-option-card__lock { right: 7px; color: #fbbf24; background: rgb(18 18 18 / .82); }
.avatar-option-card__check { left: 7px; color: #071b18; background: var(--color-accent); }
.avatar-stage__placement { position: absolute; z-index: 3; inset: 0; width: 100%; height: 100%; color: var(--color-accent-light); cursor: crosshair; }
.avatar-stage__placement circle,
.avatar-stage__placement path { fill: none; stroke: currentColor; stroke-width: .35; }

.avatar-pet-tabs { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 4px; margin-bottom: 16px; padding: 4px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-navy); }
.avatar-pet-tabs button { min-height: 38px; border: 0; border-radius: 7px; color: var(--color-muted); background: transparent; font-size: 10px; font-weight: 650; }
.avatar-pet-tabs button[aria-selected="true"] { color: var(--color-cream); background: var(--color-surface-raised); box-shadow: inset 0 0 0 1px var(--color-border-light); }
.avatar-pet-tabs button:disabled { opacity: .35; }
.avatar-pet-level-preview { border-radius: 8px; background: var(--color-navy); }

.avatar-discard-backdrop { position: fixed; z-index: 80; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(0 0 0 / .72); }
.avatar-discard-dialog { width: min(100%, 390px); padding: 22px; border: 1px solid var(--color-border-light); border-radius: 12px; background: var(--color-surface); box-shadow: 0 28px 80px rgb(0 0 0 / .5); }
.avatar-discard-dialog > svg { color: #f59e0b; }
.avatar-discard-dialog h2 { margin: 12px 0 6px; color: var(--color-cream); font-size: 18px; }
.avatar-discard-dialog p { margin: 0; color: var(--color-muted); font-size: 13px; line-height: 1.55; }
.avatar-discard-dialog div { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
.avatar-discard-dialog button { min-height: 42px; padding: 0 14px; border: 1px solid var(--color-border); border-radius: 8px; color: var(--color-cream); background: var(--color-surface-raised); font-size: 12px; font-weight: 650; }
.avatar-discard-dialog button.is-danger { border-color: #ef4444; color: white; background: #dc2626; }
```

- [ ] **Step 4: Implement mobile layout at 720 px and reduced motion**

```css
@media (max-width: 720px) {
  .avatar-editor-toolbar { min-height: 58px; padding: 8px 12px; }
  .avatar-editor-toolbar__identity p,
  .avatar-tool-button span { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .avatar-editor-workspace { grid-template-columns: 1fr; grid-template-rows: minmax(260px, 34dvh) 68px minmax(0, 1fr); }
  .avatar-stage { grid-row: 1; }
  .avatar-stage__character { transform: scale(.82); }
  .avatar-stage__plinth { bottom: 10%; width: 220px; height: 38px; }
  .avatar-category-rail { grid-row: 2; display: flex; gap: 6px; overflow-x: auto; padding: 8px 10px; border-block: 1px solid var(--color-border); }
  .avatar-category-button { flex: 0 0 54px; min-width: 54px; min-height: 50px; }
  .avatar-options-panel { grid-row: 3; border-left: 0; }
  .avatar-option-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .avatar-option-card { min-height: 116px; }
  .avatar-colour-swatch { width: 44px; height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .avatar-editor-shell *,
  .avatar-editor-shell *::before,
  .avatar-editor-shell *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 5: Build and inspect for CSS/compiler errors**

Run:

```powershell
npm run build --prefix frontend
```

Expected: build succeeds with no unresolved imports or CSS parse errors.

- [ ] **Step 6: Commit the visual system**

```powershell
git add frontend/src/components/AvatarEditor.jsx frontend/src/components/avatar-editor/avatarEditor.css
git commit -m "style: create game-like avatar studio"
```

---

### Task 6: Extend Polish overlay coverage for Hero Studio

**Files:**
- Modify: `frontend/src/utils/polishOverlayTranslations.test.js`
- Modify: `polish_translation/pl-runtime.js:655-720`
- Modify: `frontend/public/local-overrides/pl-runtime.js:655-720`

**Interfaces:**
- Consumes: exact English copy rendered by Tasks 2–5.
- Produces: complete Polish rendering and canonical/public overlay parity.

- [ ] **Step 1: Add failing required translations**

```js
const requiredAvatarStudioTranslations = [
  ['Hero Studio', 'Studio Bohatera'],
  ['Randomise', 'Losuj'],
  ['Undo', 'Cofnij'],
  ['Unsaved changes', 'Niezapisane zmiany'],
  ['Your hero is ready', 'Twój bohater jest gotowy'],
  ['Discard changes?', 'Odrzucić zmiany?'],
  ['Your hero has unsaved changes. Leave without saving?', 'Twój bohater ma niezapisane zmiany. Wyjść bez zapisywania?'],
  ['Keep editing', 'Kontynuuj edycję'],
  ['Discard', 'Odrzuć'],
  ['Preview updates instantly', 'Podgląd aktualizuje się od razu'],
  ['Previewing a locked item', 'Podgląd zablokowanego elementu'],
  ['Appearance', 'Wygląd'],
  ['Colours', 'Kolory'],
  ['Accessory', 'Akcesorium'],
  ['Equipment', 'Ekwipunek'],
  ['Background', 'Tło'],
  ['Avatar categories', 'Kategorie avatara'],
  ['Live avatar preview', 'Podgląd avatara na żywo'],
  ['Pet customisation', 'Edycja pupila'],
  ['Multiple selection', 'Wybór wielokrotny'],
  ['Choose a head shape', 'Wybierz kształt głowy'],
  ['Start with the silhouette of your hero.', 'Zacznij od sylwetki swojego bohatera.'],
  ['Choose a skin tone', 'Wybierz odcień skóry'],
  ['Pick the tone that feels right.', 'Wybierz odpowiedni odcień.'],
  ['Style the hair', 'Ułóż włosy'],
  ['Choose a cut, then finish it with colour.', 'Wybierz fryzurę, a potem jej kolor.'],
  ['Choose the eyes', 'Wybierz oczy'],
  ['Give your hero their expression.', 'Nadaj bohaterowi charakter.'],
  ['Choose the smile', 'Wybierz uśmiech'],
  ['Finish the expression.', 'Dopełnij wyraz twarzy.'],
  ['Choose a build', 'Wybierz sylwetkę'],
  ['Set the hero silhouette.', 'Ustal sylwetkę bohatera.'],
  ['Choose outfit colour', 'Wybierz kolor stroju'],
  ['Set the main outfit colour.', 'Ustal główny kolor stroju.'],
  ['Choose a pattern', 'Wybierz wzór'],
  ['Add a final outfit detail.', 'Dodaj ostatni detal stroju.'],
  ['Choose a backdrop', 'Wybierz tło'],
  ['Frame your hero.', 'Nadaj bohaterowi oprawę.'],
  ['Choose headwear', 'Wybierz nakrycie głowy'],
  ['Add a signature finishing touch.', 'Dodaj charakterystyczne wykończenie.'],
  ['Choose face details', 'Wybierz detale twarzy'],
  ['Add freckles, paint, or stickers.', 'Dodaj piegi, malunek lub naklejki.'],
  ['Choose equipment', 'Wybierz ekwipunek'],
  ['Equip more than one item.', 'Możesz założyć więcej niż jeden przedmiot.'],
  ['Customise your companion', 'Dostosuj pupila'],
  ['Style and place your loyal companion.', 'Dostosuj wygląd i pozycję wiernego pupila.'],
];

test('polish overlay translates Hero Studio controls', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    const translations = new Map([...source.matchAll(/^\s*'([^']+)': '([^']*)',/gm)].map((match) => [match[1], match[2]]));
    for (const [english, polish] of requiredAvatarStudioTranslations) {
      assert.equal(translations.get(english), polish, `${fileUrl.pathname} maps ${english} incorrectly`);
    }
  }
});
```

- [ ] **Step 2: Run the translation test and verify the red state**

Run:

```powershell
node --test frontend/src/utils/polishOverlayTranslations.test.js
```

Expected: FAIL at the first missing Hero Studio translation.

- [ ] **Step 3: Add exact dictionary entries to both overlays**

```js
'Hero Studio': 'Studio Bohatera',
'Randomise': 'Losuj',
'Undo': 'Cofnij',
'Unsaved changes': 'Niezapisane zmiany',
'Your hero is ready': 'Twój bohater jest gotowy',
'Discard changes?': 'Odrzucić zmiany?',
'Your hero has unsaved changes. Leave without saving?': 'Twój bohater ma niezapisane zmiany. Wyjść bez zapisywania?',
'Keep editing': 'Kontynuuj edycję',
'Discard': 'Odrzuć',
'Preview updates instantly': 'Podgląd aktualizuje się od razu',
'Previewing a locked item': 'Podgląd zablokowanego elementu',
'Appearance': 'Wygląd',
'Colours': 'Kolory',
'Accessory': 'Akcesorium',
'Equipment': 'Ekwipunek',
'Background': 'Tło',
'Avatar categories': 'Kategorie avatara',
'Live avatar preview': 'Podgląd avatara na żywo',
'Pet customisation': 'Edycja pupila',
'Multiple selection': 'Wybór wielokrotny',
'Choose a head shape': 'Wybierz kształt głowy',
'Start with the silhouette of your hero.': 'Zacznij od sylwetki swojego bohatera.',
'Choose a skin tone': 'Wybierz odcień skóry',
'Pick the tone that feels right.': 'Wybierz odpowiedni odcień.',
'Style the hair': 'Ułóż włosy',
'Choose a cut, then finish it with colour.': 'Wybierz fryzurę, a potem jej kolor.',
'Choose the eyes': 'Wybierz oczy',
'Give your hero their expression.': 'Nadaj bohaterowi charakter.',
'Choose the smile': 'Wybierz uśmiech',
'Finish the expression.': 'Dopełnij wyraz twarzy.',
'Choose a build': 'Wybierz sylwetkę',
'Set the hero silhouette.': 'Ustal sylwetkę bohatera.',
'Choose outfit colour': 'Wybierz kolor stroju',
'Set the main outfit colour.': 'Ustal główny kolor stroju.',
'Choose a pattern': 'Wybierz wzór',
'Add a final outfit detail.': 'Dodaj ostatni detal stroju.',
'Choose a backdrop': 'Wybierz tło',
'Frame your hero.': 'Nadaj bohaterowi oprawę.',
'Choose headwear': 'Wybierz nakrycie głowy',
'Add a signature finishing touch.': 'Dodaj charakterystyczne wykończenie.',
'Choose face details': 'Wybierz detale twarzy',
'Add freckles, paint, or stickers.': 'Dodaj piegi, malunek lub naklejki.',
'Choose equipment': 'Wybierz ekwipunek',
'Equip more than one item.': 'Możesz założyć więcej niż jeden przedmiot.',
'Customise your companion': 'Dostosuj pupila',
'Style and place your loyal companion.': 'Dostosuj wygląd i pozycję wiernego pupila.',
```

Copy the canonical overlay to the frontend public path and verify exact parity:

```powershell
Copy-Item -LiteralPath polish_translation\pl-runtime.js -Destination frontend\public\local-overrides\pl-runtime.js -Force
$left=(Get-FileHash polish_translation\pl-runtime.js).Hash
$right=(Get-FileHash frontend\public\local-overrides\pl-runtime.js).Hash
if($left -ne $right){ throw 'Polish overlay copies differ' }
```

- [ ] **Step 4: Run translation, full tests, and build**

Run:

```powershell
node --test frontend/src/utils/polishOverlayTranslations.test.js
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
```

Expected: all tests PASS and build succeeds.

- [ ] **Step 5: Commit translations**

```powershell
git add frontend/src/utils/polishOverlayTranslations.test.js polish_translation/pl-runtime.js frontend/public/local-overrides/pl-runtime.js
git commit -m "feat: translate avatar hero studio"
```

---

### Task 7: Browser fidelity, interaction, and responsive QA

**Files:**
- Modify: `frontend/src/components/AvatarEditor.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarEditorToolbar.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarDiscardDialog.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarCategoryRail.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarOptionControls.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarStage.jsx`
- Modify: `frontend/src/components/avatar-editor/AvatarOptionsPanel.jsx`
- Modify: `frontend/src/components/avatar-editor/PetCustomizer.jsx`
- Modify: `frontend/src/components/avatar-editor/avatarEditor.css`
- Modify: `frontend/src/components/avatar-editor/avatarEditorState.test.js`
- Modify: `frontend/src/components/avatar-editor/avatarEditorStructure.test.js`

**Interfaces:**
- Consumes: accepted desktop/mobile concept images and working local app.
- Produces: screenshot evidence, fidelity ledger, and verified core workflow.

- [ ] **Step 1: Run clean automated verification**

```powershell
git diff --check
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
```

Expected: no whitespace errors, all tests PASS, build succeeds.

- [ ] **Step 2: Start isolated local QA services**

Use a workspace-local QA database, never the user's existing data:

```powershell
$env:DATABASE_URL='sqlite+aiosqlite:///C:/ChoreQuest/.codex-avatar-studio-qa.db'
Start-Process -FilePath python -ArgumentList '-m','uvicorn','backend.main:app','--host','127.0.0.1','--port','8122' -WorkingDirectory 'C:\ChoreQuest' -WindowStyle Hidden
Start-Process -FilePath npm -ArgumentList 'run','dev','--prefix','frontend','--','--host','127.0.0.1' -WorkingDirectory 'C:\ChoreQuest' -WindowStyle Hidden
```

Create the first local QA user through `/register`, then open `/avatar` at `http://127.0.0.1:5173/avatar`.

- [ ] **Step 3: Verify desktop fidelity at 1440 × 900 in Browser/IAB**

Capture a screenshot and compare it directly to the accepted desktop concept with `view_image`. Record at least these comparison points:

1. toolbar copy and hierarchy;
2. 84 px category rail and active state;
3. avatar scale, stage lighting, and plinth;
4. 380–440 px options panel and three-column card grid;
5. typography, borders, radii, and accent colour;
6. absence of dead horizontal space and page overflow.

Fix every visible mismatch that would receive a design-review comment, then recapture.

- [ ] **Step 4: Verify core interactions**

Exercise and observe authoritative UI state after each action:

- change head, hair, eyes, outfit colour, and background;
- select and clear multiple equipment items;
- hover a locked item and verify temporary stage preview reverts on leave;
- use Randomise and verify the avatar changes;
- use Undo and verify the exact prior configuration returns;
- choose a pet, switch all four pet sections, change part colours, choose custom position, and place it on the stage;
- click Back with dirty state, cancel discard, then confirm discard;
- force one save failure by stopping the backend and verify retryable error state;
- restart backend, save successfully, and verify the user avatar updates.

- [ ] **Step 5: Verify mobile fidelity at 390 × 844**

Capture a screenshot and compare it directly to the accepted mobile concept with `view_image`. Verify:

- toolbar controls remain reachable;
- avatar preview stays visible above options;
- category rail scrolls horizontally with 44 px minimum targets;
- option cards remain legible and do not overflow;
- colour swatches are 44 px;
- long pet content scrolls inside the lower panel;
- no horizontal page overflow or clipped primary content.

- [ ] **Step 6: Verify accessibility and reduced motion**

Use keyboard navigation for Back, category buttons, option cards, colour swatches, Randomise, Undo, and Save. Confirm visible focus, semantic selected states, live save status, and that reduced-motion emulation suppresses decorative transitions.

- [ ] **Step 7: Write and satisfy the fidelity ledger**

Record the final ledger in the task notes using this exact format:

```text
Mismatch | Concept evidence | Render evidence | Fix
Toolbar hierarchy | Primary save action at top right | Save competed with randomise | Increased save contrast and reduced secondary button weight
Stage scale | Avatar dominates centre stage | Avatar rendered below target scale | Added studio size and corrected mobile scale
Option cards | Three visual columns | Labels wrapped to three lines | Clamped labels and increased card width
Mobile rail | Single horizontal icon row | Two-row wrap at 390 px | Forced no-wrap overflow rail
Focus state | Visible accent outline | Swatches had no visible focus | Added 2 px accent focus ring
```

No row may remain without either a completed fix or an explicit, user-approved deviation.

- [ ] **Step 8: Run final verification and remove QA artifacts**

```powershell
git diff --check
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
```

Stop only the QA processes started in Step 2. Resolve `C:\ChoreQuest\.codex-avatar-studio-qa.db` and delete it only after verifying it is inside `C:\ChoreQuest`.

- [ ] **Step 9: Commit QA fixes**

```powershell
git add frontend/src/components/AvatarEditor.jsx frontend/src/components/AvatarDisplay.jsx frontend/src/components/avatar-editor frontend/src/utils/polishOverlayTranslations.test.js polish_translation/pl-runtime.js frontend/public/local-overrides/pl-runtime.js
git commit -m "fix: polish avatar studio experience"
```

If Step 7 required no tracked changes after the previous commit, skip this commit and report that no QA-only code changes were needed.

---

## Final Acceptance Checklist

- The accepted desktop and mobile concepts were inspected with `view_image` beside final browser screenshots.
- The above-the-fold copy matches the approved design and Polish overlay.
- All 13 categories are reachable and use the correct current values.
- Option thumbnails are code-native SVG previews, not raster UI screenshots.
- Locked previews, accessory multi-select, pet progression, custom placement, randomise, undo, dirty guard, save error, and save success all work.
- Desktop 1440 × 900 and mobile 390 × 844 pass visual QA.
- Keyboard focus, semantic selection state, live status, and reduced motion pass.
- `git diff --check`, all frontend Node tests, and production build pass.
- Temporary databases, logs, screenshots, and other QA artifacts are removed unless explicitly retained as accepted design references.
