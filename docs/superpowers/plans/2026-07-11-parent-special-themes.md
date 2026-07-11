# Parent Special Themes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Birthday, Halloween, April Fools' Day, Wet Monday, and Summer Vacation to the parent-controlled family-wide visual themes alongside Easter and Christmas.

**Architecture:** Restore the existing family special-theme API and UI from three focused historical commits, then extend the backend allowlist and frontend registry. `ThemeProvider` applies the family selection over personal colors; `SeasonalThemeLayer` renders non-interactive decorations, and CSS supplies light/dark palettes and motion-safe responsive behavior.

**Tech Stack:** FastAPI, SQLAlchemy, Pydantic, React 18, Vite 6, Tailwind CSS 4, Python `unittest`, Node.js test runner.

## Global Constraints

- Summer Vacation is visual only; it must not call Vacation Mode APIs or change assignments, scheduling, or streaks.
- Only parents and administrators may change the family theme; all authenticated users may read it.
- Keep `none`, `easter`, and `christmas` backward-compatible.
- Decorations remain `pointer-events-none` and `aria-hidden="true"`.
- Prima Aprilis changes decorations only, never controls or user content.
- Support light/dark mode, mobile particle reduction, and `prefers-reduced-motion`.
- Keep `polish_translation/pl-runtime.js` and `frontend/public/local-overrides/pl-runtime.js` synchronized.
- Add no dependency and no database migration.

---

## File map

- `backend/services/family_theme.py`: backend allowlist and normalization.
- `backend/routers/theme.py`: authenticated read and parent-only write.
- `backend/tests/test_family_theme.py`: validation and authorization tests.
- `frontend/src/utils/themeResolver.js`: display catalog, normalization, precedence.
- `frontend/src/utils/themeResolver.test.js`: catalog and resolver tests.
- `frontend/src/hooks/useTheme.jsx`: persistence, realtime refresh, root classes.
- `frontend/src/pages/Settings.jsx`: registry-driven parent picker.
- `frontend/src/components/SeasonalThemeLayer.jsx`: decorations only.
- `frontend/src/components/SeasonalThemeLayer.test.js`: support and accessibility invariants.
- `frontend/src/index.css`: palettes and animation.
- `frontend/src/utils/polishOverlayTranslations.test.js`: overlay parity.
- Both `pl-runtime.js` files: Polish mappings.
- `static/`: generated production frontend.

### Task 1: Restore the Easter and Christmas baseline

**Files:**
- Create: `backend/routers/theme.py`, `backend/services/family_theme.py`, `backend/tests/test_family_theme.py`
- Create: `frontend/src/utils/themeResolver.js`, `frontend/src/utils/themeResolver.test.js`
- Create: `frontend/src/components/SeasonalThemeLayer.jsx`, `frontend/src/components/SeasonalThemeLayer.test.js`
- Modify: `backend/main.py`, `backend/seed.py`
- Modify: `frontend/src/main.jsx`, `frontend/src/hooks/useTheme.jsx`, `frontend/src/components/Layout.jsx`
- Modify: `frontend/src/pages/Profile.jsx`, `frontend/src/pages/Settings.jsx`, `frontend/src/index.css`
- Modify: `frontend/public/local-overrides/pl-runtime.js`

**Interfaces:**
- Produces: `GET /api/theme/special`, `PUT /api/theme/special`, `normalize_special_theme(value: str) -> str`.
- Produces: `SPECIAL_THEMES`, `resolveEffectiveTheme`, `SeasonalThemeLayer({ theme })`.
- Produces: `useTheme()` fields `specialTheme`, `setSpecialTheme`, `specialThemeSaving`, `specialThemeError`, `effectiveTheme`.

- [ ] **Step 1: Confirm focused source commits**

```powershell
git show --quiet --oneline 01cf3c7
git show --quiet --oneline 14a24b6
git show --quiet --oneline feeab3a
```

Expected: family API, consistent theme resolution, and parent holiday UI commits are shown.

- [ ] **Step 2: Apply only those commits**

```powershell
git cherry-pick 01cf3c7 14a24b6 feeab3a
```

