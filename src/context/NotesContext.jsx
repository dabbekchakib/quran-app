import { createContext, useContext, useMemo } from 'react';
import useNotes from '../hooks/useNotes';

const NotesContext = createContext(null);

export const NotesProvider = ({ children }) => {
  const notesData = useNotes();

  const value = useMemo(() => notesData, [notesData]);

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNote = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNote must be used within a NotesProvider');
  }
  return context;
};
