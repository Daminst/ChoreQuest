function OutfitSurface({ config, palette, section }) {
  const scaleX = config.body === 'slim' ? 0.9 : config.body === 'broad' ? 1.12 : 1;
  const buildTransform = `translate(120 0) scale(${scaleX} 1) translate(-120 0)`;

  if (section === 'legs') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-outline"
          d="M84 212 C103 217 136 217 156 212 L158 234 C148 239 136 239 120 233 C105 239 92 238 82 233 Z"
          fill={palette.outfit.deep}
          stroke={palette.outfit.outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path className="avatar-outfit-seam" d="M120 216 V233" fill="none" stroke={palette.outfit.outline} strokeWidth="2" strokeLinecap="round" />
        <path className="avatar-highlight" d="M89 218 C97 220 105 220 112 219" fill="none" stroke={palette.outfit.light} strokeWidth="2.2" strokeLinecap="round" opacity="0.55" />
        <path className="avatar-outline" d="M91 260 C98 263 108 263 115 260 L115 278 H93 Z" fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="2.2" />
        <path className="avatar-outline" d="M126 260 C133 263 143 263 149 260 L147 278 H126 Z" fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="2.2" />
        <path className="avatar-detail" d="M92 266 H115 M127 266 H148" fill="none" stroke={palette.outfit.base} strokeWidth="4" />
        <path className="avatar-outfit-seam" d="M78 287 H113 M130 287 H166" fill="none" stroke="#f8f4eb" strokeWidth="4" strokeLinecap="round" />
        <path className="avatar-detail" d="M88 278 L105 283 M133 281 L154 279" fill="none" stroke="#f8f4eb" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <g transform={buildTransform}>
      <path
        className="avatar-outline"
        d="M98 148 C104 139 111 135 120 135 C130 135 139 141 144 150 C137 158 129 162 120 162 C110 162 102 157 98 148 Z"
        fill={palette.outfit.deep}
        stroke={palette.outfit.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-highlight"
        d="M102 148 C109 153 114 155 120 155 C128 155 135 151 140 147"
        fill="none"
        stroke={palette.outfit.light}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path className="avatar-outfit-seam" d="M110 155 L108 181 M132 155 L132 181" fill="none" stroke="#f8e8cf" strokeWidth="3" strokeLinecap="round" />
      <circle className="avatar-detail" cx="108" cy="183" r="3" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1.2" />
      <circle className="avatar-detail" cx="132" cy="183" r="3" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1.2" />
      <path
        className="avatar-outfit-seam avatar-outline"
        d="M98 190 H142 L148 213 C130 219 110 219 92 213 Z"
        fill={palette.outfit.shadow}
        stroke={palette.outfit.outline}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path className="avatar-highlight" d="M101 194 H130" fill="none" stroke={palette.outfit.light} strokeWidth="2.5" strokeLinecap="round" opacity="0.62" />
      <path className="avatar-outfit-seam" d="M84 217 C103 222 137 222 155 217" fill="none" stroke={palette.outfit.outline} strokeWidth="4" strokeLinecap="round" />
      <path className="avatar-detail" d="M70 204 C74 207 79 208 84 206 M155 207 C160 209 165 208 169 204" fill="none" stroke={palette.outfit.deep} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

export function RegularOutfit(props) {
  return <OutfitSurface {...props} />;
}
