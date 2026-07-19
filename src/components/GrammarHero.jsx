import React from 'react';
import SpeakButton from './SpeakButton.jsx';

export default function GrammarHero({ item, isFavorite, isLearned, onToggleFavorite, onToggleLearned }) {
  if (!item) return null;

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

      <div className="tag" style={{ marginBottom: 10 }}>{item.level} · Pola {item.nomor}</div>
      <div className="grammar-pola font-jp" lang="ja">{item.pola}</div>

      <div className="kanji-reading-group" style={{ borderTop: 'none' }}>
        <div className="kanji-reading-label">Arti Pola</div>
        <div className="kanji-reading-value kanji-arti">{item.arti_pola}</div>
      </div>

      <div className="kanji-reading-group">
        <div className="kanji-reading-label">Penjelasan</div>
        <div className="kanji-reading-value grammar-penjelasan">{item.penjelasan}</div>
      </div>

      <div className="kanji-example">
        <div className="flex items-center justify-between">
          <div className="kanji-example-word font-jp" style={{ fontSize: 19 }}>{item.contoh_kalimat}</div>
        </div>
        <SpeakButton text={item.contoh_kalimat} />
        <div className="kanji-example-arti text-muted mt-8">{item.contoh_arti}</div>
      </div>

      <button className={`btn btn-block learned-btn${isLearned ? ' learned' : ''}`} onClick={onToggleLearned}>
        {isLearned ? '✔ Sudah Hafal' : 'Tandai Sudah Hafal'}
      </button>
    </div>
  );
}
