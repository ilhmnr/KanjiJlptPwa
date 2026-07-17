import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKotobaBabSummary, TOTAL_BAB } from '../hooks/useKotobaData';

export default function KotobaBabList() {
  const navigate = useNavigate();
  const summary = useKotobaBabSummary();

  const babNumbers = Array.from({ length: TOTAL_BAB }, (_, i) => i + 1);

  return (
    <div className="page">
      <PageHeader title="Pilih Bab (1-50)" />
      <p className="text-muted mb-16">Ketuk salah satu bab untuk mulai belajar kosakatanya.</p>

      <div className="section-grid">
        {babNumbers.map((bab) => {
          const count = summary[bab] || 0;
          const available = count > 0;
          return (
            <button
              key={bab}
              className={`card card-tappable section-item${available ? '' : ' section-item-empty'}`}
              onClick={() => available && navigate(`/kotoba/study/${bab}`)}
              disabled={!available}
            >
              <div className="section-item-title">Bab {bab}</div>
              <div className={`section-item-status${available ? '' : ' empty'}`}>
                {available ? `${count} kata` : 'Segera hadir'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
