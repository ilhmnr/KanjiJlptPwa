import { useMemo } from 'react';
import readingN5 from '../database/reading_n5.json';
import readingN4 from '../database/reading_n4.json';

const BUNDLED = [...readingN5, ...readingN4].map((r) => ({ id: `reading-${r.level}-${r.nomor}`, ...r }));

export function useReadingByLevel(level) {
  const data = useMemo(
    () => BUNDLED.filter((r) => r.level === level).sort((a, b) => a.nomor - b.nomor),
    [level]
  );
  return { data };
}

export function useReadingItem(level, nomor) {
  return useMemo(
    () => BUNDLED.find((r) => r.level === level && String(r.nomor) === String(nomor)),
    [level, nomor]
  );
}
