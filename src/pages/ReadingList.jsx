import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useReadingByLevel } from '../hooks/useReadingData';

export default function ReadingList() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useReadingByLevel(level);

  return (
    <div className="page">
      <PageHeader title={`Reading ${level}`} />
      <p className="text-muted mb-16">
        {data.length > 0 ? `${data.length} bacaan tersedia. Pilih salah satu:` : 'Belum ada bacaan untuk level ini.'}
      </p>

      <div className="flex-col gap-12">
        {data.map((item) => (
          <button
            key={item.id}
            className="card card-tappable menu-item"
            onClick={() => navigate(`/reading/${level}/${item.nomor}`)}
          >
            <span className="menu-item-icon">📖</span>
            <span className="menu-item-text">
              <span className="menu-item-title font-jp">{item.judul}</span>
              <span className="text-muted menu-item-desc">{item.pertanyaan.length} soal pemahaman</span>
            </span>
            <span className="menu-item-arrow">›</span>
          </button>
        ))}
      </div>

      {data.length === 0 && (
        <div className="empty-state">
          <p>📖</p>
          <p>Bacaan untuk level ini sedang disiapkan.</p>
        </div>
      )}
    </div>
  );
}
