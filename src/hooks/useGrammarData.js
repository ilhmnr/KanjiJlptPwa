import { useMemo } from 'react';
import grammarN5 from '../database/grammar_n5.json';
import grammarN4 from '../database/grammar_n4.json';

const BUNDLED = [...grammarN5, ...grammarN4].map((g) => ({ id: `grammar-${g.level}-${g.nomor}`, ...g }));

export function useGrammarData() {
  return { grammarList: BUNDLED };
}

export function useGrammarByLevel(level) {
  const data = useMemo(
    () => BUNDLED.filter((g) => g.level === level).sort((a, b) => a.nomor - b.nomor),
    [level]
  );
  return { data };
}
