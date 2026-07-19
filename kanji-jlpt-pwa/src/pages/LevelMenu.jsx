import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKanjiByLevel } from '../hooks/useKanjiData';

const MENU_ITEMS = [
  { key: 'all', icon: '📚', title: 'Semua Kanji', desc: 'Pelajari semua kanji secara berurutan' },
  { key: 'sections', icon: '🔟', title: 'Belajar Per 10 Kanji', desc: 'Dibagi jadi beberapa bagian kecil' },
  { key: 'flashcard', icon: '🃏', title: 'Flashcard', desc: 'Tap kartu untuk membuka arti & bacaan' },
  { key: 'quiz', icon: '📝', title: 'Quiz', desc: 'Uji hafalanmu dengan pertanyaan pilihan ganda' }
];

export default function LevelMenu() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKanjiByLevel(level);

  function handleSelect(key) {
    if (key === 'all') navigate(`/study/${level}`);
    else if (key === 'sections') navigate(`/level/${level}/sections`);
    else if (key === 'flashcard') navigate(`/flashcard/${level}`);
    else if (key === 'quiz') navigate(`/quiz/${level}`);
  }

  return (
    <div className="page">
      <PageHeader title={`Kanji ${level}`} />
      <p className="text-muted mb-16">{data.length} kanji tersedia. Pilih cara belajar:</p>

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
