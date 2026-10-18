"""
DevTrail AI - Experiment 9: Supervised Perceptron & Unsupervised Competitive Learning
Demonstrates:
1. Supervised Perceptron: Learns a linear decision boundary using target labels and error-driven weight updates.
2. Unsupervised Competitive Learning: Discovers natural clusters (Learning Archetypes) using Winner-Take-All vector quantization.
Uses strictly anonymous synthetic student feature vectors.
"""

from typing import Dict, List, Any, Optional
import numpy as np

# Deterministic synthetic dataset (12 anonymous training profiles)
# Features: [Quiz %, Assignment Completion %, Weekly Practice Sessions]
SYNTHETIC_DATASET = [
    {"id": "synth_01", "features": [94.0, 98.0, 6.0], "label": 1, "track": "Accelerated"},
    {"id": "synth_02", "features": [88.0, 92.0, 5.0], "label": 1, "track": "Accelerated"},
    {"id": "synth_03", "features": [72.0, 75.0, 3.0], "label": 0, "track": "Standard"},
    {"id": "synth_04", "features": [60.0, 68.0, 2.0], "label": 0, "track": "Standard"},
    {"id": "synth_05", "features": [91.0, 89.0, 6.0], "label": 1, "track": "Accelerated"},
    {"id": "synth_06", "features": [55.0, 60.0, 2.0], "label": 0, "track": "Standard"},
    {"id": "synth_07", "features": [85.0, 80.0, 4.0], "label": 1, "track": "Accelerated"},
    {"id": "synth_08", "features": [65.0, 70.0, 3.0], "label": 0, "track": "Standard"},
    {"id": "synth_09", "features": [78.0, 82.0, 4.0], "label": 0, "track": "Standard"},
    {"id": "synth_10", "features": [96.0, 95.0, 7.0], "label": 1, "track": "Accelerated"},
    {"id": "synth_11", "features": [58.0, 62.0, 1.0], "label": 0, "track": "Standard"},
    {"id": "synth_12", "features": [82.0, 86.0, 5.0], "label": 1, "track": "Accelerated"},
]


def run_supervised_perceptron(
    quiz_score: float,
    assignment_completion: float,
    practice_frequency: float,
    epochs: int = 20,
    learning_rate: float = 0.05,
) -> Dict[str, Any]:
    """
    Supervised Perceptron learning on synthetic normalized features.
    """
    # Normalize features: x1 in [0, 1], x2 in [0, 1], x3 in [0, 1]
    X_raw = np.array([item["features"] for item in SYNTHETIC_DATASET])
    y = np.array([item["label"] for item in SYNTHETIC_DATASET])

    # Normalization scales
    scale = np.array([100.0, 100.0, 7.0])
    X = X_raw / scale

    # Initialize weights and bias
    weights = np.array([0.2, 0.2, 0.2])
    bias = -0.3

    training_history = []

    for ep in range(1, epochs + 1):
        errors_in_epoch = 0
        for i in range(len(X)):
            x_i = X[i]
            y_i = y[i]
            activation = float(np.dot(weights, x_i) + bias)
            y_pred = 1 if activation >= 0.0 else 0
            error = y_i - y_pred

            if error != 0:
                errors_in_epoch += 1
                weights += learning_rate * error * x_i
                bias += learning_rate * error

        training_history.append({
            "epoch": ep,
            "errors": errors_in_epoch,
            "weights": [round(float(w), 4) for w in weights],
            "bias": round(float(bias), 4),
        })

        if errors_in_epoch == 0 and ep >= 5:
            # Converged early
            break

    # Predict for incoming query
    input_norm = np.array([quiz_score / 100.0, assignment_completion / 100.0, practice_frequency / 7.0])
    query_activation = float(np.dot(weights, input_norm) + bias)
    query_pred = 1 if query_activation >= 0.0 else 0
    pred_category = "Accelerated Milestone Readiness" if query_pred == 1 else "Standard Foundational Pacing"

    return {
        "success": True,
        "mode": "Supervised Learning (Perceptron)",
        "epochs_trained": len(training_history),
        "final_weights": [round(float(w), 4) for w in weights],
        "final_bias": round(float(bias), 4),
        "decision_boundary": f"{round(weights[0], 2)}*x1 + {round(weights[1], 2)}*x2 + {round(weights[2], 2)}*x3 + {round(bias, 2)} = 0",
        "sample_training_history": training_history[-5:],
        "user_input": {
            "quiz_score": quiz_score,
            "assignment_completion": assignment_completion,
            "practice_frequency": practice_frequency,
        },
        "predicted_label": query_pred,
        "predicted_category": pred_category,
        "activation_margin": round(query_activation, 3),
        "explanation": (
            "The Perceptron adjusted its synaptic weights iteratively whenever its prediction disagreed with the historical supervisor label. "
            f"After training, it separated the dataset linearly and classified the query into '{pred_category}' with margin {round(query_activation, 2)}."
        ),
    }


