import { useRef, useCallback } from 'react';

const SWIPE_THRESHOLD = 50; // px minimal jarak geser supaya dianggap swipe

/**
 * Hook deteksi swipe kiri/kanan berbasis touch event.
 * Dipakai di halaman Study & Flashcard untuk navigasi antar kanji.
 */
export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const onTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // Abaikan jika gerakan vertikal lebih dominan (kemungkinan scroll)
    if (Math.abs(dx) < Math.abs(dy)) return;

    if (dx <= -SWIPE_THRESHOLD) onSwipeLeft?.();
    else if (dx >= SWIPE_THRESHOLD) onSwipeRight?.();
  }, [onSwipeLeft, onSwipeRight]);

  return { onTouchStart, onTouchEnd };
}
