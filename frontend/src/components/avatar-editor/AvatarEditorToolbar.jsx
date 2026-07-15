import { ArrowLeft, Dices, Loader2, RotateCcw, Save } from 'lucide-react';

export function AvatarEditorToolbar({ canUndo, dirty, saving, status, onBack, onRandomise, onUndo, onSave }) {
  return (
    <header className="avatar-editor-toolbar">
      <div className="avatar-editor-toolbar__identity">
        <button type="button" className="avatar-icon-button" aria-label="Back" disabled={saving} onClick={onBack}><ArrowLeft size={20} /></button>
        <div><h1>Hero Studio</h1><p>{dirty ? 'Unsaved changes' : 'Your hero is ready'}</p></div>
      </div>
      <div className="avatar-editor-toolbar__actions">
        <button type="button" className="avatar-tool-button" disabled={saving} onClick={onRandomise}><Dices size={17} /><span>Randomise</span></button>
        <button type="button" className="avatar-tool-button" disabled={saving || !canUndo} onClick={onUndo}><RotateCcw size={17} /><span>Undo</span></button>
        <button type="button" className="avatar-save-button" disabled={saving || !dirty} onClick={onSave}>
          {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}<span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
      <p className="avatar-save-status" role="status" aria-live="polite">{status}</p>
    </header>
  );
}
