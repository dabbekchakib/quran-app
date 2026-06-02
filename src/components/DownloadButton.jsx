import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { FaDownload, FaPause, FaPlay, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { quranDownloadManager } from '../services/downloadManager';
import { getAudioStatus } from '../services/indexedDB';

const CORS_TOOLTIP = 'التحميل المباشر غير مدعوم من CDN. استخدم الخاصية "حفظ كـ" في المتصفح.';

const DownloadButton = memo(({ surahNumber, onStatusChange }) => {
  const [status, setStatus] = useState('none');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    getAudioStatus(surahNumber).then(setStatus).catch(() => {});
  }, [surahNumber]);

  useEffect(() => {
    const unsub = quranDownloadManager.on(surahNumber, (data) => {
      setStatus(data.status);
      setProgress(data.progress || 0);
      if (data.status === 'error-cors') {
        setErrorMsg(data.error || CORS_TOOLTIP);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setErrorMsg(''), 4000);
      }
      onStatusChange?.(surahNumber, data.status);
    });
    return () => { clearTimeout(timerRef.current); unsub(); };
  }, [surahNumber, onStatusChange]);

  const handleClick = useCallback(() => {
    if (status === 'downloading') {
      quranDownloadManager.pauseDownload(surahNumber);
    } else if (status === 'paused') {
      quranDownloadManager.resumeDownload(surahNumber);
    } else if (status === 'completed' || status === 'downloaded') {
      quranDownloadManager.deleteDownload(surahNumber).then(() => {
        setStatus('none');
        setProgress(0);
        onStatusChange?.(surahNumber, 'none');
      });
    } else {
      setStatus('downloading');
      setProgress(0);
      quranDownloadManager.startDownload(surahNumber);
    }
  }, [status, surahNumber, onStatusChange]);

  if (status === 'completed' || status === 'downloaded') {
    return (
      <div className="relative">
        {errorMsg && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-red-900/90 text-red-200 text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl z-50 border border-red-500/30">
            {errorMsg}
          </div>
        )}
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
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-teal-400 min-w-[28px] text-left" dir="ltr">{progress}%</span>
        <button
          onClick={handleClick}
          className="p-2 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
          aria-label={`إيقاف تحميل سورة ${surahNumber}`}
          title="إيقاف التحميل"
        >
          <FaPause size={12} />
        </button>
      </div>
    );
  }

  if (status === 'paused') {
    return (
      <button
        onClick={handleClick}
        className="p-2 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-all"
        aria-label={`استئناف تحميل سورة ${surahNumber}`}
        title="متصلاً - اضغط للاستئناف"
      >
        <FaPlay size={12} />
      </button>
    );
  }

  if (status === 'error' || status === 'error-cors') {
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
          title={CORS_TOOLTIP}
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
