import {
  AVATAR_BODY_PROPORTIONS,
  AVATAR_POSE_ANCHORS,
  getAvatarBuildRig,
} from '../avatarGeometry.js';
import { EmptyPart } from './faces.jsx';

const {
  hands, hips, knees, shoulders, soles,
} = AVATAR_POSE_ANCHORS;
const { free: freeLeg, weight: weightLeg } = AVATAR_BODY_PROPORTIONS.legs;
const { hoodBottom, hoodTop, torsoTop } = AVATAR_BODY_PROPORTIONS.upperBody;

const TORSO_PATH = `M84 144 C95 132 108 ${torsoTop} 122 ${torsoTop} C139 ${torsoTop} 154 133 162 148 L158 219 C141 229 110 227 88 218 Z`;
const HIP_ARM_PATH = `M${shoulders.left.x + 2} ${shoulders.left.y + 4} C83 135 74 146 68 162 C63 176 67 189 75 195 C80 197 85 194 88 188 C86 194 84 198 82 201 C80 205 83 209 88 210 C94 210 97 205 95 200 C92 190 94 165 103 146 Z`;
const RELAXED_ARM_PATH = `M${shoulders.right.x - 4} ${shoulders.right.y + 9} C159 141 168 155 173 178 C176 198 173 214 167 219 C162 222 156 218 154 212 C159 187 155 163 141 147 Z`;
const HOOD_OUTER_PATH = `M91 143 C98 129 108 ${hoodTop} 121 ${hoodTop} C135 ${hoodTop} 146 128 153 143 C148 149 142 154 136 ${hoodBottom} C132 151 127 146 121 143 C115 146 110 151 106 ${hoodBottom} C100 155 95 150 91 143 Z`;
const HOOD_INNER_PATH = 'M102 139 C106 127 113 121 121 121 C130 121 137 128 141 139 C136 141 131 144 127 148 C126 142 124 138 121 136 C117 138 114 143 112 149 C108 146 105 143 102 139 Z';
const FREE_SHORTS_PATH = `M${hips.free.x - 18} ${hips.free.y - 5} C98 213 111 216 123 217 L120 237 C107 240 94 238 82 233 Z`;
const WEIGHT_SHORTS_PATH = `M123 217 C137 219 149 218 ${hips.weight.x + 21} ${hips.weight.y - 5} L161 235 C150 240 136 241 120 237 Z`;
const FREE_SOCK_PATH = `M${freeLeg.kneeLeft - 2} ${knees.free.y + 7} C85 273 98 274 ${freeLeg.kneeRight - 6} 270 L${freeLeg.kneeRight - 8} ${soles.free.y - 12} H79 Z`;
const WEIGHT_SOCK_PATH = `M${weightLeg.kneeLeft - 1} ${knees.weight.y + 12} C134 272 148 272 ${weightLeg.kneeRight} 268 L${weightLeg.kneeRight - 1} ${soles.weight.y - 14} H126 Z`;
const FREE_SHOE_PANEL_PATH = `M${soles.free.x - 3} ${soles.free.y - 18} C85 289 95 293 102 300 L98 306 H66 C66 299 70 295 75 292 Z`;
const WEIGHT_SHOE_PANEL_PATH = `M${soles.weight.x - 18} ${soles.weight.y - 15} C141 292 154 293 164 301 L168 308 H132 Z`;

export function OutfitClip({ build = 'regular' }) {
  const rig = getAvatarBuildRig(build);
  return (
    <g data-avatar-outfit-clip-build={rig.id} transform={rig.torso.transform}>
      <path d={TORSO_PATH} />
      <path d={HIP_ARM_PATH} />
      <path d={RELAXED_ARM_PATH} />
      <path d={HOOD_OUTER_PATH} />
      <path d={FREE_SHORTS_PATH} />
      <path d={WEIGHT_SHORTS_PATH} />
    </g>
  );
}

