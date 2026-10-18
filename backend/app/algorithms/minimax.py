"""
DevTrail AI - Experiment 5: Minimax Algorithm (Code Quest Game Tree)
Implements a turn-based tactical decision tree where the Developer (MAX)
seeks to maximize system uptime/code quality, while System Bugs/Latencies (MIN)
seek to minimize system health.
"""

from typing import Dict, List, Any, Optional


def run_minimax_game(
    custom_leaves: Optional[List[int]] = None,
    round_scenario: str = "production_deploy",
) -> Dict[str, Any]:
    """
    Computes a depth-3 minimax game tree for Code Quest:
    Level 0 (Root, MAX - Developer): Choice of 2 initial architectures (e.g., 'Microservices' vs 'Modular Monolith')
    Level 1 (MIN - Chaos Monkey / Network Glitch): Choice of 2 stress events per branch
    Level 2 (MAX - Developer Response): Choice of 2 mitigation tactics per stress event
    Leaves (8 terminal evaluations of system health: -10 to +10)
    """

    # Default leaf utilities representing final system reliability score (-10 to +10)
    default_leaves = [7, 3, 9, 2, 4, 8, 1, 6]
    if custom_leaves and len(custom_leaves) == 8:
        leaves = [max(-10, min(10, int(x))) for x in custom_leaves]
    else:
        leaves = default_leaves

    # Structure of the game tree
    # Level 2 nodes (MAX) compute max of their 2 leaf children
    node_e_val = max(leaves[0], leaves[1])  # MAX(leaves[0], leaves[1])
    node_f_val = max(leaves[2], leaves[3])  # MAX(leaves[2], leaves[3])
    node_g_val = max(leaves[4], leaves[5])  # MAX(leaves[4], leaves[5])
    node_h_val = max(leaves[6], leaves[7])  # MAX(leaves[6], leaves[7])

    # Level 1 nodes (MIN) compute min of their children
    node_c_val = min(node_e_val, node_f_val)  # MIN(node_e, node_f)
    node_d_val = min(node_g_val, node_h_val)  # MIN(node_g, node_h)

    # Level 0 root (MAX) computes max of MIN nodes
    root_val = max(node_c_val, node_d_val)
    best_branch = "Microservices Architecture (Branch A)" if root_val == node_c_val else "Modular Monolith (Branch B)"

    # Build hierarchical tree structure for interactive visualization
    tree = {
        "id": "root",
        "name": "Developer (MAX)",
        "type": "MAX",
        "depth": 0,
        "value": root_val,
        "action": "Select System Architecture",
        "children": [
            {
                "id": "node_c",
                "name": "Adversary Chaos (MIN)",
                "type": "MIN",
                "depth": 1,
                "value": node_c_val,
                "action": "Branch A: Microservices Cluster",
                "is_selected": (root_val == node_c_val),
                "children": [
                    {
                        "id": "node_e",
                        "name": "Developer Mitigate (MAX)",
                        "type": "MAX",
                        "depth": 2,
                        "value": node_e_val,
                        "action": "Scenario A1: Network Partition Spike",
                        "is_selected": (root_val == node_c_val and node_c_val == node_e_val),
                        "children": [
                            {
                                "id": "leaf_1",
                                "name": "Leaf 1",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[0],
                                "action": "Tactic 1a: Circuit Breaker + Local Fallback",
                                "is_selected": (root_val == node_c_val and node_c_val == node_e_val and node_e_val == leaves[0]),
                            },
                            {
                                "id": "leaf_2",
                                "name": "Leaf 2",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[1],
                                "action": "Tactic 1b: Exponential Retry Storm",
                                "is_selected": (root_val == node_c_val and node_c_val == node_e_val and node_e_val == leaves[1]),
                            },
                        ],
                    },
                    {
                        "id": "node_f",
                        "name": "Developer Mitigate (MAX)",
                        "type": "MAX",
                        "depth": 2,
                        "value": node_f_val,
                        "action": "Scenario A2: Distributed Tracing Bottleneck",
                        "is_selected": (root_val == node_c_val and node_c_val == node_f_val),
                        "children": [
                            {
                                "id": "leaf_3",
                                "name": "Leaf 3",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[2],
                                "action": "Tactic 2a: Async Batch Ingestion",
                                "is_selected": (root_val == node_c_val and node_c_val == node_f_val and node_f_val == leaves[2]),
                            },
                            {
                                "id": "leaf_4",
                                "name": "Leaf 4",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[3],
                                "action": "Tactic 2b: Synchronous Blocking Logs",
                                "is_selected": (root_val == node_c_val and node_c_val == node_f_val and node_f_val == leaves[3]),
                            },
                        ],
                    },
                ],
            },
            {
                "id": "node_d",
                "name": "Adversary Chaos (MIN)",
                "type": "MIN",
                "depth": 1,
                "value": node_d_val,
                "action": "Branch B: Modular Monolith Engine",
                "is_selected": (root_val == node_d_val),
                "children": [
                    {
                        "id": "node_g",
                        "name": "Developer Mitigate (MAX)",
                        "type": "MAX",
                        "depth": 2,
                        "value": node_g_val,
                        "action": "Scenario B1: Memory Leak on Heap",
                        "is_selected": (root_val == node_d_val and node_d_val == node_g_val),
                        "children": [
                            {
                                "id": "leaf_5",
                                "name": "Leaf 5",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[4],
                                "action": "Tactic 3a: Garbage Collection Tuning",
                                "is_selected": (root_val == node_d_val and node_d_val == node_g_val and node_g_val == leaves[4]),
                            },
                            {
                                "id": "leaf_6",
                                "name": "Leaf 6",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[5],
                                "action": "Tactic 3b: Horizontal Node Autoscaling",
                                "is_selected": (root_val == node_d_val and node_d_val == node_g_val and node_g_val == leaves[5]),
                            },
                        ],
                    },
                    {
                        "id": "node_h",
                        "name": "Developer Mitigate (MAX)",
                        "type": "MAX",
                        "depth": 2,
                        "value": node_h_val,
                        "action": "Scenario B2: Database Connection Pool Exhaustion",
                        "is_selected": (root_val == node_d_val and node_d_val == node_h_val),
                        "children": [
                            {
                                "id": "leaf_7",
                                "name": "Leaf 7",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[6],
                                "action": "Tactic 4a: Connection Pooling with Read Replicas",
                                "is_selected": (root_val == node_d_val and node_d_val == node_h_val and node_h_val == leaves[6]),
                            },
                            {
                                "id": "leaf_8",
                                "name": "Leaf 8",
                                "type": "LEAF",
                                "depth": 3,
                                "value": leaves[7],
                                "action": "Tactic 4b: In-Memory Redis Query Cache",
                                "is_selected": (root_val == node_d_val and node_d_val == node_h_val and node_h_val == leaves[7]),
                            },
                        ],
                    },
                ],
            },
        ],
    }

    trace = [
        f"1. Leaf Evaluation: terminal scores = {leaves}",
        f"2. Level 2 (MAX nodes): Node E = max({leaves[0]}, {leaves[1]}) = {node_e_val}; Node F = max({leaves[2]}, {leaves[3]}) = {node_f_val}; Node G = max({leaves[4]}, {leaves[5]}) = {node_g_val}; Node H = max({leaves[6]}, {leaves[7]}) = {node_h_val}",
        f"3. Level 1 (MIN adversary): Node C = min({node_e_val}, {node_f_val}) = {node_c_val}; Node D = min({node_g_val}, {node_h_val}) = {node_d_val}",
        f"4. Level 0 (MAX root): Root = max({node_c_val}, {node_d_val}) = {root_val}",
        f"5. Optimal Decision: Choose '{best_branch}' guaranteeing a minimum worst-case utility score of {root_val}.",
    ]

    return {
        "success": True,
        "round_scenario": round_scenario,
        "tree": tree,
        "leaves": leaves,
        "root_value": root_val,
        "best_decision": best_branch,
        "trace": trace,
        "explanation": (
            f"The Minimax theorem guarantees that MAX achieves at least {root_val} utility against an optimal adversary. "
            f"Adversary MIN seeks the worst-case disruption, so MAX selects the action branch whose minimum guaranteed outcome is maximal (Maximin)."
        ),
    }
