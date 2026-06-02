import { createContext, useContext, useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { fetchAllSurahs, fetchSurahAudio, getFullSurahAudioUrl } from '../api/quranApi';

const REPEAT_MODES = {
  NORMAL: 'normal',
  REPEAT_AYAH: 'repeat-ayah',
  REPEAT_SURAH: 'repeat-surah',
  REPEAT_ALL: 'repeat-all',
};

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const advanceToNextRef = useRef(null);
  const [surahList, setSurahList] = useState(() => {
    try {
      const cached = localStorage.getItem('quran_surahs_cache');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [surahData, setSurahData] = useState({});
  const [currentSurahIndex, setCurrentSurahIndex] = useState(-1);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState(REPEAT_MODES.NORMAL);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playbackMode, setPlaybackModeState] = useState(() => {
    try {
      return localStorage.getItem('quran_playback_mode') || 'verse';
    } catch {
      return 'verse';
    }
  });

  const setPlaybackMode = useCallback((mode) => {
    setPlaybackModeState(mode);
    try { localStorage.setItem('quran_playback_mode', mode); } catch { /* ignore */ }
  }, []);

  const isTransitioningRef = useRef(false);

  useEffect(() => {
    if (surahList.length === 0) {
      fetchAllSurahs().then((data) => {
        setSurahList(data);
        try { localStorage.setItem('quran_surahs_cache', JSON.stringify(data)); } catch { /* ignore */ }
      }).catch(() => { /* ignore */ });
    }
  }, [surahList.length]);

  const currentSurah = currentSurahIndex >= 0 && currentSurahIndex < surahList.length ? surahList[currentSurahIndex] : null;
  const currentAyahs = currentSurah ? surahData[currentSurah.number] : null;
  const currentAyah = currentAyahs ? currentAyahs[currentAyahIndex] : null;
  const currentAudioUrl = playbackMode === 'surah' && currentSurah
    ? getFullSurahAudioUrl(currentSurah.number)
    : currentAyah?.audio || null;

  const loadSurahAyahs = useCallback(async (surahNumber) => {
    if (surahData[surahNumber]) return surahData[surahNumber];
    try {
      const data = await fetchSurahAudio(surahNumber);
      const ayahs = data.ayahs || [];
      setSurahData((prev) => ({ ...prev, [surahNumber]: ayahs }));
      return ayahs;
    } catch {
      return [];
    }
  }, [surahData]);

  const advanceToNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (playbackMode === 'surah') {
      if (repeatMode === REPEAT_MODES.REPEAT_SURAH || repeatMode === REPEAT_MODES.REPEAT_AYAH) {
        setCurrentTime(0);
        setDuration(0);
        isTransitioningRef.current = false;
        return;
      }
      if (currentSurahIndex < surahList.length - 1) {
        const nextIdx = currentSurahIndex + 1;
        setCurrentSurahIndex(nextIdx);
        setCurrentAyahIndex(0);
        setCurrentTime(0);
        setDuration(0);
        loadSurahAyahs(surahList[nextIdx].number).then(() => {
          isTransitioningRef.current = false;
        });
      } else if (repeatMode === REPEAT_MODES.REPEAT_ALL) {
        setCurrentSurahIndex(0);
        setCurrentAyahIndex(0);
        loadSurahAyahs(surahList[0]?.number).then(() => {
          isTransitioningRef.current = false;
        });
      } else {
        setIsPlaying(false);
        setCurrentSurahIndex(-1);
        setCurrentAyahIndex(0);
        isTransitioningRef.current = false;
      }
      return;
    }

    const currentAyahsForAdvance = surahData[currentSurah?.number] || currentAyahs;
    if (currentAyahsForAdvance && currentAyahIndex < currentAyahsForAdvance.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
      isTransitioningRef.current = false;
      return;
    }

    if (repeatMode === REPEAT_MODES.REPEAT_SURAH) {
      setCurrentAyahIndex(0);
      isTransitioningRef.current = false;
      return;
    }

    if (currentSurahIndex < surahList.length - 1) {
      const nextIdx = currentSurahIndex + 1;
      const nextSurahItem = surahList[nextIdx];
      setCurrentSurahIndex(nextIdx);
      setCurrentAyahIndex(0);
      setCurrentTime(0);
      setDuration(0);
      loadSurahAyahs(nextSurahItem.number).then(() => {
        isTransitioningRef.current = false;
      });
    } else if (repeatMode === REPEAT_MODES.REPEAT_ALL) {
      setCurrentSurahIndex(0);
      setCurrentAyahIndex(0);
      loadSurahAyahs(surahList[0]?.number).then(() => {
        isTransitioningRef.current = false;
      });
    } else {
      setIsPlaying(false);
      setCurrentSurahIndex(-1);
      setCurrentAyahIndex(0);
      isTransitioningRef.current = false;
    }
  }, [currentAyahs, currentAyahIndex, currentSurahIndex, currentSurah, surahList, repeatMode, loadSurahAyahs, surahData, playbackMode]);

  useEffect(() => {
    advanceToNextRef.current = advanceToNext;
  }, [advanceToNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (!currentAudioUrl) return;

    const audio = new Audio(currentAudioUrl);
    audioRef.current = audio;
    audio.volume = isMuted ? 0 : volume;

    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));

    audio.addEventListener('ended', () => {
      if (repeatMode === REPEAT_MODES.REPEAT_AYAH) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      if (repeatMode === REPEAT_MODES.REPEAT_SURAH && currentAyahIndex >= (currentAyahs?.length || 1) - 1) {
        setCurrentAyahIndex(0);
        return;
      }
      advanceToNextRef.current?.();
    });

    audio.addEventListener('error', () => {
      if (isPlaying) {
        advanceToNextRef.current?.();
      }
    });

    if (isPlaying) {
      audio.play().catch(() => {});
    }

    const preloadTimer = setTimeout(() => {
      if (playbackMode !== 'surah' && currentAyahs && currentAyahIndex < currentAyahs.length - 1) {
        const nextUrl = currentAyahs[currentAyahIndex + 1]?.audio;
        if (nextUrl) {
          const pre = new Audio(nextUrl);
          pre.preload = 'auto';
          pre.load();
        }
      }
    }, 500);

    return () => {
      clearTimeout(preloadTimer);
      audio.pause();
      audio.src = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudioUrl, currentSurahIndex, currentAyahIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const playSurah = useCallback(async (surahNumber, startAyahIndex = 0) => {
    setLoading(true);
    const idx = surahList.findIndex((s) => s.number === surahNumber);
    if (idx === -1) { setLoading(false); return; }

    if (!surahData[surahNumber]) {
      try {
        const ayahs = await loadSurahAyahs(surahNumber);
        if (!ayahs || ayahs.length === 0) { setLoading(false); return; }
      } catch {
        setLoading(false);
        return;
      }
    }

    setCurrentSurahIndex(idx);
    setCurrentAyahIndex(startAyahIndex);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
    setLoading(false);
  }, [surahList, surahData, loadSurahAyahs]);

  const togglePlay = useCallback(() => {
    if (currentSurahIndex === -1) return;
    setIsPlaying((prev) => !prev);
  }, [currentSurahIndex]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentSurahIndex(-1);
    setCurrentAyahIndex(0);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const nextAyah = useCallback(() => {
    if (playbackMode === 'surah' || !currentAyahs) return;
    if (currentAyahIndex < currentAyahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playbackMode, currentAyahs, currentAyahIndex]);

  const prevAyah = useCallback(() => {
    if (playbackMode === 'surah') return;
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex((prev) => prev - 1);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [playbackMode, currentAyahIndex]);

  const nextSurah = useCallback(() => {
    if (currentSurahIndex < surahList.length - 1) {
      const nextIdx = currentSurahIndex + 1;
      setCurrentSurahIndex(nextIdx);
      setCurrentAyahIndex(0);
      setCurrentTime(0);
      setDuration(0);
      loadSurahAyahs(surahList[nextIdx].number);
    }
  }, [currentSurahIndex, surahList, loadSurahAyahs]);

  const prevSurah = useCallback(() => {
    if (currentSurahIndex > 0) {
      const prevIdx = currentSurahIndex - 1;
      setCurrentSurahIndex(prevIdx);
      setCurrentAyahIndex(0);
      setCurrentTime(0);
      setDuration(0);
      loadSurahAyahs(surahList[prevIdx].number);
    }
  }, [currentSurahIndex, surahList, loadSurahAyahs]);

  const setVolume = useCallback((val) => {
    setVolumeState(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (val === 0) setIsMuted(true);
    else setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (audioRef.current) audioRef.current.muted = !prev;
      return !prev;
    });
  }, []);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setRepeat = useCallback((mode) => {
    setRepeatMode(mode);
  }, []);

  const value = useMemo(
    () => ({
      currentSurah,
      currentAyah,
      currentAyahIndex,
      currentAyahs,
      isPlaying,
      currentTime,
      duration,
      repeatMode,
      volume,
      isMuted,
      loading,
      surahList,
      REPEAT_MODES,
      playbackMode,
      playSurah,
      togglePlay,
      stop,
      nextAyah,
      prevAyah,
      nextSurah,
      prevSurah,
      setVolume,
      toggleMute,
      seek,
      setRepeat,
      setPlaybackMode,
    }),
    [
      currentSurah, currentAyah, currentAyahIndex, currentAyahs,
      isPlaying, currentTime, duration, repeatMode, volume, isMuted,
      loading, surahList, playSurah, togglePlay, stop, playbackMode,
      nextAyah, prevAyah, nextSurah, prevSurah,
      setVolume, toggleMute, seek, setRepeat, setPlaybackMode,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

export { REPEAT_MODES };
