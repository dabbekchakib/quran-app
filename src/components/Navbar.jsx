import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaBookmark, FaCog, FaList, FaSearch, FaDownload, FaStickyNote, FaSun, FaMoon } from 'react-icons/fa';
import { LuBookMarked } from 'react-icons/lu';
import { useTheme } from '../context/ThemeContext';
import quranLogo from '../assets/quranLogo.png';

const navItems = [
  { path: '/', label: 'السور', icon: FaList },
  { path: '/search', label: 'بحث', icon: FaSearch },
  { path: '/juz', label: 'الأجزاء', icon: () => <img src={quranLogo} alt="" className="w-4 h-4" /> },
  { path: '/hizb', label: 'الأحزاب', icon: LuBookMarked },
  { path: '/bookmarks', label: 'المحفوظات', icon: FaBookmark },
  { path: '/notes', label: 'الملحوظات', icon: FaStickyNote },
  { path: '/downloads', label: 'التحميل', icon: FaDownload },
  { path: '/settings', label: 'الإعدادات', icon: FaCog },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 right-0 left-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-teal-500/10"
      role="navigation"
      aria-label="القائمة الرئيسية"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors"
            aria-label="الصفحة الرئيسية"
          >
            <img src={quranLogo} alt="القرآن الكريم" className="w-8 h-8" />
            <span className="text-xl font-bold font-[Amiri] hidden sm:block">
              القرآن الكريم
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300 shadow-lg shadow-teal-500/10'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-teal-300'
                  }`
                }
                end={path === '/'}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-teal-300 transition-colors"
              aria-label={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
              title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-teal-300 transition-colors"
              aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-teal-500/10 bg-slate-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={() => { toggleTheme(); setIsOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-teal-300 transition-all duration-200"
            >
              {theme === 'dark' ? <FaSun size={18} /> : <FaMoon size={18} />}
              <span>{theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            </button>

            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-500/20 text-teal-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-teal-300'
                  }`
                }
                end={path === '/'}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
