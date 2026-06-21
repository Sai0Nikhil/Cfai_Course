export const quizDatabase = {
  CO1: [
    {
      id: 'co1_1',
      question: 'In the PEAS agent model, what does the acronym "PEAS" stand for?',
      options: [
        'Performance, Environment, Actuators, Sensors',
        'Problem, Execution, Action, State',
        'Probability, Entropy, Agent, System',
        'Performance, Evaluation, Action, Solution'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'PEAS stands for Performance measure (how success is evaluated), Environment (the external world the agent operates in), Actuators (what the agent uses to perform actions), and Sensors (what the agent uses to perceive the environment).'
    },
    {
      id: 'co1_2',
      question: 'Which environment type is characterized by the agent\'s current decision not affecting future states or decisions (each episode is independent)?',
      options: [
        'Sequential',
        'Episodic',
        'Deterministic',
        'Static'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'In an episodic environment, the agent\'s experience is divided into atomic episodes where the choice of action in each episode depends only on the episode itself, not affecting future episodes.'
    },
    {
      id: 'co1_3',
      question: 'Why are Python @dataclasses highly useful when formulating state classes for AI search algorithms?',
      options: [
        'They automatically compile Python code to C++ speeds.',
        'They automatically implement standard boilerplate methods like __init__(), __repr__(), and __eq__().',
        'They force variables to have dynamic types at runtime.',
        'They prevent recursion in state spaces.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Dataclasses (introduced in Python 3.7) reduce boilerplate code by automatically generating methods like __init__, __repr__ (for nice logging traces), and __eq__ (needed to check if two states are identical in closed/open sets).'
    },
    {
      id: 'co1_4',
      question: 'In state-space problem formulation, what is the Transition Model?',
      options: [
        'A list of path costs for every node in the graph.',
        'A function that returns the state that results from doing action A in state S.',
        'The target state the agent must reach.',
        'A mechanism that prunes duplicate nodes in search.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'The transition model formalizes the dynamics of the environment. Mathematically, it takes a state and an action and returns the resulting state: Result(S, A).'
    },
    {
      id: 'co1_5',
      question: 'Which Python data structure is most appropriate for implementing the frontier (open set) in Uniform Cost Search (UCS) to achieve O(log n) insertions and extractions?',
      options: [
        'A standard list (list.append and list.pop)',
        'A dictionary (dict)',
        'A priority queue built via the heapq module',
        'A set'
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'Uniform Cost Search requires expanding the node with the lowest path cost. A min-heap (provided by Python\'s `heapq` module) keeps the elements sorted such that retrieving the minimum is O(1) and inserting/deleting is O(log n).'
    },
    {
      id: 'co1_6',
      question: 'In knowledge representation, what makes a Constraint Network different from a standard Tree representation?',
      options: [
        'Trees cannot represent parent-child relationships.',
        'Constraint networks represent variables with restricted domains and relationships, which can contain cycles, whereas trees are acyclic graphs.',
        'Constraint networks do not support state transitions.',
        'Constraint networks are always infinite.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Trees represent hierarchical search spaces and are acyclic. Constraint networks represent variables as nodes and constraints as edges; they can contain loops/cycles and focus on satisfying mutual restrictions rather than tracing a path.'
    },
    {
      id: 'co1_7',
      question: 'Consider an agent playing Chess. Which classification best fits its environment?',
      options: [
        'Fully observable, Stochastic, Sequential, Dynamic',
        'Partially observable, Deterministic, Episodic, Static',
        'Fully observable, Deterministic, Sequential, Static (assuming turn-based time limits are modeled as rules)',
        'Partially observable, Stochastic, Episodic, Dynamic'
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'Chess is fully observable (both players see the whole board), deterministic (no dice rolls or randomness in movement rules), sequential (each move affects future possibilities), and static (the board state doesn\'t change while you think).'
    },
    {
      id: 'co1_8',
      question: 'When implementing a state representation for a puzzle, why is it critical to make the state object hashable (defining __hash__ and __eq__)?',
      options: [
        'To allow the state to be used as a key in dictionaries or stored in sets (like the Closed Set).',
        'To enable the Python garbage collector to clean up dead nodes.',
        'To convert recursion into iteration automatically.',
        'To speed up arithmetic calculations within the heuristic.'
      ],
      correctAnswer: 0,
      difficulty: 'hard',
      explanation: 'In graph search, we must keep track of visited states in a Closed Set (usually a Python `set`) to avoid infinite loops. Python sets and dictionary keys require elements to be hashable and comparable for equality.'
    },
    {
      id: 'co1_9',
      question: 'What is the time complexity of pushing an element onto a binary heap of size N in Python\'s `heapq` module?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Pushing a new value into a binary heap requires adding it to the end and bubbling it up. The maximum depth of a binary tree of size N is log2(N), so this operation takes O(log N) time.'
    },
    {
      id: 'co1_10',
      question: 'Which of the following describes a partially observable, stochastic, and dynamic environment?',
      options: [
        'Sudoku puzzle solver',
        'Self-driving car on a city street',
        'Tic-Tac-Toe AI',
        'Image classification model predicting a label'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'A self-driving car cannot see around corners or through other trucks (partially observable), traffic behavior and weather are unpredictable (stochastic), and the world moves and changes while the car is deciding (dynamic).'
    }
  ],
  CO2: [
    {
      id: 'co2_1',
      question: 'What is the key difference between Breadth-First Search (BFS) and Uniform Cost Search (UCS)?',
      options: [
        'BFS expands the lowest path cost node; UCS expands the shallowest node.',
        'BFS uses a LIFO stack; UCS uses a FIFO queue.',
        'BFS expands the shallowest node (uniform step costs); UCS expands the node with the lowest cumulative path cost g(n).',
        'BFS is heuristic-based; UCS is uninformed.'
      ],
      correctAnswer: 2,
      difficulty: 'easy',
      explanation: 'BFS is a special case of UCS where all step costs are equal (constant depth-based cost). UCS uses path cost g(n) and is optimal for arbitrary non-negative step costs.'
    },
    {
      id: 'co2_2',
      question: 'A heuristic function h(n) is said to be "admissible" if:',
      options: [
        'It never underestimates the true cost to reach the goal.',
        'It never overestimates the true cost to reach the goal.',
        'It is equal to the exact cost to reach the goal.',
        'It is computed in linear time O(N).'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Admissibility means h(n) <= h*(n), where h*(n) is the true cost from node n to the goal. An admissible heuristic is optimistic, ensuring A* search never misses a shorter path by overestimating it.'
    },
    {
      id: 'co2_3',
      question: 'What happens to A* search if the heuristic function h(n) is set to 0 for all nodes?',
      options: [
        'A* becomes Breadth-First Search.',
        'A* becomes Depth-First Search.',
        'A* collapses into Uniform Cost Search (Dijkstra\'s algorithm).',
        'A* fails to find a solution.'
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'A* uses f(n) = g(n) + h(n). If h(n) = 0, then f(n) = g(n), which is exactly the evaluation function of Uniform Cost Search (UCS).'
    },
    {
      id: 'co2_4',
      question: 'What is the relationship between heuristic consistency (monotonicity) and admissibility?',
      options: [
        'Consistency and admissibility are completely unrelated.',
        'Every consistent heuristic is also admissible (on graphs).',
        'Every admissible heuristic is also consistent.',
        'A consistent heuristic can overestimate the goal cost.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Consistency requires that for every node n and successor n\' generated by action a, h(n) <= c(n, a, n\') + h(n\'). A consistent heuristic satisfies the triangle inequality and is always admissible. The reverse is not always true.'
    },
    {
      id: 'co2_5',
      question: 'What is the primary advantage of Iterative Deepening A* (IDA*) over standard A*?',
      options: [
        'IDA* expands fewer nodes than A*.',
        'IDA* has a linear memory complexity O(bd) instead of exponential O(b^d) where it doesn\'t need to keep the entire Open/Closed set in memory.',
        'IDA* does not require an admissible heuristic.',
        'IDA* runs in O(1) time.'
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'Standard A* suffers from exponential memory consumption because it stores all generated nodes in the Open set. IDA* resolves this by using depth-first search search limits, resetting the threshold based on the f-values, reducing memory to O(bd).'
    },
    {
      id: 'co2_6',
      question: 'In graph search, what is the role of the "Closed Set" (or Explored Set)?',
      options: [
        'To store nodes that are waiting to be expanded.',
        'To keep track of all nodes that have already been expanded, preventing the search from entering infinite loops.',
        'To store the final path from start to goal.',
        'To store dead-end nodes only.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'The Closed Set records expanded states. In a graph with cycles, we check if a newly generated node is in the Closed Set. If it is, we discard it to avoid redundant paths and infinite loops.'
    },
    {
      id: 'co2_7',
      question: 'Which tie-breaking strategy is generally preferred in A* when multiple nodes have the same f(n) score?',
      options: [
        'Select the node with the lower g(n) value.',
        'Select the node with the higher h(n) value.',
        'Select the node with the higher g(n) value (lower h(n) value), since it is closer to the goal.',
        'Select randomly.'
      ],
      correctAnswer: 2,
      difficulty: 'medium',
      explanation: 'When f(n) is equal, prioritizing nodes with higher g(n) (and therefore smaller h(n)) tends to push the search towards the goal rather than expanding nodes near the start, reducing total node expansions.'
    },
    {
      id: 'co2_8',
      question: 'For the 8-puzzle, why is the Manhattan distance heuristic better than the Misplaced Tiles heuristic?',
      options: [
        'Manhattan distance is inadmissible, while Misplaced Tiles is admissible.',
        'Manhattan distance dominates Misplaced Tiles (h_manhattan(n) >= h_misplaced(n) for all n), meaning it is more informed and will expand fewer nodes.',
        'Manhattan distance is faster to calculate (O(1)).',
        'Misplaced Tiles expands fewer nodes.'
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'Both are admissible. However, Manhattan distance dominates Misplaced Tiles because for any state, the sum of grid steps to target positions is greater than or equal to the count of misplaced tiles. Dominating heuristics are always more efficient.'
    }
  ],
  CO3: [
    {
      id: 'co3_1',
      question: 'What defines a Constraint Satisfaction Problem (CSP) formulation?',
      options: [
        'State, Actions, Transition Model, Cost',
        'Variables, Domains, Constraints',
        'Utility, Rules, Probabilities',
        'Nodes, Edges, Heuristics'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'A CSP is defined by a set of Variables, a Domain of possible values for each variable, and a set of Constraints that specify allowed combinations of values.'
    },
    {
      id: 'co3_2',
      question: 'What does the Minimum Remaining Values (MRV) heuristic choose during Backtracking search?',
      options: [
        'The variable with the fewest legal values remaining in its domain.',
        'The value that rules out the fewest values for neighboring variables.',
        'The variable that imposes the most constraints on remaining variables.',
        'The domain value that is smallest numerically.'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'MRV (also called the "fail-first" heuristic) chooses the variable with the fewest legal values remaining. This helps detect failures early rather than making deep, fruitless backtracking steps.'
    },
    {
      id: 'co3_3',
      question: 'What is the core idea of Arc Consistency (specifically the AC-3 algorithm)?',
      options: [
        'It checks if all constraints are satisfied at the end of the search.',
        'It ensures that for every value in the domain of variable X, there is some allowed value in the domain of variable Y for all binary constraints between X and Y.',
        'It colors a map using the minimum number of colors.',
        'It runs a local search step to resolve conflicts.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'AC-3 enforces arc consistency: a directed arc X -> Y is consistent if for every value x in X\'s domain, there exists some value y in Y\'s domain that satisfies the constraint between them. It removes values from X\'s domain that fail this check.'
    },
    {
      id: 'co3_4',
      question: 'In local search for CSPs, how does the "min-conflicts" heuristic select a value for a conflicted variable?',
      options: [
        'It selects a random value from the domain.',
        'It selects the value that results in the minimum number of violated constraints across the entire board.',
        'It selects the value that has the lowest numeric index.',
        'It deletes the variable from the network.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Min-conflicts is a local search heuristic. It chooses the value that minimizes the number of conflicts (violated constraints). It is incredibly fast and can solve N-Queens for N=1,000,000 in seconds.'
    },
    {
      id: 'co3_5',
      question: 'What is the main difference between Forward Checking and Arc Consistency (AC-3)?',
      options: [
        'Forward Checking is faster but propagates constraints only to immediately connected variables; AC-3 propagates constraints transitively through the entire network.',
        'Forward Checking is complete; AC-3 is incomplete.',
        'Forward Checking assigns values; AC-3 only reviews variables.',
        'There is no difference; they are different names for the same algorithm.'
      ],
      correctAnswer: 0,
      difficulty: 'hard',
      explanation: 'Forward checking is a simplified propagation step: whenever variable X is assigned, it checks neighbors Y and prunes inconsistent values. AC-3 goes further by transitively checking neighbors of Y, propagating updates throughout the network.'
    },
    {
      id: 'co3_6',
      question: 'The Least Constraining Value (LCV) heuristic is used to decide:',
      options: [
        'Which variable to assign next.',
        'The order in which values of a chosen variable should be tried to minimize future conflicts.',
        'When to terminate the backtracking search.',
        'Which constraints to ignore.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Once a variable is selected, LCV chooses the value that rules out the fewest options for neighboring variables. It aims to maximize flexibility for remaining assignments.'
    }
  ],
  CO4: [
    {
      id: 'co4_1',
      question: 'In adversarial game playing, what does the Minimax algorithm assume about the opponent?',
      options: [
        'The opponent plays randomly.',
        'The opponent plays optimally to minimize our utility score.',
        'The opponent is cooperative.',
        'The opponent always makes mistakes.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Minimax assumes the opponent (MIN) plays optimally to minimize our utility, while we (MAX) play to maximize our utility.'
    },
    {
      id: 'co4_2',
      question: 'What is the primary benefit of Alpha-Beta Pruning?',
      options: [
        'It changes the minimax values of the game nodes.',
        'It allows us to search much deeper in the game tree by ignoring branches that cannot affect the final decision.',
        'It makes the evaluation function completely accurate.',
        'It eliminates the need for an evaluation function.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Alpha-Beta pruning returns the exact same minimax value as standard Minimax, but prunes branches that are guaranteed to be worse than currently explored options. In the best case, it cuts the effective branching factor in half.'
    },
    {
      id: 'co4_3',
      question: 'In alpha-beta pruning, what do alpha (α) and beta (β) represent?',
      options: [
        'α is the lower bound for MIN; β is the upper bound for MAX.',
        'α is the highest value found so far for MAX (lower bound); β is the lowest value found so far for MIN (upper bound).',
        'α and β are random numbers used to break ties.',
        'α is the depth limit; β is the branching factor.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Alpha is the best value (highest) MAX can guarantee along the path. Beta is the best value (lowest) MIN can guarantee. If at any point α >= β, the current branch can be pruned because the opponent can force a worse outcome.'
    },
    {
      id: 'co4_4',
      question: 'What is the Expectimax algorithm used for?',
      options: [
        'Deterministic games only.',
        'Games with chance elements (like dice rolls or card draws) where we calculate expected values using probabilities.',
        'Speeding up alpha-beta pruning.',
        'Representing infinite-state games.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Expectimax introduces chance nodes. Instead of taking the minimum/maximum of children, a chance node calculates the expected value: the sum of the values of the children weighted by their probability of occurring.'
    },
    {
      id: 'co4_5',
      question: 'Which of the following describes "Bounded Rationality" in AI game-playing agents?',
      options: [
        'An agent that has infinite time to compute the optimal path.',
        'An agent that makes decisions under limited time, computational power, and memory, resorting to heuristics and depth limits.',
        'An agent that makes irrational mistakes intentionally.',
        'An agent that only plays chess.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Herbert Simon\'s concept of Bounded Rationality states that real-world agents have constraints on time and computing resources, forcing them to use depth-limited search and heuristic evaluation functions rather than fully solving the game.'
    }
  ],
  CO5: [
    {
      id: 'co5_1',
      question: 'According to Bayes\' Rule, how is the posterior probability P(A|B) calculated?',
      options: [
        'P(A|B) = P(B|A) * P(A) / P(B)',
        'P(A|B) = P(A) * P(B)',
        'P(A|B) = P(B|A) / P(A)',
        'P(A|B) = P(A) + P(B) - P(A and B)'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      explanation: 'Bayes\' Rule states: P(A|B) = [P(B|A) * P(A)] / P(B). It updates our prior belief P(A) based on the evidence B.'
    },
    {
      id: 'co5_2',
      question: 'In a Bayesian Network, what is a Conditional Probability Table (CPT)?',
      options: [
        'A table listing the joint probability of all variables.',
        'A table that defines the probability distribution of a variable given its parent nodes.',
        'A list of logical rules.',
        'A matrix representing state transitions over time.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'Each node in a Bayesian network has a CPT. It specifies the probability of the node taking on specific values, conditioned on all possible combinations of values of its parent nodes.'
    },
    {
      id: 'co5_3',
      question: 'What is the purpose of the Variable Elimination algorithm in Bayesian Networks?',
      options: [
        'To delete variables with zero probability from the network.',
        'To perform exact inference by computing marginal distributions through summing out unobserved variables in a clever, factored order.',
        'To approximate probabilities using random simulations.',
        'To learn the network structure from data.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Variable Elimination is an exact inference algorithm. It calculates the query distribution by summing out hidden variables one by one. Factoring out terms avoids computing the full joint distribution, which is exponential.'
    },
    {
      id: 'co5_4',
      question: 'In HMMs (Hidden Markov Models), what is the "transition model"?',
      options: [
        'The probability of an observation given the hidden state P(E_t | X_t).',
        'The probability of moving to the next hidden state given the current hidden state P(X_t | X_{t-1}).',
        'The initial state distribution.',
        'A function that maps actions to utility.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'The transition model P(X_t | X_{t-1}) defines how the hidden state evolves over time. It is represented as a transition matrix in discrete state spaces.'
    },
    {
      id: 'co5_5',
      question: 'What is the difference between Rejection Sampling and Likelihood Weighting?',
      options: [
        'Rejection sampling is exact; Likelihood weighting is approximate.',
        'Rejection sampling discards samples that do not match the observed evidence; Likelihood weighting generates only samples consistent with evidence and weights them by their likelihood.',
        'Likelihood weighting runs slower than Rejection sampling.',
        'Rejection sampling only works for trees.'
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'Rejection sampling is inefficient because it throws away samples that do not match the evidence. Likelihood weighting fixes evidence variables and weights each sample by the product of CPT probabilities of the evidence nodes, keeping all samples.'
    }
  ],
  CO6: [
    {
      id: 'co6_1',
      question: 'What is a "Hybrid AI Architecture"?',
      options: [
        'An AI that runs on both CPU and GPU.',
        'An architecture that combines multiple paradigms, such as logical rules, heuristic graph search, and probabilistic reasoning to solve complex problems.',
        'A model trained on both images and text.',
        'A search algorithm that does not use heuristics.'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      explanation: 'A hybrid architecture integrates different reasoning engines (e.g., rule-based filters, A* pathfinders, and Bayesian net risk assessors) to handle sub-problems that require different styles of logic.'
    },
    {
      id: 'co6_2',
      question: 'What is meant by "heuristic bias" in search and planning algorithms?',
      options: [
        'The search speed is too fast.',
        'Systematic errors in the heuristic function that favor certain paths or choices incorrectly, potentially causing sub-optimal plans or excessive node expansions.',
        'Using a heap instead of a list.',
        'A bug in the programming language.'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      explanation: 'Heuristic bias occurs when the estimation function systematically underestimates or overestimates specific paths (e.g., ignoring traffic in route planning), leading the agent to make poor choices.'
    },
    {
      id: 'co6_3',
      question: 'What is "uncertainty miscalibration" in decision systems?',
      options: [
        'When the sensor data is corrupted.',
        'When the agent\'s predicted confidence does not match the actual probability of correctness (e.g., claiming 99% certainty when it is only correct 60% of the time).',
        'When the Bayes net lacks conditional constraints.',
        'When the minimax search depth is too small.'
      ],
      correctAnswer: 1,
      difficulty: 'hard',
      explanation: 'Miscalibration means the confidence score does not align with empirical frequencies. A miscalibrated model might act recklessly because it overestimates its certainty about a safe state.'
    }
  ]
};
