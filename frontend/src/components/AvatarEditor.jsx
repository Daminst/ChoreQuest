import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker, useNavigate } from 'react-router-dom';
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
import { AvatarCategoryRail } from './avatar-editor/AvatarCategoryRail';
import {
  AVATAR_CATALOG,
  DEFAULT_CONFIG,
  RANDOMISE_RECIPE,
} from './avatar-editor/avatarCatalog';
import { AvatarDiscardDialog } from './avatar-editor/AvatarDiscardDialog';
import { AvatarEditorToolbar } from './avatar-editor/AvatarEditorToolbar';
import { AvatarOptionsPanel } from './avatar-editor/AvatarOptionsPanel';
import { AvatarStage } from './avatar-editor/AvatarStage';
import {
  AVATAR_CATALOG_STATE,
  buildAvatarEntitlementMaps,
  canCommitAvatarCatalogChange,
  canRandomiseAvatar,
  getAvatarCatalogNotice,
} from './avatar-editor/avatarCatalogPolicy';
import { normalizeAvatarPetColors } from './avatar-editor/avatarPetCatalog';
import {
  clearAvatarPreviews,
  createAvatarPreviewRegistry,
  endAvatarPreview,
  startAvatarPreview,
} from './avatar-editor/avatarPreviewRegistry';
import {
  getAvatarExitNavigation,
  shouldBlockAvatarNavigation,
} from './avatar-editor/avatarHistoryGuard';
import {
  getAvatarSaveErrorMessage,
  isCurrentAvatarSave,
} from './avatar-editor/avatarSaveLifecycle';
import {
  createAvatarExternalConflictState,
  getPersistentAvatarStatus,
  observeIncomingAvatarConfig,
  settleAvatarSaveConflict,
  synchronizeAvatarConflictWhenClean,
} from './avatar-editor/avatarConfigReconciliation';
import './avatar-editor/avatarEditor.css';
import {
  applyAvatarChange,
  buildDisplayConfig,
  configsEqual,
  pushAvatarHistory,
  randomiseAvatarConfig,
  toggleAvatarAccessory,
  undoAvatarChange,
} from './avatar-editor/avatarEditorState';


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
  const [catalogState, setCatalogState] = useState(AVATAR_CATALOG_STATE.loading);
  const [lockedByCategory, setLockedByCategory] = useState({});
  const [lockedItemMeta, setLockedItemMeta] = useState({});
  const [discardOpen, setDiscardOpen] = useState(false);
  const [externalConflictState, setExternalConflictState] = useState(
    createAvatarExternalConflictState,
  );
  const bypassNextNavigationRef = useRef(false);
  const programmaticExitPendingRef = useRef(false);
  const mountedRef = useRef(true);
  const savePendingRef = useRef(false);
  const saveRequestRef = useRef(0);
  const saveNavigationTimerRef = useRef(null);
  const externalConflictStateRef = useRef(externalConflictState);
  const previewRegistryRef = useRef(null);
  if (previewRegistryRef.current === null) {
    previewRegistryRef.current = createAvatarPreviewRegistry();
  }

  const dirty = !configsEqual(config, savedConfig);
  const displayConfig = buildDisplayConfig(config, preview);
  const shouldBlockNavigation = useCallback(() => {
    const bypass = bypassNextNavigationRef.current;
    if (bypass) bypassNextNavigationRef.current = false;
    return shouldBlockAvatarNavigation({
      dirty,
      saving: savePendingRef.current,
      bypass,
    });
  }, [dirty]);
  const blocker = useBlocker(shouldBlockNavigation);

  const clearPreviews = useCallback(() => {
    const transition = clearAvatarPreviews(previewRegistryRef.current);
    previewRegistryRef.current = transition.registry;
    setPreview(transition.preview);
  }, []);

  const updateExternalConflictState = useCallback((nextState) => {
    externalConflictStateRef.current = nextState;
    setExternalConflictState(nextState);
  }, []);

  const commitChange = useCallback((nextConfig) => {
    if (savePendingRef.current) return;
    if (configsEqual(config, nextConfig)) return;
    setHistory((items) => pushAvatarHistory(items, config));
    setConfig(nextConfig);
    clearPreviews();
    setStatus('');
  }, [clearPreviews, config]);

  const changeValue = useCallback((key, value) => {
    if (!canCommitAvatarCatalogChange(catalogState, key)) return;
    commitChange(applyAvatarChange(config, key, value));
  }, [catalogState, commitChange, config]);

  const patchConfig = useCallback((patch) => {
    if (Object.keys(patch).some((key) => !canCommitAvatarCatalogChange(catalogState, key))) return;
    commitChange(normalizeAvatarPetColors({ ...config, ...patch }));
  }, [catalogState, commitChange, config]);

  const toggleAccessory = useCallback((itemId) => {
    if (!canCommitAvatarCatalogChange(catalogState, 'accessories')) return;
    commitChange(toggleAvatarAccessory(config, itemId));
  }, [catalogState, commitChange, config]);

  const placePet = useCallback((x, y) => {
    commitChange({ ...config, pet_x: x, pet_y: y });
  }, [commitChange, config]);

  const undo = useCallback(() => {
    if (savePendingRef.current) return;
    const result = undoAvatarChange(history, config);
    setHistory(result.history);
    setConfig(result.config);
    clearPreviews();
    setStatus('');
  }, [clearPreviews, config, history]);

  useEffect(() => {
    const userCfg = normalizeAvatarPetColors({ ...initialConfig });
    const observation = observeIncomingAvatarConfig({
      state: externalConflictStateRef.current,
      incomingConfig: userCfg,
      saving: savePendingRef.current,
      config,
      savedConfig,
      history,
    });
    updateExternalConflictState(observation.state);
    const { reconciliation } = observation;
    if (!reconciliation || reconciliation.action === 'ignore') return;
    if (reconciliation.action === 'conflict') return;
    setConfig(reconciliation.config);
    setSavedConfig(reconciliation.savedConfig);
    setHistory(reconciliation.history);
    setStatus(reconciliation.status);
    clearPreviews();
  }, [clearPreviews, initialConfig, updateExternalConflictState]);

  useEffect(() => {
    const resolution = synchronizeAvatarConflictWhenClean({
      state: externalConflictStateRef.current,
      saving,
      config,
      savedConfig,
      history,
    });
    if (!resolution.reconciliation) return;
    updateExternalConflictState(resolution.state);
    setConfig(resolution.reconciliation.config);
    setSavedConfig(resolution.reconciliation.savedConfig);
    setHistory(resolution.reconciliation.history);
    setStatus(resolution.reconciliation.status);
    clearPreviews();
  }, [
    clearPreviews,
    config,
    history,
    savedConfig,
    saving,
    updateExternalConflictState,
  ]);

  const fetchLocks = useCallback(async () => {
    try {
      const items = await api('/api/avatar/items');
      const maps = buildAvatarEntitlementMaps(items);
      setLockedByCategory(maps.lockedByCategory);
      setLockedItemMeta(maps.itemMetaByCategory);
      setCatalogState(AVATAR_CATALOG_STATE.ready);
    } catch {
      setLockedByCategory({});
      setLockedItemMeta({});
      setCatalogState(AVATAR_CATALOG_STATE.error);
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
    if (savePendingRef.current) return;
    if (!canRandomiseAvatar(catalogState)) return;
    commitChange(randomiseAvatarConfig(config, RANDOMISE_RECIPE, lockedByCategory));
  }, [catalogState, commitChange, config, lockedByCategory]);

  const navigateOutOfEditor = useCallback(() => {
    const exit = getAvatarExitNavigation(window.history.state);
    bypassNextNavigationRef.current = true;
    navigate(exit.to, exit.options);
  }, [navigate]);

  const requestExit = useCallback(() => {
    if (savePendingRef.current) return;
    if (dirty) {
      programmaticExitPendingRef.current = true;
      setDiscardOpen(true);
    } else {
      navigateOutOfEditor();
    }
  }, [dirty, navigateOutOfEditor]);

  const cancelDiscard = useCallback(() => {
    if (savePendingRef.current) return;
    programmaticExitPendingRef.current = false;
    if (blocker.state === 'blocked') blocker.reset();
    setDiscardOpen(false);
  }, [blocker]);

  const discardAndLeave = useCallback(() => {
    if (savePendingRef.current) return;
    setDiscardOpen(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
      return;
    }
    if (programmaticExitPendingRef.current) {
      programmaticExitPendingRef.current = false;
      navigateOutOfEditor();
    }
  }, [blocker, navigateOutOfEditor]);

  const selectCategory = useCallback((category) => {
    if (savePendingRef.current) return;
    setOpenCategory(category);
    clearPreviews();
  }, [clearPreviews]);

  const startPreview = useCallback((sourceId, key, value) => {
    if (savePendingRef.current) return;
    const transition = startAvatarPreview(previewRegistryRef.current, sourceId, key, value);
    previewRegistryRef.current = transition.registry;
    setPreview(transition.preview);
  }, []);

  const endPreview = useCallback((sourceId) => {
    if (savePendingRef.current) return;
    const transition = endAvatarPreview(previewRegistryRef.current, sourceId);
    previewRegistryRef.current = transition.registry;
    setPreview(transition.preview);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape' || savePendingRef.current) return;
      if (!discardOpen) requestExit();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [discardOpen, requestExit]);

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!dirty && !savePendingRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    if (savePendingRef.current) {
      blocker.reset();
      return;
    }
    programmaticExitPendingRef.current = false;
    setDiscardOpen(true);
  }, [blocker]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      saveRequestRef.current += 1;
      if (saveNavigationTimerRef.current) {
        window.clearTimeout(saveNavigationTimerRef.current);
      }
    };
  }, []);

  const save = useCallback(async () => {
    if (savePendingRef.current || !dirty) return;
    savePendingRef.current = true;
    const requestToken = ++saveRequestRef.current;
    setSaving(true);
    setStatus('');
    clearPreviews();
    setDiscardOpen(false);
    programmaticExitPendingRef.current = false;
    try {
      const response = await api('/api/avatar', { method: 'PUT', body: { config } });
      if (!isCurrentAvatarSave(mountedRef.current, saveRequestRef.current, requestToken)) return;
      const persisted = normalizeAvatarPetColors(response.avatar_config || config);
      const settledConflict = settleAvatarSaveConflict({
        state: externalConflictStateRef.current,
        succeeded: true,
        config,
        savedConfig,
        history,
      });
      updateExternalConflictState(settledConflict.state);
      updateUser({ avatar_config: persisted });
      setConfig(persisted);
      setSavedConfig(persisted);
      setHistory([]);
      clearPreviews();
      setStatus('Saved!');
      saveNavigationTimerRef.current = window.setTimeout(() => {
        if (!isCurrentAvatarSave(mountedRef.current, saveRequestRef.current, requestToken)) return;
        navigateOutOfEditor();
      }, 600);
    } catch (error) {
      if (!isCurrentAvatarSave(mountedRef.current, saveRequestRef.current, requestToken)) return;
      savePendingRef.current = false;
      setSaving(false);
      const settledConflict = settleAvatarSaveConflict({
        state: externalConflictStateRef.current,
        succeeded: false,
        config,
        savedConfig,
        history,
      });
      updateExternalConflictState(settledConflict.state);
      if (settledConflict.reconciliation?.action === 'synchronize') {
        setConfig(settledConflict.reconciliation.config);
        setSavedConfig(settledConflict.reconciliation.savedConfig);
        setHistory(settledConflict.reconciliation.history);
        clearPreviews();
      }
      setStatus(getAvatarSaveErrorMessage(error));
    }
  }, [
    clearPreviews,
    config,
    dirty,
    history,
    navigateOutOfEditor,
    savedConfig,
    updateExternalConflictState,
    updateUser,
  ]);

  return (
    <div className="avatar-editor-shell">
      <AvatarEditorToolbar
        canUndo={history.length > 0}
        dirty={dirty}
        randomiseDisabled={!canRandomiseAvatar(catalogState)}
        saving={saving}
        status={getPersistentAvatarStatus(status, externalConflictState)}
        onBack={requestExit}
        onRandomise={randomise}
        onUndo={undo}
        onSave={save}
      />
      <div className="avatar-editor-workspace" aria-busy={saving} inert={saving ? '' : undefined}>
        <AvatarCategoryRail categories={CATEGORIES} activeCategory={openCategory} onSelect={selectCategory} />
        <AvatarStage
          config={displayConfig}
          placementMode={openCategory === 'pet' && config.pet_position === 'custom' && config.pet !== 'none'}
          previewMessage={preview ? 'Previewing a locked item' : ''}
          onPlacePet={placePet}
        />
        <AvatarOptionsPanel
          catalogState={catalogState}
          catalogNotice={getAvatarCatalogNotice(catalogState)}
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
      <AvatarDiscardDialog open={discardOpen} onCancel={cancelDiscard} onDiscard={discardAndLeave} />
    </div>
  );
}
