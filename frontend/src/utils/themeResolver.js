export const PERSONAL_THEME_IDS = [
  'default',
  'dragon',
  'forest',
  'arctic',
  'rose',
  'galaxy',
  'sunshine',
  'fairy',
];

export const SPECIAL_THEMES = [
  {
    id: 'none',
    label: 'None',
    icon: '✨',
    description: 'Use everyone\'s personal colour theme',
    colors: ['#14b8a6', '#2dd4bf', '#f59e0b'],
  },
  {
    id: 'easter',
    label: 'Easter',
    icon: '🐣',
    description: 'Spring petals, painted eggs and bunny decorations',
    colors: ['#7dd3a8', '#f9a8d4', '#c4b5fd'],
  },
  {
    id: 'christmas',
    label: 'Christmas',
    icon: '🎄',
    description: 'Falling snow, warm lights and festive greenery',
    colors: ['#15803d', '#dc2626', '#fbbf24'],
  },
  {
    id: 'birthday',
    label: 'Birthday',
    icon: '🎂',
    description: 'Confetti, balloons and a birthday cake',
    colors: ['#ec4899', '#8b5cf6', '#fbbf24'],
  },
  {
    id: 'halloween',
    label: 'Halloween',
    icon: '🎃',
    description: 'Pumpkins, friendly ghosts and flying bats',
    colors: ['#f97316', '#9333ea', '#18181b'],
  },
  {
    id: 'april_fools',
    label: "April Fools' Day",
    icon: '🃏',
    description: 'Colourful streamers and playful decorations',
    colors: ['#db2777', '#06b6d4', '#facc15'],
  },
  {
    id: 'wet_monday',
    label: 'Wet Monday',
    icon: '💦',
    description: 'Droplets, splashes and water play',
    colors: ['#06b6d4', '#2563eb', '#2dd4bf'],
  },
  {
    id: 'summer_vacation',
    label: 'Summer Vacation',
    icon: '🏖️',
    description: 'Sunshine, palms and a beach atmosphere',
    colors: ['#38bdf8', '#facc15', '#fb7185'],
  },
];

export const SPECIAL_THEME_IDS = SPECIAL_THEMES.map(({ id }) => id);

const PERSONAL_THEME_SET = new Set(PERSONAL_THEME_IDS);
const SPECIAL_THEME_SET = new Set(SPECIAL_THEME_IDS);

export function normalizePersonalTheme(theme) {
  return PERSONAL_THEME_SET.has(theme) ? theme : 'default';
}

export function normalizeSpecialTheme(theme) {
  return SPECIAL_THEME_SET.has(theme) ? theme : 'none';
}

export function resolveEffectiveTheme(personalTheme, specialTheme) {
  const personal = normalizePersonalTheme(personalTheme);
  const special = normalizeSpecialTheme(specialTheme);
  return special === 'none' ? personal : special;
}

export function canManageSpecialTheme(role) {
  return role === 'parent' || role === 'admin';
}
