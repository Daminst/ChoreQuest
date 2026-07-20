import { Check, Lock } from 'lucide-react';
import AvatarDisplay from '../AvatarDisplay';
import { buildDisplayConfig } from './avatarEditorState';

export function AvatarOptionCard({ option, configKey, config, selected, locked = false, disabled = false, lockLabel = '', multiple = false, onSelect, onPreview, onPreviewEnd }) {
  const previewConfig = buildDisplayConfig(config, { key: configKey, value: option.id });
  return (
    <button
      type="button"
      className={`avatar-option-card${selected ? ' is-selected' : ''}${locked ? ' is-locked' : ''}`}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${option.label}${locked ? `, locked, ${lockLabel}` : ''}`}
      onClick={() => !locked && onSelect(option.id)}
      onPointerEnter={() => locked && onPreview?.(configKey, option.id)}
      onPointerLeave={() => locked && onPreviewEnd?.()}
      onPointerDown={(event) => event.pointerType !== 'mouse' && locked && onPreview?.(configKey, option.id)}
      onPointerUp={() => locked && onPreviewEnd?.()}
      onPointerCancel={() => locked && onPreviewEnd?.()}
      onFocus={() => locked && onPreview?.(configKey, option.id)}
      onBlur={() => locked && onPreviewEnd?.()}
    >
      <span className="avatar-option-card__preview"><AvatarDisplay config={previewConfig} size="option" /></span>
      <span className="avatar-option-card__label">{option.label}</span>
      {locked && lockLabel && <span className="avatar-option-card__requirement">{lockLabel}</span>}
      {locked && <span className="avatar-option-card__lock"><Lock size={13} /></span>}
      {selected && <span className="avatar-option-card__check"><Check size={13} /></span>}
      {multiple && <span className="sr-only">Multiple selection</span>}
    </button>
  );
}

export function AvatarOptionGrid({ children }) {
  return <div className="avatar-option-grid">{children}</div>;
}

export function AvatarColorPalette({ label, colors, selected, onSelect }) {
  return (
    <fieldset className="avatar-colour-fieldset">
      <legend>{label}</legend>
      <div className="avatar-colour-palette">
        {colors.map((color) => (
          <button key={color} type="button" className="avatar-colour-swatch" aria-label={`${label}: ${color}`} aria-pressed={selected === color} style={{ '--swatch': color }} onClick={() => onSelect(color)}>
            {selected === color && <Check size={16} />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
