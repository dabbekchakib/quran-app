import { useCallback } from 'react';
import { useAudio } from '../context/AudioContext';

const useAudioPlayer = () => {
  const {
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
  } = useAudio();

  const hasPrevAyah = currentAyahIndex > 0;
  const hasNextAyah = currentAyahs ? currentAyahIndex < currentAyahs.length - 1 : false;
  const hasPrevSurah = surahList.length > 0 && currentSurah
    ? surahList.findIndex((s) => s.number === currentSurah.number) > 0
    : false;
  const hasNextSurah = surahList.length > 0 && currentSurah
    ? surahList.findIndex((s) => s.number === currentSurah.number) < surahList.length - 1
    : false;

  const totalAyahs = currentAyahs?.length || 0;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const playFromAyah = useCallback(
    (surahNumber, ayahIndex = 0) => {
      playSurah(surahNumber, ayahIndex);
    },
    [playSurah]
  );

  return {
    currentSurah,
    currentAyah,
    currentAyahIndex,
    totalAyahs,
    isPlaying,
    currentTime,
    duration,
    progress,
    repeatMode,
    volume,
    isMuted,
    loading,
    hasPrevAyah,
    hasNextAyah,
    hasPrevSurah,
    hasNextSurah,
    REPEAT_MODES,
    playbackMode,
    playSurah,
    playFromAyah,
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
  };
};

export default useAudioPlayer;
