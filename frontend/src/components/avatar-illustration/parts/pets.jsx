import { mixHex } from '../../avatar/avatarPaint.js';
import {
  buildPetColors,
  getPetLevelInfo,
  getPetLevelScale,
  getPetXpForPet,
} from '../../avatar-editor/avatarPetCatalog.js';
import { mapLegacyPetPoint } from '../avatarGeometry.js';

const EMPTY_CONFIG = Object.freeze({});
const NAMED_BASELINE_OFFSET = 58;
const CUSTOM_CENTER_TO_BASELINE = 26;
const HEAD_CENTER_BASELINE_Y_OFFSET = 11;
const HEAD_CENTER_PLACEMENT_SCALE = 0.44;
const HEAD_SIDE_PLACEMENT_SCALE = 0.72;
const HEAD_BASELINE_X_OFFSET = 83;
const COMPACT_VIEW_BOX = '154 200 92 120';

export const PET_POSITION_ANCHORS = Object.freeze({
  left: Object.freeze({ x: 40, y: 252 }),
  right: Object.freeze({ x: 200, y: 252 }),
  head: Object.freeze({ x: 120, y: 36 }),
});

const PET_ACCESSORY_ANCHORS = Object.freeze({
  cat: -49,
  dog: -47,
  dragon: -53,
  owl: -52,
  bunny: -59,
  phoenix: -57,
});

function EmptyPart() {
  return null;
}

function buildPetFinish(base) {
  return Object.freeze({
    base,
    light: mixHex(base, '#ffffff', 0.34),
    highlight: mixHex(base, '#ffffff', 0.58),
    shadow: mixHex(base, '#000000', 0.24),
    deep: mixHex(base, '#000000', 0.43),
    outline: mixHex(base, '#1b1020', 0.72),
  });
}

function buildPetFinishes(colors) {
  return Object.freeze({
    body: buildPetFinish(colors.body),
    ears: buildPetFinish(colors.ears),
    tail: buildPetFinish(colors.tail),
    accent: buildPetFinish(colors.accent),
  });
}

function PetEye({ x, y, finishes, scale = 1 }) {
  return (
    <g className="avatar-pet-eye" transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse
        className="avatar-pet-eye-sclera avatar-outline"
        cx="0"
        cy="0"
        rx="5.2"
        ry="6.3"
        fill="#fffaf5"
        stroke={finishes.body.outline}
        strokeWidth="1.25"
      />
      <ellipse cx="0.45" cy="0.6" rx="3.25" ry="4.35" fill={finishes.accent.base} />
      <ellipse cx="0.7" cy="1.25" rx="1.85" ry="2.75" fill={finishes.accent.deep} />
      <ellipse cx="-0.85" cy="-1.45" rx="1.25" ry="1.55" fill="#ffffff" />
      <circle cx="1.85" cy="-0.35" r="0.65" fill="#ffffff" opacity="0.88" />
      <path
        d="M-4.4,-3.2 C-1.8,-6 2.6,-6 4.8,-2.8"
        fill="none"
        stroke={finishes.body.outline}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </g>
  );
}

function PetEyePair({ finishes, y = -31, spread = 7.5, scale = 1 }) {
  return (
    <g data-pet-eye-count="2">
      <PetEye x={-spread} y={y} finishes={finishes} scale={scale} />
      <PetEye x={spread} y={y} finishes={finishes} scale={scale} />
    </g>
  );
}

