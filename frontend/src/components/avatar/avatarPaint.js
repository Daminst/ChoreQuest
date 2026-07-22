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

function hueToRgb(p, q, hue) {
  const wrapped = hue < 0 ? hue + 1 : hue > 1 ? hue - 1 : hue;
  if (wrapped < 1 / 6) return p + ((q - p) * 6 * wrapped);
  if (wrapped < 1 / 2) return q;
  if (wrapped < 2 / 3) return p + ((q - p) * ((2 / 3) - wrapped) * 6);
  return p;
}

export function liftHex(color, amount = 0.18) {
  const sourceHex = expandHex(color).slice(1);
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(sourceHex.slice(offset, offset + 2), 16) / 255,
  );
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (delta > 0) {
    saturation = delta / (1 - Math.abs((2 * lightness) - 1));
    if (max === red) hue = ((green - blue) / delta) % 6;
    else if (max === green) hue = ((blue - red) / delta) + 2;
    else hue = ((red - green) / delta) + 4;
    hue /= 6;
    if (hue < 0) hue += 1;
  }

  const liftedLightness = Math.min(1, lightness + Math.min(1, Math.max(0, Number(amount) || 0)));
  const liftedChannels = saturation === 0
    ? [liftedLightness, liftedLightness, liftedLightness]
    : (() => {
      const q = liftedLightness < 0.5
        ? liftedLightness * (1 + saturation)
        : liftedLightness + saturation - (liftedLightness * saturation);
      const p = (2 * liftedLightness) - q;
      return [
        hueToRgb(p, q, hue + (1 / 3)),
        hueToRgb(p, q, hue),
        hueToRgb(p, q, hue - (1 / 3)),
      ];
    })();

  return `#${liftedChannels.map((channel) => Math.round(channel * 255)
    .toString(16)
    .padStart(2, '0')).join('')}`;
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
  const hairColor = config.hair_color || DEFAULT_COLORS.hair;
  return {
    skin: finish(config.head_color || DEFAULT_COLORS.skin, { skin: true }),
    hair: { ...finish(hairColor), lifted: liftHex(hairColor) },
    outfit: finish(config.body_color || DEFAULT_COLORS.outfit),
    hat: finish(config.hat_color || DEFAULT_COLORS.hat),
    gear: finish(config.accessory_color || DEFAULT_COLORS.gear),
    background: finish(config.bg_color || DEFAULT_COLORS.background),
    pet: finish(config.pet_color || DEFAULT_COLORS.pet),
  };
}
