import { FaQuran, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="bg-slate-900/50 backdrop-blur-sm border-t border-teal-500/10 py-8 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-teal-400">
            <FaQuran className="text-2xl" />
            <span className="font-[Amiri] text-lg font-bold">القرآن الكريم</span>
          </div>
          <p className="text-slate-400 text-sm text-center">
            وَإِنَّهُ لَكِتَابٌ عَزِيزٌ * لا يَأْتِيهِ الْبَاطِلُ مِنْ بَيْنِ يَدَيْهِ وَلا مِنْ خَلْفِهِ
          </p>
          <p className="text-slate-500 text-xs flex items-center gap-1">
            صُنع بـ <FaHeart className="text-red-400 text-xs" /> للقرآن الكريم
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
