import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SpeakButton from '../components/SpeakButton.jsx';
import { useReadingItem } from '../hooks/useReadingData';

export default function ReadingStudy() {
  const { level, nomor } = useParams();
  const navigate = useNavigate();
  const item = useReadingItem(level, nomor);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const questions = useMemo(() => item?.pertanyaan || [], [item]);
  const question = questions[qIndex];

  if (!item) {
    return (
      <div className="page">
        <PageHeader title={`Reading ${level}`} />
        <div className="empty-state">
          <p>Bacaan tidak ditemukan.</p>
          <button className="btn btn-primary mt-16" onClick={() => navigate(`/reading/${level}`)}>Kembali</button>
        </div>
      </div>
    );
  }

  function handleAnswer(idx) {
    if (selected !== null) return; // sudah dijawab
    setSelected(idx);
    if (idx === question.jawaban) setScore((s) => s + 1);
  }

  function handleNext() {
    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <div className="page">
      <PageHeader title={item.judul} />

      <div className="card reading-passage-card mb-16">
        <div className="reading-passage font-jp" lang="ja">{item.teks}</div>
        <SpeakButton text={item.teks} label="🔊 Dengarkan Bacaan" />
      </div>

      {!finished ? (
        <>
          <div className="quiz-progress mb-16">Soal {qIndex + 1} / {questions.length} · Skor: {score}</div>
          <div className="card reading-question-card">
            <div className="reading-question font-jp">{question.soal}</div>
          </div>
          <div className="quiz-options mt-16">
            {question.pilihan.map((opt, idx) => {
              let state = '';
              if (selected !== null) {
                if (idx === question.jawaban) state = 'correct';
                else if (idx === selected) state = 'wrong';
              }
              return (
                <button
                  key={idx}
                  className={`card card-tappable quiz-option font-jp ${state}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <button className="btn btn-primary btn-block mt-24" onClick={handleNext}>
              {qIndex < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil'}
            </button>
          )}
        </>
      ) : (
        <div className="card quiz-result-card">
          <div className="quiz-result-emoji">
            {score === questions.length ? '🎉' : score >= questions.length / 2 ? '👍' : '💪'}
          </div>
          <div className="quiz-result-score">{score} / {questions.length}</div>
          <div className="text-muted">Skor kamu: {Math.round((score / questions.length) * 100)}%</div>
          <div className="flex gap-12 mt-24" style={{ width: '100%' }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate(`/reading/${level}`)}>
              Daftar Bacaan
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleRestart}>
              Ulangi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
