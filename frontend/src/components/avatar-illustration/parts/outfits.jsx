import { AVATAR_POSE_ANCHORS, getAvatarBuildTransform } from '../avatarGeometry.js';

const {
  hands, hips, knees, soles,
} = AVATAR_POSE_ANCHORS;

const FREE_SHORTS_PATH = `M${hips.free.x - 18} ${hips.free.y - 5} C98 213 111 216 123 217 L120 237 C107 240 94 238 82 233 Z`;
const WEIGHT_SHORTS_PATH = `M123 217 C137 219 149 218 ${hips.weight.x + 21} ${hips.weight.y - 5} L161 235 C150 240 136 241 120 237 Z`;
const FREE_SOCK_PATH = `M80 ${knees.free.y + 7} C86 262 96 263 102 259 L100 ${soles.free.y - 12} H81 Z`;
const WEIGHT_SOCK_PATH = `M128 ${knees.weight.y + 12} C135 262 145 262 151 258 L150 ${soles.weight.y - 14} H129 Z`;
const FREE_SHOE_PANEL_PATH = `M${soles.free.x - 3} ${soles.free.y - 18} C85 269 95 273 102 280 L98 286 H66 C66 279 70 275 75 272 Z`;
const WEIGHT_SHOE_PANEL_PATH = `M${soles.weight.x - 18} ${soles.weight.y - 15} C141 272 154 273 164 281 L168 288 H132 Z`;

