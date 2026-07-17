# 漢字 Kanji JLPT N5 & N4 — PWA

Aplikasi Progressive Web App (PWA) untuk menghafal Kanji JLPT N5 dan N4. Dibangun dengan React + Vite, di-hosting di **Cloudflare Pages**, dengan API di **Cloudflare Workers** dan database **Cloudflare D1** — semuanya di tier gratis.

Bisa langsung dipakai offline setelah dibuka pertama kali, dan bisa "Ditambahkan ke Layar Utama" dari Chrome Android supaya terasa seperti aplikasi native.

---

## ✨ Fitur

- Beranda dengan pilihan level **N5** / **N4**
- Mode **Semua Kanji** atau **Belajar Per 10 Kanji** (dibagi per bagian)
- Halaman belajar 1 kanji per layar, navigasi **swipe kiri/kanan** + tombol Sebelumnya/Berikutnya
- **Flashcard** (tap untuk membalik kartu)
- **Quiz** 2 arah: Kanji → Arti dan Arti → Kanji
- Tandai **⭐ Favorit** dan **✔ Sudah Hafal**
- **Pencarian** berdasarkan kanji / arti / onyomi / kunyomi
- **Statistik**: total kanji, sudah dipelajari, favorit, progress %
- **Filter**: Semua / Belum Dipelajari / Favorit / Sudah Hafal
- **Mode Gelap**
- Progress tersimpan di **Local Storage** (offline-first) + endpoint sinkronisasi ke D1 untuk pengembangan fitur akun di masa depan
- **Installable PWA**: manifest.json + Service Worker + ikon aplikasi + berjalan offline

---

## 🗂️ Struktur Proyek

```
kanji-jlpt-pwa/
├── src/
│   ├── components/     # Komponen UI kecil & reusable (Card, ProgressBar, dsb)
│   ├── pages/           # Halaman/route aplikasi (Home, Study, Quiz, dst)
│   ├── hooks/            # Custom hooks (localStorage, data kanji, swipe, progress)
│   ├── database/        # Skema SQL, data kanji (JSON) & seed SQL hasil generate
│   └── styles/           # global.css (design tokens, semua styling)
├── workers/
│   └── index.js          # Cloudflare Worker (REST API)
├── scripts/
│   └── json-to-sql.mjs   # Konversi kanji_n5.json/kanji_n4.json -> seed SQL
├── public/
│   └── icons/            # Ikon PWA (192, 512, maskable, apple-touch)
├── wrangler.toml         # Konfigurasi Cloudflare Workers + binding D1
├── vite.config.js        # Konfigurasi Vite + vite-plugin-pwa (manifest & service worker)
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
Buka di `http://localhost:5173`. Aplikasi akan tetap berjalan memakai **data kanji bundel** (offline-first) walau Worker API belum aktif.

### 3. (Opsional) Jalankan Worker API secara lokal
```bash
npm run worker:dev
```
Ini menjalankan Worker di `http://127.0.0.1:8787`, dan Vite dev server sudah dikonfigurasi untuk mem-proxy `/api/*` ke sana.

> Untuk development lokal dengan D1, tambahkan `--local` pada perintah wrangler atau buat database lokal terlebih dahulu (lihat langkah deploy di bawah — bisa dipakai juga untuk lokal dengan flag `--local`).

---

## ☁️ Deploy ke Cloudflare (100% Gratis)

### Langkah 1 — Install & Login Wrangler
```bash
npm install -g wrangler   # atau pakai npx wrangler
wrangler login
```

### Langkah 2 — Buat Database D1
```bash
npm run db:create
```
Perintah ini akan menampilkan `database_id`. Salin nilai tersebut ke `wrangler.toml`, ganti bagian:
```toml
database_id = "GANTI_DENGAN_DATABASE_ID_ANDA"
```

### Langkah 3 — Jalankan Migrasi Skema
```bash
npm run db:migrate:remote
```

### Langkah 4 — Import Data Kanji
Data awal (starter set) sudah disediakan di `src/database/kanji_n5.json` dan `kanji_n4.json`. Untuk menambah/mengedit kanji, cukup ubah file JSON tersebut lalu generate ulang file SQL:
```bash
node scripts/json-to-sql.mjs
npm run db:seed:n5
npm run db:seed:n4
```

