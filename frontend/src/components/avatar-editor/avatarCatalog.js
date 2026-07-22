import { THEMED_AVATAR_OPTIONS } from '../avatar/themedAvatarCatalog.js';
import { PET_OPTIONS } from './avatarPetCatalog.js';

export const HEAD_OPTIONS = Object.freeze([
  { id: 'round', label: 'Round' },
  { id: 'oval', label: 'Oval' },
  { id: 'square', label: 'Square' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'heart', label: 'Heart' },
  { id: 'long', label: 'Long' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'pear', label: 'Pear' },
  { id: 'wide', label: 'Wide' },
]);

export const HAIR_OPTIONS = Object.freeze([
  { id: 'none', label: 'None' },
  { id: 'short', label: 'Short' },
  { id: 'long', label: 'Long' },
  { id: 'spiky', label: 'Spiky' },
  { id: 'curly', label: 'Curly' },
  { id: 'mohawk', label: 'Mohawk' },
  { id: 'buzz', label: 'Buzz' },
  { id: 'ponytail', label: 'Ponytail' },
  { id: 'bun', label: 'Bun' },
  { id: 'pigtails', label: 'Pigtails' },
  { id: 'afro', label: 'Afro' },
  { id: 'braids', label: 'Braids' },
  { id: 'wavy', label: 'Wavy' },
  { id: 'side_part', label: 'Side Part' },
  { id: 'fade', label: 'Fade' },
  { id: 'dreadlocks', label: 'Dreads' },
  { id: 'bob', label: 'Bob' },
  { id: 'shoulder', label: 'Shoulder' },
  { id: 'undercut', label: 'Undercut' },
  { id: 'twin_buns', label: 'Twin Buns' },
  ...THEMED_AVATAR_OPTIONS.hair,
]);

export const EYES_OPTIONS = Object.freeze([
  { id: 'normal', label: 'Normal' },
  { id: 'happy', label: 'Happy' },
  { id: 'wide', label: 'Wide' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'wink', label: 'Wink' },
  { id: 'angry', label: 'Angry' },
  { id: 'dot', label: 'Dot' },
  { id: 'star', label: 'Star' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'sunglasses', label: 'Shades' },
  { id: 'eye_patch', label: 'Eye Patch' },
  { id: 'crying', label: 'Crying' },
  { id: 'heart_eyes', label: 'Hearts' },
  { id: 'dizzy', label: 'Dizzy' },
  { id: 'closed', label: 'Closed' },
]);

export const MOUTH_OPTIONS = Object.freeze([
  { id: 'smile', label: 'Smile' },
  { id: 'grin', label: 'Grin' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'open', label: 'Open' },
  { id: 'tongue', label: 'Tongue' },
  { id: 'frown', label: 'Frown' },
  { id: 'surprised', label: 'Surprised' },
  { id: 'smirk', label: 'Smirk' },
  { id: 'braces', label: 'Braces' },
  { id: 'vampire', label: 'Vampire' },
  { id: 'whistle', label: 'Whistle' },
  { id: 'mask', label: 'Mask' },
  { id: 'beard', label: 'Beard' },
  { id: 'moustache', label: 'Moustache' },
]);

export const BODY_OPTIONS = Object.freeze([
  { id: 'slim', label: 'Slim' },
  { id: 'regular', label: 'Regular' },
  { id: 'broad', label: 'Broad' },
]);

export const HAT_OPTIONS = Object.freeze([
  { id: 'none', label: 'None' },
  { id: 'crown', label: 'Crown' },
  { id: 'wizard', label: 'Wizard' },
  { id: 'beanie', label: 'Beanie' },
  { id: 'cap', label: 'Cap' },
  { id: 'pirate', label: 'Pirate' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'tiara', label: 'Tiara' },
  { id: 'horns', label: 'Horns' },
  { id: 'bunny_ears', label: 'Bunny Ears' },
  { id: 'cat_ears', label: 'Cat Ears' },
  { id: 'halo', label: 'Halo' },
  { id: 'viking', label: 'Viking' },
  ...THEMED_AVATAR_OPTIONS.hat,
]);

