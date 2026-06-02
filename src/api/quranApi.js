import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const fetchAllSurahs = async () => {
  const response = await api.get('/surah');
  return response.data.data;
};

export const fetchSurahById = async (id) => {
  const response = await api.get(`/surah/${id}`);
  return response.data.data;
};

const AUDIO_BASE = 'https://cdn.islamic.network/quran/audio-surah/128';

export const fetchSurahAudio = async (id) => {
  const response = await api.get(`/surah/${id}/ar.alafasy`);
  return response.data.data;
};

export const getFullSurahAudioUrl = (surahNumber, reciter = 'ar.alafasy') => {
  return `${AUDIO_BASE}/${reciter}/${surahNumber}.mp3`;
};

export const fetchJuzList = async () => {
  const response = await api.get('/juz');
  return response.data.data;
};

export const fetchJuzById = async (id) => {
  const response = await api.get(`/juz/${id}`);
  return response.data.data;
};

export const fetchHizbList = async () => {
  const response = await api.get('/hizb');
  return response.data.data;
};

export const fetchHizbById = async (id) => {
  const response = await api.get(`/hizb/${id}`);
  return response.data.data;
};

export const fetchSurahByAyah = async (surahNumber, ayahNumber) => {
  const response = await api.get(`/ayah/${surahNumber}:${ayahNumber}`);
  return response.data.data;
};

export const fetchFullQuran = async () => {
  const response = await api.get('/quran/quran-uthmani');
  return response.data.data;
};

export const searchQuran = async (query, language = 'ar') => {
  const response = await api.get(`/search/${encodeURIComponent(query)}/all/${language}`);
  return response.data.data;
};