If `backend/main.py` conflicts because historical context mentions removed `bad_behaviors`, retain the current routers and add `theme` exactly here:

```python
from backend.routers import (  # noqa: E402
    auth, chores, rewards, points, stats, calendar,
    notifications, admin, avatar, wishlist, events, spin, rotations, uploads, push,
    shoutouts, vacation, progress, emotes, announcements, pets, theme,
)
```

Keep `app.include_router(theme.router)` immediately after `app.include_router(pets.router)`, then:

```powershell
git add backend/main.py
git cherry-pick --continue
```

- [ ] **Step 3: Verify baseline**

```powershell
python -m unittest backend.tests.test_family_theme -v
node --test frontend/src/utils/themeResolver.test.js frontend/src/components/SeasonalThemeLayer.test.js
npm run build --prefix frontend
```

Expected: 4 Python tests, 5 Node tests, and Vite build pass. The cherry-picks are the three baseline commits.

### Task 2: Extend backend validation

**Files:**
- Modify: `backend/tests/test_family_theme.py:10`
- Modify: `backend/services/family_theme.py:1`

**Interfaces:**
- Consumes: `normalize_special_theme(value: str) -> str`.
- Produces: support for the five new IDs.

- [ ] **Step 1: Write the failing test**

Replace the first two test methods:

```python
    def test_accepts_supported_special_themes(self):
        supported = (
            "none", "easter", "christmas", "birthday", "halloween",
            "april_fools", "wet_monday", "summer_vacation",
        )
        for value in supported:
            with self.subTest(value=value):
                self.assertEqual(normalize_special_theme(value), value)

    def test_rejects_unknown_special_theme(self):
        with self.assertRaises(ValueError):
            normalize_special_theme("autumn")
```

- [ ] **Step 2: Verify RED**

```powershell
python -m unittest backend.tests.test_family_theme.FamilyThemeTest.test_accepts_supported_special_themes -v
```

Expected: FAIL at `birthday`.

- [ ] **Step 3: Implement the allowlist**

```python
SPECIAL_THEME_KEY = "special_theme"
SPECIAL_THEMES = (
    "none", "easter", "christmas", "birthday", "halloween",
    "april_fools", "wet_monday", "summer_vacation",
)
```

Keep `normalize_special_theme` unchanged.

- [ ] **Step 4: Verify GREEN and commit**

```powershell
python -m unittest backend.tests.test_family_theme -v
git add backend/services/family_theme.py backend/tests/test_family_theme.py
git commit -m "feat: allow additional family special themes"
```

Expected: all 4 tests pass before commit.

### Task 3: Extend frontend catalog and class resolution

**Files:**
- Modify: `frontend/src/utils/themeResolver.test.js:1`
- Modify: `frontend/src/utils/themeResolver.js:11`
- Modify: `frontend/src/hooks/useTheme.jsx:10`

**Interfaces:**
- Produces: `SPECIAL_THEME_IDS: string[]`.
- Produces: `{ id, label, icon, description, colors }` for five themes.
- Consumes: `SPECIAL_THEME_IDS` in `ThemeProvider`.

- [ ] **Step 1: Write failing catalog tests**

Import `SPECIAL_THEME_IDS`, retain existing fallback/role tests, and add:

```javascript
const EXPECTED_SPECIAL_THEME_IDS = [
  'none', 'easter', 'christmas', 'birthday', 'halloween',
  'april_fools', 'wet_monday', 'summer_vacation',
];

test('catalog exposes every family special theme in stable order', () => {
  assert.deepEqual(SPECIAL_THEME_IDS, EXPECTED_SPECIAL_THEME_IDS);
  assert.deepEqual(SPECIAL_THEMES.map(({ id }) => id), EXPECTED_SPECIAL_THEME_IDS);
});

test('every decorative theme overrides a personal theme', () => {
  for (const themeId of EXPECTED_SPECIAL_THEME_IDS.slice(1)) {
    assert.equal(resolveEffectiveTheme('forest', themeId), themeId);
  }
});
```

- [ ] **Step 2: Verify RED**

```powershell
node --test frontend/src/utils/themeResolver.test.js
```

Expected: FAIL because the export and records are absent.

- [ ] **Step 3: Add exact records**

