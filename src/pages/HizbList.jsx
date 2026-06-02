import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LuBookMarked } from 'react-icons/lu';
import { HIZB_COUNT } from '../utils/constants';
import { getSurahNumberFromHizb } from '../utils/helpers';

const HizbList = () => {
  useEffect(() => {
    document.title = 'الأحزاب - القرآن الكريم';
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <LuBookMarked className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          الأحزاب
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {HIZB_COUNT} حزب في القرآن الكريم
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {Array.from({ length: HIZB_COUNT }, (_, i) => i + 1).map((hizbNumber) => (
          <Link
            key={hizbNumber}
            to={`/surah/${getSurahNumberFromHizb(hizbNumber)}`}
            className="group block bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-xl p-4 text-center hover:bg-slate-800/70 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/15 to-emerald-500/15 border border-teal-500/20 flex flex-col items-center justify-center mx-auto mb-2">
              <span className="text-teal-400 font-bold text-base">{hizbNumber}</span>
            </div>
            <span className="text-slate-500 text-xs">الحزب</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HizbList;
