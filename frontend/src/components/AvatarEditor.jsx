import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Accessibility,
  CircleUserRound,
  Crown,
  Eye,
  Image as ImageIcon,
  Palette,
  PawPrint,
  ScanFace,
  Scissors,
  Shield,
  Shirt,
  Smile,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { THEMED_AVATAR_OPTIONS } from './avatar/themedAvatarCatalog';
import { AvatarCategoryRail } from './avatar-editor/AvatarCategoryRail';
import { AvatarDiscardDialog } from './avatar-editor/AvatarDiscardDialog';
import { AvatarEditorToolbar } from './avatar-editor/AvatarEditorToolbar';
import { AvatarOptionsPanel } from './avatar-editor/AvatarOptionsPanel';
import { AvatarStage } from './avatar-editor/AvatarStage';
import { PET_OPTIONS, normalizeAvatarPetColors } from './avatar-editor/avatarPetCatalog';
import {
  applyAvatarChange,
  buildDisplayConfig,
  configsEqual,
  pushAvatarHistory,
  randomiseAvatarConfig,
  toggleAvatarAccessory,
  undoAvatarChange,
} from './avatar-editor/avatarEditorState';

const HEAD_OPTIONS = [
  { id: 'round', label: 'Round' },
  { id: 'oval', label: 'Oval' },
  { id: 'square', label: 'Square' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'heart', label: 'Heart' },
  { id: 'long', label: 'Long' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'pear', label: 'Pear' },
  { id: 'wide', label: 'Wide' },
];

const HAIR_OPTIONS = [
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
];

const EYES_OPTIONS = [
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
];

const MOUTH_OPTIONS = [
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
];

const BODY_OPTIONS = [
  { id: 'slim', label: 'Slim' },
  { id: 'regular', label: 'Regular' },
  { id: 'broad', label: 'Broad' },
];

const HAT_OPTIONS = [
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
];

const ACCESSORY_OPTIONS = [
  { id: 'scarf', label: 'Scarf' },
  { id: 'necklace', label: 'Necklace' },
  { id: 'bow_tie', label: 'Bow Tie' },
  { id: 'cape', label: 'Cape' },
  { id: 'wings', label: 'Wings' },
  { id: 'shield', label: 'Shield' },
  { id: 'sword', label: 'Sword' },
  ...THEMED_AVATAR_OPTIONS.accessory,
];

const FACE_EXTRA_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'freckles', label: 'Freckles' },
  { id: 'blush', label: 'Blush' },
  { id: 'face_paint', label: 'Face Paint' },
  { id: 'scar', label: 'Scar' },
  { id: 'bandage', label: 'Bandage' },
  { id: 'stickers', label: 'Stickers' },
  ...THEMED_AVATAR_OPTIONS.face_extra,
];

const OUTFIT_PATTERN_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'stripes', label: 'Stripes' },
  { id: 'stars', label: 'Stars' },
  { id: 'camo', label: 'Camo' },
  { id: 'tie_dye', label: 'Tie Dye' },
  { id: 'plaid', label: 'Plaid' },
  ...THEMED_AVATAR_OPTIONS.outfit_pattern,
];

const SKIN_COLORS = [
  '#ffe0bd', '#ffcc99', '#f5d6b8', '#f8d9c0',
  '#e8b88a', '#d4a373', '#c68642', '#a67c52',
  '#8d5524', '#6b3a2a', '#4a2912', '#3b1f0e',
  '#f0c4a8', '#d4956a', '#b07848', '#8a6642',
];

const HAIR_COLORS = [
  '#4a3728', '#1a1a2e', '#8b4513', '#d4a017',
  '#c0392b', '#2e86c1', '#7d3c98', '#27ae60',
  '#e74c3c', '#f39c12', '#ecf0f1', '#ff6b9d',
];

const EYE_COLORS = [
  '#333333', '#1a5276', '#27ae60', '#8b4513',
  '#7d3c98', '#c0392b', '#2e86c1', '#e74c3c',
];

const MOUTH_COLORS = [
  '#cc6666', '#e74c3c', '#d4a373', '#c0392b',
  '#ff6b9d', '#a93226', '#8b4513', '#333333',
];

const BODY_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#a855f7', '#ec4899', '#06b6d4', '#84cc16',
  '#f97316', '#6366f1', '#1a1a2e', '#ecf0f1',
];

const BG_COLORS = [
  '#1a1a2e', '#0f0e17', '#16213e', '#1b4332',
  '#4a1942', '#2d1b69', '#1a3a3a', '#3d0c02',
  '#2e86c1', '#27ae60', '#f39c12', '#8e44ad',
];

