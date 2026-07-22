export function RoundHead({ palette }) {
  return (
    <g>
      <path
        className="avatar-outline"
        d="M120 29 C94 29 77 48 77 79 C77 111 95 133 120 134 C145 133 163 111 163 79 C163 48 146 29 120 29 Z"
        fill={palette.skin.base}
        stroke={palette.skin.outline}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M150 51 C157 66 158 84 153 100 C149 113 140 123 129 128 C145 123 157 106 160 87 C162 70 158 57 150 51 Z"
        fill={palette.skin.shadow}
        opacity="0.38"
      />
      <path
        className="avatar-highlight"
        d="M92 56 C99 42 113 37 127 39"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.48"
      />
    </g>
  );
}