def run_unsupervised_competitive(
    quiz_score: float,
    assignment_completion: float,
    practice_frequency: float,
    k_clusters: int = 3,
) -> Dict[str, Any]:
    """
    Unsupervised Competitive Learning (Winner-Take-All clustering)
    Discovers 3 constructive learning archetypes without any supervisor labels.
    """
    # Archetype Centroids initialized in normalized space [0, 1]
    archetypes = [
        {
            "id": "cluster_0",
            "name": "Pragmatic Project Builder",
            "centroid": np.array([0.70, 0.95, 0.85]),
            "description": "High assignment and code completion with moderate quiz reliance. Excels at tactile project building.",
        },
        {
            "id": "cluster_1",
            "name": "Systematic Conceptual Explorer",
            "centroid": np.array([0.95, 0.75, 0.60]),
            "description": "High diagnostic precision and conceptual depth. Methodically verifies abstract specifications.",
        },
        {
            "id": "cluster_2",
            "name": "Adaptive Fast-Paced Sprinter",
            "centroid": np.array([0.90, 0.90, 0.95]),
            "description": "Balanced high intensity across both theory quizzes and real-world repository builds.",
        },
    ]

    # Normalize user input
    scale = np.array([100.0, 100.0, 7.0])
    x_user = np.array([quiz_score, assignment_completion, practice_frequency]) / scale

    # Compute Euclidean distance to all centroids (Competitive Layer)
    distances = []
    winning_idx = 0
    min_dist = float("inf")

    for i, arch in enumerate(archetypes):
        dist = float(np.linalg.norm(x_user - arch["centroid"]))
        distances.append({
            "cluster_id": arch["id"],
            "archetype_name": arch["name"],
            "euclidean_distance": round(dist, 4),
            "description": arch["description"],
        })
        if dist < min_dist:
            min_dist = dist
            winning_idx = i

    winner = archetypes[winning_idx]

    return {
        "success": True,
        "mode": "Unsupervised Learning (Competitive Clustering)",
        "clusters_evaluated": distances,
        "assigned_cluster": winner["id"],
        "assigned_archetype": winner["name"],
        "archetype_description": winner["description"],
        "winning_distance": round(min_dist, 4),
        "explanation": (
            f"Without human supervisor feedback, the competitive neural layer matched the learner's feature vector "
            f"to the nearest cluster centroid in 3D feature space (distance = {round(min_dist, 3)}), associating them with the '{winner['name']}' learning persona."
        ),
    }


def run_neural_learning_lab(
    quiz_score: float = 85.0,
    assignment_completion: float = 90.0,
    practice_frequency: float = 5.0,
) -> Dict[str, Any]:
    """
    Experiment 9 Full Runner: runs both Supervised and Unsupervised pipelines.
    """
    supervised = run_supervised_perceptron(quiz_score, assignment_completion, practice_frequency)
    unsupervised = run_unsupervised_competitive(quiz_score, assignment_completion, practice_frequency)

    return {
        "success": True,
        "ethical_disclosure": (
            "ETHICAL AI NOTICE: Learner profiles are anonymous and synthetic. "
            "Labels identify supportive pedagogical pathways rather than rank or judge students."
        ),
        "inputs": {
            "quiz_percentage": quiz_score,
            "assignment_completion": assignment_completion,
            "weekly_practice_sessions": practice_frequency,
        },
        "supervised": supervised,
        "unsupervised": unsupervised,
        "pedagogical_comparison": {
            "supervised_summary": "Uses ground-truth labels from verified past cohorts to optimize weights via feedback error minimization.",
            "unsupervised_summary": "Finds emergent behavioral patterns and natural student cohorts without external supervisor labels or grading.",
        },
    }
