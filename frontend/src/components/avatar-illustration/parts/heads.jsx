export function RoundHead({ palette }) {
  return (
    <g>
      <path
        className="avatar-outline"
        d="M120 30 C94 30 79 47 78 75 C77 98 87 120 105 130 C114 135 124 136 134 131 C151 122 161 101 162 79 C163 50 146 30 120 30 Z"
        fill={palette.skin.base}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-face-plane"
        d="M147 48 C155 61 157 79 153 96 C149 113 139 124 126 130 C137 128 147 119 153 108 C161 93 163 70 156 55 C153 50 150 48 147 48 Z"
        fill={palette.skin.shadow}
        opacity="0.46"
      />
      <path
        className="avatar-face-plane"
        d="M82 84 C82 103 91 120 106 128 C96 118 92 105 92 89 C92 78 94 68 98 59 C87 65 82 73 82 84 Z"
        fill={palette.skin.light}
        opacity="0.16"
      />
      <path
        className="avatar-highlight"
        d="M91 61 C96 48 108 41 121 40"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.46"
      />
    </g>
  );
}
