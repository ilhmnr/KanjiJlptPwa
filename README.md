# JLPT N5 & N4 — PWA (Kanji · Kosakata · Kotoba)

Aplikasi Progressive Web App (PWA) untuk belajar JLPT N5 dan N4, dibangun berbasis **silabus JLPT** (bukan disalin dari satu buku tertentu) supaya materinya lengkap, netral, dan aman dari sisi hak cipta — semua penjelasan & contoh kalimat dibuat orisinal.

Dibangun dengan React + Vite, di-hosting di **Cloudflare Pages**, dengan API di **Cloudflare Workers** dan database **Cloudflare D1** — semuanya di tier gratis. Bisa dipakai offline setelah dibuka pertama kali, dan bisa "Ditambahkan ke Layar Utama" dari Chrome Android supaya terasa seperti aplikasi native.

---

## 🗺️ Struktur Materi & Status

Aplikasi ini dikembangkan bertahap mengikuti struktur berikut. Modul yang sudah aktif ditandai ✅, yang fondasinya sudah disiapkan tapi belum ditampilkan di UI ditandai 🧩, dan yang belum digarap ditandai ⏳.

```
Kanji            ✅ N5 (starter 50/103) · N4 (starter 30/181)
Kosakata JLPT    ✅ N5 (starter 30/~800) · N4 (starter 25/~800)
Kotoba Minna no Nihongo  ✅ Bab 1-50 (starter, sebagian bab terisi)
Tata Bahasa      🧩 Data & komponen tampilan sudah ada (grammar_n5.json/n4.json, GrammarHero),
                    belum dihubungkan ke menu/route
Reading          🧩 Data contoh sudah ada (reading_n5.json/n4.json: bacaan + soal pilihan ganda),
                    belum dihubungkan ke menu/route
Listening        ⏳ Belum digarap. Rencana: Text-to-Speech browser (Web Speech API),
                    tanpa perlu file audio — pondasinya (SpeakButton, hooks/speech.js) sudah dipakai
                    di Kanji/Kosakata/Kotoba untuk latihan pelafalan
Kuis             ✅ Kanji & Kosakata (2 arah: kata↔arti). Tata Bahasa/Reading menyusul.
```

> Kenapa bertahap? Supaya tiap modul bisa direview sebelum lanjut ke modul berikutnya. Modul Tata Bahasa & Reading sengaja belum ditampilkan di Beranda (masih ditandai "Segera Hadir") walau datanya sudah disiapkan, supaya tidak ada tautan yang rusak.

---

## ✨ Fitur yang Sudah Aktif

- Beranda terstruktur per kategori: **Kanji**, **Kosakata**, **Kotoba Mina no Nihongo**, + roadmap modul lainnya
- Mode **Semua Materi** atau **Belajar Per 10** (dibagi per bagian) untuk Kanji & Kosakata
- **Kotoba Mina no Nihongo**: kosakata Bab 1-50, bisa dipelajari **Per Bab** atau **Semua Bab**
- Halaman belajar 1 item per layar, navigasi **swipe kiri/kanan** + tombol Sebelumnya/Berikutnya
- **🔊 Dengarkan** — pelafalan kata/kalimat memakai Text-to-Speech browser (Web Speech API), tanpa file audio
- **Flashcard** (khusus Kanji, tap untuk membalik kartu)
- **Kuis** pilihan ganda 2 arah untuk Kanji & Kosakata
- Tandai **⭐ Favorit** dan **✔ Sudah Hafal** — berlaku di Kanji, Kosakata, maupun Kotoba
- **Pencarian terpadu** merangkum Kanji + Kosakata + Kotoba sekaligus
- **Statistik** gabungan: total materi, sudah dipelajari, favorit, progress %
- **Filter**: Semua / Belum Dipelajari / Favorit / Sudah Hafal
- **Mode Gelap**
- Progress tersimpan di **Local Storage** (offline-first) + endpoint sinkronisasi ke D1 untuk fitur akun di masa depan
- **Installable PWA**: manifest.json + Service Worker + ikon aplikasi + berjalan offline

---

## 🗂️ Struktur Proyek

```
kanji-jlpt-pwa/
├── src/
│   ├── components/       # KanjiHero, VocabHero, KotobaHero, GrammarHero, SpeakButton, dsb
│   ├── pages/             # Halaman/route (Home, Study, Kosakata*, Kotoba*, Quiz, dst)
│   ├── hooks/              # useKanjiData, useKosakataData, useKotobaData, useGrammarData,
│   │                        useReadingData, useProgress, speech.js (TTS), dsb
│   ├── database/          # Skema SQL + data JSON per modul + seed SQL hasil generate
│   └── styles/             # global.css (design tokens, semua styling)
├── workers/
│   └── index.js            # Cloudflare Worker (REST API: kanji, kosakata, kotoba, progress)
├── scripts/
│   └── json-to-sql.mjs     # Konversi semua file JSON di database/ -> seed SQL
├── public/
│   └── icons/               # Ikon PWA (192, 512, maskable, apple-touch)
├── wrangler.toml            # Konfigurasi Cloudflare Workers + binding D1
├── vite.config.js           # Konfigurasi Vite + vite-plugin-pwa (manifest & service worker)
└── package.json
```

---

## 🚀 Menjalankan di Lokal

### 1. Install dependensi
```bash
npm install
```

