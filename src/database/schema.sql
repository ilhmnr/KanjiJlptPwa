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

-- Tabel kosakata (kotoba) Minna no Nihongo, dikelompokkan per Bab (1-50)
CREATE TABLE IF NOT EXISTS kotoba (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bab INTEGER NOT NULL,                    -- nomor bab, 1-50
  nomor INTEGER NOT NULL,                  -- urutan kata dalam bab
  kotoba TEXT NOT NULL,                    -- kata dalam huruf Jepang, contoh: わたし
  furigana TEXT,                            -- cara baca (hiragana/katakana)
  romaji TEXT,                              -- romanisasi, contoh: watashi
  jenis_kata TEXT,                          -- kelas kata, contoh: kata benda / kata kerja
  arti TEXT NOT NULL,                       -- arti dalam Bahasa Indonesia
  contoh_kalimat TEXT,                      -- kalimat contoh
  contoh_kalimat_arti TEXT,                 -- arti kalimat contoh
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_kotoba_bab ON kotoba(bab);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kotoba_bab_nomor ON kotoba(bab, nomor);

-- Tabel kosakata JLPT (N5/N4), materi orisinal berbasis silabus JLPT (bukan dari buku tertentu)
CREATE TABLE IF NOT EXISTS kosakata (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL CHECK (level IN ('N5', 'N4')),
  nomor INTEGER NOT NULL,
  kata TEXT NOT NULL,                       -- kata dalam hiragana/katakana, contoh: たべる
  kanji TEXT,                                -- bentuk kanji jika ada, "-" jika tidak ada
  hiragana TEXT,                             -- cara baca
  romaji TEXT,
  arti TEXT NOT NULL,
  kelas_kata TEXT,                           -- kata benda / kata kerja / kata sifat / dst
  contoh_kalimat TEXT,                       -- kalimat contoh orisinal
  contoh_hiragana TEXT,
  contoh_arti TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_kosakata_level ON kosakata(level);
CREATE UNIQUE INDEX IF NOT EXISTS idx_kosakata_level_nomor ON kosakata(level, nomor);

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
