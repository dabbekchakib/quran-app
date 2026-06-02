import { useState, useRef, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchInput = ({ onSearch, initialValue = '', placeholder = 'ابحث في القرآن الكريم...' }) => {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      setValue(v);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch?.(v);
      }, 300);
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setValue('');
    clearTimeout(timerRef.current);
    onSearch?.('');
  }, [onSearch]);

  return (
    <div className="relative w-full">
      <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-slate-800/50 border border-teal-500/20 rounded-xl py-4 pr-12 pl-12 text-slate-200 text-base placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
        aria-label={placeholder}
        autoFocus
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
          aria-label="مسح البحث"
        >
          <FaTimes size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
