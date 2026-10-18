"""
DevTrail AI - Experiment 1: PEAS and Problem Formulation
Formulates the DevTrail AI student-learning agent:
- Performance Measure: Maximize learning outcome mastery while minimizing redundant study hours.
- Environment: Curriculum graph (Nodes A through G), assignments, prerequisites, and diagnostic scores.
- Actuators: Recommend next chapter, issue diagnostic bypass, schedule revision scaffolding, certify capstone readiness.
- Sensors: Quiz scores, assignment deliverables, confidence self-ratings, completion telemetry.
Also provides State Space exploration, transition model, goal test, and path cost functions.
"""

from typing import Dict, List, Any, Optional
from app.curriculum import CURRICULUM_NODES, CURRICULUM_EDGES


def evaluate_peas_problem_formulation(
    current_node: str = "node_a",
    goal_node: str = "node_g",
    mastered_nodes: Optional[List[str]] = None,
    quiz_score: float = 85.0,
    confidence: float = 80.0,
) -> Dict[str, Any]:
    """
    Evaluates the PEAS formulation and state-space problem definition.
    """
    mastered = set(mastered_nodes or ["node_a", "node_b", "node_c"])

    # 1. PEAS Matrix Definition
    peas_matrix = {
        "performance_measure": {
            "name": "Curriculum Efficiency & Mastery Ratio",
            "metrics": [
                "100% satisfaction of all required competencies",
                "Zero prerequisite violation penalties",
                "Study time savings via diagnostic bypasses (Target: >=25% prune)",
                "Student self-efficacy and confidence alignment",
            ],
            "current_score": "57% Overall Mastery (4 of 7 chapters)",
        },
        "environment": {
            "type": "Partially Observable, Deterministic, Sequential, Static, Discrete",
            "components": [
                "Directed Acyclic Graph (DAG) of Chapters A through G",
                "Prerequisite dependency rules",
                "Assignment scoring rubrics",
                "Diagnostic question bank",
            ],
            "properties": {
                "nodes_count": len(CURRICULUM_NODES),
                "edges_count": len(CURRICULUM_EDGES),
                "has_cycles": False,
            },
        },
        "actuators": {
            "name": "Pedagogical Interventions",
            "actions": [
                "Recommend Next Chapter (topological successor)",
                "Grant Diagnostic Bypass (fast-track without repeating lessons)",
                "Trigger Scaffolding Review (targeted review micro-lessons)",
                "Unlock Capstone Certification (milestone graduation)",
            ],
        },
        "sensors": {
            "name": "Learner Telemetry Receivers",
            "signals": [
                f"Diagnostic Quiz Score: {quiz_score}%",
                f"Learner Confidence Rating: {confidence}%",
                f"Completed Chapters: {list(mastered)}",
                "Assignment submission checkpoints",
            ],
        },
    }

    # 2. Formal Problem Formulation
    # State = (current_node, set_of_mastered_nodes)
    if current_node not in CURRICULUM_NODES:
        current_node = "node_a"
    if goal_node not in CURRICULUM_NODES:
        goal_node = "node_g"

    # Valid Actions from current_node
    valid_actions = []
    for edge in CURRICULUM_EDGES:
        if edge["from_node"] == current_node:
            dest = edge["to_node"]
            dest_prereqs = CURRICULUM_NODES[dest]["prerequisites"]
            unmet = [p for p in dest_prereqs if p not in mastered and p != current_node]
            is_valid = len(unmet) == 0

            valid_actions.append({
                "action": f"Transition to {CURRICULUM_NODES[dest]['code']}: {CURRICULUM_NODES[dest]['title']}",
                "target_node": dest,
                "study_cost_hours": edge["weight"],
                "prerequisites_met": is_valid,
                "unmet_prerequisites": unmet,
                "status": "Ready to Enroll" if is_valid else f"Locked (Requires {', '.join(unmet)})",
            })

    # Transition Model: Result(state, action) -> new_state
    transition_model_desc = (
        f"Result(State({current_node}), Action(Enroll in X)) yields new state X, "
        f"adding X to the mastered set upon 100% checkpoint validation or >=80% diagnostic score."
    )

    # Goal Test
    is_goal_reached = (current_node == goal_node) or (goal_node in mastered)
    goal_test_status = {
        "goal_node": goal_node,
        "goal_title": CURRICULUM_NODES[goal_node]["title"],
        "is_satisfied": is_goal_reached,
        "evaluation_rule": f"State.current_node == '{goal_node}' OR '{goal_node}' in MasteredSet",
        "result_message": "GOAL SATISFIED: Capstone project unlocked." if is_goal_reached else f"GOAL IN PROGRESS: Currently at {CURRICULUM_NODES[current_node]['code']}; {goal_node} pending.",
    }

    # Path Cost Function: g(n) = sum of study hours for all traversed chapters
    path_cost_desc = (
        "Path Cost g(n) is the cumulative study hours of required chapters. "
        "Diagnostic validation sets chapter delta cost to 0.0h, eliminating redundant effort."
    )

    return {
        "success": True,
        "peas_matrix": peas_matrix,
        "problem_formulation": {
            "initial_state": f"Node A ({CURRICULUM_NODES['node_a']['title']})",
            "current_state": f"{CURRICULUM_NODES[current_node]['code']} ({CURRICULUM_NODES[current_node]['title']})",
            "goal_state": f"{CURRICULUM_NODES[goal_node]['code']} ({CURRICULUM_NODES[goal_node]['title']})",
            "valid_actions": valid_actions,
            "transition_model": transition_model_desc,
            "goal_test": goal_test_status,
            "path_cost_function": path_cost_desc,
        },
        "explanation": (
            "The learning navigator is modeled as a goal-based intelligent agent. "
            "Its sensors observe student diagnostics and completion telemetry; its actuators select optimal curriculum trajectories. "
            "The state space encompasses milestone completion states, constrained by strict acyclic prerequisite rules."
        ),
    }
