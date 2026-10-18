"""
DevTrail AI - Comprehensive Algorithm Test Suite
Tests all 10 AI Practicals and curriculum routing algorithms.
"""

import pytest
import sys
import os

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.curriculum import CURRICULUM_NODES, CURRICULUM_EDGES
from app.algorithms.search import run_bfs, run_dfs, run_astar
from app.algorithms.prolog_demo import run_prolog_query
from app.algorithms.minimax import run_minimax_game
from app.algorithms.fuzzy import run_fuzzy_controller, compare_mamdani_sugeno
from app.algorithms.neuro_fuzzy import run_neuro_fuzzy_system
from app.algorithms.neural_learning import run_neural_learning_lab
from app.algorithms.ngram import run_ngram_experiment
from app.algorithms.peas import evaluate_peas_problem_formulation


def test_curriculum_integrity():
    """Verify all required nodes A through G exist and have valid structure."""
    expected_nodes = ["node_a", "node_b", "node_c", "node_d", "node_e", "node_f", "node_g"]
    for nid in expected_nodes:
        assert nid in CURRICULUM_NODES
        assert "title" in CURRICULUM_NODES[nid]
        assert "prerequisites" in CURRICULUM_NODES[nid]
        assert "estimated_hours" in CURRICULUM_NODES[nid]
        assert "diagnostic_quiz" in CURRICULUM_NODES[nid]


def test_bfs_search():
    """BFS discovers unweighted path from node_a to node_g."""
    res = run_bfs("node_a", "node_g")
    assert res["success"] is True
    assert res["path"][0] == "node_a"
    assert res["path"][-1] == "node_g"
    assert len(res["path"]) >= 7
    assert res["nodes_visited_count"] > 0


def test_dfs_search():
    """DFS discovers valid path and handles same start/goal."""
    res = run_dfs("node_a", "node_g")
    assert res["success"] is True
    assert res["path"][0] == "node_a"
    assert res["path"][-1] == "node_g"

    same_res = run_dfs("node_c", "node_c")
    assert same_res["success"] is True
    assert same_res["path"] == ["node_c"]


def test_astar_search_and_savings():
    """A* incorporates mastered nodes and returns study hour savings."""
    res = run_astar("node_a", "node_g", mastered_nodes=["node_a", "node_b", "node_c"])
    assert res["success"] is True
    assert res["path"][0] == "node_a"
    assert res["path"][-1] == "node_g"
    # Should have savings because A, B, C are mastered
    assert res["savings_hours"] > 0
    assert res["total_cost"] < res["baseline_cost"]


def test_search_unreachable_node():
    """Search algorithms gracefully detect reverse/unreachable traversal."""
    res = run_bfs("node_g", "node_a")
    assert res["success"] is False
    assert "unreachable" in res["explanation"].lower()


def test_prolog_rule_trace():
    """Prolog engine correctly resolves can_unlock and capstone_ready."""
    # When A, B, C mastered, D can unlock
    res = run_prolog_query("can_unlock", target_node="node_d", mastered_nodes=["node_a", "node_b", "node_c"])
    assert res["success"] is True
    assert res["result"] is True

    # When B is missing, D cannot unlock
    res_missing = run_prolog_query("can_unlock", target_node="node_d", mastered_nodes=["node_a"])
    assert res_missing["success"] is True
    assert res_missing["result"] is False

    # Capstone check
    res_cap = run_prolog_query("capstone_ready", mastered_nodes=["node_a", "node_b", "node_c"])
    assert res_cap["result"] is False
    assert "node_d" in res_cap["missing_prerequisites"]


def test_minimax_game_tree():
    """Minimax tree evaluates max of min at root."""
    res = run_minimax_game(custom_leaves=[2, 8, 4, 1, 9, 3, 5, 7])
    assert res["success"] is True
    assert "tree" in res
    assert res["root_value"] in [2, 8, 4, 1, 9, 3, 5, 7]


def test_fuzzy_controller_boundaries():
    """Fuzzy controller bounds outputs between 0 and 100."""
    res_high = run_fuzzy_controller(score=95.0, confidence=90.0)
    assert res_high["crisp_output"] < 40.0  # High score + confidence = Low revision support needed

    res_low = run_fuzzy_controller(score=20.0, confidence=20.0)
    assert res_low["crisp_output"] > 60.0  # Low score + confidence = High revision support needed


def test_mamdani_sugeno_comparison():
    """Mamdani and Sugeno return side-by-side comparison on same inputs."""
    res = compare_mamdani_sugeno(score=75.0, confidence=70.0)
    assert res["success"] is True
    assert "mamdani" in res
    assert "sugeno" in res
    assert res["mamdani"]["crisp_output"] > 0
    assert res["sugeno"]["crisp_output"] > 0


def test_neuro_fuzzy_system():
    """Hybrid neuro-fuzzy system combines neural and fuzzy outputs."""
    res = run_neuro_fuzzy_system(quiz_score=85.0, assignment_completion=90.0, practice_frequency=5.0, confidence=80.0)
    assert res["success"] is True
    assert "neural_component" in res
    assert "fuzzy_component" in res
    assert "EDUCATIONAL NOTICE" in res["disclosure"]


def test_neural_learning():
    """Supervised Perceptron and Unsupervised Clustering both succeed."""
    res = run_neural_learning_lab(quiz_score=85.0, assignment_completion=90.0, practice_frequency=5.0)
    assert res["success"] is True
    assert res["supervised"]["predicted_category"] is not None
    assert res["unsupervised"]["assigned_archetype"] is not None


def test_ngram_models():
    """N-gram model produces next word candidates and text continuation."""
    res = run_ngram_experiment(prompt="JavaScript uses", model_type="trigram", max_tokens=8)
    assert res["success"] is True
    assert len(res["next_word_predictions"]) > 0
    assert "continuation" in res
    assert len(res["continuation"]["generated_continuation"]) > 0


def test_peas_problem_formulation():
    """PEAS evaluation provides all matrix quadrants and valid action transitions."""
    res = evaluate_peas_problem_formulation(current_node="node_c", goal_node="node_g")
    assert res["success"] is True
    assert "performance_measure" in res["peas_matrix"]
    assert "environment" in res["peas_matrix"]
    assert "actuators" in res["peas_matrix"]
    assert "sensors" in res["peas_matrix"]
    assert len(res["problem_formulation"]["valid_actions"]) > 0
