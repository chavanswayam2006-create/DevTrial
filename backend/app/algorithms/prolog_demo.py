"""
DevTrail AI - Experiment 2: Horn-Clause Rule Trace Demonstration
Provides a clear, limited Python rule-trace engine matching the Horn clauses
defined in backend/prolog/curriculum_rules.pl without requiring external SWI-Prolog installation.
"""

from typing import Dict, List, Any, Optional
from app.curriculum import CURRICULUM_NODES


def run_prolog_query(
    query_type: str,
    target_node: str = "node_d",
    mastered_nodes: Optional[List[str]] = None,
    bypassed_nodes: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Simulates Prolog backward-chaining resolution for curriculum rules:
    - can_unlock(Node)
    - all_prereqs_met(Node)
    - capstone_ready
    - unmet_prerequisites(Node)
    """
    mastered = set(mastered_nodes if mastered_nodes is not None else ["node_a", "node_b", "node_c"])
    bypassed = set(bypassed_nodes if bypassed_nodes is not None else ["node_a"])
    satisfied = mastered.union(bypassed)

    trace_steps: List[str] = []
    facts_used: List[str] = []
    rules_applied: List[str] = []

    # Check validity of target node
    if query_type in ["can_unlock", "all_prereqs_met", "unmet_prerequisites"]:
        if target_node not in CURRICULUM_NODES:
            return {
                "success": False,
                "error": f"Unknown chapter '{target_node}'",
                "engine": "Python Rule-Trace Engine (Matching curriculum_rules.pl)",
            }

    if query_type == "can_unlock":
        query_str = f"?- can_unlock({target_node})."
        rules_applied.append(
            "can_unlock(Node) :- chapter(Node, _, _, _), \\+ satisfied(Node), all_direct_prereqs_satisfied(Node)."
        )
        trace_steps.append(f"Goal: Prove can_unlock({target_node})")

        # Step 1: Check if node is a recognized chapter
        facts_used.append(f"chapter({target_node}, '{CURRICULUM_NODES[target_node]['title']}', {CURRICULUM_NODES[target_node]['estimated_hours']}, {CURRICULUM_NODES[target_node]['category']}).")
        trace_steps.append(f"1. Verified chapter fact exists for {target_node}.")

        # Step 2: Check if already satisfied
        is_already_satisfied = target_node in satisfied
        if is_already_satisfied:
            facts_used.append(f"satisfied({target_node}).")
            trace_steps.append(f"2. Goal failed: \\+ satisfied({target_node}) evaluated to FALSE (student already completed/bypassed this chapter).")
            return {
                "success": True,
                "query": query_str,
                "result": False,
                "result_message": f"Chapter {target_node} is already mastered or satisfied; no need to re-unlock.",
                "facts_used": facts_used,
                "rules_applied": rules_applied,
                "trace": trace_steps,
                "engine": "Python Rule-Trace Engine (Simulating Horn-clause resolution)",
                "prolog_source_file": "backend/prolog/curriculum_rules.pl",
            }
        else:
            trace_steps.append(f"2. Verified: \\+ satisfied({target_node}) is TRUE (chapter not yet completed).")

        # Step 3: Check all direct prerequisites
        prereqs = CURRICULUM_NODES[target_node]["prerequisites"]
        missing_prereqs = []
        for p in prereqs:
            facts_used.append(f"direct_prereq({target_node}, {p}).")
            if p in satisfied:
                facts_used.append(f"satisfied({p}). (via mastered or diagnostic)")
                trace_steps.append(f"3. Prereq check: {p} is satisfied.")
            else:
                missing_prereqs.append(p)
                trace_steps.append(f"3. Prereq check: {p} is NOT satisfied.")

        rules_applied.append("all_direct_prereqs_satisfied(Node) :- \\+ (direct_prereq(Node, Req), \\+ satisfied(Req)).")

        if not missing_prereqs:
            trace_steps.append("4. All direct prerequisites are satisfied. Horn clause resolution succeeded.")
            result_bool = True
            msg = f"YES: {target_node} ({CURRICULUM_NODES[target_node]['title']}) is unlocked and ready for study."
        else:
            trace_steps.append(f"4. Missing prerequisite(s): {', '.join(missing_prereqs)}. Cannot unlock.")
            result_bool = False
            msg = f"NO: Cannot unlock {target_node}. Missing required prerequisite: {', '.join(missing_prereqs)}."

        return {
            "success": True,
            "query": query_str,
            "result": result_bool,
            "result_message": msg,
            "target_node": target_node,
            "missing_prerequisites": missing_prereqs,
            "facts_used": facts_used,
            "rules_applied": rules_applied,
            "trace": trace_steps,
            "engine": "Python Rule-Trace Engine (Simulating Horn-clause resolution)",
            "prolog_source_file": "backend/prolog/curriculum_rules.pl",
        }

    elif query_type == "capstone_ready":
        query_str = "?- capstone_ready."
        rules_applied.append(
            "capstone_ready :- satisfied(node_a), satisfied(node_b), satisfied(node_c), satisfied(node_d), satisfied(node_e), satisfied(node_f)."
        )
        required_nodes = ["node_a", "node_b", "node_c", "node_d", "node_e", "node_f"]
        missing_core = [n for n in required_nodes if n not in satisfied]

        trace_steps.append("Goal: Prove capstone_ready")
        for n in required_nodes:
            if n in satisfied:
                facts_used.append(f"satisfied({n}).")
                trace_steps.append(f"Subgoal satisfied({n}) -> TRUE")
            else:
                trace_steps.append(f"Subgoal satisfied({n}) -> FALSE (Unmet prerequisite)")

        if not missing_core:
            trace_steps.append("All 6 foundation chapters proved. capstone_ready query SUCCESS.")
            return {
                "success": True,
                "query": query_str,
                "result": True,
                "result_message": "YES: Alex Rivera has satisfied all core milestones and is eligible for Capstone Node G.",
                "missing_prerequisites": [],
                "facts_used": facts_used,
                "rules_applied": rules_applied,
                "trace": trace_steps,
                "engine": "Python Rule-Trace Engine (Simulating Horn-clause resolution)",
                "prolog_source_file": "backend/prolog/curriculum_rules.pl",
            }
        else:
            trace_steps.append(f"Failed subgoals: {', '.join(missing_core)}. capstone_ready query FALSE.")
            return {
                "success": True,
                "query": query_str,
                "result": False,
                "result_message": f"NO: Capstone is locked. Unmet milestones: {', '.join(missing_core)}.",
                "missing_prerequisites": missing_core,
                "facts_used": facts_used,
                "rules_applied": rules_applied,
                "trace": trace_steps,
                "engine": "Python Rule-Trace Engine (Simulating Horn-clause resolution)",
                "prolog_source_file": "backend/prolog/curriculum_rules.pl",
            }

    elif query_type == "unmet_prerequisites":
        query_str = f"?- unmet_prerequisites({target_node}, Missing)."
        rules_applied.append("has_prerequisite(Node, Prereq) :- direct_prereq(Node, Prereq).")
        rules_applied.append("has_prerequisite(Node, Prereq) :- direct_prereq(Node, Inter), has_prerequisite(Inter, Prereq).")
        rules_applied.append("unmet_prerequisites(Node, Missing) :- has_prerequisite(Node, Missing), \\+ satisfied(Missing).")

        # Ancestral DFS search
        ancestors = set()
        def get_all_ancestors(n: str):
            for p in CURRICULUM_NODES.get(n, {}).get("prerequisites", []):
                ancestors.add(p)
                get_all_ancestors(p)
        get_all_ancestors(target_node)

        missing = [a for a in sorted(ancestors) if a not in satisfied]
        for a in sorted(ancestors):
            facts_used.append(f"has_prerequisite({target_node}, {a}).")
            if a in satisfied:
                facts_used.append(f"satisfied({a}).")
            else:
                trace_steps.append(f"Derived missing prerequisite binding: Missing = {a}")

        return {
            "success": True,
            "query": query_str,
            "result": len(missing) == 0,
            "bindings": [{"Missing": m, "title": CURRICULUM_NODES[m]["title"]} for m in missing],
            "result_message": f"Found {len(missing)} unmet prerequisite ancestor(s) for {target_node}." if missing else f"All prerequisite ancestors for {target_node} are satisfied.",
            "facts_used": facts_used,
            "rules_applied": rules_applied,
            "trace": trace_steps,
            "engine": "Python Rule-Trace Engine (Simulating Horn-clause resolution)",
            "prolog_source_file": "backend/prolog/curriculum_rules.pl",
        }

    else:
        return {"success": False, "error": f"Unsupported query type '{query_type}'"}
