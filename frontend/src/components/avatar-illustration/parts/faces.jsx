export function NormalEyes({ config, palette }) {
  const eyeColor = config.eye_color || palette.hair.deep;

  return (
    <g>
      <path
        className="avatar-detail"
        d="M91 65 C98 60 106 60 112 65 M128 65 C135 60 144 60 150 66"
        fill="none"
        stroke={palette.hair.deep}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse className="avatar-outline" cx="103" cy="82" rx="13" ry="16" fill="#fffaf4" stroke={palette.skin.outline} strokeWidth="2.5" />
      <ellipse className="avatar-outline" cx="137" cy="82" rx="13" ry="16" fill="#fffaf4" stroke={palette.skin.outline} strokeWidth="2.5" />
      <ellipse cx="105" cy="84" rx="7.5" ry="10" fill={eyeColor} />
      <ellipse cx="139" cy="84" rx="7.5" ry="10" fill={eyeColor} />
      <ellipse className="avatar-detail" cx="106" cy="86" rx="4.3" ry="6.5" fill={palette.hair.deep} />
      <ellipse className="avatar-detail" cx="140" cy="86" rx="4.3" ry="6.5" fill={palette.hair.deep} />
      <ellipse className="avatar-highlight" cx="102.5" cy="79.5" rx="2.8" ry="3.7" fill="#ffffff" />
      <ellipse className="avatar-highlight" cx="136.5" cy="79.5" rx="2.8" ry="3.7" fill="#ffffff" />
      <circle className="avatar-highlight" cx="108" cy="89" r="1.2" fill="#ffffff" opacity="0.8" />
      <circle className="avatar-highlight" cx="142" cy="89" r="1.2" fill="#ffffff" opacity="0.8" />
      <path
        className="avatar-detail"
        d="M119 88 C116 94 116 98 121 99 C124 99 125 97 126 95"
        fill="none"
        stroke={palette.skin.outline}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        className="avatar-highlight"
        d="M119 91 C120 89 122 89 123 90"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <ellipse className="avatar-cheek" cx="94" cy="101" rx="8" ry="4" fill={palette.skin.cheek} opacity="0.42" />
      <ellipse className="avatar-cheek" cx="146" cy="101" rx="8" ry="4" fill={palette.skin.cheek} opacity="0.42" />
      <circle className="avatar-highlight" cx="91" cy="99.5" r="1.4" fill={palette.skin.highlight} opacity="0.75" />
      <circle className="avatar-highlight" cx="143" cy="99.5" r="1.4" fill={palette.skin.highlight} opacity="0.75" />
    </g>
  );
}

export function SmileMouth({ config, palette }) {
  return (
    <g>
      <path
        className="avatar-detail"
        d="M106 108 C113 117 128 118 136 107"
        fill="none"
        stroke={config.mouth_color || palette.skin.outline}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        className="avatar-highlight"
        d="M114 113 C120 116 126 114 130 112"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
    </g>
  );
}

export function EmptyPart() {
  return null;
}
