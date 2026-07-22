export function ShortHairFront({ palette }) {
  return (
    <g>
      <path
        className="avatar-outline"
        d="M76 79 C70 70 70 61 75 53 L67 53 C75 48 82 45 90 44 L77 38 C88 39 96 35 102 29 L93 24 C103 27 112 24 118 17 C123 24 128 27 135 28 C142 27 149 29 153 34 L155 25 C160 32 162 39 160 45 C167 44 172 48 174 54 C168 53 164 55 161 58 C167 65 165 74 158 82 C153 75 148 69 143 64 C130 51 111 48 98 54 C87 59 81 69 76 79 Z"
        fill={palette.hair.shadow}
        stroke={palette.hair.outline}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-plane avatar-outline"
        d="M75 58 C78 45 90 35 103 31 C116 26 133 27 145 34 C157 40 163 52 160 64 C156 57 150 51 143 47 C132 40 117 38 104 42 C91 46 82 53 75 58 Z"
        fill={palette.hair.lifted}
        stroke={palette.hair.outline}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M76 53 C84 42 94 36 105 33 C100 42 94 50 84 58 C87 51 84 49 76 53 Z"
        fill={palette.hair.lifted}
        stroke={palette.hair.outline}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M94 39 C104 30 114 27 124 29 C120 40 113 49 102 57 C106 47 103 42 94 39 Z"
        fill={palette.hair.base}
        stroke={palette.hair.outline}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M118 29 C130 27 141 31 148 38 C143 47 136 54 128 59 C132 47 128 37 118 29 Z"
        fill={palette.hair.base}
        stroke={palette.hair.outline}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M86 51 C97 43 108 42 118 46 C112 57 104 65 94 71 C98 61 95 55 86 51 Z"
        fill={palette.hair.base}
        stroke={palette.hair.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M109 44 C121 39 133 42 142 49 C138 61 131 69 122 75 C125 62 120 52 109 44 Z"
        fill={palette.hair.base}
        stroke={palette.hair.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M136 46 C147 50 154 58 157 68 C154 75 151 80 147 84 C147 70 144 58 136 46 Z"
        fill={palette.hair.deep}
        stroke={palette.hair.outline}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-strand avatar-detail"
        d="M83 47 C91 39 100 35 110 33 M104 31 C114 27 125 29 133 35 M127 31 C138 34 146 41 151 50 M98 49 C108 44 117 43 126 46 M133 45 C143 50 149 57 151 66"
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.54"
      />
      <path
        className="avatar-highlight avatar-hair-lock avatar-hair-plane"
        d="M82 47 C90 39 99 34 109 32 C104 36 100 40 96 45 C91 45 86 46 82 47 Z"
        fill={palette.hair.lifted}
        opacity="0.54"
      />
      <path
        className="avatar-highlight avatar-hair-lock avatar-hair-plane"
        d="M119 29 C129 29 139 33 146 40 C139 36 132 35 126 36 C124 33 122 31 119 29 Z"
        fill={palette.hair.lifted}
        opacity="0.42"
      />
      <path
        className="avatar-detail"
        d="M76 62 C78 71 80 78 83 84 M159 59 C161 68 159 77 155 83"
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}
