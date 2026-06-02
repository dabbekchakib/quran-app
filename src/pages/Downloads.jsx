import { useEffect, useState } from 'react';
import { FaDownload, FaCheck, FaSpinner } from 'react-icons/fa';
import { useQuran } from '../context/QuranContext';
import DownloadButton from '../components/DownloadButton';
import DownloadManager from '../components/DownloadManager';
import { quranDownloadManager } from '../services/downloadManager';

const Downloads = () => {
  const { surahs, loadSurahs } = useQuran();
  const [storageInfo, setStorageInfo] = useState({ count: 0, totalSize: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'التحميلات - القرآن الكريم';
    if (surahs.length === 0) {
      loadSurahs().catch(() => {});
    }
    quranDownloadManager.getStorageInfo().then((info) => {
      setStorageInfo(info);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [surahs.length, loadSurahs]);

  const totalMB = (storageInfo.totalSize / (1024 * 1024)).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaDownload className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          التحميلات
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {loading ? (
            <FaSpinner className="animate-spin inline" />
          ) : (
            `تم تحميل ${storageInfo.count} سورة (${totalMB} MB)`
          )}
        </p>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-3xl p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FaDownload className="text-teal-400" />
          <span>تحميل السور</span>
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          يمكنك تحميل السور للاستماع إليها بدون اتصال بالإنترنت
        </p>

        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {surahs.map((surah) => (
            <div
              key={surah.number}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 text-[10px] font-bold">
                  {surah.number}
                </span>
                <div>
                  <span className="text-sm text-slate-200 font-[Amiri]">{surah.name}</span>
                  <span className="text-slate-500 text-[10px] mr-2">{surah.englishName}</span>
                </div>
              </div>
              <DownloadButton surahNumber={surah.number} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-3xl p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <FaCheck className="text-emerald-400" />
          <span>السور المحملة</span>
        </h2>
        <DownloadManager surahList={surahs} />
      </div>
    </div>
  );
};

export default Downloads;
