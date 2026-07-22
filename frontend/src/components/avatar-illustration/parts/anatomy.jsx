export function Anatomy({ palette, build = 'regular', section }) {
  const scaleX = build === 'slim' ? 0.9 : build === 'broad' ? 1.12 : 1;
  const buildTransform = `translate(120 0) scale(${scaleX} 1) translate(-120 0)`;

  if (section === 'legs') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-leg-left avatar-outline"
          d="M88 218 C89 232 89 247 92 261 C94 271 98 277 105 278 C112 278 115 272 115 263 L116 222 Z"
          fill={palette.skin.base}
          stroke={palette.skin.outline}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          className="avatar-leg-right avatar-outline"
          d="M124 222 L125 263 C125 272 130 278 137 279 C144 279 148 273 150 263 C152 247 153 231 152 218 Z"
          fill={palette.skin.shadow}
          stroke={palette.skin.outline}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path className="avatar-face-plane" d="M90 235 C96 240 106 241 115 237 L115 251 C108 255 99 254 92 249 Z" fill={palette.skin.light} opacity="0.25" />
        <path className="avatar-face-plane" d="M126 250 C134 254 143 253 150 247 L149 261 C143 269 133 269 126 263 Z" fill={palette.skin.deep} opacity="0.16" />
        <path
          className="avatar-detail"
          d="M94 246 C100 249 107 249 113 246 M129 246 C135 249 142 249 148 246"
          fill="none"
          stroke={palette.skin.cheek}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          className="avatar-shoe-left avatar-outline"
          d="M91 269 C101 268 109 272 116 280 L114 293 H72 C71 285 76 278 86 274 Z"
          fill={palette.gear.base}
          stroke={palette.gear.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-shoe-right avatar-outline"
          d="M126 280 C135 271 148 268 159 273 C168 277 172 285 169 293 H126 Z"
          fill={palette.gear.shadow}
          stroke={palette.gear.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-highlight"
          d="M80 283 C90 278 101 278 108 282"
          fill="none"
          stroke={palette.gear.highlight}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          className="avatar-detail"
          d="M132 283 C143 278 153 279 161 284"
          fill="none"
          stroke={palette.gear.highlight}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />
      </g>
    );
  }

  if (section === 'torso-arms') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-outline"
          d="M82 153 C92 141 105 137 120 137 C138 137 150 143 158 156 L155 218 C137 226 103 226 84 218 Z"
          fill={palette.outfit.base}
          stroke={palette.outfit.outline}
          strokeWidth="3.3"
          strokeLinejoin="round"
        />
        <path
          className="avatar-face-plane"
          d="M137 142 C150 148 157 158 158 176 L155 217 C147 221 139 223 130 223 C139 205 142 181 137 142 Z"
          fill={palette.outfit.deep}
          opacity="0.22"
        />
        <path
          className="avatar-outline"
          d="M88 151 C75 155 67 169 63 185 C60 196 63 208 68 214 C73 220 81 218 87 211 C82 198 85 179 98 162 Z"
          fill={palette.outfit.base}
          stroke={palette.outfit.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-outline"
          d="M146 153 C160 157 169 172 172 190 C174 203 170 213 163 217 C158 220 153 216 151 211 C157 194 153 177 141 162 Z"
          fill={palette.outfit.shadow}
          stroke={palette.outfit.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-hand-left avatar-outline"
          d="M67 207 C61 211 59 217 61 224 C62 229 65 233 68 231 C70 230 69 225 69 222 C71 228 73 232 76 230 C78 228 75 222 75 219 C78 224 80 226 82 224 C85 220 82 213 78 209 C74 205 70 205 67 207 Z"
          fill={palette.skin.base}
          stroke={palette.skin.outline}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="avatar-hand-right avatar-outline"
          d="M155 212 C151 216 150 223 153 228 C155 231 158 227 159 223 C158 229 160 233 163 232 C166 231 165 225 166 222 C166 227 168 230 171 228 C175 224 174 216 170 211 C166 207 159 208 155 212 Z"
          fill={palette.skin.shadow}
          stroke={palette.skin.outline}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="avatar-detail"
          d="M66 215 L69 222 M72 213 L75 219 M161 215 L159 223 M166 214 V222"
          fill="none"
          stroke={palette.skin.outline}
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.62"
        />
        <path
          className="avatar-highlight"
          d="M91 151 C101 145 112 143 122 144"
          fill="none"
          stroke={palette.outfit.light}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>
    );
  }

  return (
    <g>
      <path
        className="avatar-outline"
        d="M108 121 H132 L135 151 H105 Z"
        fill={palette.skin.base}
        stroke={palette.skin.outline}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <ellipse
        className="avatar-outline"
        cx="77"
        cy="84"
        rx="10"
        ry="15"
        fill={palette.skin.base}
        stroke={palette.skin.outline}
        strokeWidth="2.6"
      />
      <ellipse
        className="avatar-outline"
        cx="163"
        cy="84"
        rx="10"
        ry="15"
        fill={palette.skin.shadow}
        stroke={palette.skin.outline}
        strokeWidth="2.6"
      />
      <path
        className="avatar-detail"
        d="M76 80 C72 82 72 89 77 92 M164 80 C168 82 168 89 163 92"
        fill="none"
        stroke={palette.skin.cheek}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        className="avatar-face-plane"
        d="M126 123 H132 L134 149 H126 Z"
        fill={palette.skin.shadow}
        opacity="0.4"
      />
      <path
        className="avatar-highlight"
        d="M111 126 H124"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.58"
      />
    </g>
  );
}
