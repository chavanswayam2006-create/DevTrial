"""
DevTrail AI - Experiments 6 & 7: Fuzzy Logic Controller & Inference Comparison
Implements:
1. Mamdani fuzzy inference system for adaptive revision support based on Quiz Score & Student Confidence.
2. Side-by-side comparison between Mamdani (fuzzy output sets + centroid defuzzification)
   and Sugeno (crisp rule consequences + weighted average).
"""

from typing import Dict, List, Any, Tuple
import numpy as np

# Try importing scikit-fuzzy, provide reliable NumPy fallback
try:
    import skfuzzy as fuzz
    from skfuzzy import control as ctrl
    HAS_SKFUZZY = True
except ImportError:
    HAS_SKFUZZY = False


def trimf(x: float, a: float, b: float, c: float) -> float:
    """Triangular membership function."""
    if x <= a or x >= c:
        return 0.0
    if a < x <= b:
        return (x - a) / (b - a) if b != a else 1.0
    if b < x < c:
        return (c - x) / (c - b) if c != b else 1.0
    return 0.0


def trapmf(x: float, a: float, b: float, c: float, d: float) -> float:
    """Trapezoidal membership function."""
    if x <= a or x >= d:
        return 0.0
    if a < x < b:
        return (x - a) / (b - a) if b != a else 1.0
    if b <= x <= c:
        return 1.0
    if c < x < d:
        return (d - x) / (d - c) if d != c else 1.0
    return 0.0


def get_memberships(score: float, confidence: float) -> Dict[str, Dict[str, float]]:
    """Calculates membership degrees for Score and Confidence."""
    # Bounded inputs [0, 100]
    s = max(0.0, min(100.0, float(score)))
    c = max(0.0, min(100.0, float(confidence)))

    score_mf = {
        "low": round(trapmf(s, 0.0, 0.0, 35.0, 55.0), 3),
        "medium": round(trimf(s, 40.0, 65.0, 85.0), 3),
        "high": round(trapmf(s, 70.0, 85.0, 100.0, 100.0), 3),
    }

    conf_mf = {
        "low": round(trapmf(c, 0.0, 0.0, 30.0, 50.0), 3),
        "medium": round(trimf(c, 35.0, 60.0, 80.0), 3),
        "high": round(trapmf(c, 65.0, 85.0, 100.0, 100.0), 3),
    }

    return {"score": score_mf, "confidence": conf_mf}


def run_fuzzy_controller(score: float, confidence: float) -> Dict[str, Any]:
    """
    Experiment 6: Single Mamdani Fuzzy Controller.
    Computes Revision Support (0% to 100%) from Quiz Score and Student Confidence.
    """
    s = max(0.0, min(100.0, float(score)))
    c = max(0.0, min(100.0, float(confidence)))

    mfs = get_memberships(s, c)
    s_mf = mfs["score"]
    c_mf = mfs["confidence"]

    # Evaluate 7 fuzzy IF-THEN rules
    # Rule 1: IF score is low AND confidence is low THEN revision is High (90)
    w1 = min(s_mf["low"], c_mf["low"])
    # Rule 2: IF score is low AND confidence is high THEN revision is High (95 - Dunning-Kruger warning)
    w2 = min(s_mf["low"], c_mf["high"])
    # Rule 3: IF score is low AND confidence is med THEN revision is High (85)
    w3 = min(s_mf["low"], c_mf["medium"])
    # Rule 4: IF score is med AND confidence is low THEN revision is Med (60)
    w4 = min(s_mf["medium"], c_mf["low"])
    # Rule 5: IF score is med AND confidence is med THEN revision is Med (50)
    w5 = min(s_mf["medium"], c_mf["medium"])
    # Rule 6: IF score is high AND confidence is low THEN revision is Low (25 - Imposter syndrome)
    w6 = min(s_mf["high"], c_mf["low"])
    # Rule 7: IF score is high AND confidence is high THEN revision is Low (10 - Fast-track ready)
    w7 = min(s_mf["high"], c_mf["high"])
    # Rule 8: IF score is med AND confidence is high THEN revision is Low (30)
    w8 = min(s_mf["medium"], c_mf["high"])
    # Rule 9: IF score is high AND confidence is med THEN revision is Low (15)
    w9 = min(s_mf["high"], c_mf["medium"])

    rules = [
        {"id": "R1", "antecedent": "Score is LOW and Confidence is LOW", "consequent": "Revision is HIGH", "strength": round(w1, 3)},
        {"id": "R2", "antecedent": "Score is LOW and Confidence is HIGH", "consequent": "Revision is HIGH (Overconfidence Alert)", "strength": round(w2, 3)},
        {"id": "R3", "antecedent": "Score is LOW and Confidence is MED", "consequent": "Revision is HIGH", "strength": round(w3, 3)},
        {"id": "R4", "antecedent": "Score is MED and Confidence is LOW", "consequent": "Revision is MEDIUM (Confidence Booster)", "strength": round(w4, 3)},
        {"id": "R5", "antecedent": "Score is MED and Confidence is MED", "consequent": "Revision is MEDIUM", "strength": round(w5, 3)},
        {"id": "R6", "antecedent": "Score is HIGH and Confidence is LOW", "consequent": "Revision is LOW (Imposter Syndrome)", "strength": round(w6, 3)},
        {"id": "R7", "antecedent": "Score is HIGH and Confidence is HIGH", "consequent": "Revision is LOW (Fast-Track Ready)", "strength": round(w7, 3)},
        {"id": "R8", "antecedent": "Score is MED and Confidence is HIGH", "consequent": "Revision is LOW", "strength": round(w8, 3)},
        {"id": "R9", "antecedent": "Score is HIGH and Confidence is MED", "consequent": "Revision is LOW", "strength": round(w9, 3)},
    ]

    active_rules = [r for r in rules if r["strength"] > 0.0]

    # Mamdani Centroid Defuzzification over output grid y in [0, 100]
    y = np.linspace(0.0, 100.0, 201)
    # Output MFs:
    # Low: trap(0, 0, 20, 45)
    # Medium: trimf(30, 50, 75)
    # High: trap(55, 75, 100, 100)
    mf_low = np.array([trapmf(val, 0.0, 0.0, 20.0, 45.0) for val in y])
    mf_med = np.array([trimf(val, 30.0, 50.0, 75.0) for val in y])
    mf_high = np.array([trapmf(val, 55.0, 75.0, 100.0, 100.0) for val in y])

    high_strength = max(w1, w2, w3)
    med_strength = max(w4, w5)
    low_strength = max(w6, w7, w8, w9)

    # Implication: clipping
    agg = np.maximum(
        np.minimum(low_strength, mf_low),
        np.maximum(
            np.minimum(med_strength, mf_med),
            np.minimum(high_strength, mf_high)
        )
    )

    sum_agg = np.sum(agg)
    if sum_agg == 0:
        crisp_output = 50.0
    else:
        crisp_output = float(np.sum(y * agg) / sum_agg)

    # Classification
    if crisp_output < 35.0:
        classification = "Low Revision (Direct Progression)"
        recommendation = "Student has demonstrated solid mastery. Clear to proceed to next chapter without revision."
    elif crisp_output <= 65.0:
        classification = "Medium Revision (Review Recommended)"
        recommendation = "Student has moderate grasp but requires targeted review of key concept deliverables."
    else:
        classification = "High Revision (Intensive Scaffolding Required)"
        recommendation = "Student shows significant diagnostic gaps or confidence mismatch. Scaffolded review assigned before unlock."

    return {
        "success": True,
        "input_score": s,
        "input_confidence": c,
        "memberships": mfs,
        "rules_fired": active_rules,
        "crisp_output": round(crisp_output, 2),
        "classification": classification,
        "recommendation": recommendation,
        "scikit_fuzzy_available": HAS_SKFUZZY,
        "explanation": (
            f"Fuzzy inference computed crisp revision support of {round(crisp_output, 1)}% from quiz score ({s}%) and confidence ({c}%). "
            f"{len(active_rules)} rules fired to form the aggregated fuzzy output set, which was defuzzified using the centroid center-of-gravity method."
        ),
    }


