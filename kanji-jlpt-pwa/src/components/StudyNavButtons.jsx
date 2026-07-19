import React from 'react';

export default function StudyNavButtons({ onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div className="study-nav flex gap-12 mt-16">
      <button className="btn btn-outline" onClick={onPrev} disabled={!hasPrev}>
        ← Sebelumnya
      </button>
      <button className="btn btn-primary" onClick={onNext} disabled={!hasNext} style={{ flex: 1 }}>
        Berikutnya →
      </button>
    </div>
  );
}
