import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaTrash, FaQuran, FaArrowLeft } from 'react-icons/fa';
import { useBookmark } from '../context/BookmarkContext';

const Bookmarks = () => {
  const { bookmarks, removeBookmark, clearAllBookmarks } = useBookmark();

  useEffect(() => {
    document.title = 'المحفوظات - القرآن الكريم';
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/30 mb-6">
          <FaBookmark className="text-3xl text-amber-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          المحفوظات
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {bookmarks.length} آية محفوظة
        </p>
      </div>

      {bookmarks.length > 0 && (
        <div className="flex justify-end mb-6">
          <button
            onClick={clearAllBookmarks}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-colors text-sm"
            aria-label="حذف جميع المحفوظات"
          >
            <FaTrash size={12} />
            <span>حذف الكل</span>
          </button>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700/50 mb-6">
            <FaBookmark className="text-3xl text-slate-600" />
          </div>
          <p className="text-slate-400 mb-2">لا توجد آيات محفوظة</p>
          <p className="text-slate-500 text-sm mb-6">
            اضغط على أيقونة bookmark بجانب أي آية لحفظها
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
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-teal-500/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full">
                      سورة {bookmark.surah} : آية {bookmark.ayah}
                    </span>
                    <span className="text-xs text-slate-500" dir="ltr">
                      {formatDate(bookmark.timestamp)}
                    </span>
                  </div>
                  <p className="text-xl leading-[2] text-slate-100 font-[Amiri] text-right line-clamp-3">
                    {bookmark.text}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/surah/${bookmark.surah}#ayah-${bookmark.ayah}`}
                    className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-700/50 transition-all"
                    aria-label="الذهاب إلى الآية"
                  >
                    <FaArrowLeft className="-rotate-180" size={14} />
                  </Link>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label="حذف bookmark"
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
  );
};

export default Bookmarks;
