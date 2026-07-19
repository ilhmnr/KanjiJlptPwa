import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKosakataByLevel } from '../hooks/useKosakataData';

export default function KosakataQuizSetup() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKosakataByLevel(level);

  const modes = [
    { key: 'kata-to-arti', icon: '🈴', title: 'Kata → Arti', desc: 'Lihat kosakata, pilih arti yang benar' },
    { key: 'arti-to-kata', icon: '🔤', title: 'Arti → Kata', desc: 'Lihat arti, pilih kosakata yang benar' }
  ];

  return (
    <div className="page">
      <PageHeader title={`Kuis Kosakata ${level}`} />
      <p className="text-muted mb-16">{data.length} kata siap diuji. Pilih tipe kuis:</p>
      <div className="flex-col gap-12">
        {modes.map((m) => (
          <button
            key={m.key}
            className="card card-tappable menu-item"
            disabled={data.length < 4}
            onClick={() => navigate(`/kosakata-quiz/play/${level}?mode=${m.key}`)}
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
          Minimal 4 kata dibutuhkan untuk membuat pilihan ganda.
        </p>
      )}
    </div>
  );
}
