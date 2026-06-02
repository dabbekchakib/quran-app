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

//const AUDIO_BASE = 'https://cdn.islamic.network/quran/audio-surah/128';
const AUDIO_BASE = 'https://khorasan.mamluk.net/public.php/dav/files/Y7cWxynjJ7EaP8t/audio-surah/128';
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

export const fetchFullHizb = async (hizbNumber, edition = 'quran-uthmani') => {
  const start = (hizbNumber - 1) * 4 + 1;
  const quarterNumbers = [start, start + 1, start + 2, start + 3];
  const responses = await Promise.all(
    quarterNumbers.map((quarter) =>
      api.get(`/hizbQuarter/${quarter}/${edition}`)
    )
  );
  const ayahs = responses.flatMap((res) => res.data.data.ayahs);
  return { hizbNumber, ayahs };
};
