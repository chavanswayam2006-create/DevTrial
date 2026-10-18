"""
DevTrail AI - Experiment 10: Micro & Small Language Models (Bigram & Trigram)
Demonstrates probabilistic language modeling over a bundled web development text corpus.
Implements:
1. Micro Language Model: Bigram P(w_i | w_{i-1})
2. Small Language Model: Trigram P(w_i | w_{i-2}, w_{i-1}) with backoff
Handles unknown contexts gracefully without calling any external AI APIs.
"""

from collections import defaultdict, Counter
import re
from typing import Dict, List, Any, Tuple, Optional

# Bundled web engineering corpus for local deterministic training
BUNDLED_WEB_DEV_CORPUS = """
Web foundations start with semantic HTML and accessible document structure.
Semantic elements like article, section, header, and nav provide meaning to assistive technologies.
CSS controls the presentation, box model, and responsive layouts across viewports.
Modern CSS features include flexbox, grid, subgrid, container queries, and custom properties.
The CSS cascade resolves specificity conflicts between author styles, user styles, and browser defaults.
JavaScript provides imperative logic, single-threaded execution, and dynamic event-driven behavior.
The JavaScript runtime uses a call stack, microtask queue, macrotask queue, and event loop.
Microtasks like promises and queueMicrotask execute immediately after the current script and before rendering.
Macrotasks like setTimeout, setInterval, and I/O callbacks execute in subsequent event loop cycles.
Closures capture lexical variables from outer scopes, preserving state across asynchronous callbacks.
DOM manipulation enables updating the document tree, listening for click events, and delegating handlers.
Event delegation attaches a single event listener to a parent node, taking advantage of event bubbling.
The fetch API allows client applications to send asynchronous HTTP requests to backend REST servers.
Promises manage asynchronous operations with resolve and reject states, chained via then and catch.
Modern React uses declarative components, virtual DOM reconciliation, and reactive state hooks.
Git manages source control branches, commits, merges, rebases, and team pull request workflows.
Full-stack applications integrate interactive client user interfaces with robust backend APIs.
Testing ensures web applications remain accessible, performant, secure, and bug-free in production.
"""


