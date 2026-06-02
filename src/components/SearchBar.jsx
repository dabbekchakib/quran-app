import { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch, placeholder = 'ابحث عن سورة...' }) => {
  const [query, setQuery] = useState('');
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch?.(value);
    }, 300);
  };

  const handleClear = () => {
    setQuery('');
    clearTimeout(timerRef.current);
    onSearch?.('');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-slate-800/50 border border-teal-500/20 rounded-xl py-3.5 pr-12 pl-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 text-sm"
          aria-label={placeholder}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
            aria-label="مسح البحث"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
