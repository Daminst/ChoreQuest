export function ShortHairFront({ palette }) {
  return (
    <g>
      <path
        className="avatar-outline"
        d="M77 82 C71 74 70 66 74 58 C68 58 64 56 61 52 C72 53 82 47 88 41 C80 42 74 38 71 33 C82 37 95 33 103 26 C96 26 92 22 90 17 C100 22 111 20 118 12 C123 20 132 24 141 25 C151 26 158 32 161 41 C168 42 173 47 176 55 C169 52 164 54 160 59 C166 67 164 76 157 84 C153 76 147 71 141 67 C132 61 124 57 115 57 C101 57 90 65 83 84 Z"
        fill={palette.hair.shadow}
        stroke={palette.hair.outline}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-plane"
        d="M75 57 C82 43 93 34 106 28 C120 22 137 26 149 35 C158 42 162 52 159 62 C151 54 143 48 134 45 C116 38 96 43 83 57 Z"
        fill={palette.hair.lifted}
      />
      <path
        className="avatar-hair-root-shadow avatar-hair-plane"
        d="M79 60 C91 48 104 44 119 46 C136 47 151 57 158 72 C157 77 154 82 150 86 C143 73 132 64 118 61 C103 58 90 66 83 84 C81 76 79 68 79 60 Z"
        fill={palette.hair.deep}
        opacity="0.78"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M76 54 C84 42 94 34 106 29 C102 40 95 50 84 59 C88 51 85 49 76 54 Z"
        fill={palette.hair.lifted}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M94 38 C103 29 114 25 126 27 C124 40 117 52 104 61 C109 49 106 41 94 38 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M118 26 C132 26 143 31 151 39 C147 51 139 60 128 66 C132 51 128 36 118 26 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M84 55 C96 45 109 43 121 47 C117 60 108 70 96 77 C100 65 96 58 84 55 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M112 44 C127 40 142 46 152 56 C150 69 144 78 134 84 C137 68 128 53 112 44 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-boundary avatar-detail"
        d="M106 29 C103 40 96 51 85 59 M126 27 C124 40 117 52 105 61 M151 39 C147 50 140 59 129 65 M121 47 C117 59 109 69 97 76 M152 56 C150 68 144 77 135 83"
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.82"
      />
      <path
        className="avatar-hair-directional-highlight avatar-highlight"
        d="M82 49 C89 40 97 35 104 32 M100 35 C107 29 115 28 121 29 M124 31 C134 31 142 35 147 41 M91 55 C99 49 107 47 114 49 M120 48 C131 48 141 53 146 60"
        fill="none"
        stroke={palette.hair.lifted}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.86"
      />
      <path
        className="avatar-hair-strand avatar-detail"
        d="M88 45 C94 39 99 36 104 34 M108 32 C115 29 121 29 127 31 M132 34 C139 36 145 41 149 47 M99 53 C106 49 112 48 118 50 M130 52 C139 55 145 61 148 68"
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.58"
      />
      <path
        className="avatar-detail"
        d="M76 63 C77 72 80 79 83 84 M159 61 C162 69 159 78 155 83"
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}
