import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle.jsx';

/**
 * Header standar untuk setiap halaman: tombol kembali + judul + (opsional) toggle dark mode.
 */
export default function PageHeader({ title, showBack = true, showDarkModeToggle = false, right = null }) {
  const navigate = useNavigate();
  return (
    <header className="page-header">
      {showBack && (
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Kembali">
          ←
        </button>
      )}
      <h1>{title}</h1>
      {right}
      {showDarkModeToggle && <DarkModeToggle />}
    </header>
  );
}
