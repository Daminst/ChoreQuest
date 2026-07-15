import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function AvatarDiscardDialog({ open, onCancel, onDiscard }) {
  const cancelRef = useRef(null);
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="avatar-discard-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section role="dialog" aria-modal="true" aria-labelledby="avatar-discard-title" className="avatar-discard-dialog" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} onKeyDown={(event) => event.key === 'Escape' && onCancel()}>
            <AlertTriangle size={22} />
            <h2 id="avatar-discard-title">Discard changes?</h2>
            <p>Your hero has unsaved changes. Leave without saving?</p>
            <div>
              <button ref={cancelRef} type="button" onClick={onCancel}>Keep editing</button>
              <button type="button" className="is-danger" onClick={onDiscard}>Discard</button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
