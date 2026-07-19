import React from 'react';
import { useNavigate } from 'react-router-dom';
import LevelCard from '../components/LevelCard.jsx';
import DarkModeToggle from '../components/DarkModeToggle.jsx';
import { useProgress } from '../hooks/useProgress';
import { useKanjiByLevel } from '../hooks/useKanjiData';
import { useKosakataByLevel } from '../hooks/useKosakataData';
import { useGrammarByLevel } from '../hooks/useGrammarData';
import { useReadingByLevel } from '../hooks/useReadingData';

// Bangun rute "Lanjutkan Belajar" sesuai jenis materi yang terakhir dipelajari
const CONTINUE_ROUTE = {
  kanji: (level, nomor) => `/study/${level}?nomor=${nomor}`,
  kosakata: (level, nomor) => `/kosakata-study/${level}?nomor=${nomor}`,
  kotoba: (level, nomor) => `/kotoba/study/${level}?nomor=${nomor}`,
  tatabahasa: (level, nomor) => `/grammar/${level}?nomor=${nomor}`
};
const CONTINUE_LABEL = { kanji: 'Kanji', kosakata: 'Kosakata', kotoba: 'Kotoba', tatabahasa: 'Tata Bahasa' };

function formatContinueSubtitle(type, level) {
  if (type === 'kotoba') return level === 'all' ? 'Semua Bab' : `Bab ${level}`;
  return level;
}

export default function Home() {
  const navigate = useNavigate();
  const { lastPosition } = useProgress();
  const { data: kanjiN5 } = useKanjiByLevel('N5');
  const { data: kanjiN4 } = useKanjiByLevel('N4');
  const { data: kosakataN5 } = useKosakataByLevel('N5');
  const { data: kosakataN4 } = useKosakataByLevel('N4');
  const { data: grammarN5 } = useGrammarByLevel('N5');
  const { data: grammarN4 } = useGrammarByLevel('N4');
  const { data: readingN5 } = useReadingByLevel('N5');
  const { data: readingN4 } = useReadingByLevel('N4');

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>JLPT N5 & N4</h1>
          <p className="text-muted" style={{ margin: '4px 0 0', fontSize: 13.5 }}>
            Kanji, kosakata & kotoba dalam satu aplikasi.
          </p>
        </div>
        <DarkModeToggle />
      </div>

      {lastPosition && CONTINUE_ROUTE[lastPosition.type] && (
        <button
          className="card card-tappable continue-card mb-16"
          onClick={() => navigate(CONTINUE_ROUTE[lastPosition.type](lastPosition.level, lastPosition.nomor))}
        >
          <div>
            <div className="text-muted" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
              Terakhir belajar
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>
              {CONTINUE_LABEL[lastPosition.type]} {formatContinueSubtitle(lastPosition.type, lastPosition.level)}
            </div>
          </div>
          <span className="btn btn-primary" style={{ pointerEvents: 'none' }}>Lanjutkan →</span>
        </button>
      )}

      <div className="home-section-title">Kanji</div>
      <div className="flex-col gap-16">
        <LevelCard level="N5" subtitle="Kanji tingkat dasar" total={kanjiN5.length} unitLabel="kanji" color="#2563EB" to="/level/N5" />
        <LevelCard level="N4" subtitle="Kanji tingkat pemula-menengah" total={kanjiN4.length} unitLabel="kanji" color="#0EA5E9" to="/level/N4" />
      </div>

      <div className="home-section-title">Kosakata</div>
      <div className="flex-col gap-16">
        <LevelCard title="Kosakata N5" subtitle="Kosakata tingkat dasar" total={kosakataN5.length} unitLabel="kata" color="#059669" icon="📗" to="/kosakata/N5" />
        <LevelCard title="Kosakata N4" subtitle="Kosakata tingkat pemula-menengah" total={kosakataN4.length} unitLabel="kata" color="#0D9488" icon="📗" to="/kosakata/N4" />
      </div>

      <div className="home-section-title">Kotoba Mina no Nihongo</div>
      <div className="flex-col gap-16">
        <LevelCard title="Kotoba Mina no Nihongo" subtitle="Kosakata Bab 1 - 50" color="#7C3AED" icon="🈶" to="/kotoba" />
      </div>

      <div className="home-section-title">Tata Bahasa</div>
      <div className="flex-col gap-16">
        <LevelCard title="Tata Bahasa N5" subtitle="Pola kalimat tingkat dasar" total={grammarN5.length} unitLabel="pola" color="#F59E0B" icon="文" to="/grammar/N5" />
        <LevelCard title="Tata Bahasa N4" subtitle="Pola kalimat tingkat pemula-menengah" total={grammarN4.length} unitLabel="pola" color="#EA580C" icon="文" to="/grammar/N4" />
      </div>

      <div className="home-section-title">Reading</div>
      <div className="flex-col gap-16">
        <LevelCard title="Reading N5" subtitle="Bacaan & pemahaman tingkat dasar" total={readingN5.length} unitLabel="bacaan" color="#16A34A" icon="読" to="/reading/N5" />
        <LevelCard title="Reading N4" subtitle="Bacaan & pemahaman tingkat pemula-menengah" total={readingN4.length} unitLabel="bacaan" color="#15803D" icon="読" to="/reading/N4" />
      </div>

      <div className="home-section-title">Listening</div>
      <div className="flex-col gap-16">
        <LevelCard title="Listening N5" subtitle="Dengar kata, lalu pilih artinya" color="#DC2626" icon="聴" to="/listening/N5" />
        <LevelCard title="Listening N4" subtitle="Dengar kata, lalu pilih artinya" color="#B91C1C" icon="聴" to="/listening/N4" />
      </div>

      <div className="home-quick-links mt-24">
        <button className="card card-tappable quick-link" onClick={() => navigate('/favorites')}>
          <span>⭐</span><span>Favorit</span>
        </button>
        <button className="card card-tappable quick-link" onClick={() => navigate('/stats')}>
          <span>📊</span><span>Statistik</span>
        </button>
        <button className="card card-tappable quick-link" onClick={() => navigate('/search')}>
          <span>🔍</span><span>Cari</span>
        </button>
      </div>
    </div>
  );
}