Append after Christmas:

```javascript
  {
    id: 'birthday', label: 'Birthday', icon: '🎂',
    description: 'Confetti, balloons and a birthday cake',
    colors: ['#ec4899', '#8b5cf6', '#fbbf24'],
  },
  {
    id: 'halloween', label: 'Halloween', icon: '🎃',
    description: 'Pumpkins, friendly ghosts and flying bats',
    colors: ['#f97316', '#9333ea', '#18181b'],
  },
  {
    id: 'april_fools', label: "April Fools' Day", icon: '🃏',
    description: 'Colourful streamers and playful decorations',
    colors: ['#db2777', '#06b6d4', '#facc15'],
  },
  {
    id: 'wet_monday', label: 'Wet Monday', icon: '💦',
    description: 'Droplets, splashes and water play',
    colors: ['#06b6d4', '#2563eb', '#2dd4bf'],
  },
  {
    id: 'summer_vacation', label: 'Summer Vacation', icon: '🏖️',
    description: 'Sunshine, palms and a beach atmosphere',
    colors: ['#38bdf8', '#facc15', '#fb7185'],
  },
```

After the array:

```javascript
export const SPECIAL_THEME_IDS = SPECIAL_THEMES.map(({ id }) => id);

const PERSONAL_THEME_SET = new Set(PERSONAL_THEME_IDS);
const SPECIAL_THEME_SET = new Set(SPECIAL_THEME_IDS);
```

- [ ] **Step 4: Derive root classes from the catalog**

Import `SPECIAL_THEME_IDS` in `useTheme.jsx` and use:

```javascript
const ALL_THEME_CLASS_IDS = [
  ...COLOR_THEMES.map(({ id }) => id),
  ...SPECIAL_THEME_IDS,
].filter((id) => id !== 'default' && id !== 'none');
```

- [ ] **Step 5: Verify GREEN and commit**

```powershell
node --test frontend/src/utils/themeResolver.test.js
git add frontend/src/utils/themeResolver.js frontend/src/utils/themeResolver.test.js frontend/src/hooks/useTheme.jsx
git commit -m "feat: register additional family themes"
```

Expected: all resolver tests pass.

### Task 4: Render every decorative theme

**Files:**
- Modify: `frontend/src/components/SeasonalThemeLayer.test.js:1`
- Modify: `frontend/src/components/SeasonalThemeLayer.jsx:1`

**Interfaces:**
- Consumes: catalog IDs.
- Produces: fixed non-interactive decorations for every non-`none` theme.

- [ ] **Step 1: Write failing source invariants**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SPECIAL_THEME_IDS } from '../utils/themeResolver.js';

const source = readFileSync(new URL('./SeasonalThemeLayer.jsx', import.meta.url), 'utf8');

test('seasonal layer is decorative and non-interactive', () => {
  assert.match(source, /aria-hidden="true"/);
  assert.match(source, /pointer-events-none/);
});

