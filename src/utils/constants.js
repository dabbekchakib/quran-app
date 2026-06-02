export const SURAH_COUNT = 114;
export const JUZ_COUNT = 30;
export const HIZB_COUNT = 60;

export const FONT_OPTIONS = [
  { name: 'Amiri', value: 'Amiri, serif' },
  { name: 'Scheherazade New', value: '"Scheherazade New", serif' },
  { name: 'Noto Naskh Arabic', value: '"Noto Naskh Arabic", serif' },
  { name: 'Lateef', value: 'Lateef, serif' },
  { name: 'Reem Kufi', value: '"Reem Kufi", sans-serif' },
  { name: 'Uthmanic Hafs', value: '"Traditional Arabic", "Simplified Arabic", serif' },
];

export const FONT_SIZE_OPTIONS = [
  { name: 'صغير', value: 'text-lg' },
  { name: 'متوسط', value: 'text-xl' },
  { name: 'كبير', value: 'text-2xl' },
  { name: 'كبير جداً', value: 'text-3xl' },
  { name: 'ضخم', value: 'text-4xl' },
];

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  font: FONT_OPTIONS[0].value,
  fontSize: FONT_SIZE_OPTIONS[1].value,
};

export const RECITATION_OPTIONS = [
  { name: 'عبد الباسط عبد الصمد', value: 'ar.abdulbasit' },
  { name: 'مشاري العفاسي', value: 'ar.afasy' },
  { name: 'محمد صديق المنشاوي', value: 'ar.alafasy' },
  { name: 'سعد الغامدي', value: 'ar.saad' },
  { name: 'ماهر المعيقلي', value: 'ar.maher' },
];
