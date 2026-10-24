export function RoundHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:round" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 30 C94 30 79 47 78 75 C77 99 87 120 105 130 C114 136 125 137 135 131 C152 121 162 100 162 78 C162 49 146 30 120 30 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M151 78 C157 94 151 114 134 128 C143 123 151 114 155 103 C158 94 157 85 151 78 Z"
        fill={palette.skin.shadow}
        opacity="0.3"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M86 94 C85 104 92 113 103 117 C99 109 99 101 101 95 C96 92 90 92 86 94 Z M139 95 C142 101 141 109 137 116 C147 112 153 103 152 94 C148 92 143 92 139 95 Z"
        fill={palette.skin.cheek}
        opacity="0.16"
      />
      <path
        className="avatar-highlight"
        d="M91 62 C98 47 109 41 121 41"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.42"
      />
    </g>
  );
}

export function OvalHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:oval" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 27 C98 27 84 45 83 75 C82 104 93 128 111 138 C117 142 124 143 130 139 C148 129 158 104 157 75 C156 44 143 27 120 27 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M150 80 C154 100 146 124 129 137 C141 130 150 117 153 103 C155 94 154 86 150 80 Z"
        fill={palette.skin.shadow}
        opacity="0.3"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M89 96 C88 106 94 115 104 120 C101 111 101 103 103 97 C98 94 93 94 89 96 Z M137 97 C140 104 139 112 136 120 C145 115 150 106 149 96 C145 94 141 94 137 97 Z"
        fill={palette.skin.cheek}
        opacity="0.15"
      />
      <path
        className="avatar-highlight"
        d="M94 60 C100 44 110 38 120 38"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.42"
      />
    </g>
  );
}

export function SquareHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:square" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M97 31 C85 35 79 49 79 66 L80 101 C81 117 91 129 107 135 C115 138 127 138 135 135 C151 129 159 116 160 101 L161 65 C160 47 149 34 135 31 C123 28 109 28 97 31 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M153 73 L153 101 C152 116 144 126 133 133 C145 129 154 120 157 105 C159 94 158 82 153 73 Z"
        fill={palette.skin.shadow}
        opacity="0.32"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M86 94 C84 104 91 112 103 116 L105 100 C99 95 92 92 86 94 Z M138 100 L137 116 C149 112 156 104 154 94 C148 92 143 95 138 100 Z"
        fill={palette.skin.cheek}
        opacity="0.16"
      />
      <path
        className="avatar-highlight"
        d="M91 59 C96 44 107 39 121 39"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.4"
      />
    </g>
  );
}

export function DiamondHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:diamond" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 29 C103 29 92 39 86 55 C82 66 77 78 76 87 C79 103 91 117 108 130 C115 136 125 137 132 130 C150 116 161 102 164 87 C162 72 157 58 151 47 C144 34 133 29 120 29 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M157 78 C161 89 154 106 132 128 C146 119 157 105 161 91 C162 86 160 82 157 78 Z"
        fill={palette.skin.shadow}
        opacity="0.31"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M82 87 C81 99 91 109 105 114 C100 105 99 97 102 90 C95 86 88 85 82 87 Z M138 90 C141 97 140 105 136 114 C149 109 159 99 158 87 C152 85 145 86 138 90 Z"
        fill={palette.skin.cheek}
        opacity="0.17"
      />
      <path
        className="avatar-highlight"
        d="M94 57 C101 43 110 39 120 39"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.42"
      />
    </g>
  );
}

export function HeartHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:heart" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 32 C102 23 82 37 77 59 C73 78 82 94 91 108 C99 121 110 132 120 137 C130 132 141 121 149 108 C158 94 167 78 163 59 C158 37 138 23 120 32 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M157 70 C160 87 148 112 121 135 C139 125 153 108 159 90 C162 81 161 75 157 70 Z"
        fill={palette.skin.shadow}
        opacity="0.3"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M84 91 C84 102 92 112 104 117 C100 108 100 100 102 94 C96 90 89 89 84 91 Z M138 94 C140 101 140 109 136 117 C148 112 156 102 156 91 C151 89 144 90 138 94 Z"
        fill={palette.skin.cheek}
        opacity="0.17"
      />
      <path
        className="avatar-highlight"
        d="M89 57 C96 41 107 35 118 39"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.42"
      />
    </g>
  );
}

export function LongHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:long" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 30 C97 30 83 47 82 76 C81 109 92 133 111 143 C117 147 125 148 132 143 C150 132 159 108 158 76 C157 47 143 30 120 30 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M151 84 C154 108 145 132 131 141 C144 134 152 120 155 105 C157 96 155 89 151 84 Z"
        fill={palette.skin.shadow}
        opacity="0.31"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M88 100 C88 111 94 121 104 126 C101 116 101 108 103 101 C98 98 92 98 88 100 Z M137 101 C140 109 139 117 136 126 C146 121 152 111 152 100 C148 98 142 98 137 101 Z"
        fill={palette.skin.cheek}
        opacity="0.15"
      />
      <path
        className="avatar-highlight"
        d="M93 61 C99 47 109 41 120 41"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.41"
      />
    </g>
  );
}

