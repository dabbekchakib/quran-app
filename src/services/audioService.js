const AUDIO_BASE = 'https://khorasan.mamluk.net/public.php/dav/files/Y7cWxynjJ7EaP8t/audio-surah/128';

let currentAudio = null;
let onEndedCallback = null;
let onTimeUpdateCallback = null;
let onLoadCallback = null;
let preloadQueue = [];

const getSurahUrl = (surahNumber, reciter = 'ar.alafasy') => {
  return `${AUDIO_BASE}/${reciter}/${surahNumber}.mp3`;
};

export const playSurah = (surahNumber, reciter = 'ar.alafasy') => {
  stop();
  const url = getSurahUrl(surahNumber, reciter);
  const audio = new Audio(url);
  audio.preload = 'auto';
  audio.crossOrigin = 'anonymous';

  audio.addEventListener('loadedmetadata', () => {
    onLoadCallback?.({ duration: audio.duration });
  });

  audio.addEventListener('timeupdate', () => {
    onTimeUpdateCallback?.({
      currentTime: audio.currentTime,
      duration: audio.duration || 0,
    });
  });

  audio.addEventListener('ended', () => {
    onEndedCallback?.();
  });

  audio.addEventListener('error', (e) => {
    console.warn('Audio playback error:', e);
  });

  currentAudio = audio;
  audio.play().catch(() => {});
  return audio;
};

export const pause = () => {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
  }
};

export const resume = () => {
  if (currentAudio && currentAudio.paused) {
    currentAudio.play().catch(() => {});
  }
};

export const stop = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
};

export const seek = (time) => {
  if (currentAudio) {
    currentAudio.currentTime = time;
  }
};

export const setVolume = (value) => {
  if (currentAudio) {
    currentAudio.volume = Math.max(0, Math.min(1, value));
  }
};

export const getCurrentTime = () => currentAudio?.currentTime || 0;
export const getDuration = () => currentAudio?.duration || 0;
export const isPlaying = () => currentAudio ? !currentAudio.paused : false;

export const setOnEnded = (fn) => { onEndedCallback = fn; };
export const setOnTimeUpdate = (fn) => { onTimeUpdateCallback = fn; };
export const setOnLoad = (fn) => { onLoadCallback = fn; };

export const loadNextAyah = (url) => {
  if (!url) return;
  const pre = new Audio(url);
  pre.preload = 'auto';
  preloadQueue.push(pre);
  if (preloadQueue.length > 3) {
    const old = preloadQueue.shift();
    old.src = '';
  }
};

export const preloadSurah = (surahNumber, reciter = 'ar.alafasy') => {
  const url = getSurahUrl(surahNumber, reciter);
  const pre = new Audio(url);
  pre.preload = 'auto';
  preloadQueue.push(pre);
  if (preloadQueue.length > 5) {
    const old = preloadQueue.shift();
    old.src = '';
  }
};

export const clearPreloadQueue = () => {
  preloadQueue.forEach((a) => { a.src = ''; });
  preloadQueue = [];
};

export const getAudioElement = () => currentAudio;

export default {
  playSurah,
  pause,
  resume,
  stop,
  seek,
  setVolume,
  getCurrentTime,
  getDuration,
  isPlaying,
  setOnEnded,
  setOnTimeUpdate,
  setOnLoad,
  loadNextAyah,
  preloadSurah,
  clearPreloadQueue,
  getAudioElement,
};
