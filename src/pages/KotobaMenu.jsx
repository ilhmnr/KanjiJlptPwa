import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKotobaData } from '../hooks/useKotobaData';

export default function KotobaMenu() {
  const navigate = useNavigate();
  const { kotobaList } = useKotobaData();

  const MENU_ITEMS = [
    { key: 'all', icon: '📚', title: 'Semua Bab', desc: `Pelajari semua kosakata (${kotobaList.length} kata) secara berurutan` },
    { key: 'per-bab', icon: '🔖', title: 'Belajar Per Bab', desc: 'Pilih Bab 1 sampai Bab 50' }
  ];

  function handleSelect(key) {
    if (key === 'all') navigate('/kotoba/study/all');
    else navigate('/kotoba/bab');
  }

  return (
    <div className="page">
      <PageHeader title="Kotoba Mina no Nihongo" />
      <p className="text-muted mb-16">Kosakata dari buku Minna no Nihongo, Bab 1 - 50. Pilih cara belajar:</p>

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