> **Catatan:** Dataset yang disertakan adalah starter set (50 kanji N5, 30 kanji N4) sebagai contoh struktur data yang valid dan siap pakai. Silakan lengkapi hingga 103 kanji N5 dan 170 kanji N4 sesuai daftar resmi JLPT dengan menambah entri pada file JSON tersebut (format sudah konsisten, tinggal disalin/ditambah), lalu jalankan ulang perintah di atas.

### Langkah 5 — Deploy Worker (API)
```bash
npm run worker:deploy
```
Catat URL Worker yang muncul, contoh: `https://kanji-jlpt-api.<akun-anda>.workers.dev`.

### Langkah 6 — Deploy Frontend ke Cloudflare Pages
```bash
npm run pages:deploy
```
Atau hubungkan repo GitHub Anda ke **Cloudflare Pages** dari dashboard untuk deploy otomatis setiap push (build command: `npm run build`, output directory: `dist`).

### Langkah 7 — Hubungkan Frontend ke Worker
Aplikasi memanggil endpoint relatif `/api/...`. Agar Cloudflare Pages meneruskan `/api/*` ke Worker, tambahkan **Pages Function** sederhana atau gunakan **Service Binding**, atau paling mudah: gunakan fitur **Cloudflare Pages + Workers routes** dengan menambahkan custom domain yang sama untuk keduanya dan mengatur route `yourdomain.com/api/*` mengarah ke Worker.
Alternatif tercepat: set variabel lingkungan `VITE_API_BASE_URL` ke URL Worker dari Langkah 5, lalu sesuaikan `fetch('/api/...')` menjadi `fetch(`${import.meta.env.VITE_API_BASE_URL}/api/...`)` di `src/hooks/useKanjiData.js` dan `src/hooks/useProgress.js` jika ingin Worker dan Pages berada di domain terpisah.

> Aplikasi tetap berfungsi penuh (offline-first) walau langkah ini dilewati — data kanji bawaan sudah cukup untuk belajar. Endpoint API disiapkan untuk pengembangan fitur akun/sinkronisasi lintas perangkat di masa depan.

---

## 📲 Cara Install di Android (dari Chrome)

1. Buka URL aplikasi (hasil deploy Cloudflare Pages) di Chrome Android.
2. Ketuk menu titik tiga (⋮) di pojok kanan atas.
3. Pilih **"Tambahkan ke Layar Utama"** (Add to Home screen).
4. Aplikasi akan muncul sebagai ikon di layar utama dan bisa dibuka seperti aplikasi native, termasuk saat offline.

---

## 🧩 Menambah / Mengedit Data Kanji

1. Edit `src/database/kanji_n5.json` atau `kanji_n4.json` — tambahkan objek baru mengikuti struktur yang sudah ada (`level`, `nomor`, `kanji`, `onyomi`, `kunyomi`, `romaji_onyomi`, `romaji_kunyomi`, `arti`, `contoh_kata`, `contoh_hiragana`, `contoh_arti`).
2. Jalankan `node scripts/json-to-sql.mjs` untuk membuat ulang file seed SQL.
3. Jalankan `npm run db:seed:n5` / `npm run db:seed:n4` untuk memperbarui data di D1 (jika memakai Worker API).
4. `npm run build` ulang agar data bundel offline juga ikut ter-update (karena JSON di-import langsung ke bundle frontend).

---

## 🛠️ Teknologi

| Bagian      | Teknologi                              |
|-------------|------------------------------------------|
| Frontend    | React 18 + Vite + React Router          |
| Styling     | CSS murni dengan CSS variables (design tokens) |
| PWA         | vite-plugin-pwa (Workbox) — manifest & service worker otomatis |
| Backend/API | Cloudflare Workers                      |
| Database    | Cloudflare D1 (SQLite)                  |
| Hosting     | Cloudflare Pages                        |

Semua menggunakan tier gratis Cloudflare.

---

## 📌 Catatan Pengembangan Lanjutan

- Endpoint `POST /api/progress` & `GET /api/progress/:userId` sudah siap dipakai untuk fitur login/akun — saat ini progress disimpan dengan id anonim per perangkat (`kanji_anon_user_id` di Local Storage) dan disinkronkan secara best-effort ke D1.
- Struktur kode dipisah per tanggung jawab (`components`, `pages`, `hooks`, `database`, `workers`) agar mudah dikembangkan, misalnya menambah level JLPT lain (N3/N2/N1) cukup dengan menambah file JSON baru dan sedikit penyesuaian di `useKanjiData.js`.
# KanjiJlptPwa
