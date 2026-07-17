import React from 'react';

/**
 * Menampilkan info level + posisi ("N5 · Kanji 15 / 103") beserta bar progress visual.
 */
export default function ProgressBar({ level, current, total }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span className="progress-level">{level}</span>
        <span className="text-muted">Kanji {current} / {total}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
