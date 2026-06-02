import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { QuranProvider } from './context/QuranContext';
import { BookmarkProvider } from './context/BookmarkContext';
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
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </BookmarkProvider>
          </AudioProvider>
        </QuranProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
