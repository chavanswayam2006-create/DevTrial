"""
DevTrail AI - Intelligent Web Development Learning Navigator Backend API
FastAPI service exposing curriculum navigation, DAG pathfinding, and all 10 AI Practicals.
"""

from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.curriculum import (
    CURRICULUM_NODES,
    CURRICULUM_EDGES,
    DEFAULT_STUDENT_STATE,
)
from app.algorithms.search import run_bfs, run_dfs, run_astar
from app.algorithms.prolog_demo import run_prolog_query
from app.algorithms.minimax import run_minimax_game
from app.algorithms.fuzzy import run_fuzzy_controller, compare_mamdani_sugeno
from app.algorithms.neuro_fuzzy import run_neuro_fuzzy_system
from app.algorithms.neural_learning import run_neural_learning_lab
from app.algorithms.ngram import run_ngram_experiment
from app.algorithms.peas import evaluate_peas_problem_formulation

app = FastAPI(
    title="DevTrail AI - Curriculum Navigator API",
    description="Educational AI algorithms service powering DevTrail AI",
    version="2.4.9",
)

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# Pydantic Request Models
# ==============================================================================

class RouteRequest(BaseModel):
    algorithm: str = Field(default="astar", description="Search algorithm: 'bfs', 'dfs', or 'astar'")
    start_node: str = Field(default="node_a", description="Origin node ID")
    goal_node: str = Field(default="node_g", description="Target node ID")
    mastered_nodes: Optional[List[str]] = Field(default=None, description="List of mastered node IDs")


class LabRunRequest(BaseModel):
    # Common / Experiment-specific parameters
    current_node: Optional[str] = "node_a"
    goal_node: Optional[str] = "node_g"
    start_node: Optional[str] = "node_a"
    target_node: Optional[str] = "node_d"
    mastered_nodes: Optional[List[str]] = None
    bypassed_nodes: Optional[List[str]] = None
    algorithm: Optional[str] = "astar"
    query_type: Optional[str] = "can_unlock"

    # Numeric inputs with safe bounds
    quiz_score: Optional[float] = Field(default=85.0, ge=0.0, le=100.0)
    confidence: Optional[float] = Field(default=80.0, ge=0.0, le=100.0)
    assignment_completion: Optional[float] = Field(default=90.0, ge=0.0, le=100.0)
    practice_frequency: Optional[float] = Field(default=5.0, ge=1.0, le=7.0)

    # Game / NLP inputs
    custom_leaves: Optional[List[int]] = None
    round_scenario: Optional[str] = "production_deploy"
    prompt: Optional[str] = "JavaScript uses an event"
    model_type: Optional[str] = "trigram"
    max_tokens: Optional[int] = Field(default=12, ge=1, le=50)


# ==============================================================================
# Health & Curriculum Endpoints
# ==============================================================================

@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check() -> Dict[str, Any]:
    return {
        "status": "ok",
        "app": "DevTrail AI - Intelligent Curriculum Navigator",
        "version": "2.4.9",
        "backend": "FastAPI + Python 3.14",
    }


@app.get("/curriculum")
@app.get("/api/curriculum")
def get_curriculum() -> Dict[str, Any]:
    return {
        "nodes": CURRICULUM_NODES,
        "edges": CURRICULUM_EDGES,
        "default_student_state": DEFAULT_STUDENT_STATE,
    }


@app.post("/route")
@app.post("/api/route")
def compute_route(req: RouteRequest) -> Dict[str, Any]:
    algo = req.algorithm.lower().strip()
    start = req.start_node
    goal = req.goal_node
    mastered = req.mastered_nodes or DEFAULT_STUDENT_STATE["mastered_nodes"]

    if algo == "bfs":
        result = run_bfs(start, goal)
    elif algo == "dfs":
        result = run_dfs(start, goal)
    elif algo in ["astar", "a*", "a_star"]:
        result = run_astar(start, goal, mastered)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown algorithm '{req.algorithm}'. Supported: 'bfs', 'dfs', 'astar'",
        )

    return result


# ==============================================================================
# AI Labs Endpoints
# ==============================================================================

