import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useLocalStorage('kanji_dark_mode', false);
  return (
    <button
      className="icon-btn"
      onClick={() => setDarkMode((v) => !v)}
      aria-label={darkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      aria-pressed={darkMode}
      title="Mode Gelap"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}
