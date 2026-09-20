from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class ChunkPayload(BaseModel):
    id: str
    document_id: str
    document_title: str
    section: str
    page_or_line: str
    content: str
    dense_score: Optional[float] = None
    sparse_score: Optional[float] = None
    fused_score: Optional[float] = None
    match_type: Literal["semantic", "keyword", "hybrid"] = "hybrid"
    matched_tokens: List[str] = Field(default_factory=list)

class QueryRequest(BaseModel):
    query: str
    alpha: float = Field(default=0.7, ge=0.0, le=1.0, description="0.0 = Pure Sparse BM25, 1.0 = Pure Dense Semantic")
    top_k: int = Field(default=5, ge=1, le=20)
    enable_reranker: bool = True
    collection_name: str = "niche_technical_corpus"

class QueryResponse(BaseModel):
    query: str
    answer: str
    alpha: float
    top_k: int
    latency_ms: float
    sources: List[ChunkPayload]
    dense_matches_count: int
    sparse_matches_count: int
    reranker_applied: bool

class DocumentUploadResponse(BaseModel):
    document_id: str
    filename: str
    chunks_created: int
    dense_vector_dim: int
    status: str
    message: str

class HealthResponse(BaseModel):
    status: str
    qdrant_connected: bool
    collections: List[str]
    version: str
