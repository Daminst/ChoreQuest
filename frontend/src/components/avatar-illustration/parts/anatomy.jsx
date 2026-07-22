export function Anatomy({ palette, build = 'regular', section }) {
  const scaleX = build === 'slim' ? 0.9 : build === 'broad' ? 1.12 : 1;
  const buildTransform = `translate(120 0) scale(${scaleX} 1) translate(-120 0)`;

  if (section === 'legs') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-leg-left avatar-outline"
          d="M88 214 C88 231 89 249 92 266 C93 274 99 279 106 278 C113 277 116 272 116 264 L116 214 Z"
          fill={palette.skin.base}
          stroke={palette.skin.outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          className="avatar-leg-right avatar-outline"
          d="M124 214 L125 264 C125 273 130 278 138 279 C145 279 149 274 150 265 C152 249 153 231 152 214 Z"
          fill={palette.skin.shadow}
          stroke={palette.skin.outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          className="avatar-detail"
          d="M94 245 C100 248 107 248 113 245 M129 246 C135 249 142 249 148 246"
          fill="none"
          stroke={palette.skin.cheek}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          className="avatar-shoe-left avatar-outline"
          d="M91 270 C99 268 109 272 116 279 L113 293 H72 C72 282 79 275 91 270 Z"
          fill={palette.gear.base}
          stroke={palette.gear.outline}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          className="avatar-shoe-right avatar-outline"
          d="M127 279 C136 270 149 268 159 274 C168 279 172 286 169 293 H126 Z"
          fill={palette.gear.shadow}
          stroke={palette.gear.outline}
          strokeWidth="3.5"
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
          d="M78 153 C90 141 104 137 120 137 C139 137 153 143 162 158 L154 220 C135 227 104 227 84 220 Z"
          fill={palette.outfit.base}
          stroke={palette.outfit.outline}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          className="avatar-outfit-seam"
          d="M120 143 V218 M91 191 H149"
          fill="none"
          stroke={palette.outfit.shadow}
          strokeWidth="2"
          opacity="0.7"
        />
        <path
          className="avatar-outline"
          d="M84 153 C68 166 62 188 67 207 C70 218 79 221 87 213 C81 194 88 174 99 161 Z"
          fill={palette.outfit.base}
          stroke={palette.outfit.outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          className="avatar-outline"
          d="M151 153 C165 161 171 180 170 201 C169 211 162 219 153 214 C155 194 149 176 141 163 Z"
          fill={palette.outfit.shadow}
          stroke={palette.outfit.outline}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          className="avatar-hand-left avatar-outline"
          d="M67 207 C61 211 59 217 61 224 C62 229 65 233 68 231 C70 230 69 225 69 222 C71 228 73 232 76 230 C78 228 75 222 75 219 C78 224 80 226 82 224 C85 220 82 213 78 209 C74 205 70 205 67 207 Z"
          fill={palette.skin.base}
          stroke={palette.skin.outline}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="avatar-hand-right avatar-outline"
          d="M155 212 C151 216 150 223 153 228 C155 231 158 227 159 223 C158 229 160 233 163 232 C166 231 165 225 166 222 C166 227 168 230 171 228 C175 224 174 216 170 211 C166 207 159 208 155 212 Z"
          fill={palette.skin.shadow}
          stroke={palette.skin.outline}
          strokeWidth="2.5"
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
          d="M91 151 C103 145 117 144 128 146"
          fill="none"
          stroke={palette.outfit.light}
          strokeWidth="4"
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
        d="M108 122 H132 L135 151 H105 Z"
        fill={palette.skin.base}
        stroke={palette.skin.outline}
        strokeWidth="3"
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
        strokeWidth="3"
      />
      <ellipse
        className="avatar-outline"
        cx="163"
        cy="84"
        rx="10"
        ry="15"
        fill={palette.skin.shadow}
        stroke={palette.skin.outline}
        strokeWidth="3"
      />
      <path
        className="avatar-detail"
        d="M76 80 C72 82 72 89 77 92 M164 80 C168 82 168 89 163 92"
        fill="none"
        stroke={palette.skin.cheek}
        strokeWidth="2"
        strokeLinecap="round"
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
