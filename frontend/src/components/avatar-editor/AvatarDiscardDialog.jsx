import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function AvatarDiscardDialog({ open, onCancel, onDiscard }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const discardRef = useRef(null);
  const onCancelRef = useRef(onCancel);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;
    cancelRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancelRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const firstControl = cancelRef.current;
      const lastControl = discardRef.current;
      if (!firstControl || !lastControl) return;

      const activeElement = document.activeElement;
      const focusIsOutside = !dialogRef.current?.contains(activeElement);
      if (event.shiftKey && (activeElement === firstControl || focusIsOutside)) {
        event.preventDefault();
        lastControl.focus();
      } else if (!event.shiftKey && (activeElement === lastControl || focusIsOutside)) {
        event.preventDefault();
        firstControl.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const previousFocus = previousFocusRef.current;
      previousFocusRef.current = null;
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') {
        previousFocus.focus();
      }
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="avatar-discard-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="avatar-discard-title" className="avatar-discard-dialog" initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }}>
            <AlertTriangle size={22} />
            <h2 id="avatar-discard-title">Discard changes?</h2>
            <p>Your hero has unsaved changes. Leave without saving?</p>
            <div>
              <button ref={cancelRef} type="button" onClick={onCancel}>Keep editing</button>
              <button ref={discardRef} type="button" className="is-danger" onClick={onDiscard}>Discard</button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
