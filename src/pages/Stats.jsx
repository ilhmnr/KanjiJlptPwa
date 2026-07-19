import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKanjiData, useKanjiByLevel } from '../hooks/useKanjiData';
import { useKosakataData, useKosakataByLevel } from '../hooks/useKosakataData';
import { useKotobaData } from '../hooks/useKotobaData';
import { useGrammarData, useGrammarByLevel } from '../hooks/useGrammarData';
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
  const { kosakataList } = useKosakataData();
  const { kotobaList } = useKotobaData();
  const { grammarList } = useGrammarData();
  const { data: kanjiN5 } = useKanjiByLevel('N5');
  const { data: kanjiN4 } = useKanjiByLevel('N4');
  const { data: kosakataN5 } = useKosakataByLevel('N5');
  const { data: kosakataN4 } = useKosakataByLevel('N4');
  const { data: grammarN5 } = useGrammarByLevel('N5');
  const { data: grammarN4 } = useGrammarByLevel('N4');
  const { learnedCount, favoriteIds } = useProgress();

  const total = kanjiList.length + kosakataList.length + kotobaList.length + grammarList.length;
  const progressPercent = total > 0 ? Math.round((learnedCount / total) * 100) : 0;

  const cards = useMemo(() => ([
    { label: 'Total Materi', value: total, icon: '📖', color: '#2563EB' },
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
        <div className="stats-row"><span>Kanji N5</span><span className="text-muted">{kanjiN5.length} kanji</span></div>
        <div className="stats-row"><span>Kanji N4</span><span className="text-muted">{kanjiN4.length} kanji</span></div>
        <div className="stats-row"><span>Kosakata N5</span><span className="text-muted">{kosakataN5.length} kata</span></div>
        <div className="stats-row"><span>Kosakata N4</span><span className="text-muted">{kosakataN4.length} kata</span></div>
        <div className="stats-row"><span>Kotoba Mina no Nihongo</span><span className="text-muted">{kotobaList.length} kata</span></div>
        <div className="stats-row"><span>Tata Bahasa N5</span><span className="text-muted">{grammarN5.length} pola</span></div>
        <div className="stats-row"><span>Tata Bahasa N4</span><span className="text-muted">{grammarN4.length} pola</span></div>
      </div>

      <h2 className="section-title mt-24">Jelajahi dengan Filter — Kanji</h2>
      <p className="text-muted" style={{ fontSize: 13 }}>Pilih level lalu filter untuk langsung mulai belajar.</p>
      {['N5', 'N4'].map((level) => (
        <div key={`kanji-${level}`} className="mt-8">
          <div style={{ fontWeight: 700, fontSize: 13.5, margin: '10px 0 6px' }}>Kanji {level}</div>
          <div className="filter-chip-row">
            {FILTERS.map((f) => (
              <button key={f.key} className="filter-chip" onClick={() => navigate(`/study/${level}?filter=${f.key}`)}>
                <span>{f.icon}</span> {f.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <h2 className="section-title mt-24">Jelajahi dengan Filter — Kosakata</h2>
      {['N5', 'N4'].map((level) => (
        <div key={`kosakata-${level}`} className="mt-8">
          <div style={{ fontWeight: 700, fontSize: 13.5, margin: '10px 0 6px' }}>Kosakata {level}</div>
          <div className="filter-chip-row">
            {FILTERS.map((f) => (
              <button key={f.key} className="filter-chip" onClick={() => navigate(`/kosakata-study/${level}?filter=${f.key}`)}>
                <span>{f.icon}</span> {f.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <h2 className="section-title mt-24">Jelajahi dengan Filter — Tata Bahasa</h2>
      {['N5', 'N4'].map((level) => (
        <div key={`grammar-${level}`} className="mt-8">
          <div style={{ fontWeight: 700, fontSize: 13.5, margin: '10px 0 6px' }}>Tata Bahasa {level}</div>
          <div className="filter-chip-row">
            {FILTERS.map((f) => (
              <button key={f.key} className="filter-chip" onClick={() => navigate(`/grammar/${level}?filter=${f.key}`)}>
                <span>{f.icon}</span> {f.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
