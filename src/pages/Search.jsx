import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import SearchInput from '../components/SearchInput';
import SearchResults from '../components/SearchResults';
import useSearch from '../hooks/useSearch';

const Search = () => {
  const { query, results, loading, searching, debouncedSearch } = useSearch();

  useEffect(() => {
    document.title = 'بحث - القرآن الكريم';
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 mb-6">
          <FaSearch className="text-3xl text-teal-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 font-[Amiri] mb-3">
          بحث في القرآن
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          ابحث في القرآن الكريم بالكلمات العربية أو اسم السورة أو رقمها
        </p>
      </div>

      <div className="mb-8">
        <SearchInput onSearch={debouncedSearch} placeholder="ابحث في القرآن الكريم..." />
      </div>

      <SearchResults results={results} query={query} searching={searching || loading} />
    </div>
  );
};

export default Search;
