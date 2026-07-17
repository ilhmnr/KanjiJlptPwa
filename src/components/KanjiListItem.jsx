import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function KanjiListItem({ kanji, isFavorite, isLearned }) {
  const navigate = useNavigate();
  return (
    <button
      className="card card-tappable kanji-list-item"
      onClick={() => navigate(`/study/${kanji.level}?nomor=${kanji.nomor}`)}
    >
      <div className="kanji-list-char font-jp">{kanji.kanji}</div>
      <div className="kanji-list-info">
        <div className="kanji-list-arti">{kanji.arti}</div>
        <div className="kanji-list-reading text-muted font-jp">{kanji.onyomi} · {kanji.kunyomi}</div>
      </div>
      <div className="kanji-list-badges">
        <span className="tag">{kanji.level}</span>
        {isLearned && <span aria-label="Sudah hafal">✔</span>}
        {isFavorite && <span aria-label="Favorit">⭐</span>}
      </div>
    </button>
  );
}
