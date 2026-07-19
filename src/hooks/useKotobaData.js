import { useMemo } from 'react';
import kotobaRaw from '../database/kotoba_minna.json';

export const TOTAL_BAB = 50; // Minna no Nihongo I & II: Bab 1 - 50

// Tambahkan id unik & stabil (bab + nomor) supaya konsisten dipakai sebagai key progress/favorit
const BUNDLED = kotobaRaw.map((item) => ({ id: `kotoba-${item.bab}-${item.nomor}`, ...item }));

/** Ambil seluruh data kosakata Minna no Nihongo (semua bab yang sudah tersedia) */
export function useKotobaData() {
  return { kotobaList: BUNDLED };
}

/** Ambil daftar kosakata untuk 1 bab tertentu, terurut berdasarkan nomor */
export function useKotobaByBab(bab) {
  const data = useMemo(
    () => BUNDLED.filter((k) => k.bab === Number(bab)).sort((a, b) => a.nomor - b.nomor),
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
