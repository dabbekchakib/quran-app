import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = lazy(() => import('../pages/Home'));
const SurahDetails = lazy(() => import('../pages/SurahDetails'));
const Search = lazy(() => import('../pages/Search'));
const JuzList = lazy(() => import('../pages/JuzList'));
const JuzDetail = lazy(() => import('../pages/JuzDetail'));
const HizbList = lazy(() => import('../pages/HizbList'));
const HizbDetail = lazy(() => import('../pages/HizbDetail'));
const Page = lazy(() => import('../pages/Page'));
const Bookmarks = lazy(() => import('../pages/Bookmarks'));
const Downloads = lazy(() => import('../pages/Downloads'));
const Notes = lazy(() => import('../pages/Notes'));
const Settings = lazy(() => import('../pages/Settings'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner text="جاري تحميل الصفحة..." />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:id" element={<SurahDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/juz" element={<JuzList />} />
          <Route path="/juz/:id" element={<JuzDetail />} />
          <Route path="/hizb" element={<HizbList />} />
          <Route path="/hizb/:id" element={<HizbDetail />} />
          <Route path="/page/:id" element={<Page />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
