import { useState, useEffect, useCallback, useMemo } from 'react';
import { FaQuran, FaBookOpen } from 'react-icons/fa';
import SurahCard from '../components/SurahCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useQuran } from '../context/QuranContext';
import { SURAH_COUNT } from '../utils/constants';

const Home = () => {
  const { surahs, loading, error, loadSurahs } = useQuran();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = 'القرآن الكريم - Quran';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = 'اقرأ واستمع إلى القرآن الكريم مع التفسير والترجمة';
  }, []);

  useEffect(() => {
    if (surahs.length === 0) {
      loadSurahs().catch(() => {});
    }
  }, [surahs.length, loadSurahs]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return surahs;
    const q = searchQuery.trim().toLowerCase();
    return surahs.filter(
      (s) =>
        s.name?.includes(q) ||
        s.englishName?.toLowerCase().includes(q) ||
        s.englishNameTranslation?.toLowerCase().includes(q) ||
        s.number?.toString() === q
    );
  }, [surahs, searchQuery]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaQuran className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          القرآن الكريم
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {SURAH_COUNT} سورة مباركة
        </p>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && <LoadingSpinner text="جاري تحميل السور..." />}

      {error && (
        <div className="text-center py-16">
          <FaBookOpen className="text-5xl text-red-400/50 mx-auto mb-4" />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadSurahs()}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors text-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-1">
          {filteredSurahs.length > 0 ? (
            filteredSurahs.map((surah) => (
              <div key={surah.number} className="py-1.5">
                <SurahCard surah={surah} />
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500">لا توجد نتائج للبحث</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
