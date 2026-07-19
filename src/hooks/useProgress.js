import { useLocalStorage } from './useLocalStorage';
import { useCallback } from 'react';

// Struktur progress: { [kanjiId]: { learned: boolean, favorite: boolean } }
const PROGRESS_KEY = 'kanji_progress_v1';
const LAST_POSITION_KEY = 'kanji_last_position_v1';
const USER_ID_KEY = 'kanji_anon_user_id';

// Buat / ambil id anonim untuk keperluan sinkronisasi progress ke API (opsional, best-effort)
function getAnonUserId() {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = 'anon-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

// Kirim progress ke Worker API secara diam-diam (tidak memblokir UI, boleh gagal jika offline)
function syncToApi(kanjiId, { learned, favorite }) {
  fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: getAnonUserId(),
      kanji_id: kanjiId,
      is_learned: !!learned,
      is_favorite: !!favorite
    })
  }).catch(() => {
    /* offline / API belum di-deploy — abaikan, data tetap aman di Local Storage */
  });
}

export function useProgress() {
  const [progress, setProgress] = useLocalStorage(PROGRESS_KEY, {});
  const [lastPosition, setLastPosition] = useLocalStorage(LAST_POSITION_KEY, null);

  const isLearned = useCallback((id) => !!progress[id]?.learned, [progress]);
  const isFavorite = useCallback((id) => !!progress[id]?.favorite, [progress]);

  const toggleLearned = useCallback((id) => {
    setProgress((prev) => {
      const current = prev[id] || { learned: false, favorite: false };
      const updated = { ...current, learned: !current.learned };
      syncToApi(id, updated);
      return { ...prev, [id]: updated };
    });
  }, [setProgress]);

  const toggleFavorite = useCallback((id) => {
    setProgress((prev) => {
      const current = prev[id] || { learned: false, favorite: false };
      const updated = { ...current, favorite: !current.favorite };
      syncToApi(id, updated);
      return { ...prev, [id]: updated };
    });
  }, [setProgress]);

  // Simpan posisi terakhir belajar, ditampilkan sebagai tombol "Lanjutkan Belajar" di beranda.
  // type: 'kanji' | 'kosakata' | 'tatabahasa'
  const saveLastPosition = useCallback((type, level, nomor) => {
    setLastPosition({ type, level, nomor, timestamp: Date.now() });
  }, [setLastPosition]);

  const learnedCount = Object.values(progress).filter((p) => p.learned).length;
  const favoriteIds = Object.entries(progress).filter(([, v]) => v.favorite).map(([id]) => id);

  return {
    progress,
    isLearned,
    isFavorite,
    toggleLearned,
    toggleFavorite,
    lastPosition,
    saveLastPosition,
    learnedCount,
    favoriteIds
  };
}
