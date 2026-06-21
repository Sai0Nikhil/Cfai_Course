import React, { useState } from 'react';
import ImportanceBadge from '../components/ImportanceBadge';
import CodeBlock from '../components/CodeBlock';
import MCQSection from '../components/MCQSection';
import { BookOpen, Layers, Settings, ShieldCheck, HelpCircle } from 'lucide-react';

export default function CO1_Foundations({ isCompleted, toggleCompleted }) {
  const [selectedAgent, setSelectedAgent] = useState('car');
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);

  const agentsList = {
    car: {
      name: 'Self-Driving Car',
      performance: 'Safety, destination reached, speed, fuel efficiency, passenger comfort, law obedience',
      environment: 'Streets, highways, pedestrians, weather, other vehicles, traffic lights',
      actuators: 'Steering wheel, accelerator, brakes, indicators, screen, speaker',
      sensors: 'Cameras, LiDAR, RADAR, GPS, odometer, speedometer, engine sensors',
      properties: {
        observability: 'Partially Observable (cannot see around buildings or traffic)',
        determinism: 'Stochastic (other drivers, pedestrians, weather are unpredictable)',
        episodicity: 'Sequential (driving action now impacts future traffic states)',
        dynamism: 'Dynamic (environment changes constantly while deciding)',
        continuity: 'Continuous (speed, steering angle, time are real numbers)',
        agency: 'Multi-Agent (other drivers, pedestrians)'
      }
    },
    medical: {
      name: 'Medical Diagnostic Assistant',
      performance: 'Patient recovery, cost minimisation, legal safety, diagnostic accuracy',
      environment: 'Hospital ward, patient, medical history, lab results',
      actuators: 'Display screens, keyboard prompt questions, printed prescriptions',
      sensors: 'Keyboard inputs, stethoscope, blood pressure monitor, scanner data',
      properties: {
        observability: 'Partially Observable (cannot directly look inside organs without scans)',
        determinism: 'Stochastic (patient reactions to medicine have variations)',
        episodicity: 'Sequential (diagnosis steps and treatments impact future health states)',
        dynamism: 'Dynamic (or Static during diagnostic session, but changes over days)',
        continuity: 'Continuous (dosages, blood pressure levels)',
        agency: 'Single-Agent (only the diagnostic tool, though nurses/doctors act)'
      }
    },
    vacuum: {
      name: 'Automated Vacuum Cleaner',
      performance: 'Cleanliness, speed, low power usage, battery life, wall avoidance',
      environment: 'Rooms, furniture, dirt, carpets, pets, stairs',
      actuators: 'Wheels, vacuum motor, brushes, status lights',
      sensors: 'Bump sensors, infrared cliff sensors, dirt sensors, battery meter',
      properties: {
        observability: 'Partially Observable (local bump and cliff sensors only)',
        determinism: 'Deterministic (simple motor commands lead to predictable movements)',
        episodicity: 'Sequential (where to clean next depends on where it has been)',
        dynamism: 'Static (if furniture doesn\'t move, though dynamic if pets are present)',
        continuity: 'Continuous (position in coordinate space)',
        agency: 'Single-Agent'
      }
    }
  };

  const currentAgent = agentsList[selectedAgent];

  // Case Studies
  const caseStudies = [
    {
      title: "Case Study 1: Smart Home Cleaning System (Reflex vs Model-Based)",
      problem: `A smart home cleaning system is designed based on the vacuum-cleaner world. Initially, the system uses a Simple Reflex Agent, where decisions are made only using the current percept (location and clean/dirty status). Later, the system is upgraded into a Model-Based Agent that maintains an internal state (memory) about previously visited rooms and their conditions. The environment consists of two rooms, A and B, where each room may either be Clean or Dirty. The agent can perform: Move Left, Move Right, Suck, No Operation.`,
      q1: "Analyze the transition from a Simple Reflex Agent to a Model-Based Agent:",
      a1: "A Simple Reflex Agent selects actions based ONLY on the current percept, ignoring history. If it perceives Room A is Dirty, it Sucks; if Clean, it moves to B. However, it cannot remember if B is already clean or if it has cleaned it, leading to infinite looping or unnecessary movement. A Model-Based Agent maintains an internal state (memory) about which rooms it has visited and their statuses. It updates this internal model using its percept history, allowing it to execute 'No Operation' once all rooms are verified clean, improving power efficiency.",
      q2: "Evaluate the importance of internal state (memory) and percept history in intelligent agents. Discuss how these features help the cleaning agent operate effectively in more complex and dynamic environments compared to a simple reflex agent:",
      a2: "Internal state is vital when environments are partially observable. A simple reflex agent cannot act rationally if the current sensor reading does not capture the full state of the world. By keeping a model of the unobserved parts of the world, the model-based agent can trace changes, handle transient obstacles, and make plans. For example, if a pet temporarily blocks the path between rooms, a reflex agent fails; a model-based agent remembers the layout and re-tries or waits, utilizing its memory of room connectivity.",
      code: `class SimpleReflexVacuumAgent:
    def __init__(self):
        pass

    def act(self, location: str, status: str) -> str:
        # Simple Reflex Logic: Action based ONLY on current location & status
        if status == "Dirty":
            return "Suck"
        elif location == "A":
            return "Move Right"
        elif location == "B":
            return "Move Left"
        return "No Operation"

# Simulation demonstration
agent = SimpleReflexVacuumAgent()
percepts = [("A", "Dirty"), ("A", "Clean"), ("B", "Dirty"), ("B", "Clean")]
print("Simple Reflex Agent Execution Logs:")
for loc, stat in percepts:
    action = agent.act(loc, stat)
    print(f"Perceived Location: {loc}, Status: {stat} -> Decided Action: {action}")
`
    },
    {
      title: "Case Study 2: Intelligent Warehouse Delivery Robot Agent",
      problem: `An intelligent delivery robot system transports packages in an e-commerce warehouse. The warehouse consists of multiple interconnected locations represented as nodes and movement paths represented as edges. The robot operates continuously in a dynamic environment (obstacles, moving workers, blocking). Initially, the robot follows a predefined sequential list of locations. It does not maintain knowledge about visited locations.`,
      q1: "i. Explain how the warehouse robot functions as an Intelligent Agent by identifying PEAS, environment type, and rational behavior:",
      a1: `• PEAS:
  - Performance: Package delivery speed, energy efficiency, obstacle collision prevention.
  - Environment: Warehouse layout, racks, packing sections, moving workers.
  - Actuators: Wheels, motors, robotic arm for package picking/placing.
  - Sensors: Cameras, LiDAR, wheel encoders.
• Environment: Partially observable (cannot see through walls), Stochastic (workers move randomly), Sequential (previous paths impact battery and location), Dynamic (obstacles appear), Continuous, Multi-Agent.
• Rational Behavior: Choosing the shortest path and avoiding dynamic obstacles to maximize successful delivery rate per battery charge.`,
      q2: "ii. Analyze how graph or grid representation improves navigation efficiency, path optimization, and decision-making:",
      a2: "Representing the warehouse as a Graph (nodes = locations, edges = pathways) or Grid allows the agent to apply classical search algorithms (like BFS or A*). Rather than following a rigid list, the agent can dynamically compute optimal paths, calculate path costs, and bypass blocked aisles in real-time, preventing redundant loops and reducing travel time.",
      code: `# Warehouse grid representation (0 = empty, 1 = obstacle)
warehouse_grid = [
    [0, 0, 0, 1],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
]

def traverse_warehouse(start, goal):
    visited = []
    # Simplified simulation of path tracking
    current = start
    visited.append(current)
    print(f"Robot starting at {start}")
    
    # Pathfinding simulation to move to (2, 2)
    path = [(0,0), (0,1), (0,2), (1,2), (2,2)]
    for node in path[1:]:
        print(f"Moving to: {node}")
        visited.append(node)
    print(f"Goal {goal} reached! Visited path: {visited}")

traverse_warehouse((0, 0), (2, 2))
`
    },
    {
      title: "Case Study 3: Automated Taxi System",
      problem: `An urban automated taxi must pick up passengers, navigate traffic, obey rules, and drop passengers safely. The system relies on multiple sensors (cameras, GPS, lidar) and actuators (steering, acceleration, braking).`,
      q1: "i. Describe the task environment using the PEAS framework and analyze how each component influences the design:",
      a1: "Performance: Safety, speed, comfort, profits. Environment: Roads, other cars, weather, traffic rules. Actuators: Steering, throttle, brakes, screen. Sensors: LiDAR, cameras, GPS, sonar. Lidar and cameras influence design by requiring high-speed real-time processing threads to detect dynamic obstacles, while GPS coordinates help the macro-level path planner navigate.",
      q2: "ii. Write a Python program to simulate a simplified version using a grid/routes and taxi movements:",
      a2: "The program implements a taxi moving in a coordinate list from a start location to pick-up and destination points, logging coordinates at each step.",
      code: `def simulate_taxi():
    start = (0, 0)
    pickup = (2, 3)
    drop = (5, 5)
    
    current = list(start)
    path = [tuple(current)]
    
    # Move to pickup
    while current[0] < pickup[0]:
        current[0] += 1
        path.append(tuple(current))
    while current[1] < pickup[1]:
        current[1] += 1
        path.append(tuple(current))
        
    print(f"Picked up passenger at {pickup}!")
    
    # Move to drop
    while current[0] < drop[0]:
        current[0] += 1
        path.append(tuple(current))
    while current[1] < drop[1]:
        current[1] += 1
        path.append(tuple(current))
        
    print(f"Dropped passenger at {drop}!")
    print(f"Full traversal path: {path}")

simulate_taxi()
`
    },
    {
      title: "Case Study 4: Intelligent Medical Diagnosis System",
      problem: `A hospital medical diagnosis system collects symptoms through keyboard input and suggests possible diagnoses and treatments, striving for accuracy and safety.`,
      q1: "i. Analyze using the PEAS framework and how sensors/actuators impact reliability:",
      a1: "Performance: Diagnostic accuracy, cost minimization, ease of use. Environment: Keyboard input, patient symptoms database. Actuators: Screen display, prescription printout. Sensors: Keyboard (user inputs). Since sensors rely on human keyboard entry, the system's reliability depends heavily on clear UI input filters to handle user entry spelling mistakes.",
      code: `def diagnose_patient(symptoms: list[str]) -> str:
    print(f"Perceived symptoms: {symptoms}")
    # Decision Logic
    if "fever" in symptoms and "cough" in symptoms:
        action = "Prescribe paracetamol & cough syrup"
    elif "chest_pain" in symptoms:
        action = "Alert emergency doctor & order ECG"
    else:
        action = "Advise rest & monitor symptoms"
    return action

print("Diagnosis action: " + diagnose_patient(["fever", "cough"]))
`
    },
    {
      title: "Case Study 5: Part-Picking Robot Arm",
      problem: `An automated factory uses a robotic arm to pick parts from a conveyor belt and place them into bins using camera inputs.`,
      q1: "i. Analyze how PEAS components influence precision and efficiency:",
      a1: "Performance: Sorting accuracy, sorting speed, safety limits. Environment: Conveyor belt, sorting bins. Actuators: Joint motors, gripper. Sensors: Cameras, weight sensors. High-resolution camera sensors directly determine gripper placement accuracy, preventing sorting errors.",
      code: `def sort_conveyor_parts():
    conveyor = ["metal_rod", "plastic_box", "metal_bolt", "cardboard"]
    metal_bin = []
    other_bin = []
    
    for item in conveyor:
        print(f"Perceiving item on belt: {item}")
        if "metal" in item:
            print(f"Action: Pick and place {item} into Metal Bin")
            metal_bin.append(item)
        else:
            print(f"Action: Pick and place {item} into General Bin")
            other_bin.append(item)
            
    print(f"Metal Bin: {metal_bin}")
    print(f"General Bin: {other_bin}")

sort_conveyor_parts()
`
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CO1: Foundations of AI & Python Essentials</h1>
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
      
      <ImportanceBadge rating={6} />

      {/* NEW: Comprehensive textbook concepts section */}
      <div className="card">
        <h2>1. Core Concepts & Definitions</h2>
        
        <h3>A. The PEAS Framework</h3>
        <p>
          Before designing an agent, we must specify its <strong>PEAS</strong> layout to formalize the problem context:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '0.4rem' }}><strong>Performance Measure</strong>: The criteria that determine how successful the agent's behavior is (e.g., safety, energy efficiency, accuracy).</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Environment</strong>: The external world in which the agent operates (e.g., city roads, server network, patient body).</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Actuators</strong>: The mechanisms the agent uses to exert physical actions on the environment (e.g., wheels, heaters, display screens).</li>
          <li style={{ marginBottom: '0.4rem' }}><strong>Sensors</strong>: The devices the agent uses to perceive the environment (e.g., cameras, thermometers, keyboard inputs).</li>
        </ul>

        <h3>B. Environment Dimensions</h3>
        <p>Environments are classified across six key dimensions, which dictate the architecture of the agent:</p>
        <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--accent)', margin: '1rem 0' }}>
          <p><strong>1. Fully vs. Partially Observable:</strong> Can the sensors access the complete state of the environment at any point? If not (like poker or driving), the agent must maintain an internal model to estimate hidden information.</p>
          <p><strong>2. Deterministic vs. Stochastic:</strong> Is the next state completely determined by the current state and the agent's action? If random/uncertain (like weather or traffic), it is stochastic.</p>
          <p><strong>3. Episodic vs. Sequential:</strong> Is each decision episode independent of previous ones (like spam filtering)? In sequential environments, current choices affect future states (like chess or pathfinding).</p>
          <p><strong>4. Static vs. Dynamic:</strong> Does the environment change while the agent is calculating its next move? If it does (like driving), it is dynamic; if it doesn't (like crossword puzzles), it is static.</p>
          <p><strong>5. Discrete vs. Continuous:</strong> Are states, time, and actions limited to a finite set of distinct values (like chess)? If they are real numbers (like speed or temperature), it is continuous.</p>
          <p><strong>6. Single vs. Multi-Agent:</strong> Does the agent operate alone, or are there other intelligent agents playing against or cooperating with it (like multiplayer games)?</p>
        </div>

        <h3>C. Knowledge Representation Types</h3>
        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>Graphs</strong>: Nodes represent states, and edges represent transitions. Best for pathfinding and network problems.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Trees</strong>: Hierarchical acyclic graphs representing decision paths or search states. A unique root path exists for every node.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Rule Sets</strong>: Simple "IF-THEN" conditionals representing logic filters. Perfect for expert systems and safety guards.</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Constraints</strong>: Mutual restrictions on variables. Defines variables, domains, and constraints (like map coloring).</li>
        </ul>
      </div>

      <div className="card">
        <h2>2. Interactive PEAS & Environment Classifier</h2>
        <p>Select an agent to inspect its PEAS specification and how its environment properties are classified:</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          {Object.keys(agentsList).map(key => (
            <button 
              key={key} 
              className={`btn ${selectedAgent === key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedAgent(key)}
            >
              {agentsList[key].name}
            </button>
          ))}
        </div>

        <div className="grid-2" style={{ backgroundColor: 'var(--bg-sidebar)', padding: '1.5rem', borderRadius: '12px' }}>
          <div>
            <h3 style={{ marginTop: 0 }}>PEAS Details</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: '600', width: '130px' }}>Performance:</td>
                  <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{currentAgent.performance}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Environment:</td>
                  <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{currentAgent.environment}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-medium)' }}>
                  <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Actuators:</td>
                  <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{currentAgent.actuators}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>Sensors:</td>
                  <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>{currentAgent.sensors}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 style={{ marginTop: 0 }}>Environment properties</h3>
            <div style={{ fontSize: '0.85rem' }}>
              {Object.entries(currentAgent.properties).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{key}:</span>
                  <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{val}</span>
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
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)' }}>
              {caseStudies[activeCaseStudy].a1}
            </p>
          </div>

          {caseStudies[activeCaseStudy].q2 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q2. {caseStudies[activeCaseStudy].q2}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)' }}>
                {caseStudies[activeCaseStudy].a2}
              </p>
            </div>
          )}

          <h4>Python Simulation Script:</h4>
          <CodeBlock code={caseStudies[activeCaseStudy].code} filename={`case_study_${activeCaseStudy + 1}.py`} />
        </div>
      </div>

      <MCQSection coId="CO1" />
    </div>
  );
}
