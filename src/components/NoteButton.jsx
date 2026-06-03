import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { FaStickyNote, FaTimes, FaPlus, FaCheck } from 'react-icons/fa';
import { useNote } from '../context/NotesContext';

const NoteButton = memo(({ surah, ayah, text }) => {
  const { getNote, addNote, removeNoteByRef, hasNote, categories, addCategory, DEFAULT_CATEGORY } = useNote();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const newCatRef = useRef(null);
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

  useEffect(() => {
    if (showNewCategory && newCatRef.current) {
      newCatRef.current.focus();
    }
  }, [showNewCategory]);

  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    if (noted && !existing?.noteText) {
      removeNoteByRef(surah, ayah);
    } else {
      if (!open && existing) {
        setInput(existing.noteText || '');
        setCategory(existing.category || DEFAULT_CATEGORY);
      }
      setOpen((prev) => !prev);
    }
  }, [noted, existing, open, removeNoteByRef, surah, ayah, DEFAULT_CATEGORY]);

  const handleSave = useCallback(() => {
    if (input.trim()) {
      addNote(surah, ayah, text, input.trim(), category);
    } else {
      removeNoteByRef(surah, ayah);
    }
    setOpen(false);
    setInput('');
  }, [input, category, addNote, removeNoteByRef, surah, ayah, text]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  const handleAddCategory = useCallback(() => {
    const name = newCategory.trim();
    if (name && !categories.includes(name)) {
      addCategory(name);
      setCategory(name);
    }
    setShowNewCategory(false);
    setNewCategory('');
  }, [newCategory, categories, addCategory]);

  const handleNewCatKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
    if (e.key === 'Escape') {
      setShowNewCategory(false);
      setNewCategory('');
    }
  }, [handleAddCategory]);

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

          <div className="mt-3">
            <div className="text-xs text-slate-400 mb-1.5">التصنيف</div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowNewCategory(false); }}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    category === cat
                      ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                      : 'bg-slate-700/30 border-slate-600/30 text-slate-400 hover:border-slate-500/50'
                  }`}
                  type="button"
                >
                  {category === cat && <FaCheck size={8} className="inline ml-1" />}
                  {cat}
                </button>
              ))}
              {!showNewCategory ? (
                <button
                  onClick={() => setShowNewCategory(true)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-dashed border-slate-600/50 text-slate-500 hover:text-teal-400 hover:border-teal-500/30 transition-all"
                  type="button"
                >
                  <FaPlus size={9} className="inline ml-1" />
                  جديد
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    ref={newCatRef}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={handleNewCatKeyDown}
                    placeholder="اسم التصنيف"
                    className="w-24 bg-slate-900/60 border border-teal-500/30 rounded-lg px-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddCategory}
                    className="p-1 rounded text-teal-400 hover:text-teal-300 transition-colors"
                    type="button"
                  >
                    <FaCheck size={10} />
                  </button>
                  <button
                    onClick={() => { setShowNewCategory(false); setNewCategory(''); }}
                    className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                    type="button"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-3">
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
