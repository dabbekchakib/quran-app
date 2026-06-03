import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { FaCopy, FaPlay, FaPause } from 'react-icons/fa';
import BookmarkButton from './BookmarkButton';
import NoteButton from './NoteButton';
import { formatTime } from '../utils/helpers';

const AyahCard = memo(({ ayah, surahNumber, ayahFont, fontSizeClass, onCopy }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => { setPlaying(false); setCurrentTime(0); };

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
      setShowPlayer(true);
    }
    setPlaying(!playing);
  }, [playing]);

  const handleSeek = useCallback((e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = pct * duration;
    setCurrentTime(audio.currentTime);
  }, [duration]);

  const handleCopy = useCallback(() => {
    onCopy?.(ayah.text);
  }, [ayah.text, onCopy]);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="group bg-slate-800/30 backdrop-blur-sm border border-teal-500/5 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-teal-500/20 transition-all duration-300"
      id={`ayah-${ayah.numberInSurah}`}
    >
      <audio ref={audioRef} src={ayah.audio} preload="none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs">
            {ayah.numberInSurah}
          </span>
          <span className="text-slate-500 text-xs">آية</span>
        </div>

        <div className="flex items-center gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-700/50 transition-all duration-200"
            aria-label="نسخ الآية"
            title="نسخ"
          >
            <FaCopy size={14} />
          </button>
          <NoteButton surah={surahNumber} ayah={ayah.numberInSurah} text={ayah.text} />
          <BookmarkButton surah={surahNumber} ayah={ayah.numberInSurah} text={ayah.text} />
        </div>
      </div>

      <p
        className={`${fontSizeClass || 'text-2xl'} leading-[2.2] text-slate-100 text-right font-[Amiri] tracking-wide`}
        style={{ fontFamily: ayahFont || 'Amiri, serif' }}
        dir="rtl"
        lang="ar"
      >
        {ayah.text}
      </p>

      <button
        onClick={() => setShowPlayer((p) => !p)}
        className="mb-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-teal-500/15 text-teal-400 hover:bg-teal-500/30 ml-auto"
        aria-label={showPlayer ? 'إخفاء المشغل' : 'تشغيل الآية'}
        title={showPlayer ? 'إخفاء المشغل' : 'تشغيل الآية'}
      >
        {showPlayer ? <FaPause size={9} /> : <FaPlay size={9} className="mr-px" />}
      </button>

      {(showPlayer || playing) && (
        <div className="mt-4 pt-3 border-t border-teal-500/10 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 flex items-center justify-center text-white transition-all shadow-sm"
            aria-label={playing ? 'إيقاف' : 'تشغيل الآية'}
            title={playing ? 'إيقاف' : 'تشغيل'}
          >
            {playing ? <FaPause size={11} /> : <FaPlay size={11} className="mr-0.5" />}
          </button>

          <div
            className="flex-1 h-1.5 bg-slate-700 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
            role="slider"
            aria-label="مدة التشغيل"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
          >
            <div
              className="h-full bg-gradient-to-l from-teal-400 to-emerald-400 rounded-full transition-all duration-150"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <span className="flex-shrink-0 text-[10px] text-slate-500 font-mono min-w-[30px] text-left" dir="ltr">
            {formatTime(currentTime)}
          </span>
        </div>
      )}
    </div>
  );
});

AyahCard.displayName = 'AyahCard';

export default AyahCard;