export const ACCESSORY_OPTIONS = Object.freeze([
  { id: 'scarf', label: 'Scarf' },
  { id: 'necklace', label: 'Necklace' },
  { id: 'bow_tie', label: 'Bow Tie' },
  { id: 'cape', label: 'Cape' },
  { id: 'wings', label: 'Wings' },
  { id: 'shield', label: 'Shield' },
  { id: 'sword', label: 'Sword' },
  ...THEMED_AVATAR_OPTIONS.accessory,
]);

export const FACE_EXTRA_OPTIONS = Object.freeze([
  { id: 'none', label: 'None' },
  { id: 'freckles', label: 'Freckles' },
  { id: 'blush', label: 'Blush' },
  { id: 'face_paint', label: 'Face Paint' },
  { id: 'scar', label: 'Scar' },
  { id: 'bandage', label: 'Bandage' },
  { id: 'stickers', label: 'Stickers' },
  ...THEMED_AVATAR_OPTIONS.face_extra,
]);

export const OUTFIT_PATTERN_OPTIONS = Object.freeze([
  { id: 'none', label: 'None' },
  { id: 'stripes', label: 'Stripes' },
  { id: 'stars', label: 'Stars' },
  { id: 'camo', label: 'Camo' },
  { id: 'tie_dye', label: 'Tie Dye' },
  { id: 'plaid', label: 'Plaid' },
  ...THEMED_AVATAR_OPTIONS.outfit_pattern,
]);

export const SKIN_COLORS = Object.freeze([
  '#ffe0bd', '#ffcc99', '#f5d6b8', '#f8d9c0',
  '#e8b88a', '#d4a373', '#c68642', '#a67c52',
  '#8d5524', '#6b3a2a', '#4a2912', '#3b1f0e',
  '#f0c4a8', '#d4956a', '#b07848', '#8a6642',
]);

export const HAIR_COLORS = Object.freeze([
  '#4a3728', '#1a1a2e', '#8b4513', '#d4a017',
  '#c0392b', '#2e86c1', '#7d3c98', '#27ae60',
  '#e74c3c', '#f39c12', '#ecf0f1', '#ff6b9d',
]);

export const EYE_COLORS = Object.freeze([
  '#333333', '#1a5276', '#27ae60', '#8b4513',
  '#7d3c98', '#c0392b', '#2e86c1', '#e74c3c',
]);

export const MOUTH_COLORS = Object.freeze([
  '#cc6666', '#e74c3c', '#d4a373', '#c0392b',
  '#ff6b9d', '#a93226', '#8b4513', '#333333',
]);

export const BODY_COLORS = Object.freeze([
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#a855f7', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#1a1a2e', '#ecf0f1',
]);

export const BG_COLORS = Object.freeze([
  '#1a1a2e', '#0f0e17', '#16213e', '#1b4332',
  '#4a1942', '#2d1b69', '#1a3a3a', '#3d0c02',
  '#2e86c1', '#27ae60', '#f39c12', '#8e44ad',
]);

export const HAT_COLORS = Object.freeze([
  '#f39c12', '#e74c3c', '#3b82f6', '#10b981',
  '#a855f7', '#ec4899', '#f59e0b', '#1a1a2e',
  '#c0c0c0', '#f9d71c', '#8b4513', '#ecf0f1',
]);

export const ACCESSORY_COLORS = Object.freeze([
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#a855f7', '#ec4899', '#c0c0c0', '#f9d71c',
  '#8b4513', '#1a1a2e', '#ecf0f1', '#06b6d4',
]);

export const AVATAR_CONFIG_VERSION = 2;