function CatPet({ finishes }) {
  return (
    <g data-avatar-variant="pet:cat" data-pet-ground="0">
      <path
        className="avatar-pet-tail avatar-outline"
        d="M19,-21 C34,-32 34,-10 24,-8 C29,-16 25,-19 19,-14 Z"
        fill={finishes.tail.base}
        stroke={finishes.tail.outline}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-ear avatar-outline"
        d="M-21,-37 L-20,-54 L-7,-44 Z M21,-37 L20,-54 L7,-44 Z"
        fill={finishes.ears.base}
        stroke={finishes.ears.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path className="avatar-pet-ear-inner" d="M-17,-43 L-16,-49 L-11,-44 Z M17,-43 L16,-49 L11,-44 Z" fill={finishes.accent.light} opacity="0.72" />
      <path
        className="avatar-pet-base avatar-outline"
        d="M-23,-33 C-23,-45 -14,-50 0,-50 C14,-50 23,-44 23,-32 L22,-14 C20,-4 13,0 0,0 C-13,0 -20,-4 -22,-14 Z"
        fill={finishes.body.base}
        stroke={finishes.body.outline}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path className="avatar-pet-shadow" d="M-21,-18 C-13,-10 8,-6 21,-17 L20,-8 C14,-1 -13,3 -20,-8 Z" fill={finishes.body.shadow} opacity="0.72" />
      <path className="avatar-pet-highlight" d="M-17,-39 C-11,-47 1,-48 7,-45 C-4,-43 -10,-38 -13,-28 Z" fill={finishes.body.highlight} opacity="0.5" />
      <PetEyePair finishes={finishes} y={-31} spread={7.4} />
      <path className="avatar-pet-accent" d="M-2,-23 L2,-23 L0,-20 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M0,-20 C-1,-17 -4,-17 -6,-18 M0,-20 C1,-17 4,-17 6,-18" fill="none" stroke={finishes.body.outline} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M-9,-20 L-25,-23 M-9,-17 L-26,-16 M9,-20 L25,-23 M9,-17 L26,-16" fill="none" stroke={finishes.accent.deep} strokeWidth="0.75" strokeLinecap="round" opacity="0.72" />
      <path d="M-14,-2 Q-9,-6 -5,-1 M5,-1 Q9,-6 14,-2" fill="none" stroke={finishes.body.outline} strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

function DogPet({ finishes }) {
  return (
    <g data-avatar-variant="pet:dog" data-pet-ground="0">
      <path
        className="avatar-pet-tail avatar-outline"
        d="M19,-21 C31,-22 34,-34 27,-37 C28,-29 23,-28 18,-29 Z"
        fill={finishes.tail.base}
        stroke={finishes.tail.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-ear avatar-outline"
        d="M-17,-43 C-30,-47 -30,-27 -20,-18 C-14,-25 -13,-35 -17,-43 Z M17,-43 C30,-47 30,-27 20,-18 C14,-25 13,-35 17,-43 Z"
        fill={finishes.ears.base}
        stroke={finishes.ears.outline}
        strokeWidth="2"
      />
      <path
        className="avatar-pet-base avatar-outline"
        d="M-22,-32 C-21,-44 -13,-49 0,-49 C13,-49 21,-44 22,-32 L21,-13 C18,-4 11,0 0,0 C-11,0 -18,-4 -21,-13 Z"
        fill={finishes.body.base}
        stroke={finishes.body.outline}
        strokeWidth="2.2"
      />
      <path className="avatar-pet-shadow" d="M-20,-17 C-8,-8 10,-7 20,-16 L19,-8 C10,1 -11,2 -19,-8 Z" fill={finishes.body.shadow} opacity="0.74" />
      <path className="avatar-pet-highlight" d="M-15,-40 C-8,-47 3,-47 9,-43 C0,-42 -8,-36 -11,-27 Z" fill={finishes.body.highlight} opacity="0.48" />
      <PetEyePair finishes={finishes} y={-30} spread={7.5} scale={0.96} />
      <ellipse className="avatar-pet-accent avatar-outline" cx="0" cy="-20" rx="5.3" ry="3.7" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="1" />
      <ellipse cx="-1.3" cy="-21" rx="1.6" ry="0.75" fill={finishes.accent.highlight} opacity="0.7" />
      <path d="M-4,-16 C-1,-12 1,-12 4,-16 C4,-10 -4,-10 -4,-16 Z" fill="#ef8da8" stroke={finishes.body.outline} strokeWidth="0.7" />
      <path d="M-14,-2 Q-9,-6 -5,-1 M5,-1 Q9,-6 14,-2" fill="none" stroke={finishes.body.outline} strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

function DragonPet({ finishes }) {
  return (
    <g data-avatar-variant="pet:dragon" data-pet-ground="0">
      <path
        className="avatar-pet-tail avatar-outline"
        d="M20,-19 C31,-20 32,-8 27,-4 C24,-10 20,-9 16,-8 Z"
        fill={finishes.tail.base}
        stroke={finishes.tail.outline}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-accent avatar-pet-wing avatar-outline"
        d="M-16,-31 L-29,-44 L-26,-25 L-17,-17 Z M16,-31 L29,-44 L26,-25 L17,-17 Z"
        fill={finishes.accent.base}
        stroke={finishes.accent.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path className="avatar-pet-wing-detail" d="M-25,-39 L-19,-27 M25,-39 L19,-27" fill="none" stroke={finishes.accent.light} strokeWidth="1.2" strokeLinecap="round" />
      <path
        className="avatar-pet-ear avatar-outline"
        d="M-18,-42 L-17,-55 L-7,-45 L0,-57 L7,-45 L17,-55 L18,-42 Z"
        fill={finishes.ears.base}
        stroke={finishes.ears.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-base avatar-outline"
        d="M-24,-34 C-20,-48 -11,-52 0,-52 C11,-52 20,-48 24,-34 L22,-13 C18,-3 10,0 0,0 C-10,0 -18,-3 -22,-13 Z"
        fill={finishes.body.base}
        stroke={finishes.body.outline}
        strokeWidth="2.3"
      />
      <path className="avatar-pet-shadow" d="M-21,-19 C-11,-9 10,-7 21,-18 L19,-7 C11,1 -12,2 -19,-8 Z" fill={finishes.body.shadow} opacity="0.76" />
      <path className="avatar-pet-highlight" d="M-17,-39 C-10,-49 1,-50 8,-46 C-3,-44 -10,-37 -12,-27 Z" fill={finishes.body.highlight} opacity="0.5" />
      <PetEyePair finishes={finishes} y={-32} spread={8.2} scale={0.98} />
      <path className="avatar-pet-accent" d="M-5,-20 Q0,-15 5,-20 L3,-10 Q0,-7 -3,-10 Z" fill={finishes.accent.light} stroke={finishes.accent.outline} strokeWidth="0.9" />
      <path d="M-3,-24 Q0,-21 3,-24" fill="none" stroke={finishes.body.outline} strokeWidth="1" strokeLinecap="round" />
      <path d="M-16,-2 Q-11,-7 -5,-1 M5,-1 Q11,-7 16,-2" fill="none" stroke={finishes.body.outline} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function OwlPet({ finishes }) {
  return (
    <g data-avatar-variant="pet:owl" data-pet-ground="0">
      <path
        className="avatar-pet-tail avatar-outline"
        d="M-8,-8 L0,0 L8,-8 L6,-17 L-6,-17 Z"
        fill={finishes.tail.base}
        stroke={finishes.tail.outline}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-ear avatar-outline"
        d="M-19,-42 L-18,-55 L-7,-47 L7,-47 L18,-55 L19,-42 Z"
        fill={finishes.ears.base}
        stroke={finishes.ears.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-base avatar-outline"
        d="M0,-52 C17,-52 24,-40 23,-25 C22,-9 14,0 0,0 C-14,0 -22,-9 -23,-25 C-24,-40 -17,-52 0,-52 Z"
        fill={finishes.body.base}
        stroke={finishes.body.outline}
        strokeWidth="2.2"
      />
      <path className="avatar-pet-shadow" d="M-20,-25 C-14,-12 -7,-5 0,-2 C7,-5 14,-12 20,-25 C21,-10 13,0 0,0 C-13,0 -21,-10 -20,-25 Z" fill={finishes.body.shadow} opacity="0.72" />
      <path className="avatar-pet-highlight" d="M-15,-42 C-8,-50 3,-51 9,-47 C0,-45 -7,-38 -9,-27 Z" fill={finishes.body.highlight} opacity="0.48" />
      <path className="avatar-pet-wing" d="M-21,-28 C-27,-19 -22,-8 -13,-5 C-15,-14 -12,-21 -8,-27 Z M21,-28 C27,-19 22,-8 13,-5 C15,-14 12,-21 8,-27 Z" fill={finishes.tail.base} stroke={finishes.tail.outline} strokeWidth="1.2" />
      <PetEyePair finishes={finishes} y={-32} spread={7.8} scale={1.05} />
      <path className="avatar-pet-accent avatar-outline" d="M-3,-23 L3,-23 L0,-17 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M-12,-4 L-7,-1 M12,-4 L7,-1" fill="none" stroke={finishes.ears.deep} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function BunnyPet({ finishes }) {
  return (
    <g data-avatar-variant="pet:bunny" data-pet-ground="0">
      <circle className="avatar-pet-tail avatar-outline" cx="21" cy="-13" r="8" fill={finishes.tail.light} stroke={finishes.tail.outline} strokeWidth="1.7" />
      <path
        className="avatar-pet-ear avatar-outline"
        d="M-15,-40 C-22,-56 -18,-65 -11,-63 C-4,-61 -4,-50 -7,-39 Z M15,-40 C22,-56 18,-65 11,-63 C4,-61 4,-50 7,-39 Z"
        fill={finishes.ears.base}
        stroke={finishes.ears.outline}
        strokeWidth="1.9"
      />
      <path className="avatar-pet-accent" d="M-13,-43 C-17,-55 -15,-60 -12,-59 C-8,-58 -8,-50 -10,-43 Z M13,-43 C17,-55 15,-60 12,-59 C8,-58 8,-50 10,-43 Z" fill={finishes.accent.light} opacity="0.78" />
      <path
        className="avatar-pet-base avatar-outline"
        d="M-22,-31 C-21,-44 -13,-49 0,-49 C13,-49 21,-44 22,-31 L21,-13 C18,-4 11,0 0,0 C-11,0 -18,-4 -21,-13 Z"
        fill={finishes.body.base}
        stroke={finishes.body.outline}
        strokeWidth="2.2"
      />
      <path className="avatar-pet-shadow" d="M-20,-17 C-11,-9 10,-7 20,-16 L18,-7 C10,1 -11,2 -18,-7 Z" fill={finishes.body.shadow} opacity="0.72" />
      <path className="avatar-pet-highlight" d="M-16,-39 C-9,-47 1,-48 8,-44 C-2,-42 -9,-36 -11,-27 Z" fill={finishes.body.highlight} opacity="0.5" />
      <PetEyePair finishes={finishes} y={-30} spread={7.4} scale={0.95} />
      <path className="avatar-pet-accent avatar-outline" d="M-3,-21 Q0,-24 3,-21 Q0,-17 -3,-21 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="0.8" />
      <path d="M0,-18 V-14 M0,-14 Q-4,-12 -6,-15 M0,-14 Q4,-12 6,-15" fill="none" stroke={finishes.body.outline} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M-14,-2 Q-9,-6 -5,-1 M5,-1 Q9,-6 14,-2" fill="none" stroke={finishes.body.outline} strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

function PhoenixPet({ finishes }) {
  return (
    <g data-avatar-variant="pet:phoenix" data-pet-ground="0">
      <path
        className="avatar-pet-tail avatar-outline"
        d="M-12,-15 C-29,-12 -29,-1 -18,-5 C-27,5 -10,3 0,-4 C10,3 27,5 18,-5 C29,-1 29,-12 12,-15 Z"
        fill={finishes.tail.base}
        stroke={finishes.tail.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-accent avatar-pet-wing avatar-outline"
        d="M-17,-31 C-30,-36 -31,-21 -23,-14 C-22,-24 -15,-20 -11,-15 Z M17,-31 C30,-36 31,-21 23,-14 C22,-24 15,-20 11,-15 Z"
        fill={finishes.accent.base}
        stroke={finishes.accent.outline}
        strokeWidth="1.8"
      />
      <path
        className="avatar-pet-ear avatar-outline"
        d="M-16,-43 L-24,-56 L-8,-48 L0,-62 L7,-48 L22,-58 L17,-42 Z"
        fill={finishes.ears.base}
        stroke={finishes.ears.outline}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-pet-base avatar-outline"
        d="M-22,-35 C-19,-49 -11,-53 0,-53 C12,-53 20,-48 22,-35 L20,-13 C16,-3 9,0 0,0 C-9,0 -16,-3 -20,-13 Z"
        fill={finishes.body.base}
        stroke={finishes.body.outline}
        strokeWidth="2.3"
      />
      <path className="avatar-pet-shadow" d="M-19,-21 C-10,-9 9,-7 20,-19 L17,-7 C8,1 -10,2 -18,-8 Z" fill={finishes.body.shadow} opacity="0.74" />
      <path className="avatar-pet-highlight" d="M-16,-41 C-9,-50 2,-51 9,-47 C-2,-45 -9,-38 -11,-28 Z" fill={finishes.body.highlight} opacity="0.54" />
      <PetEyePair finishes={finishes} y={-33} spread={8} scale={0.96} />
      <path className="avatar-pet-accent avatar-outline" d="M-4,-23 L5,-23 L1,-17 Z" fill={finishes.accent.highlight} stroke={finishes.accent.outline} strokeWidth="0.9" strokeLinejoin="round" />
      <path d="M-13,-4 L-7,-1 M13,-4 L7,-1" fill="none" stroke={finishes.body.outline} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function PetCrown({ finishes }) {
  return (
    <g data-avatar-variant="pet-accessory:crown">
      <path className="avatar-pet-accessory-base avatar-outline" d="M-12,0 L-10,-10 L-4,-5 L0,-13 L4,-5 L10,-10 L12,0 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="1.4" strokeLinejoin="round" />
      <path className="avatar-pet-accessory-highlight" d="M-8,-1 L-7,-6 L-4,-3 L-2,-1 Z" fill={finishes.accent.highlight} opacity="0.74" />
      <circle cx="0" cy="-4" r="2" fill={finishes.tail.highlight} stroke={finishes.accent.outline} strokeWidth="0.7" />
    </g>
  );
}

function PetPartyHat({ finishes }) {
  return (
    <g data-avatar-variant="pet-accessory:party_hat">
      <path className="avatar-pet-accessory-base avatar-outline" d="M-11,0 L1,-20 L11,0 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="1.4" strokeLinejoin="round" />
      <path className="avatar-pet-accessory-highlight" d="M-6,-1 L1,-16 L2,-1 Z" fill={finishes.accent.highlight} opacity="0.56" />
      <path d="M-7,-5 L6,-8 M-3,-12 L4,-13" fill="none" stroke={finishes.tail.light} strokeWidth="1.5" />
      <circle cx="1" cy="-21" r="3" fill={finishes.tail.highlight} stroke={finishes.tail.outline} strokeWidth="0.8" />
    </g>
  );
}

function PetBow({ finishes }) {
  return (
    <g data-avatar-variant="pet-accessory:bow">
      <path className="avatar-pet-accessory-base avatar-outline" d="M-2,-1 C-8,-8 -15,-8 -14,0 C-13,7 -7,6 -2,2 Z M2,-1 C8,-8 15,-8 14,0 C13,7 7,6 2,2 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="1.4" />
      <path className="avatar-pet-accessory-highlight" d="M-4,-1 C-8,-5 -11,-4 -10,-1 C-9,1 -7,1 -4,1 Z" fill={finishes.accent.highlight} opacity="0.72" />
      <circle cx="0" cy="0" r="3.4" fill={finishes.accent.shadow} stroke={finishes.accent.outline} strokeWidth="1" />
    </g>
  );
}

function PetBandana({ finishes }) {
  return (
    <g data-avatar-variant="pet-accessory:bandana">
      <path className="avatar-pet-accessory-base avatar-outline" d="M-21,-1 Q0,7 21,-1 L18,7 Q0,14 -18,7 Z" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="1.4" />
      <path className="avatar-pet-accessory-highlight" d="M-16,1 Q-5,6 6,5 L2,8 Q-8,8 -16,5 Z" fill={finishes.accent.highlight} opacity="0.6" />
      <path d="M16,5 L24,14 L17,13 L12,7 Z" fill={finishes.accent.shadow} stroke={finishes.accent.outline} strokeWidth="1.1" strokeLinejoin="round" />
    </g>
  );
}

function PetHalo({ finishes }) {
  return (
    <g data-avatar-variant="pet-accessory:halo">
      <ellipse className="avatar-pet-accessory-base avatar-outline" cx="0" cy="0" rx="16" ry="4.8" fill="none" stroke={finishes.accent.base} strokeWidth="2.5" />
      <path className="avatar-pet-accessory-highlight" d="M-11,-2 C-5,-5 4,-5 10,-2" fill="none" stroke={finishes.accent.highlight} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function PetFlower({ finishes }) {
  return (
    <g data-avatar-variant="pet-accessory:flower">
      <circle className="avatar-pet-accessory-base avatar-outline" cx="0" cy="-5" r="4.5" fill={finishes.accent.base} stroke={finishes.accent.outline} strokeWidth="1" />
      <circle cx="0" cy="-12" r="5" fill={finishes.tail.light} stroke={finishes.tail.outline} strokeWidth="1" />
      <circle cx="6.7" cy="-7" r="5" fill={finishes.tail.light} stroke={finishes.tail.outline} strokeWidth="1" />
      <circle cx="4.2" cy="1" r="5" fill={finishes.tail.light} stroke={finishes.tail.outline} strokeWidth="1" />
      <circle cx="-4.2" cy="1" r="5" fill={finishes.tail.light} stroke={finishes.tail.outline} strokeWidth="1" />
      <circle cx="-6.7" cy="-7" r="5" fill={finishes.tail.light} stroke={finishes.tail.outline} strokeWidth="1" />
      <circle className="avatar-pet-accessory-highlight" cx="-1.3" cy="-6.5" r="1.5" fill={finishes.accent.highlight} />
    </g>
  );
}

function PetRearEffects({ level, finishes }) {
  return (
    <g aria-hidden="true" data-pet-effect-zone="outside-face">
      {level >= 2 ? (
        <ellipse data-pet-effect="aura" cx="0" cy="-26" rx="27" ry="27" fill={finishes.accent.light} opacity="0.12" stroke={finishes.accent.base} strokeWidth="1.2" />
      ) : null}
      {level >= 7 ? (
        <g data-pet-effect="glow" opacity="0.58">
          <ellipse cx="0" cy="-26" rx="29" ry="29" fill="none" stroke={finishes.accent.highlight} strokeWidth="1.4" />
          <ellipse cx="0" cy="-26" rx="26" ry="26" fill="none" stroke={finishes.accent.light} strokeWidth="0.8" />
        </g>
      ) : null}
    </g>
  );
}

function PetFrontEffects({ level, finishes }) {
  return (
    <g aria-hidden="true" data-pet-effect-zone="outside-face">
      {level >= 3 ? (
        <g data-pet-effect="gem-collar">
          <path d="M-10,-13 Q0,-8 10,-13" fill="none" stroke={finishes.accent.deep} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-3,-10 L0,-14 L3,-10 L0,-5 Z" fill={finishes.accent.highlight} stroke={finishes.accent.outline} strokeWidth="0.8" />
        </g>
      ) : null}
      {level >= 4 ? (
        <g data-pet-effect="eye-shine" fill="#ffffff" opacity="0.88">
          <path d="M-15,-40 L-14,-37 L-11,-36 L-14,-35 L-15,-32 L-16,-35 L-19,-36 L-16,-37 Z" />
          <path d="M15,-40 L16,-37 L19,-36 L16,-35 L15,-32 L14,-35 L11,-36 L14,-37 Z" />
        </g>
      ) : null}
      {level >= 5 ? (
        <g data-pet-effect="sparkles" fill="#ffffff">
          <path d="M-27,-45 L-26,-42 L-23,-41 L-26,-40 L-27,-37 L-28,-40 L-31,-41 L-28,-42 Z" />
          <path d="M26,-32 L27,-29 L30,-28 L27,-27 L26,-24 L25,-27 L22,-28 L25,-29 Z" />
        </g>
      ) : null}
      {level >= 6 ? (
        <path data-pet-effect="shimmer" d="M-19,-19 C-12,-11 -4,-8 5,-9" fill="none" stroke={finishes.body.highlight} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.76" />
      ) : null}
      {level >= 8 ? (
        <g data-pet-effect="gold-sparkles" fill="#fbbf24" stroke="#b45309" strokeWidth="0.45">
          <path d="M-25,-24 L-24,-21 L-21,-20 L-24,-19 L-25,-16 L-26,-19 L-29,-20 L-26,-21 Z" />
          <path d="M24,-50 L25,-47 L28,-46 L25,-45 L24,-42 L23,-45 L20,-46 L23,-47 Z" />
          <circle cx="27" cy="-10" r="1.7" />
        </g>
      ) : null}
    </g>
  );
}

function resolvePetPlacement(config, position) {
  if (position === 'custom') {
    const mapped = mapLegacyPetPoint(config.pet_x, config.pet_y);
    return Object.freeze({
      anchorX: mapped.x,
      anchorY: mapped.y,
      baselineX: mapped.x,
      baselineY: Math.min(306, mapped.y + CUSTOM_CENTER_TO_BASELINE),
      facing: mapped.x < 120 ? 1 : -1,
      placementScale: 1,
      perchMode: 'custom',
    });
  }

  const safePosition = PET_POSITION_ANCHORS[position] ? position : 'right';
  const anchor = PET_POSITION_ANCHORS[safePosition];
  const usesSidePerch = safePosition === 'head'
    && Boolean(config.hat && config.hat !== 'none');
  return Object.freeze({
    anchorX: anchor.x,
    anchorY: anchor.y,
    baselineX: safePosition === 'head'
      ? anchor.x + (usesSidePerch ? HEAD_BASELINE_X_OFFSET : 0)
      : anchor.x,
    baselineY: anchor.y + (
      safePosition === 'head' && !usesSidePerch
        ? HEAD_CENTER_BASELINE_Y_OFFSET
        : NAMED_BASELINE_OFFSET
    ),
    facing: safePosition === 'right' || usesSidePerch ? -1 : 1,
    placementScale: safePosition === 'head'
      ? (usesSidePerch ? HEAD_SIDE_PLACEMENT_SCALE : HEAD_CENTER_PLACEMENT_SCALE)
      : 1,
    perchMode: safePosition === 'head' ? (usesSidePerch ? 'side' : 'center') : 'ground',
  });
}

export const PET_RENDERERS = Object.freeze({
  none: EmptyPart,
  cat: CatPet,
  dog: DogPet,
  dragon: DragonPet,
  owl: OwlPet,
  bunny: BunnyPet,
  phoenix: PhoenixPet,
});

export const PET_ACCESSORY_RENDERERS = Object.freeze({
  none: EmptyPart,
  crown: PetCrown,
  party_hat: PetPartyHat,
  bow: PetBow,
  bandana: PetBandana,
  halo: PetHalo,
  flower: PetFlower,
});

export function PetArtwork({
  config = EMPTY_CONFIG,
  position,
  level,
  compact = false,
  motionEnabled = true,
}) {
  const petType = config.pet || 'none';
  if (petType === 'none') return null;

  const PetRenderer = PET_RENDERERS[petType] || PET_RENDERERS.none;
  if (PetRenderer === EmptyPart) return null;
  const accessoryType = config.pet_accessory || 'none';
  const PetAccessory = PET_ACCESSORY_RENDERERS[accessoryType] || PET_ACCESSORY_RENDERERS.none;
  const resolvedPosition = position || config.pet_position || 'right';
  const placement = resolvePetPlacement(config, resolvedPosition);
  const petXp = getPetXpForPet(config, petType);
  const requestedLevel = Number(level);
  const resolvedLevel = Number.isFinite(requestedLevel)
    ? Math.min(8, Math.max(1, Math.trunc(requestedLevel)))
    : getPetLevelInfo(petXp).level;
  const levelScale = getPetLevelScale(resolvedLevel);
  const colors = buildPetColors(config);
  const finishes = buildPetFinishes(colors);
  const accessoryY = PET_ACCESSORY_ANCHORS[petType] || PET_ACCESSORY_ANCHORS.cat;
  const artwork = (
    <g
      className="avatar-pet-artwork"
      data-pet-type={petType}
      data-pet-position={resolvedPosition}
      data-pet-anchor={`${placement.anchorX},${placement.anchorY}`}
      data-pet-perch={placement.perchMode}
      data-pet-motion={motionEnabled ? 'on' : 'off'}
      transform={`translate(${placement.baselineX} ${placement.baselineY}) scale(${placement.placementScale}) scale(${placement.facing} 1)`}
    >
      <g data-pet-level={resolvedLevel} data-pet-level-scale={levelScale.toFixed(2)} transform={`scale(${levelScale})`}>
        <PetRearEffects level={resolvedLevel} finishes={finishes} />
        <PetRenderer colors={colors} finishes={finishes} level={resolvedLevel} />
        <g transform={`translate(0 ${accessoryY})`}>
          <PetAccessory colors={colors} finishes={finishes} />
        </g>
        <PetFrontEffects level={resolvedLevel} finishes={finishes} />
      </g>
    </g>
  );

  if (compact) {
    return (
      <svg
        className="avatar-pet-level-preview"
        width="64"
        height="64"
        viewBox={COMPACT_VIEW_BOX}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        {artwork}
      </svg>
    );
  }
  return artwork;
}
