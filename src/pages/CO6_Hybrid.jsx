import React, { useState } from 'react';
import ImportanceBadge from '../components/ImportanceBadge';
import CodeBlock from '../components/CodeBlock';
import MCQSection from '../components/MCQSection';
import { Compass, ShieldCheck, Heart, AlertCircle, BookOpen } from 'lucide-react';

export default function CO6_Hybrid({ isCompleted, toggleCompleted }) {
  const [battery, setBattery] = useState(25);
  const [wind, setWind] = useState(15);
  const [cloudCover, setCloudCover] = useState(80);
  const [sensorAnomaly, setSensorAnomaly] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const lowBatteryAlert = battery < 15;
  const highWindAlert = wind > 35;

  let baseRisk = 0.01;
  if (wind > 20) baseRisk += 0.05;
  if (cloudCover > 60) baseRisk += 0.04;
  if (sensorAnomaly) baseRisk += 0.20;
  const crashRisk = Math.min(baseRisk, 1.0);

  let selectedAction = 'FLY_DIRECT';
  let reasoningTrace = [];

  if (lowBatteryAlert) {
    selectedAction = 'EMERGENCY_LAND';
    reasoningTrace.push('Rule Check: Battery level < 15%. Triggering immediate emergency landing.');
  } else if (highWindAlert) {
    selectedAction = 'ABORT_TO_BASE';
    reasoningTrace.push('Rule Check: Wind speed exceeds safety threshold of 35 km/h. Returning to home base.');
  } else if (crashRisk > 0.15) {
    selectedAction = 'HOVER_AND_RECALIBRATE';
    reasoningTrace.push(`Bayes Net Check: Crash Risk estimate is ${Math.round(crashRisk * 100)}% (threshold 15%). Hovering in place for safety.`);
  } else {
    selectedAction = 'EXECUTE_ASTAR_PATH';
    reasoningTrace.push(`Safety & Risk checks passed (Risk: ${Math.round(crashRisk * 100)}%). Executing standard shortest A* path to delivery destination.`);
  }

  const caseStudies = [
    {
      title: "Case Study 1: Ethical Bias in AI Loan Approvals",
      problem: `A bank's loan approval AI rejects applicants from low-income neighborhoods much more frequently than wealthy areas, despite similar credit scores and repayment histories. Data:
- Wealthy: 600 applications, 480 approved, 120 rejected.
- Low-Income: 400 applications, 120 approved, 280 rejected.`,
      q1: "Q1. Calculate the approval rate for each group and determine evidence of bias:",
      a1: "• Wealthy Neighborhood Approval Rate = (480 / 600) * 100 = 80%\n• Low-Income Neighborhood Approval Rate = (120 / 400) * 100 = 30%\nYes, there is clear evidence of bias. A 50% gap in approval rates exists (80% - 30%), showing that the AI favors wealthy applicants and penalizes low-income applicants with identical creditworthiness.",
      q2: "Q2. Explain which ethical principles are violated and how to make the system fairer:",
      a2: "• Fairness: Evaluating applicants on biased historical neighborhood features instead of individual credit history.\n• Non-Discrimination: Treating individuals differently based on socioeconomic background.\n• Transparency: Inability to easily explain why a creditworthy candidate was rejected.\n• Corrective Methods: 1. Exclude neighborhood zip-code information from the feature set. 2. Balance the training dataset. 3. Implement human-in-the-loop overrides.",
      code: `wealthy_app, wealthy_ok = 600, 480
poor_app, poor_ok = 400, 120

rate_w = (wealthy_ok / wealthy_app) * 100
rate_p = (poor_ok / poor_app) * 100

print(f"Wealthy Approval Rate: {rate_w}%")
print(f"Low-Income Approval Rate: {rate_p}%")
print(f"Disparate Impact Ratio: {rate_p / rate_w:.2f}")
`
    },
    {
      title: "Case Study 2: Ethical Issues in AI Healthcare Heart Diagnosis",
      problem: "A hospital's diagnostic AI misses cardiac symptoms in women because the training dataset collected records mainly from middle-aged male patients. Test stats: Male = 90/100 correct; Female = 60/100 correct.",
      q1: "Q1. Identify the ethical issues and how patient safety is affected:",
      a1: "• Fairness: Females receive significantly poorer diagnostic quality (60% accuracy vs 90% for males).\n• Accountability: Hospital and developers did not validate gender balance in the training dataset.\n• Patient Safety: Delayed treatments for heart disease in females directly cause serious health complications or fatalities.",
      q2: "Q2. Write a python program to calculate diagnostic accuracy:",
      a2: "The program calculates male accuracy (90.0%) and female accuracy (60.0%) and prints the gender gap (30.0%).",
      code: `male_correct, male_total = 90, 100
female_correct, female_total = 60, 100

male_acc = (male_correct / male_total) * 100
female_acc = (female_correct / female_total) * 100

print(f"Male Accuracy: {male_acc}%")
print(f"Female Accuracy: {female_acc}%")
print(f"Accuracy Gap: {male_acc - female_acc}%")
`
    },
    {
      title: "Case Study 3: Social Media Content Recommendation (Filter Bubbles)",
      problem: "A recommendation system optimizes for user engagement. Over time, sensational/misleading content receives high visibility, and users are stuck in extreme viewpoint echo chambers. Audit: 1,000 recommendations contain 700 sensational posts and 300 educational posts.",
      q1: "Q1. Explain how maximizing engagement leads to biased recommendations and filter bubbles:",
      a1: "Sensational and extreme content naturally triggers stronger emotional reactions (outrage, excitement), prompting users to click, share, and comment. If the AI's objective function is purely maximizing engagement metrics, it learns to prioritize this clickbait, pushing educational content out. As users click on these, the feedback loop locks them into 'Filter Bubbles' where they are only exposed to extreme, narrow viewpoints, worsening polarization.",
      q2: "Q2. Suggest four measures to make the recommendation system more ethical and balanced:",
      a2: "1. Multi-Objective Optimization: Include diversity, accuracy, and educational index in the loss function, rather than pure click-through rates.\n2. Disinformation Filtering: Integrate automated fact-checking systems to down-rank unverified claims.\n3. User Feeds Control: Provide sliders for users to choose content weights (e.g. 'Show more science, less politics').\n4. Transparency Badges: Explain why a post is in the feed (e.g., 'Recommended because you liked similar technology posts').",
      code: `sensational, educational = 700, 300
total = sensational + educational

p_sens = (sensational / total) * 100
p_edu = (educational / total) * 100

print(f"Sensational Content Share: {p_sens}%")
print(f"Educational Content Share: {p_edu}%")
`
    },
    {
      title: "Case Study 4: Rural Bias in AI University Admissions screening",
      problem: "A screening AI rejects rural applicants at higher rates than urban applicants. Urban: 180 selected out of 250. Rural: 100 selected out of 250. Credit is given heavily to extracurricular availability and school reputation, which are under-resourced in rural areas.",
      q1: "Q1. Illustrate the ethical concerns and how the data contributed to the rural bias:",
      a1: "The primary concerns are Equal Opportunity and Fairness. The training data contained past admissions where urban students were selected more frequently. The AI correlated school reputation and extensive extracurricular lists with 'admissibility'. Since rural schools lack funding for clubs and have lower reputation scores, the AI indirectly discriminated against rural candidates, converting historical privilege into a screening rule.",
      q2: "Q2. Suggest four fair admissions measures:",
      a2: "1. Exclude school reputation from feature processing. 2. Implement 'Contextualized Admissions' (comparing rural students against average performance in their specific school district). 3. Balance dataset representation. 4. Allow manual appeals for candidates rejected in the automated screening phase.",
      code: `urban_sel, urban_tot = 180, 250
rural_sel, rural_tot = 100, 250

rate_u = (urban_sel / urban_tot) * 100
rate_r = (rural_sel / rural_tot) * 100

print(f"Urban Selection: {rate_u}%")
print(f"Rural Selection: {rate_r}%")
print(f"Difference Gap: {rate_u - rate_r}%")
`
    },
    {
      title: "Case Study 5: Personalised Job Ad targeting bias",
      problem: "A personalized job targeting AI shows high-paying job ads mainly to males (800 views) compared to females (200 views) because it optimizes for click-through rate based on historical engagement.",
      q1: "Q1. Identify ethical issues and optimization bias details:",
      a1: "• Ethical Issues: Discrimination, lack of equal employment opportunity.\n• Cause: The system optimized purely for click-through rates. Historically, if males clicked high-paying job ads slightly more, the AI magnified this minor correlation, eventually restricting female exposure completely. This lock-in reinforces gender inequality in professional fields.",
      code: `male_ads, female_ads = 800, 200
total = male_ads + female_ads

p_male = (male_ads / total) * 100
p_female = (female_ads / total) * 100

print(f"High-Paying Job Ads Shown to Males: {p_male}%")
print(f"High-Paying Job Ads Shown to Females: {p_female}%")
`
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CO6: Hybrid AI Architectures & Limitations</h1>
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

      <ImportanceBadge rating={7} />

      <div className="card">
        <h2>1. Hybrid AI Systems</h2>
        <p>
          Complex systems combine multiple paradigms:
          * **Rule-Based Subsystem**: Checks boundaries (such as battery levels or critical alarms) in real-time, executing overrides.
          * **Search Subsystem**: Plans path routing (e.g. A* search) inside structured obstacle networks.
          * **Probabilistic Subsystem**: Updates likelihoods of environment failures (using Bayesian networks) to handle sensor anomalies.
        </p>
      </div>

      {/* Drone Sandbox */}
      <div className="card">
        <h2>2. Medical Delivery Drone Sandbox (Hybrid System Simulation)</h2>
        <p>Adjust the drone environmental inputs below to inspect the decision logic trace and resulting action selection.</p>

        <div className="visualizer-container">
          <div className="visualizer-controls">
            <h4 style={{ margin: 0 }}>Drone Sensor Inputs Panel</h4>
          </div>

          <div className="grid-2" style={{ padding: '1.5rem', background: 'white' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Battery Level: <strong style={{ color: battery < 15 ? 'var(--coral)' : 'var(--sage)' }}>{battery}%</strong>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={battery} 
                  onChange={(e) => setBattery(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Wind Speed: <strong style={{ color: wind > 35 ? 'var(--coral)' : 'var(--sage)' }}>{wind} km/h</strong>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="60" 
                  value={wind} 
                  onChange={(e) => setWind(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                  Cloud Cover: <strong>{cloudCover}%</strong>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={cloudCover} 
                  onChange={(e) => setCloudCover(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>

              <label style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={sensorAnomaly} 
                  onChange={(e) => setSensorAnomaly(e.target.checked)} 
                  style={{ marginRight: '0.5rem' }} 
                />
                Trigger Sensor Fault/Anomaly
              </label>
            </div>

            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '1.25rem' }}>
              <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Agent Decision Output</h3>
              
              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {selectedAction === 'EXECUTE_ASTAR_PATH' && (
                  <span className="badge badge-sage" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>✓ {selectedAction}</span>
                )}
                {selectedAction === 'HOVER_AND_RECALIBRATE' && (
                  <span className="badge badge-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>⚠ {selectedAction}</span>
                )}
                {(selectedAction === 'EMERGENCY_LAND' || selectedAction === 'ABORT_TO_BASE') && (
                  <span className="badge badge-terracotta" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>✘ {selectedAction}</span>
                )}
              </div>

              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Explainable Reasoning Trace:</h4>
              <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                {reasoningTrace.map((t, idx) => (
                  <div key={idx} style={{ color: 'var(--text-primary)' }}>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Section */}
      <div className="card" style={{ borderLeft: '4px solid var(--sage)', background: '#FAFBF9' }}>
        <h2>3. Syllabus Case Studies & Solved Traces (Ethics)</h2>
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

          <h4>Python Verification Code:</h4>
          <CodeBlock code={caseStudies[activeCaseStudy].code} filename={`case_study_ethics_${activeCaseStudy + 1}.py`} />
        </div>
      </div>

      <MCQSection coId="CO6" />
    </div>
  );
}
