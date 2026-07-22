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
        className="avatar-jaw-shadow avatar-face-plane"
        d="M143 45 C154 57 158 76 154 95 C151 112 141 124 126 131 C137 128 146 119 151 107 C157 93 159 75 154 59 C151 51 147 47 143 45 Z"
        fill={palette.skin.shadow}
        opacity="0.68"
      />
      <path
        className="avatar-face-plane"
        d="M82 80 C80 101 90 120 106 128 C97 117 93 104 93 89 C93 77 97 65 103 55 C90 60 83 69 82 80 Z"
        fill={palette.skin.light}
        opacity="0.3"
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
