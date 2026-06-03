import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaStickyNote, FaTrash, FaFilePdf, FaArrowLeft, FaQuran } from 'react-icons/fa';
import { useNote } from '../context/NotesContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const Notes = () => {
  const { notes, removeNote, clearAllNotes } = useNote();
  const [surahCache, setSurahCache] = useState({});
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    document.title = 'الملحوظات - القرآن الكريم';
    try {
      const cached = JSON.parse(localStorage.getItem('quran_surahs_cache') || '[]');
      const map = {};
      cached.forEach((s) => { map[s.number] = s; });
      setSurahCache(map);
    } catch {}
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

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

  const sorted = [...notes].sort((a, b) => b.timestamp - a.timestamp);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await document.fonts.ready;
      const root = contentRef.current;
      const canvas = await html2canvas(root, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false,
        foreignObjectRendering: false,
        allowTaint: true,
        removeContainer: true,
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            *, *::before, *::after {
              color: inherit !important;
              background: transparent !important;
              background-color: transparent !important;
              border-color: inherit !important;
              outline-color: inherit !important;
              text-decoration-color: inherit !important;
              caret-color: inherit !important;
              accent-color: auto !important;
              filter: none !important;
              backdrop-filter: none !important;
              box-shadow: none !important;
            }
            body {
              background: #0f172a !important;
              color: #e2e8f0 !important;
            }
            [class*="bg-"] {
              background: #1e293b !important;
            }
            [class*="text-slate-100"],
            [class*="text-slate-200"],
            [class*="text-slate-300"] {
              color: #e2e8f0 !important;
            }
            [class*="text-slate-400"],
            [class*="text-slate-500"],
            [class*="text-slate-600"] {
              color: #94a3b8 !important;
            }
            [class*="text-teal"] {
              color: #14b8a6 !important;
            }
            [class*="text-blue"] {
              color: #60a5fa !important;
            }
            [class*="text-red"] {
              color: #f87171 !important;
            }
            [class*="border-teal"] {
              border-color: #14b8a6 !important;
            }
            [class*="border-slate"] {
              border-color: #475569 !important;
            }
            [class*="border-blue"] {
              border-color: #3b82f6 !important;
            }
            [class*="border-red"] {
              border-color: #ef4444 !important;
            }
            [class*="from-"],
            [class*="to-"],
            [class*="via-"] {
              background: #0f172a !important;
            }
          `;
          clonedDoc.head.appendChild(style);
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
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-xl transition-colors text-sm disabled:opacity-50"
          >
            <FaFilePdf size={14} />
            <span>{exporting ? 'جاري التصدير...' : 'تصدير PDF'}</span>
          </button>
          <button
            onClick={clearAllNotes}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors text-sm"
          >
            <FaTrash size={12} />
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
        <div className="space-y-3">
          {sorted.map((note) => (
            <div
              key={note.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-teal-500/20 transition-all duration-300"
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
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default Notes;
