const STORAGE_KEY = 'quran_tasbih_history';

export const getTasbihHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveTasbihHistory = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getTodayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const getTodayTasbih = () => {
  const history = getTasbihHistory();
  const key = getTodayKey();
  return history[key] || [];
};

export const addTasbih = (label) => {
  const history = getTasbihHistory();
  const key = getTodayKey();
  const list = history[key] || [];
  const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
  list.push({ id, label, count: 0, target: 100 });
  history[key] = list;
  saveTasbihHistory(history);
  return list;
};

export const incrementTasbih = (id) => {
  const history = getTasbihHistory();
  const key = getTodayKey();
  const list = history[key] || [];
  const item = list.find((t) => t.id === id);
  if (item) {
    item.count += 1;
    history[key] = list;
    saveTasbihHistory(history);
  }
  return list;
};

export const resetTasbih = (id) => {
  const history = getTasbihHistory();
  const key = getTodayKey();
  const list = history[key] || [];
  const item = list.find((t) => t.id === id);
  if (item) {
    item.count = 0;
    history[key] = list;
    saveTasbihHistory(history);
  }
  return list;
};

export const deleteTasbih = (id) => {
  const history = getTasbihHistory();
  const key = getTodayKey();
  const list = (history[key] || []).filter((t) => t.id !== id);
  history[key] = list;
  saveTasbihHistory(history);
  return list;
};
