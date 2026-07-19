-- ============================================================
-- Schema Database Kanji JLPT (Cloudflare D1 / SQLite)
-- ============================================================

-- Tabel utama data kanji (N5 / N4)
CREATE TABLE IF NOT EXISTS kanji (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL CHECK (level IN ('N5', 'N4')),   -- level JLPT
  nomor INTEGER NOT NULL,                               -- urutan dalam level (1, 2, 3, ...)
  kanji TEXT NOT NULL,                                  -- karakter kanji, contoh: 大
  onyomi TEXT,                                           -- cara baca on'yomi (katakana), contoh: ダイ
  kunyomi TEXT,                                          -- cara baca kun'yomi (hiragana), contoh: おお
  romaji_onyomi TEXT,                                    -- romaji dari onyomi, contoh: dai
  romaji_kunyomi TEXT,                                   -- romaji dari kunyomi, contoh: oo
  arti TEXT NOT NULL,                                    -- arti dalam Bahasa Indonesia, contoh: Besar
  contoh_kata TEXT,                                       -- kata contoh, contoh: 大学
  contoh_hiragana TEXT,                                   -- cara baca kata contoh, contoh: だいがく
  contoh_arti TEXT,                                       -- arti kata contoh, contoh: Universitas
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_kanji_level ON kanji(level);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kanji_level_nomor ON kanji(level, nomor);

-- Tabel user sederhana (untuk fitur sinkronisasi akun di masa depan)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,             -- uuid, dibuat di sisi client atau saat registrasi
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabel progress belajar per user, mirror dari data di Local Storage
-- Memungkinkan sinkronisasi progress lintas perangkat setelah user login
CREATE TABLE IF NOT EXISTS progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  kanji_id TEXT NOT NULL,                  -- format "LEVEL-NOMOR", contoh "N5-13" (sama dengan id di frontend)
  is_learned INTEGER NOT NULL DEFAULT 0,   -- 1 = sudah hafal
  is_favorite INTEGER NOT NULL DEFAULT 0,  -- 1 = favorit
  last_viewed_at TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_kanji ON progress(user_id, kanji_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
