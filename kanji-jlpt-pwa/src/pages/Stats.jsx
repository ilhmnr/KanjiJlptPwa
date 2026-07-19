import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKanjiData, useKanjiByLevel } from '../hooks/useKanjiData';
import { useProgress } from '../hooks/useProgress';

const FILTERS = [
  { key: 'all', label: 'Semua', icon: '📚' },
  { key: 'new', label: 'Belum Dipelajari', icon: '🆕' },
  { key: 'favorite', label: 'Favorit', icon: '⭐' },
  { key: 'learned', label: 'Sudah Hafal', icon: '✔' }
];

export default function Stats() {
  const navigate = useNavigate();
  const { kanjiList } = useKanjiData();
  const { data: n5 } = useKanjiByLevel('N5');
  const { data: n4 } = useKanjiByLevel('N4');
  const { learnedCount, favoriteIds } = useProgress();

  const total = kanjiList.length;
  const progressPercent = total > 0 ? Math.round((learnedCount / total) * 100) : 0;

  const cards = useMemo(() => ([
    { label: 'Total Kanji', value: total, icon: '📖', color: '#2563EB' },
    { label: 'Sudah Dipelajari', value: learnedCount, icon: '✔️', color: '#16A34A' },
    { label: 'Favorit', value: favoriteIds.length, icon: '⭐', color: '#F59E0B' },
    { label: 'Progress', value: `${progressPercent}%`, icon: '📈', color: '#7C3AED' }
  ]), [total, learnedCount, favoriteIds, progressPercent]);

  return (
    <div className="page">
      <PageHeader title="Statistik" showBack={false} />

      <div className="stats-grid mt-8">
        {cards.map((c) => (
          <div key={c.label} className="card stats-card" style={{ '--accent': c.color }}>
            <span className="stats-card-icon">{c.icon}</span>
            <span className="stats-card-value">{c.value}</span>
            <span className="text-muted stats-card-label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="stats-level-breakdown card mt-16">
        <div className="stats-row">
          <span>Kanji N5</span>
          <span className="text-muted">{n5.length} kanji</span>
        </div>
        <div className="stats-row">
          <span>Kanji N4</span>
          <span className="text-muted">{n4.length} kanji</span>
        </div>
      </div>

      <h2 className="section-title mt-24">Jelajahi dengan Filter</h2>
      <p className="text-muted" style={{ fontSize: 13 }}>Pilih level lalu filter untuk langsung mulai belajar.</p>
      {['N5', 'N4'].map((level) => (
        <div key={level} className="mt-8">
          <div style={{ fontWeight: 700, fontSize: 13.5, margin: '10px 0 6px' }}>{level}</div>
          <div className="filter-chip-row">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className="filter-chip"
                onClick={() => navigate(`/study/${level}?filter=${f.key}`)}
              >
                <span>{f.icon}</span> {f.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