function OutfitBase({ build, palette, paints }) {
  const rig = getAvatarBuildRig(build);
  return (
    <g data-avatar-outfit-phase="base" transform={rig.torso.transform}>
      <path
        className="avatar-hood-volume avatar-outline"
        d={HOOD_OUTER_PATH}
        fill={paints.outfit}
        stroke={palette.outfit.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-hood-volume"
        d={HOOD_INNER_PATH}
        fill={palette.outfit.deep}
        stroke={palette.outfit.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
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
    </g>
  );
}

function OutfitFinish({ build, palette }) {
  const rig = getAvatarBuildRig(build);
  return (
    <g data-avatar-outfit-phase="finish">
      <g transform={rig.torso.transform}>
        <path className="avatar-outline" d={TORSO_PATH} fill="none" stroke={palette.outfit.outline} strokeWidth="3.3" strokeLinejoin="round" />
        <path className="avatar-outline" d={HIP_ARM_PATH} fill="none" stroke={palette.outfit.outline} strokeWidth="3.1" strokeLinejoin="round" />
        <path className="avatar-outline" d={RELAXED_ARM_PATH} fill="none" stroke={palette.outfit.outline} strokeWidth="3.1" strokeLinejoin="round" />
        <path className="avatar-outline" d={HOOD_OUTER_PATH} fill="none" stroke={palette.outfit.outline} strokeWidth="3" strokeLinejoin="round" />
        <path className="avatar-outline" d={HOOD_INNER_PATH} fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="1.8" strokeLinejoin="round" />
        <path className="avatar-highlight" d="M96 138 C102 128 109 121 117 119" fill="none" stroke={palette.outfit.light} strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
        <path className="avatar-face-plane" d="M88 161 C79 169 75 181 77 190 C79 195 84 195 88 189 C86 180 91 169 99 163 Z" fill={palette.outfit.light} opacity="0.18" />
        <path className="avatar-face-plane" d="M153 160 C162 170 168 188 166 205 C165 212 162 216 157 214 C161 192 155 175 145 163 Z" fill={palette.outfit.deep} opacity="0.32" />
        <path className="avatar-sleeve-fold avatar-detail" d="M73 168 C79 172 85 173 90 170 M69 180 C75 185 82 186 87 182 M83 193 C88 197 93 198 97 195 M155 178 C161 181 166 181 170 178 M158 195 C164 198 169 197 173 193" fill="none" stroke={palette.outfit.deep} strokeWidth="1.8" strokeLinecap="round" opacity="0.72" />
        <path className="avatar-sleeve-fold avatar-highlight" d="M72 165 C78 159 84 156 90 155 M160 164 C165 171 169 179 171 186" fill="none" stroke={palette.outfit.light} strokeWidth="2" strokeLinecap="round" opacity="0.46" />
        <path className="avatar-ribbing avatar-outline" d={`M${hands.hip.x - 7} ${hands.hip.y - 14} C78 193 85 195 91 191 L94 200 C90 207 81 210 75 205 Z`} fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2" />
        <path className="avatar-ribbing avatar-outline" d="M155 203 C161 207 169 206 174 201 L175 211 C171 218 161 220 155 214 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2" />
        <path className="avatar-detail" d="M77 193 L79 206 M82 194 L84 207 M87 193 L89 203 M160 206 L160 217 M165 206 L165 218 M170 204 L170 215" fill="none" stroke={palette.outfit.light} strokeWidth="1" opacity="0.5" />
        <path className="avatar-drawstring avatar-outfit-seam" d="M112 156 L110 182 M133 157 L134 183" fill="none" stroke="#f8e8cf" strokeWidth="2.5" strokeLinecap="round" />
        <circle className="avatar-drawstring avatar-detail" cx="110" cy="184" r="2.6" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1" />
        <circle className="avatar-drawstring avatar-detail" cx="134" cy="185" r="2.6" fill="#f8e8cf" stroke={palette.outfit.outline} strokeWidth="1" />
        <path className="avatar-outfit-seam avatar-outline" d="M98 190 C110 189 135 191 146 194 L150 213 C133 218 111 216 94 211 Z" fill={palette.outfit.shadow} stroke={palette.outfit.outline} strokeWidth="2.1" strokeLinejoin="round" />
        <path className="avatar-pocket-stitch" d="M101 193 C111 196 135 198 144 196 M99 207 C112 212 134 213 146 209" fill="none" stroke={palette.outfit.light} strokeWidth="1.2" strokeDasharray="2.4 2.4" strokeLinecap="round" opacity="0.65" />
        <path className="avatar-highlight" d="M102 194 C111 193 122 194 131 195" fill="none" stroke={palette.outfit.light} strokeWidth="2.1" strokeLinecap="round" opacity="0.58" />
        <path className="avatar-ribbing avatar-outline" d="M87 209 C107 215 140 218 159 211 L158 223 C139 230 108 227 87 220 Z" fill={palette.outfit.deep} stroke={palette.outfit.outline} strokeWidth="2.2" strokeLinejoin="round" />
        <path className="avatar-detail" d="M93 213 V221 M99 215 V223 M106 216 V224 M113 217 V225 M133 218 V226 M140 217 V225 M147 215 V223 M153 213 V221" fill="none" stroke={palette.outfit.light} strokeWidth="1" opacity="0.45" />
        <path className="avatar-shorts-boundary avatar-outfit-seam" d="M87 213 C107 214 139 220 158 215 M123 218 L120 237" fill="none" stroke={palette.outfit.outline} strokeWidth="1.6" strokeLinecap="round" />
        <path className="avatar-outline" d={FREE_SHORTS_PATH} fill="none" stroke={palette.outfit.outline} strokeWidth="2.7" strokeLinejoin="round" />
        <path className="avatar-outline" d={WEIGHT_SHORTS_PATH} fill="none" stroke={palette.outfit.outline} strokeWidth="2.7" strokeLinejoin="round" />
        <path className="avatar-highlight" d="M90 216 C99 217 108 219 115 219" fill="none" stroke={palette.outfit.light} strokeWidth="2" strokeLinecap="round" opacity="0.58" />
        <path className="avatar-detail" d="M88 228 C96 233 106 233 114 230 M127 232 C136 235 147 233 155 229" fill="none" stroke={palette.outfit.light} strokeWidth="1.2" strokeLinecap="round" opacity="0.32" />
        {build === 'slim' ? (
          <path className="avatar-build-tailoring avatar-detail" d="M101 151 C105 166 105 178 102 187 M142 151 C139 166 139 179 142 188" fill="none" stroke={palette.outfit.light} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        ) : build === 'broad' ? (
          <path className="avatar-build-yoke avatar-detail" d="M91 151 C106 158 137 160 154 151 M95 157 C110 164 136 165 150 158" fill="none" stroke={palette.outfit.light} strokeWidth="1.7" strokeLinecap="round" opacity="0.58" />
        ) : (
          <path className="avatar-build-center-seam avatar-detail" d="M122 151 C121 164 122 177 123 188" fill="none" stroke={palette.outfit.light} strokeWidth="1.35" strokeLinecap="round" opacity="0.46" />
        )}
      </g>
      <g transform={rig.legs.free.transform}>
        <path className="avatar-outline" d={FREE_SOCK_PATH} fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="1.9" />
        <path className="avatar-sock-detail avatar-detail" d="M81 276 L101 278" fill="none" stroke={palette.outfit.base} strokeWidth="4" />
        <path className="avatar-shoe-panel" d={FREE_SHOE_PANEL_PATH} fill={palette.gear.light} opacity="0.48" />
        <path className="avatar-shoe-lace avatar-detail" d="M76 296 L96 302 M72 300 L96 305" fill="none" stroke="#f8f4eb" strokeWidth="2.2" strokeLinecap="round" />
        <path className="avatar-shoe-sole avatar-outfit-seam" d="M61 305 C73 309 89 309 101 306" fill="none" stroke="#f8f4eb" strokeWidth="4.2" strokeLinecap="round" />
        <path className="avatar-shoe-sole avatar-detail" d={`M61 ${soles.free.y} H100`} fill="none" stroke={palette.gear.outline} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      </g>
      <g transform={rig.legs.weight.transform}>
        <path className="avatar-outline" d={WEIGHT_SOCK_PATH} fill="#f8f4eb" stroke={palette.gear.outline} strokeWidth="1.9" />
        <path className="avatar-sock-detail avatar-detail" d="M129 276 L150 276" fill="none" stroke={palette.outfit.base} strokeWidth="4" />
        <path className="avatar-shoe-panel" d={WEIGHT_SHOE_PANEL_PATH} fill={palette.gear.base} opacity="0.7" />
        <path className="avatar-shoe-lace avatar-detail" d="M136 301 L157 298 M138 305 L162 302" fill="none" stroke="#f8f4eb" strokeWidth="2.2" strokeLinecap="round" />
        <path className="avatar-shoe-sole avatar-outfit-seam" d="M129 310 C142 313 158 312 170 310" fill="none" stroke="#f8f4eb" strokeWidth="4.2" strokeLinecap="round" />
        <path className="avatar-shoe-sole avatar-detail" d={`M130 ${soles.weight.y} H168`} fill="none" stroke={palette.gear.outline} strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
      </g>
    </g>
  );
}

function OutfitSurface({ build, palette, paints, section }) {
  if (section === 'base') return <OutfitBase build={build} palette={palette} paints={paints} />;
  if (section === 'finish') return <OutfitFinish build={build} palette={palette} />;
  return null;
}

export function SlimBody(props) {
  return (
    <g data-avatar-variant="body:slim">
      <OutfitSurface {...props} build="slim" />
    </g>
  );
}

export function RegularBody(props) {
  return (
    <g data-avatar-variant="body:regular">
      <OutfitSurface {...props} build="regular" />
    </g>
  );
}

export function BroadBody(props) {
  return (
    <g data-avatar-variant="body:broad">
      <OutfitSurface {...props} build="broad" />
    </g>
  );
}

function StripesPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:stripes" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M54 153 L99 124 M60 180 L139 128 M65 207 L174 136 M82 225 L181 160 M113 239 L183 191" fill="none" stroke={palette.outfit.highlight} strokeWidth="7" opacity="0.52" />
      <path className="avatar-outfit-pattern-detail" d="M57 160 L105 128 M65 188 L146 134 M73 214 L180 143 M94 231 L182 171" fill="none" stroke={palette.outfit.deep} strokeWidth="2.2" opacity="0.42" />
    </g>
  );
}

function StarsPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:stars" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M101 151 l2.8 5.7 6.3 0.9-4.55 4.45 1.08 6.28-5.63-2.96-5.63 2.96 1.08-6.28-4.55-4.45 6.3-0.9 Z M140 178 l2.5 5.1 5.6 0.8-4.05 3.95 0.96 5.58-5.01-2.63-5.01 2.63 0.96-5.58-4.05-3.95 5.6-0.8 Z M109 218 l2.1 4.25 4.7 0.68-3.4 3.31 0.8 4.68-4.2-2.21-4.2 2.21 0.8-4.68-3.4-3.31 4.7-0.68 Z" fill={palette.outfit.highlight} stroke={palette.outfit.outline} strokeWidth="1.25" opacity="0.78" />
      <circle className="avatar-outfit-pattern-detail" cx="127" cy="157" r="2.2" fill={palette.outfit.light} />
      <circle className="avatar-outfit-pattern-detail" cx="94" cy="192" r="1.8" fill={palette.outfit.deep} />
    </g>
  );
}

function CamoPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:camo" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M78 147 C88 138 103 140 108 149 C112 158 100 165 89 163 C80 161 72 155 78 147 Z M128 133 C140 128 154 135 153 145 C152 154 140 156 133 151 C126 147 119 138 128 133 Z M105 176 C116 168 131 170 135 180 C139 189 128 197 116 194 C106 192 97 184 105 176 Z M143 201 C154 194 169 199 168 210 C167 219 153 224 144 217 C137 213 136 205 143 201 Z M82 216 C92 208 108 210 111 219 C114 229 101 236 91 231 C82 227 76 221 82 216 Z" fill={palette.outfit.deep} opacity="0.42" />
      <path className="avatar-outfit-pattern-detail" d="M93 133 C102 128 113 132 115 140 C116 147 106 151 99 148 C92 145 88 137 93 133 Z M137 160 C145 154 157 158 159 167 C160 175 149 181 141 176 C134 172 131 165 137 160 Z M111 204 C120 198 133 202 135 211 C136 220 125 225 116 221 C108 218 104 209 111 204 Z" fill={palette.outfit.highlight} opacity="0.44" />
    </g>
  );
}

function TieDyePattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:tie_dye" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M122 178 C104 166 88 177 94 191 C100 205 128 204 142 190 C157 176 149 153 130 149 C109 145 87 157 79 176 M122 178 C139 183 145 199 136 211 C126 225 101 222 91 207" fill="none" stroke={palette.outfit.highlight} strokeWidth="8" strokeLinecap="round" opacity="0.44" />
      <path className="avatar-outfit-pattern-detail" d="M122 178 C112 175 105 181 108 188 C112 196 126 194 131 187 C137 179 132 169 123 168 M121 178 C128 184 129 194 123 201" fill="none" stroke={palette.outfit.deep} strokeWidth="4" strokeLinecap="round" opacity="0.58" />
      <circle className="avatar-outfit-pattern-detail" cx="121" cy="179" r="4.5" fill={palette.outfit.light} opacity="0.8" />
    </g>
  );
}

function PlaidPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:plaid" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M92 125 V239 M116 121 V241 M142 124 V240 M166 136 V226" fill="none" stroke={palette.outfit.deep} strokeWidth="6" opacity="0.34" />
      <path className="avatar-outfit-pattern" d="M65 150 H177 M66 177 H177 M69 204 H175 M78 228 H166" fill="none" stroke={palette.outfit.highlight} strokeWidth="6" opacity="0.38" />
      <path className="avatar-outfit-pattern-detail" d="M98 123 V239 M148 127 V238 M65 157 H177 M69 211 H173" fill="none" stroke={palette.outfit.outline} strokeWidth="1.5" opacity="0.52" />
    </g>
  );
}

function NeonPulsePattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:neon_pulse" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M65 177 H91 L99 164 L110 195 L121 145 L133 185 L142 172 H176 M76 219 H101 L108 208 L118 229 L129 202 L138 218 H164" fill="none" stroke="#ff4fd8" strokeWidth="6.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.78" />
      <path className="avatar-outfit-pattern-detail" d="M65 177 H91 L99 164 L110 195 L121 145 L133 185 L142 172 H176 M76 219 H101 L108 208 L118 229 L129 202 L138 218 H164" fill="none" stroke="#72e7ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="121" cy="145" r="3" fill={palette.outfit.highlight} />
    </g>
  );
}

function MoonSigilPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:moon_sigil" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M128 150 C111 153 104 175 115 188 C125 201 146 194 151 178 C142 185 128 181 124 170 C121 162 123 155 128 150 Z" fill="#c4b5fd" stroke={palette.outfit.outline} strokeWidth="1.8" opacity="0.86" />
      <path className="avatar-outfit-pattern-detail" d="M91 193 C108 205 139 207 158 191 M96 198 C111 185 145 184 157 198" fill="none" stroke={palette.outfit.highlight} strokeWidth="2" strokeLinecap="round" opacity="0.68" />
      <path className="avatar-outfit-pattern-detail" d="M101 156 l2 4.1 4.5 0.65-3.25 3.17 0.77 4.48-4.02-2.12-4.02 2.12 0.77-4.48-3.25-3.17 4.5-0.65 Z M145 211 l1.7 3.45 3.8 0.55-2.75 2.68 0.65 3.79-3.4-1.79-3.4 1.79 0.65-3.79-2.75-2.68 3.8-0.55 Z" fill="#f8e7a1" />
    </g>
  );
}

function TinyBowsPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:tiny_bows" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M96 151 C89 146 85 150 88 157 C91 162 96 161 101 157 C106 162 112 162 114 156 C116 149 110 146 104 151 L101 154 Z M132 181 C125 176 121 180 124 187 C127 192 132 191 137 187 C142 192 148 192 150 186 C152 179 146 176 140 181 L137 184 Z M102 215 C95 210 91 214 94 221 C97 226 102 225 107 221 C112 226 118 226 120 220 C122 213 116 210 110 215 L107 218 Z" fill="#f9a8d4" stroke={palette.outfit.outline} strokeWidth="1.25" opacity="0.9" />
      <circle className="avatar-outfit-pattern-detail" cx="101" cy="155" r="2.2" fill="#fff1f7" />
      <circle className="avatar-outfit-pattern-detail" cx="137" cy="185" r="2.2" fill="#fff1f7" />
      <circle className="avatar-outfit-pattern-detail" cx="107" cy="219" r="2.2" fill="#fff1f7" />
    </g>
  );
}

function BatStarsPattern({ patternId, palette, clipId }) {
  return (
    <g data-avatar-variant="pattern:bat_stars" data-pattern-id={patternId} clipPath={`url(#${clipId})`}>
      <path className="avatar-outfit-pattern" d="M90 158 C96 151 102 153 106 159 C110 152 117 151 122 158 C118 158 116 162 116 167 C112 163 108 165 106 170 C103 165 99 163 95 167 C96 162 94 159 90 158 Z M126 202 C132 195 138 197 142 203 C146 196 153 195 158 202 C154 202 152 206 152 211 C148 207 144 209 142 214 C139 209 135 207 131 211 C132 206 130 203 126 202 Z" fill="#8b5cf6" stroke={palette.outfit.outline} strokeWidth="1.5" />
      <path className="avatar-outfit-pattern-detail" d="M145 153 l2 4.1 4.5 0.65-3.25 3.17 0.77 4.48-4.02-2.12-4.02 2.12 0.77-4.48-3.25-3.17 4.5-0.65 Z M101 198 l1.7 3.45 3.8 0.55-2.75 2.68 0.65 3.79-3.4-1.79-3.4 1.79 0.65-3.79-2.75-2.68 3.8-0.55 Z" fill="#ffd166" />
      <circle className="avatar-outfit-pattern-detail" cx="119" cy="184" r="2.1" fill={palette.outfit.highlight} />
    </g>
  );
}

export const BODY_RENDERERS = Object.freeze({
  slim: SlimBody,
  regular: RegularBody,
  broad: BroadBody,
});

export const OUTFIT_PATTERN_RENDERERS = Object.freeze({
  none: EmptyPart,
  stripes: StripesPattern,
  stars: StarsPattern,
  camo: CamoPattern,
  tie_dye: TieDyePattern,
  plaid: PlaidPattern,
  neon_pulse: NeonPulsePattern,
  moon_sigil: MoonSigilPattern,
  tiny_bows: TinyBowsPattern,
  bat_stars: BatStarsPattern,
});
