import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaStickyNote, FaTrash, FaFilePdf, FaArrowLeft, FaQuran, FaSortAmountDown, FaTags, FaClock, FaTimes, FaCheck, FaEdit } from 'react-icons/fa';
import { useNote } from '../context/NotesContext';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const CATEGORY_COLORS = [
  { border: 'border-blue-500/30', bg: 'bg-blue-500/5', dot: 'bg-blue-400', text: 'text-blue-400', header: 'border-blue-500/20' },
  { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', dot: 'bg-emerald-400', text: 'text-emerald-400', header: 'border-emerald-500/20' },
  { border: 'border-amber-500/30', bg: 'bg-amber-500/5', dot: 'bg-amber-400', text: 'text-amber-400', header: 'border-amber-500/20' },
  { border: 'border-purple-500/30', bg: 'bg-purple-500/5', dot: 'bg-purple-400', text: 'text-purple-400', header: 'border-purple-500/20' },
  { border: 'border-pink-500/30', bg: 'bg-pink-500/5', dot: 'bg-pink-400', text: 'text-pink-400', header: 'border-pink-500/20' },
  { border: 'border-cyan-500/30', bg: 'bg-cyan-500/5', dot: 'bg-cyan-400', text: 'text-cyan-400', header: 'border-cyan-500/20' },
  { border: 'border-orange-500/30', bg: 'bg-orange-500/5', dot: 'bg-orange-400', text: 'text-orange-400', header: 'border-orange-500/20' },
  { border: 'border-indigo-500/30', bg: 'bg-indigo-500/5', dot: 'bg-indigo-400', text: 'text-indigo-400', header: 'border-indigo-500/20' },
  { border: 'border-rose-500/30', bg: 'bg-rose-500/5', dot: 'bg-rose-400', text: 'text-rose-400', header: 'border-rose-500/20' },
  { border: 'border-teal-500/30', bg: 'bg-teal-500/5', dot: 'bg-teal-400', text: 'text-teal-400', header: 'border-teal-500/20' },
];

const getCategoryColor = (category, categories) => {
  const idx = categories.indexOf(category);
  return CATEGORY_COLORS[((idx % CATEGORY_COLORS.length) + CATEGORY_COLORS.length) % CATEGORY_COLORS.length];
};

const Notes = () => {
  const { notes, removeNote, clearAllNotes, categories, removeCategory, renameCategory } = useNote();
  const [surahCache, setSurahCache] = useState({});
  const [exporting, setExporting] = useState(false);
  const [sortBy, setSortBy] = useState('category');
  const [editingCat, setEditingCat] = useState(null);
  const [editCatInput, setEditCatInput] = useState('');
  const editCatRef = useRef(null);
  const contentRef = useRef(null);
  const notesRef = useRef(null);

  useEffect(() => {
    document.title = 'الملحوظات - القرآن الكريم';
    try {
      const cached = JSON.parse(localStorage.getItem('quran_surahs_cache') || '[]');
      const map = {};
      cached.forEach((s) => { map[s.number] = s; });
      setSurahCache(map);
    } catch {}
  }, []);

  useEffect(() => {
    if (editingCat && editCatRef.current) {
      editCatRef.current.focus();
    }
  }, [editingCat]);

  const formatDateFr = (timestamp) => {
    const date = new Date(timestamp);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const h = date.getHours();
    const min = String(date.getMinutes()).padStart(2, '0');
    const hh = String(h).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
  };

  const getSurahName = (num) => {
    return surahCache[num]?.name || `سورة ${num}`;
  };

  const sortedByDate = useMemo(
    () => [...notes].sort((a, b) => b.timestamp - a.timestamp),
    [notes]
  );

  const groupedByCategory = useMemo(() => {
    const groups = {};
    categories.forEach((cat) => { groups[cat] = []; });
    notes.forEach((note) => {
      const cat = note.category || 'عام';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(note);
    });
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) => b.timestamp - a.timestamp);
    });
    return groups;
  }, [notes, categories]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await document.fonts.ready;
      const root = notesRef.current;
      const canvas = await html2canvas(root, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false,
        foreignObjectRendering: false,
        allowTaint: true,
        removeContainer: true,
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll('*').forEach((el) => {
            el.style.filter = 'none';
            el.style.backdropFilter = 'none';
            el.style.boxShadow = 'none';
          });
          const title = clonedDoc.querySelector('[data-pdf-title]');
          if (title) title.style.display = 'block';
          const count = clonedDoc.querySelector('[data-pdf-count]');
          if (count) count.style.display = 'block';
        },
      });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= doc.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= doc.internal.pageSize.getHeight();
      }

      doc.save('quran-notes.pdf');
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const startEditCat = useCallback((name) => {
    setEditingCat(name);
    setEditCatInput(name);
  }, []);

  const confirmEditCat = useCallback(() => {
    if (editingCat && editCatInput.trim() && editCatInput.trim() !== editingCat) {
      renameCategory(editingCat, editCatInput.trim());
    }
    setEditingCat(null);
    setEditCatInput('');
  }, [editingCat, editCatInput, renameCategory]);

  return (
    <div className="max-w-4xl mx-auto">
      <div ref={contentRef}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 border border-blue-500/30 mb-6">
            <FaStickyNote className="text-3xl text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
            الملحوظات
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            {notes.length} ملحوظة
          </p>
        </div>

        {notes.length > 0 && (
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <div className="flex bg-slate-800/50 rounded-xl p-1 gap-1">
            <button
              onClick={() => setSortBy('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                sortBy === 'category' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <FaTags size={11} />
              <span>تصنيف</span>
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                sortBy === 'date' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <FaClock size={11} />
              <span>تاريخ</span>
            </button>
          </div>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-xl transition-colors text-xs disabled:opacity-50"
          >
            <FaFilePdf size={12} />
            <span>{exporting ? 'جاري التصدير...' : 'PDF'}</span>
          </button>
          <button
            onClick={clearAllNotes}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors text-xs"
          >
            <FaTrash size={11} />
            <span>حذف الكل</span>
          </button>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
            <FaStickyNote className="text-3xl text-slate-600" />
          </div>
          <p className="text-slate-400 mb-2">لا توجد ملحوظات</p>
          <p className="text-slate-500 text-sm mb-6">
            اضغط على أيقونة الملحوظة بجانب أي آية لإضافة ملحوظة
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors text-sm"
          >
            <FaQuran />
            <span>تصفح القرآن</span>
          </Link>
        </div>
      ) : (
        <div ref={notesRef}>
          <h1 data-pdf-title className="hidden text-center text-3xl font-bold text-slate-100 font-[Amiri] mb-6">
            الملحوظات
          </h1>
          <p data-pdf-count className="hidden text-center text-slate-400 text-sm mb-8">
            {notes.length} ملحوظة
          </p>

          {sortBy === 'category' ? (
            <div className="space-y-6">
              {categories.map((cat) => {
                const catNotes = groupedByCategory[cat];
                if (!catNotes || catNotes.length === 0) return null;
                const colors = getCategoryColor(cat, categories);
                return (
                  <div key={cat}>
                    <div className={`flex items-center justify-between mb-3 pb-2 border-b ${colors.header}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        {editingCat === cat ? (
                          <div className="flex items-center gap-1">
                            <input
                              ref={editCatRef}
                              value={editCatInput}
                              onChange={(e) => setEditCatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') confirmEditCat();
                                if (e.key === 'Escape') setEditingCat(null);
                              }}
                              className="bg-slate-900/60 border border-teal-500/30 rounded-lg px-2 py-0.5 text-sm text-slate-200 focus:outline-none w-28"
                            />
                            <button onClick={confirmEditCat} className="p-1 text-teal-400 hover:text-teal-300" type="button">
                              <FaCheck size={10} />
                            </button>
                            <button onClick={() => setEditingCat(null)} className="p-1 text-slate-500 hover:text-slate-300" type="button">
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ) : (
                          <span className={`text-sm font-medium ${colors.text}`}>{cat}</span>
                        )}
                        <span className="text-[10px] text-slate-500">({catNotes.length})</span>
                      </div>
                      {cat !== 'عام' && editingCat !== cat && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEditCat(cat)}
                            className="p-1 rounded text-slate-500 hover:text-teal-400 transition-colors"
                            type="button"
                            title="تعديل التصنيف"
                          >
                            <FaEdit size={10} />
                          </button>
                          <button
                            onClick={() => removeCategory(cat)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                            type="button"
                            title="حذف التصنيف"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {catNotes.map((note) => {
                        const noteColors = getCategoryColor(note.category || 'عام', categories);
                        return (
                          <div
                            key={note.id}
                            className={`bg-slate-800/40 backdrop-blur-sm border ${noteColors.border} rounded-2xl p-5 hover:bg-slate-800/70 transition-all duration-300`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                                    {getSurahName(note.surah)} ({note.surah}) : آية {note.ayah}
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    {formatDateFr(note.timestamp)}
                                  </span>
                                </div>
                                <p
                                  className="text-sm leading-relaxed text-teal-300/80 bg-teal-500/5 rounded-xl p-3 border border-teal-500/10 mb-2"
                                  dir="rtl"
                                >
                                  {note.text}
                                </p>
                                <p
                                  className="text-sm leading-relaxed text-slate-300 bg-slate-900/40 rounded-xl p-3 border border-slate-700/30"
                                  dir="rtl"
                                >
                                  {note.noteText}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Link
                                  to={`/surah/${note.surah}#ayah-${note.ayah}`}
                                  className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-700/50 transition-all"
                                  aria-label="الذهاب إلى الآية"
                                >
                                  <FaArrowLeft className="-rotate-180" size={14} />
                                </Link>
                                <button
                                  onClick={() => removeNote(note.id)}
                                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                  aria-label="حذف الملحوظة"
                                >
                                  <FaTrash size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {sortedByDate.map((note) => {
                const noteColors = getCategoryColor(note.category || 'عام', categories);
                return (
                  <div
                    key={note.id}
                    className={`bg-slate-800/40 backdrop-blur-sm border ${noteColors.border} rounded-2xl p-5 hover:bg-slate-800/70 transition-all duration-300`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-xs ${noteColors.text} bg-slate-700/30 px-3 py-1 rounded-full`}>
                            {note.category || 'عام'}
                          </span>
                          <span className="text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                            {getSurahName(note.surah)} ({note.surah}) : آية {note.ayah}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDateFr(note.timestamp)}
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed text-teal-300/80 bg-teal-500/5 rounded-xl p-3 border border-teal-500/10 mb-2"
                          dir="rtl"
                        >
                          {note.text}
                        </p>
                        <p
                          className="text-sm leading-relaxed text-slate-300 bg-slate-900/40 rounded-xl p-3 border border-slate-700/30"
                          dir="rtl"
                        >
                          {note.noteText}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          to={`/surah/${note.surah}#ayah-${note.ayah}`}
                          className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-700/50 transition-all"
                          aria-label="الذهاب إلى الآية"
                        >
                          <FaArrowLeft className="-rotate-180" size={14} />
                        </Link>
                        <button
                          onClick={() => removeNote(note.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          aria-label="حذف الملحوظة"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Notes;
