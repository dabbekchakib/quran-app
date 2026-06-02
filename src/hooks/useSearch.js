import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchFullQuran } from '../api/quranApi';
import { saveSearchResult, getSearchResult } from '../services/indexedDB';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const fullQuranRef = useRef(null);
  const surahNamesRef = useRef({});

  const buildSurahNames = useCallback((surahs) => {
    const map = {};
    surahs.forEach((s) => {
      map[s.number] = { name: s.name, englishName: s.englishName };
    });
    surahNamesRef.current = map;
  }, []);

  const loadFullQuran = useCallback(async () => {
    if (fullQuranRef.current) return fullQuranRef.current;

    const cached = localStorage.getItem('quran_full_cache');
    if (cached) {
      try {
        const data = JSON.parse(cached);
        fullQuranRef.current = data;
        buildSurahNames(data);
        return data;
      } catch { /* ignore */ }
    }

    setLoading(true);
    try {
      const data = await fetchFullQuran();
      const surahs = data.surahs || [];
      fullQuranRef.current = surahs;
      try {
        localStorage.setItem('quran_full_cache', JSON.stringify(surahs));
      } catch { /* ignore */ }
      buildSurahNames(surahs);
      return surahs;
    } catch (err) {
      setError(err.message || 'فشل في تحميل بيانات القرآن');
      return [];
    } finally {
      setLoading(false);
    }
  }, [buildSurahNames]);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const q = searchQuery.trim();

    const cached = await getSearchResult(q);
    if (cached) {
      setResults(cached);
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const surahs = await loadFullQuran();
      if (!surahs || surahs.length === 0) {
        setResults([]);
        return;
      }

      const isNumber = /^\d+$/.test(q);
      const searchNum = isNumber ? parseInt(q, 10) : null;

      const matched = [];

      if (searchNum && searchNum >= 1 && searchNum <= 114) {
        const surah = surahs.find((s) => s.number === searchNum);
        if (surah && surah.ayahs) {
          surah.ayahs.forEach((ayah) => {
            matched.push({ surahNumber: surah.number, surahName: surah.name, ayahNumber: ayah.numberInSurah, text: ayah.text });
          });
        }
        setResults(matched);
        saveSearchResult(q, matched);
        setSearching(false);
        return;
      }

      surahs.forEach((surah) => {
        if (surah.name?.includes(q) || surah.englishName?.toLowerCase().includes(q)) {
          if (surah.ayahs && surah.ayahs.length > 0) {
            matched.push({ surahNumber: surah.number, surahName: surah.name, ayahNumber: 1, text: surah.ayahs[0].text });
          }
        }
      });

      if (matched.length > 0) {
        setResults(matched);
        saveSearchResult(q, matched);
        setSearching(false);
        return;
      }

      const textResults = [];
      surahs.forEach((surah) => {
        if (!surah.ayahs) return;
        surah.ayahs.forEach((ayah) => {
          if (ayah.text.includes(q)) {
            textResults.push({ surahNumber: surah.number, surahName: surah.name, ayahNumber: ayah.numberInSurah, text: ayah.text });
          }
        });
      });

      const finalResults = textResults.slice(0, 100);
      setResults(finalResults);
      saveSearchResult(q, finalResults);
    } catch (err) {
      setError(err.message || 'فشل في البحث');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [loadFullQuran]);

  const debouncedSearch = useCallback(
    (value) => {
      setQuery(value);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    query,
    results,
    loading,
    searching,
    error,
    debouncedSearch,
    clearSearch,
    setQuery,
  };
};

export default useSearch;
