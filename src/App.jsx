import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { QuranProvider } from './context/QuranContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { NotesProvider } from './context/NotesContext';
import { AudioProvider } from './context/AudioContext';
import { ToastProvider } from './components/Toast';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QuranProvider>
          <AudioProvider>
            <BookmarkProvider>
              <NotesProvider>
                <ToastProvider>
                  <AppRoutes />
                </ToastProvider>
              </NotesProvider>
            </BookmarkProvider>
          </AudioProvider>
        </QuranProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
