import { OutfitClip } from './parts/outfits.jsx';

function AvatarGradient({ id, finish }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={finish.highlight} />
      <stop offset="0.28" stopColor={finish.light} />
      <stop offset="0.62" stopColor={finish.base} />
      <stop offset="1" stopColor={finish.shadow} />
    </linearGradient>
  );
}

export function AvatarDefs({ ids, palette, build = 'regular' }) {
  return (
    <defs>
      <clipPath id={ids.outfitClip}>
        <OutfitClip build={build} />
      </clipPath>

      <AvatarGradient id={ids.skinGradient} finish={palette.skin} />
      <AvatarGradient id={ids.hairGradient} finish={palette.hair} />
      <AvatarGradient id={ids.outfitGradient} finish={palette.outfit} />
      <AvatarGradient id={ids.hatGradient} finish={palette.hat} />
      <AvatarGradient id={ids.gearGradient} finish={palette.gear} />
      <AvatarGradient id={ids.petGradient} finish={palette.pet} />

      <radialGradient id={ids.backgroundGradient} cx="35%" cy="24%" r="82%">
        <stop offset="0" stopColor={palette.background.light} />
        <stop offset="0.5" stopColor={palette.background.base} />
        <stop offset="1" stopColor={palette.background.deep} />
      </radialGradient>

      <filter
        id={ids.silhouetteShadow}
        x="-20%"
        y="-20%"
        width="140%"
        height="150%"
        colorInterpolationFilters="sRGB"
      >
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="3"
          floodColor={palette.background.deep}
          floodOpacity="0.28"
        />
      </filter>
    </defs>
  );
}

export default AvatarDefs;