const HAT_COLORS = [
  '#f39c12', '#e74c3c', '#3b82f6', '#10b981',
  '#a855f7', '#ec4899', '#f59e0b', '#1a1a2e',
  '#c0c0c0', '#f9d71c', '#8b4513', '#ecf0f1',
];

const ACCESSORY_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f39c12',
  '#a855f7', '#ec4899', '#c0c0c0', '#f9d71c',
  '#8b4513', '#1a1a2e', '#ecf0f1', '#06b6d4',
];

const AVATAR_CONFIG_VERSION = 2;

const DEFAULT_CONFIG = {
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
};

const CATEGORIES = [
  { id: 'head', label: 'Head', icon: CircleUserRound },
  { id: 'skin', label: 'Skin', icon: Palette },
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'eyes', label: 'Eyes', icon: Eye },
  { id: 'mouth', label: 'Mouth', icon: Smile },
  { id: 'body', label: 'Body', icon: Accessibility },
  { id: 'outfit', label: 'Outfit', icon: Shirt },
  { id: 'pattern', label: 'Pattern', icon: Sparkles },
  { id: 'background', label: 'Background', icon: ImageIcon },
  { id: 'hat', label: 'Hat', icon: Crown },
  { id: 'face', label: 'Face', icon: ScanFace },
  { id: 'accessory', label: 'Equipment', icon: Shield },
  { id: 'pet', label: 'Pet', icon: PawPrint },
];

const AVATAR_CATALOG = {
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
};

const RANDOMISE_RECIPE = {
  optionGroups: [
    { key: 'head', itemCategory: 'head', options: HEAD_OPTIONS },
    { key: 'hair', itemCategory: 'hair', options: HAIR_OPTIONS },
    { key: 'eyes', itemCategory: 'eyes', options: EYES_OPTIONS },
    { key: 'mouth', itemCategory: 'mouth', options: MOUTH_OPTIONS },
    { key: 'body', itemCategory: 'body', options: BODY_OPTIONS },
    { key: 'outfit_pattern', itemCategory: 'outfit_pattern', options: OUTFIT_PATTERN_OPTIONS },
    { key: 'hat', itemCategory: 'hat', options: HAT_OPTIONS },
    { key: 'face_extra', itemCategory: 'face_extra', options: FACE_EXTRA_OPTIONS },
  ],
  colourGroups: [
    { key: 'head_color', values: SKIN_COLORS },
    { key: 'hair_color', values: HAIR_COLORS },
    { key: 'eye_color', values: EYE_COLORS },
    { key: 'mouth_color', values: MOUTH_COLORS },
    { key: 'body_color', values: BODY_COLORS },
    { key: 'bg_color', values: BG_COLORS },
    { key: 'hat_color', values: HAT_COLORS },
    { key: 'accessory_color', values: ACCESSORY_COLORS },
  ],
  accessoryGroup: { itemCategory: 'accessory', options: ACCESSORY_OPTIONS, chance: 0.5 },
};

