import math
import re
from typing import List, Dict, Any, Tuple
import numpy as np
from schemas import ChunkPayload

class HybridRetriever:
    """
    Manages dual-channel dense semantic and sparse BM25 lexical retrieval,
    fusing results using Reciprocal Rank Fusion (RRF) and Alpha weighting.
    """

    def __init__(self, dense_dim: int = 1536):
        self.dense_dim = dense_dim
        # Vocabulary index for sparse token encoding
        self.vocab: Dict[str, int] = {}
        self.doc_freq: Dict[str, int] = {}
        self.total_docs = 0

    def tokenize(self, text: str) -> List[str]:
        """Simple alphanumeric tokenizer suitable for code and technical text."""
        return re.findall(r"[a-zA-Z0-9_\-\$]+", text.lower())

    def compute_dense_embedding(self, text: str) -> List[float]:
        """
        Generates dense vector embedding.
        In production, this calls OpenAI `text-embedding-3-small` or Gemini `text-embedding-004`.
        Here we generate a normalized deterministic vector seeded by text semantics.
        """
        # Deterministic high-dimensional vector simulation based on character n-grams
        vec = np.zeros(self.dense_dim, dtype=np.float32)
        words = self.tokenize(text)
        for i, word in enumerate(words):
            h = hash(word) % self.dense_dim
            vec[h] += 1.0 / (i + 1)

        # L2 Normalization
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()

    def compute_sparse_vector(self, text: str) -> Dict[int, float]:
        """
        Computes sparse lexical vector (indices and weights) for Qdrant sparse vectors.
        """
        tokens = self.tokenize(text)
        term_counts: Dict[str, int] = {}
        for token in tokens:
            term_counts[token] = term_counts.get(token, 0) + 1

        sparse_dict: Dict[int, float] = {}
        for token, count in term_counts.items():
            if token not in self.vocab:
                self.vocab[token] = len(self.vocab)
            token_id = self.vocab[token]
            # TF-IDF / BM25 term weighting approximation
            weight = math.log(1.0 + count) * 1.5
            sparse_dict[token_id] = float(weight)

        return sparse_dict

    def reciprocal_rank_fusion(
        self,
        dense_results: List[Tuple[str, float]],   # [(doc_id, score), ...]
        sparse_results: List[Tuple[str, float]],  # [(doc_id, score), ...]
        alpha: float = 0.7,
        k: int = 60,
    ) -> Dict[str, Dict[str, Any]]:
        """
        Combines ranked lists from dense and sparse retrieval channels.
        Score = alpha * Dense_RRF + (1 - alpha) * Sparse_RRF
        """
        scores: Dict[str, Dict[str, Any]] = {}

        # 1. Score dense candidates
        for rank, (doc_id, dense_score) in enumerate(dense_results):
            rrf_score = 1.0 / (k + rank + 1)
            scores[doc_id] = {
                "dense_rank": rank + 1,
                "dense_score": dense_score,
                "sparse_rank": None,
                "sparse_score": 0.0,
                "dense_rrf": rrf_score,
                "sparse_rrf": 0.0,
            }

        # 2. Score sparse candidates
        for rank, (doc_id, sparse_score) in enumerate(sparse_results):
            rrf_score = 1.0 / (k + rank + 1)
            if doc_id not in scores:
                scores[doc_id] = {
                    "dense_rank": None,
                    "dense_score": 0.0,
                    "sparse_rank": rank + 1,
                    "sparse_score": sparse_score,
                    "dense_rrf": 0.0,
                    "sparse_rrf": rrf_score,
                }
            else:
                scores[doc_id]["sparse_rank"] = rank + 1
                scores[doc_id]["sparse_score"] = sparse_score
                scores[doc_id]["sparse_rrf"] = rrf_score

        # 3. Apply alpha-weighted fusion
        for doc_id, data in scores.items():
            fused = (alpha * data["dense_rrf"]) + ((1.0 - alpha) * data["sparse_rrf"])
            data["fused_score"] = fused

            # Determine dominant match type
            has_dense = data["dense_rank"] is not None
            has_sparse = data["sparse_rank"] is not None

            if has_dense and has_sparse:
                data["match_type"] = "hybrid"
            elif has_dense:
                data["match_type"] = "semantic"
            else:
                data["match_type"] = "keyword"

        return scores
