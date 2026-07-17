import React from 'react';
import { useNavigate } from 'react-router-dom';
import LevelCard from '../components/LevelCard.jsx';
import DarkModeToggle from '../components/DarkModeToggle.jsx';
import { useProgress } from '../hooks/useProgress';
import { useKanjiByLevel } from '../hooks/useKanjiData';

export default function Home() {
  const navigate = useNavigate();
  const { lastPosition } = useProgress();
  const { data: n5 } = useKanjiByLevel('N5');
  const { data: n4 } = useKanjiByLevel('N4');

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>漢字 Kanji JLPT</h1>
          <p className="text-muted" style={{ margin: '4px 0 0', fontSize: 13.5 }}>
            Hafalkan kanji N5 & N4 sedikit demi sedikit, tiap hari.
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {lastPosition && (
        <button
          className="card card-tappable continue-card mb-16"
          onClick={() => navigate(`/study/${lastPosition.level}?nomor=${lastPosition.nomor}`)}
        >
          <div>
            <div className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
              Terakhir belajar
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>
              {lastPosition.level} Kanji nomor {lastPosition.nomor}
            </div>
          </div>
          <span className="btn btn-primary" style={{ pointerEvents: 'none' }}>Lanjutkan Belajar →</span>
        </button>
      )}

      <div className="flex-col gap-16">
        <LevelCard level="N5" subtitle="Kanji tingkat dasar" total={n5.length} color="#2563EB" />
        <LevelCard level="N4" subtitle="Kanji tingkat pemula-menengah" total={n4.length} color="#0EA5E9" />
        <button className="card card-tappable level-card" style={{ '--accent': '#7C3AED' }} onClick={() => navigate('/kotoba')}>
          <span className="level-card-icon" aria-hidden="true">🈶</span>
          <span className="level-card-title">Kotoba Mina no Nihongo</span>
          <span className="level-card-subtitle text-muted">Kosakata Bab 1 - 50</span>
        </button>
      </div>

      <div className="home-quick-links mt-24">
        <button className="card card-tappable quick-link" onClick={() => navigate('/favorites')}>
          <span>⭐</span><span>Favorit</span>
        </button>
        <button className="card card-tappable quick-link" onClick={() => navigate('/stats')}>
          <span>📊</span><span>Statistik</span>
        </button>
        <button className="card card-tappable quick-link" onClick={() => navigate('/search')}>
          <span>🔍</span><span>Cari</span>
        </button>
      </div>
    </div>
  );
}
