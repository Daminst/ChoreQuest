import { AvatarColorPalette, AvatarOptionCard, AvatarOptionGrid } from './AvatarOptionControls';
import { PetCustomizer } from './PetCustomizer';

const CATEGORY_META = {
  head: { title: 'Choose a head shape', description: 'Start with the silhouette of your hero.' },
  skin: { title: 'Choose a skin tone', description: 'Pick the tone that feels right.' },
  hair: { title: 'Style the hair', description: 'Choose a cut, then finish it with colour.' },
  eyes: { title: 'Choose the eyes', description: 'Give your hero their expression.' },
  mouth: { title: 'Choose the smile', description: 'Finish the expression.' },
  body: { title: 'Choose a build', description: 'Set the hero silhouette.' },
  outfit: { title: 'Choose outfit colour', description: 'Set the main outfit colour.' },
  pattern: { title: 'Choose a pattern', description: 'Add a final outfit detail.' },
  background: { title: 'Choose a backdrop', description: 'Frame your hero.' },
  hat: { title: 'Choose headwear', description: 'Add a signature finishing touch.' },
  face: { title: 'Choose face details', description: 'Add freckles, paint, or stickers.' },
  accessory: { title: 'Choose equipment', description: 'Equip more than one item.' },
  pet: { title: 'Customise your companion', description: 'Style and place your loyal companion.' },
};

function unlockLabel(item) {
  if (!item) return 'Locked';
  if (item.unlock_method === 'shop') return `${item.unlock_value} XP`;
  if (item.unlock_method === 'xp') return `Earn ${item.unlock_value} XP`;
  if (item.unlock_method === 'streak') return `${item.unlock_value}-day streak`;
  if (item.unlock_method === 'quest_drop') return 'Find in quests';
  return 'Locked';
}

function renderCards({
  options,
  configKey,
  itemCategory,
  selected,
  locked,
  lockedMeta,
  config,
  onSelect,
  onPreview,
  onPreviewEnd,
  multiple = false,
}) {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);
  return (
    <AvatarOptionGrid>
      {options.map((option) => (
        <AvatarOptionCard
          key={option.id}
          option={option}
          configKey={configKey}
          config={config}
          selected={selectedSet.has(option.id)}
          locked={locked?.has(option.id)}
          lockLabel={unlockLabel(lockedMeta?.[itemCategory]?.get(option.id))}
          multiple={multiple}
          onSelect={onSelect}
          onPreview={onPreview}
          onPreviewEnd={onPreviewEnd}
        />
      ))}
    </AvatarOptionGrid>
  );
}

function renderPalette(entry, config, label, onChange) {
  return (
    <AvatarColorPalette
      label={label}
      colors={entry.colours}
      selected={config[entry.colourKey]}
      onSelect={(colour) => onChange(entry.colourKey, colour)}
    />
  );
}

function renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd) {
  return renderCards({
    ...entry,
    selected: config[entry.configKey],
    locked: lockedByCategory[entry.editorCategory],
    lockedMeta: lockedItemMeta,
    config,
    onSelect: (value) => onChange(entry.configKey, value),
    onPreview,
    onPreviewEnd,
  });
}

function renderCategoryControls({
  category,
  config,
  lockedByCategory,
  lockedItemMeta,
  catalog,
  onChange,
  onPatch,
  onToggleAccessory,
  onPreview,
  onPreviewEnd,
}) {
  if (category === 'head') {
    const entry = { ...catalog.head, editorCategory: 'head' };
    return renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd);
  }
  if (category === 'skin') {
    return renderPalette(catalog.skin, config, 'Skin tone', onChange);
  }
  if (category === 'hair') {
    const entry = { ...catalog.hair, editorCategory: 'hair' };
    return (
      <>
        {renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd)}
        {renderPalette(entry, config, 'Hair colour', onChange)}
      </>
    );
  }
  if (category === 'eyes') {
    const entry = { ...catalog.eyes, editorCategory: 'eyes' };
    return (
      <>
        {renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd)}
        {renderPalette(entry, config, 'Eye colour', onChange)}
      </>
    );
  }
  if (category === 'mouth') {
    const entry = { ...catalog.mouth, editorCategory: 'mouth' };
    return (
      <>
        {renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd)}
        {renderPalette(entry, config, 'Mouth colour', onChange)}
      </>
    );
  }
  if (category === 'body') {
    const entry = { ...catalog.body, editorCategory: 'body' };
    return renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd);
  }
  if (category === 'outfit') {
    return renderPalette(catalog.outfit, config, 'Outfit colour', onChange);
  }
  if (category === 'pattern') {
    const entry = { ...catalog.pattern, editorCategory: 'pattern' };
    return renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd);
  }
  if (category === 'background') {
    return renderPalette(catalog.background, config, 'Backdrop colour', onChange);
  }
  if (category === 'hat') {
    const entry = { ...catalog.hat, editorCategory: 'hat' };
    return (
      <>
        {renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd)}
        {renderPalette(entry, config, 'Headwear colour', onChange)}
      </>
    );
  }
  if (category === 'face') {
    const entry = { ...catalog.face, editorCategory: 'face' };
    return renderSingleChoice(entry, config, lockedByCategory, lockedItemMeta, onChange, onPreview, onPreviewEnd);
  }
  if (category === 'accessory') {
    const entry = catalog.accessory;
    const selected = config.accessories?.length
      ? config.accessories
      : config.accessory && config.accessory !== 'none' ? [config.accessory] : [];
    return (
      <>
        {renderCards({
          ...entry,
          selected,
          locked: lockedByCategory.accessory,
          lockedMeta: lockedItemMeta,
          config,
          onSelect: onToggleAccessory,
          onPreview,
          onPreviewEnd,
          multiple: true,
        })}
        {renderPalette(entry, config, 'Equipment colour', onChange)}
      </>
    );
  }
  if (category === 'pet') {
    return (
      <PetCustomizer
        config={config}
        locked={lockedByCategory.pet || new Set()}
        lockedMeta={lockedItemMeta.pet || new Map()}
        getUnlockLabel={unlockLabel}
        onChange={onChange}
        onPatch={onPatch}
        onPreview={onPreview}
        onPreviewEnd={onPreviewEnd}
      />
    );
  }
  return null;
}

export function AvatarOptionsPanel({
  category,
  config,
  lockedByCategory,
  lockedItemMeta,
  catalog,
  onChange,
  onPatch,
  onToggleAccessory,
  onPreview,
  onPreviewEnd,
}) {
  const meta = CATEGORY_META[category];
  if (!meta) return null;

  return (
    <aside className="avatar-options-panel" aria-labelledby={`avatar-options-${category}`}>
      <header className="avatar-options-panel__header">
        <h2 id={`avatar-options-${category}`}>{meta.title}</h2>
        <p>{meta.description}</p>
      </header>
      <div className="avatar-options-panel__content">
        {renderCategoryControls({
          category,
          config,
          lockedByCategory,
          lockedItemMeta,
          catalog,
          onChange,
          onPatch,
          onToggleAccessory,
          onPreview,
          onPreviewEnd,
        })}
      </div>
    </aside>
  );
}
