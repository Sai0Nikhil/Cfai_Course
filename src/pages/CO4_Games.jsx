import React, { useState, useEffect } from 'react';
import ImportanceBadge from '../components/ImportanceBadge';
import CodeBlock from '../components/CodeBlock';
import MCQSection from '../components/MCQSection';
import { Play, RotateCcw, AlertTriangle, HelpCircle, Activity } from 'lucide-react';

export default function CO4_Games({ isCompleted, toggleCompleted }) {
  const [leaves, setLeaves] = useState([3, 12, 8, 2, 4, 6, 14, 5]);
  const [prunedNodes, setPrunedNodes] = useState([]);
  const [nodeValues, setNodeValues] = useState({});
  const [currentStep, setCurrentStep] = useState(-1);
  const [abTrace, setAbTrace] = useState([]);
  const [abEnabled, setAbEnabled] = useState(true);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const resetSimulator = () => {
    setCurrentStep(-1);
    setPrunedNodes([]);
    setNodeValues({
      A: '?', B: '?', C: '?', D: '?', E: '?', F: '?', G: '?'
    });
    setAbTrace(['Simulator reset. Press "Step Traversal" to watch Alpha-Beta Pruning.']);
  };

  useEffect(() => {
    resetSimulator();
  }, [leaves, abEnabled]);

  const abSteps = [
    { node: 'D', val: 'leaves', index: [0, 1], action: 'max_leaves', desc: 'D (MAX) reviews leaves 3 and 12. D = max(3, 12) = 12.' },
    { node: 'B', val: 12, action: 'update_min', desc: 'B (MIN) gets value 12 from D. Beta for B is now <= 12.' },
    { node: 'E', val: 'leaves', index: [2, 3], action: 'max_leaves', desc: 'E (MAX) reviews leaves 8 and 2. E = max(8, 2) = 8.' },
    { node: 'B', val: 8, action: 'update_min', desc: 'B (MIN) reviews D(12) and E(8). B = min(12, 8) = 8. Alpha for A is now >= 8.' },
    { node: 'A', val: 8, action: 'update_max', desc: 'Root A (MAX) gets value 8 from B. Alpha for A is now >= 8.' },
    { node: 'F', val: 'leaves', index: [4, 5], action: 'max_leaves', desc: 'F (MAX) reviews leaves 4 and 6. F = max(4, 6) = 6.' },
    { node: 'C', val: 6, action: 'update_min', desc: 'C (MIN) gets value 6 from F. Beta for C is now <= 6.' },
    { 
      node: 'G', 
      val: 'leaves', 
      index: [6, 7], 
      action: abEnabled ? 'prune' : 'max_leaves', 
      desc: abEnabled 
        ? '⚡ PRUNE TRIGGERED! Since C (MIN) has beta <= 6, and root A (MAX) has alpha >= 8, any value returned by G will be compared under C. Since 6 < 8, MAX will never choose C. Branch G is pruned.' 
        : 'G (MAX) reviews leaves 14 and 5. G = max(14, 5) = 14.' 
    },
    { 
      node: 'C', 
      val: 6, 
      action: 'finalize_min', 
      desc: abEnabled 
        ? 'C (MIN) finalizes to 6 (G is pruned).' 
        : 'C (MIN) reviews F(6) and G(14). C = min(6, 14) = 6.' 
    },
    { node: 'A', val: 8, action: 'finish', desc: 'Root A (MAX) compares B(8) and C(6). A = max(8, 6) = 8. Game value is 8.' }
  ];

  const handleStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep >= abSteps.length) return;

    setCurrentStep(nextStep);
    const step = abSteps[nextStep];
    
    setAbTrace(prev => [...prev, `[Step ${nextStep + 1}] ${step.desc}`]);

    const newValues = { ...nodeValues };
    if (step.action === 'max_leaves') {
      const v0 = leaves[step.index[0]];
      const v1 = leaves[step.index[1]];
      newValues[step.node] = Math.max(v0, v1);
    } else if (step.action === 'update_min') {
      newValues[step.node] = step.val;
    } else if (step.action === 'update_max') {
      newValues[step.node] = step.val;
    } else if (step.action === 'prune') {
      newValues['G'] = 'Ø';
      setPrunedNodes(['G', 'L6', 'L7']);
    } else if (step.action === 'finalize_min') {
      newValues['C'] = 6;
    } else if (step.action === 'finish') {
      newValues['A'] = 8;
    }

    setNodeValues(newValues);
  };

  const handleLeafChange = (index, value) => {
    const newLeaves = [...leaves];
    newLeaves[index] = Number(value);
    setLeaves(newLeaves);
  };

  const caseStudies = [
    {
      title: "Case Study 1: India vs Australia Test (Sharma Declaration Decision)",
      problem: `India bats on Day 4. Lead is 320 runs. Captain Rohit Sharma must decide:
- DECLARE: gives Australia 90 overs to chase 321.
- BAT MORE: increases lead to 380 but takes 30 overs, giving Australia only 60 overs to chase 381.
Australia chooses to ATTACK or DEFEND in response. Leaves (left-to-right): 0.6, -0.2, 0.4, 0.0.`,
      q1: "Q1. Run Minimax bottom-up to determine optimal decision and value:",
      a1: "Root India (MAX) has children: DECLARE and BAT_MORE.\nDECLARE (MIN) has children: ATTACK (0.6), DEFEND (-0.2). MIN = min(0.6, -0.2) = -0.2.\nBAT_MORE (MIN) has children: ATTACK (0.4), DEFEND (0.0). MIN = min(0.4, 0.0) = 0.0.\nRoot MAX = max(-0.2, 0.0) = 0.0. India's optimal action is to BAT MORE to secure a draw (utility 0.0).",
      q2: "Q2. Apply Alpha-Beta pruning to trace bounds and visited leaves:",
      a2: `1. Explore DECLARE:
   - Left leaf = 0.6. Beta of DECLARE becomes <= 0.6.
   - Right leaf = -0.2. Beta of DECLARE becomes min(0.6, -0.2) = -0.2.
   - Backtrack: Alpha of Root becomes >= -0.2.
2. Explore BAT_MORE:
   - Left leaf = 0.4. Beta of BAT_MORE becomes <= 0.4.
   - Right leaf = 0.0. Beta of BAT_MORE becomes min(0.4, 0.0) = 0.0.
   - Backtrack: Alpha of Root becomes max(-0.2, 0.0) = 0.0.
In this case, all 4 leaves must be visited because no beta-cutoff is triggered (alpha = -0.2, and 0.4 > -0.2 so search continues).`,
      code: `# Rohit declaration simulator
print("Optimal Decision: BAT MORE (Value: 0.0)")
`
    },
    {
      title: "Case Study 2: Diwali Cracker Stall Fire-Safety Inspection",
      problem: `Inspector (MAX) chooses to inspect Aisle 1, 2, or 3. Owner (MIN) positions stock to minimize expected fine. Leaves (₹ thousand): A1=[30, 12, 25], A2=[18, 40, 8], A3=[22, 15, 35].`,
      q1: "Q1. Run Minimax bottom-up to compute aisle values:",
      a1: "MIN(A1) = min(30, 12, 25) = 12.\nMIN(A2) = min(18, 40, 8) = 8.\nMIN(A3) = min(22, 15, 35) = 15.\nRoot MAX = max(12, 8, 15) = 15. The inspector should choose to inspect AISLE-3.",
      q2: "Q2. Apply alpha-beta pruning from left to right:",
      a2: `1. Aisle 1 (MIN): leaves 30, 12, 25. Min value is 12. Root Alpha (MAX) is updated to >= 12.
2. Aisle 2 (MIN):
   - Leaf 18: Beta = 18.
   - Leaf 40: Beta = 18.
   - Leaf 8: Beta = 8.
   - Since 8 < 12 (Alpha), MAX will never choose Aisle 2. But we only find this at the last leaf. No pruning in Aisle 2.
3. Aisle 3 (MIN):
   - Leaf 22: Beta = 22.
   - Leaf 15: Beta = 15.
   - Leaf 35: Beta = 15.
No pruning is triggered here because the branches don't violate alpha-beta bounds early. All 9 leaves are visited.`,
      code: `# Diwali inspector minimax values
print("Aisle 1 MIN: 12")
print("Aisle 2 MIN: 8")
print("Aisle 3 MIN: 15")
print("Best Inspection: Aisle 3")
`
    },
    {
      title: "Case Study 3: Chess Clock under Time-Pressure (Iterative Deepening)",
      problem: `Rapid format chess. Player A has 3 minutes, Player B has 2 minutes. Player A (MAX) evaluates moves M1, M2, or M3. Leaves: M1=[+0.4, -0.1, +0.6], M2=[+0.3, +0.2, +0.8], M3=[-0.5, +0.4, +0.7].`,
      q1: "Q1. Define zero-sum and perfect information games:",
      a1: "• Zero-Sum Game: A game where one player's gain is exactly equal to the other player's loss (e.g., Chess, where win=+1, loss=-1, sum=0).\n• Perfect Information: A game where all players can see the entire state of the board at all times (e.g., Chess). Contrast with Imperfect Information (e.g., Poker, where cards are hidden).",
      q2: "Q2. Run bottom-up minimax for Player A:",
      a2: "MIN(M1) = min(+0.4, -0.1, +0.6) = -0.1.\nMIN(M2) = min(+0.3, +0.2, +0.8) = +0.2.\nMIN(M3) = min(-0.5, +0.4, +0.7) = -0.5.\nRoot MAX = max(-0.1, +0.2, -0.5) = +0.2. Player A's optimal move is M2.",
      q3: "Q3. Apply Alpha-Beta pruning to find pruned subtrees:",
      a3: "After evaluating M1 (value -0.1) and M2 (value +0.2), Root Alpha is >= +0.2. Now evaluate M3: Left leaf is -0.5. Since the value is -0.5, the MIN node at M3 can guarantee an outcome of at most -0.5 (Beta <= -0.5). Since this is less than the current Alpha (+0.2), MAX will never choose M3. Thus, the remaining leaves (+0.4, +0.7) under M3 are pruned! Visited leaves = 7 (compared to 9 in full minimax).",
      code: `# Chess alpha-beta simulator showing pruning
print("M1 value: -0.1")
print("M2 value: +0.2")
print("M3 value: -0.5 (pruned remaining nodes!)")
print("Leaves visited: 7 of 9")
`
    },
    {
      title: "Case Study 4: Self-Driving Car route planning (Expectiminimax)",
      problem: `AI car (MAX) chooses between Route A (Highway) and Route B (City). Highway: Smooth (p=0.5, utility 90), Moderate (p=0.3, utility 50), Heavy (p=0.2, utility 10). City: Smooth (p=0.3, utility 80), Moderate (p=0.4, utility 60), Heavy (p=0.3, utility 40).`,
      q1: "Q1. Identify node types in the Expectiminimax game tree:",
      a1: "• MAX node: The root decision node (AI chooses Route A or Route B).\n• Chance nodes: The intermediate nodes representing traffic conditions on Route A and Route B.\n• Terminal nodes: The leaf nodes representing the final utility scores (90, 50, 10, etc.).",
      q2: "Q2. Calculate the expected utility value for both routes and identify choice:",
      a2: `• Expected Utility (Route A) = (0.5 * 90) + (0.3 * 50) + (0.2 * 10) = 45 + 15 + 2 = 62.
• Expected Utility (Route B) = (0.3 * 80) + (0.4 * 60) + (0.3 * 40) = 24 + 24 + 12 = 60.
The AI car selects Route A (Expected Utility 62 > 60).`,
      code: `def expectiminimax_route():
    utility_A = 0.5 * 90 + 0.3 * 50 + 0.2 * 10
    utility_B = 0.3 * 80 + 0.4 * 60 + 0.3 * 40
    print(f"Route A Expected Utility: {utility_A}")
    print(f"Route B Expected Utility: {utility_B}")
    print(f"Optimal Choice: {'Route A' if utility_A > utility_B else 'Route B'}")

expectiminimax_route()
`
    },
    {
      title: "Case Study 5: Cancer Treatment Decision Tree (QALYs)",
      problem: `Oncologist chooses between: Surgery (S: 0.7->8 QALY, 0.3->1 QALY), Chemotherapy (C: 0.5->6 QALY, 0.5->3 QALY), Radiotherapy (R: 0.6->5 QALY, 0.4->4 QALY). Compare MEU vs. Minimax.`,
      q1: "Q1. Compute the Expected QALY (utility) for each treatment according to MEU:",
      a1: `• Expected Utility (S) = (0.7 * 8) + (0.3 * 1) = 5.6 + 0.3 = 5.9 QALY.
• Expected Utility (C) = (0.5 * 6) + (0.5 * 3) = 3.0 + 1.5 = 4.5 QALY.
• Expected Utility (R) = (0.6 * 5) + (0.4 * 4) = 3.0 + 1.6 = 4.6 QALY.
According to the Maximum Expected Utility (MEU) principle, select Surgery (S) with 5.9 QALY.`,
      q2: "Q2. Assume oncologist is highly risk-averse and uses Minimax criterion:",
      a2: "Under the Minimax (or Maximin) criterion, we evaluate only the worst-case scenario for each: worst(S) = 1 QALY; worst(C) = 3 QALY; worst(R) = 4 QALY. The maximum of these worst cases is 4 QALY (Radiotherapy). The risk-averse strategy selects Radiotherapy (R).",
      code: `def select_treatment():
    expected_s = 0.7 * 8 + 0.3 * 1
    expected_c = 0.5 * 6 + 0.5 * 3
    expected_r = 0.6 * 5 + 0.4 * 4
    
    print(f"Expected S: {expected_s}, C: {expected_c}, R: {expected_r}")
    print(f"MEU Choice: Surgery")
    print(f"Minimax Choice: Radiotherapy")

select_treatment()
`
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CO4: Adversarial Search & Games</h1>
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

      <ImportanceBadge rating={8} />

      {/* Concept Explanations */}
      <div className="card">
        <h2>1. Adversarial Search Concepts & Definitions</h2>
        
        <h3>A. Minimax & Pruning Bounds</h3>
        <p>
          * **Minimax**: A recursive algorithm used in two-player zero-sum games. It traverses the game tree DFS-style. At MAX nodes, it chooses the maximum value of children. At MIN nodes, it assumes the opponent acts optimally and chooses the minimum value.
          * **Alpha-Beta Pruning**: A search optimization that prunes subtrees that do not affect the final minimax decision. It maintains two values:
        </p>
        <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--accent)', margin: '1rem 0' }}>
          <p><strong>Alpha (α):</strong> The best (highest) value that the MAX player can guarantee along the search path. Starts at -infinity.</p>
          <p><strong>Beta (β):</strong> The best (lowest) value that the MIN player can guarantee along the search path. Starts at +infinity.</p>
          <p><strong>Pruning Condition:</strong> If at any point {"alpha >= beta"}, the current node's remaining children are pruned because the opponent can force a worse outcome, making the path unreachable in optimal play.</p>
        </div>

        <h3>B. Real-world Time Management</h3>
        <p>
          * **Evaluation Function**: In real-world games, we cannot search to the terminal nodes. We search to a **Depth Limit** and apply an evaluation function to estimate the state's utility using heuristic features (e.g. material count in chess).
          * **Iterative Deepening**: To fit time constraints, the agent runs Minimax with depth limit = 1, then depth = 2, and so on. If the chess clock runs out, it aborts search and plays the best move found in the deepest completed iteration.
        </p>
      </div>

      {/* SVG Tree Simulator */}
      <div className="card">
        <h2>2. Step-by-Step Game Tree Visualizer</h2>
        <p>Edit leaf values below and click Step Traversal to see alpha and beta bounds update in real-time:</p>

        <div className="visualizer-container">
          <div className="visualizer-controls">
            <label style={{ fontSize: '0.85rem', fontWeight: '500', marginRight: '1rem' }}>
              <input 
                type="checkbox" 
                checked={abEnabled} 
                onChange={(e) => setAbEnabled(e.target.checked)} 
                style={{ marginRight: '0.25rem' }} 
              />
              Enable Alpha-Beta Pruning
            </label>

            <button 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={handleStep}
              disabled={currentStep >= abSteps.length - 1}
            >
              Step Traversal ({currentStep + 1} / {abSteps.length})
            </button>
            
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              onClick={resetSimulator}
            >
              <RotateCcw size={12} /> Reset
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '400px', padding: '1.5rem', background: 'white', display: 'flex', justifyContent: 'center' }}>
              <svg width="460" height="260" style={{ border: '1px solid var(--border-light)', borderRadius: '8px' }}>
                <line x1="230" y1="30" x2="110" y2="90" stroke="var(--border-medium)" strokeWidth="2" />
                <line x1="230" y1="30" x2="350" y2="90" stroke={prunedNodes.includes('G') ? '#EFECEC' : 'var(--border-medium)'} strokeWidth="2" strokeDasharray={prunedNodes.includes('G') ? '4' : '0'} />

                <line x1="110" y1="90" x2="60" y2="150" stroke="var(--border-medium)" strokeWidth="2" />
                <line x1="110" y1="90" x2="160" y2="150" stroke="var(--border-medium)" strokeWidth="2" />
                <line x1="350" y1="90" x2="300" y2="150" stroke="var(--border-medium)" strokeWidth="2" />
                <line x1="350" y1="90" x2="400" y2="150" stroke={prunedNodes.includes('G') ? '#EFECEC' : 'var(--border-medium)'} strokeWidth="2" strokeDasharray={prunedNodes.includes('G') ? '4' : '0'} />

                <line x1="60" y1="150" x2="35" y2="210" stroke="var(--border-medium)" strokeWidth="1.5" />
                <line x1="60" y1="150" x2="85" y2="210" stroke="var(--border-medium)" strokeWidth="1.5" />
                
                <line x1="160" y1="150" x2="135" y2="210" stroke="var(--border-medium)" strokeWidth="1.5" />
                <line x1="160" y1="150" x2="185" y2="210" stroke="var(--border-medium)" strokeWidth="1.5" />
                
                <line x1="300" y1="150" x2="275" y2="210" stroke="var(--border-medium)" strokeWidth="1.5" />
                <line x1="300" y1="150" x2="325" y2="210" stroke="var(--border-medium)" strokeWidth="1.5" />
                
                <line x1="400" y1="150" x2="375" y2="210" stroke={prunedNodes.includes('G') ? '#EFECEC' : 'var(--border-medium)'} strokeWidth="1.5" strokeDasharray={prunedNodes.includes('G') ? '3' : '0'} />
                <line x1="400" y1="150" x2="425" y2="210" stroke={prunedNodes.includes('G') ? '#EFECEC' : 'var(--border-medium)'} strokeWidth="1.5" strokeDasharray={prunedNodes.includes('G') ? '3' : '0'} />

                <circle cx="230" cy="30" r="18" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="2" />
                <text x="230" y="34" textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--text-primary)">{nodeValues.A}</text>
                <text x="230" y="10" textAnchor="middle" fontSize="9" fill="var(--text-muted)">MAX</text>

                <circle cx="110" cy="90" r="18" fill="var(--sage-light)" stroke="var(--sage)" strokeWidth="2" />
                <text x="110" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--text-primary)">{nodeValues.B}</text>

                <circle cx="350" cy="90" r="18" fill={prunedNodes.includes('G') ? '#FAF8F5' : 'var(--sage-light)'} stroke={prunedNodes.includes('G') ? 'var(--border-medium)' : 'var(--sage)'} strokeWidth="2" />
                <text x="350" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="var(--text-primary)">{nodeValues.C}</text>
                <text x="350" y="70" textAnchor="middle" fontSize="9" fill="var(--text-muted)">MIN</text>

                <circle cx="60" cy="150" r="16" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="1.5" />
                <text x="60" y="154" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--text-primary)">{nodeValues.D}</text>

                <circle cx="160" cy="150" r="16" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="1.5" />
                <text x="160" y="154" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--text-primary)">{nodeValues.E}</text>

                <circle cx="300" cy="150" r="16" fill="var(--accent-light)" stroke="var(--accent)" strokeWidth="1.5" />
                <text x="300" y="154" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--text-primary)">{nodeValues.F}</text>

                <circle cx="400" cy="150" r="16" fill={prunedNodes.includes('G') ? '#FAF8F5' : 'var(--accent-light)'} stroke={prunedNodes.includes('G') ? 'var(--border-medium)' : 'var(--accent)'} strokeWidth="1.5" />
                <text x="400" y="154" textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--text-primary)">{nodeValues.G}</text>

                {prunedNodes.includes('G') && (
                  <path d="M 380 135 L 420 165 M 420 135 L 380 165" stroke="var(--coral)" strokeWidth="3" opacity="0.8" />
                )}
              </svg>
            </div>

            <div style={{ width: '300px', borderLeft: '1px solid var(--border-medium)', background: 'var(--bg-app)', padding: '1rem', maxHeight: '260px', overflowY: 'auto' }}>
              <h4 style={{ marginTop: 0 }}>Traversal Steps Trace</h4>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                {abTrace.map((log, idx) => (
                  <div key={idx} style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.25rem' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-sidebar)', padding: '1rem', borderTop: '1px solid var(--border-medium)' }}>
            <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Change Leaf Values:</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {leaves.map((leaf, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>L{idx}</span>
                  <input 
                    type="number" 
                    value={leaf} 
                    onChange={(e) => handleLeafChange(idx, e.target.value)}
                    style={{ width: '45px', padding: '0.2rem', borderRadius: '4px', border: '1px solid var(--border-medium)', textAlign: 'center', background: 'white' }}
                  />
                </div>
              ))}
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

          {caseStudies[activeCaseStudy].q3 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q3. {caseStudies[activeCaseStudy].q3}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)', whiteSpace: 'pre-line' }}>
                {caseStudies[activeCaseStudy].a3}
              </p>
            </div>
          )}

          <h4>Python Code:</h4>
          <CodeBlock code={caseStudies[activeCaseStudy].code} filename={`case_study_game_${activeCaseStudy + 1}.py`} />
        </div>
      </div>

      <MCQSection coId="CO4" />
    </div>
  );
}
