import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaQuran, FaHome } from 'react-icons/fa';

const NotFound = () => {
  useEffect(() => {
    document.title = 'الصفحة غير موجودة - القرآن الكريم';
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 mb-8">
        <FaQuran className="text-5xl text-teal-500/40" />
      </div>
      <h1 className="text-6xl font-bold text-slate-100 mb-4">404</h1>
      <p className="text-xl text-slate-300 mb-2 font-[Amiri]">الصفحة غير موجودة</p>
      <p className="text-slate-500 text-sm mb-8">
        عذراً، الصفحة التي تبحث عنها غير متوفرة
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-all duration-200 text-sm hover:shadow-lg hover:shadow-teal-500/20"
      >
        <FaHome />
        <span>العودة إلى الرئيسية</span>
      </Link>
    </div>
  );
};

export default NotFound;
