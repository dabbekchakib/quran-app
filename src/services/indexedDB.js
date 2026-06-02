const DB_NAME = 'quran-offline';
const DB_VERSION = 2;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('audio')) {
        const audioStore = db.createObjectStore('audio', { keyPath: 'id' });
        audioStore.createIndex('surah', 'surah', { unique: false });
        audioStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains('quran')) {
        const quranStore = db.createObjectStore('quran', { keyPath: 'id' });
        quranStore.createIndex('surah', 'surah', { unique: true });
      }

      if (!db.objectStoreNames.contains('search')) {
        const searchStore = db.createObjectStore('search', { keyPath: 'query' });
        searchStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const closeDB = (db) => {
  try { db.close(); } catch { /* ignore */ }
};

export const saveAudioToDB = async (surahNumber, blob) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio', 'readwrite');
    const store = tx.objectStore('audio');
    store.put({
      id: `surah-${surahNumber}`,
      surah: surahNumber,
      data: blob,
      status: 'downloaded',
      timestamp: Date.now(),
    });
    tx.oncomplete = () => { closeDB(db); resolve(); };
    tx.onerror = () => { closeDB(db); reject(tx.error); };
  });
};

export const getAudioFromDB = async (surahNumber) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio', 'readonly');
    const store = tx.objectStore('audio');
    const request = store.get(`surah-${surahNumber}`);
    request.onsuccess = () => { closeDB(db); resolve(request.result?.data || null); };
    request.onerror = () => { closeDB(db); reject(request.error); };
  });
};

export const getAudioStatus = async (surahNumber) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio', 'readonly');
    const store = tx.objectStore('audio');
    const request = store.get(`surah-${surahNumber}`);
    request.onsuccess = () => {
      closeDB(db);
      if (!request.result) { resolve('none'); return; }
      resolve(request.result.status || 'none');
    };
    request.onerror = () => { closeDB(db); reject(request.error); };
  });
};

export const deleteAudioFromDB = async (surahNumber) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio', 'readwrite');
    const store = tx.objectStore('audio');
    store.delete(`surah-${surahNumber}`);
    tx.oncomplete = () => { closeDB(db); resolve(); };
    tx.onerror = () => { closeDB(db); reject(tx.error); };
  });
};

export const getAllDownloadedSurahs = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('audio', 'readonly');
    const store = tx.objectStore('audio');
    const request = store.getAll();
    request.onsuccess = () => {
      closeDB(db);
      const items = request.result || [];
      resolve(items.map((item) => ({
        surah: item.surah,
        status: item.status || 'unknown',
        timestamp: item.timestamp || 0,
        size: item.data?.size || 0,
      })));
    };
    request.onerror = () => { closeDB(db); reject(request.error); };
  });
};

export const saveQuranData = async (surahNumber, data) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('quran', 'readwrite');
    const store = tx.objectStore('quran');
    store.put({ id: `surah-${surahNumber}`, surah: surahNumber, data, timestamp: Date.now() });
    tx.oncomplete = () => { closeDB(db); resolve(); };
    tx.onerror = () => { closeDB(db); reject(tx.error); };
  });
};

export const getQuranData = async (surahNumber) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('quran', 'readonly');
    const store = tx.objectStore('quran');
    const request = store.get(`surah-${surahNumber}`);
    request.onsuccess = () => { closeDB(db); resolve(request.result?.data || null); };
    request.onerror = () => { closeDB(db); reject(request.error); };
  });
};

export const saveSearchResult = async (query, results) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('search', 'readwrite');
    const store = tx.objectStore('search');
    store.put({ query: query.toLowerCase(), results, timestamp: Date.now() });
    tx.oncomplete = () => { closeDB(db); resolve(); };
    tx.onerror = () => { closeDB(db); reject(tx.error); };
  });
};

export const getSearchResult = async (query) => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('search', 'readonly');
    const store = tx.objectStore('search');
    const request = store.get(query.toLowerCase());
    request.onsuccess = () => {
      closeDB(db);
      const result = request.result;
      if (result && Date.now() - result.timestamp < 1000 * 60 * 60) {
        resolve(result.results);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => { closeDB(db); reject(request.error); };
  });
};

export const clearExpiredSearchCache = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('search', 'readwrite');
    const store = tx.objectStore('search');
    const index = store.index('timestamp');
    const range = IDBKeyRange.upperBound(Date.now() - 1000 * 60 * 60);
    const request = index.openCursor(range);
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        closeDB(db);
        resolve();
      }
    };
    request.onerror = () => { closeDB(db); reject(request.error); };
  });
};

export const getStorageInfo = async () => {
  const db = await openDB();
  const tx = db.transaction('audio', 'readonly');
  const store = tx.objectStore('audio');
  const request = store.getAll();
  return new Promise((resolve) => {
    request.onsuccess = () => {
      closeDB(db);
      const items = request.result || [];
      const totalSize = items.reduce((sum, item) => sum + (item.data?.size || 0), 0);
      resolve({ count: items.length, totalSize });
    };
    request.onerror = () => { closeDB(db); resolve({ count: 0, totalSize: 0 }); };
  });
};
