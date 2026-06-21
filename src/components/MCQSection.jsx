import React, { useState } from 'react';
import { quizDatabase } from '../data/quizzes';
import { Play, RotateCcw, CheckCircle, XCircle, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

export default function MCQSection({ coId }) {
  const [difficulty, setDifficulty] = useState('all');
  const [numQuestions, setNumQuestions] = useState(5);
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]); // tracks correct/incorrect for summary
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = () => {
    // Filter questions by CO and difficulty
    let pool = quizDatabase[coId] || [];
    if (difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }
    
    if (pool.length === 0) {
      alert("No questions found for this configuration. Trying 'All' difficulty.");
      pool = quizDatabase[coId] || [];
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    // Slice to selected number
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

    setQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setQuizStarted(true);
    setQuizFinished(false);
  };

  const handleOptionClick = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
  };

  const submitAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, {
      question: currentQ.question,
      selected: selectedOption,
      correct: currentQ.correctAnswer,
      isCorrect,
      explanation: currentQ.explanation,
      options: currentQ.options
    }]);

    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  if (!quizStarted) {
    return (
      <div className="quiz-box">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
          <BookOpen size={20} style={{ color: 'var(--accent)' }} />
          Interactive Exam Prep Quiz (MCQs)
        </h3>
        <p>Test your understanding of this Course Outcome with realistic exam questions. Choose your settings below:</p>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Difficulty</label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none', backgroundColor: 'white' }}
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (Foundational)</option>
              <option value="medium">Medium (Application)</option>
              <option value="hard">Hard (Analysis & Math)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>Number of Questions</label>
            <select 
              value={numQuestions} 
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none', backgroundColor: 'white' }}
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={startQuiz}>
          <Play size={16} /> Start Quiz
        </button>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-box" style={{ textAlign: 'center' }}>
        <h3 style={{ marginTop: 0 }}>Quiz Complete!</h3>
        <div style={{ fontSize: '3rem', fontWeight: '700', color: percentage >= 70 ? 'var(--sage)' : 'var(--accent)', margin: '1rem 0' }}>
          {score} / {questions.length}
        </div>
        <p style={{ fontWeight: '500' }}>Score: {percentage}%</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {percentage >= 80 ? 'Excellent job! You are ready for end-sem questions on this CO!' : 
           percentage >= 50 ? 'Good effort! Review the incorrect answers and try again.' : 
           'Keep studying. Go through the theory and visualizers above.'}
        </p>

        <div style={{ textAlign: 'left', margin: '2rem 0', borderTop: '1px solid var(--border-medium)', paddingTop: '1rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Answer Review:</h4>
          {userAnswers.map((ans, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                {ans.isCorrect ? <CheckCircle size={18} style={{ color: 'var(--sage)', flexShrink: 0, marginTop: '2px' }} /> : <XCircle size={18} style={{ color: 'var(--coral)', flexShrink: 0, marginTop: '2px' }} />}
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Q{idx+1}: {ans.question}
                  </p>
                  <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    Your answer: <span style={{ color: ans.isCorrect ? 'var(--sage)' : 'var(--coral)', fontWeight: '600' }}>{ans.options[ans.selected]}</span>
                  </p>
                  {!ans.isCorrect && (
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      Correct answer: <span style={{ color: 'var(--sage)', fontWeight: '600' }}>{ans.options[ans.correct]}</span>
                    </p>
                  )}
                  <div style={{ background: 'var(--accent-light)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', borderLeft: '3px solid var(--accent)' }}>
                    <strong>Explanation:</strong> {ans.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={resetQuiz}>
          <RotateCcw size={16} /> Take Another Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="quiz-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>
          {currentQ.difficulty}
        </span>
      </div>

      <h4 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
        {currentQ.question}
      </h4>

      <div>
        {currentQ.options.map((opt, oIdx) => {
          let optClass = '';
          if (!isAnswered) {
            if (selectedOption === oIdx) optClass = 'selected';
          } else {
            if (oIdx === currentQ.correctAnswer) optClass = 'correct';
            else if (selectedOption === oIdx) optClass = 'incorrect';
          }

          return (
            <button 
              key={oIdx} 
              className={`quiz-option ${optClass}`}
              onClick={() => handleOptionClick(oIdx)}
              disabled={isAnswered}
            >
              <span style={{ marginRight: '0.75rem', fontWeight: 'bold' }}>
                {String.fromCharCode(65 + oIdx)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem', alignItems: 'center' }}>
        {!isAnswered ? (
          <button 
            className="btn btn-primary" 
            onClick={submitAnswer}
            disabled={selectedOption === null}
            style={{ opacity: selectedOption === null ? 0.6 : 1 }}
          >
            Submit Answer
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <div style={{ background: 'var(--sage-light)', padding: '0.75rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--sage)', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'left' }}>
              <strong style={{ color: 'var(--sage)', display: 'block', marginBottom: '0.25rem' }}>
                {selectedOption === currentQ.correctAnswer ? 'Correct!' : 'Incorrect'}
              </strong>
              {currentQ.explanation}
            </div>
            
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              style={{ alignSelf: 'flex-end' }}
            >
              {currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
