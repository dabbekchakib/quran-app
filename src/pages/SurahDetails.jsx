import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowRight, FaQuran, FaPlay, FaPause, FaForward, FaBackward } from 'react-icons/fa';
import AyahCard from '../components/AyahCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchSurahAudio } from '../api/quranApi';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { translateRevelationType, formatTime } from '../utils/helpers';

const SurahDetails = () => {
  const { id } = useParams();
  const { settings } = useTheme();
  const audio = useAudio();
  const [surah, setSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const surahList = JSON.parse(localStorage.getItem('quran_surahs_cache') || '[]');
  const scrollRef = useRef(null);

  const surahNumber = parseInt(id, 10);
  const currentIdx = surahList.findIndex((s) => s.number === surahNumber);
  const hasNext = currentIdx < surahList.length - 1;
  const hasPrev = currentIdx > 0;
  const nextSurah = hasNext ? surahList[currentIdx + 1] : null;
  const prevSurah = hasPrev ? surahList[currentIdx - 1] : null;

  const isPlayingThisSurah = audio.currentSurah?.number === surahNumber && audio.isPlaying && audio.playbackMode === 'surah';

  useEffect(() => {
    audio.setPlaybackMode('surah');
  }, [audio]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSurahAudio(id);
        setSurah(data);
        setAyahs(data.ayahs || []);

        const lastReadData = localStorage.getItem('quran_last_read');
        if (lastReadData) {
          const parsed = JSON.parse(lastReadData);
          if (parsed.surah === surahNumber) {
            localStorage.setItem('quran_last_read_scroll', JSON.stringify(parsed));
          }
        }
      } catch (err) {
        setError(err.message || 'فشل في تحميل السورة');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id, surahNumber]);

  useEffect(() => {
    if (surah) {
      document.title = `${surah.name} - القرآن الكريم`;
    }
  }, [surah]);

  useEffect(() => {
    const lastReadData = localStorage.getItem('quran_last_read');
    if (lastReadData && surah) {
      try {
        const parsed = JSON.parse(lastReadData);
        if (parsed.surah === surahNumber) {
          setTimeout(() => {
            const el = document.getElementById(`ayah-${parsed.ayah}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.classList.add('ring-2', 'ring-teal-500/40', 'shadow-lg', 'shadow-teal-500/10');
              setTimeout(() => {
                el.classList.remove('ring-2', 'ring-teal-500/40', 'shadow-lg', 'shadow-teal-500/10');
              }, 2000);
            }
          }, 500);
        }
      } catch { /* ignore */
      }
    }
  }, [surah, surahNumber]);

  const handleAyahClick = useCallback(
    (ayahNumber) => {
      try {
        localStorage.setItem('quran_last_read', JSON.stringify({ surah: surahNumber, ayah: ayahNumber, timestamp: Date.now() }));
      } catch {
        // ignore
      }
    },
    [surahNumber]
  );

  const handleCopy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback('تم النسخ ✓');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch {
      setCopyFeedback('فشل النسخ');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  }, []);

  const handlePlaySurah = useCallback(() => {
    if (isPlayingThisSurah) {
      audio.togglePlay();
    } else {
      audio.setPlaybackMode('surah');
      audio.playSurah(surahNumber);
    }
  }, [isPlayingThisSurah, audio, surahNumber]);

  if (loading) return <LoadingSpinner text="جاري تحميل السورة..." />;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (!surah) return null;

  return (
    <div className="max-w-4xl mx-auto" ref={scrollRef}>
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-300 transition-colors text-sm">
          <FaArrowRight />
          <span>العودة إلى السور</span>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-teal-900/30 via-slate-800/40 to-emerald-900/20 backdrop-blur-sm border border-teal-500/20 rounded-3xl p-8 sm:p-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-5">
          <FaQuran className="text-2xl text-teal-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 font-[Amiri] mb-3 leading-relaxed">
          {surah.name}
        </h1>
        <p className="text-lg text-slate-300 mb-2">{surah.englishName}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-400 mb-6">
          <span className="text-teal-400">سورة {surah.number}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>{translateRevelationType(surah.revelationType)}</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>{surah.numberOfAyahs} آية</span>
        </div>

        <button
          onClick={handlePlaySurah}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl transition-all text-sm font-medium shadow-lg shadow-teal-500/20"
        >
          {isPlayingThisSurah ? <FaPause /> : <FaPlay />}
          <span>{isPlayingThisSurah ? 'إيقاف التلاوة' : 'استمع للسورة'}</span>
        </button>
      </div>

      {copyFeedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-teal-600 text-white px-6 py-3 rounded-xl shadow-xl text-sm animate-fade-in-down">
          {copyFeedback}
        </div>
      )}

      <div className="space-y-4 mb-28" role="list" aria-label="آيات السورة">
        {ayahs.map((ayah) => (
          <div
            key={ayah.number}
            onClick={() => handleAyahClick(ayah.numberInSurah)}
            role="listitem"
          >
            <div
              id={`ayah-${ayah.numberInSurah}`}
            >
              <AyahCard
                ayah={ayah}
                surahNumber={surahNumber}
                ayahFont={settings.font}
                fontSizeClass={settings.fontSize}
                onCopy={handleCopy}
              />
            </div>
          </div>
        ))}
      </div>

      {isPlayingThisSurah && (
        <div className="fixed bottom-0 right-0 left-0 bg-slate-900/95 backdrop-blur-xl border-t border-teal-500/20 p-3 z-40">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={audio.prevSurah} disabled={!hasPrev}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-all disabled:opacity-30"
                aria-label="السورة السابقة">
                <FaBackward size={12} />
              </button>
              <button onClick={audio.togglePlay}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/30"
                aria-label={audio.isPlaying ? 'إيقاف' : 'تشغيل'}>
                {audio.isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="mr-0.5" />}
              </button>
              <button onClick={audio.nextSurah} disabled={!hasNext}
                className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-all disabled:opacity-30"
                aria-label="السورة التالية">
                <FaForward size={12} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1 w-24 sm:w-40 bg-slate-700 rounded-full">
                <div className="h-full bg-gradient-to-l from-teal-400 to-emerald-400 rounded-full"
                  style={{ width: `${audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 font-mono min-w-[60px] text-left" dir="ltr">
                {formatTime(audio.currentTime)} / {formatTime(audio.duration)}
              </span>
              <span className="text-[10px] text-slate-500">تلاوة كاملة</span>
            </div>

            <div className="flex items-center gap-2">
              {prevSurah && (
                <Link to={`/surah/${prevSurah.number}`}
                  className="text-[10px] text-slate-500 hover:text-teal-300 transition-colors">
                  {prevSurah.name}
                </Link>
              )}
              {nextSurah && (
                <Link to={`/surah/${nextSurah.number}`}
                  className="text-[10px] text-slate-500 hover:text-teal-300 transition-colors">
                  {nextSurah.name}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mb-8">
        {prevSurah ? (
          <Link to={`/surah/${prevSurah.number}`}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm">
            <FaArrowRight />
            <span>{prevSurah.name}</span>
          </Link>
        ) : <div />}
        {nextSurah ? (
          <Link to={`/surah/${nextSurah.number}`}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm">
            <span>{nextSurah.name}</span>
            <FaArrowRight className="-rotate-180" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default SurahDetails;
