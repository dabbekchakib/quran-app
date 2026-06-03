import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { generateId } from '../utils/helpers';

const useNotes = () => {
  const [notes, setNotes] = useLocalStorage('quran_notes', []);

  const addNote = useCallback(
    (surah, ayah, text, noteText) => {
      const existing = notes.find(
        (n) => n.surah === surah && n.ayah === ayah
      );
      if (existing) {
        setNotes((prev) =>
          prev.map((n) =>
            n.surah === surah && n.ayah === ayah
              ? { ...n, noteText, timestamp: Date.now() }
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

  return {
    notes,
    addNote,
    removeNote,
    removeNoteByRef,
    getNote,
    hasNote,
    clearAllNotes,
  };
};

export default useNotes;
