/**
 * Cloudflare Worker - API untuk Aplikasi JLPT N5 & N4
 * ---------------------------------------------------
 * Endpoint yang tersedia:
 *   GET  /api/kanji?level=N5              -> daftar semua kanji pada level tertentu
 *   GET  /api/kanji?level=N5&search=besar -> pencarian (kanji/arti/onyomi/kunyomi)
 *   GET  /api/kanji/:id                   -> detail 1 kanji
 *   GET  /api/kosakata?level=N5           -> daftar kosakata JLPT pada level tertentu
 *   GET  /api/kotoba?bab=1                -> daftar kosakata Minna no Nihongo per bab
 *   GET  /api/stats?level=N5              -> statistik jumlah kanji per level
 *   POST /api/progress                    -> simpan/update progress belajar user (sinkronisasi)
 *   GET  /api/progress/:userId            -> ambil semua progress milik user
 *
 * Database: Cloudflare D1 (binding "DB", lihat wrangler.toml)
 */

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };

// Helper: bungkus response JSON + CORS supaya bisa diakses dari Cloudflare Pages domain lain saat dev
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...JSON_HEADERS,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // Preflight CORS
    if (method === 'OPTIONS') {
      return jsonResponse({}, 204);
    }

    try {
      // GET /api/kanji  atau  GET /api/kanji/:id
      if (pathname === '/api/kanji' && method === 'GET') {
        return await handleGetKanjiList(url, env);
      }
      const kanjiDetailMatch = pathname.match(/^\/api\/kanji\/(\d+)$/);
      if (kanjiDetailMatch && method === 'GET') {
        return await handleGetKanjiDetail(kanjiDetailMatch[1], env);
      }

      // GET /api/kotoba  (kosakata Minna no Nihongo, filter dengan ?bab=1)
      if (pathname === '/api/kotoba' && method === 'GET') {
        return await handleGetKotobaList(url, env);
      }

      // GET /api/kosakata  (kosakata JLPT N5/N4, filter dengan ?level=N5)
      if (pathname === '/api/kosakata' && method === 'GET') {
        return await handleGetKosakataList(url, env);
      }

      // GET /api/stats
      if (pathname === '/api/stats' && method === 'GET') {
        return await handleGetStats(url, env);
      }

      // POST /api/progress  (sinkronisasi progress user)
      if (pathname === '/api/progress' && method === 'POST') {
        return await handleSaveProgress(request, env);
      }

      // GET /api/progress/:userId
      const progressMatch = pathname.match(/^\/api\/progress\/([\w-]+)$/);
      if (progressMatch && method === 'GET') {
        return await handleGetProgress(progressMatch[1], env);
      }

      return jsonResponse({ error: 'Endpoint tidak ditemukan' }, 404);
    } catch (err) {
      console.error(err);
      return jsonResponse({ error: 'Terjadi kesalahan pada server', detail: String(err) }, 500);
    }
  }
};

// ------------------------------------------------------------------
// Handlers
// ------------------------------------------------------------------

async function handleGetKanjiList(url, env) {
  const level = url.searchParams.get('level'); // N5 / N4
  const search = url.searchParams.get('search');
  const from = url.searchParams.get('from'); // nomor awal (untuk mode "per 10 kanji")
  const to = url.searchParams.get('to');     // nomor akhir

  let query = 'SELECT * FROM kanji WHERE 1=1';
  const params = [];

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }

  if (search) {
    query += ' AND (kanji LIKE ? OR arti LIKE ? OR onyomi LIKE ? OR kunyomi LIKE ? OR romaji_onyomi LIKE ? OR romaji_kunyomi LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like, like, like, like);
  }

  if (from && to) {
    query += ' AND nomor BETWEEN ? AND ?';
    params.push(Number(from), Number(to));
  }

  query += ' ORDER BY level, nomor ASC';

  const stmt = env.DB.prepare(query).bind(...params);
  const { results } = await stmt.all();
  return jsonResponse({ data: results, total: results.length });
}

async function handleGetKotobaList(url, env) {
  const bab = url.searchParams.get('bab');       // filter 1 bab tertentu
  const search = url.searchParams.get('search');

  let query = 'SELECT * FROM kotoba WHERE 1=1';
  const params = [];

  if (bab) {
    query += ' AND bab = ?';
    params.push(Number(bab));
  }

  if (search) {
    query += ' AND (kotoba LIKE ? OR arti LIKE ? OR romaji LIKE ? OR furigana LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }

  query += ' ORDER BY bab, nomor ASC';

  const { results } = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ data: results, total: results.length });
}

async function handleGetKosakataList(url, env) {
  const level = url.searchParams.get('level');
  const search = url.searchParams.get('search');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  let query = 'SELECT * FROM kosakata WHERE 1=1';
  const params = [];

  if (level) {
    query += ' AND level = ?';
    params.push(level);
  }
  if (search) {
    query += ' AND (kata LIKE ? OR arti LIKE ? OR romaji LIKE ? OR hiragana LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like, like);
  }
  if (from && to) {
    query += ' AND nomor BETWEEN ? AND ?';
    params.push(Number(from), Number(to));
  }

  query += ' ORDER BY level, nomor ASC';

  const { results } = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ data: results, total: results.length });
}

async function handleGetKanjiDetail(id, env) {
  const stmt = env.DB.prepare('SELECT * FROM kanji WHERE id = ?').bind(id);
  const result = await stmt.first();
  if (!result) return jsonResponse({ error: 'Kanji tidak ditemukan' }, 404);
  return jsonResponse({ data: result });
}

async function handleGetStats(url, env) {
  const level = url.searchParams.get('level');
  let query = 'SELECT level, COUNT(*) as total FROM kanji';
  const params = [];
  if (level) {
    query += ' WHERE level = ?';
    params.push(level);
  }
  query += ' GROUP BY level';
  const { results } = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ data: results });
}

async function handleSaveProgress(request, env) {
  const body = await request.json();
  const { user_id, kanji_id, is_learned, is_favorite } = body;

  if (!user_id || !kanji_id) {
    return jsonResponse({ error: 'user_id dan kanji_id wajib diisi' }, 400);
  }

  // Upsert: pakai unique index (user_id, kanji_id)
  await env.DB.prepare(
    `INSERT INTO progress (user_id, kanji_id, is_learned, is_favorite, last_viewed_at, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
     ON CONFLICT(user_id, kanji_id) DO UPDATE SET
       is_learned = excluded.is_learned,
       is_favorite = excluded.is_favorite,
       last_viewed_at = datetime('now'),
       updated_at = datetime('now')`
  ).bind(user_id, kanji_id, is_learned ? 1 : 0, is_favorite ? 1 : 0).run();

  return jsonResponse({ success: true });
}

async function handleGetProgress(userId, env) {
  const { results } = await env.DB.prepare('SELECT * FROM progress WHERE user_id = ?').bind(userId).all();
  return jsonResponse({ data: results });
}