export function TriangleHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:triangle" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M106 32 C94 38 87 51 84 68 C81 86 77 106 84 121 C92 137 106 141 120 141 C136 141 149 137 157 121 C164 106 159 86 156 68 C153 51 146 38 134 32 C126 28 114 28 106 32 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M154 76 C160 98 159 118 145 132 C151 129 156 124 159 117 C164 104 160 88 154 76 Z"
        fill={palette.skin.shadow}
        opacity="0.32"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M83 100 C81 112 89 123 102 128 C99 118 100 110 103 103 C96 99 89 98 83 100 Z M137 103 C140 110 141 118 138 128 C151 123 159 112 157 100 C151 98 144 99 137 103 Z"
        fill={palette.skin.cheek}
        opacity="0.16"
      />
      <path
        className="avatar-highlight"
        d="M95 58 C101 44 110 39 120 39"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.41"
      />
    </g>
  );
}

export function PearHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:pear" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 29 C101 29 89 43 87 64 C86 76 77 89 76 103 C75 122 92 137 110 141 C117 143 125 143 132 140 C150 134 166 120 164 101 C162 88 154 76 153 63 C150 42 138 29 120 29 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M155 78 C164 94 162 117 148 130 C143 135 137 138 131 140 C149 136 163 123 164 106 C165 94 160 85 155 78 Z"
        fill={palette.skin.shadow}
        opacity="0.31"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M80 101 C78 114 87 125 103 131 C99 120 100 111 104 103 C96 99 87 98 80 101 Z M136 103 C140 111 141 120 137 131 C153 125 162 114 160 101 C153 98 144 99 136 103 Z"
        fill={palette.skin.cheek}
        opacity="0.17"
      />
      <path
        className="avatar-highlight"
        d="M96 58 C102 44 111 39 120 39"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.41"
      />
    </g>
  );
}

export function WideHead({ config, palette, paints }) {
  return (
    <g data-avatar-variant="head:wide" data-head-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-head-silhouette avatar-outline"
        d="M120 31 C91 31 73 46 72 73 C71 95 84 114 104 124 C114 129 126 130 137 125 C157 116 169 96 168 73 C167 46 149 31 120 31 Z"
        fill={paints.skin}
        stroke={palette.skin.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-jaw-plane avatar-face-plane"
        d="M158 75 C165 89 157 109 136 123 C151 117 162 105 165 91 C167 84 164 78 158 75 Z"
        fill={palette.skin.shadow}
        opacity="0.3"
      />
      <path
        className="avatar-cheek-plane avatar-face-plane"
        d="M79 91 C77 102 86 111 101 115 C97 107 98 99 101 93 C94 89 85 88 79 91 Z M139 93 C142 99 143 107 139 115 C154 111 163 102 161 91 C155 88 146 89 139 93 Z"
        fill={palette.skin.cheek}
        opacity="0.17"
      />
      <path
        className="avatar-highlight"
        d="M87 60 C95 46 108 41 122 41"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.42"
      />
    </g>
  );
}

export const HEAD_FEATURE_OFFSETS = Object.freeze({
  round: Object.freeze({ x: 0, y: 0, scaleX: 1, scaleY: 1 }),
  oval: Object.freeze({ x: 0, y: 2, scaleX: 0.92, scaleY: 1.03 }),
  square: Object.freeze({ x: 0, y: -1, scaleX: 1, scaleY: 0.98 }),
  diamond: Object.freeze({ x: 0, y: 0, scaleX: 1.03, scaleY: 0.99 }),
  heart: Object.freeze({ x: 0, y: 0, scaleX: 1.04, scaleY: 0.96 }),
  long: Object.freeze({ x: 0, y: 4, scaleX: 0.94, scaleY: 1.07 }),
  triangle: Object.freeze({ x: 0, y: 3, scaleX: 0.96, scaleY: 1 }),
  pear: Object.freeze({ x: 0, y: 3, scaleX: 0.98, scaleY: 1.01 }),
  wide: Object.freeze({ x: 0, y: -2, scaleX: 1.1, scaleY: 0.92 }),
});

export const HEAD_RENDERERS = Object.freeze({
  round: RoundHead,
  oval: OvalHead,
  square: SquareHead,
  diamond: DiamondHead,
  heart: HeartHead,
  long: LongHead,
  triangle: TriangleHead,
  pear: PearHead,
  wide: WideHead,
});
