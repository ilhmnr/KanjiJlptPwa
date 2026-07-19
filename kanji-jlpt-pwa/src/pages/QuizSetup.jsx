import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKanjiByLevel } from '../hooks/useKanjiData';

export default function QuizSetup() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKanjiByLevel(level);

  const modes = [
    { key: 'kanji-to-arti', icon: '🈴', title: 'Kanji → Arti', desc: 'Lihat kanji, pilih arti yang benar' },
    { key: 'arti-to-kanji', icon: '🔤', title: 'Arti → Kanji', desc: 'Lihat arti, pilih kanji yang benar' }
  ];

  return (
    <div className="page">
      <PageHeader title={`Quiz ${level}`} />
      <p className="text-muted mb-16">{data.length} kanji siap diuji. Pilih tipe quiz:</p>
      <div className="flex-col gap-12">
        {modes.map((m) => (
          <button
            key={m.key}
            className="card card-tappable menu-item"
            disabled={data.length < 4}
            onClick={() => navigate(`/quiz/play/${level}?mode=${m.key}`)}
          >
            <span className="menu-item-icon">{m.icon}</span>
            <span className="menu-item-text">
              <span className="menu-item-title">{m.title}</span>
              <span className="text-muted menu-item-desc">{m.desc}</span>
            </span>
            <span className="menu-item-arrow">›</span>
          </button>
        ))}
      </div>
      {data.length < 4 && (
        <p className="text-muted mt-16" style={{ fontSize: 13 }}>
          Minimal 4 kanji dibutuhkan untuk membuat pilihan ganda.
        </p>
      )}
    </div>
  );
}
