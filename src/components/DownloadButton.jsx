import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { FaDownload, FaSpinner, FaCheck, FaPlay, FaPause, FaExclamationTriangle } from 'react-icons/fa';
import { quranDownloadManager } from '../services/downloadManager';
import { useAudio } from '../context/AudioContext';

const DownloadButton = memo(({ surahNumber, onStatusChange }) => {
  const audio = useAudio();
  const [status, setStatus] = useState('none');
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    quranDownloadManager.getStatus(surahNumber).then((s) => setStatus(s.status));
  }, [surahNumber]);

  useEffect(() => {
    const unsub = quranDownloadManager.on(surahNumber, (data) => {
      setStatus(data.status);
      if (data.status === 'error') {
        setErrorMsg(data.error || 'فشل التحميل');
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setErrorMsg(''), 4000);
      }
      onStatusChange?.(surahNumber, data.status);
    });
    return () => { clearTimeout(timerRef.current); unsub(); };
  }, [surahNumber, onStatusChange]);

  const handleClick = useCallback(() => {
    if (status === 'downloading') return;
    if (status === 'completed') {
      quranDownloadManager.deleteDownload(surahNumber).then(() => {
        setStatus('none');
        onStatusChange?.(surahNumber, 'none');
      });
    } else {
      setStatus('downloading');
      quranDownloadManager.startDownload(surahNumber);
    }
  }, [status, surahNumber, onStatusChange]);

  const handlePlay = useCallback((e) => {
    e.stopPropagation();
    if (audio.currentSurah?.number === surahNumber && audio.isPlaying) {
      audio.togglePlay();
    } else {
      audio.setPlaybackMode('surah');
      audio.playSurah(surahNumber);
    }
  }, [audio, surahNumber]);

  const isPlayingThis = audio.currentSurah?.number === surahNumber && audio.isPlaying;

  if (status === 'completed') {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handlePlay}
          className={`p-2 rounded-lg transition-all ${
            isPlayingThis
              ? 'text-teal-300 bg-teal-500/15'
              : 'text-emerald-400 hover:text-teal-300 hover:bg-slate-700/50'
          }`}
          aria-label={isPlayingThis ? 'إيقاف التشغيل' : 'تشغيل السورة'}
          title={isPlayingThis ? 'إيقاف' : 'تشغيل'}
        >
          {isPlayingThis ? <FaPause size={13} /> : <FaPlay size={12} />}
        </button>
        <button
          onClick={handleClick}
          className="p-2 rounded-lg text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
          aria-label={`حذف تحميل سورة ${surahNumber}`}
          title="تم التحميل - اضغط للحذف"
        >
          <FaCheck size={14} />
        </button>
      </div>
    );
  }

  if (status === 'downloading') {
    return (
      <FaSpinner className="animate-spin text-teal-400" size={14} />
    );
  }

  if (status === 'error') {
    return (
      <div className="relative">
        {errorMsg && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-red-900/90 text-red-200 text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-50 border border-red-500/30">
            {errorMsg}
          </div>
        )}
        <button
          onClick={handleClick}
          className="p-2 rounded-lg text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all"
          aria-label={`إعادة محاولة تحميل سورة ${surahNumber}`}
          title="فشل التحميل - اضغط لإعادة المحاولة"
        >
          <FaExclamationTriangle size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-700/50 transition-all"
      aria-label={`تحميل سورة ${surahNumber}`}
      title="تحميل"
    >
      <FaDownload size={14} />
    </button>
  );
});

DownloadButton.displayName = 'DownloadButton';

export default DownloadButton;
