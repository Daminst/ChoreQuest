# Parent-controlled special themes

## Goal

Extend the existing family-wide visual theme feature beyond Easter and Christmas with five parent-selectable themes:

- Birthday
- Halloween
- April Fools' Day
- Wet Monday (Śmigus Dyngus)
- Summer Vacation

Summer Vacation is visual only. It must not enable Vacation Mode, pause assignments, preserve streaks, or otherwise change chore scheduling.

## Existing behavior to preserve

The existing seasonal-theme implementation is available on the `codex/ux-more_childish` branch and in commits `01cf3c7`, `14a24b6`, and `feeab3a`, while the current local `main` does not yet contain those files. Implementation must first bring the existing family theme feature into the working tree without discarding unrelated current changes.

The extended feature must retain the existing behavior:

- only parents and administrators can change the family theme;
- every authenticated family member can read the selected theme;
- the selection is persisted in the `special_theme` application setting;
- a WebSocket event refreshes the theme for active family sessions;
- a special theme temporarily overrides each user's personal color theme;
- selecting `none` restores the personal theme;
- invalid theme identifiers are rejected by the write API and normalized safely when read by the client;
- decorations never intercept pointer input and are hidden from assistive technology.

## Theme catalog

The frontend theme catalog remains the single source of display metadata for the settings cards. The backend maintains a matching allowlist for validation.

| ID | Polish label | Primary visual language | Palette |
|---|---|---|---|
| `birthday` | Urodziny | Confetti, balloons, birthday cake | pink, violet, gold |
| `halloween` | Halloween | Pumpkins, ghosts, bats | orange, violet, charcoal |
| `april_fools` | Prima Aprilis | Streamers and playful rotating symbols | magenta, cyan, yellow |
| `wet_monday` | Śmigus Dyngus | Falling droplets and water splashes | cyan, blue, aqua |
| `summer_vacation` | Wakacje | Sun, palms, beach ball | sky blue, yellow, coral |

The existing identifiers `none`, `easter`, and `christmas` remain unchanged so stored selections stay compatible.

## Architecture and data flow

### Persistence and API

The existing `/api/theme/special` endpoints remain unchanged. The backend special-theme allowlist is expanded with the five new IDs. No database migration is required because the value is stored as a string in the existing application-settings table.

When a parent selects a theme, the client performs the existing optimistic update and sends the new ID to the API. On success, the API broadcasts the existing `special_theme` WebSocket event. Other open sessions refetch the setting and apply it. On failure, the initiating client restores the previous selection and displays the existing error state.

### Theme resolution

The five IDs are added to the frontend `SPECIAL_THEMES` registry and to the set of root theme classes removed and applied by `ThemeProvider`. `resolveEffectiveTheme` continues to give a valid special theme precedence over the personal theme.

No special theme changes application data or business rules. In particular, `summer_vacation` has no dependency on `VacationSettings` or the vacation API.

### Presentation

The parent settings page continues to render cards from `SPECIAL_THEMES`; therefore each new registry entry automatically receives the same selection, saving, active, and error behavior as Easter and Christmas.

`SeasonalThemeLayer` is extended with a dedicated decorative composition for each new theme. Shared deterministic particle positions and animation primitives should be reused, while each composition supplies its own symbols and styling. Decorations remain in one fixed, `pointer-events-none`, `aria-hidden` layer beneath interactive content.

Each theme receives dark and light CSS variable palettes, ambient page treatment, and distinctive decorations. Motion is reduced or disabled under `prefers-reduced-motion`. On narrow screens, particle density is reduced to protect readability and performance.

Prima Aprilis may rotate or wobble decorative elements only. It must not move, reverse, relabel, hide, or otherwise prank interactive controls or user content.

## Localization

The Polish runtime overlay is extended in both maintained copies with labels and descriptions for all five themes. Existing English source strings remain the component-level source text, following the project's current translation mechanism.

Suggested Polish descriptions:

- Urodziny: `Konfetti, balony i urodzinowy tort`
- Halloween: `Dynie, duszki i latające nietoperze`
- Prima Aprilis: `Kolorowe serpentyny i psotne dekoracje`
- Śmigus Dyngus: `Krople, rozbryzgi i wodna zabawa`
- Wakacje: `Słońce, palmy i plażowa atmosfera`

## Testing and verification

Automated coverage must verify:

- backend normalization accepts all eight supported stored values (`none` plus seven special themes) and rejects unknown values;
- the frontend registry exposes the expected IDs in stable order;
- every special theme overrides a personal theme and `none` restores it;
- management remains restricted to parents and administrators;
- the seasonal layer recognizes and renders every decorative theme while remaining non-interactive and hidden from assistive technology;
- the Polish overlay contains every new label and description.

Run the backend theme tests, frontend Node tests, and a production frontend build. Visually inspect all seven themes at desktop and mobile widths in both light and dark mode, including reduced-motion behavior.

## Out of scope

- automatic activation based on calendar dates;
- per-child special-theme selection;
- scheduling start or end dates for a theme;
- changes to Vacation Mode or school-day logic;
- new database tables or migrations;
- changes to personal color themes or quest-board skins.
