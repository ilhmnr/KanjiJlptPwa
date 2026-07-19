import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import KanjiListItem from '../components/KanjiListItem.jsx';
import { useKanjiData } from '../hooks/useKanjiData';
import { useProgress } from '../hooks/useProgress';

export default function Search() {
  const { kanjiList } = useKanjiData();
  const { isFavorite, isLearned } = useProgress();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return kanjiList.filter((k) =>
      k.kanji?.includes(query.trim()) ||
      k.arti?.toLowerCase().includes(q) ||
      k.onyomi?.toLowerCase().includes(q) ||
      k.kunyomi?.toLowerCase().includes(q) ||
      k.romaji_onyomi?.toLowerCase().includes(q) ||
      k.romaji_kunyomi?.toLowerCase().includes(q)
    );
  }, [kanjiList, query]);

  return (
    <div className="page">
      <PageHeader title="Cari Kanji" showBack={false} />
      <SearchBar value={query} onChange={setQuery} />

      <div className="mt-16">
        {query && results.length === 0 && (
          <div className="empty-state">Tidak ditemukan kanji untuk "{query}".</div>
        )}
        {results.map((k) => (
          <KanjiListItem key={k.id} kanji={k} isFavorite={isFavorite(k.id)} isLearned={isLearned(k.id)} />
        ))}
        {!query && (
          <p className="text-muted" style={{ fontSize: 13.5, textAlign: 'center', marginTop: 40 }}>
            Ketik kanji, arti (Bahasa Indonesia), onyomi, atau kunyomi untuk mencari.
          </p>
        )}
      </div>
    </div>
  );
}
