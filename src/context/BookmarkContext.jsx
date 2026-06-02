import { createContext, useContext, useMemo } from 'react';
import useBookmarks from '../hooks/useBookmarks';

const BookmarkContext = createContext(null);

export const BookmarkProvider = ({ children }) => {
  const bookmarkData = useBookmarks();

  const value = useMemo(() => bookmarkData, [bookmarkData]);

  return (
    <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};
