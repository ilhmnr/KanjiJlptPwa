import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKosakataByLevel } from '../hooks/useKosakataData';

const MENU_ITEMS = [
  { key: 'all', icon: '📚', title: 'Semua Kosakata', desc: 'Pelajari semua kata secara berurutan' },
  { key: 'sections', icon: '🔟', title: 'Belajar Per 10 Kata', desc: 'Dibagi jadi beberapa bagian kecil' },
  { key: 'quiz', icon: '📝', title: 'Kuis', desc: 'Uji hafalan kosakata dengan pilihan ganda' }
];

export default function KosakataMenu() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKosakataByLevel(level);

  function handleSelect(key) {
    if (key === 'all') navigate(`/kosakata-study/${level}`);
    else if (key === 'sections') navigate(`/kosakata/${level}/sections`);
    else if (key === 'quiz') navigate(`/kosakata-quiz/${level}`);
  }

  return (
    <div className="page">
      <PageHeader title={`Kosakata ${level}`} />
      <p className="text-muted mb-16">{data.length} kata tersedia. Pilih cara belajar:</p>
      <div className="flex-col gap-12">
        {MENU_ITEMS.map((item) => (
          <button key={item.key} className="card card-tappable menu-item" onClick={() => handleSelect(item.key)}>
            <span className="menu-item-icon">{item.icon}</span>
            <span className="menu-item-text">
              <span className="menu-item-title">{item.title}</span>
              <span className="text-muted menu-item-desc">{item.desc}</span>
            </span>
            <span className="menu-item-arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
