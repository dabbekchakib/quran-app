import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId } from '../utils/helpers';

const DEFAULT_CATEGORY = 'عام';

const useNotes = () => {
  const [notes, setNotes] = useLocalStorage('quran_notes', []);
  const [categories, setCategories] = useLocalStorage('quran_note_categories', [DEFAULT_CATEGORY]);

  const addNote = useCallback(
    (surah, ayah, text, noteText, category = DEFAULT_CATEGORY) => {
      const existing = notes.find(
        (n) => n.surah === surah && n.ayah === ayah
      );
      if (existing) {
        setNotes((prev) =>
          prev.map((n) =>
            n.surah === surah && n.ayah === ayah
              ? { ...n, noteText, category, timestamp: Date.now() }
              : n
          )
        );
      } else {
        const newNote = {
          id: generateId(),
          surah,
          ayah,
          text,
          noteText,
          category,
          timestamp: Date.now(),
        };
        setNotes((prev) => [newNote, ...prev]);
      }
    },
    [notes, setNotes]
  );

  const removeNote = useCallback(
    (id) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotes]
  );

  const removeNoteByRef = useCallback(
    (surah, ayah) => {
      setNotes((prev) =>
        prev.filter((n) => !(n.surah === surah && n.ayah === ayah))
      );
    },
    [setNotes]
  );

  const getNote = useCallback(
    (surah, ayah) => {
      return notes.find((n) => n.surah === surah && n.ayah === ayah) || null;
    },
    [notes]
  );

  const hasNote = useCallback(
    (surah, ayah) => {
      return notes.some((n) => n.surah === surah && n.ayah === ayah);
    },
    [notes]
  );

  const clearAllNotes = useCallback(() => {
    setNotes([]);
  }, [setNotes]);

  const addCategory = useCallback((name) => {
    setCategories((prev) =>
      prev.includes(name) ? prev : [...prev, name]
    );
  }, [setCategories]);

  const removeCategory = useCallback((name) => {
    if (name === DEFAULT_CATEGORY) return;
    setCategories((prev) => prev.filter((c) => c !== name));
    setNotes((prev) =>
      prev.map((n) =>
        n.category === name ? { ...n, category: DEFAULT_CATEGORY } : n
      )
    );
  }, [setCategories, setNotes]);

  const renameCategory = useCallback((oldName, newName) => {
    if (oldName === DEFAULT_CATEGORY) return;
    setCategories((prev) =>
      prev.map((c) => (c === oldName ? newName : c))
    );
    setNotes((prev) =>
      prev.map((n) =>
        n.category === oldName ? { ...n, category: newName } : n
      )
    );
  }, [setCategories, setNotes]);

  return {
    notes,
    addNote,
    removeNote,
    removeNoteByRef,
    getNote,
    hasNote,
    clearAllNotes,
    categories,
    addCategory,
    removeCategory,
    renameCategory,
    DEFAULT_CATEGORY,
  };
};

export default useNotes;
