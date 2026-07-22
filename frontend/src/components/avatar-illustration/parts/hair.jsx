export function ShortHairFront({ palette, paints }) {
  return (
    <g>
      <path
        className="avatar-hair-silhouette avatar-outline"
        d="M77 84 C71 76 70 67 74 59 C68 59 64 56 61 52 C72 53 82 48 89 41 C81 43 74 39 71 34 C83 37 96 33 104 25 C97 27 92 22 90 17 C101 22 111 20 118 12 C124 20 133 23 142 24 C153 25 160 32 162 42 C170 43 174 48 177 56 C170 53 164 55 160 60 C166 68 164 77 157 86 C154 76 151 67 146 59 C142 55 136 54 132 57 C128 60 128 68 125 75 C123 80 120 83 116 86 C119 74 117 63 112 58 C108 54 102 55 97 59 C91 63 88 73 83 84 Z"
        fill={paints.hair}
        stroke={palette.hair.outline}
        strokeWidth="3.4"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hair-crown avatar-hair-plane"
        d="M74 59 C83 43 95 33 109 28 C124 22 141 27 152 38 C159 45 162 53 159 61 C150 52 141 47 131 45 C112 41 94 47 82 61 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M73 57 C82 45 95 36 108 31 C102 43 91 54 79 60 C85 52 82 51 73 57 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M91 35 C104 25 118 23 130 27 C120 36 110 43 100 46 C105 37 101 33 91 35 Z"
        fill={palette.hair.shadow}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M117 24 C132 24 145 29 154 38 C145 41 135 45 125 52 C130 41 127 31 117 24 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M149 38 C157 43 161 51 159 60 C153 56 145 52 137 51 C144 49 148 44 149 38 Z"
        fill={palette.hair.deep}
        opacity="0.72"
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M79 55 C87 53 94 55 98 59 C92 66 88 75 83 84 C84 73 82 64 79 55 Z"
        fill={palette.hair.base}
      />
      <path
        className="avatar-hair-lock avatar-hair-plane"
        d="M107 49 C117 45 127 48 133 56 C130 64 127 70 124 76 C123 66 117 60 107 57 C113 55 113 52 107 49 Z"
        fill={palette.hair.deep}
        opacity="0.88"
      />
      <path
        className="avatar-hair-root-shadow avatar-hair-plane"
        d="M77 62 C82 61 87 63 91 67 C87 72 85 79 83 84 C80 77 78 70 77 62 Z M112 58 C119 60 124 66 125 75 C123 80 120 83 116 86 C119 74 117 64 112 58 Z M146 59 C152 66 155 75 157 86 C152 80 149 73 146 67 Z"
        fill={palette.hair.deep}
        opacity="0.68"
      />
      <path
        className="avatar-hair-boundary avatar-detail"
        d="M108 31 C101 43 91 53 80 59 M130 27 C120 35 110 42 100 46 M153 38 C144 41 135 45 126 52 M98 59 C91 67 87 75 84 82 M133 56 C129 63 126 69 124 74"
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="1.65"
        strokeLinecap="round"
        opacity="0.76"
      />
      <path
        className="avatar-brow-window avatar-brow-window-left avatar-hair-boundary avatar-detail"
        d="M97 59 C102 55 108 55 112 58"
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        className="avatar-brow-window avatar-brow-window-right avatar-hair-boundary avatar-detail"
        d="M132 57 C136 54 142 55 146 59"
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        className="avatar-hair-directional-highlight avatar-highlight"
        d="M84 49 C90 42 97 37 103 34 M111 30 C117 27 123 28 128 30 M135 31 C142 33 148 37 151 42"
        fill="none"
        stroke={palette.hair.lifted}
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        className="avatar-hair-strand avatar-detail"
        d="M88 54 C94 49 100 46 105 44 M117 36 C123 33 130 33 136 36 M143 47 C149 49 153 53 156 57"
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.74"
      />
      <path
        className="avatar-detail"
        d="M76 63 C77 72 80 79 83 84 M160 61 C162 69 160 78 157 85"
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </g>
  );
}
