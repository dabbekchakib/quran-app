import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AudioPlayer from '../components/AudioPlayer';
import InstallPWAButton from '../components/InstallPWAButton';
import { useTheme } from '../context/ThemeContext';

const MainLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const isSurahPage = location.pathname.startsWith('/surah/');

  return (
    <div
      className={`min-h-screen flex flex-col ${
        theme === 'dark'
          ? 'bg-slate-900 text-slate-100'
          : 'bg-slate-50 text-slate-900'
      }`}
      dir="rtl"
    >
      <Navbar />
      <main className={`flex-1 px-4 sm:px-6 lg:px-8 ${isSurahPage ? 'pt-20 pb-24' : 'pt-20 pb-8'}`}>
        <Outlet />
      </main>
      <Footer />
      {!isSurahPage && <AudioPlayer />}
      <InstallPWAButton />
    </div>
  );
};

export default MainLayout;
