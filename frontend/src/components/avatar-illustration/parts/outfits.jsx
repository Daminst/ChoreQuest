function OutfitSurface({ config, palette, section }) {
  const scaleX = config.body === 'slim' ? 0.9 : config.body === 'broad' ? 1.12 : 1;
  const buildTransform = `translate(120 0) scale(${scaleX} 1) translate(-120 0)`;

  if (section === 'legs') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-shorts-panel avatar-outline"
          d="M82 211 C94 214 106 216 120 216 L119 235 C107 240 94 239 82 234 Z"
          fill={palette.outfit.deep}
          stroke={palette.outfit.outline}
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        <path
          className="avatar-shorts-panel avatar-outline"
          d="M120 216 C134 216 147 214 157 211 L158 234 C147 239 134 240 121 235 Z"
          fill={palette.outfit.shadow}
          stroke={palette.outfit.outline}
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        <path className="avatar-outfit-seam" d="M86 216 C106 220 136 220 154 216 M120 218 L120 235" fill="none" stroke={palette.outfit.outline} strokeWidth="1.6" strokeLinecap="round" />
        <path className="avatar-highlight" d="M88 218 C97 220 106 220 113 219" fill="none" stroke={palette.outfit.light} strokeWidth="2" strokeLinecap="round" opacity="0.58" />
        <path className="avatar-detail" d="M90 229 C98 233 107 233 114 230 M127 231 C136 234 146 233 153 229" fill="none" stroke={palette.outfit.light} strokeWidth="1.2" strokeLinecap="round" opacity="0.32" />
        <path className="avatar-outline" d="M91 259 C98 262 108 262 115 259 L115 278 H93 Z" fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="1.9" />
        <path className="avatar-outline" d="M126 259 C133 262 143 262 149 259 L147 278 H126 Z" fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="1.9" />
        <path className="avatar-detail" d="M92 266 H115 M127 266 H148" fill="none" stroke={palette.outfit.base} strokeWidth="4" />
        <path className="avatar-shoe-panel" d="M87 274 C97 272 107 276 113 282 L109 287 H78 C78 281 81 277 87 274 Z" fill={palette.gear.light} opacity="0.48" />
        <path className="avatar-shoe-panel" d="M132 279 C141 272 153 273 162 280 L166 287 H132 Z" fill={palette.gear.base} opacity="0.7" />
        <path className="avatar-detail" d="M87 278 L106 284 M84 282 L106 287 M135 280 L156 278 M137 284 L160 282" fill="none" stroke="#f8f4eb" strokeWidth="2.2" strokeLinecap="round" />
        <path className="avatar-outfit-seam" d="M75 288 C88 290 101 290 113 288 M128 288 C141 290 156 290 168 288" fill="none" stroke="#f8f4eb" strokeWidth="4.2" strokeLinecap="round" />
        <path className="avatar-detail" d="M78 292 H111 M130 292 H166" fill="none" stroke={palette.gear.outline} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      </g>
    );
  }

  return (
    <g transform={buildTransform}>
      <path
        className="avatar-hood-volume avatar-outline"
        d="M90 151 C95 139 106 132 119 132 C134 131 147 139 152 152 C148 160 141 166 133 169 C129 163 125 159 120 157 C114 159 109 163 106 169 C98 166 93 160 90 151 Z"
        fill={palette.outfit.deep}
        stroke={palette.outfit.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hood-volume"
        d="M97 151 C103 141 111 137 120 137 C130 137 139 142 145 151 C139 157 133 161 128 163 C126 157 123 153 120 151 C116 153 113 157 111 163 C105 160 100 156 97 151 Z"
        fill={palette.outfit.shadow}
        stroke={palette.outfit.light}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        className="avatar-highlight"
        d="M95 148 C101 140 109 136 117 135"
        fill="none"
        stroke={palette.outfit.light}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path className="avatar-face-plane" d="M88 162 C80 172 77 188 80 200 C82 207 86 211 89 210 C86 195 89 177 99 164 Z" fill={palette.outfit.light} opacity="0.18" />
      <path className="avatar-face-plane" d="M151 160 C160 170 165 187 164 203 C164 208 161 212 156 212 C159 191 153 174 143 163 Z" fill={palette.outfit.deep} opacity="0.32" />
      <path className="avatar-sleeve-fold avatar-detail" d="M72 180 C78 184 84 184 89 181 M69 194 C75 198 81 198 85 195 M153 178 C159 181 164 181 168 178 M156 194 C162 197 167 196 171 192" fill="none" stroke={palette.outfit.deep} strokeWidth="1.8" strokeLinecap="round" opacity="0.72" />
      <path className="avatar-sleeve-fold avatar-highlight" d="M71 172 C76 166 81 162 87 160 M158 164 C163 170 166 177 168 183" fill="none" stroke={palette.outfit.light} strokeWidth="2" strokeLinecap="round" opacity="0.46" />
      <path className="avatar-ribbing avatar-outline" d="M65 201 C71 205 79 206 86 202 L88 212 C82 218 72 218 66 213 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2" />
      <path className="avatar-ribbing avatar-outline" d="M153 202 C159 206 167 205 172 200 L173 210 C169 217 159 219 153 213 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2" />
      <path className="avatar-detail" d="M70 204 L70 214 M75 205 L75 216 M80 205 L80 215 M158 205 L158 216 M163 205 L163 216 M168 203 L168 213" fill="none" stroke={palette.outfit.light} strokeWidth="1" opacity="0.5" />
      <path className="avatar-outfit-seam" d="M110 156 L108 181 M131 156 L132 181" fill="none" stroke="#f8e8cf" strokeWidth="2.5" strokeLinecap="round" />
      <circle className="avatar-detail" cx="108" cy="183" r="2.6" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1" />
      <circle className="avatar-detail" cx="132" cy="183" r="2.6" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1" />
      <path
        className="avatar-outfit-seam avatar-outline"
        d="M97 190 C108 188 132 188 143 190 L148 211 C131 216 109 216 92 211 Z"
        fill={palette.outfit.shadow}
        stroke={palette.outfit.outline}
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path className="avatar-pocket-stitch" d="M99 193 C108 195 132 195 141 193 M98 207 C110 210 131 210 143 207" fill="none" stroke={palette.outfit.light} strokeWidth="1.2" strokeDasharray="2.4 2.4" strokeLinecap="round" opacity="0.65" />
      <path className="avatar-highlight" d="M101 194 C109 192 119 192 128 193" fill="none" stroke={palette.outfit.light} strokeWidth="2.1" strokeLinecap="round" opacity="0.58" />
      <path className="avatar-ribbing avatar-outline" d="M84 210 C103 216 137 216 156 210 L155 222 C136 227 104 227 84 221 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2.2" strokeLinejoin="round" />
      <path className="avatar-detail" d="M90 214 V222 M96 216 V224 M103 217 V224 M110 218 V225 M130 218 V225 M137 217 V224 M144 216 V223 M150 214 V221" fill="none" stroke={palette.outfit.light} strokeWidth="1" opacity="0.45" />
    </g>
  );
}

export function RegularOutfit(props) {
  return <OutfitSurface {...props} />;
}
