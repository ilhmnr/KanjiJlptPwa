import { useMemo } from 'react';
import kotobaRaw from '../database/kotoba_mina_no_nihongo.json';

export const TOTAL_BAB = 50; // Minna no Nihongo I & II: Bab 1 - 50

// Tambahkan id unik yang stabil (bab + urutan dalam bab) supaya konsisten
// dipakai sebagai key progress/favorit, sama seperti skema pada data kanji.
const BUNDLED = (() => {
  const counters = {};
  return kotobaRaw.map((item) => {
    counters[item.bab] = (counters[item.bab] || 0) + 1;
    return { id: `kotoba-${item.bab}-${counters[item.bab]}`, ...item };
  });
})();

/** Ambil seluruh data kosakata Minna no Nihongo (semua bab yang sudah tersedia) */
export function useKotobaData() {
  return { kotobaList: BUNDLED };
}

/** Ambil daftar kosakata untuk 1 bab tertentu */
export function useKotobaByBab(bab) {
  const data = useMemo(
    () => BUNDLED.filter((k) => k.bab === Number(bab)),
    [bab]
  );
  return { data };
}

/** Ringkasan jumlah kata per bab, untuk ditampilkan di daftar Bab 1-50 */
export function useKotobaBabSummary() {
  return useMemo(() => {
    const summary = {};
    for (let i = 1; i <= TOTAL_BAB; i++) summary[i] = 0;
    BUNDLED.forEach((k) => { summary[k.bab] = (summary[k.bab] || 0) + 1; });
    return summary;
  }, []);
}
