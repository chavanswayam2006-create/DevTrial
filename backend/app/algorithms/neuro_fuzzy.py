"""
DevTrail AI - Experiment 8: Hybrid Neuro-Fuzzy System
Combines a feedforward neural predictor with fuzzy reasoning rules
to synthesize multimodal learning metrics (quiz performance, assignment completion,
and practice consistency) into an adaptive curriculum recommendation.
"""

from typing import Dict, List, Any
import numpy as np


def sigmoid(z: float) -> float:
    """Standard numerically stable sigmoid function."""
    return float(1.0 / (1.0 + np.exp(-np.clip(z, -25.0, 25.0))))


def run_neuro_fuzzy_system(
    quiz_score: float = 85.0,
    assignment_completion: float = 90.0,
    practice_frequency: float = 5.0,  # sessions per week (1 to 7)
    confidence: float = 80.0,
) -> Dict[str, Any]:
    """
    1. Neural Subsystem:
       Estimates baseline technical proficiency score (0-100) using trained weights
       over synthetic student performance features.
    2. Fuzzy Subsystem:
       Combines the neural prediction with the learner's self-assessed confidence
       using rule-based linguistic reasoning to avoid over- or under-acceleration.
    """
    # Bound inputs
    q = max(0.0, min(100.0, float(quiz_score)))
    a = max(0.0, min(100.0, float(assignment_completion)))
    freq = max(1.0, min(7.0, float(practice_frequency)))
    conf = max(0.0, min(100.0, float(confidence)))

    # Feature normalization to [0, 1]
    x = np.array([q / 100.0, a / 100.0, (freq - 1.0) / 6.0])

    # Deterministic neural weights derived from synthetic web-dev training data
    # Quiz accuracy weight: 0.50, Assignment completion: 0.35, Practice consistency: 0.25
    weights = np.array([2.4, 1.8, 1.2])
    bias = -1.8

    # Forward pass: logit and activation
    logit = float(np.dot(weights, x) + bias)
    neural_raw = sigmoid(logit)
    neural_score = round(neural_raw * 100.0, 1)

    # Fuzzy reasoning layer
    # Evaluate linguistic bands for neural_score and confidence
    def band(val: float) -> str:
        if val < 50.0:
            return "LOW"
        elif val < 75.0:
            return "MEDIUM"
        else:
            return "HIGH"

    neural_band = band(neural_score)
    conf_band = band(conf)

    # Hybrid Rules
    if neural_band == "HIGH" and conf_band == "HIGH":
        fuzzy_adjustment = +5.0
        recommendation = "Fast-Track Capstone Synthesis: Full mastery confirmed by both neural indicators and learner calibration."
        status_category = "Accelerated Leap"
    elif neural_band == "HIGH" and conf_band in ["LOW", "MEDIUM"]:
        fuzzy_adjustment = -2.0
        recommendation = "Imposter Gap Mitigation: Neural indicators indicate strong ability, but scaffolding challenges are scheduled to boost learner confidence."
        status_category = "Confidence Alignment"
    elif neural_band == "LOW" and conf_band == "HIGH":
        fuzzy_adjustment = -12.0
        recommendation = "Cognitive Dunning-Kruger Intervention: High self-rating contradicts neural assignment telemetry. Targeted prerequisite diagnostic enforced."
        status_category = "Prerequisite Verification"
    elif neural_band == "LOW" and conf_band == "LOW":
        fuzzy_adjustment = -8.0
        recommendation = "Foundational Micro-Lessons: Reinforce fundamental syntax and async patterns with guided peer code reviews."
        status_category = "Scaffolded Review"
    else:  # MEDIUM cases
        fuzzy_adjustment = 0.0
        recommendation = "Standard Paced Milestone: Proceed through current chapter modules with active coding exercises."
        status_category = "Standard Progression"

    final_hybrid_score = round(max(0.0, min(100.0, neural_score + fuzzy_adjustment)), 1)

    return {
        "success": True,
        "disclosure": "EDUCATIONAL NOTICE: This hybrid system uses deterministic synthetic learning data for instructional demonstration. Outputs are simulated pedagogical guides and not certified psychometric evaluations.",
        "inputs": {
            "quiz_score": q,
            "assignment_completion": a,
            "practice_frequency_weekly": freq,
            "learner_confidence": conf,
        },
        "neural_component": {
            "feature_vector": [round(float(v), 3) for v in x],
            "synaptic_weights": [2.4, 1.8, 1.2],
            "bias": -1.8,
            "logit": round(logit, 3),
            "neural_readiness_score": neural_score,
            "linguistic_band": neural_band,
            "role": "Continuous feature extraction from quantitative behavioral telemetry.",
        },
        "fuzzy_component": {
            "neural_input_band": neural_band,
            "confidence_input_band": conf_band,
            "rule_adjustment": fuzzy_adjustment,
            "status_category": status_category,
            "role": "Transparent symbolic inference translating raw neural predictions into pedagogically calibrated human interventions.",
        },
        "final_hybrid_score": final_hybrid_score,
        "recommendation": recommendation,
        "explanation": (
            f"The neural model calculated an initial readiness index of {neural_score}% based on quiz, assignment, and practice frequency vectors. "
            f"The fuzzy rule engine then checked this against learner confidence ({conf}%), applying a {fuzzy_adjustment:+.1f}% calibration "
            f"to yield a final hybrid recommendation of '{status_category}' ({final_hybrid_score}%)."
        ),
    }
