import { useState, useEffect, useMemo } from 'react';
import kanjiN5 from '../database/kanji_n5.json';
import kanjiN4 from '../database/kanji_n4.json';

// Data dibundel langsung ke aplikasi (offline-first) supaya kanji tetap bisa
// dipelajari tanpa koneksi internet setelah PWA di-install.
// id dibuat konsisten dari level+nomor supaya tidak bentrok dengan id di D1.
const BUNDLED = [...kanjiN5, ...kanjiN4].map((k, idx) => ({
  id: k.id ?? `${k.level}-${k.nomor}`,
  ...k
}));

/**
 * Hook untuk mengambil seluruh data kanji.
 * Strategi: pakai data bundel (offline-first & instan), lalu secara diam-diam
 * coba sinkron dari Worker API (/api/kanji) jika online — berguna saat data
 * di D1 sudah diperbarui/di-import lebih lengkap dari server.
 */
export function useKanjiData() {
  const [kanjiList, setKanjiList] = useState(BUNDLED);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('bundled'); // 'bundled' | 'api'

  useEffect(() => {
    let cancelled = false;
    async function trySync() {
      try {
        setLoading(true);
        const res = await fetch('/api/kanji', { signal: AbortSignal.timeout(4000) });
        if (!res.ok) throw new Error('API tidak tersedia');
        const json = await res.json();
        if (!cancelled && Array.isArray(json.data) && json.data.length > 0) {
          // Normalisasi id supaya sama dengan skema id data bundel (level-nomor).
          // Ini penting agar progress/favorit yang tersimpan di Local Storage tetap
          // cocok baik saat memakai data offline (bundel) maupun data dari API/D1.
          const normalized = json.data.map((k) => ({ ...k, id: `${k.level}-${k.nomor}` }));
          setKanjiList(normalized);
          setSource('api');
        }
      } catch (err) {
        // Diam-diam gagal -> tetap pakai data bundel (mode offline)
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    trySync();
    return () => { cancelled = true; };
  }, []);

  return { kanjiList, loading, source };
}

/** Ambil daftar kanji untuk 1 level saja, terurut berdasarkan nomor */
export function useKanjiByLevel(level) {
  const { kanjiList, loading, source } = useKanjiData();
  const data = useMemo(
    () => kanjiList.filter((k) => k.level === level).sort((a, b) => a.nomor - b.nomor),
    [kanjiList, level]
  );
  return { data, loading, source };
}
