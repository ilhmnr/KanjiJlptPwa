import React, { useState, useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SearchBar from '../components/SearchBar.jsx';
import VocabListItem from '../components/VocabListItem.jsx';
import { useKanjiData } from '../hooks/useKanjiData';
import { useKosakataData } from '../hooks/useKosakataData';
import { useKotobaData } from '../hooks/useKotobaData';
import { useProgress } from '../hooks/useProgress';

export default function Search() {
  const { kanjiList } = useKanjiData();
  const { kosakataList } = useKosakataData();
  const { kotobaList } = useKotobaData();
  const { isFavorite, isLearned } = useProgress();
  const [query, setQuery] = useState('');

  // Gabungkan ketiga sumber data supaya pencarian mencakup seluruh materi (Kanji, Kosakata, Kotoba)
  const allItems = useMemo(() => [...kanjiList, ...kosakataList, ...kotobaList], [kanjiList, kosakataList, kotobaList]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const raw = query.trim();
    return allItems.filter((k) =>
      k.kanji?.includes(raw) ||
      k.kata?.includes(raw) ||
      k.kotoba?.includes(raw) ||
      k.arti?.toLowerCase().includes(q) ||
      k.onyomi?.toLowerCase().includes(q) ||
      k.kunyomi?.toLowerCase().includes(q) ||
      k.furigana?.toLowerCase().includes(q) ||
      k.romaji?.toLowerCase().includes(q) ||
      k.romaji_onyomi?.toLowerCase().includes(q) ||
      k.romaji_kunyomi?.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  return (
    <div className="page">
      <PageHeader title="Cari" showBack={false} />
      <SearchBar value={query} onChange={setQuery} placeholder="Cari kanji, kosakata, arti, romaji..." />

      <div className="mt-16">
        {query && results.length === 0 && (
          <div className="empty-state">Tidak ditemukan hasil untuk "{query}".</div>
        )}
        {results.map((k) => (
          <VocabListItem key={k.id} item={k} isFavorite={isFavorite(k.id)} isLearned={isLearned(k.id)} />
        ))}
        {!query && (
          <p className="text-muted" style={{ fontSize: 13.5, textAlign: 'center', marginTop: 40 }}>
            Ketik kanji, kosakata, arti, atau romaji untuk mencari di semua materi (Kanji, Kosakata, Kotoba).
          </p>
        )}
      </div>
    </div>
  );
}
