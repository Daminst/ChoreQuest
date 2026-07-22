import {
  AVATAR_BODY_PROPORTIONS,
  AVATAR_HEAD_RIG,
  AVATAR_POSE_ANCHORS,
  getAvatarBuildRig,
} from '../avatarGeometry.js';

const {
  hands, hips, knees, shoulders, soles,
} = AVATAR_POSE_ANCHORS;
const { free: freeLeg, weight: weightLeg } = AVATAR_BODY_PROPORTIONS.legs;
const { torsoTop } = AVATAR_BODY_PROPORTIONS.upperBody;
const { neckBottom } = AVATAR_HEAD_RIG.sourceBounds;

const FREE_LEG_PATH = `M${freeLeg.thighLeft} ${hips.free.y + 1} C87 233 84 248 ${freeLeg.kneeLeft} ${knees.free.y + 1} C77 278 80 288 ${soles.free.x + 7} ${soles.free.y - 15} C90 299 101 294 108 282 C${freeLeg.kneeRight + 3} 265 ${freeLeg.thighRight - 3} 243 ${freeLeg.thighRight} ${hips.free.y + 6} Z`;
const WEIGHT_LEG_PATH = `M${weightLeg.thighLeft} ${hips.weight.y + 2} C124 242 ${weightLeg.kneeLeft} 258 ${weightLeg.kneeLeft} 275 C${weightLeg.kneeLeft} 288 132 299 ${soles.weight.x - 10} ${soles.weight.y - 13} C149 300 ${weightLeg.kneeRight - 1} 290 ${weightLeg.kneeRight} 277 C${weightLeg.kneeRight} 258 158 238 ${weightLeg.thighRight} ${hips.weight.y - 3} Z`;
const FREE_SHOE_PATH = `M${soles.free.x + 3} ${soles.free.y - 23} C91 287 99 291 ${soles.free.x + 27} ${soles.free.y - 11} L${soles.free.x + 24} ${soles.free.y} H${soles.free.x - 18} C59 302 65 294 75 291 Z`;
const WEIGHT_SHOE_PATH = `M${soles.weight.x - 21} ${soles.weight.y - 14} C137 293 149 290 160 295 C169 299 173 307 ${soles.weight.x + 20} ${soles.weight.y} H${soles.weight.x - 23} Z`;
const HIP_ARM_PATH = `M${shoulders.left.x + 2} ${shoulders.left.y + 4} C83 135 74 146 68 162 C63 176 67 189 75 195 C80 197 85 194 88 188 C86 194 84 198 82 201 C80 205 83 209 88 210 C94 210 97 205 95 200 C92 190 94 165 103 146 Z`;
const RELAXED_ARM_PATH = `M${shoulders.right.x - 4} ${shoulders.right.y + 9} C159 141 168 155 173 178 C176 198 173 214 167 219 C162 222 156 218 154 212 C159 187 155 163 141 147 Z`;
const HIP_HAND_PATH = `M${hands.hip.x - 7} ${hands.hip.y - 5} C76 196 82 197 86 201 C89 204 88 209 85 212 C81 215 76 212 73 208 C70 205 71 201 73 198 Z`;
const RELAXED_HAND_PATH = `M${hands.relaxed.x - 6} ${hands.relaxed.y - 10} C159 218 159 225 162 230 C164 234 167 230 168 226 C167 232 169 235 172 233 C175 231 174 226 175 223 C175 228 178 229 180 226 C182 221 178 215 174 212 C170 209 166 211 163 214 Z`;

export function Anatomy({ palette, paints, build = 'regular', section }) {
  const rig = getAvatarBuildRig(build);

  if (section === 'legs') {
    return (
      <g data-avatar-body-region="legs">
        <g transform={rig.legs.free.transform}>
          <path
            className="avatar-leg-left avatar-outline"
            d={FREE_LEG_PATH}
            fill={paints.skin}
            stroke={palette.skin.outline}
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <path
            className="avatar-face-plane"
            d={`M${freeLeg.kneeLeft + 1} 258 C88 262 102 262 ${freeLeg.kneeRight} 258 L108 272 C100 276 88 275 80 271 Z`}
            fill={palette.skin.light}
            opacity="0.25"
          />
          <path
            className="avatar-detail"
            d={`M${freeLeg.kneeLeft + 2} 257 C89 260 ${knees.free.x + 7} 260 ${freeLeg.kneeRight - 1} 256`}
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
            className="avatar-highlight"
            d="M65 300 C75 295 90 296 99 300"
            fill="none"
            stroke={palette.gear.highlight}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
        <g transform={rig.legs.weight.transform}>
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
            d={`M${weightLeg.kneeLeft} 259 C135 263 148 262 ${weightLeg.kneeRight} 256 L${weightLeg.kneeRight} 270 C148 278 135 279 ${weightLeg.kneeLeft + 1} 273 Z`}
            fill={palette.skin.deep}
            opacity="0.16"
          />
          <path
            className="avatar-detail"
            d={`M${weightLeg.kneeLeft + 2} 255 C136 258 ${knees.weight.x + 7} 258 ${weightLeg.kneeRight - 2} 254`}
            fill="none"
            stroke={palette.skin.cheek}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.48"
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
            className="avatar-detail"
            d="M133 304 C144 299 155 300 164 306"
            fill="none"
            stroke={palette.gear.highlight}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.75"
          />
        </g>
      </g>
    );
  }

  if (section === 'torso-arms') {
    return (
      <g data-avatar-body-region="torso-arms">
        <g transform={rig.torso.transform}>
          <path
            className="avatar-outline"
            d={`M84 144 C95 132 108 ${torsoTop} 122 ${torsoTop} C139 ${torsoTop} 154 133 162 148 L158 219 C141 229 110 227 88 218 Z`}
            fill={paints.outfit}
            stroke={palette.outfit.outline}
            strokeWidth="3.3"
            strokeLinejoin="round"
          />
          <path
            className="avatar-face-plane"
            d="M139 128 C153 135 161 151 161 175 L158 218 C149 223 141 225 132 225 C142 202 145 170 139 128 Z"
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
            className="avatar-highlight"
            d="M93 137 C103 129 114 127 125 129"
            fill="none"
            stroke={palette.outfit.light}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>
        <g transform={rig.hands.hip.transform}>
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
            className="avatar-detail"
            d="M75 201 L79 208 M80 200 L84 206"
            fill="none"
            stroke={palette.skin.outline}
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.62"
          />
        </g>
        <g transform={rig.hands.relaxed.transform}>
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
            d="M164 218 L168 226 M170 216 L175 223"
            fill="none"
            stroke={palette.skin.outline}
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.62"
          />
        </g>
      </g>
    );
  }

  return (
    <g data-avatar-fixed-region="head-neck">
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