LABS_METADATA = [
    {
        "id": "lab_01",
        "number": 1,
        "title": "PEAS & Problem Formulation",
        "domain": "logic",
        "domain_label": "Intelligent Agent Architecture",
        "summary": "Formulate the DevTrail learning agent's Performance measure, Environment, Actuators, and Sensors for optimal capstone routing.",
        "formula": "PEAS Matrix",
    },
    {
        "id": "lab_02",
        "number": 2,
        "title": "PROLOG-Style Prerequisite Rules",
        "domain": "logic",
        "domain_label": "First-Order Knowledge Representation",
        "summary": "Execute Horn-clause resolution engine verifying that Node G cannot be reached without satisfying DAG prerequisite rules.",
        "formula": "can_unlock(X) :- prereq(X, Y), satisfied(Y).",
    },
    {
        "id": "lab_03",
        "number": 3,
        "title": "BFS vs DFS Uninformed Search",
        "domain": "search",
        "domain_label": "State Space Traversal",
        "summary": "Compare queue-based Breadth-First Search (shortest hop guarantee) against stack-based Depth-First Search exploration.",
        "formula": "Queue (FIFO) vs Stack (LIFO)",
    },
    {
        "id": "lab_04",
        "number": 4,
        "title": "A* Heuristic Search & Effort Minimization",
        "domain": "search",
        "domain_label": "Informed Heuristic Search",
        "summary": "Simulate cost-weighted prerequisite traversal combining path cost so far g(n) with estimated study effort heuristic h(n).",
        "formula": "f(n) = g(n) + h(n)",
    },
    {
        "id": "lab_05",
        "number": 5,
        "title": "Minimax Game Tree for Code Quest",
        "domain": "logic",
        "domain_label": "Adversarial Game Theory",
        "summary": "Turn-based tactical decision tree optimizing developer system stability against simulated bug injection and latency spikes.",
        "formula": "max(min(leaf_utilities))",
    },
    {
        "id": "lab_06",
        "number": 6,
        "title": "Fuzzy Logic Mastery Controller",
        "domain": "fuzzy",
        "domain_label": "Fuzzy Linguistic Control",
        "summary": "Mamdani fuzzy inference engine computing continuous revision support from quiz score and learner confidence inputs.",
        "formula": "Centroid Area Defuzzification",
    },
    {
        "id": "lab_07",
        "number": 7,
        "title": "Mamdani vs Sugeno Fuzzy Inference",
        "domain": "fuzzy",
        "domain_label": "Fuzzy Inference Paradigms",
        "summary": "Side-by-side comparison of continuous fuzzy set defuzzification (Mamdani) vs weighted singleton average (Sugeno).",
        "formula": "Integral(y*u)/Integral(u) vs Sum(w*z)/Sum(w)",
    },
    {
        "id": "lab_08",
        "number": 8,
        "title": "Hybrid Neuro-Fuzzy System",
        "domain": "neural",
        "domain_label": "Neuro-Fuzzy Synthesis",
        "summary": "Combines a feedforward neural predictor with fuzzy symbolic rules to formulate an adaptive educational recommendation.",
        "formula": "Neural Feature Extraction + Fuzzy Calibration",
    },
    {
        "id": "lab_09",
        "number": 9,
        "title": "Supervised Perceptron & Unsupervised Clustering",
        "domain": "neural",
        "domain_label": "Neural Learning Paradigms",
        "summary": "Train a supervised single-layer Perceptron with error-driven weight updates and discover natural learner archetypes via competitive clustering.",
        "formula": "w <- w + lr*(y - y_hat)*x & Winner-Take-All",
    },
    {
        "id": "lab_10",
        "number": 10,
        "title": "Micro & Small N-Gram Language Models",
        "domain": "neural",
        "domain_label": "Statistical Language Modeling",
        "summary": "Bigram (Micro LM) and Trigram (Small LM) models calculating conditional word probabilities over bundled web engineering text.",
        "formula": "P(w_t | w_{t-1}, w_{t-2}) = Count/Total",
    },
]


@app.get("/labs")
@app.get("/api/labs")
def list_labs() -> List[Dict[str, Any]]:
    return LABS_METADATA


@app.post("/labs/{lab_id}/run")
@app.post("/api/labs/{lab_id}/run")
def run_lab(lab_id: str, req: LabRunRequest) -> Dict[str, Any]:
    lid = lab_id.lower().replace("-", "_")

    if lid in ["lab_01", "lab_1", "1"]:
        return evaluate_peas_problem_formulation(
            current_node=req.current_node or "node_a",
            goal_node=req.goal_node or "node_g",
            mastered_nodes=req.mastered_nodes,
            quiz_score=req.quiz_score or 85.0,
            confidence=req.confidence or 80.0,
        )

    elif lid in ["lab_02", "lab_2", "2"]:
        return run_prolog_query(
            query_type=req.query_type or "can_unlock",
            target_node=req.target_node or "node_d",
            mastered_nodes=req.mastered_nodes,
            bypassed_nodes=req.bypassed_nodes,
        )

    elif lid in ["lab_03", "lab_3", "3"]:
        algo = (req.algorithm or "bfs").lower().strip()
        start = req.start_node or "node_a"
        goal = req.goal_node or "node_g"
        if algo == "dfs":
            return run_dfs(start, goal)
        else:
            return run_bfs(start, goal)

    elif lid in ["lab_04", "lab_4", "4"]:
        start = req.start_node or "node_a"
        goal = req.goal_node or "node_g"
        return run_astar(start, goal, req.mastered_nodes)

    elif lid in ["lab_05", "lab_5", "5"]:
        return run_minimax_game(
            custom_leaves=req.custom_leaves,
            round_scenario=req.round_scenario or "production_deploy",
        )

    elif lid in ["lab_06", "lab_6", "6"]:
        return run_fuzzy_controller(
            score=req.quiz_score or 85.0,
            confidence=req.confidence or 80.0,
        )

    elif lid in ["lab_07", "lab_7", "7"]:
        return compare_mamdani_sugeno(
            score=req.quiz_score or 85.0,
            confidence=req.confidence or 80.0,
        )

    elif lid in ["lab_08", "lab_8", "8"]:
        return run_neuro_fuzzy_system(
            quiz_score=req.quiz_score or 85.0,
            assignment_completion=req.assignment_completion or 90.0,
            practice_frequency=req.practice_frequency or 5.0,
            confidence=req.confidence or 80.0,
        )

    elif lid in ["lab_09", "lab_9", "9"]:
        return run_neural_learning_lab(
            quiz_score=req.quiz_score or 85.0,
            assignment_completion=req.assignment_completion or 90.0,
            practice_frequency=req.practice_frequency or 5.0,
        )

    elif lid in ["lab_10", "lab_10", "10"]:
        return run_ngram_experiment(
            prompt=req.prompt or "JavaScript uses an event",
            model_type=req.model_type or "trigram",
            max_tokens=req.max_tokens or 12,
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Unknown lab identifier '{lab_id}'. Expected 'lab_01' through 'lab_10'.",
        )
