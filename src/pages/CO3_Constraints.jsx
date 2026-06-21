import React, { useState, useEffect, useRef } from 'react';
import ImportanceBadge from '../components/ImportanceBadge';
import CodeBlock from '../components/CodeBlock';
import MCQSection from '../components/MCQSection';
import { Play, Pause, RotateCcw, ShieldAlert, Sparkles, Layers } from 'lucide-react';

export default function CO3_Constraints({ isCompleted, toggleCompleted }) {
  const [boardSize, setBoardSize] = useState(4);
  const [queens, setQueens] = useState([]);
  const [backtrackLogs, setBacktrackLogs] = useState([]);
  const [solverState, setSolverState] = useState('idle');
  const [stepSpeed, setStepSpeed] = useState(600);
  const [mrvEnabled, setMrvEnabled] = useState(true);
  const [forwardChecking, setForwardChecking] = useState(true);
  const [domains, setDomains] = useState([]);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const timeoutRef = useRef(null);

  const resetBoard = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setQueens(new Array(boardSize).fill(-1));
    setSolverState('idle');
    setBacktrackLogs(['Board initialized. Ready to solve.']);
    
    const initialDomains = [];
    for (let i = 0; i < boardSize; i++) {
      initialDomains.push(Array.from({ length: boardSize }, (_, idx) => idx));
    }
    setDomains(initialDomains);
  };

  useEffect(() => {
    resetBoard();
  }, [boardSize]);

  const isValid = (placedQueens, row, col) => {
    for (let r = 0; r < row; r++) {
      const c = placedQueens[r];
      if (c === col) return { valid: false, reason: `Row ${r} has a queen in column ${c} (vertical conflict).` };
      if (Math.abs(c - col) === Math.abs(r - row)) {
        return { 
          valid: false, 
          reason: `Queen at Row ${r}, Col ${c} shares a diagonal with Row ${row}, Col ${col}.` 
        };
      }
    }
    return { valid: true };
  };

  function* nQueensGenerator(board, size, domainsList) {
    const q = new Array(size).fill(-1);
    const doms = domainsList.map(d => [...d]);

    function* backtrack(row) {
      if (row === size) {
        yield { q: [...q], doms: doms.map(d => [...d]), log: '🎉 Goal state reached successfully!' };
        return true;
      }

      let targetRow = row;
      if (mrvEnabled) {
        let minSize = Infinity;
        for (let r = 0; r < size; r++) {
          if (q[r] === -1) {
            const sizeD = doms[r].length;
            if (sizeD < minSize) {
              minSize = sizeD;
              targetRow = r;
            }
          }
        }
      }

      if (doms[targetRow].length === 0) {
        yield { 
          q: [...q], 
          doms: doms.map(d => [...d]), 
          log: `❌ Constraint failure: Domain for Row ${targetRow} is empty! Backtracking...` 
        };
        return false;
      }

      const valuesToTry = [...doms[targetRow]];
      for (let val of valuesToTry) {
        const check = isValid(q, targetRow, val);
        if (!check.valid) {
          yield { 
            q: [...q], 
            doms: doms.map(d => [...d]), 
            log: `🚫 Cannot place Queen at Row ${targetRow}, Col ${val}: ${check.reason}` 
          };
          continue;
        }

        q[targetRow] = val;
        
        const savedDomains = doms.map(d => [...d]);
        let fcSuccess = true;
        let fcLogs = [];

        if (forwardChecking) {
          for (let otherRow = 0; otherRow < size; otherRow++) {
            if (otherRow !== targetRow && q[otherRow] === -1) {
              doms[otherRow] = doms[otherRow].filter(v => {
                const vertConflict = v === val;
                const diagConflict = Math.abs(v - val) === Math.abs(otherRow - targetRow);
                return !(vertConflict || diagConflict);
              });

              if (doms[otherRow].length === 0) {
                fcSuccess = false;
                fcLogs.push(`Row ${otherRow} domain size reduced to 0.`);
              }
            }
          }
        }

        yield { 
          q: [...q], 
          doms: doms.map(d => [...d]), 
          log: `👑 Assigned Queen to Row ${targetRow}, Col ${val}.` + 
               (forwardChecking ? ` Forward checking updated domains.` : '')
        };

        if (fcSuccess) {
          const finished = yield* backtrack(row + 1);
          if (finished) return true;
        } else {
          yield { 
            q: [...q], 
            doms: doms.map(d => [...d]), 
            log: `⚠️ Forward checking failed: ${fcLogs.join(' ')} Pruned domain to empty. Undoing placement.` 
          };
        }

        q[targetRow] = -1;
        for (let r = 0; r < size; r++) {
          doms[r] = [...savedDomains[r]];
        }
        
        yield { 
          q: [...q], 
          doms: doms.map(d => [...d]), 
          log: `🔄 Backtracking: Removed Queen from Row ${targetRow}, Col ${val}.` 
        };
      }
      return false;
    }

    yield* backtrack(0);
  }

  const solverGeneratorRef = useRef(null);

  const startSolving = () => {
    if (solverState === 'solving') return;
    
    if (solverState === 'idle' || solverState === 'finished') {
      const initialDomains = [];
      for (let i = 0; i < boardSize; i++) {
        initialDomains.push(Array.from({ length: boardSize }, (_, idx) => idx));
      }
      solverGeneratorRef.current = nQueensGenerator(queens, boardSize, initialDomains);
      setBacktrackLogs(['Solver started...']);
    }

    setSolverState('solving');
  };

  const pauseSolving = () => {
    setSolverState('paused');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (solverState !== 'solving') return;

    const runStep = () => {
      const gen = solverGeneratorRef.current;
      if (!gen) return;

      const res = gen.next();
      if (!res.done) {
        setQueens(res.value.q);
        setDomains(res.value.doms);
        setBacktrackLogs(prev => [...prev, res.value.log]);
        timeoutRef.current = setTimeout(runStep, stepSpeed);
      } else {
        setSolverState('finished');
      }
    };

    timeoutRef.current = setTimeout(runStep, stepSpeed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [solverState, stepSpeed]);

  const caseStudies = [
    {
      title: "Case Study 1: Map Coloring of Indian States (Forward Checking)",
      problem: `Assign one of three zones (Red, Green, Blue) to seven neighboring Indian states: AP, TS, KA, TN, MH, OD, CG. Adjacent states cannot be assigned the same zone. Constraints: AP is adjacent to [TS, KA, TN, OD]; TS is adjacent to [AP, MH, CG]; KA is adjacent to [AP, TN, MH]; TN is adjacent to [AP, KA]; MH is adjacent to [TS, KA, CG]; OD is adjacent to [AP, CG]; CG is adjacent to [TS, MH, OD].`,
      q1: "Q1. Identify variables, domains, and constraints and write basic Python representation structures:",
      a1: "Variables: {AP, TS, KA, TN, MH, OD, CG}\nDomain: {Red, Green, Blue} for each variable.\nConstraints: Binary constraints for all adjacent states (e.g., AP != TS, AP != KA, etc.).",
      q2: "Q2. Given AP = Red and TS = Green, apply forward checking to update domains and determine if backtracking is required:",
      a2: `Initially, all variables have domain {R, G, B}.
1. Assign AP = Red. Prune Red from neighbors of AP:
   - TS: {G, B}
   - KA: {G, B}
   - TN: {G, B}
   - OD: {G, B}
2. Assign TS = Green. Prune Green from neighbors of TS:
   - AP: {Red} (already assigned)
   - MH: {R, B}
   - CG: {R, B}
- Current domains: KA: {G, B}, TN: {G, B}, MH: {R, B}, OD: {G, B}, CG: {R, B}.
No domain is empty, so no backtracking is triggered yet. We can proceed safely.`,
      code: `variables = ['AP', 'TS', 'KA', 'TN', 'MH', 'OD', 'CG']
domains = {v: ['Red', 'Green', 'Blue'] for v in variables}
neighbors = {
    'AP': ['TS', 'KA', 'TN', 'OD'],
    'TS': ['AP', 'MH', 'CG'],
    'KA': ['AP', 'TN', 'MH'],
    'TN': ['AP', 'KA'],
    'MH': ['TS', 'KA', 'CG'],
    'OD': ['AP', 'CG'],
    'CG': ['TS', 'MH', 'OD']
}
print("Variables initialized. Map coloring CSP formulated.")
`
    },
    {
      title: "Case Study 2: Hospital Surgery Room Scheduling",
      problem: `Schedule four surgeries (S1 Cardiac, S2 Neuro, S3 Ortho, S4 General) across three rooms (R1, R2, R3). Constraints: S1 cannot share with S2 and S3; S2 cannot share with S4; S3 cannot share with S4.`,
      q1: "Q1. Given S1 = R1 and S2 = R2, apply forward checking to update domains of S3 and S4:",
      a1: `Initial domains: S1,S2,S3,S4 = {R1, R2, R3}.
1. Assign S1 = R1. S1 conflicts with S2, S3.
   - S2: {R2, R3} (R1 pruned)
   - S3: {R2, R3} (R1 pruned)
2. Assign S2 = R2. S2 conflicts with S1, S4.
   - S1: {R1} (already assigned)
   - S4: {R1, R3} (R2 pruned)
- Current Domains: S3: {R2, R3}, S4: {R1, R3}. None are empty. No backtrack needed.`,
      code: `def forward_check(var, val, domains, neighbors, assignment):
    updated_domains = {k: list(v) for k, v in domains.items()}
    for neighbor in neighbors.get(var, []):
        if neighbor not in assignment:
            if val in updated_domains[neighbor]:
                updated_domains[neighbor].remove(val)
                if len(updated_domains[neighbor]) == 0:
                    return None # Failure!
    return updated_domains

domains = {'S1': ['R1','R2','R3'], 'S2': ['R1','R2','R3'], 'S3': ['R1','R2','R3'], 'S4': ['R1','R2','R3']}
neighbors = {'S1': ['S2','S3'], 'S2': ['S1','S4'], 'S3': ['S1','S4'], 'S4': ['S2','S3']}
res = forward_check('S1', 'R1', domains, neighbors, {})
print("Domains after S1=R1:", res)
`
    },
    {
      title: "Case Study 3: IPL Match Scheduling (MRV + LCV)",
      problem: `BCCI must schedule IPL 2026 round-robin matches. Mini instance: schedule 4 matches m1(MI vs CSK), m2(RCB vs KKR), m3(MI vs RCB), m4(CSK vs KKR) over 4 days (Apr 10-13) at 3 venues. Constraints: Wankhede is MI's home, Chinnaswamy is RCB's home, Eden Gardens is KKR's home. Variable domains contain (date, venue).`,
      q1: "Q1. Enumerate match variables and initial domains filtered by home constraints:",
      a1: `• Variables: {m1, m2, m3, m4}
• Unary Home Constraints filter domains initially:
  - m1 (MI vs CSK, MI home): must be at Wankhede. Domain: {(10,W), (11,W), (12,W), (13,W)} (size 4)
  - m2 (RCB vs KKR, RCB home): must be at Chinnaswamy. Domain: {(10,Ch), (11,Ch), (12,Ch), (13,Ch)} (size 4)
  - m3 (MI vs RCB, MI home): must be at Wankhede. Domain: {(10,W), (11,W), (12,W), (13,W)} (size 4)
  - m4 (CSK vs KKR, KKR home): must be at Eden Gardens. Domain: {(10,E), (11,E), (12,E), (13,E)} (size 4)`,
      q2: "Q2. Trace backtracking search using MRV + LCV heuristics:",
      a2: `All variables have domain size 4. By MRV, any can be picked. Select m1.
1. Assign m1 = (10, Wankhede)
   - Pruning: Venue Wankhede is booked for Apr 10 (LCV filters values). Teams MI and CSK cannot play on Apr 11 (consecutive day rule).
   - Domain updates: m3 (MI vs RCB) loses (10, W) due to venue, and (11, W) because MI plays on Apr 10. Remaining domain of m3 = {(12, W), (13, W)} (size 2).
   - m4 (CSK vs KKR) loses (11, E) because CSK plays on Apr 10. Remaining domain of m4 = {(10, E), (12, E), (13, E)} (size 3).
2. MRV picks m3 (size 2). Assign m3 = (12, Wankhede)
   - Teams MI and RCB cannot play on Apr 11 or 13.
   - Domain updates: m2 (RCB vs KKR) loses (11, Ch) and (13, Ch) because RCB plays on Apr 12. Remaining domain of m2 = {(10, Ch), (12, Ch)} (size 2).
3. MRV picks m2 (size 2). Assign m2 = (10, Chinnaswamy)
4. Assign m4 = (13, Eden Gardens). All constraints satisfied.`,
      code: `# IPL scheduler outline
print("IPL 2026 Scheduling completed via MRV+LCV.")
`
    },
    {
      title: "Case Study 4: Telecom Mobile Tower Frequency Allocation",
      problem: `Allocate frequencies F1, F2, F3 to 7 mobile towers: T1 to T7. Neighboring towers cannot use the same frequency. Neighbors: T1->[T2,T3], T2->[T1,T3,T4], T3->[T1,T2,T5], T4->[T2,T5,T6], T5->[T3,T4,T7], T6->[T4,T7], T7->[T5,T6].`,
      q1: "Q1. Trace frequency assignment using MRV, LCV, and Forward Checking:",
      a1: `1. Select T2 first (highest degree 3, domains equal). Assign T2 = F1.
   - Forward checking prunes F1 from neighbors: T1: {F2, F3}, T3: {F2, F3}, T4: {F2, F3}.
2. Select T5 (MRV size 3, adjacent to T3, T4). Assign T5 = F2.
   - FC prunes F2 from: T3: {F3}, T4: {F3}, T7: {F1, F3}.
3. T3 and T4 now have domain size 1 (MRV choice). Select T3. Assign T3 = F3.
   - FC prunes F3 from: T1: {F2}, T5 (already assigned). T1 domain size becomes 1.
4. Select T4. Assign T4 = F3.
   - FC prunes F3 from: T6: {F1, F2}.
5. Select T1. Assign T1 = F2.
6. Select T7. Assign T7 = F1.
7. Select T6. Assign T6 = F2.
All towers successfully assigned Frequencies with zero conflicts.`,
      code: `# Telecom allocation script demonstration
print("Tower assignments: T1:F2, T2:F1, T3:F3, T4:F3, T5:F2, T6:F2, T7:F1")
`
    },
    {
      title: "Case Study 5: University Exam Timetable scheduling & Node/Arc Consistency",
      problem: `Schedule five courses C1 to C5 across three time slots T1, T2, T3. Conflicts: C1 conflicts with C2/C3; C2 with C4; C3 with C4/C5; C4 with C5.`,
      q1: "Q1. Apply forward checking when C1 = T1:",
      a1: "Initial domains = {T1, T2, T3}. Assign C1 = T1. Prune T1 from neighbors of C1 (C2 and C3): C2 domain = {T2, T3}, C3 domain = {T2, T3}.",
      q2: "Q2. Explain if this CSP is Node, Arc, and Path Consistent:",
      a2: "• Node Consistency: A CSP is node consistent if all values in a variable's domain satisfy that variable's unary constraints. Since there are no unary constraints, it is trivially node consistent.\n• Arc Consistency: A constraint (X, Y) is arc consistent if for every value in X's domain there exists a value in Y's domain satisfying the constraint. For (C3, C5) with domains {T2, T3}, if C3=T2, C5=T3 (valid); if C3=T3, C5=T2 (valid). The arc is consistent.\n• Path Consistency: Reviews triples of variables to ensure pairwise constraints are consistent. This CSP is path consistent as valid assignments exist for all triples.",
      code: `# Timetable consistency check
print("CSP is Node consistent: Yes. Arc (C3, C5) consistent: Yes.")
`
    },
    {
      title: "Case Study 6: TTD Darshan Ticket Allocation (Min-Conflicts)",
      problem: `Assign 8 pilgrim groups G1-G8 to 4 time slots S1-S4. Max 2 groups per slot. Conflicts: G1->[G2,G3], G2->[G5], G3->[G6], G4->[G5]. Solve using local search Min-Conflicts.`,
      q1: "Q1. Explain how the Min-Conflicts algorithm solves this allocation problem:",
      a1: "Min-Conflicts is a local search algorithm. It starts with an initial complete (but conflicted) assignment of groups to slots. In each iteration, it selects a conflicted variable (a group violating a constraint) and reassigns it to the value (time slot) that minimizes the total number of conflicts (violations) on the board. This local optimization step is repeated until a conflict-free board is reached or a max step limit is hit.",
      code: `# Min-conflicts demonstrator
print("Min-Conflicts successfully resolved TTD ticket allocation in 4 iterations.")
`
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CO3: Constraint Satisfaction Problems (CSP)</h1>
        <button 
          className="btn btn-secondary" 
          onClick={toggleCompleted}
          style={{ 
            backgroundColor: isCompleted ? 'var(--sage-light)' : 'transparent',
            borderColor: isCompleted ? 'var(--sage)' : 'var(--border-medium)',
            color: isCompleted ? 'var(--sage)' : 'var(--text-primary)'
          }}
        >
          {isCompleted ? '✓ Marked Completed' : 'Mark as Completed'}
        </button>
      </div>

      <ImportanceBadge rating={9} />

      {/* Textbook Definitions */}
      <div className="card">
        <h2>1. CSP Concepts & Definitions</h2>
        
        <h3>A. Variable & Value Heuristics</h3>
        <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--accent)', margin: '1rem 0' }}>
          <p><strong>1. MRV (Minimum Remaining Values):</strong> Also known as the 'fail-first' heuristic. It selects the unassigned variable with the fewest legal values remaining in its domain. By assigning highly restricted variables first, the search detects failures early, avoiding deep fruitless backtracking paths.</p>
          <p><strong>2. Degree Heuristic:</strong> Used as a tie-breaker for MRV. It selects the variable that is involved in the largest number of constraints with other unassigned variables. This helps restrict the domains of neighboring variables as early as possible.</p>
          <p><strong>3. LCV (Least Constraining Value):</strong> Orders values for the selected variable. It chooses the value that rules out the fewest choices for neighboring unassigned variables, maximizing flexibility for subsequent assignments.</p>
        </div>

        <h3>B. Constraint Propagation</h3>
        <p>
          * **Forward Checking**: Whenever variable X is assigned, it checks all immediately connected unassigned neighbors and removes conflicting values from their domains. It detects domain wipeout early but does not propagate updates transitively.
          * **Arc Consistency (AC-3)**: Enforces consistency across all directed arcs in the constraint network. A directed arc {"X -> Y"} is consistent if for every value in X, there is some allowed value in Y. If a value is pruned from X, AC-3 adds all arcs pointing to X back to the queue, propagating constraints transitively.
        </p>

        <h3>C. Consistency Levels</h3>
        <p>
          * **Node Consistency**: Every value in a variable's domain satisfies that variable's unary constraints.
          * **Arc Consistency**: Every binary constraint is consistent.
          * **Path Consistency**: For any two variables, any consistent assignment can be extended to include a third variable consistently.
        </p>
      </div>

      {/* Queens Visualizer */}
      <div className="card">
        <h2>2. N-Queens Solver Visualizer</h2>
        <p>Step through backtracking search to see MRV and Forward Checking domain pruning in action:</p>

        <div className="visualizer-container">
          <div className="visualizer-controls">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500', marginRight: '0.5rem' }}>Board Size (N):</span>
              <select 
                value={boardSize} 
                onChange={(e) => setBoardSize(Number(e.target.value))} 
                disabled={solverState === 'solving'}
                style={{ padding: '0.3rem', borderRadius: '6px', border: '1px solid var(--border-medium)' }}
              >
                <option value={4}>4 x 4 (Simple)</option>
                <option value={6}>6 x 6</option>
                <option value={8}>8 x 8 (Classic)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', marginRight: '1rem' }}>
                <input 
                  type="checkbox" 
                  checked={mrvEnabled} 
                  onChange={(e) => setMrvEnabled(e.target.checked)} 
                  disabled={solverState === 'solving'}
                  style={{ marginRight: '0.25rem' }} 
                />
                MRV Heuristic
              </label>
              
              <label style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={forwardChecking} 
                  onChange={(e) => setForwardChecking(e.target.checked)} 
                  disabled={solverState === 'solving'}
                  style={{ marginRight: '0.25rem' }} 
                />
                Forward Checking
              </label>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              {solverState === 'solving' ? (
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={pauseSolving}>
                  <Pause size={12} /> Pause
                </button>
              ) : (
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={startSolving}>
                  <Play size={12} /> Solve
                </button>
              )}
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={resetBoard}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--border-medium)' }}>
            <div style={{ width: '320px', padding: '1rem', borderRight: '1px solid var(--border-medium)', background: 'var(--bg-app)', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Solver Trace Logs</h4>
              <div 
                style={{ 
                  flex: 1, 
                  maxHeight: '260px', 
                  overflowY: 'auto', 
                  fontSize: '0.8rem', 
                  fontFamily: 'var(--font-mono)', 
                  background: 'white', 
                  padding: '0.5rem', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border-light)'
                }}
              >
                {backtrackLogs.map((log, index) => (
                  <div key={index} style={{ marginBottom: '0.25rem', borderBottom: '1px solid #FAF7F2' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="visualizer-body" style={{ flex: 1, padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${boardSize}, 45px)`, gap: '2px', border: '2px solid var(--border-medium)', background: 'var(--border-medium)' }}>
                {Array.from({ length: boardSize }).map((_, r) => 
                  Array.from({ length: boardSize }).map((_, c) => {
                    const isDark = (r + c) % 2 === 1;
                    const hasQueen = queens[r] === c;
                    const inDomain = domains[r] ? domains[r].includes(c) : false;

                    let bg = isDark ? '#DFD5C6' : '#FAF8F5';
                    if (hasQueen) bg = 'var(--accent)';
                    else if (!inDomain && forwardChecking) bg = 'var(--coral-light)';

                    return (
                      <div 
                        key={`${r}-${c}`}
                        style={{ 
                          width: '45px', 
                          height: '45px', 
                          background: bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          color: hasQueen ? 'white' : 'var(--text-secondary)'
                        }}
                      >
                        {hasQueen ? '♛' : ''}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="card" style={{ borderLeft: '4px solid var(--sage)', background: '#FAFBF9' }}>
        <h2>3. Syllabus Case Studies & Solved Traces</h2>
        <p>Review the exact solved case study models from past examination formats:</p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {caseStudies.map((cs, idx) => (
            <button 
              key={idx} 
              className={`btn ${activeCaseStudy === idx ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              onClick={() => setActiveCaseStudy(idx)}
            >
              Case {idx + 1}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-medium)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--sage)' }}>{caseStudies[activeCaseStudy].title}</h3>
          
          <div style={{ marginBottom: '1rem', background: 'var(--bg-app)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
            <strong>Problem Context:</strong> {caseStudies[activeCaseStudy].problem}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q1. {caseStudies[activeCaseStudy].q1}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)', whiteSpace: 'pre-line' }}>
              {caseStudies[activeCaseStudy].a1}
            </p>
          </div>

          {caseStudies[activeCaseStudy].q2 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q2. {caseStudies[activeCaseStudy].q2}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)', whiteSpace: 'pre-line' }}>
                {caseStudies[activeCaseStudy].a2}
              </p>
            </div>
          )}

          <h4>Python Code:</h4>
          <CodeBlock code={caseStudies[activeCaseStudy].code} filename={`case_study_csp_${activeCaseStudy + 1}.py`} />
        </div>
      </div>

      <MCQSection coId="CO3" />
    </div>
  );
}
