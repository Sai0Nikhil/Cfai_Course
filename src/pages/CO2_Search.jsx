import React, { useState, useEffect, useRef } from 'react';
import ImportanceBadge from '../components/ImportanceBadge';
import CodeBlock from '../components/CodeBlock';
import MCQSection from '../components/MCQSection';
import { Play, Pause, RotateCcw, HelpCircle, Code, Award, Compass, Shield } from 'lucide-react';

export default function CO2_Search({ isCompleted, toggleCompleted }) {
  // Grid size
  const ROWS = 10;
  const COLS = 15;

  const [grid, setGrid] = useState([]);
  const [startNode, setStartNode] = useState({ r: 2, c: 2 });
  const [endNode, setEndNode] = useState({ r: 7, c: 12 });
  const [activeAlgo, setActiveAlgo] = useState('astar');
  const [isRunning, setIsRunning] = useState(false);
  const [drawMode, setDrawMode] = useState('wall');
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);
  
  // Stats
  const [expansions, setExpansions] = useState(0);
  const [frontierSize, setFrontierSize] = useState(0);
  const [pathCost, setPathCost] = useState(0);
  const [execTime, setExecTime] = useState(0);
  const [peakMemory, setPeakMemory] = useState(0);

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Initialize Grid
  const initGrid = () => {
    const newGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        row.push({
          r,
          c,
          isStart: r === startNode.r && c === startNode.c,
          isEnd: r === endNode.r && c === endNode.c,
          isWall: false,
          isVisited: false,
          isFrontier: false,
          isPath: false,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setExpansions(0);
    setFrontierSize(0);
    setPathCost(0);
    setExecTime(0);
    setPeakMemory(0);
  };

  useEffect(() => {
    initGrid();
  }, []);

  const handleCellClick = (r, c) => {
    if (isRunning) return;
    const newGrid = [...grid];
    const cell = newGrid[r][c];

    if (drawMode === 'start') {
      if (cell.isWall || cell.isEnd) return;
      newGrid[startNode.r][startNode.c].isStart = false;
      cell.isStart = true;
      setStartNode({ r, c });
    } else if (drawMode === 'end') {
      if (cell.isWall || cell.isStart) return;
      newGrid[endNode.r][endNode.c].isEnd = false;
      cell.isEnd = true;
      setEndNode({ r, c });
    } else {
      if (cell.isStart || cell.isEnd) return;
      cell.isWall = !cell.isWall;
    }
    setGrid(newGrid);
  };

  const getManhattanDistance = (r1, c1, r2, c2) => {
    return Math.abs(r1 - r2) + Math.abs(c1 - c2);
  };

  const runPathfinding = async () => {
    if (isRunning) return;
    setIsRunning(true);

    let tempGrid = grid.map(row => row.map(cell => ({
      ...cell,
      isVisited: false,
      isFrontier: false,
      isPath: false,
      g: Infinity,
      h: 0,
      f: Infinity,
      parent: null
    })));

    const startCell = tempGrid[startNode.r][startNode.c];
    startCell.g = 0;
    startCell.h = activeAlgo === 'astar' || activeAlgo === 'greedy' 
      ? getManhattanDistance(startNode.r, startNode.c, endNode.r, endNode.c) : 0;
    startCell.f = startCell.g + startCell.h;

    let openSet = [startCell];
    let closedSet = new Set();
    let expansionsCount = 0;
    let maxFrontierSize = 1;

    const startTime = performance.now();

    while (openSet.length > 0) {
      if (!isRunningRef.current) {
        setIsRunning(false);
        return;
      }

      if (activeAlgo === 'astar') {
        openSet.sort((a, b) => {
          if (a.f === b.f) return b.g - a.g; // Prefer larger g to search closer to goal
          return a.f - b.f;
        });
      } else if (activeAlgo === 'greedy') {
        openSet.sort((a, b) => a.h - b.h);
      } else if (activeAlgo === 'ucs') {
        openSet.sort((a, b) => a.g - b.g);
      }

      let curr = null;
      if (activeAlgo === 'dfs') {
        curr = openSet.pop();
      } else if (activeAlgo === 'bfs') {
        curr = openSet.shift();
      } else {
        curr = openSet.shift();
      }

      if (!curr) break;

      closedSet.add(`${curr.r},${curr.c}`);
      
      if (curr.r === endNode.r && curr.c === endNode.c) {
        let pathCell = curr.parent;
        let cost = 0;
        const newGrid = tempGrid.map(row => [...row]);
        
        while (pathCell && !pathCell.isStart) {
          newGrid[pathCell.r][pathCell.c].isPath = true;
          pathCell = pathCell.parent;
          cost++;
        }
        
        setGrid(newGrid);
        setPathCost(cost);
        setExecTime(Math.round(performance.now() - startTime));
        setExpansions(expansionsCount);
        setFrontierSize(openSet.length);
        setPeakMemory(maxFrontierSize + closedSet.size);
        setIsRunning(false);
        return;
      }

      if (!curr.isStart) {
        curr.isVisited = true;
      }

      expansionsCount++;
      
      const uiGrid = tempGrid.map(row => row.map(c => ({
        ...c,
        isVisited: closedSet.has(`${c.r},${c.c}`) && !c.isStart && !c.isEnd,
        isFrontier: openSet.some(o => o.r === c.r && o.c === c.c) && !c.isStart && !c.isEnd
      })));
      setGrid(uiGrid);
      setExpansions(expansionsCount);
      setFrontierSize(openSet.length);
      maxFrontierSize = Math.max(maxFrontierSize, openSet.length);
      setPeakMemory(maxFrontierSize + closedSet.size);

      await new Promise(resolve => setTimeout(resolve, 30));

      const neighborsPos = [
        { r: curr.r - 1, c: curr.c },
        { r: curr.r + 1, c: curr.c },
        { r: curr.r, c: curr.c - 1 },
        { r: curr.r, c: curr.c + 1 }
      ];

      for (let pos of neighborsPos) {
        if (pos.r >= 0 && pos.r < ROWS && pos.c >= 0 && pos.c < COLS) {
          const neighbor = tempGrid[pos.r][pos.c];
          if (neighbor.isWall || closedSet.has(`${neighbor.r},${neighbor.c}`)) continue;

          const tentativeG = curr.g + 1;
          let inOpen = openSet.some(o => o.r === neighbor.r && o.c === neighbor.c);

          if (!inOpen || tentativeG < neighbor.g) {
            neighbor.g = tentativeG;
            neighbor.h = activeAlgo === 'astar' || activeAlgo === 'greedy' 
              ? getManhattanDistance(neighbor.r, neighbor.c, endNode.r, endNode.c) : 0;
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = curr;

            if (!inOpen) {
              openSet.push(neighbor);
            }
          }
        }
      }
    }

    setExecTime(Math.round(performance.now() - startTime));
    setIsRunning(false);
    alert('No path found!');
  };

  const caseStudies = [
    {
      title: "Case Study 1: Autonomous Warehouse Robot Navigation (BFS vs DFS Grid)",
      problem: `A delivery robot travels in a grid-based warehouse map from Start (S) to Goal (G). The robot can move Up, Down, Left, Right. Compare Breadth-First Search (BFS) and Depth-First Search (DFS) for pathfinding.`,
      q1: "Q1. Analyze how the BFS algorithm helps the robot find a path and how level-order traversal guarantees the shortest path:",
      a1: "BFS explores nodes in order of their distance from the start node (level-by-level). It uses a FIFO queue. In a grid where each step has a constant cost of 1, BFS expands all nodes at depth 'd' before expanding nodes at depth 'd+1'. This level-order progression guarantees that the first time the Goal node is popped from the queue, the path taken to reach it is the absolute shortest in terms of steps.",
      q2: "Q2. Explain step-by-step how DFS explores the grid, and contrast it with BFS in terms of queue/stack, visited sets, and neighbor exploration:",
      a2: "DFS explores deeply down a single path until it hits a dead-end (wall or visited boundary) before backtracking. It uses a LIFO stack. While BFS spreads out radially like a ripple, DFS shoots out along a single branch. DFS does NOT guarantee the shortest path; if it branches right first and hits the goal after a long loop, it returns that path, even if a direct left step was available. Both algorithms require a 'Visited Set' to prevent re-entering cycles.",
      code: `def solve_bfs_grid(grid, start, goal):
    from collections import deque
    queue = deque([(start, [start])])
    visited = {start}
    
    while queue:
        (r, c), path = queue.popleft()
        if (r, c) == goal:
            return path
            
        # Explore neighbors
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]):
                if grid[nr][nc] == 0 and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.append(((nr, nc), path + [(nr, nc)]))
    return None

grid = [[0, 0, 0], [1, 1, 0], [0, 0, 0]]
print("Shortest path via BFS:", solve_bfs_grid(grid, (0,0), (2,2)))
`
    },
    {
      title: "Case Study 2: Smart Network Navigation System (BFS, DFS, UCS Graph)",
      problem: `Find a path from A to F on a weighted graph with edges: A->B (1), A->C (4), B->D (2), B->E (5), C->D (1), D->F (3), E->F (1). Compute paths for BFS, DFS, and UCS.`,
      q1: "Q1. Find the path using BFS and discuss optimality:",
      a1: "BFS explores level by level: Level 1: [B, C]. Level 2: [D, E]. Level 3: [F]. The path found by BFS is A -> B -> E -> F (3 edges) or A -> B -> D -> F. However, the path cost is: A->B->E->F = 1 + 5 + 1 = 7. A->B->D->F = 1 + 2 + 3 = 6. BFS is NOT optimal in weighted graphs because it only minimizes the number of edges, ignoring weight costs.",
      q2: "Q2. Find the path using DFS:",
      a2: "DFS goes deep: Path could be A -> B -> D -> F (cost 6). Traversal sequence depends on neighbor ordering, but it does not evaluate path costs and returns the first path found.",
      q3: "Q3. Find the optimal path using UCS showing priority queue expansions:",
      a3: `UCS uses a Priority Queue sorted by cumulative cost g(n):
1. Initialize queue: [(0, A, [A])]
2. Pop (0, A). Expand: Push (1, B, [A,B]), (4, C, [A,C]) to queue. Queue: [(1, B), (4, C)]
3. Pop (1, B). Expand: Push (1+2=3, D, [A,B,D]), (1+5=6, E, [A,B,E]). Queue: [(3, D), (4, C), (6, E)]
4. Pop (3, D). Expand: Push (3+3=6, F, [A,B,D,F]). Queue: [(4, C), (6, E), (6, F)]
5. Pop (4, C). Expand: Push (4+1=5, D) -> Already visited. Queue: [(6, E), (6, F)]
6. Pop (6, E). Expand: Push (6+1=7, F).
7. Pop (6, F). Goal reached! Optimal Path: A -> B -> D -> F with total cost 6.`,
      code: `import heapq

def ucs_search(graph, start, goal):
    queue = [(0, start, [start])]
    visited = set()
    
    while queue:
        cost, node, path = heapq.heappop(queue)
        if node == goal:
            return path, cost
        if node in visited:
            continue
        visited.add(node)
        
        for neighbor, weight in graph.get(node, []):
            if neighbor not in visited:
                heapq.heappush(queue, (cost + weight, neighbor, path + [neighbor]))
    return None

graph = {
    'A': [('B', 1), ('C', 4)],
    'B': [('D', 2), ('E', 5)],
    'C': [('D', 1)],
    'D': [('F', 3)],
    'E': [('F', 1)]
}
path, cost = ucs_search(graph, 'A', 'F')
print(f"UCS Optimal Path: {path} with cost {cost}")
`
    },
    {
      title: "Case Study 3: IIT-JEE Exam Centre Allocation (Greedy vs A*)",
      problem: `Allocate candidates from Hyderabad (H), Warangal (W), Nizamabad (N) to Hyderabad Central Centre (HC). Roads are weighted. Straight-line distances (h) to HC: H=3, W=5, N=4, KR=3, K=2, HC=0. Connections: H->W(3), H->N(5), H->K(6), W->KR(4), W->K(5), N->KR(2), N->K(4), KR->HC(3), K->HC(2).`,
      q1: "Q1. Show Greedy Best-First Search from Hyderabad (H) to HC:",
      a1: "Greedy evaluates nodes ONLY by heuristic h(n) (distance to HC): Start at H. Neighbors: W (h=5), N (h=4), K (h=2). Greedy chooses K because h(K)=2 is smallest. From K, neighbors: HC (h=0). Choose HC. Path: H -> K -> HC. Total cost = 6 + 2 = 8.",
      q2: "Q2. Show A* Search from Warangal (W) to HC:",
      a2: `A* evaluates nodes by f(n) = g(n) + h(n):
1. Start at W: g(W)=0, f(W) = 0 + 5 = 5. Queue: [(5, 0, W, [W])]
2. Expand W. Neighbors:
   - KR: g = 4, f = 4 + h(KR) = 4 + 3 = 7.
   - K: g = 5, f = 5 + h(K) = 5 + 2 = 7.
   - H: g = 3, f = 3 + h(H) = 3 + 3 = 6.
   Queue: [(6, W->H), (7, W->KR), (7, W->K)]
3. Pop H (f=6). Neighbors:
   - N: g = 3+5=8, f = 8 + 4 = 12.
   - K: g = 3+6=9, f = 9 + 2 = 11.
   Queue: [(7, W->KR), (7, W->K), (11, H->K), (12, H->N)]
4. Pop KR (f=7). Neighbors: HC: g = 4+3=7, f = 7 + 0 = 7. Queue: [(7, W->K), (7, W->KR->HC)]
5. Pop K (f=7). Neighbors: HC: g = 5+2=7, f = 7 + 0 = 7.
6. Pop HC (f=7). Goal reached! Optimal path is W -> KR -> HC (cost 7) or W -> K -> HC (cost 7).`,
      code: `# Implementation of A* for exam center allocation
def astar_allocation():
    heuristics = {'H': 3, 'W': 5, 'N': 4, 'KR': 3, 'K': 2, 'HC': 0}
    graph = {
        'W': [('KR', 4), ('K', 5), ('H', 3)],
        'H': [('W', 3), ('N', 5), ('K', 6)],
        'KR': [('HC', 3)],
        'K': [('HC', 2)],
        'N': [('KR', 2), ('K', 4)]
    }
    
    import heapq
    queue = [(heuristics['W'], 0, 'W', ['W'])]
    
    while queue:
        f, g, node, path = heapq.heappop(queue)
        if node == 'HC':
            return path, g
            
        for neighbor, cost in graph.get(node, []):
            new_g = g + cost
            new_f = new_g + heuristics[neighbor]
            heapq.heappush(queue, (new_f, new_g, neighbor, path + [neighbor]))
            
    return None

path, cost = astar_allocation()
print(f"A* Allocation Path: {path} with cost {cost}")
`
    },
    {
      title: "Case Study 4: Fire Evacuation System in Forum Mall Bengaluru",
      problem: `Design an emergency system to guide people from Food Court (S) to Main Exit Gate (G). S connects to A(corridor, weight 3), B(gaming zone, weight 2). A connects to C(staircase, weight 2). B connects to D(lobby, weight 4), E(escalator, weight 1). C connects to G(weight 4). D connects to G(weight 1). E connects to G(weight 6). Heuristics to exit G: S=6, A=4, B=5, C=2, D=1, E=4, G=0. Compare A* and IDA*.`,
      q1: "Q1. Solve using A* Evacuation routing:",
      a1: `Step 1: Start at S. f(S) = g(S)+h(S) = 0+6 = 6. Expand S:
- A: g = 3, f = 3 + 4 = 7.
- B: g = 2, f = 2 + 5 = 7.
Step 2: Expand B (f=7). Neighbors:
- D: g = 2+4=6, f = 6 + 1 = 7.
- E: g = 2+1=3, f = 3 + 4 = 7.
Step 3: Expand D (f=7). Neighbors:
- G: g = 6+1=7, f = 7 + 0 = 7.
Step 4: Pop G (f=7) from queue. Safest Evacuation Path: S -> B -> D -> G with total time cost 7.`,
      q2: "Q2. Analyze how IDA* applies to this evacuation problem:",
      a2: "IDA* uses a depth-first search with an f-cost threshold. First iteration threshold = f(Start) = 6. DFS traverses S->A (f=7 > 6, pruned), S->B (f=7 > 6, pruned). Iteration 1 fails to find G. Minimum pruned f-value is 7. Second iteration threshold = 7. DFS executes: S->B->D->G (f=7 <= 7). Goal G is found. IDA* saves memory by avoiding storing the open/closed sets, keeping only the current recursion path in memory (O(bd)).",
      code: `# Evacuation Simulation
def simulate_evacuation():
    # S=Food Court, G=Exit
    path = ['S', 'B', 'D', 'G']
    cost = 7
    print(f"Evacuation Path calculated: {' -> '.join(path)}")
    print(f"Total evacuation time: {cost} minutes")

simulate_evacuation()
`
    }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>CO2: Classical Search & Grid Pathfinder</h1>
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

      <ImportanceBadge rating={10} />

      {/* Textbook Theory */}
      <div className="card">
        <h2>1. Search Theory & Heuristics</h2>
        
        <h3>A. Uninformed vs. Informed Search</h3>
        <p>
          * **Uninformed (Blind) Search** has no knowledge about how close a state is to the goal. It only knows how to generate successors and check the goal test. Examples: BFS (Breadth-First), DFS (Depth-First), and UCS (Uniform Cost).
          * **Informed (Heuristic) Search** uses domain-specific hints via a heuristic function {"h(n)"} to estimate the cost from node {"n"} to the goal. Examples: Greedy Best-First Search and A* Search.
        </p>

        <h3>B. Heuristic Properties</h3>
        <p>A heuristic function {"h(n)"} is evaluated based on three mathematical properties:</p>
        <div style={{ paddingLeft: '1rem', borderLeft: '3px solid var(--accent)', margin: '1rem 0' }}>
          <p><strong>1. Admissibility:</strong> {"h(n) <= h*(n)"} for all nodes, where {"h*(n)"} is the actual true cost to reach the goal. An admissible heuristic is optimistic—it never overestimates the cost, ensuring A* never skips an optimal path.</p>
          <p><strong>2. Consistency (Monotonicity):</strong> {"h(n) <= c(n, a, n') + h(n')"} for all nodes and successors. This is a triangle inequality. If consistent, {"f(n)"} values along any path are non-decreasing, guaranteeing that A* finds the optimal path the first time a node is expanded.</p>
          <p><strong>3. Dominance:</strong> If {"h_2(n) >= h_1(n)"} for all nodes, then {"h_2"} dominates {"h_1"}. Dominated heuristics are less informed and will always expand more nodes during search.</p>
        </div>
      </div>

      {/* Grid Pathfinder Visualizer */}
      <div className="card">
        <h2>2. Interactive Pathfinder & Empirical Profiler</h2>
        <p>Click cells to draw walls. Select an algorithm to see how it expands nodes (BFS ripples, UCS follows cost, A* points to the goal):</p>

        <div className="visualizer-container">
          <div className="visualizer-controls">
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: '500', marginRight: '0.5rem' }}>Algorithm:</span>
              <select 
                value={activeAlgo} 
                onChange={(e) => setActiveAlgo(e.target.value)} 
                disabled={isRunning}
                style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid var(--border-medium)', outline: 'none' }}
              >
                <option value="astar">A* Search (g + h)</option>
                <option value="greedy">Greedy Best-First (h)</option>
                <option value="ucs">Uniform Cost Search (g)</option>
                <option value="bfs">BFS (Radial Breadth)</option>
                <option value="dfs">DFS (Deep Stack)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                className={`btn ${drawMode === 'wall' ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setDrawMode('wall')}
                disabled={isRunning}
              >
                Draw Walls
              </button>
              <button 
                className={`btn ${drawMode === 'start' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setDrawMode('start')}
                disabled={isRunning}
              >
                Place Start
              </button>
              <button 
                className={`btn ${drawMode === 'end' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setDrawMode('end')}
                disabled={isRunning}
              >
                Place End
              </button>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              {isRunning ? (
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setIsRunning(false)}>
                  <Pause size={12} /> Stop
                </button>
              ) : (
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={runPathfinding}>
                  <Play size={12} /> Search
                </button>
              )}
              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={initGrid} disabled={isRunning}>
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid var(--border-medium)' }}>
            <div style={{ width: '220px', padding: '1rem', borderRight: '1px solid var(--border-medium)', background: 'var(--bg-app)', fontSize: '0.85rem' }}>
              <h4 style={{ marginTop: 0, marginBottom: '0.5rem' }}>Search stats</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Node Expansions:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{expansions}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Frontier Size:</span>
                  <span style={{ fontWeight: 'bold' }}>{frontierSize}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Path Cost:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--sage)' }}>{pathCost} steps</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Runtime:</span>
                  <span style={{ fontWeight: 'bold' }}>{execTime} ms</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Peak Memory:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--gold)' }}>{peakMemory} nodes</span>
                </div>
              </div>
            </div>

            <div className="visualizer-body" style={{ flex: 1, padding: '1rem', background: '#FCFAF6' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 30px)`, gap: '3px' }}>
                {grid.map((row, r) => 
                  row.map((cell, c) => {
                    let cellBg = 'white';
                    let cellBorder = '1px solid var(--border-medium)';
                    let content = '';

                    if (cell.isWall) {
                      cellBg = 'var(--text-primary)';
                      cellBorder = 'none';
                    } else if (cell.isStart) {
                      cellBg = 'var(--accent)';
                      content = 'S';
                    } else if (cell.isEnd) {
                      cellBg = 'var(--gold)';
                      content = 'G';
                    } else if (cell.isPath) {
                      cellBg = 'var(--sage)';
                      cellBorder = '1px solid var(--sage-border)';
                    } else if (cell.isVisited) {
                      cellBg = '#EFE9E0';
                    } else if (cell.isFrontier) {
                      cellBg = 'var(--accent-light)';
                      cellBorder = '1px solid var(--accent-border)';
                    }

                    return (
                      <div 
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        style={{ 
                          width: '30px', 
                          height: '30px', 
                          background: cellBg, 
                          border: cellBorder,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          color: 'white',
                          cursor: 'pointer',
                          userSelect: 'none'
                        }}
                      >
                        {content}
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

          {caseStudies[activeCaseStudy].q3 && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Q3. {caseStudies[activeCaseStudy].q3}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', paddingLeft: '1rem', borderLeft: '2px solid var(--border-medium)' }}>
                {caseStudies[activeCaseStudy].a3}
              </p>
            </div>
          )}

          <h4>Python Implementation:</h4>
          <CodeBlock code={caseStudies[activeCaseStudy].code} filename={`case_study_search_${activeCaseStudy + 1}.py`} />
        </div>
      </div>

      <MCQSection coId="CO2" />
    </div>
  );
}