### 2. Jalankan frontend (Vite dev server)
```bash
npm run dev
```
Buka di `http://localhost:5173`. Aplikasi tetap berjalan memakai **data bundel offline-first** walau Worker API belum aktif.

### 3. (Opsional) Jalankan Worker API secara lokal
```bash
npm run worker:dev
```
Worker berjalan di `http://127.0.0.1:8787`; Vite dev server sudah dikonfigurasi mem-proxy `/api/*` ke sana.

---

## ☁️ Deploy ke Cloudflare (100% Gratis)

### Langkah 1 — Install & Login Wrangler
```bash
npm install -g wrangler
wrangler login
```

### Langkah 2 — Buat Database D1
```bash
npm run db:create
```
Salin `database_id` yang muncul ke `wrangler.toml`, ganti:
```toml
database_id = "GANTI_DENGAN_DATABASE_ID_ANDA"
```

### Langkah 3 — Jalankan Migrasi Skema
```bash
npm run db:migrate:remote
```
Ini membuat tabel `kanji`, `kosakata`, `kotoba`, `users`, dan `progress`.

### Langkah 4 — Import Data
```bash
node scripts/json-to-sql.mjs   # generate ulang semua file seed SQL dari JSON terbaru
npm run db:seed:n5
npm run db:seed:n4
npm run db:seed:kosakata:n5
npm run db:seed:kosakata:n4
npm run db:seed:kotoba
```

### Langkah 5 — Deploy Worker (API)
```bash
npm run worker:deploy
```

### Langkah 6 — Deploy Frontend ke Cloudflare Pages
```bash
npm run pages:deploy
```
Atau hubungkan repo GitHub ke **Cloudflare Pages** untuk deploy otomatis (build command: `npm run build`, output: `dist`).

### Langkah 7 — Hubungkan Frontend ke Worker
Aplikasi memanggil endpoint relatif `/api/...`. Supaya Pages meneruskan `/api/*` ke Worker, gunakan custom domain yang sama untuk keduanya + Worker route `yourdomain.com/api/*`, atau set `VITE_API_BASE_URL` dan sesuaikan pemanggilan `fetch()` di hooks bila Worker dan Pages berada di domain terpisah.

> Aplikasi tetap berfungsi penuh secara offline walau langkah ini dilewati — data bundel sudah cukup untuk belajar.

---

## 📲 Cara Install di Android (dari Chrome)

1. Buka URL aplikasi (hasil deploy Cloudflare Pages) di Chrome Android.
2. Ketuk menu titik tiga (⋮) di pojok kanan atas.
3. Pilih **"Tambahkan ke Layar Utama"**.
4. Aplikasi muncul di layar utama dan bisa dibuka seperti aplikasi native, termasuk saat offline.

---

## 🧩 Menambah / Mengedit Data

Semua data ada di `src/database/*.json`. Format setiap file konsisten (lihat entri pertama sebagai contoh). Setelah mengedit:

| File | Menambah materi untuk |
|---|---|
| `kanji_n5.json` / `kanji_n4.json` | Kanji |
| `kosakata_n5.json` / `kosakata_n4.json` | Kosakata JLPT |
| `kotoba_minna.json` | Kotoba Minna no Nihongo (field `bab` 1-50) |
| `grammar_n5.json` / `grammar_n4.json` | Tata Bahasa (belum tersambung ke UI) |
| `reading_n5.json` / `reading_n4.json` | Reading (belum tersambung ke UI) |

Langkah setelah edit JSON:
1. `node scripts/json-to-sql.mjs` — generate ulang seed SQL.
2. `npm run db:seed:...` (sesuai modul) — perbarui data di D1, jika memakai Worker API.
3. `npm run build` ulang agar data bundel offline juga ter-update (JSON di-import langsung ke bundle frontend, jadi build baru diperlukan supaya versi offline ikut berubah).

**Catatan penting:** dataset yang disertakan untuk setiap modul adalah *starter set* — contoh struktur data yang valid dan berfungsi penuh, bukan daftar lengkap resmi JLPT (~103/181 kanji, ~800/800 kosakata). Silakan lengkapi bertahap dengan menambah entri baru mengikuti format yang sudah ada.

---

## 🛠️ Teknologi

| Bagian      | Teknologi                              |
|-------------|------------------------------------------|
| Frontend    | React 18 + Vite + React Router          |
| Styling     | CSS murni dengan CSS variables (design tokens) |
| PWA         | vite-plugin-pwa (Workbox) — manifest & service worker otomatis |
| Text-to-Speech | Web Speech API bawaan browser (tanpa file audio) |
| Backend/API | Cloudflare Workers                      |
| Database    | Cloudflare D1 (SQLite)                  |
| Hosting     | Cloudflare Pages                        |

Semua menggunakan tier gratis Cloudflare.

---

## 📌 Rencana Tahap Berikutnya

1. Hubungkan **Tata Bahasa** (data & komponen sudah ada) ke menu Beranda + halaman belajar pola kalimat.
2. Hubungkan **Reading** (data & format soal sudah ada) ke menu Beranda + halaman baca & jawab soal.
3. **Listening**: bangun halaman latihan dengan `SpeakButton`/`hooks/speech.js` yang sudah ada (soal dengar-lalu-jawab, tanpa file audio).
4. Perluas **Kuis** mencakup Tata Bahasa & Reading, plus kemungkinan kuis campuran.
5. Endpoint `POST /api/progress` & `GET /api/progress/:userId` sudah siap dipakai untuk fitur login/akun di masa depan.
