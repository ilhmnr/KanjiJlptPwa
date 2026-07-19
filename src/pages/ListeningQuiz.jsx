import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKosakataByLevel } from '../hooks/useKosakataData';
import { speak, isSpeechSupported } from '../hooks/speech';

const QUESTIONS_PER_ROUND = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Bangun soal: dengar ucapan katanya, lalu pilih arti yang benar dari 4 pilihan
function buildQuestions(data) {
  const pool = shuffle(data).slice(0, Math.min(QUESTIONS_PER_ROUND, data.length));
  return pool.map((correct) => {
    const distractors = shuffle(data.filter((k) => k.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    return {
      correctId: correct.id,
      word: correct,
      options: options.map((o) => ({ id: o.id, label: o.arti }))
    };
  });
}

export default function ListeningQuiz() {
  const { level } = useParams();
  const navigate = useNavigate();
  const { data } = useKosakataByLevel(level);

  const questions = useMemo(() => buildQuestions(data), [data]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const question = questions[qIndex];
  const speechOk = isSpeechSupported();

  const playAudio = useCallback(() => {
    if (question) speak(question.word.kata);
  }, [question]);

  // Putar otomatis begitu soal baru muncul, supaya latihan terasa seperti "dengar dulu"
  useEffect(() => {
    if (question) playAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  function handleAnswer(optionId) {
    if (selected !== null) return;
    setSelected(optionId);
    setRevealed(true);
    if (optionId === question.correctId) setScore((s) => s + 1);
  }

  function handleNext() {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    window.location.reload();
  }

  if (!speechOk) {
    return (
      <div className="page">
        <PageHeader title={`Listening ${level}`} />
        <div className="empty-state">
          <p>🔇</p>
          <p>Browser ini belum mendukung Text-to-Speech (Web Speech API).</p>
          <p className="text-muted" style={{ fontSize: 13 }}>Coba pakai Chrome terbaru untuk latihan mendengarkan.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="page">
        <PageHeader title={`Listening ${level}`} />
        <div className="empty-state">Data kosakata tidak cukup untuk latihan ini.</div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="page quiz-result">
        <PageHeader title="Hasil Listening" showBack={false} />
        <div className="card quiz-result-card">
          <div className="quiz-result-emoji">{percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '💪'}</div>
          <div className="quiz-result-score">{score} / {questions.length}</div>
          <div className="text-muted">Skor kamu: {percent}%</div>
          <div className="flex gap-12 mt-24" style={{ width: '100%' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/')}>
              Beranda
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRestart}>
              Ulangi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title={`Listening ${level}`} />
      <div className="quiz-progress mb-16">Soal {qIndex + 1} / {questions.length} · Skor: {score}</div>

      <div className="card listening-question-card">
        <div className="text-muted" style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          🎧 Dengarkan, lalu pilih artinya
        </div>
        <button className="btn btn-primary listening-play-btn" onClick={playAudio}>
          🔊 Putar Lagi
        </button>
        {revealed && (
          <div className="listening-reveal mt-16">
            <div className="font-jp" style={{ fontSize: 26, fontWeight: 700 }}>{question.word.kata}</div>
            <div className="text-muted font-jp" style={{ fontSize: 15 }}>{question.word.romaji}</div>
          </div>
        )}
      </div>

      <div className="quiz-options mt-16">
        {question.options.map((opt) => {
          let state = '';
          if (selected !== null) {
            if (opt.id === question.correctId) state = 'correct';
            else if (opt.id === selected) state = 'wrong';
          }
          return (
            <button
              key={opt.id}
              className={`card card-tappable quiz-option ${state}`}
              onClick={() => handleAnswer(opt.id)}
              disabled={selected !== null}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button className="btn btn-primary btn-block mt-24" onClick={handleNext}>
          {qIndex < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil'}
        </button>
      )}
    </div>
  );
}
