import React from 'react';
import SpeakButton from './SpeakButton.jsx';

/**
 * Kartu tampilan kosakata Minna no Nihongo — gaya sama dengan latihan kanji/kosakata JLPT
 * supaya pengalaman belajar konsisten di seluruh aplikasi.
 */
export default function KotobaHero({ item, isFavorite, isLearned, onToggleFavorite, onToggleLearned }) {
  if (!item) return null;
  const hasExample = item.contoh_kalimat && item.contoh_kalimat !== '-';

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

      <div className="tag" style={{ marginBottom: 10 }}>Bab {item.bab}{item.jenis_kata ? ` · ${item.jenis_kata}` : ''}</div>

      <div className="kotoba-big font-jp" lang="ja">{item.kotoba}</div>
      <SpeakButton text={item.kotoba} />

      <div className="kanji-reading-group" style={{ borderTop: 'none' }}>
        <div className="kanji-reading-label">Furigana</div>
        <div className="kanji-reading-value font-jp">{item.furigana}</div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Romaji</div>
        <div className="kanji-reading-value">{item.romaji}</div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Arti</div>
        <div className="kanji-reading-value kanji-arti">{item.arti}</div>
      </div>

      {hasExample && (
        <div className="kanji-example">
          <div className="kanji-example-word font-jp">{item.contoh_kalimat}</div>
          <SpeakButton text={item.contoh_kalimat} label="🔊 Dengarkan Kalimat" />
          <div className="kanji-example-arti text-muted mt-8">{item.contoh_kalimat_arti}</div>
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
