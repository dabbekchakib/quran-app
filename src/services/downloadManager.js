const AUDIO_BASE = 'https://khorasan.mamluk.net/public.php/dav/files/Y7cWxynjJ7EaP8t/audio-surah/128';
const CACHE_NAME = 'quran-audio-cache';

const getAudioUrl = (surahNumber, reciter = 'ar.alafasy') => {
  return `${AUDIO_BASE}/${reciter}/${surahNumber}.mp3`;
};

class QuranDownloadManager {
  constructor() {
    this.listeners = new Map();
    this.activeDownloads = new Map();
  }

  on(surah, callback) {
    if (!this.listeners.has(surah)) {
      this.listeners.set(surah, []);
    }
    this.listeners.get(surah).push(callback);
    return () => {
      const arr = this.listeners.get(surah);
      if (arr) {
        const idx = arr.indexOf(callback);
        if (idx !== -1) arr.splice(idx, 1);
      }
    };
  }

  notify(surah, data) {
    const listeners = this.listeners.get(surah);
    if (listeners) {
      listeners.forEach((cb) => cb(data));
    }
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      globalListeners.forEach((cb) => cb({ surah, ...data }));
    }
  }

  async startDownload(surahNumber, reciter = 'ar.alafasy') {
    if (this.activeDownloads.has(surahNumber)) return;

    const url = getAudioUrl(surahNumber, reciter);
    this.activeDownloads.set(surahNumber, true);
    this.notify(surahNumber, { status: 'downloading', progress: 0 });

    try {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(url);
      if (cached) {
        this.activeDownloads.delete(surahNumber);
        this.notify(surahNumber, { status: 'completed', progress: 100 });
        return;
      }

      const response = await fetch(url, { mode: 'no-cors' });
      await cache.put(url, response);

      this.activeDownloads.delete(surahNumber);
      this.notify(surahNumber, { status: 'completed', progress: 100 });
    } catch (err) {
      this.activeDownloads.delete(surahNumber);
      this.notify(surahNumber, { status: 'error', progress: 0, error: err.message });
    }
  }

  async getStatus(surahNumber) {
    const url = getAudioUrl(surahNumber);
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);
    if (cached) return { status: 'completed', progress: 100 };
    if (this.activeDownloads.has(surahNumber)) return { status: 'downloading', progress: 0 };
    return { status: 'none', progress: 0 };
  }

  async deleteDownload(surahNumber) {
    const url = getAudioUrl(surahNumber);
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(url);
    this.activeDownloads.delete(surahNumber);
    this.notify(surahNumber, { status: 'none', progress: 0 });
  }

  async isDownloaded(surahNumber) {
    const url = getAudioUrl(surahNumber);
    const cache = await caches.open(CACHE_NAME);
    return !!(await cache.match(url));
  }

  async getAllDownloaded() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    const surahNumbers = [];
    for (const request of keys) {
      const match = request.url.match(/\/(\d+)\.mp3$/);
      if (match) surahNumbers.push(parseInt(match[1], 10));
    }
    return [...new Set(surahNumbers)].sort((a, b) => a - b);
  }

  async getStorageInfo() {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return { count: keys.length, totalSize: 0 };
  }
}

export const quranDownloadManager = new QuranDownloadManager();
