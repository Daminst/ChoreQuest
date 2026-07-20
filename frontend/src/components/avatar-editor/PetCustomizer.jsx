import { useEffect, useRef, useState } from 'react';
import { Heart } from 'lucide-react';
import { buildPetColors, renderPet, renderPetExtras } from '../avatar/pets';
import { AvatarColorPalette, AvatarOptionCard, AvatarOptionGrid } from './AvatarOptionControls';
import {
  PET_ACCESSORY_OPTIONS,
  PET_COLORS,
  PET_COLOR_RESET_PATCH,
  PET_LEVEL_COLORS,
  PET_LEVEL_NAMES,
  PET_OPTIONS,
  PET_POSITION_OPTIONS,
  createPetBodyColorPatch,
  getPetLevelInfo,
  getPetXpForPet,
} from './avatarPetCatalog';
import { getNextPetTabIndex } from './petTabNavigation';

const PET_SECTIONS = [
  { id: 'appearance', label: 'Appearance', tabId: 'avatar-pet-tab-appearance', panelId: 'avatar-pet-panel-appearance' },
  { id: 'colours', label: 'Colours', tabId: 'avatar-pet-tab-colours', panelId: 'avatar-pet-panel-colours' },
  { id: 'position', label: 'Position', tabId: 'avatar-pet-tab-position', panelId: 'avatar-pet-panel-position' },
  { id: 'accessory', label: 'Accessory', tabId: 'avatar-pet-tab-accessory', panelId: 'avatar-pet-panel-accessory' },
];

function PetPreviewSvg({ petType, colors, level = 1 }) {
  if (!petType || petType === 'none') return null;
  const scale = (1 + (level - 1) * 0.04) * 1.3;
  const isBig = ['dragon', 'phoenix'].includes(petType);
  const centerX = isBig ? 25 : 26;
  const centerY = isBig ? 19 : 20;
  const glow = level >= 7 ? '#f59e0b' : level >= 5 ? '#a855f7' : level >= 2 ? '#3b82f6' : null;
  return (
    <svg width="64" height="64" viewBox="0 0 12 12" className="avatar-pet-level-preview" aria-hidden="true">
      <g transform={`translate(6,6) scale(${scale}) translate(${-centerX},${-centerY})`}>
        {glow && <circle cx={centerX} cy={centerY} r="4" fill={glow} opacity={level >= 5 ? 0.25 : 0.18} />}
        {renderPet(petType, colors, 'right', {})}
        {renderPetExtras(petType, level, colors, 'right')}
      </g>
    </svg>
  );
}

