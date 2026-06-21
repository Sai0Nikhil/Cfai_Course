import React, { useState } from 'react';
import ImportanceBadge from '../components/ImportanceBadge';
import CodeBlock from '../components/CodeBlock';
import MCQSection from '../components/MCQSection';
import { HelpCircle, Play, RefreshCw, Layers } from 'lucide-react';

export default function CO5_Probability({ isCompleted, toggleCompleted }) {
  const [priorA, setPriorA] = useState(0.001); // 1 in 1000 (Case Study 1 default)
  const [likeBGivenA, setLikeBGivenA] = useState(0.95); // sensitivity (95%)
  const [likeBGivenNotA, setLikeBGivenNotA] = useState(0.1); // false positive rate (1 - specificity 90%)

  const pNotA = 1 - priorA;
  const pB = (likeBGivenA * priorA) + (likeBGivenNotA * pNotA);
  const posterior = pB > 0 ? (likeBGivenA * priorA) / pB : 0;

  const [veStep, setVeStep] = useState(0);

  const [stateDist, setStateDist] = useState([1.0, 0.0]); // Sunny, Rainy
  const [transitionMatrix, setTransitionMatrix] = useState({
    SS: 0.8, SR: 0.2,
    RS: 0.4, RR: 0.6
  });
  const [mcStep, setMcStep] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const stepMarkov = () => {
    const nextSunny = stateDist[0] * transitionMatrix.SS + stateDist[1] * transitionMatrix.RS;
    const nextRainy = stateDist[0] * transitionMatrix.SR + stateDist[1] * transitionMatrix.RR;
    setStateDist([Number(nextSunny.toFixed(4)), Number(nextRainy.toFixed(4))]);
    setMcStep(prev => prev + 1);
  };

  const resetMarkov = () => {
    setStateDist([1.0, 0.0]);
    setMcStep(0);
  };

  const veSlides = [
    {
      title: 'Step 1: Set up the Joint Probability Expression',
      text: 'We want to compute P(B | j, m) on the Burglar Alarm network. The full joint distribution is: P(B, E, A, j, m) = P(B) * P(E) * P(A|B,E) * P(j|A) * P(m|A). We need to sum out the unobserved variables (Earthquake E and Alarm A).',
      math: 'P(B | j, m) = alpha * sum_e * sum_a P(B) * P(e) * P(a|B,e) * P(j|a) * P(m|a)'
    },
    {
      title: 'Step 2: Collect factors and set Elimination Order',
      text: 'To compute this efficiently, we factor out terms that do not depend on the summation variables. Let\'s choose the elimination order: [E, A] (we will eliminate E first, then A).',
      math: 'P(B | j, m) = alpha * P(B) * sum_a P(j|a) * P(m|a) * sum_e P(e) * P(a|B,e)'
    },
    {
      title: 'Step 3: Eliminate Earthquake (E)',
      text: 'We sum out E by creating a new factor f_1(A, B) = sum_e P(e) * P(A|B,e). For each combination of A and B, we sum over e = {true, false}. The equation now simplifies to:',
      math: 'P(B | j, m) = alpha * P(B) * sum_a P(j|a) * P(m|a) * f_1(a, B)'
    },
    {
      title: 'Step 4: Eliminate Alarm (A)',
      text: 'We now sum out A by creating another factor f_2(B) = sum_a P(j|a) * P(m|a) * f_1(a, B). We multiply these values for a = {true, false} and sum them up.',
      math: 'P(B | j, m) = alpha * P(B) * f_2(B)'
    },
    {
      title: 'Step 5: Normalize output with factor alpha',
      text: 'We compute values for B = true and B = false. Let\'s say the unnormalized values are [0.000592, 0.00149]. We sum them to find the normalizer (0.002082) and divide each by it to ensure probabilities sum to 1. P(B=true | j,m) ≈ 0.284.',
      math: 'P(B | j, m) = [0.284, 0.716]'
    }
  ];

  const caseStudies = [
    {
      title: "Case Study 1: Rare Disease Detection (Bayes Theorem)",
      problem: "A hospital detects a rare disease (D) via a test (T). Prevalence is 1/1000. Test sensitivity is 95% (T+ given D). Test specificity is 90% (T- given healthy). A patient tests positive. What is the probability they have the disease?",
      q1: "Q1. Identify prior, conditional probabilities, and evidence:",
      a1: "• Prior: P(D) = 0.001, P(¬D) = 0.999.\n• Conditionals: P(T+ | D) = 0.95 (sensitivity), P(T- | ¬D) = 0.90 (specificity), P(T+ | ¬D) = 1 - specificity = 0.10 (false positive rate).\n• Evidence: Test is positive (T+).",
      q2: "Q2. Calculate using Bayes' theorem:",
      a2: `P(D | T+) = [P(T+ | D) * P(D)] / P(T+)
P(T+) = P(T+ | D)P(D) + P(T+ | ¬D)P(¬D) = (0.95 * 0.001) + (0.10 * 0.999) = 0.00095 + 0.0999 = 0.10085.
P(D | T+) = (0.95 * 0.001) / 0.10085 = 0.00095 / 0.10085 ≈ 0.0094 (0.94%).
Although the test is 95% accurate, the posterior probability of disease is under 1% because the disease is extremely rare.`,
      code: `def calculate_bayes(prior, sensitivity, specificity):
    p_d = prior
    p_not_d = 1.0 - p_d
    p_t_given_d = sensitivity
    p_t_given_not_d = 1.0 - specificity
    
    p_t = (p_t_given_d * p_d) + (p_t_given_not_d * p_not_d)
    p_d_given_t = (p_t_given_d * p_d) / p_t
    return p_d_given_t

print(f"Posterior Probability: {calculate_bayes(0.001, 0.95, 0.90):.4f}")
`
    },
    {
      title: "Case Study 2: Aadhaar Biometric Authentication",
      problem: "Aadhaar API fingerprint match YES/NO. TMR (sensitivity) = 0.99. FMR (false match rate) = 0.0001. Genuine claim rate = 0.999, Impostor rate = 0.001. Compute P(genuine | YES match) and P(impostor | NO match).",
      q1: "Q1. Identify prior and likelihood probabilities and explain TMR & FMR:",
      a1: "P(same) = 0.999, P(diff) = 0.001.\nP(YES | same) = 0.99 (True Match Rate), P(YES | diff) = 0.0001 (False Match Rate).\nP(NO | same) = 0.01 (True Non-Match Rate), P(NO | diff) = 0.9999 (False Non-Match Rate).\nTMR is sensitivity: ability to correctly authenticate genuine users. FMR is security: rate at which impostors are incorrectly matched.",
      q2: "Q2. Compute P(genuine | YES match):",
      a2: `P(YES) = P(YES|same)P(same) + P(YES|diff)P(diff) = (0.99 * 0.999) + (0.0001 * 0.001) = 0.98901 + 0.0000001 = 0.9890101.
P(genuine | YES) = (0.99 * 0.999) / 0.9890101 ≈ 0.99999 (99.999%).
A YES output is extremely reliable.`,
      q3: "Q3. Compute P(impostor | NO match):",
      a3: `P(NO) = P(NO|same)P(same) + P(NO|diff)P(diff) = (0.01 * 0.999) + (0.9999 * 0.001) = 0.00999 + 0.0009999 = 0.0109899.
P(impostor | NO) = (0.9999 * 0.001) / 0.0109899 ≈ 0.091 (9.1%).
A NO match has a 9.1% chance of being an impostor, but a 90.9% chance of being a genuine user who had a biometric reading error (false rejection).`,
      code: `p_same, p_diff = 0.999, 0.001
p_yes_same, p_yes_diff = 0.99, 0.0001

p_yes = (p_yes_same * p_same) + (p_yes_diff * p_diff)
p_genuine_yes = (p_yes_same * p_same) / p_yes
print(f"P(genuine|YES): {p_genuine_yes:.6f}")

p_no = ((1 - p_yes_same) * p_same) + ((1 - p_yes_diff) * p_diff)
p_impostor_no = ((1 - p_yes_diff) * p_diff) / p_no
print(f"P(impostor|NO): {p_impostor_no:.6f}")
`
    },
    {
      title: "Case Study 3: Warehouse Robot Obstacle Detection (Bayesian Network)",
      problem: "Bayesian Network: SensorSignal (S) -> ObstaclePresent (O) -> ActionTaken (A). Compute joint probability of P(O=T, S=F, A=T).",
      q1: "Q1. Describe the network factorization andDirected link roles:",
      a1: "The network factorization decomposes the joint distribution: P(S, O, A) = P(S) * P(O | S) * P(A | O). The directed link S -> O indicates that the sensor signal influences the probability that an obstacle is present. O -> A indicates the action depends on whether an obstacle is present.",
      q2: "Q2. Explain CPTs role:",
      a2: "CPTs define conditional probability tables. For each node, the CPT lists probabilities for every possible configuration of parent nodes. E.g., for A, CPT stores P(A | O) for O = true and O = false.",
      code: `# Bayesian Network factorization calculation
p_o_t = 0.4
p_s_f_given_o_t = 0.15
p_a_t_given_o_t = 0.9
joint = p_o_t * p_s_f_given_o_t * p_a_t_given_o_t
print(f"Factorized Joint Probability: {joint:.4f}")
`
    },
    {
      title: "Case Study 4: HMM Weather Prediction (Viterbi Algorithm)",
      problem: `Weather (Sunny/Rainy). Initial: R=0.6, S=0.4. Transition: R->R(0.7), R->S(0.3), S->R(0.4), S->S(0.6). Emission: U|R = 0.9, U|S = 0.2, N|R = 0.1, N|S = 0.8. Observations O = (U, U, N). Find most likely sequence using Viterbi.`,
      q1: "Q1. Identify hidden and observable states:",
      a1: "• Hidden States: Weather {Rainy, Sunny}\n• Observable States: Carrying status {Umbrella, No Umbrella}",
      q2: "Q2. Calculate transitions from matrix:",
      a2: "Rainy to Sunny = 0.3. Sunny to Rainy = 0.4. Rainy to Rainy = 0.7.",
      q3: "Q3. Compute Day-1 Viterbi probabilities for observation U (Umbrella):",
      a3: "V_1(Rainy) = initial(R) * emission(U|R) = 0.6 * 0.9 = 0.54.\nV_1(Sunny) = initial(S) * emission(U|S) = 0.4 * 0.2 = 0.08.",
      q4: "Q4. Construct Viterbi dynamic programming table for Day 2 (U) and Day 3 (N):",
      a4: `• Day 2 (Observation: U):
  - V_2(R) = max[V_1(R)*T(R->R), V_1(S)*T(S->R)] * E(U|R) = max[0.54*0.7, 0.08*0.4] * 0.9 = max[0.378, 0.032] * 0.9 = 0.378 * 0.9 = 0.3402. (Backpointer: Rainy)
  - V_2(S) = max[V_1(R)*T(R->S), V_1(S)*T(S->S)] * E(U|S) = max[0.54*0.3, 0.08*0.6] * 0.2 = max[0.162, 0.048] * 0.2 = 0.162 * 0.2 = 0.0324. (Backpointer: Rainy)
• Day 3 (Observation: N):
  - V_3(R) = max[V_2(R)*T(R->R), V_2(S)*T(S->R)] * E(N|R) = max[0.3402*0.7, 0.0324*0.4] * 0.1 = max[0.23814, 0.01296] * 0.1 = 0.023814. (Backpointer: Rainy)
  - V_3(S) = max[V_2(R)*T(R->S), V_2(S)*T(S->S)] * E(N|S) = max[0.3402*0.3, 0.0324*0.6] * 0.8 = max[0.10206, 0.01944] * 0.8 = 0.081648. (Backpointer: Rainy)
Traceback from maximum V_3 (Sunny, value 0.081648) -> Day 2: Rainy -> Day 1: Rainy.
Most likely sequence: Rainy, Rainy, Sunny (RRN).`,
      code: `def viterbi_weather():
    states = ['R', 'S']
    obs = ['U', 'U', 'N']
    start_p = {'R': 0.6, 'S': 0.4}
    trans_p = {'R': {'R': 0.7, 'S': 0.3}, 'S': {'R': 0.4, 'S': 0.6}}
    emit_p = {'R': {'U': 0.9, 'N': 0.1}, 'S': {'U': 0.2, 'N': 0.8}}
    
    # Simple Viterbi implementation
    # Day 1
    v = [{'R': start_p['R']*emit_p['R']['U'], 'S': start_p['S']*emit_p['S']['U']}]
    
    # Day 2
    d2_r = max(v[0]['R']*trans_p['R']['R'], v[0]['S']*trans_p['S']['R']) * emit_p['R']['U']
    d2_s = max(v[0]['R']*trans_p['R']['S'], v[0]['S']*trans_p['S']['S']) * emit_p['S']['U']
    v.append({'R': d2_r, 'S': d2_s})
    
    # Day 3
    d3_r = max(v[1]['R']*trans_p['R']['R'], v[1]['S']*trans_p['S']['R']) * emit_p['R']['N']
    d3_s = max(v[1]['R']*trans_p['R']['S'], v[1]['S']*trans_p['S']['S']) * emit_p['S']['N']
    v.append({'R': d3_r, 'S': d3_s})
    
    print("Viterbi Matrix:")
    for idx, step in enumerate(v):
        print(f"Day {idx+1}: {step}")
viterbi_weather()
`
    },
    {
      title: "Case Study 5: Robot Navigation Using Hidden Markov Model (HMM)",
      problem: "Robot inside a warehouse with Room A (object present mostly) and Room B (empty mostly). Observation sequence O = (P, P, N). Compute visited rooms using Forward Algorithm.",
      q1: "Q1. Identify components of HMM:",
      a1: "• Hidden States: {Room A, Room B}\n• Observations: {Object Present (P), Object Absent (N)}\n• Initial: A=0.6, B=0.4\n• Transition: A->A(0.7), A->B(0.3), B->A(0.4), B->B(0.6)\n• Emission: P|A=0.8, N|A=0.2, P|B=0.3, N|B=0.7",
      q2: "Q2. Compute Forward probabilities at t=1 for P:",
      a2: "F_1(A) = initial(A)*emit(P|A) = 0.6 * 0.8 = 0.48.\nF_1(B) = initial(B)*emit(P|B) = 0.4 * 0.3 = 0.12.",
      q3: "Q3. Apply Forward Algorithm for full sequence P P N:",
      a3: `• t=2 (Observation: P):
  - F_2(A) = [F_1(A)*T(A->A) + F_1(B)*T(B->A)] * E(P|A) = [0.48*0.7 + 0.12*0.4] * 0.8 = [0.336 + 0.048] * 0.8 = 0.384 * 0.8 = 0.3072.
  - F_2(B) = [F_1(A)*T(A->B) + F_1(B)*T(B->B)] * E(P|B) = [0.48*0.3 + 0.12*0.6] * 0.3 = [0.144 + 0.072] * 0.3 = 0.216 * 0.3 = 0.0648.
• t=3 (Observation: N):
  - F_3(A) = [F_2(A)*T(A->A) + F_2(B)*T(B->A)] * E(N|A) = [0.3072*0.7 + 0.0648*0.4] * 0.2 = [0.21504 + 0.02592] * 0.2 = 0.24096 * 0.2 = 0.048192.
  - F_3(B) = [F_2(A)*T(A->B) + F_2(B)*T(B->B)] * E(N|B) = [0.3072*0.3 + 0.0648*0.6] * 0.7 = [0.09216 + 0.03888] * 0.7 = 0.13104 * 0.7 = 0.091728.
Total probability of sequence PPN = F_3(A) + F_3(B) = 0.048192 + 0.091728 = 0.13992.`,
      code: `# HMM Forward Algorithm demonstration
print("Forward probability at t=1 (Room A): 0.48")
print("Forward probability at t=2 (Room A): 0.3072")
print("Total observation path probability: 0.13992")
`
    },
    {
      title: "Case Study 6: Student Mood Prediction using Markov Chain",
      problem: "Student mood states: Happy (H), Neutral (N), Sad (S). Transitions: H->H(0.5), H->N(0.3), H->S(0.2); N->H(0.4), N->N(0.4), N->S(0.2); S->H(0.3), S->N(0.3), S->S(0.4). Today is Happy [1, 0, 0]. Compute t+1, t+2 and steady state.",
      q1: "Q1. If student is Happy today, determine mood distribution after 1 day (t+1):",
      a1: "Today state: [1.0, 0.0, 0.0]. Multiply by transition matrix row for Happy:\nt+1 vector = [0.5, 0.3, 0.2]. Happy probability is 50%, Neutral 30%, Sad 20%.",
      q2: "Q2. Determine distribution after 2 days (t+2):",
      a2: `Multiply t+1 vector [0.5, 0.3, 0.2] by transition matrix:
- P(H_2) = 0.5*0.5 + 0.3*0.4 + 0.2*0.3 = 0.25 + 0.12 + 0.06 = 0.43.
- P(N_2) = 0.5*0.3 + 0.3*0.4 + 0.2*0.3 = 0.15 + 0.12 + 0.06 = 0.33.
- P(S_2) = 0.5*0.2 + 0.3*0.2 + 0.2*0.4 = 0.10 + 0.06 + 0.08 = 0.24.
Distribution after 2 days: Happy: 43%, Neutral: 33%, Sad: 24%.`,
      code: `import numpy as np

# Transition matrix
P = np.array([
    [0.5, 0.3, 0.2],
    [0.4, 0.4, 0.2],
    [0.3, 0.3, 0.4]
])

# t=0 state (Happy)
v = np.array([1.0, 0.0, 0.0])
v1 = v.dot(P)
v2 = v1.dot(P)
print(f"After 1 day: {v1}")
print(f"After 2 days: {v2}")

# Solve steady state equations
# vP = v -> (P^T - I)v = 0
eigenvalues, eigenvectors = np.linalg.eig(P.T)
steady_state = eigenvectors[:, np.isclose(eigenvalues, 1.0)]
steady_state = steady_state / steady_state.sum()
print(f"Steady state distribution: {steady_state.flatten()}")
`
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CO5: Probabilistic Reasoning under Uncertainty</h1>
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

      {/* Textbook Concepts */}
      <div className="card">
        <h2>1. Probabilistic Reasoning Theory</h2>
        
        <h3>A. Bayes Rule & CPTs</h3>
        <p>
          * **Bayes Rule**: Updates our belief in hypothesis A given evidence B. It calculates: {"P(A | B) = [P(B | A) * P(A)] / P(B)"}.
          * **Bayesian Network**: A Directed Acyclic Graph (DAG) where nodes represent random variables and directed links represent causal dependencies. Each node is associated with a Conditional Probability Table (CPT) specifying {"P(Node | Parents)"}.
        </p>

        <h3>B. Exact Inference: Variable Elimination</h3>
        <p>
          Variable Elimination calculates exact queries by summing out hidden variables. Instead of computing the full joint distribution (which is exponential), it works with local **factors** (CPT slices). The algorithm performs two operations:
          * **Pointwise Product**: Joins factors containing the elimination variable.
          * **Summing Out**: Marginalizes out the variable by summing values across its domain, producing a new factor.
        </p>

        <h3>C. Sampling: Rejection vs. Likelihood Weighting</h3>
        <p>
          * **Rejection Sampling**: Generates random samples from the joint distribution. If a sample contradicts the evidence (e.g. tests negative when evidence is positive), it is rejected. Highly inefficient for rare evidence.
          * **Likelihood Weighting**: Avoids rejecting samples. It fixes evidence variables to their observed values and generates samples for hidden variables. Each sample is weighted by the likelihood of the evidence occurring, ensuring all samples are kept.
        </p>
      </div>

      {/* Interactive Bayes Rule Calculator */}
      <div className="card">
        <h2>2. Dynamic Bayes Rule Calculator</h2>
        <p>Enter the prior probability and test specificity/sensitivity below to calculate the posterior probability:</p>

        <div className="grid-3" style={{ margin: '1.5rem 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Prior P(D)</label>
            <input 
              type="number" 
              step="0.001" 
              min="0" 
              max="1" 
              value={priorA} 
              onChange={(e) => setPriorA(Number(e.target.value))}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Sensitivity P(T+ | D)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="1" 
              value={likeBGivenA} 
              onChange={(e) => setLikeBGivenA(Number(e.target.value))}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>False Alarm P(T+ | ¬D)</label>
            <input 
              type="number" 
              step="0.01" 
              min="0" 
              max="1" 
              value={likeBGivenNotA} 
              onChange={(e) => setLikeBGivenNotA(Number(e.target.value))}
              style={{ padding: '0.5rem', width: '100%', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'white' }}
            />
          </div>
        </div>

        <div style={{ background: 'var(--bg-sidebar)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border-medium)' }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Calculations:</h4>
          <ol style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
            <li>Prior probability of A complement: P(not D) = 1 - P(D) = {pNotA.toFixed(4)}</li>
            <li>Total evidence probability: P(T+) = P(T+|D)P(D) + P(T+|¬D)P(¬D) = {pB.toFixed(5)}</li>
            <li>Posterior probability: P(D|T+) = [P(T+|D) * P(D)] / P(T+) = <strong style={{ color: 'var(--accent)', fontSize: '1.05rem' }}>{posterior.toFixed(5)}</strong> ({Math.round(posterior * 100 * 1000) / 1000}% chance)</li>
          </ol>
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

          {caseStudies[activeCaseStudy].q4 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q4. {caseStudies[activeCaseStudy].q4}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)', whiteSpace: 'pre-line' }}>
                {caseStudies[activeCaseStudy].a4}
              </p>
            </div>
          )}

          {caseStudies[activeCaseStudy].q5 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q5. {caseStudies[activeCaseStudy].q5}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)', whiteSpace: 'pre-line' }}>
                {caseStudies[activeCaseStudy].a5}
              </p>
            </div>
          )}

          <h4>Python Code:</h4>
          <CodeBlock code={caseStudies[activeCaseStudy].code} filename={`case_study_prob_${activeCaseStudy + 1}.py`} />
        </div>
      </div>

      <MCQSection coId="CO5" />
    </div>
  );
}
