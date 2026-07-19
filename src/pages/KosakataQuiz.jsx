import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { useKosakataByLevel } from '../hooks/useKosakataData';

const QUESTIONS_PER_ROUND = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(data, mode) {
  const pool = shuffle(data).slice(0, QUESTIONS_PER_ROUND);
  return pool.map((correct) => {
    const distractors = shuffle(data.filter((k) => k.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...distractors]);
    return {
      correctId: correct.id,
      prompt: mode === 'kata-to-arti' ? correct.kata : correct.arti,
      options: options.map((o) => ({
        id: o.id,
        label: mode === 'kata-to-arti' ? o.arti : o.kata
      }))
    };
  });
}

export default function KosakataQuiz() {
  const { level } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const mode = params.get('mode') || 'kata-to-arti';
  const { data } = useKosakataByLevel(level);

  const questions = useMemo(() => buildQuestions(data, mode), [data, mode]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[qIndex];

  const handleAnswer = useCallback((optionId) => {
    if (selected) return;
    setSelected(optionId);
    if (optionId === question.correctId) setScore((s) => s + 1);
  }, [selected, question]);

  const handleNext = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="page">
        <PageHeader title="Kuis Kosakata" />
        <div className="empty-state">Data kosakata tidak cukup untuk kuis.</div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="page quiz-result">
        <PageHeader title="Hasil Kuis" showBack={false} />
        <div className="card quiz-result-card">
          <div className="quiz-result-emoji">{percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '💪'}</div>
          <div className="quiz-result-score">{score} / {questions.length}</div>
          <div className="text-muted">Skor kamu: {percent}%</div>
          <div className="flex gap-12 mt-24" style={{ width: '100%' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate(`/kosakata-quiz/${level}`)}>
              Ganti Mode
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => window.location.reload()}>
              Ulangi
            </button>
          </div>
          <button className="btn btn-ghost btn-block mt-8" onClick={() => navigate('/')}>Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title={`Kuis Kosakata ${level}`} />
      <div className="quiz-progress text-muted mt-8 mb-16">Soal {qIndex + 1} / {questions.length} · Skor: {score}</div>

      <div className="card quiz-question-card">
        <div className={`quiz-prompt ${mode === 'kata-to-arti' ? 'font-jp' : ''}`} style={mode === 'kata-to-arti' ? undefined : { fontSize: 'clamp(20px, 7vw, 32px)' }}>
          {question.prompt}
        </div>
      </div>

      <div className="quiz-options mt-16">
        {question.options.map((opt) => {
          let state = '';
          if (selected) {
            if (opt.id === question.correctId) state = 'correct';
            else if (opt.id === selected) state = 'wrong';
          }
          return (
            <button
              key={opt.id}
              className={`card card-tappable quiz-option ${state} ${mode === 'arti-to-kata' ? 'font-jp' : ''}`}
              onClick={() => handleAnswer(opt.id)}
              disabled={!!selected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {selected && (
        <button className="btn btn-primary btn-block mt-24" onClick={handleNext}>
          {qIndex < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil'}
        </button>
      )}
    </div>
  );
}
