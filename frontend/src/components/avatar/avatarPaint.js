const DEFAULT_COLORS = {
  skin: '#ffcc99',
  hair: '#4a3728',
  outfit: '#3b82f6',
  hat: '#f39c12',
  gear: '#3b82f6',
  background: '#1a1a2e',
  pet: '#8b4513',
};

function expandHex(color) {
  const value = String(color || '').trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(value)) return value;
  if (/^#[0-9a-f]{3}$/.test(value)) {
    return `#${value.slice(1).split('').map((part) => part + part).join('')}`;
  }
  return '#000000';
}

export function mixHex(color, target, amount) {
  const sourceHex = expandHex(color).slice(1);
  const targetHex = expandHex(target).slice(1);
  const ratio = Math.min(1, Math.max(0, Number(amount) || 0));

  const channels = [0, 2, 4].map((offset) => {
    const sourceChannel = Number.parseInt(sourceHex.slice(offset, offset + 2), 16);
    const targetChannel = Number.parseInt(targetHex.slice(offset, offset + 2), 16);
    return Math.round(sourceChannel + (targetChannel - sourceChannel) * ratio)
      .toString(16)
      .padStart(2, '0');
  });

  return `#${channels.join('')}`;
}

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

export function buildAvatarPalette(config = {}) {
  return {
    skin: finish(config.head_color || DEFAULT_COLORS.skin, { skin: true }),
    hair: finish(config.hair_color || DEFAULT_COLORS.hair),
    outfit: finish(config.body_color || DEFAULT_COLORS.outfit),
    hat: finish(config.hat_color || DEFAULT_COLORS.hat),
    gear: finish(config.accessory_color || DEFAULT_COLORS.gear),
    background: finish(config.bg_color || DEFAULT_COLORS.background),
    pet: finish(config.pet_color || DEFAULT_COLORS.pet),
  };
}
