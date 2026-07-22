export function ShortHairFront({ palette }) {
  return (
    <g>
      <path
        className="avatar-outline"
        d="M77 72 C72 55 81 37 96 29 C108 22 124 21 138 26 C151 30 162 42 164 58 C165 67 162 75 159 82 C154 72 151 62 145 55 C132 44 111 42 98 49 C87 55 82 64 77 72 Z"
        fill={palette.hair.deep}
        stroke={palette.hair.outline}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        className="avatar-outline"
        d="M79 63 C72 54 78 43 91 39 C83 33 88 25 102 28 C99 20 109 17 120 25 C126 15 136 20 139 31 C150 24 158 31 154 41 C165 40 169 49 160 56 C165 65 159 73 153 78 C151 65 145 57 138 52 C136 61 130 68 123 73 C124 64 120 57 116 52 C110 63 102 69 94 73 C96 64 93 58 90 54 C86 60 82 63 79 63 Z"
        fill={palette.hair.base}
        stroke={palette.hair.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-strand avatar-detail"
        d="M88 42 C100 32 111 31 121 34 M105 27 C116 26 126 30 133 37 M126 27 C138 31 146 38 149 48 M97 51 C107 44 117 43 126 46 M137 43 C145 47 151 54 153 62"
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        className="avatar-highlight avatar-hair-strand"
        d="M89 38 C98 31 106 28 115 29 M130 25 C138 29 143 34 146 40"
        fill="none"
        stroke={palette.hair.highlight}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.58"
      />
      <path
        className="avatar-detail"
        d="M79 63 C81 72 82 78 83 84 M158 59 C160 67 159 75 156 82"
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </g>
  );
}
