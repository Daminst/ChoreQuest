import {
  AVATAR_BODY_PROPORTIONS,
  AVATAR_POSE_ANCHORS,
  getAvatarBuildTransform,
} from '../avatarGeometry.js';

const {
  hands, hips, knees, soles,
} = AVATAR_POSE_ANCHORS;
const { free: freeLeg, weight: weightLeg } = AVATAR_BODY_PROPORTIONS.legs;
const { hoodBottom, hoodTop } = AVATAR_BODY_PROPORTIONS.upperBody;

const FREE_SHORTS_PATH = `M${hips.free.x - 18} ${hips.free.y - 5} C98 213 111 216 123 217 L120 237 C107 240 94 238 82 233 Z`;
const WEIGHT_SHORTS_PATH = `M123 217 C137 219 149 218 ${hips.weight.x + 21} ${hips.weight.y - 5} L161 235 C150 240 136 241 120 237 Z`;
const FREE_SOCK_PATH = `M${freeLeg.kneeLeft - 2} ${knees.free.y + 7} C85 273 98 274 ${freeLeg.kneeRight - 6} 270 L${freeLeg.kneeRight - 8} ${soles.free.y - 12} H79 Z`;
const WEIGHT_SOCK_PATH = `M${weightLeg.kneeLeft - 1} ${knees.weight.y + 12} C134 272 148 272 ${weightLeg.kneeRight} 268 L${weightLeg.kneeRight - 1} ${soles.weight.y - 14} H126 Z`;
const FREE_SHOE_PANEL_PATH = `M${soles.free.x - 3} ${soles.free.y - 18} C85 289 95 293 102 300 L98 306 H66 C66 299 70 295 75 292 Z`;
const WEIGHT_SHOE_PANEL_PATH = `M${soles.weight.x - 18} ${soles.weight.y - 15} C141 292 154 293 164 301 L168 308 H132 Z`;

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
        <path className="avatar-detail" d="M81 276 L101 278 M129 276 L150 276" fill="none" stroke={palette.outfit.base} strokeWidth="4" />
        <path className="avatar-shoe-panel" d={FREE_SHOE_PANEL_PATH} fill={palette.gear.light} opacity="0.48" />
        <path className="avatar-shoe-panel" d={WEIGHT_SHOE_PANEL_PATH} fill={palette.gear.base} opacity="0.7" />
        <path className="avatar-detail" d="M76 296 L96 302 M72 300 L96 305 M136 301 L157 298 M138 305 L162 302" fill="none" stroke="#f8f4eb" strokeWidth="2.2" strokeLinecap="round" />
        <path className="avatar-outfit-seam" d="M61 305 C73 309 89 309 101 306 M129 310 C142 313 158 312 170 310" fill="none" stroke="#f8f4eb" strokeWidth="4.2" strokeLinecap="round" />
        <path className="avatar-detail" d={`M61 ${soles.free.y} H100 M130 ${soles.weight.y} H168`} fill="none" stroke={palette.gear.outline} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      </g>
    );
  }

  return (
    <g transform={buildTransform}>
      <path
        className="avatar-hood-volume avatar-outline"
        d={`M91 143 C98 129 108 ${hoodTop} 121 ${hoodTop} C135 ${hoodTop} 146 128 153 143 C148 149 142 154 136 ${hoodBottom} C132 151 127 146 121 143 C115 146 110 151 106 ${hoodBottom} C100 155 95 150 91 143 Z`}
        fill={paints.outfit}
        stroke={palette.outfit.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hood-volume"
        d="M102 139 C106 127 113 121 121 121 C130 121 137 128 141 139 C136 141 131 144 127 148 C126 142 124 138 121 136 C117 138 114 143 112 149 C108 146 105 143 102 139 Z"
        fill={palette.outfit.deep}
        stroke={palette.outfit.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-highlight"
        d="M96 138 C102 128 109 121 117 119"
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
