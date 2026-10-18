"""
DevTrail AI - Search Algorithms (BFS, DFS, and A*)
Implements graph search for curriculum navigation, comparing uninformed
search (BFS, DFS) with informed heuristic search (A*).
"""

from collections import deque
import heapq
from typing import Dict, List, Any, Optional, Set, Tuple
from app.curriculum import CURRICULUM_NODES, CURRICULUM_EDGES


def build_adjacency_list() -> Dict[str, List[Tuple[str, float]]]:
    """Builds a directed adjacency list from CURRICULUM_EDGES."""
    adj: Dict[str, List[Tuple[str, float]]] = {k: [] for k in CURRICULUM_NODES.keys()}
    for edge in CURRICULUM_EDGES:
        u = edge["from_node"]
        v = edge["to_node"]
        w = float(edge["weight"])
        if u in adj:
            adj[u].append((v, w))
    return adj


def run_bfs(start_node: str, goal_node: str) -> Dict[str, Any]:
    """
    Breadth-First Search using a Queue.
    Guarantees the shortest path in terms of number of hops (unweighted edges).
    """
    if start_node not in CURRICULUM_NODES:
        return {"error": f"Invalid start node '{start_node}'", "success": False}
    if goal_node not in CURRICULUM_NODES:
        return {"error": f"Invalid goal node '{goal_node}'", "success": False}

    if start_node == goal_node:
        return {
            "algorithm": "BFS",
            "success": True,
            "path": [start_node],
            "explored_order": [start_node],
            "nodes_visited_count": 1,
            "path_length": 1,
            "total_cost": 0.0,
            "explanation": "Start node is already the goal node. Zero hops needed.",
        }

    adj = build_adjacency_list()
    queue = deque([start_node])
    visited: Set[str] = {start_node}
    parent: Dict[str, Optional[str]] = {start_node: None}
    explored_order: List[str] = []

    goal_found = False
    while queue:
        current = queue.popleft()
        explored_order.append(current)

        if current == goal_node:
            goal_found = True
            break

        # Explore neighbors in deterministic order
        for neighbor, _ in adj.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = current
                queue.append(neighbor)

    if not goal_found:
        return {
            "algorithm": "BFS",
            "success": False,
            "path": [],
            "explored_order": explored_order,
            "nodes_visited_count": len(explored_order),
            "explanation": f"Goal node '{goal_node}' is unreachable from start node '{start_node}' in this directed graph.",
        }

    # Reconstruct path
    path = []
    curr: Optional[str] = goal_node
    while curr is not None:
        path.append(curr)
        curr = parent.get(curr)
    path.reverse()

    # Calculate total weight
    total_cost = 0.0
    for i in range(len(path) - 1):
        u, v = path[i], path[i + 1]
        for neighbor, weight in adj.get(u, []):
            if neighbor == v:
                total_cost += weight
                break

    return {
        "algorithm": "BFS",
        "success": True,
        "path": path,
        "explored_order": explored_order,
        "nodes_visited_count": len(explored_order),
        "path_length": len(path),
        "total_cost": round(total_cost, 2),
        "explanation": (
            "BFS explores shallowest nodes first level-by-level using a FIFO queue. "
            "In an unweighted curriculum graph, it is guaranteed to discover the path with the fewest milestone hops. "
            "However, it does not factor in individual lesson hours or heuristic distance to the capstone."
        ),
    }


def run_dfs(start_node: str, goal_node: str) -> Dict[str, Any]:
    """
    Depth-First Search using a LIFO Stack.
    Dives deep along single branches before backtracking.
    Does NOT guarantee the shortest path.
    """
    if start_node not in CURRICULUM_NODES:
        return {"error": f"Invalid start node '{start_node}'", "success": False}
    if goal_node not in CURRICULUM_NODES:
        return {"error": f"Invalid goal node '{goal_node}'", "success": False}

    if start_node == goal_node:
        return {
            "algorithm": "DFS",
            "success": True,
            "path": [start_node],
            "explored_order": [start_node],
            "nodes_visited_count": 1,
            "path_length": 1,
            "total_cost": 0.0,
            "explanation": "Start node is already the goal node.",
        }

    adj = build_adjacency_list()
    # Stack stores (current_node, [path_so_far])
    stack = [(start_node, [start_node])]
    visited: Set[str] = set()
    explored_order: List[str] = []
    found_path: Optional[List[str]] = None

    while stack:
        current, path = stack.pop()
        if current in visited:
            continue
        visited.add(current)
        explored_order.append(current)

        if current == goal_node:
            found_path = path
            break

        # Reverse neighbor order so first neighbor is popped first from stack
        neighbors = adj.get(current, [])
        for neighbor, _ in reversed(neighbors):
            if neighbor not in visited:
                stack.append((neighbor, path + [neighbor]))

    if found_path is None:
        return {
            "algorithm": "DFS",
            "success": False,
            "path": [],
            "explored_order": explored_order,
            "nodes_visited_count": len(explored_order),
            "explanation": f"Goal node '{goal_node}' is unreachable from start node '{start_node}'.",
        }

    # Calculate total weight
    total_cost = 0.0
    for i in range(len(found_path) - 1):
        u, v = found_path[i], found_path[i + 1]
        for neighbor, weight in adj.get(u, []):
            if neighbor == v:
                total_cost += weight
                break

    return {
        "algorithm": "DFS",
        "success": True,
        "path": found_path,
        "explored_order": explored_order,
        "nodes_visited_count": len(explored_order),
        "path_length": len(found_path),
        "total_cost": round(total_cost, 2),
        "explanation": (
            "DFS explores along deep paths first using a LIFO stack. "
            "Because DFS aggressively follows the first available edge to maximum depth, "
            "it may take long elective detours before finding the goal and does not guarantee the shortest route or minimal hours."
        ),
    }