test('seasonal layer routes every configured decorative theme', () => {
  for (const id of SPECIAL_THEME_IDS.filter((value) => value !== 'none')) {
    assert.match(source, new RegExp(`(?:${id}:|['"]${id}['"])`), `missing ${id}`);
  }
});
```

- [ ] **Step 2: Verify RED**

```powershell
node --test frontend/src/components/SeasonalThemeLayer.test.js
```

Expected: FAIL at `birthday`.

- [ ] **Step 3: Add decoration data**

```javascript
const EXTRA_THEME_DECORATIONS = {
  birthday: {
    top: ['🎈', '🎉', '🎈'], particles: ['●', '◆', '■', '▲'],
    left: '🎂', right: '🎁',
  },
  halloween: {
    top: ['🦇', '🌙', '🦇'], particles: ['🦇', '✦', '👻'],
    left: '🎃', right: '👻',
  },
  april_fools: {
    top: ['🎭', '🃏', '🎭'], particles: ['?', '!', '★', '◆'],
    left: '🤡', right: '🪄',
  },
  wet_monday: {
    top: ['💧', '💦', '💧'], particles: ['💧', '•', '💦'],
    left: '🪣', right: '🔫',
  },
  summer_vacation: {
    top: ['☀️', '🕶️', '☀️'], particles: ['☀', '✦', '🌺'],
    left: '🌴', right: '🏖️',
  },
};
```

- [ ] **Step 4: Add shared renderer below `EasterLayer`**

```jsx
function ExtraThemeLayer({ theme }) {
  const decoration = EXTRA_THEME_DECORATIONS[theme];
  if (!decoration) return null;

  return (
    <>
      <div className={`seasonal-garland seasonal-garland-${theme}`}>
        {decoration.top.map((symbol, index) => (
          <span key={`${symbol}-${index}`} className="seasonal-top-symbol"
            style={{ '--seasonal-index': index }}>{symbol}</span>
        ))}
      </div>
      <div className={`seasonal-particles seasonal-particles-${theme}`}>
        {PARTICLES.map((particle) => (
          <span key={particle.id}
            className={`seasonal-particle seasonal-extra-particle seasonal-${theme}-particle`}
            style={{
              '--seasonal-left': `${particle.left}%`,
              '--seasonal-delay': `${particle.delay}s`,
              '--seasonal-duration': `${particle.duration + 2}s`,
              '--seasonal-size': `${particle.size}px`,
              '--seasonal-sway': `${particle.sway}px`,
            }}>
            {decoration.particles[particle.id % decoration.particles.length]}
          </span>
        ))}
      </div>
      <div className="seasonal-corner seasonal-corner-left">{decoration.left}</div>
      <div className="seasonal-corner seasonal-corner-right">{decoration.right}</div>
      <div className={`seasonal-bottom seasonal-bottom-${theme}`} />
    </>
  );
}
```

- [ ] **Step 5: Route all themes**

```jsx
export default function SeasonalThemeLayer({ theme }) {
  const isDecorativeTheme = [
    'christmas', 'easter', 'birthday', 'halloween',
    'april_fools', 'wet_monday', 'summer_vacation',
  ].includes(theme);
  if (!isDecorativeTheme) return null;

  return (
    <div className={`seasonal-theme-layer seasonal-theme-${theme} fixed inset-0 z-[1] overflow-hidden pointer-events-none`}
      aria-hidden="true">
      {theme === 'christmas' ? <ChristmasLayer /> : null}
      {theme === 'easter' ? <EasterLayer /> : null}
      {EXTRA_THEME_DECORATIONS[theme] ? <ExtraThemeLayer theme={theme} /> : null}
    </div>
  );
}
```

- [ ] **Step 6: Verify GREEN and commit**

```powershell
node --test frontend/src/components/SeasonalThemeLayer.test.js frontend/src/utils/themeResolver.test.js
git add frontend/src/components/SeasonalThemeLayer.jsx frontend/src/components/SeasonalThemeLayer.test.js
git commit -m "feat: render additional seasonal decorations"
```

Expected: focused tests pass.

### Task 5: Add palettes and motion-safe styling

**Files:**
- Modify: `frontend/src/index.css` family-theme and seasonal-layer sections.

**Interfaces:**
- Consumes: five root classes and decoration classes.
- Produces: light/dark palettes, responsive density, reduced motion.

- [ ] **Step 1: Add dark/light variables**

Add beside existing special themes:

```css
.theme-birthday {
  --color-sky: #c084fc; --color-accent: #ec4899; --color-accent-light: #fbbf24;
  --color-gold: #fbbf24; --color-navy: #180d20; --color-navy-light: #24112f;
  --color-navy-mid: #351942; --color-surface: #271331; --color-surface-raised: #3a1c48;
  --color-border: #5b2b6d; --color-border-light: #86429b; --color-cream: #fff7fd; --color-muted: #d8bdd8;
}
.theme-birthday.light-mode {
  --color-navy: #fff7fc; --color-navy-light: #fce7f3; --color-surface: #fff;
  --color-surface-raised: #fff1f8; --color-border: #f0bddc; --color-border-light: #df8fbe;
  --color-cream: #462038; --color-muted: #805b70;
}
.theme-halloween {
  --color-sky: #a855f7; --color-accent: #f97316; --color-accent-light: #a855f7;
  --color-gold: #fbbf24; --color-navy: #0f0a14; --color-navy-light: #191020;
  --color-surface: #1b1022; --color-surface-raised: #2b1835; --color-border: #4b2859;
  --color-border-light: #754088; --color-cream: #fff7ed; --color-muted: #cbb8cf;
}
.theme-halloween.light-mode {
  --color-navy: #fff7ed; --color-navy-light: #ffedd5; --color-surface: #fff;
  --color-surface-raised: #fff7ed; --color-border: #d8b4fe; --color-border-light: #c084fc;
  --color-cream: #3b1d13; --color-muted: #765b52;
}
.theme-april_fools {
  --color-sky: #22d3ee; --color-accent: #db2777; --color-accent-light: #22d3ee;
  --color-gold: #facc15; --color-navy: #101126; --color-navy-light: #181a35;
  --color-surface: #1b1d38; --color-surface-raised: #292c50; --color-border: #414676;
  --color-border-light: #6369a0; --color-cream: #fffafd; --color-muted: #c7c5dc;
}
.theme-april_fools.light-mode {
  --color-navy: #fffdf2; --color-navy-light: #fef9c3; --color-surface: #fff;
  --color-surface-raised: #fffbea; --color-border: #a5f3fc; --color-border-light: #67e8f9;
  --color-cream: #342044; --color-muted: #705d78;
}
.theme-wet_monday {
  --color-sky: #38bdf8; --color-accent: #06b6d4; --color-accent-light: #2dd4bf;
  --color-gold: #67e8f9; --color-navy: #061523; --color-navy-light: #0a2133;
  --color-surface: #0c2639; --color-surface-raised: #12384f; --color-border: #1d5670;
  --color-border-light: #2f7894; --color-cream: #f0fdff; --color-muted: #acd1dc;
}
.theme-wet_monday.light-mode {
  --color-navy: #effcff; --color-navy-light: #cffafe; --color-surface: #fff;
  --color-surface-raised: #ecfeff; --color-border: #a5e7f3; --color-border-light: #67d4e8;
  --color-cream: #123744; --color-muted: #587680;
}
.theme-summer_vacation {
  --color-sky: #38bdf8; --color-accent: #fb7185; --color-accent-light: #facc15;
  --color-gold: #facc15; --color-navy: #071a25; --color-navy-light: #0c2735;
  --color-surface: #0e2c3a; --color-surface-raised: #154052; --color-border: #236076;
  --color-border-light: #37839b; --color-cream: #fffdf0; --color-muted: #b7d4d6;
}
.theme-summer_vacation.light-mode {
  --color-navy: #f0fbff; --color-navy-light: #e0f5fb; --color-surface: #fff;
  --color-surface-raised: #fffbea; --color-border: #a7dce8; --color-border-light: #66bfd3;
  --color-cream: #173b43; --color-muted: #58757a;
}
```

- [ ] **Step 2: Extend ambient selectors**

```css
:is(.theme-christmas, .theme-easter, .theme-birthday, .theme-halloween, .theme-april_fools, .theme-wet_monday, .theme-summer_vacation) body {
  background:
    radial-gradient(circle at 12% -5%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 30%),
    radial-gradient(circle at 88% 0%, color-mix(in srgb, var(--color-accent-light) 14%, transparent), transparent 28%),
    var(--color-navy);
}
:is(.theme-christmas, .theme-easter, .theme-birthday, .theme-halloween, .theme-april_fools, .theme-wet_monday, .theme-summer_vacation) .game-panel {
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}
```

- [ ] **Step 3: Add decoration styles and keyframes**

```css
.seasonal-garland-birthday, .seasonal-garland-halloween, .seasonal-garland-april_fools,
.seasonal-garland-wet_monday, .seasonal-garland-summer_vacation {
  gap: min(18vw, 180px); padding-top: 5px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--color-accent-light) 16%, transparent), transparent);
}
.seasonal-top-symbol {
  font-size: clamp(24px, 4vw, 38px);
  animation: seasonal-symbol-float 3.4s ease-in-out infinite alternate;
  animation-delay: calc(var(--seasonal-index) * -0.55s);
}
.seasonal-extra-particle {
  display: grid; place-items: center; font-size: var(--seasonal-size);
  animation: seasonal-extra-fall var(--seasonal-duration) linear infinite;
  animation-delay: var(--seasonal-delay);
}
.seasonal-birthday-particle { color: #fbbf24; }
.seasonal-halloween-particle { color: #f97316; }
.seasonal-april_fools-particle { color: #22d3ee; animation-name: seasonal-fool-fall; }
.seasonal-wet_monday-particle { color: #67e8f9; }
.seasonal-summer_vacation-particle { color: #facc15; }
.seasonal-bottom-birthday { background: linear-gradient(90deg, #ec4899, #fbbf24, #8b5cf6); height: 5px; }
.seasonal-bottom-halloween { background: repeating-linear-gradient(135deg, #18181b 0 16px, #f97316 16px 32px); height: 6px; }
.seasonal-bottom-april_fools { background: linear-gradient(90deg, #db2777, #06b6d4, #facc15); height: 5px; }
.seasonal-bottom-wet_monday { background: radial-gradient(40px 10px at 20% 100%, #38bdf8aa, transparent 75%), radial-gradient(55px 12px at 75% 100%, #2dd4bf99, transparent 75%); }
.seasonal-bottom-summer_vacation { background: linear-gradient(180deg, transparent, #facc1555 45%, #fbbf2488); }

@keyframes seasonal-symbol-float {
  from { transform: translateY(-2px) rotate(-8deg); }
  to { transform: translateY(5px) rotate(8deg); }
}
@keyframes seasonal-extra-fall {
  0% { transform: translate3d(0, -24px, 0) rotate(0deg); }
  50% { transform: translate3d(var(--seasonal-sway), 50vh, 0) rotate(170deg); }
  100% { transform: translate3d(0, 104vh, 0) rotate(350deg); }
}
@keyframes seasonal-fool-fall {
  0% { transform: translate3d(0, -24px, 0) rotate(0deg); }
  45% { transform: translate3d(var(--seasonal-sway), 45vh, 0) rotate(-190deg); }
  100% { transform: translate3d(calc(var(--seasonal-sway) * -0.5), 104vh, 0) rotate(390deg); }
}
```

- [ ] **Step 4: Extend mobile and reduced-motion blocks**

Mobile:

```css
  .seasonal-top-symbol { font-size: 24px; }
  .seasonal-garland-birthday, .seasonal-garland-halloween, .seasonal-garland-april_fools,
  .seasonal-garland-wet_monday, .seasonal-garland-summer_vacation { gap: 18vw; }
```

Reduced motion:

```css
  .seasonal-particle,
  .seasonal-light,
  .seasonal-top-symbol {
    animation: none !important;
  }
```

- [ ] **Step 5: Build and commit**

```powershell
npm run build --prefix frontend
git add frontend/src/index.css
git commit -m "feat: style additional family themes"
```

Expected: Vite succeeds.

### Task 6: Add Polish localization

**Files:**
- Modify: `frontend/src/utils/polishOverlayTranslations.test.js`
- Modify: `polish_translation/pl-runtime.js`
- Modify: `frontend/public/local-overrides/pl-runtime.js`

**Interfaces:**
- Consumes: English registry copy.
- Produces: identical Polish mappings in both overlays.

- [ ] **Step 1: Write a failing parity test**

```javascript
const requiredSpecialThemeTranslations = [
  ['Birthday', 'Urodziny'],
  ['Halloween', 'Halloween'],
  ["April Fools' Day", 'Prima Aprilis'],
  ['Wet Monday', 'Śmigus Dyngus'],
  ['Summer Vacation', 'Wakacje'],
  ['Confetti, balloons and a birthday cake', 'Konfetti, balony i urodzinowy tort'],
  ['Pumpkins, friendly ghosts and flying bats', 'Dynie, przyjazne duszki i latające nietoperze'],
  ['Colourful streamers and playful decorations', 'Kolorowe serpentyny i psotne dekoracje'],
  ['Droplets, splashes and water play', 'Krople, rozbryzgi i wodna zabawa'],
  ['Sunshine, palms and a beach atmosphere', 'Słońce, palmy i plażowa atmosfera'],
];

test('polish overlay translates every family special theme', () => {
  for (const fileUrl of overlayFiles) {
    const source = fs.readFileSync(fileUrl, 'utf8');
    for (const [english, polish] of requiredSpecialThemeTranslations) {
      const key = english.replaceAll("'", "\\'");
      assert.equal(source.includes(`'${key}': '${polish}',`), true, `${fileUrl.pathname}: ${english}`);
    }
  }
});
```

- [ ] **Step 2: Verify RED**

```powershell
node --test frontend/src/utils/polishOverlayTranslations.test.js
```

Expected: FAIL because `Birthday` is absent.

- [ ] **Step 3: Add mappings to both overlays**

```javascript
    'Birthday': 'Urodziny',
    'Halloween': 'Halloween',
    'April Fools\' Day': 'Prima Aprilis',
    'Wet Monday': 'Śmigus Dyngus',
    'Summer Vacation': 'Wakacje',
    'Confetti, balloons and a birthday cake': 'Konfetti, balony i urodzinowy tort',
    'Pumpkins, friendly ghosts and flying bats': 'Dynie, przyjazne duszki i latające nietoperze',
    'Colourful streamers and playful decorations': 'Kolorowe serpentyny i psotne dekoracje',
    'Droplets, splashes and water play': 'Krople, rozbryzgi i wodna zabawa',
    'Sunshine, palms and a beach atmosphere': 'Słońce, palmy i plażowa atmosfera',
```

- [ ] **Step 4: Verify and commit**

```powershell
node --test "frontend/src/**/*.test.js"
git add frontend/src/utils/polishOverlayTranslations.test.js polish_translation/pl-runtime.js frontend/public/local-overrides/pl-runtime.js
git commit -m "feat: translate additional family themes"
```

Expected: all discovered Node tests pass.

### Task 7: Full verification, visual QA, and production assets

**Files:**
- Regenerate: `static/`
- Update only if present and reusable: `/srv/AGENTS.md` or `C:\ChoreQuest\srv\AGENTS.md`

- [ ] **Step 1: Run full automated verification**

```powershell
python -m unittest discover -s backend/tests -v
node --test "frontend/src/**/*.test.js"
npm run build --prefix frontend
```

Expected: every test and the Vite build pass.

- [ ] **Step 2: Start the documented local app and inspect settings**

Use the current startup command from `README.md`, verify `/api/health` returns `{"status":"ok"}`, sign in as a parent, and open Family Settings.

Expected: None, Easter, Christmas, Birthday, Halloween, April Fools' Day, Wet Monday, and Summer Vacation appear in that order.

- [ ] **Step 3: Perform browser QA**

For each new card: select it, confirm the active state and decorations, navigate to a child page, and confirm controls remain usable. Inspect 390 × 844 and 1280 × 800 in light/dark modes. Emulate reduced motion.

Expected: no console errors, blocked clicks, clipped controls, unreadable text, or business-state changes. Summer Vacation does not create a vacation or pause chores.

- [ ] **Step 4: Generate tracked frontend assets**

From `frontend`:

```powershell
npx vite build --outDir ../static --emptyOutDir
```

Expected: `static/index.html` points to new hashed assets.

- [ ] **Step 5: Re-run focused smoke checks**

```powershell
git diff --check
python -m unittest backend.tests.test_family_theme -v
node --test frontend/src/utils/themeResolver.test.js frontend/src/components/SeasonalThemeLayer.test.js frontend/src/utils/polishOverlayTranslations.test.js
```

Expected: no whitespace errors and all focused tests pass.

- [ ] **Step 6: Honor the AGENTS instruction**

Check `/srv/AGENTS.md` through WSL and `C:\ChoreQuest\srv\AGENTS.md`. If one exists, append a reusable note that special-theme IDs must stay synchronized across the backend allowlist, frontend registry, theme-class application, both Polish overlays, and seasonal-layer tests. If neither exists, do not create a replacement.

- [ ] **Step 7: Commit generated assets**

```powershell
git add static
git commit -m "build: publish additional family themes"
```

If an existing AGENTS file was updated, stage it before the commit. Expected: generated production assets and no unrelated files.
