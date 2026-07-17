import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { useKanjiByLevel } from '../hooks/useKanjiData';
import { useProgress } from '../hooks/useProgress';
import { useSwipe } from '../hooks/useSwipe';

export default function Flashcard() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKanjiByLevel(level);
  const { isFavorite, isLearned, toggleFavorite, toggleLearned } = useProgress();

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const current = data[index];

  useEffect(() => setFlipped(false), [index]);

  const goNext = () => index < data.length - 1 && setIndex((i) => i + 1);
  const goPrev = () => index > 0 && setIndex((i) => i - 1);
  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  if (!current) {
    return (
      <div className="page">
        <PageHeader title={`Flashcard ${level}`} />
        <div className="empty-state">Tidak ada data kanji.</div>
      </div>
    );
  }

  const hasExample = current.contoh_kata && current.contoh_kata !== '-';

  return (
    <div className="page study-page">
      <PageHeader title={`Flashcard ${level}`} />
      <ProgressBar level={level} current={index + 1} total={data.length} />

      <div className="flashcard-scene" {...swipeHandlers}>
        <button
          className={`flashcard${flipped ? ' flipped' : ''}`}
          onClick={() => setFlipped((f) => !f)}
          aria-label="Tap untuk membalik kartu"
        >
          <div className="flashcard-inner">
            <div className="flashcard-face flashcard-front">
              <span
                className="favorite-btn"
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(current.id); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); toggleFavorite(current.id); } }}
              >
                {isFavorite(current.id) ? '⭐' : '☆'}
              </span>
              <div className="kanji-big font-jp" lang="ja">{current.kanji}</div>
              <p className="text-muted" style={{ fontSize: 13 }}>Tap kartu untuk membuka jawaban</p>
            </div>
            <div className="flashcard-face flashcard-back">
              <div className="kanji-reading-group" style={{ borderTop: 'none' }}>
                <div className="kanji-reading-label">Onyomi</div>
                <div className="kanji-reading-value font-jp">{current.onyomi || '—'} <span className="text-muted">({current.romaji_onyomi})</span></div>
              </div>
              <div className="kanji-reading-group">
                <div className="kanji-reading-label">Kunyomi</div>
                <div className="kanji-reading-value font-jp">{current.kunyomi || '—'} <span className="text-muted">({current.romaji_kunyomi})</span></div>
              </div>
              <div className="kanji-reading-group">
                <div className="kanji-reading-label">Arti</div>
                <div className="kanji-reading-value kanji-arti">{current.arti}</div>
              </div>
              {hasExample && (
                <div className="kanji-example">
                  <div className="kanji-example-word font-jp">{current.contoh_kata}</div>
                  <div className="kanji-example-reading font-jp">{current.contoh_hiragana}</div>
                  <div className="kanji-example-arti text-muted">{current.contoh_arti}</div>
                </div>
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="flex gap-12 mt-16">
        <button className="btn btn-outline" onClick={goPrev} disabled={index === 0}>← Sebelumnya</button>
        <button
          className={`btn learned-btn${isLearned(current.id) ? ' learned' : ''}`}
          style={{ flex: 1 }}
          onClick={() => toggleLearned(current.id)}
        >
          {isLearned(current.id) ? '✔ Sudah Hafal' : 'Tandai Hafal'}
        </button>
        <button className="btn btn-primary" onClick={goNext} disabled={index === data.length - 1}>Berikutnya →</button>
      </div>
    </div>
  );
}
