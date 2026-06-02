import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { LuBookMarked } from 'react-icons/lu';
import AyahCard from '../components/AyahCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchFullHizb } from '../api/quranApi';
import { useTheme } from '../context/ThemeContext';
import { HIZB_COUNT } from '../utils/constants';

const HizbDetail = () => {
  const { id } = useParams();
  const { settings } = useTheme();
  const hizbNumber = parseInt(id, 10);
  const [hizb, setHizb] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFullHizb(hizbNumber);
        setHizb(data);
        setAyahs(data.ayahs || []);
      } catch (err) {
        setError(err.message || 'فشل في تحميل الحزب');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id, hizbNumber]);

  useEffect(() => {
    if (hizb) {
      document.title = `الحزب ${hizbNumber} - القرآن الكريم`;
    }
  }, [hizb, hizbNumber]);

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

  const surahGroups = ayahs.reduce((groups, ayah) => {
    const surahNum = ayah.surah.number;
    if (!groups[surahNum]) {
      groups[surahNum] = {
        name: ayah.surah.name,
        englishName: ayah.surah.englishName,
        ayahs: [],
      };
    }
    groups[surahNum].ayahs.push(ayah);
    return groups;
  }, {});

  if (loading) return <LoadingSpinner text="جاري تحميل الحزب..." />;

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

  if (!hizb) return null;

  const hasNext = hizbNumber < HIZB_COUNT;
  const hasPrev = hizbNumber > 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/hizb" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-300 transition-colors text-sm">
          <FaArrowRight />
          <span>العودة إلى الأحزاب</span>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-teal-900/30 via-slate-800/40 to-emerald-900/20 backdrop-blur-sm border border-teal-500/20 rounded-3xl p-8 sm:p-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-5">
          <LuBookMarked className="text-2xl text-teal-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 font-[Amiri] mb-3 leading-relaxed">
          الحزب {hizbNumber}
        </h1>
        <p className="text-lg text-slate-300 mb-2">الحزب {hizbNumber}</p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
          <span className="text-teal-400">{ayahs.length} آية</span>
        </div>
      </div>

      {copyFeedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-teal-600 text-white px-6 py-3 rounded-xl shadow-xl text-sm animate-fade-in-down">
          {copyFeedback}
        </div>
      )}

      <div className="space-y-6 mb-28">
        {Object.entries(surahGroups).map(([surahNum, group]) => (
          <div key={surahNum}>
            <div className="bg-slate-800/50 bg-teal-800/50 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-4 mb-4 text-center">
              <h2 className="text-2xl font-bold text-slate-100 font-[Amiri]">
                {group.name}
              </h2>
              <p className="text-slate-400 text-sm">{group.englishName}</p>
            </div>
            <div className="space-y-4">
              {group.ayahs.map((ayah) => (
                <AyahCard
                  key={ayah.number}
                  ayah={ayah}
                  surahNumber={ayah.surah.number}
                  ayahFont={settings.font}
                  fontSizeClass={settings.fontSize}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        {hasPrev ? (
          <Link to={`/hizb/${hizbNumber - 1}`}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm">
            <FaArrowRight />
            <span>الحزب {hizbNumber - 1}</span>
          </Link>
        ) : <div />}
        {hasNext ? (
          <Link to={`/hizb/${hizbNumber + 1}`}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm">
            <span>الحزب {hizbNumber + 1}</span>
            <FaArrowRight className="-rotate-180" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default HizbDetail;
