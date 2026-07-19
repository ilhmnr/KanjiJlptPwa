import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import KotobaHero from '../components/KotobaHero.jsx';
import StudyNavButtons from '../components/StudyNavButtons.jsx';
import { useKotobaData, useKotobaByBab } from '../hooks/useKotobaData';
import { useProgress } from '../hooks/useProgress';
import { useSwipe } from '../hooks/useSwipe';

export default function KotobaStudy() {
  const { bab } = useParams(); // "all" atau nomor bab
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const isAll = bab === 'all';

  const { kotobaList } = useKotobaData();
  const { data: babData } = useKotobaByBab(isAll ? 1 : bab);
  const list = isAll ? kotobaList : babData;

  const { isFavorite, isLearned, toggleFavorite, toggleLearned, saveLastPosition } = useProgress();

  const startNomor = params.get('nomor');
  const initialIndex = useMemo(() => {
    if (startNomor) {
      const idx = list.findIndex((k) => String(k.id) === String(startNomor) || String(k.nomor) === String(startNomor));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [list, startNomor]);

  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState('none');
  useEffect(() => setIndex(initialIndex), [bab, initialIndex]);

  const current = list[index];

  useEffect(() => {
    if (current) saveLastPosition('kotoba', isAll ? 'all' : bab, current.id);
  }, [current, bab, isAll, saveLastPosition]);

  const goNext = () => { if (index < list.length - 1) { setDirection('left'); setIndex((i) => i + 1); } };
  const goPrev = () => { if (index > 0) { setDirection('right'); setIndex((i) => i - 1); } };
  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  const title = isAll ? 'Kotoba — Semua Bab' : `Kotoba — Bab ${bab}`;

  if (list.length === 0) {
    return (
      <div className="page">
        <PageHeader title={title} />
        <div className="empty-state">
          <p>Belum ada kosakata untuk bab ini.</p>
          <button className="btn btn-primary mt-16" onClick={() => navigate(-1)}>Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page study-page">
      <PageHeader title={title} />
      <ProgressBar level={isAll ? 'Semua Bab' : `Bab ${bab}`} current={index + 1} total={list.length} unitLabel="Kata" />

      <div className={`study-swipe-area anim-${direction}`} key={current.id} {...swipeHandlers}>
        <KotobaHero
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
