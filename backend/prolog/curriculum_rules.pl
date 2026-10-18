% ==============================================================================
% DevTrail AI - Curriculum Prerequisite Knowledge Base & Horn Clause Logic
% File: backend/prolog/curriculum_rules.pl
%
% This Prolog knowledge base defines chapters, prerequisite dependencies,
% student mastery facts, and deductive inference rules for curriculum progression.
% ==============================================================================

% ------------------------------------------------------------------------------
% 1. FACTS: Chapters in the Web Development Curriculum (Nodes A through G)
% ------------------------------------------------------------------------------
chapter(node_a, 'Web Foundations & Semantic HTML', 4.0, core).
chapter(node_b, 'CSS Fundamentals & Box Model', 5.0, core).
chapter(node_c, 'Responsive Layouts & Grid Systems', 6.5, core).
chapter(node_d, 'JavaScript Fundamentals & Event Loops', 8.0, core).
chapter(node_e, 'DOM Manipulation, Events & Async APIs', 7.5, core).
chapter(node_f, 'Git, Modern React & Architecture', 9.0, core).
chapter(node_g, 'Advanced Capstone Project', 12.0, capstone).
chapter(opt_1, 'UI Motion & SVG Animation', 3.5, elective).
chapter(opt_2, 'TypeScript & State Management', 4.5, elective).

% ------------------------------------------------------------------------------
% 2. FACTS: Direct Prerequisite Dependencies (prereq(Dependent, Required))
% ------------------------------------------------------------------------------
direct_prereq(node_b, node_a).
direct_prereq(node_c, node_b).
direct_prereq(node_d, node_c).
direct_prereq(node_e, node_d).
direct_prereq(node_f, node_e).
direct_prereq(node_g, node_f).

% Elective dependencies
direct_prereq(opt_1, node_c).
direct_prereq(opt_2, node_d).
direct_prereq(node_f, opt_2) :- false. % Optional enhancement, not required

% ------------------------------------------------------------------------------
% 3. DYNAMIC FACTS: Learner Mastery & Diagnostic Bypasses
% (In a live session, these facts are asserted dynamically per student)
% ------------------------------------------------------------------------------
:- dynamic mastered/1.
:- dynamic bypassed_by_diagnostic/1.

% Baseline demo facts (Student Alex Rivera has completed A, B, C)
mastered(node_a).
mastered(node_b).
mastered(node_c).
% node_d is currently in progress
% node_e, node_f, node_g are locked

% ------------------------------------------------------------------------------
% 4. DEDUCTIVE INFERENCE RULES
% ------------------------------------------------------------------------------

% Rule 1: Topic satisfaction (either directly completed or validated via diagnostic)
satisfied(Node) :-
    mastered(Node).
satisfied(Node) :-
    bypassed_by_diagnostic(Node).

% Rule 2: Transitive / Ancestral Prerequisites
% Has prerequisite if directly required or required through an ancestor
has_prerequisite(Node, Prereq) :-
    direct_prereq(Node, Prereq).
has_prerequisite(Node, Prereq) :-
    direct_prereq(Node, Intermediate),
    has_prerequisite(Intermediate, Prereq).

% Rule 3: All direct prerequisites satisfied
all_direct_prereqs_satisfied(Node) :-
    \+ (direct_prereq(Node, Required), \+ satisfied(Required)).

% Rule 4: Chapter eligibility (Ready to unlock/enroll)
can_unlock(Node) :-
    chapter(Node, _, _, _),
    \+ satisfied(Node),
    all_direct_prereqs_satisfied(Node).

% Rule 5: Capstone graduation readiness
% Node G requires all core foundational milestones to be satisfied
capstone_ready :-
    satisfied(node_a),
    satisfied(node_b),
    satisfied(node_c),
    satisfied(node_d),
    satisfied(node_e),
    satisfied(node_f).

% Rule 6: Unmet prerequisites query for diagnostic advice
unmet_prerequisites(Node, Missing) :-
    has_prerequisite(Node, Missing),
    \+ satisfied(Missing).
