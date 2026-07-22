export function NormalEyes({ config, palette }) {
  const eyeColor = config.eye_color || palette.hair.deep;

  return (
    <g>
      <path
        className="avatar-eye-shadow avatar-face-plane"
        d="M94 75 C98 66 106 63 113 69 C116 72 116 77 114 80 C111 74 108 71 104 71 C100 71 97 73 94 75 Z M127 76 C131 66 140 63 147 69 C150 72 150 77 147 80 C145 74 142 71 138 71 C134 71 130 73 127 76 Z"
        fill={palette.skin.shadow}
        opacity="0.52"
      />
      <path
        className="avatar-detail"
        d="M93 66 C99 61 106 61 111 65 M130 65 C136 60 143 61 148 66"
        fill="none"
        stroke={palette.hair.deep}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        className="avatar-outline"
        d="M95 80 C96 71 100 67 105 67 C111 67 114 73 114 82 C114 91 110 97 104 97 C98 97 94 90 95 80 Z"
        fill="#fffaf4"
        stroke={palette.skin.outline}
        strokeWidth="1.7"
      />
      <path
        className="avatar-outline"
        d="M128 81 C128 72 132 67 138 67 C144 67 147 73 147 82 C147 91 143 97 137 97 C131 97 128 90 128 81 Z"
        fill="#fffaf4"
        stroke={palette.skin.outline}
        strokeWidth="1.7"
      />
      <ellipse cx="105" cy="83.5" rx="5.4" ry="8" fill={eyeColor} />
      <ellipse cx="138" cy="83.5" rx="5.4" ry="8" fill={eyeColor} />
      <ellipse className="avatar-detail" cx="106" cy="85" rx="3.1" ry="5.2" fill={palette.hair.deep} />
      <ellipse className="avatar-detail" cx="139" cy="85" rx="3.1" ry="5.2" fill={palette.hair.deep} />
      <ellipse className="avatar-highlight" cx="103.1" cy="79.8" rx="1.8" ry="2.5" fill="#ffffff" />
      <ellipse className="avatar-highlight" cx="136.1" cy="79.8" rx="1.8" ry="2.5" fill="#ffffff" />
      <circle className="avatar-highlight" cx="107.2" cy="89.2" r="0.9" fill="#ffffff" opacity="0.84" />
      <circle className="avatar-highlight" cx="140.2" cy="89.2" r="0.9" fill="#ffffff" opacity="0.84" />
      <path className="avatar-detail" d="M96 78 C98 72 102 70 106 70 M129 78 C132 72 136 70 141 70" fill="none" stroke={palette.skin.outline} strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />
      <path
        className="avatar-nose-plane avatar-face-plane avatar-detail"
        d="M120 86 C117 92 116 98 120 101 C123 103 128 100 128 96 C126 98 123 98 121 96 C120 94 122 90 120 86 Z"
        fill={palette.skin.shadow}
        opacity="0.74"
      />
      <path
        className="avatar-highlight"
        d="M121 90 C122 89 123 89 124 90"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse className="avatar-cheek" cx="94" cy="102" rx="8" ry="3.8" fill={palette.skin.cheek} opacity="0.54" />
      <ellipse className="avatar-cheek" cx="146" cy="102" rx="8" ry="3.8" fill={palette.skin.cheek} opacity="0.54" />
      <circle className="avatar-highlight" cx="91.5" cy="100.5" r="1.1" fill={palette.skin.highlight} opacity="0.7" />
      <circle className="avatar-highlight" cx="143.5" cy="100.5" r="1.1" fill={palette.skin.highlight} opacity="0.7" />
    </g>
  );
}

export function SmileMouth({ config, palette }) {
  return (
    <g>
      <path
        className="avatar-detail"
        d="M108 109 C115 116 128 116 135 108"
        fill="none"
        stroke={config.mouth_color || palette.skin.outline}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="avatar-face-plane"
        d="M114 113 C120 117 127 115 131 112 C126 116 120 118 114 113 Z"
        fill={palette.skin.cheek}
        opacity="0.36"
      />
    </g>
  );
}

export function EmptyPart() {
  return null;
}
