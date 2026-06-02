import { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { translateRevelationType } from '../utils/helpers';

const SurahCard = memo(({ surah }) => {
  if (!surah) return null;

  return (
    <Link
      to={`/surah/${surah.number}`}
      className="group block bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 hover:-translate-y-0.5"
      aria-label={`سورة ${surah.name} - ${surah.number}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm group-hover:from-teal-500/30 group-hover:to-emerald-500/30 transition-all duration-300">
          {surah.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-100 font-[Amiri] leading-relaxed">
              {surah.name}
            </h3>
            <FaArrowLeft className="text-slate-500 group-hover:text-teal-400 transition-colors duration-300 text-xs -rotate-180" />
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-slate-400 text-xs">{surah.englishName}</span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-teal-500/70 text-xs">
              {translateRevelationType(surah.revelationType)}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-slate-500 text-xs">{surah.numberOfAyahs} آية</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

SurahCard.displayName = 'SurahCard';

export default SurahCard;
