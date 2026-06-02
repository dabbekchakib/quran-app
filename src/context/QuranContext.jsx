import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { fetchAllSurahs, fetchSurahById } from '../api/quranApi';
import useLocalStorage from '../hooks/useLocalStorage';

const QuranContext = createContext(null);

export const QuranProvider = ({ children }) => {
  const [surahs, setSurahs] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRead, setLastRead] = useLocalStorage('quran_last_read', null);

  const loadSurahs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllSurahs();
      setSurahs(data);
      try {
        localStorage.setItem('quran_surahs_cache', JSON.stringify(data));
      } catch {
        //
      }
      return data;
    } catch (err) {
      setError(err.message || 'فشل في تحميل السور');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSurah = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSurahById(id);
      setCurrentSurah(data);
      return data;
    } catch (err) {
      setError(err.message || 'فشل في تحميل السورة');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLastRead = useCallback(
    (surah, ayah) => {
      const data = { surah, ayah, timestamp: Date.now() };
      setLastRead(data);
      try {
        localStorage.setItem('quran_last_read', JSON.stringify(data));
      } catch {
        //
      }
    },
    [setLastRead]
  );

  const value = useMemo(
    () => ({
      surahs,
      currentSurah,
      loading,
      error,
      lastRead,
      loadSurahs,
      loadSurah,
      updateLastRead,
      setCurrentSurah,
      setError,
    }),
    [surahs, currentSurah, loading, error, lastRead, loadSurahs, loadSurah, updateLastRead]
  );

  return <QuranContext.Provider value={value}>{children}</QuranContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useQuran = () => {
  const context = useContext(QuranContext);
  if (!context) {
    throw new Error('useQuran must be used within a QuranProvider');
  }
  return context;
};
