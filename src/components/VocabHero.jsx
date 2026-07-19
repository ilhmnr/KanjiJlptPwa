import React from 'react';
import SpeakButton from './SpeakButton.jsx';

export default function VocabHero({ item, isFavorite, isLearned, onToggleFavorite, onToggleLearned }) {
  if (!item) return null;
  const hasKanji = item.kanji && item.kanji !== '-';
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

      <div className="tag" style={{ marginBottom: 10 }}>{item.level} · {item.kelas_kata}</div>
      <div className="kotoba-big font-jp" lang="ja">{item.kata}</div>
      <SpeakButton text={item.kata} />

      {hasKanji && (
        <div className="kanji-reading-group" style={{ borderTop: 'none' }}>
          <div className="kanji-reading-label">Kanji</div>
          <div className="kanji-reading-value font-jp">{item.kanji}</div>
        </div>
      )}
      <div className="kanji-reading-group" style={!hasKanji ? { borderTop: 'none' } : undefined}>
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
          <div className="kanji-example-arti text-muted">{item.contoh_arti}</div>
        </div>
      )}

      <button className={`btn btn-block learned-btn${isLearned ? ' learned' : ''}`} onClick={onToggleLearned}>
        {isLearned ? '✔ Sudah Hafal' : 'Tandai Sudah Hafal'}
      </button>
    </div>
  );
}
