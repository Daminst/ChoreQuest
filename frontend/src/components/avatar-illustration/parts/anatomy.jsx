import {
  AVATAR_HEAD_RIG,
  AVATAR_POSE_ANCHORS,
  getAvatarBuildTransform,
} from '../avatarGeometry.js';

const {
  hands, hips, knees, shoulders, soles,
} = AVATAR_POSE_ANCHORS;
const { neckBottom } = AVATAR_HEAD_RIG.sourceBounds;

const FREE_LEG_PATH = `M${hips.free.x - 16} ${hips.free.y + 1} C91 229 90 240 ${knees.free.x - 9} ${knees.free.y + 1} C82 263 80 272 ${soles.free.x + 7} ${soles.free.y - 15} C89 281 98 278 102 269 C107 256 112 239 ${hips.free.x + 13} ${hips.free.y + 6} Z`;
const WEIGHT_LEG_PATH = `M${hips.weight.x - 16} ${hips.weight.y + 2} C127 234 129 247 129 260 C129 272 133 279 ${soles.weight.x - 10} ${soles.weight.y - 14} C147 281 151 274 151 263 C151 248 153 233 ${hips.weight.x + 18} ${hips.weight.y - 3} Z`;
const FREE_SHOE_PATH = `M${soles.free.x + 3} ${soles.free.y - 23} C91 267 99 271 ${soles.free.x + 27} ${soles.free.y - 11} L${soles.free.x + 24} ${soles.free.y} H${soles.free.x - 18} C59 282 65 275 75 271 Z`;
const WEIGHT_SHOE_PATH = `M${soles.weight.x - 21} ${soles.weight.y - 14} C137 272 149 269 160 274 C169 278 173 286 ${soles.weight.x + 20} ${soles.weight.y} H${soles.weight.x - 23} Z`;
const HIP_ARM_PATH = `M${shoulders.left.x + 2} ${shoulders.left.y + 4} C82 150 72 160 67 174 C63 184 67 192 75 195 C80 197 85 194 88 188 C86 194 84 198 82 201 C80 205 83 209 88 210 C94 210 97 205 95 200 C92 195 93 184 101 162 Z`;
const RELAXED_ARM_PATH = `M${shoulders.right.x - 4} ${shoulders.right.y + 9} C160 154 169 168 173 186 C176 200 173 214 167 219 C162 222 156 218 154 212 C159 194 155 176 141 162 Z`;
const HIP_HAND_PATH = `M${hands.hip.x - 7} ${hands.hip.y - 5} C76 196 82 197 86 201 C89 204 88 209 85 212 C81 215 76 212 73 208 C70 205 71 201 73 198 Z`;
const RELAXED_HAND_PATH = `M${hands.relaxed.x - 6} ${hands.relaxed.y - 10} C159 218 159 225 162 230 C164 234 167 230 168 226 C167 232 169 235 172 233 C175 231 174 226 175 223 C175 228 178 229 180 226 C182 221 178 215 174 212 C170 209 166 211 163 214 Z`;

export function Anatomy({ palette, paints, build = 'regular', section }) {
  const buildTransform = getAvatarBuildTransform(build);

  if (section === 'legs') {
    return (
      <g transform={buildTransform}>
        <path
          className="avatar-leg-left avatar-outline"
          d={FREE_LEG_PATH}
          fill={paints.skin}
          stroke={palette.skin.outline}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          className="avatar-leg-right avatar-outline"
          d={WEIGHT_LEG_PATH}
          fill={palette.skin.shadow}
          stroke={palette.skin.outline}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          className="avatar-face-plane"
          d="M85 237 C91 241 100 241 108 237 L104 251 C98 255 90 254 85 250 Z"
          fill={palette.skin.light}
          opacity="0.25"
        />
        <path
          className="avatar-face-plane"
          d="M129 249 C136 253 145 252 151 246 L151 260 C145 268 136 269 130 263 Z"
          fill={palette.skin.deep}
          opacity="0.16"
        />
        <path
          className="avatar-detail"
          d={`M86 247 C91 250 ${knees.free.x + 5} 250 105 246 M130 245 C136 248 ${knees.weight.x + 5} 248 150 244`}
          fill="none"
          stroke={palette.skin.cheek}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.48"
        />
        <path
          className="avatar-shoe-left avatar-outline"
          d={FREE_SHOE_PATH}
          fill={paints.gear}
          stroke={palette.gear.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-shoe-right avatar-outline"
          d={WEIGHT_SHOE_PATH}
          fill={paints.gear}
          stroke={palette.gear.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-highlight"
          d="M65 280 C75 275 90 276 99 280"
          fill="none"
          stroke={palette.gear.highlight}
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          className="avatar-detail"
          d="M133 283 C144 278 155 279 164 285"
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
          d="M84 154 C95 142 108 138 122 138 C139 138 154 145 162 159 L158 219 C141 229 110 227 88 218 Z"
          fill={paints.outfit}
          stroke={palette.outfit.outline}
          strokeWidth="3.3"
          strokeLinejoin="round"
        />
        <path
          className="avatar-face-plane"
          d="M139 143 C153 149 161 160 161 178 L158 218 C149 223 141 225 132 225 C142 207 145 183 139 143 Z"
          fill={palette.outfit.deep}
          opacity="0.22"
        />
        <path
          className="avatar-outline"
          d={HIP_ARM_PATH}
          fill={paints.outfit}
          stroke={palette.outfit.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-outline"
          d={RELAXED_ARM_PATH}
          fill={palette.outfit.shadow}
          stroke={palette.outfit.outline}
          strokeWidth="3.1"
          strokeLinejoin="round"
        />
        <path
          className="avatar-hand-left avatar-outline"
          d={HIP_HAND_PATH}
          fill={paints.skin}
          stroke={palette.skin.outline}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="avatar-hand-right avatar-outline"
          d={RELAXED_HAND_PATH}
          fill={palette.skin.shadow}
          stroke={palette.skin.outline}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          className="avatar-detail"
          d="M75 201 L79 208 M80 200 L84 206 M164 218 L168 226 M170 216 L175 223"
          fill="none"
          stroke={palette.skin.outline}
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.62"
        />
        <path
          className="avatar-highlight"
          d="M93 150 C103 144 114 142 125 144"
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
        d={`M108 121 H132 L133 ${neckBottom} H107 Z`}
        fill={paints.skin}
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
        fill={paints.skin}
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
