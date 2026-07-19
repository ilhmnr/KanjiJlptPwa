import React from 'react';

/**
 * Kartu utama yang menampilkan 1 kanji besar beserta cara baca, arti, dan contoh kata.
 * Dipakai di halaman Study (mode belajar 1-per-halaman).
 */
export default function KanjiHero({ kanji, isFavorite, isLearned, onToggleFavorite, onToggleLearned }) {
  if (!kanji) return null;
  const hasExample = kanji.contoh_kata && kanji.contoh_kata !== '-';

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

      <div className="kanji-big font-jp" lang="ja">{kanji.kanji}</div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Onyomi</div>
        <div className="kanji-reading-value font-jp">
          {kanji.onyomi || '—'}
          {kanji.romaji_onyomi ? <span className="text-muted"> ({kanji.romaji_onyomi})</span> : null}
        </div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Kunyomi</div>
        <div className="kanji-reading-value font-jp">
          {kanji.kunyomi || '—'}
          {kanji.romaji_kunyomi ? <span className="text-muted"> ({kanji.romaji_kunyomi})</span> : null}
        </div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Arti</div>
        <div className="kanji-reading-value kanji-arti">{kanji.arti}</div>
      </div>

      {hasExample && (
        <div className="kanji-example">
          <div className="kanji-example-word font-jp">{kanji.contoh_kata}</div>
          <div className="kanji-example-reading font-jp">{kanji.contoh_hiragana}</div>
          <div className="kanji-example-arti text-muted">{kanji.contoh_arti}</div>
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