function PetLevelRail({ config }) {
  const petXp = getPetXpForPet(config, config.pet);
  const levelInfo = getPetLevelInfo(petXp);
  const petColors = buildPetColors(config);

  return (
    <section className="avatar-pet-progress" aria-label="Pet level progression">
      <div className="avatar-pet-progress__summary">
        <p className="avatar-pet-progress__level" style={{ color: PET_LEVEL_COLORS[levelInfo.level] }}>
          <Heart size={14} aria-hidden="true" />
          Level {levelInfo.level}: {levelInfo.name}
        </p>
        <p className="avatar-pet-progress__xp">
          {levelInfo.nextThreshold ? `${petXp} / ${levelInfo.nextThreshold} XP` : `${petXp} XP — MAX`}
        </p>
      </div>
      {levelInfo.nextThreshold && (
        <div className="avatar-pet-progress__track" aria-label={`${Math.round(levelInfo.progress * 100)}% to level ${levelInfo.level + 1}`}>
          <span className="avatar-pet-progress__fill" style={{ '--pet-progress': `${Math.round(levelInfo.progress * 100)}%`, '--pet-level-colour': PET_LEVEL_COLORS[levelInfo.level] }} />
          <span className="avatar-pet-progress__remaining">
            {levelInfo.nextThreshold - petXp} XP to Level {levelInfo.level + 1} ({levelInfo.nextName})
          </span>
        </div>
      )}
      <div className="avatar-pet-level-rail" role="list" aria-label="Eight pet levels">
        {PET_LEVEL_NAMES.slice(1).map((name, index) => {
          const level = index + 1;
          const isCurrent = level === levelInfo.level;
          return (
            <div
              key={level}
              className={`avatar-pet-level${isCurrent ? ' is-current' : ''}`}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              data-level-state={level < levelInfo.level ? 'past' : level > levelInfo.level ? 'future' : 'current'}
            >
              <span className="avatar-pet-level__number" style={{ color: PET_LEVEL_COLORS[level] }}>Level {level}</span>
              <PetPreviewSvg petType={config.pet} colors={petColors} level={level} />
              <span className="avatar-pet-level__name">{name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function renderPetCards({ options, configKey, config, selected, locked, lockedMeta, getUnlockLabel, selectionDisabled = false, onChange, onPreview, onPreviewEnd }) {
  return (
    <AvatarOptionGrid>
      {options.map((option) => {
        const isLocked = locked?.has(option.id) || false;
        const lockLabel = isLocked ? (getUnlockLabel?.(lockedMeta?.get(option.id)) || 'Locked') : '';
        return (
          <AvatarOptionCard
            key={option.id}
            option={option}
            configKey={configKey}
            config={config}
            selected={selected === option.id}
            locked={isLocked}
            disabled={selectionDisabled}
            lockLabel={lockLabel}
            onSelect={(value) => onChange(configKey, value)}
            onPreview={onPreview}
            onPreviewEnd={onPreviewEnd}
          />
        );
      })}
    </AvatarOptionGrid>
  );
}

function renderAppearanceControls({ config, locked, lockedMeta, getUnlockLabel, selectionDisabled, onChange, onPreview, onPreviewEnd }) {
  const hasPet = config.pet && config.pet !== 'none';
  return (
    <>
      {renderPetCards({
        options: PET_OPTIONS,
        configKey: 'pet',
        config,
        selected: config.pet || 'none',
        locked,
        lockedMeta,
        getUnlockLabel,
        selectionDisabled,
        onChange,
        onPreview,
        onPreviewEnd,
      })}
      {hasPet ? (
        <PetLevelRail config={config} />
      ) : (
        <p className="avatar-pet-empty">Choose a companion to unlock colours, placement, and accessories.</p>
      )}
    </>
  );
}

function renderColourControls({ config, onChange, onPatch }) {
  const bodyColor = config.pet_color || '#8b4513';
  const choosePartColor = (key, color) => onChange(key, color === bodyColor ? '' : color);
  const resetPartColors = () => onPatch(PET_COLOR_RESET_PATCH);

  return (
    <>
      <button type="button" className="avatar-pet-colours__reset" onClick={resetPartColors}>Reset all to match</button>
      <AvatarColorPalette label="Body Colour" colors={PET_COLORS} selected={bodyColor} onSelect={(color) => onPatch(createPetBodyColorPatch(color))} />
      <AvatarColorPalette label="Ears" colors={PET_COLORS} selected={config.pet_color_ears || bodyColor} onSelect={(color) => choosePartColor('pet_color_ears', color)} />
      <AvatarColorPalette label="Tail" colors={PET_COLORS} selected={config.pet_color_tail || bodyColor} onSelect={(color) => choosePartColor('pet_color_tail', color)} />
      <AvatarColorPalette label="Accent" colors={PET_COLORS} selected={config.pet_color_accent || bodyColor} onSelect={(color) => choosePartColor('pet_color_accent', color)} />
    </>
  );
}

function renderPositionControls({ config, onChange }) {
  return renderPetCards({
    options: PET_POSITION_OPTIONS,
    configKey: 'pet_position',
    config,
    selected: config.pet_position || 'right',
    onChange,
  });
}

function renderAccessoryControls({ config, onChange }) {
  return renderPetCards({
    options: PET_ACCESSORY_OPTIONS,
    configKey: 'pet_accessory',
    config,
    selected: config.pet_accessory || 'none',
    onChange,
  });
}

function renderSectionControls(sectionId, controls) {
  if (sectionId === 'appearance') return renderAppearanceControls(controls);
  if (sectionId === 'colours') return renderColourControls(controls);
  if (sectionId === 'position') return renderPositionControls(controls);
  if (sectionId === 'accessory') return renderAccessoryControls(controls);
  return null;
}

export function PetCustomizer({ config, locked, lockedMeta, getUnlockLabel, selectionDisabled = false, onChange, onPatch, onPreview, onPreviewEnd }) {
  const [activeSection, setActiveSection] = useState('appearance');
  const tabRefs = useRef([]);
  const hasPet = config.pet && config.pet !== 'none';
  const effectiveSection = hasPet ? activeSection : 'appearance';
  const controls = { config, locked, lockedMeta, getUnlockLabel, selectionDisabled, onChange, onPatch, onPreview, onPreviewEnd };

  const handleTabKeyDown = (event, currentIndex) => {
    const enabledTabs = PET_SECTIONS.map((section) => hasPet || section.id === 'appearance');
    const nextIndex = getNextPetTabIndex(currentIndex, event.key, enabledTabs);
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveSection(PET_SECTIONS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    if (!hasPet && activeSection !== 'appearance') {
      setActiveSection('appearance');
    }
  }, [activeSection, hasPet]);

  return (
    <div className="avatar-pet-customiser">
      <div className="avatar-pet-tabs" role="tablist" aria-label="Pet customisation" aria-orientation="horizontal">
        {PET_SECTIONS.map((section, index) => {
          const isActive = effectiveSection === section.id;
          return (
            <button
              ref={(node) => { tabRefs.current[index] = node; }}
              key={section.id}
              id={section.tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={section.panelId}
              tabIndex={section.id === effectiveSection ? 0 : -1}
              disabled={!hasPet && section.id !== 'appearance'}
              onClick={() => setActiveSection(section.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {section.label}
            </button>
          );
        })}
      </div>
      {PET_SECTIONS.map((section) => (
        <div
          key={section.panelId}
          id={section.panelId}
          role="tabpanel"
          aria-labelledby={section.tabId}
          hidden={effectiveSection !== section.id}
        >
          {renderSectionControls(section.id, controls)}
        </div>
      ))}
    </div>
  );
}
