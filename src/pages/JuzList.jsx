import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaQuran } from 'react-icons/fa';
import { JUZ_COUNT } from '../utils/constants';
import { getSurahNumberFromJuz } from '../utils/helpers';

const juzNames = [
  'الم', 'سيقول', 'تلك الرسل', 'لن تنالوا', 'والمحصنات', 'لا يحب الله',
  'وإذا سمعوا', 'ولو أننا', 'قال الملأ', 'واعلموا', 'يعتذرون', 'ومامن دابة',
  'وما أبرئ', 'ربما', 'سبحان', 'قال ألم', 'اقترب', 'قد أفلح',
  'وقال الذين', 'أمن خلق', 'اتل ما أوحي', 'ومن يقنت', 'ومالي', 'فمن أظلم',
  'إليه يرد', 'حم', 'قال فما خطبكم', 'قد سمع الله', 'تبارك', 'عم',
];

const JuzList = () => {
  useEffect(() => {
    document.title = 'الأجزاء - القرآن الكريم';
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaQuran className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          الأجزاء
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          {JUZ_COUNT} جزء في القرآن الكريم
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: JUZ_COUNT }, (_, i) => i + 1).map((juzNumber) => (
          <Link
            key={juzNumber}
            to={`/surah/${getSurahNumberFromJuz(juzNumber)}`}
            className="group block bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500/15 to-emerald-500/15 border border-teal-500/20 flex flex-col items-center justify-center">
                <span className="text-teal-400 font-bold text-lg">{juzNumber}</span>
                <span className="text-slate-500 text-[10px]">جزء</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-[Amiri]">
                  {juzNames[juzNumber - 1] || `الجزء ${juzNumber}`}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">الجزء {juzNumber}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JuzList;
