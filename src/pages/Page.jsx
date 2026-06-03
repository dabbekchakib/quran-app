import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaBookOpen, FaSearch } from 'react-icons/fa';
import AyahCard from '../components/AyahCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPageById } from '../api/quranApi';
import { useTheme } from '../context/ThemeContext';

const Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useTheme();
  const pageNumber = parseInt(id, 10);
  const [page, setPage] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [jumpInput, setJumpInput] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPageById(pageNumber);
        setPage(data);
        setAyahs(data.ayahs || []);
      } catch (err) {
        setError(err.message || 'فشل في تحميل الصفحة');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id, pageNumber]);

  useEffect(() => {
    if (page) {
      document.title = `الصفحة ${pageNumber} - القرآن الكريم`;
    }
  }, [page, pageNumber]);

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

  if (loading) return <LoadingSpinner text="جاري تحميل الصفحة..." />;

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

  if (!page) return null;

  const hasNext = pageNumber < 604;
  const hasPrev = pageNumber > 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-300 transition-colors text-sm">
          <FaArrowRight />
          <span>العودة إلى السور</span>
        </Link>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={604}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && jumpInput) {
                const num = parseInt(jumpInput, 10);
                if (num >= 1 && num <= 604) navigate(`/page/${num}`);
              }
            }}
            placeholder="رقم الصفحة"
            className="w-28 px-3 py-1.5 text-sm bg-slate-800/50 border border-teal-500/20 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors"
          />
          <button
            onClick={() => {
              const num = parseInt(jumpInput, 10);
              if (num >= 1 && num <= 604) navigate(`/page/${num}`);
            }}
            disabled={!jumpInput}
            className="p-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors"
            aria-label="اذهب إلى الصفحة"
          >
            <FaSearch size={14} />
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-900/30 via-slate-800/40 to-emerald-900/20 backdrop-blur-sm border border-teal-500/20 rounded-3xl p-8 sm:p-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-5">
          <FaBookOpen className="text-2xl text-teal-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 font-[Amiri] mb-3 leading-relaxed">
          الصفحة {pageNumber}
        </h1>
        <p className="text-lg text-slate-300 mb-2">صفحة {pageNumber}</p>
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
            <div className="bg-teal-800/50 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-4 mb-4 text-center">
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
          <Link to={`/page/${pageNumber - 1}`}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm">
            <FaArrowRight />
            <span>الصفحة {pageNumber - 1}</span>
          </Link>
        ) : <div />}
        {hasNext ? (
          <Link to={`/page/${pageNumber + 1}`}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-teal-500/10 rounded-xl text-slate-300 hover:text-teal-300 transition-all text-sm">
            <span>الصفحة {pageNumber + 1}</span>
            <FaArrowRight className="-rotate-180" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default Page;
