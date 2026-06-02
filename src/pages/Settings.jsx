import { useEffect, useState } from 'react';
import { FaCog, FaSun, FaMoon, FaFont, FaDownload } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { FONT_OPTIONS, FONT_SIZE_OPTIONS } from '../utils/constants';
import { quranDownloadManager } from '../services/downloadManager';

const Settings = () => {
  const { theme, settings, toggleTheme, updateFont, updateFontSize } = useTheme();
  const [storageInfo, setStorageInfo] = useState({ count: 0, totalSize: 0 });

  useEffect(() => {
    document.title = 'الإعدادات - القرآن الكريم';
    quranDownloadManager.getStorageInfo().then(setStorageInfo).catch(() => {});
  }, []);

  const totalMB = (storageInfo.totalSize / (1024 * 1024)).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaCog className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          الإعدادات
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          خصص تجربة القراءة الخاصة بك
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-3">
            {theme === 'dark' ? <FaMoon className="text-teal-400" /> : <FaSun className="text-amber-400" />}
            المظهر
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-sm">
              {theme === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'}
            </span>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                theme === 'dark' ? 'bg-teal-600' : 'bg-slate-600'
              }`}
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label="تبديل المظهر"
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                  theme === 'dark' ? 'right-[30px]' : 'right-[2px]'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-3">
            <FaFont className="text-teal-400" />
            خط الآيات
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => updateFont(font.value)}
                className={`px-4 py-3 rounded-xl text-sm border transition-all duration-200 ${
                  settings.font === font.value
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/30'
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-3">
            <FaFont className="text-teal-400" />
            حجم الخط
          </h2>
          <div className="flex flex-wrap gap-2">
            {FONT_SIZE_OPTIONS.map((size) => (
              <button
                key={size.value}
                onClick={() => updateFontSize(size.value)}
                className={`px-5 py-3 rounded-xl border transition-all duration-200 ${
                  settings.fontSize === size.value
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : 'bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/30'
                }`}
              >
                <span className={size.value}>{size.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-3">
            <FaDownload className="text-teal-400" />
            التخزين المحلي
          </h2>
          <div className="space-y-2 text-sm text-slate-400">
            <div className="flex items-center justify-between">
              <span>السور المحملة</span>
              <span className="text-slate-200">{storageInfo.count} سورة</span>
            </div>
            <div className="flex items-center justify-between">
              <span>حجم التخزين</span>
              <span className="text-slate-200">{totalMB} MB</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">عن التطبيق</h2>
          <div className="space-y-2 text-sm text-slate-400">
            <p>القرآن الكريم - تطبيق لقراءة واستماع القرآن الكريم</p>
            <p>الإصدار 2.0.0</p>
            <p>مصدر البيانات: api.alquran.cloud</p>
            <p>يدعم التثبيت كتطبيق (PWA)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
