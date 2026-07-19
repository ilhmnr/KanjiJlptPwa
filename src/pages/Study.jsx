import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import KanjiHero from '../components/KanjiHero.jsx';
import StudyNavButtons from '../components/StudyNavButtons.jsx';
import { useKanjiByLevel } from '../hooks/useKanjiData';
import { useProgress } from '../hooks/useProgress';
import { useSwipe } from '../hooks/useSwipe';

const FILTERS = {
  all: (k, isL, isF) => true,
  new: (k, isL) => !isL(k.id),
  favorite: (k, isL, isF) => isF(k.id),
  learned: (k, isL) => isL(k.id)
};

export default function Study() {
  const { level } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data } = useKanjiByLevel(level);
  const { isFavorite, isLearned, toggleFavorite, toggleLearned, saveLastPosition } = useProgress();

  const from = params.get('from');
  const to = params.get('to');
  const startNomor = params.get('nomor');
  const filterKey = params.get('filter') || 'all';

  // Daftar kanji yang relevan dengan konteks (rentang bagian, atau filter)
  const list = useMemo(() => {
    let filtered = data;
    if (from && to) {
      filtered = filtered.filter((k) => k.nomor >= Number(from) && k.nomor <= Number(to));
    }
    const filterFn = FILTERS[filterKey] || FILTERS.all;
    filtered = filtered.filter((k) => filterFn(k, isLearned, isFavorite));
    return filtered;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, from, to, filterKey]);

  const initialIndex = useMemo(() => {
    if (startNomor) {
      const idx = list.findIndex((k) => String(k.nomor) === String(startNomor));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  }, [list, startNomor]);

  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState('none'); // untuk animasi
  useEffect(() => setIndex(initialIndex), [initialIndex]);

  const current = list[index];

  // Simpan posisi terakhir belajar setiap kali kanji berganti
  useEffect(() => {
    if (current) saveLastPosition('kanji', level, current.nomor);
  }, [current, level, saveLastPosition]);

  const goNext = () => {
    if (index < list.length - 1) {
      setDirection('left');
      setIndex((i) => i + 1);
    }
  };
  const goPrev = () => {
    if (index > 0) {
      setDirection('right');
      setIndex((i) => i - 1);
    }
  };

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev });

  if (list.length === 0) {
    return (
      <div className="page">
        <PageHeader title={`Kanji ${level}`} />
        <div className="empty-state">
          <p>Tidak ada kanji pada rentang/filter ini.</p>
          <button className="btn btn-primary mt-16" onClick={() => navigate(-1)}>Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page study-page">
      <PageHeader title={`Kanji ${level}`} />
      <ProgressBar level={level} current={index + 1} total={list.length} />

      <div
        className={`study-swipe-area anim-${direction}`}
        key={current.id}
        {...swipeHandlers}
      >
        <KanjiHero
          kanji={current}
          isFavorite={isFavorite(current.id)}
          isLearned={isLearned(current.id)}
          onToggleFavorite={() => toggleFavorite(current.id)}
          onToggleLearned={() => toggleLearned(current.id)}
        />
      </div>

      <StudyNavButtons
        onPrev={goPrev}
        onNext={goNext}
        hasPrev={index > 0}
        hasNext={index < list.length - 1}
      />
    </div>
  );
}
