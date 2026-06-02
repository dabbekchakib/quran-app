import { createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { DEFAULT_SETTINGS } from '../utils/constants';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage('quran_settings', DEFAULT_SETTINGS);

  const theme = settings.theme || 'dark';

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, [setSettings]);

  const updateFont = useCallback(
    (font) => {
      setSettings((prev) => ({ ...prev, font }));
    },
    [setSettings]
  );

  const updateFontSize = useCallback(
    (fontSize) => {
      setSettings((prev) => ({ ...prev, fontSize }));
    },
    [setSettings]
  );

  const value = useMemo(
    () => ({
      theme,
      settings,
      toggleTheme,
      updateFont,
      updateFontSize,
    }),
    [theme, settings, toggleTheme, updateFont, updateFontSize]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
