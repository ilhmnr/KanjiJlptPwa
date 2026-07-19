import React from 'react';
import { speak } from '../hooks/speech';

export default function SpeakButton({ text, label = '🔊 Dengarkan', className = '' }) {
  return (
    <button
      type="button"
      className={`btn btn-ghost speak-btn ${className}`}
      onClick={(e) => { e.stopPropagation(); speak(text); }}
      aria-label={`Dengarkan pelafalan: ${text}`}
    >
      {label}
    </button>
  );
}
