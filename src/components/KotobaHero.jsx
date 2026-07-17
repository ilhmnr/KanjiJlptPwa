import React from 'react';

/**
 * Kartu tampilan kosakata Minna no Nihongo — dibuat mirip dengan KanjiHero
 * supaya pengalaman belajar terasa konsisten dengan halaman latihan kanji.
 */
export default function KotobaHero({ item, isFavorite, isLearned, onToggleFavorite, onToggleLearned }) {
  if (!item) return null;
  const hasKanji = item.kanji && item.kanji !== '-';

  return (
    <div className="card kanji-hero">
      <button
        className={`favorite-btn${isFavorite ? ' active' : ''}`}
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
      >
        {isFavorite ? '⭐' : '☆'}
      </button>

      <div className="tag" style={{ marginBottom: 10 }}>Bab {item.bab}</div>

      <div className="kotoba-big font-jp" lang="ja">{item.kata}</div>

      {hasKanji && (
        <div className="kanji-reading-group" style={{ borderTop: 'none' }}>
          <div className="kanji-reading-label">Kanji</div>
          <div className="kanji-reading-value font-jp">{item.kanji}</div>
        </div>
      )}

      <div className="kanji-reading-group" style={!hasKanji ? { borderTop: 'none' } : undefined}>
        <div className="kanji-reading-label">Hiragana</div>
        <div className="kanji-reading-value font-jp">{item.hiragana}</div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Romaji</div>
        <div className="kanji-reading-value">{item.romaji}</div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Arti</div>
        <div className="kanji-reading-value kanji-arti">{item.arti}</div>
      </div>

      {item.kelas_kata && (
        <div className="kanji-reading-group">
          <div className="kanji-reading-label">Jenis Kata</div>
          <div className="kanji-reading-value" style={{ fontSize: 15, fontWeight: 500 }}>{item.kelas_kata}</div>
        </div>
      )}

      <button
        className={`btn btn-block learned-btn${isLearned ? ' learned' : ''}`}
        onClick={onToggleLearned}
      >
        {isLearned ? '✔ Sudah Hafal' : 'Tandai Sudah Hafal'}
      </button>
    </div>
  );
}
