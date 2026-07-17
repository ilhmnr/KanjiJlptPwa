import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LevelCard({ level, subtitle, total, color }) {
  const navigate = useNavigate();
  return (
    <button
      className="card card-tappable level-card"
      style={{ '--accent': color }}
      onClick={() => navigate(`/level/${level}`)}
    >
      <span className="level-card-icon" aria-hidden="true">📖</span>
      <span className="level-card-title">Kanji {level}</span>
      <span className="level-card-subtitle text-muted">{subtitle}</span>
      {total != null && <span className="level-card-badge">{total} kanji</span>}
    </button>
  );
}
