import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaQuran, FaArrowLeft } from 'react-icons/fa';

const highlightText = (text, query) => {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part) =>
    part.toLowerCase() === query.toLowerCase()
      ? `<mark class="bg-amber-500/30 text-amber-200 rounded px-0.5">${part}</mark>`
      : part
  ).join('');
};

const SearchResultItem = memo(({ result, query }) => {
  const highlighted = useMemo(() => highlightText(result.text, query), [result.text, query]);

  return (
    <Link
      to={`/surah/${result.surahNumber}#ayah-${result.ayahNumber}`}
      className="group block bg-slate-800/40 backdrop-blur-sm border border-teal-500/10 rounded-2xl p-5 hover:bg-slate-800/70 hover:border-teal-500/30 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/20 flex flex-col items-center justify-center">
          <span className="text-teal-400 font-bold text-sm">{result.ayahNumber}</span>
          <span className="text-slate-500 text-[9px]">آية</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FaQuran className="text-teal-500/60 text-xs" />
            <span className="text-sm text-teal-300 font-[Amiri]">
              {result.surahName || `سورة ${result.surahNumber}`}
            </span>
            <span className="text-slate-500 text-xs">({result.surahNumber})</span>
          </div>
          <p
            className="text-lg leading-[2] text-slate-100 font-[Amiri] text-right"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-center">
          <FaArrowLeft className="text-slate-400 -rotate-180" size={14} />
        </div>
      </div>
    </Link>
  );
});

SearchResultItem.displayName = 'SearchResultItem';

const SearchResults = ({ results, query, searching }) => {
  if (searching) {
    return (
      <div className="text-center py-16">
        <div className="w-10 h-10 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">جاري البحث...</p>
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="text-center py-16">
        <FaQuran className="text-5xl text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 text-sm">اكتب كلمة للبحث في القرآن الكريم</p>
        <p className="text-slate-600 text-xs mt-1">يمكنك البحث بالكلمات العربية أو اسم السورة أو رقمها</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <FaQuran className="text-5xl text-slate-700 mx-auto mb-4" />
        <p className="text-slate-400">لا توجد نتائج</p>
        <p className="text-slate-500 text-sm mt-1">لم يتم العثور على نتائج لـ "{query}"</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-400 text-xs mb-4 text-left">
        {results.length} نتيجة
      </p>
      <div className="space-y-3">
        {results.map((result, idx) => (
          <SearchResultItem key={`${result.surahNumber}-${result.ayahNumber}-${idx}`} result={result} query={query} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
