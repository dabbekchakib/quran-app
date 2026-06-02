import { useState, useEffect, memo } from 'react';
import { FaTrash, FaDownload, FaPlay, FaPause, FaSpinner } from 'react-icons/fa';
import { quranDownloadManager } from '../services/downloadManager';
import { useAudio } from '../context/AudioContext';

const DownloadManager = memo(({ surahList }) => {
  const audio = useAudio();
  const [downloaded, setDownloaded] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    setLoading(true);
    quranDownloadManager.getAllDownloaded().then((items) => {
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
    for (const sn of downloaded) {
      await quranDownloadManager.deleteDownload(sn);
    }
    refresh();
  };

  const handlePlay = (surahNumber) => {
    if (audio.currentSurah?.number === surahNumber && audio.isPlaying) {
      audio.togglePlay();
    } else {
      audio.setPlaybackMode('surah');
      audio.playSurah(surahNumber);
    }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-slate-400">
          {downloaded.length} سورة
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
        {downloaded.map((surahNumber) => {
          const surah = surahList?.find((s) => s.number === surahNumber);
          const isPlayingThis = audio.currentSurah?.number === surahNumber && audio.isPlaying;
          return (
            <div
              key={surahNumber}
              className="flex items-center justify-between bg-slate-800/40 border border-teal-500/10 rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FaDownload className="text-emerald-400 text-xs" />
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-[Amiri]">{surah?.name || `سورة ${surahNumber}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlay(surahNumber)}
                  className={`p-2 rounded-lg transition-all ${
                    isPlayingThis
                      ? 'text-teal-300 bg-teal-500/15'
                      : 'text-slate-400 hover:text-teal-300 hover:bg-slate-700/50'
                  }`}
                  aria-label={isPlayingThis ? 'إيقاف التشغيل' : 'تشغيل السورة'}
                  title={isPlayingThis ? 'إيقاف' : 'تشغيل'}
                >
                  {isPlayingThis ? <FaPause size={13} /> : <FaPlay size={12} />}
                </button>
                <button
                  onClick={() => handleDelete(surahNumber)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  aria-label={`حذف سورة ${surahNumber}`}
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

DownloadManager.displayName = 'DownloadManager';

export default DownloadManager;
