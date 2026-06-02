import { memo, useCallback } from 'react';
import { FaCopy } from 'react-icons/fa';
import BookmarkButton from './BookmarkButton';

const AyahCard = memo(({ ayah, surahNumber, ayahFont, fontSizeClass, onCopy }) => {
  const handleCopy = useCallback(() => {
    onCopy?.(ayah.text);
  }, [ayah.text, onCopy]);

  return (
    <div
      className="group bg-slate-800/30 backdrop-blur-sm border border-teal-500/5 rounded-2xl p-6 hover:bg-slate-800/50 hover:border-teal-500/20 transition-all duration-300"
      id={`ayah-${ayah.numberInSurah}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-xs">
            {ayah.numberInSurah}
          </span>
          <span className="text-slate-500 text-xs">آية</span>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-700/50 transition-all duration-200"
            aria-label="نسخ الآية"
            title="نسخ"
          >
            <FaCopy size={14} />
          </button>
          <BookmarkButton surah={surahNumber} ayah={ayah.numberInSurah} text={ayah.text} />
        </div>
      </div>

      <p
        className={`${fontSizeClass || 'text-2xl'} leading-[2.2] text-slate-100 text-right font-[Amiri] tracking-wide`}
        style={{ fontFamily: ayahFont || 'Amiri, serif' }}
        dir="rtl"
        lang="ar"
      >
        {ayah.text}
      </p>
    </div>
  );
});

AyahCard.displayName = 'AyahCard';

export default AyahCard;