def compare_mamdani_sugeno(score: float, confidence: float) -> Dict[str, Any]:
    """
    Experiment 7: Mamdani vs Sugeno Inference Comparison on Identical Inputs.
    """
    mamdani_result = run_fuzzy_controller(score, confidence)

    # Sugeno zero-order inference:
    # Rule consequences are singleton crisp values:
    # R1 (Low, Low) -> 90
    # R2 (Low, High) -> 95
    # R3 (Low, Med) -> 85
    # R4 (Med, Low) -> 60
    # R5 (Med, Med) -> 50
    # R6 (High, Low) -> 25
    # R7 (High, High) -> 10
    # R8 (Med, High) -> 30
    # R9 (High, Med) -> 15

    sugeno_consequents = {
        "R1": 90.0,
        "R2": 95.0,
        "R3": 85.0,
        "R4": 60.0,
        "R5": 50.0,
        "R6": 25.0,
        "R7": 10.0,
        "R8": 30.0,
        "R9": 15.0,
    }

    all_rules = mamdani_result["rules_fired"]
    numerator = 0.0
    denominator = 0.0
    sugeno_table = []

    for r in all_rules:
        rid = r["id"]
        w = r["strength"]
        z = sugeno_consequents.get(rid, 50.0)
        numerator += w * z
        denominator += w
        sugeno_table.append({
            "rule_id": rid,
            "antecedent": r["antecedent"],
            "weight": w,
            "consequent_z": z,
            "weighted_product": round(w * z, 2),
        })

    sugeno_output = (numerator / denominator) if denominator > 0 else 50.0

    return {
        "success": True,
        "input_score": score,
        "input_confidence": confidence,
        "memberships": mamdani_result["memberships"],
        "mamdani": {
            "type": "Mamdani",
            "crisp_output": mamdani_result["crisp_output"],
            "defuzzification_method": "Centroid Area Center of Gravity (CoG)",
            "output_nature": "Continuous fuzzy membership set integrated over output universe",
            "classification": mamdani_result["classification"],
        },
        "sugeno": {
            "type": "Takagi-Sugeno-Kang (Zero-Order)",
            "crisp_output": round(sugeno_output, 2),
            "defuzzification_method": "Weighted Average: sum(w_i * z_i) / sum(w_i)",
            "output_nature": "Linear / singleton crisp consequences",
            "classification": "Low Revision" if sugeno_output < 35 else ("Medium Revision" if sugeno_output <= 65 else "High Revision"),
            "rule_contributions": sugeno_table,
        },
        "comparison_summary": {
            "output_delta": round(abs(mamdani_result["crisp_output"] - sugeno_output), 2),
            "key_difference": (
                "Mamdani preserves linguistic interpretability across both inputs and outputs using continuous fuzzy membership functions, "
                "requiring numerical integration for centroid defuzzification. "
                "Sugeno replaces output fuzzy sets with crisp singleton formulas, enabling direct weighted averaging with lower computational overhead."
            ),
        },
    }