export default function AvatarEditor() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const initialConfig = useMemo(() => normalizeAvatarPetColors({
    ...DEFAULT_CONFIG,
    ...(user?.avatar_config || {}),
  }), [user?.avatar_config]);
  const [config, setConfig] = useState(() => normalizeAvatarPetColors({
    ...DEFAULT_CONFIG,
    ...(user?.avatar_config || {}),
  }));
  const [savedConfig, setSavedConfig] = useState(initialConfig);
  const [history, setHistory] = useState([]);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [openCategory, setOpenCategory] = useState('head');
  const [lockedByCategory, setLockedByCategory] = useState({});
  const [lockedItemMeta, setLockedItemMeta] = useState({});
  const [discardOpen, setDiscardOpen] = useState(false);
  const allowNextPopRef = useRef(false);
  const saveNavigationTimerRef = useRef(null);

  const dirty = !configsEqual(config, savedConfig);
  const displayConfig = buildDisplayConfig(config, preview);

  const commitChange = useCallback((nextConfig) => {
    if (configsEqual(config, nextConfig)) return;
    setHistory((items) => pushAvatarHistory(items, config));
    setConfig(nextConfig);
    setPreview(null);
    setStatus('');
  }, [config]);

  const changeValue = useCallback((key, value) => {
    commitChange(applyAvatarChange(config, key, value));
  }, [commitChange, config]);

  const patchConfig = useCallback((patch) => {
    commitChange(normalizeAvatarPetColors({ ...config, ...patch }));
  }, [commitChange, config]);

  const toggleAccessory = useCallback((itemId) => {
    commitChange(toggleAvatarAccessory(config, itemId));
  }, [commitChange, config]);

  const placePet = useCallback((x, y) => {
    commitChange({ ...config, pet_x: x, pet_y: y });
  }, [commitChange, config]);

  const undo = useCallback(() => {
    const result = undoAvatarChange(history, config);
    setHistory(result.history);
    setConfig(result.config);
    setPreview(null);
    setStatus('');
  }, [config, history]);

  useEffect(() => {
    const userCfg = normalizeAvatarPetColors({ ...initialConfig });
    setConfig(userCfg);
    setSavedConfig(userCfg);
    setHistory([]);
    setPreview(null);
  }, [initialConfig]);

  const fetchLocks = useCallback(async () => {
    try {
      const items = await api('/api/avatar/items');
      if (!Array.isArray(items)) return;
      const lockMap = {};
      const metaMap = {};
      for (const item of items) {
        if (!metaMap[item.category]) metaMap[item.category] = new Map();
        metaMap[item.category].set(item.item_id, item);
        if (!item.unlocked && !item.is_default) {
          if (!lockMap[item.category]) lockMap[item.category] = new Set();
          lockMap[item.category].add(item.item_id);
        }
      }
      setLockedByCategory(lockMap);
      setLockedItemMeta(metaMap);
    } catch {
      setLockedByCategory({});
      setLockedItemMeta({});
    }
  }, []);

  useEffect(() => {
    fetchLocks();
  }, [fetchLocks]);

  const editorLocks = useMemo(() => {
    const mapped = {};
    for (const [editorCategory, entry] of Object.entries(AVATAR_CATALOG)) {
      if (entry.itemCategory && lockedByCategory[entry.itemCategory]) {
        mapped[editorCategory] = lockedByCategory[entry.itemCategory];
      }
    }
    return mapped;
  }, [lockedByCategory]);

  const randomise = useCallback(() => {
    commitChange(randomiseAvatarConfig(config, RANDOMISE_RECIPE, lockedByCategory));
  }, [commitChange, config, lockedByCategory]);

  const leaveEditor = useCallback(() => {
    allowNextPopRef.current = true;
    navigate(-1);
  }, [navigate]);

  const requestExit = useCallback(() => {
    if (dirty) setDiscardOpen(true);
    else leaveEditor();
  }, [dirty, leaveEditor]);

  const cancelDiscard = useCallback(() => {
    setDiscardOpen(false);
  }, []);

  const selectCategory = useCallback((category) => {
    setOpenCategory(category);
    setPreview(null);
  }, []);

  const startPreview = useCallback((key, value) => {
    setPreview({ key, value });
  }, []);

  const endPreview = useCallback(() => {
    setPreview(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !discardOpen) requestExit();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [discardOpen, requestExit]);

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  useEffect(() => {
    const handlePopState = () => {
      if (allowNextPopRef.current) {
        allowNextPopRef.current = false;
        return;
      }
      if (dirty) {
        allowNextPopRef.current = true;
        navigate(1);
        setDiscardOpen(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dirty, navigate]);

  useEffect(() => () => {
    if (saveNavigationTimerRef.current) {
      window.clearTimeout(saveNavigationTimerRef.current);
    }
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setStatus('');
    try {
      const response = await api('/api/avatar', { method: 'PUT', body: { config } });
      const persisted = normalizeAvatarPetColors(response.avatar_config || config);
      updateUser({ avatar_config: persisted });
      setConfig(persisted);
      setSavedConfig(persisted);
      setHistory([]);
      setPreview(null);
      setStatus('Saved!');
      allowNextPopRef.current = true;
      saveNavigationTimerRef.current = window.setTimeout(() => navigate(-1), 600);
    } catch (error) {
      setStatus(error.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [config, navigate, updateUser]);

  return (
    <div className="avatar-editor-shell">
      <AvatarEditorToolbar
        canUndo={history.length > 0}
        dirty={dirty}
        saving={saving}
        status={status}
        onBack={requestExit}
        onRandomise={randomise}
        onUndo={undo}
        onSave={save}
      />
      <div className="avatar-editor-workspace">
        <AvatarCategoryRail categories={CATEGORIES} activeCategory={openCategory} onSelect={selectCategory} />
        <AvatarStage
          config={displayConfig}
          placementMode={openCategory === 'pet' && config.pet_position === 'custom' && config.pet !== 'none'}
          previewMessage={preview ? 'Previewing a locked item' : ''}
          onPlacePet={placePet}
        />
        <AvatarOptionsPanel
          category={openCategory}
          config={config}
          lockedByCategory={editorLocks}
          lockedItemMeta={lockedItemMeta}
          catalog={AVATAR_CATALOG}
          onChange={changeValue}
          onPatch={patchConfig}
          onToggleAccessory={toggleAccessory}
          onPreview={startPreview}
          onPreviewEnd={endPreview}
        />
      </div>
      <AvatarDiscardDialog open={discardOpen} onCancel={cancelDiscard} onDiscard={leaveEditor} />
    </div>
  );
}
