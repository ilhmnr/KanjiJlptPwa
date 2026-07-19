import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useLocalStorage } from './hooks/useLocalStorage';

import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';

// Kanji
import LevelMenu from './pages/LevelMenu.jsx';
import SectionList from './pages/SectionList.jsx';
import Study from './pages/Study.jsx';
import Flashcard from './pages/Flashcard.jsx';
import QuizSetup from './pages/QuizSetup.jsx';
import Quiz from './pages/Quiz.jsx';

// Kosakata (JLPT N5/N4)
import KosakataMenu from './pages/KosakataMenu.jsx';
import KosakataSectionList from './pages/KosakataSectionList.jsx';
import KosakataStudy from './pages/KosakataStudy.jsx';
import KosakataQuizSetup from './pages/KosakataQuizSetup.jsx';
import KosakataQuiz from './pages/KosakataQuiz.jsx';

// Kotoba Mina no Nihongo
import KotobaMenu from './pages/KotobaMenu.jsx';
import KotobaBabList from './pages/KotobaBabList.jsx';
import KotobaStudy from './pages/KotobaStudy.jsx';

// Tata Bahasa
import GrammarStudy from './pages/GrammarStudy.jsx';

// Umum
import Favorites from './pages/Favorites.jsx';
import Stats from './pages/Stats.jsx';
import Search from './pages/Search.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  const [darkMode] = useLocalStorage('kanji_dark_mode', false);
  const location = useLocation();

  // Terapkan tema gelap/terang ke root <html> supaya konsisten di seluruh app
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Sembunyikan bottom nav di halaman mode belajar penuh layar (fokus tanpa distraksi)
  const FULLSCREEN_PATHS = ['/study', '/flashcard', '/quiz/play', '/kosakata-study', '/kosakata-quiz/play', '/kotoba/study', '/grammar/'];
  const hideNav = FULLSCREEN_PATHS.some((p) => location.pathname.startsWith(p));

  return (
    <div className="app-shell" style={hideNav ? { paddingBottom: 0 } : undefined}>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Kanji */}
        <Route path="/level/:level" element={<LevelMenu />} />
        <Route path="/level/:level/sections" element={<SectionList />} />
        <Route path="/study/:level" element={<Study />} />
        <Route path="/flashcard/:level" element={<Flashcard />} />
        <Route path="/quiz/:level" element={<QuizSetup />} />
        <Route path="/quiz/play/:level" element={<Quiz />} />

        {/* Kosakata JLPT N5/N4 */}
        <Route path="/kosakata/:level" element={<KosakataMenu />} />
        <Route path="/kosakata/:level/sections" element={<KosakataSectionList />} />
        <Route path="/kosakata-study/:level" element={<KosakataStudy />} />
        <Route path="/kosakata-quiz/:level" element={<KosakataQuizSetup />} />
        <Route path="/kosakata-quiz/play/:level" element={<KosakataQuiz />} />

        {/* Kotoba Mina no Nihongo */}
        <Route path="/kotoba" element={<KotobaMenu />} />
        <Route path="/kotoba/bab" element={<KotobaBabList />} />
        <Route path="/kotoba/study/:bab" element={<KotobaStudy />} />

        {/* Tata Bahasa */}
        <Route path="/grammar/:level" element={<GrammarStudy />} />

        {/* Umum */}
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </div>
  );
}
