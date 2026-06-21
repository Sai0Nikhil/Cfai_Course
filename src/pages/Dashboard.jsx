import React from 'react';
import { BookOpen, Award, CheckSquare, Compass, ShieldAlert, Cpu } from 'lucide-react';
import ImportanceBadge from '../components/ImportanceBadge';

export default function Dashboard({ progress, setPage }) {
  const cos = [
    { id: 'CO1', title: 'CO1: Foundations & Python Essentials', desc: 'Agent models (PEAS), state-space problem formulation, graphs/trees, recursion, dataclasses, typing, complexity, heaps.', rating: 6, key: 'CO1' },
    { id: 'CO2', title: 'CO2: Classical Search & Grid Pathfinder', desc: 'BFS/DFS/UCS, A* and Greedy search, heuristic design, closed/open sets, IDA*, empirical profiling, grid search.', rating: 10, key: 'CO2' },
    { id: 'CO3', title: 'CO3: Constraint Satisfaction Problems (CSP)', desc: 'CSP modeling, backtracking, forward checking, AC-3, MRV/degree/LCV heuristics, local search, timetabling.', rating: 9, key: 'CO3' },
    { id: 'CO4', title: 'CO4: Adversarial Search & Games', desc: 'Minimax, alpha-beta pruning, depth limits, iterative deepening, expectimax, bounded rationality, policy selection.', rating: 8, key: 'CO4' },
    { id: 'CO5', title: 'CO5: Probabilistic Reasoning & Bayes Nets', desc: 'Bayes rule, Bayesian networks (CPTs), Variable Elimination, belief propagation, sampling, Markov chains & HMM.', rating: 9, key: 'CO5' },
    { id: 'CO6', title: 'CO6: Hybrid Systems, Ethics & Calibration', desc: 'Combining search, CSP, and probability; explainable traces, failure analysis, heuristic bias, uncertainty miscalibration.', rating: 7, key: 'CO6' },
  ];

  const totalProgress = Math.round(
    Object.values(progress).reduce((acc, curr) => acc + (curr ? 1 : 0), 0) / cos.length * 100
  );

  return (
    <div>
      <div className="card" style={{ background: 'var(--accent-light)', borderColor: 'var(--accent-border)', padding: '2rem' }}>
        <h1 style={{ marginTop: 0 }}>AI End-Sem Preparation Dashboard</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Welcome! This interactive guide covers your entire AI syllabus. Designed to build core intuition, provide runnable Python code, and trace step-by-step visualizers to secure full marks in your exams.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: '600' }}>
              <span>Overall Prep Progress</span>
              <span>{totalProgress}%</span>
            </div>
            <div className="progress-bar-outer">
              <div className="progress-bar-inner" style={{ width: `${totalProgress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Course Outcomes (CO) Overview</h2>
      <p style={{ marginBottom: '1.5rem' }}>Click on any Course Outcome below to study concepts, review Python code, interact with visualizers, and test yourself with custom MCQs.</p>

      <div className="grid-2">
        {cos.map((co) => (
          <div 
            key={co.id} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderLeft: progress[co.key] ? '4px solid var(--sage)' : '1px solid var(--border-light)'
            }}
            onClick={() => setPage(co.key)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(50, 41, 33, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(50, 41, 33, 0.03)';
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>{co.title}</h3>
                <span className={`badge ${progress[co.key] ? 'badge-sage' : 'badge-gold'}`}>
                  {progress[co.key] ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <ImportanceBadge rating={co.rating} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', minHeight: '3rem' }}>
                {co.desc}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setPage(co.key);
                }}
              >
                Study Topic <Compass size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: '#FDFCF7' }}>
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award style={{ color: 'var(--gold)' }} />
          Top 3 Exam Tips for Artificial Intelligence
        </h3>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
          <li>
            <strong>Understand Search & Heuristic Admissibility (CO2)</strong>: Expect questions on verifying if a given heuristic is admissible (h(n) &lt;= h*(n)) or consistent. Pay close attention to A* node expansion orders.
          </li>
          <li>
            <strong>Backtracking with Heuristics (CO3)</strong>: Memorize the mechanics of MRV (variables with fewest options), Degree heuristic (most constraints on neighbors), and LCV (least constraining values).
          </li>
          <li>
            <strong>Variable Elimination Steps (CO5)</strong>: Practice how to factor out summations and rewrite joint distributions step-by-step. CPT arithmetic is highly scoring!
          </li>
        </ul>
      </div>
    </div>
  );
}
