import { saveAudioToDB, deleteAudioFromDB } from './indexedDB';

const AUDIO_BASE_SURAH = 'https://cdn.islamic.network/quran/audio-surah/128';
const AUDIO_BASE_AYAH = 'https://cdn.islamic.network/quran/audio/128';

const createDownloadTask = (surahNumber, reciter = 'ar.alafasy') => {
  const url = `${AUDIO_BASE_SURAH}/${reciter}/${surahNumber}.mp3`;
  return { surah: surahNumber, url, fallbackUrl: `${AUDIO_BASE_AYAH}/${reciter}/${surahNumber}.mp3`, status: 'pending', progress: 0, loaded: 0, total: 0, controller: null, reciter };
};

class QuranDownloadManager {
  constructor() {
    this.tasks = new Map();
    this.listeners = new Map();
    this.activeCount = 0;
    this.maxConcurrent = 3;
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
    if (this.tasks.has(surahNumber)) {
      const existing = this.tasks.get(surahNumber);
      if (existing.status === 'downloading') return;
      if (existing.status === 'paused') {
        this.resumeDownload(surahNumber);
        return;
      }
    }

    const task = createDownloadTask(surahNumber, reciter);
    task.status = 'downloading';
    task.controller = new AbortController();
    this.tasks.set(surahNumber, task);
    this.activeCount++;

    this.notify(surahNumber, { status: 'downloading', progress: 0, loaded: 0, total: 0 });

    try {
      const response = await fetch(task.url, {
        signal: task.controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      await this.processResponse(response, task, surahNumber);
    } catch (err) {
      if (err.name !== 'AbortError') {
        await this.tryFallback(task, surahNumber);
      } else {
        this.handleError(task, surahNumber, err);
      }
    }

    if (this.activeCount < 0) this.activeCount = 0;
  }

  async tryFallback(task, surahNumber) {
    try {
      task.controller = new AbortController();
      this.notify(surahNumber, { status: 'downloading', progress: 0, loaded: 0, total: 0, fallback: true });

      const response = await fetch(task.fallbackUrl, {
        signal: task.controller.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      await this.processResponse(response, task, surahNumber);
    } catch (err) {
      this.handleError(task, surahNumber, err);
    }
  }

  async processResponse(response, task, surahNumber) {
    const contentLength = response.headers.get('content-length');
    task.total = contentLength ? parseInt(contentLength, 10) : 0;

    const reader = response.body.getReader();
    const chunks = [];
    let loaded = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      loaded += value.length;
      task.loaded = loaded;
      task.progress = task.total ? Math.round((loaded / task.total) * 100) : 0;

      this.notify(surahNumber, {
        status: 'downloading',
        progress: task.progress,
        loaded,
        total: task.total,
      });
    }

    const blob = new Blob(chunks, { type: 'audio/mpeg' });
    await saveAudioToDB(surahNumber, blob);

    task.status = 'completed';
    task.progress = 100;
    this.activeCount--;

    this.notify(surahNumber, {
      status: 'completed',
      progress: 100,
      loaded: blob.size,
      total: blob.size,
    });
  }

  handleError(task, surahNumber, err) {
    this.activeCount--;
    if (err.name === 'AbortError') {
      task.status = 'cancelled';
      this.notify(surahNumber, { status: 'cancelled', progress: 0 });
    } else if (err.message?.includes('network') || err.message?.includes('CORS') || err instanceof TypeError) {
      task.status = 'error-cors';
      this.notify(surahNumber, { status: 'error-cors', progress: 0, error: 'CDN does not support direct download. Use browser Save As or a CORS proxy.' });
    } else {
      task.status = 'error';
      this.notify(surahNumber, { status: 'error', progress: 0, error: err.message });
    }
  }

  pauseDownload(surahNumber) {
    const task = this.tasks.get(surahNumber);
    if (!task || task.status !== 'downloading') return;
    task.controller.abort();
    task.status = 'paused';
    this.activeCount--;
    if (this.activeCount < 0) this.activeCount = 0;
    this.notify(surahNumber, { status: 'paused', progress: task.progress });
  }

  resumeDownload(surahNumber) {
    const task = this.tasks.get(surahNumber);
    if (!task || task.status !== 'paused') return;
    this.tasks.delete(surahNumber);
    this.startDownload(task.surah, task.reciter);
  }

  cancelDownload(surahNumber) {
    const task = this.tasks.get(surahNumber);
    if (!task) return;
    if (task.controller) {
      task.controller.abort();
    }
    task.status = 'cancelled';
    this.activeCount--;
    if (this.activeCount < 0) this.activeCount = 0;
    this.tasks.delete(surahNumber);
    this.notify(surahNumber, { status: 'cancelled', progress: 0 });
  }

  async deleteDownload(surahNumber) {
    const task = this.tasks.get(surahNumber);
    if (task && (task.status === 'downloading' || task.status === 'paused')) {
      this.cancelDownload(surahNumber);
    }
    this.tasks.delete(surahNumber);
    await deleteAudioFromDB(surahNumber);
    this.notify(surahNumber, { status: 'none', progress: 0 });
  }

  getStatus(surahNumber) {
    const task = this.tasks.get(surahNumber);
    if (!task) return { status: 'none', progress: 0 };
    return { status: task.status, progress: task.progress };
  }

  async startBatchDownload(surahNumbers, reciter = 'ar.alafasy') {
    const queue = [...surahNumbers];
    const results = [];

    const runNext = async () => {
      while (queue.length > 0) {
        const sn = queue.shift();
        try {
          await this.startDownload(sn, reciter);
          results.push({ surah: sn, success: true });
        } catch {
          results.push({ surah: sn, success: false });
        }
      }
    };

    const workers = Array.from({ length: Math.min(this.maxConcurrent, queue.length) }, () => runNext());
    await Promise.all(workers);
    return results;
  }
}

export const quranDownloadManager = new QuranDownloadManager();
