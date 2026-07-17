// Konversi file JSON kanji (src/database/kanji_n5.json / kanji_n4.json)
// menjadi file SQL INSERT siap dijalankan dengan:
//   wrangler d1 execute kanji-db --remote --file=src/database/seed_n5.sql
//
// Jalankan: node scripts/json-to-sql.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, '..', 'src', 'database');

// Escape single-quote untuk SQLite
function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function buildInsert(rows) {
  const cols = [
    'level', 'nomor', 'kanji', 'onyomi', 'kunyomi',
    'romaji_onyomi', 'romaji_kunyomi', 'arti',
    'contoh_kata', 'contoh_hiragana', 'contoh_arti'
  ];
  const values = rows.map(r => `(${cols.map(c => esc(r[c])).join(', ')})`).join(',\n  ');
  return `INSERT INTO kanji (${cols.join(', ')}) VALUES\n  ${values};\n`;
}

for (const level of ['n5', 'n4']) {
  const jsonPath = path.join(DB_DIR, `kanji_${level}.json`);
  const data = JSON.parse(readFileSync(jsonPath, 'utf-8'));
  const sql = `-- Auto-generated dari kanji_${level}.json — jangan edit manual, edit file JSON lalu jalankan ulang script ini\n` +
    `DELETE FROM kanji WHERE level = '${level.toUpperCase()}';\n` +
    buildInsert(data);
  const outPath = path.join(DB_DIR, `seed_${level}.sql`);
  writeFileSync(outPath, sql, 'utf-8');
  console.log(`Generated ${outPath} (${data.length} kanji)`);
}