def run_astar(start_node: str, goal_node: str, mastered_nodes: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    A* Search using f(n) = g(n) + h(n).
    g(n): Exact cost (hours) accumulated so far from start_node.
    h(n): Estimated study effort heuristic to goal_node.
    If a student has mastered a node, its traversal cost is reduced to 0 (already done).
    """
    if start_node not in CURRICULUM_NODES:
        return {"error": f"Invalid start node '{start_node}'", "success": False}
    if goal_node not in CURRICULUM_NODES:
        return {"error": f"Invalid goal node '{goal_node}'", "success": False}

    mastered = set(mastered_nodes or [])
    adj = build_adjacency_list()

    # Heuristic function: difference in heuristic_cost between node and goal
    # If goal is node_g, h(n) is simply node's heuristic_cost.
    goal_h = CURRICULUM_NODES[goal_node].get("heuristic_cost", 0.0)

    def heuristic(node_id: str) -> float:
        node_h = CURRICULUM_NODES[node_id].get("heuristic_cost", 0.0)
        # Admissible heuristic: non-negative difference
        return max(0.0, node_h - goal_h)

    # Priority queue stores (f_score, g_score, current_node, path)
    start_h = heuristic(start_node)
    open_set: List[Tuple[float, float, str, List[str]]] = [(start_h, 0.0, start_node, [start_node])]
    g_scores: Dict[str, float] = {start_node: 0.0}
    explored_order: List[str] = []
    closed_set: Set[str] = set()

    found_path: Optional[List[str]] = None
    final_cost = 0.0

    while open_set:
        f, g, current, path = heapq.heappop(open_set)

        if current in closed_set:
            continue
        closed_set.add(current)
        explored_order.append(current)

        if current == goal_node:
            found_path = path
            final_cost = g
            break

        for neighbor, edge_weight in adj.get(current, []):
            # If neighbor is mastered, cost is 0.0 (bypass/no duplicate effort)
            effective_weight = 0.0 if neighbor in mastered else edge_weight
            tentative_g = g + effective_weight

            if tentative_g < g_scores.get(neighbor, float("inf")):
                g_scores[neighbor] = tentative_g
                h = heuristic(neighbor)
                f_score = tentative_g + h
                heapq.heappush(open_set, (f_score, tentative_g, neighbor, path + [neighbor]))

    if found_path is None:
        return {
            "algorithm": "A*",
            "success": False,
            "path": [],
            "explored_order": explored_order,
            "nodes_visited_count": len(explored_order),
            "explanation": f"Goal '{goal_node}' is unreachable from '{start_node}' under current curriculum constraints.",
        }

    # Baseline cost without diagnostic skips
    baseline_cost = 0.0
    for i in range(len(found_path) - 1):
        u, v = found_path[i], found_path[i + 1]
        for neighbor, weight in adj.get(u, []):
            if neighbor == v:
                baseline_cost += weight
                break

    hours_saved = max(0.0, round(baseline_cost - final_cost, 1))

    return {
        "algorithm": "A*",
        "success": True,
        "path": found_path,
        "explored_order": explored_order,
        "nodes_visited_count": len(explored_order),
        "path_length": len(found_path),
        "total_cost": round(final_cost, 1),
        "baseline_cost": round(baseline_cost, 1),
        "savings_hours": hours_saved,
        "explanation": (
            f"A* searched with f(n) = g(n) + h(n), balancing accumulated study effort g(n) with estimated hours to capstone h(n). "
            f"Mastered checkpoints were weighted at 0.0h to avoid repetitive lessons. "
            f"Resulting route achieved minimal cognitive effort ({round(final_cost, 1)} hrs vs standard {round(baseline_cost, 1)} hrs)."
        ),
    }
