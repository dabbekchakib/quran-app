import { memo } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-800/50 border border-teal-500/20 hover:bg-slate-700/50 hover:border-teal-500/40 transition-all duration-200 text-slate-300 hover:text-amber-400"
      aria-label={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
      title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
    >
      {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
