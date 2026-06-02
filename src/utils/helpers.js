export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getLocalStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    //
  }
};

export const removeLocalStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    //
  }
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const translateRevelationType = (type) => {
  return type === 'Meccan' ? 'مكية' : 'مدنية';
};

export const getSurahNumberFromJuz = (juzNumber) => {
  const juzSurahMap = {
    1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9,
    11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23,
    19: 25, 20: 27, 21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46,
    27: 51, 28: 58, 29: 67, 30: 78,
  };
  return juzSurahMap[juzNumber] || 1;
};

export const getSurahNumberFromHizb = (hizbNumber) => {
  const juzNumber = Math.ceil(hizbNumber / 2);
  return getSurahNumberFromJuz(juzNumber);
};

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
