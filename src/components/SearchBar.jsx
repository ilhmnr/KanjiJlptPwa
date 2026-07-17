import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Cari kanji, arti, onyomi, kunyomi...' }) {
  return (
    <div className="search-bar">
      <span aria-hidden="true">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Pencarian kanji"
        autoComplete="off"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Hapus pencarian">✕</button>
      )}
    </div>
  );
}