class NGramLanguageModels:
    def __init__(self, corpus_text: str = BUNDLED_WEB_DEV_CORPUS):
        self.corpus_text = corpus_text
        self.tokens = self._tokenize(corpus_text)
        self.vocabulary = set(self.tokens)
        self.vocab_size = len(self.vocabulary)

        # Count structures
        self.unigram_counts = Counter(self.tokens)
        self.bigram_counts: Dict[str, Counter] = defaultdict(Counter)
        self.trigram_counts: Dict[Tuple[str, str], Counter] = defaultdict(Counter)

        self._train()

    def _tokenize(self, text: str) -> List[str]:
        cleaned = text.lower()
        # Extract word tokens and essential web syntax
        tokens = re.findall(r"\b[a-z0-9_\-]+\b", cleaned)
        return tokens

    def _train(self):
        for i in range(len(self.tokens) - 1):
            w1 = self.tokens[i]
            w2 = self.tokens[i + 1]
            self.bigram_counts[w1][w2] += 1

        for i in range(len(self.tokens) - 2):
            w1 = self.tokens[i]
            w2 = self.tokens[i + 1]
            w3 = self.tokens[i + 2]
            self.trigram_counts[(w1, w2)][w3] += 1

    def predict_bigram(self, prev_word: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Predicts next words given single context word: P(w | prev_word)."""
        w = prev_word.lower().strip()
        if w not in self.bigram_counts:
            # Fallback to top unigrams if word unknown
            top_unigrams = self.unigram_counts.most_common(top_k)
            total = len(self.tokens)
            return [
                {"word": word, "probability": round(count / total, 4), "count": count, "is_fallback": True}
                for word, count in top_unigrams
            ]

        candidates = self.bigram_counts[w]
        total = sum(candidates.values())
        ranked = candidates.most_common(top_k)
        return [
            {"word": word, "probability": round(count / total, 4), "count": count, "is_fallback": False}
            for word, count in ranked
        ]

    def predict_trigram(self, word_minus_2: str, word_minus_1: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Predicts next words given two context words: P(w | w-2, w-1)."""
        w1 = word_minus_2.lower().strip()
        w2 = word_minus_1.lower().strip()

        if (w1, w2) in self.trigram_counts:
            candidates = self.trigram_counts[(w1, w2)]
            total = sum(candidates.values())
            ranked = candidates.most_common(top_k)
            return [
                {"word": word, "probability": round(count / total, 4), "count": count, "is_fallback": False}
                for word, count in ranked
            ]
        else:
            # Backoff to bigram
            return self.predict_bigram(w2, top_k)

    def generate_continuation(
        self,
        prompt: str,
        model_type: str = "trigram",  # 'bigram' | 'trigram'
        max_words: int = 12,
    ) -> Dict[str, Any]:
        """Generates continuation tokens starting from user prompt."""
        input_tokens = self._tokenize(prompt)
        if not input_tokens:
            input_tokens = ["web", "development"]

        generated = list(input_tokens)
        step_log = []

        for _ in range(max_words):
            if model_type == "bigram" or len(generated) < 2:
                prev = generated[-1]
                preds = self.predict_bigram(prev, top_k=3)
                model_used = "Bigram (Micro LM)"
            else:
                w1, w2 = generated[-2], generated[-1]
                preds = self.predict_trigram(w1, w2, top_k=3)
                model_used = "Trigram (Small LM)"

            if not preds:
                break

            # Pick highest probability candidate
            next_token = preds[0]["word"]
            step_log.append({
                "context": generated[-2:] if len(generated) >= 2 else [generated[-1]],
                "model_used": model_used,
                "chosen_word": next_token,
                "probability": preds[0]["probability"],
                "top_candidates": preds,
            })
            generated.append(next_token)

            # Prevent endless loop
            if len(generated) > 2 and generated[-1] == generated[-2] == generated[-3]:
                break

        full_text = " ".join(generated)
        continuation_text = " ".join(generated[len(input_tokens):])

        return {
            "prompt": prompt,
            "model_type": model_type,
            "generated_continuation": continuation_text,
            "full_text": full_text,
            "tokens_generated_count": len(generated) - len(input_tokens),
            "step_log": step_log,
        }


# Global pre-trained instance
NGRAM_MODEL = NGramLanguageModels()


def run_ngram_experiment(
    prompt: str = "JavaScript uses an event",
    model_type: str = "trigram",
    max_tokens: int = 10,
) -> Dict[str, Any]:
    """Runs Experiment 10."""
    p = prompt.strip() if prompt.strip() else "JavaScript event loop"
    gen_result = NGRAM_MODEL.generate_continuation(p, model_type=model_type, max_words=max_tokens)

    # Next-word predictions for immediate cursor
    tokens = NGRAM_MODEL._tokenize(p)
    if len(tokens) >= 2 and model_type == "trigram":
        next_candidates = NGRAM_MODEL.predict_trigram(tokens[-2], tokens[-1], top_k=5)
        context_used = f"'{tokens[-2]} {tokens[-1]}'"
    elif len(tokens) >= 1:
        next_candidates = NGRAM_MODEL.predict_bigram(tokens[-1], top_k=5)
        context_used = f"'{tokens[-1]}'"
    else:
        next_candidates = NGRAM_MODEL.predict_bigram("web", top_k=5)
        context_used = "'web'"

    return {
        "success": True,
        "educational_notice": (
            "EDUCATIONAL NOTICE: These are statistical n-gram language models (Markov chain bigrams and trigrams) "
            "trained on local technical text. They calculate exact conditional frequency distributions without external LLM APIs."
        ),
        "corpus_stats": {
            "total_tokens": len(NGRAM_MODEL.tokens),
            "unique_vocabulary": NGRAM_MODEL.vocab_size,
            "distinct_bigrams": sum(len(v) for v in NGRAM_MODEL.bigram_counts.values()),
            "distinct_trigrams": len(NGRAM_MODEL.trigram_counts),
        },
        "query_context": context_used,
        "model_selected": model_type,
        "next_word_predictions": next_candidates,
        "continuation": gen_result,
        "explanation": (
            f"The {model_type.capitalize()} model conditioned on context {context_used} to compute conditional probability "
            f"P(w_t | context) = Count(context, w_t) / Count(context). "
            f"When an unseen n-gram is encountered, it applies backoff to shorter context windows."
        ),
    }
