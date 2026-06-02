import { useState, useEffect, memo } from 'react';
import { FaTrash, FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import { getAllDownloadedSurahs } from '../services/indexedDB';
import { quranDownloadManager } from '../services/downloadManager';

const DownloadManager = memo(({ surahList }) => {
  const [downloaded, setDownloaded] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    getAllDownloadedSurahs().then((items) => {
      setDownloaded(items);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    const unsub = quranDownloadManager.on('*', () => {
      setTimeout(refresh, 500);
    });
    return unsub;
  }, []);

  const handleDelete = (surahNumber) => {
    quranDownloadManager.deleteDownload(surahNumber).then(refresh);
  };

  const handleDeleteAll = async () => {
    for (const item of downloaded) {
      await quranDownloadManager.deleteDownload(item.surah);
    }
    refresh();
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <FaSpinner className="animate-spin text-teal-400 text-2xl mx-auto" />
      </div>
    );
  }

  if (downloaded.length === 0) {
    return (
      <div className="text-center py-10">
        <FaDownload className="text-4xl text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">لم يتم تحميل أي سورة بعد</p>
      </div>
    );
  }

  const totalSize = downloaded.reduce((sum, item) => sum + (item.size || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400">
          {downloaded.length} سورة
          {totalSize > 0 && ` (${(totalSize / 1024 / 1024).toFixed(1)} MB)`}
        </p>
        <button
          onClick={handleDeleteAll}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors text-xs"
        >
          <FaTrash size={10} />
          <span>حذف الكل</span>
        </button>
      </div>

      <div className="space-y-2">
        {downloaded.map((item) => {
          const surah = surahList?.find((s) => s.number === item.surah);
          return (
            <div
              key={item.surah}
              className="flex items-center justify-between bg-slate-800/40 border border-teal-500/10 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FaCheck className="text-emerald-400 text-xs" />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-[Amiri]">{surah?.name || `سورة ${item.surah}`}</p>
                  <p className="text-[10px] text-slate-500">
                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString('ar-SA') : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.surah)}
                className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                aria-label={`حذف سورة ${item.surah}`}
              >
                <FaTrash size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DownloadManager.displayName = 'DownloadManager';

export default DownloadManager;
