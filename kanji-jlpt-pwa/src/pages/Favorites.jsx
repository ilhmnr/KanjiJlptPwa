import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import KanjiListItem from '../components/KanjiListItem.jsx';
import { useKanjiData } from '../hooks/useKanjiData';
import { useProgress } from '../hooks/useProgress';

export default function Favorites() {
  const { kanjiList } = useKanjiData();
  const { favoriteIds, isFavorite, isLearned } = useProgress();

  const favorites = useMemo(
    () => kanjiList.filter((k) => favoriteIds.includes(String(k.id)) || favoriteIds.includes(k.id)),
    [kanjiList, favoriteIds]
  );

  return (
    <div className="page">
      <PageHeader title="Favorit" showBack={false} />
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>⭐</p>
          <p>Belum ada kanji favorit.</p>
          <p className="text-muted" style={{ fontSize: 13 }}>
            Tekan ikon bintang saat belajar untuk menambahkan kanji ke sini.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          {favorites.map((k) => (
            <KanjiListItem key={k.id} kanji={k} isFavorite={isFavorite(k.id)} isLearned={isLearned(k.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
