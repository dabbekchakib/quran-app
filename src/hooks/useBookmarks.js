import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId } from '../utils/helpers';

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useLocalStorage('quran_bookmarks', []);

  const addBookmark = useCallback(
    (surah, ayah, text) => {
      const exists = bookmarks.some(
        (b) => b.surah === surah && b.ayah === ayah
      );
      if (exists) return;
      const newBookmark = {
        id: generateId(),
        surah,
        ayah,
        text,
        timestamp: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    },
    [bookmarks, setBookmarks]
  );

  const removeBookmark = useCallback(
    (id) => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBookmarks]
  );

  const removeBookmarkByRef = useCallback(
    (surah, ayah) => {
      setBookmarks((prev) =>
        prev.filter((b) => !(b.surah === surah && b.ayah === ayah))
      );
    },
    [setBookmarks]
  );

  const isBookmarked = useCallback(
    (surah, ayah) => {
      return bookmarks.some((b) => b.surah === surah && b.ayah === ayah);
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (surah, ayah, text) => {
      if (isBookmarked(surah, ayah)) {
        removeBookmarkByRef(surah, ayah);
      } else {
        addBookmark(surah, ayah, text);
      }
    },
    [isBookmarked, removeBookmarkByRef, addBookmark]
  );

  const clearAllBookmarks = useCallback(() => {
    setBookmarks([]);
  }, [setBookmarks]);

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    removeBookmarkByRef,
    isBookmarked,
    toggleBookmark,
    clearAllBookmarks,
  };
};

export default useBookmarks;
