import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { FaStickyNote, FaTimes } from 'react-icons/fa';
import { useNote } from '../context/NotesContext';

const NoteButton = memo(({ surah, ayah, text }) => {
  const { getNote, addNote, removeNoteByRef, hasNote } = useNote();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const existing = getNote(surah, ayah);
  const noted = hasNote(surah, ayah);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    if (noted && !existing?.noteText) {
      removeNoteByRef(surah, ayah);
    } else {
      if (!open && existing) {
        setInput(existing.noteText || '');
      }
      setOpen((prev) => !prev);
    }
  }, [noted, existing, open, removeNoteByRef, surah, ayah]);

  const handleSave = useCallback(() => {
    if (input.trim()) {
      addNote(surah, ayah, text, input.trim());
    } else {
      removeNoteByRef(surah, ayah);
    }
    setOpen(false);
    setInput('');
  }, [input, addNote, removeNoteByRef, surah, ayah, text]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  return (
    <>
      <button
        onClick={handleToggle}
        className={`p-2 rounded-lg transition-all duration-200 ${
          noted
            ? 'text-blue-400 hover:text-blue-300 bg-blue-500/10'
            : 'text-slate-400 hover:text-blue-400 hover:bg-slate-700/50'
        }`}
        aria-label={noted ? 'تحرير الملحوظة' : 'إضافة ملحوظة'}
        title={noted ? 'تحرير الملحوظة' : 'إضافة ملحوظة'}
      >
        <FaStickyNote size={14} />
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-full max-w-md rounded-xl border border-teal-500/20 bg-slate-800 p-0 shadow-2xl shadow-black/40 backdrop:bg-black/60 backdrop:backdrop-blur-lg"
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === dialogRef.current) setOpen(false); }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-teal-400 font-medium">ملحوظة</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
              type="button"
            >
              <FaTimes size={12} />
            </button>
          </div>
          <p
            className="text-xs leading-relaxed text-teal-300/70 bg-teal-500/5 rounded-lg p-2 border border-teal-500/10 mb-2"
            dir="rtl"
          >
            {text}
          </p>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب ملحوظتك هنا..."
            className="w-full bg-slate-900/60 border border-slate-600/50 rounded-lg p-2.5 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-teal-500/50 transition-colors"
            rows={4}
            dir="rtl"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
              type="button"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
              type="button"
            >
              حفظ
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
});

NoteButton.displayName = 'NoteButton';

export default NoteButton;
