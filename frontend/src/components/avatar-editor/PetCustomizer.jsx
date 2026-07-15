import { useState } from 'react';
import { Heart } from 'lucide-react';
import { buildPetColors, renderPet, renderPetExtras } from '../avatar/pets';
import { AvatarColorPalette, AvatarOptionCard, AvatarOptionGrid } from './AvatarOptionControls';

const PET_SECTIONS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'colours', label: 'Colours' },
  { id: 'position', label: 'Position' },
  { id: 'accessory', label: 'Accessory' },
];

const PET_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'cat', label: 'Cat' },
  { id: 'dog', label: 'Dog' },
  { id: 'dragon', label: 'Dragon' },
  { id: 'owl', label: 'Owl' },
  { id: 'bunny', label: 'Bunny' },
  { id: 'phoenix', label: 'Phoenix' },
];

const PET_POSITION_OPTIONS = [
  { id: 'right', label: 'Right' },
  { id: 'left', label: 'Left' },
  { id: 'head', label: 'Head' },
  { id: 'custom', label: 'Custom' },
];

const PET_ACCESSORY_OPTIONS = [
  { id: 'none', label: 'None' },
  { id: 'crown', label: 'Crown' },
  { id: 'party_hat', label: 'Party Hat' },
  { id: 'bow', label: 'Bow' },
  { id: 'bandana', label: 'Bandana' },
  { id: 'halo', label: 'Halo' },
  { id: 'flower', label: 'Flower' },
];

const PET_COLORS = [
  '#8b4513', '#4a3728', '#f39c12', '#ef4444',
  '#10b981', '#a855f7', '#ecf0f1', '#1a1a2e',
  '#c0c0c0', '#ff6b9d', '#06b6d4', '#f59e0b',
];

const PET_LEVEL_THRESHOLDS = [0, 50, 150, 350, 700, 1200, 2000, 3500];
const PET_LEVEL_NAMES = ['', 'Hatchling', 'Youngling', 'Companion', 'Loyal', 'Brave', 'Mighty', 'Majestic', 'Legendary'];
const PET_LEVEL_COLORS = ['', '#94a3b8', '#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#f97316', '#ef4444', '#d946ef'];

function getPetLevelInfo(petXp) {
  let level = 1;
  for (let index = 0; index < PET_LEVEL_THRESHOLDS.length; index += 1) {
    if (petXp >= PET_LEVEL_THRESHOLDS[index]) level = index + 1;
  }
  const threshold = PET_LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = PET_LEVEL_THRESHOLDS[level] || null;
  const progress = nextThreshold ? (petXp - threshold) / (nextThreshold - threshold) : 1;
  return {
    level,
    name: PET_LEVEL_NAMES[level],
    nextName: PET_LEVEL_NAMES[level + 1] || null,
    xp: petXp,
    threshold,
    nextThreshold,
    progress,
  };
}

function getPetXpForPet(config, petType) {
  if (!petType || petType === 'none') return 0;
  const xpMap = config.pet_xp_map || {};
  return petType in xpMap ? xpMap[petType] : (config.pet_xp || 0);
}

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

function renderPetCards({ options, configKey, config, selected, locked, lockedMeta, getUnlockLabel, onChange, onPreview, onPreviewEnd }) {
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

function renderAppearanceControls({ config, locked, lockedMeta, getUnlockLabel, onChange, onPreview, onPreviewEnd }) {
  const hasPet = config.pet && config.pet !== 'none';
  return (
    <div id="avatar-pet-panel-appearance" role="tabpanel" aria-labelledby="avatar-pet-tab-appearance">
      {renderPetCards({
        options: PET_OPTIONS,
        configKey: 'pet',
        config,
        selected: config.pet || 'none',
        locked,
        lockedMeta,
        getUnlockLabel,
        onChange,
        onPreview,
        onPreviewEnd,
      })}
      {hasPet ? (
        <PetLevelRail config={config} />
      ) : (
        <p className="avatar-pet-empty">Choose a companion to unlock colours, placement, and accessories.</p>
      )}
    </div>
  );
}

function renderColourControls({ config, onChange }) {
  const bodyColor = config.pet_color || '#8b4513';
  const choosePartColor = (key, color) => onChange(key, color === bodyColor ? '' : color);
  const resetPartColors = () => {
    onChange('pet_color_body', '');
    onChange('pet_color_ears', '');
    onChange('pet_color_tail', '');
    onChange('pet_color_accent', '');
  };

  return (
    <div id="avatar-pet-panel-colours" role="tabpanel" aria-labelledby="avatar-pet-tab-colours">
      <button type="button" className="avatar-pet-colours__reset" onClick={resetPartColors}>Reset all to match</button>
      <AvatarColorPalette label="Body" colors={PET_COLORS} selected={bodyColor} onSelect={(color) => onChange('pet_color', color)} />
      <AvatarColorPalette label="Ears" colors={PET_COLORS} selected={config.pet_color_ears || bodyColor} onSelect={(color) => choosePartColor('pet_color_ears', color)} />
      <AvatarColorPalette label="Tail" colors={PET_COLORS} selected={config.pet_color_tail || bodyColor} onSelect={(color) => choosePartColor('pet_color_tail', color)} />
      <AvatarColorPalette label="Accent" colors={PET_COLORS} selected={config.pet_color_accent || bodyColor} onSelect={(color) => choosePartColor('pet_color_accent', color)} />
    </div>
  );
}

function renderPositionControls({ config, onChange }) {
  return (
    <div id="avatar-pet-panel-position" role="tabpanel" aria-labelledby="avatar-pet-tab-position">
      {renderPetCards({
        options: PET_POSITION_OPTIONS,
        configKey: 'pet_position',
        config,
        selected: config.pet_position || 'right',
        onChange,
      })}
    </div>
  );
}

function renderAccessoryControls({ config, onChange }) {
  return (
    <div id="avatar-pet-panel-accessory" role="tabpanel" aria-labelledby="avatar-pet-tab-accessory">
      {renderPetCards({
        options: PET_ACCESSORY_OPTIONS,
        configKey: 'pet_accessory',
        config,
        selected: config.pet_accessory || 'none',
        onChange,
      })}
    </div>
  );
}

export function PetCustomizer({ config, locked, lockedMeta, getUnlockLabel, onChange, onPreview, onPreviewEnd }) {
  const [activeSection, setActiveSection] = useState('appearance');
  const hasPet = config.pet && config.pet !== 'none';

  return (
    <div className="avatar-pet-customiser">
      <div className="avatar-pet-tabs" role="tablist" aria-label="Pet customisation">
        {PET_SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              id={`avatar-pet-tab-${section.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`avatar-pet-panel-${section.id}`}
              disabled={!hasPet && section.id !== 'appearance'}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          );
        })}
      </div>
      {activeSection === 'appearance' && renderAppearanceControls({ config, locked, lockedMeta, getUnlockLabel, onChange, onPreview, onPreviewEnd })}
      {activeSection === 'colours' && renderColourControls({ config, onChange })}
      {activeSection === 'position' && renderPositionControls({ config, onChange })}
      {activeSection === 'accessory' && renderAccessoryControls({ config, onChange })}
    </div>
  );
}
