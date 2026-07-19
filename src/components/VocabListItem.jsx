import React from 'react';
import { useNavigate } from 'react-router-dom';

// Deteksi jenis item berdasarkan bentuk datanya (kanji / kosakata JLPT / kotoba Minna no Nihongo)
// supaya komponen ini bisa dipakai bersama di halaman Cari & Favorit.
function getItemMeta(item) {
  if (item.kanji !== undefined && item.onyomi !== undefined) {
    return {
      char: item.kanji,
      reading: [item.onyomi, item.kunyomi].filter(Boolean).join(' · '),
      arti: item.arti,
      badge: item.level,
      route: `/study/${item.level}?nomor=${item.nomor}`
    };
  }
  if (item.kata !== undefined) {
    return {
      char: item.kata,
      reading: item.romaji,
      arti: item.arti,
      badge: `Kosakata ${item.level}`,
      route: `/kosakata-study/${item.level}?nomor=${item.nomor}`
    };
  }
  if (item.kotoba !== undefined) {
    return {
      char: item.kotoba,
      reading: item.romaji,
      arti: item.arti,
      badge: `Bab ${item.bab}`,
      route: `/kotoba/study/${item.bab}?nomor=${item.id}`
    };
  }
  if (item.pola !== undefined) {
    return {
      char: item.pola,
      reading: item.arti_pola,
      arti: item.arti_pola,
      badge: `Tata Bahasa ${item.level}`,
      route: `/grammar/${item.level}?nomor=${item.nomor}`
    };
  }
  return { char: '?', reading: '', arti: '', badge: '', route: '/' };
}

export default function VocabListItem({ item, isFavorite, isLearned }) {
  const navigate = useNavigate();
  const meta = getItemMeta(item);

  return (
    <button className="card card-tappable kanji-list-item" onClick={() => navigate(meta.route)}>
      <div className="kanji-list-char font-jp">{meta.char}</div>
      <div className="kanji-list-info">
        <div className="kanji-list-arti">{meta.arti}</div>
        <div className="kanji-list-reading text-muted font-jp">{meta.reading}</div>
      </div>
      <div className="kanji-list-badges">
        <span className="tag">{meta.badge}</span>
        {isLearned && <span aria-label="Sudah hafal">✔</span>}
        {isFavorite && <span aria-label="Favorit">⭐</span>}
      </div>
    </button>
  );
}