function OutfitSurface({ config, palette, paints, section }) {
  const buildTransform = getAvatarBuildTransform(config.body);

  if (section === 'legs') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-shorts-panel avatar-outline"
          d={FREE_SHORTS_PATH}
          fill={paints.outfit}
          stroke={palette.outfit.outline}
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        <path
          className="avatar-shorts-panel avatar-outline"
          d={WEIGHT_SHORTS_PATH}
          fill={palette.outfit.shadow}
          stroke={palette.outfit.outline}
          strokeWidth="2.7"
          strokeLinejoin="round"
        />
        <path
          className="avatar-outfit-seam"
          d="M87 213 C107 214 139 220 158 215 M123 218 L120 237"
          fill="none"
          stroke={palette.outfit.outline}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          className="avatar-highlight"
          d="M90 216 C99 217 108 219 115 219"
          fill="none"
          stroke={palette.outfit.light}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.58"
        />
        <path
          className="avatar-detail"
          d="M88 228 C96 233 106 233 114 230 M127 232 C136 235 147 233 155 229"
          fill="none"
          stroke={palette.outfit.light}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.32"
        />
        <path className="avatar-outline" d={FREE_SOCK_PATH} fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="1.9" />
        <path className="avatar-outline" d={WEIGHT_SOCK_PATH} fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="1.9" />
        <path className="avatar-detail" d="M81 265 L101 267 M129 266 L150 266" fill="none" stroke={palette.outfit.base} strokeWidth="4" />
        <path className="avatar-shoe-panel" d={FREE_SHOE_PANEL_PATH} fill={palette.gear.light} opacity="0.48" />
        <path className="avatar-shoe-panel" d={WEIGHT_SHOE_PANEL_PATH} fill={palette.gear.base} opacity="0.7" />
        <path className="avatar-detail" d="M76 276 L96 282 M72 280 L96 285 M136 281 L157 278 M138 285 L162 282" fill="none" stroke="#f8f4eb" strokeWidth="2.2" strokeLinecap="round" />
        <path className="avatar-outfit-seam" d="M61 285 C73 289 89 289 101 286 M129 289 C142 292 158 291 170 289" fill="none" stroke="#f8f4eb" strokeWidth="4.2" strokeLinecap="round" />
        <path className="avatar-detail" d={`M61 ${soles.free.y} H100 M130 ${soles.weight.y} H168`} fill="none" stroke={palette.gear.outline} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      </g>
    );
  }

  return (
    <g transform={buildTransform}>
      <path
        className="avatar-hood-volume avatar-outline"
        d="M92 149 C97 135 108 127 121 127 C136 127 149 136 154 151 C150 159 143 165 135 168 C131 162 126 158 121 156 C115 158 110 162 107 168 C99 164 95 158 92 149 Z"
        fill={paints.outfit}
        stroke={palette.outfit.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hood-volume"
        d="M99 151 C105 141 113 137 122 137 C132 137 141 142 147 152 C141 158 135 162 130 164 C128 158 124 153 121 151 C117 153 114 157 112 163 C106 160 102 156 99 151 Z"
        fill={palette.outfit.shadow}
        stroke={palette.outfit.light}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        className="avatar-highlight"
        d="M97 148 C103 140 111 136 119 135"
        fill="none"
        stroke={palette.outfit.light}
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path className="avatar-face-plane" d="M88 161 C79 169 75 181 77 190 C79 195 84 195 88 189 C86 180 91 169 99 163 Z" fill={palette.outfit.light} opacity="0.18" />
      <path className="avatar-face-plane" d="M153 160 C162 170 168 188 166 205 C165 212 162 216 157 214 C161 192 155 175 145 163 Z" fill={palette.outfit.deep} opacity="0.32" />
      <path className="avatar-sleeve-fold avatar-detail" d="M73 168 C79 172 85 173 90 170 M69 180 C75 185 82 186 87 182 M83 193 C88 197 93 198 97 195 M155 178 C161 181 166 181 170 178 M158 195 C164 198 169 197 173 193" fill="none" stroke={palette.outfit.deep} strokeWidth="1.8" strokeLinecap="round" opacity="0.72" />
      <path className="avatar-sleeve-fold avatar-highlight" d="M72 165 C78 159 84 156 90 155 M160 164 C165 171 169 179 171 186" fill="none" stroke={palette.outfit.light} strokeWidth="2" strokeLinecap="round" opacity="0.46" />
      <path className="avatar-ribbing avatar-outline" d={`M${hands.hip.x - 7} ${hands.hip.y - 14} C78 193 85 195 91 191 L94 200 C90 207 81 210 75 205 Z`} fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2" />
      <path className="avatar-ribbing avatar-outline" d="M155 203 C161 207 169 206 174 201 L175 211 C171 218 161 220 155 214 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2" />
      <path className="avatar-detail" d="M77 193 L79 206 M82 194 L84 207 M87 193 L89 203 M160 206 L160 217 M165 206 L165 218 M170 204 L170 215" fill="none" stroke={palette.outfit.light} strokeWidth="1" opacity="0.5" />
      <path className="avatar-outfit-seam" d="M112 156 L110 182 M133 157 L134 183" fill="none" stroke="#f8e8cf" strokeWidth="2.5" strokeLinecap="round" />
      <circle className="avatar-detail" cx="110" cy="184" r="2.6" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1" />
      <circle className="avatar-detail" cx="134" cy="185" r="2.6" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1" />
      <path
        className="avatar-outfit-seam avatar-outline"
        d="M98 190 C110 189 135 191 146 194 L150 213 C133 218 111 216 94 211 Z"
        fill={palette.outfit.shadow}
        stroke={palette.outfit.outline}
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path className="avatar-pocket-stitch" d="M101 193 C111 196 135 198 144 196 M99 207 C112 212 134 213 146 209" fill="none" stroke={palette.outfit.light} strokeWidth="1.2" strokeDasharray="2.4 2.4" strokeLinecap="round" opacity="0.65" />
      <path className="avatar-highlight" d="M102 194 C111 193 122 194 131 195" fill="none" stroke={palette.outfit.light} strokeWidth="2.1" strokeLinecap="round" opacity="0.58" />
      <path className="avatar-ribbing avatar-outline" d="M87 209 C107 215 140 218 159 211 L158 223 C139 230 108 227 87 220 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2.2" strokeLinejoin="round" />
      <path className="avatar-detail" d="M93 213 V221 M99 215 V223 M106 216 V224 M113 217 V225 M133 218 V226 M140 217 V225 M147 215 V223 M153 213 V221" fill="none" stroke={palette.outfit.light} strokeWidth="1" opacity="0.45" />
    </g>
  );
}

export function RegularOutfit(props) {
  return <OutfitSurface {...props} />;
}
