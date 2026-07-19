import { useState, useEffect, useCallback } from 'react';

/**
 * Hook generik untuk menyimpan & membaca state dari Local Storage.
 * Semua progress belajar, favorit, dan preferensi tema disimpan lewat hook ini
 * agar aplikasi tetap berfungsi walau offline / tanpa akun.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch (err) {
      console.warn(`Gagal membaca localStorage key "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Gagal menyimpan localStorage key "${key}":`, err);
    }
  }, [key, value]);

  const updateValue = useCallback((newValue) => {
    setValue((prev) => (typeof newValue === 'function' ? newValue(prev) : newValue));
  }, []);

  return [value, updateValue];
}
