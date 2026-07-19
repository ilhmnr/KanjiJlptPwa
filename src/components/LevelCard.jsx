import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Kartu besar untuk memilih level/modul di Beranda.
 * Dipakai untuk Kanji N5/N4, Kosakata N5/N4, dan modul lain yang mengikuti pola serupa.
 */
export default function LevelCard({
  level,
  title,
  subtitle,
  total,
  unitLabel = 'kanji',
  color,
  icon = '📖',
  to,
  disabled = false
}) {
  const navigate = useNavigate();
  const displayTitle = title || `Kanji ${level}`;

  return (
    <button
      className={`card level-card${disabled ? ' level-card-disabled' : ' card-tappable'}`}
      style={{ '--accent': color }}
      onClick={() => !disabled && navigate(to || `/level/${level}`)}
      disabled={disabled}
    >
      <span className="level-card-icon" aria-hidden="true">{icon}</span>
      <span className="level-card-title">{displayTitle}</span>
      <span className="level-card-subtitle text-muted">{subtitle}</span>
      {disabled ? (
        <span className="level-card-badge level-card-badge-soon">Segera Hadir</span>
      ) : (
        total != null && <span className="level-card-badge">{total} {unitLabel}</span>
      )}
    </button>
  );
}
