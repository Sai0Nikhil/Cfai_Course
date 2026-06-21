import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Activity, 
  Compass, 
  HelpCircle, 
  CheckCircle, 
  Home, 
  ShieldAlert, 
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CO1_Foundations from './pages/CO1_Foundations';
import CO2_Search from './pages/CO2_Search';
import CO3_Constraints from './pages/CO3_Constraints';
import CO4_Games from './pages/CO4_Games';
import CO5_Probability from './pages/CO5_Probability';
import CO6_Hybrid from './pages/CO6_Hybrid';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [progress, setProgress] = useState({
    CO1: false,
    CO2: false,
    CO3: false,
    CO4: false,
    CO5: false,
    CO6: false
  });

  const toggleCompleted = (coKey) => {
    setProgress(prev => ({
      ...prev,
      [coKey]: !prev[coKey]
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, pageKey: 'dashboard' },
    { id: 'CO1', label: 'CO1: AI Foundations & Python', icon: BookOpen, pageKey: 'CO1' },
    { id: 'CO2', label: 'CO2: Classical Search Grid', icon: Compass, pageKey: 'CO2' },
    { id: 'CO3', label: 'CO3: Constraints & CSP Solver', icon: Layers, pageKey: 'CO3' },
    { id: 'CO4', label: 'CO4: Game Trees & Minimax', icon: Activity, pageKey: 'CO4' },
    { id: 'CO5', label: 'CO5: Probabilistic Reasoning', icon: HelpCircle, pageKey: 'CO5' },
    { id: 'CO6', label: 'CO6: Hybrid Systems & Ethics', icon: Sparkles, pageKey: 'CO6' }
  ];

  const totalProgress = Math.round(
    Object.values(progress).reduce((acc, curr) => acc + (curr ? 1 : 0), 0) / 6 * 100
  );

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
          <div style={{ background: 'var(--accent)', color: 'white', padding: '0.4rem', borderRadius: '8px' }}>
            <Award size={20} />
          </div>
          <div>
            <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>AI Study Portal</span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>End-Sem Preparation</div>
          </div>
        </div>

        {/* Global Tracker */}
        <div style={{ background: 'white', padding: '0.85rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
            <span>Prep Progress</span>
            <span>{totalProgress}%</span>
          </div>
          <div className="progress-bar-outer" style={{ height: '6px' }}>
            <div className="progress-bar-inner" style={{ width: `${totalProgress}%` }}></div>
          </div>
        </div>

        {/* Menu Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = page === item.pageKey;
            const isFinished = item.id !== 'dashboard' && progress[item.id];

            return (
              <button
                key={item.id}
                onClick={() => setPage(item.pageKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: isActive ? 'var(--bg-card)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '400',
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  boxShadow: isActive ? '0 2px 6px rgba(50, 41, 33, 0.02)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.9rem', flex: 1 }}>{item.label}</span>
                {isFinished && (
                  <CheckCircle size={14} style={{ color: 'var(--sage)' }} />
                )}
                {!isFinished && isActive && (
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footnote */}
        <div style={{ marginTop: 'auto', padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
          <span>Theme: Warm Milk/Coffee</span>
          <div style={{ marginTop: '0.2rem' }}>Ready for End-Sems 📚</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {page === 'dashboard' && (
          <Dashboard progress={progress} setPage={setPage} />
        )}
        {page === 'CO1' && (
          <CO1_Foundations 
            isCompleted={progress.CO1} 
            toggleCompleted={() => toggleCompleted('CO1')} 
          />
        )}
        {page === 'CO2' && (
          <CO2_Search 
            isCompleted={progress.CO2} 
            toggleCompleted={() => toggleCompleted('CO2')} 
          />
        )}
        {page === 'CO3' && (
          <CO3_Constraints 
            isCompleted={progress.CO3} 
            toggleCompleted={() => toggleCompleted('CO3')} 
          />
        )}
        {page === 'CO4' && (
          <CO4_Games 
            isCompleted={progress.CO4} 
            toggleCompleted={() => toggleCompleted('CO4')} 
          />
        )}
        {page === 'CO5' && (
          <CO5_Probability 
            isCompleted={progress.CO5} 
            toggleCompleted={() => toggleCompleted('CO5')} 
          />
        )}
        {page === 'CO6' && (
          <CO6_Hybrid 
            isCompleted={progress.CO6} 
            toggleCompleted={() => toggleCompleted('CO6')} 
          />
        )}

        <footer style={{ marginTop: '4rem', borderTop: '1px solid var(--border-medium)', paddingTop: '1.5rem', paddingBottom: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p style={{ margin: 0, fontWeight: '500' }}>Created by Active Student sai nikhil under guidance of Prof. SuryaKanth V gangashetty</p>
        </footer>
      </main>
    </div>
  );
}
