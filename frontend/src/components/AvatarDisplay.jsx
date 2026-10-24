import AvatarArtwork from './avatar-illustration/AvatarArtwork';
import { getAvatarRenderDimensions } from './avatar-illustration/avatarGeometry';

const SIZE_VALUES = {
  xs: 24,
  sm: 32,
  md: 64,
  option: 76,
  lg: 128,
  xl: 176,
  studio: 420,
};

const AVATAR_COLORS = [
  '#f9d71c', '#2de2a6', '#b388ff', '#64dfdf',
  '#ff4444', '#ff8c42', '#ff6b9d', '#45b7d1',
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getColor(name) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[hashString(name) % AVATAR_COLORS.length];
}

export default function AvatarDisplay({ config, size = 'md', name = '', animate = false, crop }) {
  const px = typeof size === 'number' ? size : (SIZE_VALUES[size] || SIZE_VALUES.md);
  const effectiveCrop = crop === 'full' || crop === 'portrait' || crop === 'icon'
    ? crop
    : size === 'studio' ? 'full' : size === 'option' ? 'portrait' : 'icon';
  const dimensions = getAvatarRenderDimensions(px, effectiveCrop);

  if (config && typeof config === 'object' && Object.keys(config).length > 0) {
    // Deterministic delay so grouped avatars desynchronise their animations.
    const delay = -(hashString(`${config.head}${config.hair}${config.eyes}${config.mouth}`) % 1200) / 100;

    return (
      <div
        className={`avatar-display avatar-display--${effectiveCrop} flex-shrink-0${animate ? ' avatar-idle' : ''}`}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          '--avatar-delay': `${delay}s`,
        }}
      >
        <AvatarArtwork
          config={config}
          crop={effectiveCrop}
          label="Custom avatar"
          motionEnabled={animate}
        />
      </div>
    );
  }

  // Fallback: colored circle with initials
  const bgColor = getColor(name);
  const initials = getInitials(name);
  const fontSize = px < 48 ? '0.65rem' : px < 96 ? '1rem' : '1.5rem';

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: px, height: px, backgroundColor: bgColor }}
    >
      <span className="font-heading text-navy leading-none" style={{ fontSize }}>
        {initials}
      </span>
    </div>
  );
}
