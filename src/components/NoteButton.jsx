import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { FaStickyNote, FaTimes } from 'react-icons/fa';
import { useNote } from '../context/NotesContext';

const NoteButton = memo(({ surah, ayah, text }) => {
  const { getNote, addNote, removeNoteByRef, hasNote } = useNote();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const existing = getNote(surah, ayah);
  const noted = hasNote(surah, ayah);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    if (noted && !existing?.noteText) {
      removeNoteByRef(surah, ayah);
    } else {
      setOpen((prev) => !prev);
      if (!open && existing) {
        setInput(existing.noteText || '');
      }
    }
  }, [noted, existing, open, removeNoteByRef, surah, ayah]);

  const handleSave = useCallback((e) => {
    e.stopPropagation();
    if (input.trim()) {
      addNote(surah, ayah, text, input.trim());
    } else {
      removeNoteByRef(surah, ayah);
    }
    setOpen(false);
    setInput('');
  }, [input, addNote, removeNoteByRef, surah, ayah, text]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSave(e);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [handleSave]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
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

      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md bg-slate-800 border border-teal-500/20 rounded-xl p-4 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-teal-400 font-medium">ملحوظة</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
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
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
            >
              حفظ
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

NoteButton.displayName = 'NoteButton';

export default NoteButton;
