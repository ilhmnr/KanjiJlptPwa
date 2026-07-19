import React, { useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import VocabListItem from '../components/VocabListItem.jsx';
import { useKanjiData } from '../hooks/useKanjiData';
import { useKosakataData } from '../hooks/useKosakataData';
import { useKotobaData } from '../hooks/useKotobaData';
import { useGrammarData } from '../hooks/useGrammarData';
import { useProgress } from '../hooks/useProgress';

export default function Favorites() {
  const { kanjiList } = useKanjiData();
  const { kosakataList } = useKosakataData();
  const { kotobaList } = useKotobaData();
  const { grammarList } = useGrammarData();
  const { favoriteIds, isFavorite, isLearned } = useProgress();

  const allItems = useMemo(
    () => [...kanjiList, ...kosakataList, ...kotobaList, ...grammarList],
    [kanjiList, kosakataList, kotobaList, grammarList]
  );

  const favorites = useMemo(
    () => allItems.filter((k) => favoriteIds.includes(String(k.id)) || favoriteIds.includes(k.id)),
    [allItems, favoriteIds]
  );

  return (
    <div className="page">
      <PageHeader title="Favorit" showBack={false} />
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>⭐</p>
          <p>Belum ada yang difavoritkan.</p>
          <p className="text-muted" style={{ fontSize: 13 }}>
            Tekan ikon bintang saat belajar (Kanji, Kosakata, Kotoba, atau Tata Bahasa) untuk menambahkannya ke sini.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          {favorites.map((k) => (
            <VocabListItem key={k.id} item={k} isFavorite={isFavorite(k.id)} isLearned={isLearned(k.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
