import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import GrammarHero from '../components/GrammarHero.jsx';
import StudyNavButtons from '../components/StudyNavButtons.jsx';
import { useGrammarByLevel } from '../hooks/useGrammarData';
import { useProgress } from '../hooks/useProgress';
import { useSwipe } from '../hooks/useSwipe';

const FILTERS = {
  all: () => true,
  new: (g, isL) => !isL(g.id),
  favorite: (g, isL, isF) => isF(g.id),
  learned: (g, isL) => isL(g.id)
};

export default function GrammarStudy() {
  const { level } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data } = useGrammarByLevel(level);
  const { isFavorite, isLearned, toggleFavorite, toggleLearned, saveLastPosition } = useProgress();

  const startNomor = params.get('nomor');
  const filterKey = params.get('filter') || 'all';

  const list = useMemo(() => {
    const filterFn = FILTERS[filterKey] || FILTERS.all;
    return data.filter((g) => filterFn(g, isLearned, isFavorite));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filterKey]);

  const initialIndex = useMemo(() => {
    if (startNomor) {
      const idx = list.findIndex((g) => String(g.nomor) === String(startNomor));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [list, startNomor]);

  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState('none');
  useEffect(() => setIndex(initialIndex), [initialIndex]);

  const current = list[index];

  useEffect(() => {
    if (current) saveLastPosition('tatabahasa', level, current.nomor);
  }, [current, level, saveLastPosition]);

  const goNext = () => { if (index < list.length - 1) { setDirection('left'); setIndex((i) => i + 1); } };
  const goPrev = () => { if (index > 0) { setDirection('right'); setIndex((i) => i - 1); } };
  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  if (list.length === 0) {
    return (
      <div className="page">
        <PageHeader title={`Tata Bahasa ${level}`} />
        <div className="empty-state">
          <p>Tidak ada pola kalimat pada filter ini.</p>
          <button className="btn btn-primary mt-16" onClick={() => navigate(-1)}>Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page study-page">
      <PageHeader title={`Tata Bahasa ${level}`} />
      <ProgressBar level={level} current={index + 1} total={list.length} unitLabel="Pola" />
      <div className={`study-swipe-area anim-${direction}`} key={current.id} {...swipeHandlers}>
        <GrammarHero
          item={current}
          isFavorite={isFavorite(current.id)}
          isLearned={isLearned(current.id)}
          onToggleFavorite={() => toggleFavorite(current.id)}
          onToggleLearned={() => toggleLearned(current.id)}
        />
      </div>
      <StudyNavButtons onPrev={goPrev} onNext={goNext} hasPrev={index > 0} hasNext={index < list.length - 1} />
    </div>
  );
}