export const DEFAULT_CONFIG = Object.freeze({
  _v: AVATAR_CONFIG_VERSION,
  head: 'round',
  hair: 'short',
  eyes: 'normal',
  mouth: 'smile',
  body: 'regular',
  head_color: '#ffcc99',
  hair_color: '#4a3728',
  eye_color: '#333333',
  mouth_color: '#cc6666',
  body_color: '#3b82f6',
  bg_color: '#1a1a2e',
  hat: 'none',
  hat_color: '#f39c12',
  accessory: 'none',
  accessories: [],
  accessory_color: '#3b82f6',
  face_extra: 'none',
  outfit_pattern: 'none',
  pet: 'none',
  pet_color: '#8b4513',
  pet_color_body: '',
  pet_color_ears: '',
  pet_color_tail: '',
  pet_color_accent: '',
  pet_position: 'right',
  pet_x: 26,
  pet_y: 20,
  pet_accessory: 'none',
});

export const AVATAR_CATALOG = Object.freeze({
  head: { configKey: 'head', itemCategory: 'head', options: HEAD_OPTIONS },
  skin: { colourKey: 'head_color', colours: SKIN_COLORS },
  hair: { configKey: 'hair', itemCategory: 'hair', options: HAIR_OPTIONS, colourKey: 'hair_color', colours: HAIR_COLORS },
  eyes: { configKey: 'eyes', itemCategory: 'eyes', options: EYES_OPTIONS, colourKey: 'eye_color', colours: EYE_COLORS },
  mouth: { configKey: 'mouth', itemCategory: 'mouth', options: MOUTH_OPTIONS, colourKey: 'mouth_color', colours: MOUTH_COLORS },
  body: { configKey: 'body', itemCategory: 'body', options: BODY_OPTIONS },
  outfit: { colourKey: 'body_color', colours: BODY_COLORS },
  pattern: { configKey: 'outfit_pattern', itemCategory: 'outfit_pattern', options: OUTFIT_PATTERN_OPTIONS },
  background: { colourKey: 'bg_color', colours: BG_COLORS },
  hat: { configKey: 'hat', itemCategory: 'hat', options: HAT_OPTIONS, colourKey: 'hat_color', colours: HAT_COLORS },
  face: { configKey: 'face_extra', itemCategory: 'face_extra', options: FACE_EXTRA_OPTIONS },
  accessory: { configKey: 'accessory', itemCategory: 'accessory', options: ACCESSORY_OPTIONS, colourKey: 'accessory_color', colours: ACCESSORY_COLORS, multiple: true },
  pet: { itemCategory: 'pet', options: PET_OPTIONS },
});

export const RANDOMISE_RECIPE = Object.freeze({
  optionGroups: Object.freeze([
    { key: 'head', itemCategory: 'head', options: HEAD_OPTIONS },
    { key: 'hair', itemCategory: 'hair', options: HAIR_OPTIONS },
    { key: 'eyes', itemCategory: 'eyes', options: EYES_OPTIONS },
    { key: 'mouth', itemCategory: 'mouth', options: MOUTH_OPTIONS },
    { key: 'body', itemCategory: 'body', options: BODY_OPTIONS },
    { key: 'outfit_pattern', itemCategory: 'outfit_pattern', options: OUTFIT_PATTERN_OPTIONS },
    { key: 'hat', itemCategory: 'hat', options: HAT_OPTIONS },
    { key: 'face_extra', itemCategory: 'face_extra', options: FACE_EXTRA_OPTIONS },
  ]),
  colourGroups: Object.freeze([
    { key: 'head_color', values: SKIN_COLORS },
    { key: 'hair_color', values: HAIR_COLORS },
    { key: 'eye_color', values: EYE_COLORS },
    { key: 'mouth_color', values: MOUTH_COLORS },
    { key: 'body_color', values: BODY_COLORS },
    { key: 'bg_color', values: BG_COLORS },
    { key: 'hat_color', values: HAT_COLORS },
    { key: 'accessory_color', values: ACCESSORY_COLORS },
  ]),
  accessoryGroup: { itemCategory: 'accessory', options: ACCESSORY_OPTIONS, chance: 0.5 },
});
