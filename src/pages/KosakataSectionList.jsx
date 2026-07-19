import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKosakataByLevel } from '../hooks/useKosakataData';
import { useProgress } from '../hooks/useProgress';

const CHUNK_SIZE = 10;

export default function KosakataSectionList() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKosakataByLevel(level);
  const { isLearned } = useProgress();

  const sections = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      chunks.push({ index: chunks.length + 1, from: chunk[0]?.nomor, to: chunk[chunk.length - 1]?.nomor, ids: chunk.map((k) => k.id) });
    }
    return chunks;
  }, [data]);

  return (
    <div className="page">
      <PageHeader title={`Kosakata ${level} — Per 10`} />
      <p className="text-muted mb-16">Pilih bagian untuk mulai belajar bertahap.</p>
      <div className="section-grid">
        {sections.map((s) => {
          const learnedInSection = s.ids.filter((id) => isLearned(id)).length;
          const done = learnedInSection === s.ids.length;
          return (
            <button
              key={s.index}
              className="card card-tappable section-item"
              onClick={() => navigate(`/kosakata-study/${level}?from=${s.from}&to=${s.to}`)}
            >
              <div className="section-item-title">Bagian {s.index}</div>
              <div className="text-muted section-item-range">({s.from}-{s.to})</div>
              <div className={`section-item-status${done ? ' done' : ''}`}>
                {done ? '✔ Selesai' : `${learnedInSection}/${s.ids.length} hafal`}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
