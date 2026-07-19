import { useMemo } from 'react';
import kosakataN5 from '../database/kosakata_n5.json';
import kosakataN4 from '../database/kosakata_n4.json';

const BUNDLED = [...kosakataN5, ...kosakataN4].map((k) => ({ id: `kosakata-${k.level}-${k.nomor}`, ...k }));

export function useKosakataData() {
  return { kosakataList: BUNDLED };
}

export function useKosakataByLevel(level) {
  const data = useMemo(
    () => BUNDLED.filter((k) => k.level === level).sort((a, b) => a.nomor - b.nomor),
    [level]
  );
  return { data };
}
