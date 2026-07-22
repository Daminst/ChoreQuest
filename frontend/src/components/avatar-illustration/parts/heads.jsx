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
        className="avatar-jaw-plane avatar-face-plane"
        d="M154 88 C153 103 146 117 132 127 C138 126 145 121 150 113 C155 105 157 96 154 88 Z"
        fill={palette.skin.shadow}
        opacity="0.28"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M86 87 C84 100 91 113 104 121 C98 112 96 102 97 92 C97 85 99 80 102 75 C94 77 89 81 86 87 Z"
        fill={palette.skin.light}
        opacity="0.16"
      />
      <path
        className="avatar-highlight"
        d="M92 60 C98 48 109 42 120 41"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.36"
      />
    </g>
  );
}
