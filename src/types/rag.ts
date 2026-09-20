export type MatchType = "semantic" | "keyword" | "hybrid";

export interface RetrievedChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  section: string;
  pageOrLine: string;
  content: string;
  matchType: MatchType;
  denseScore: number;      // e.g. 0.88 - 0.96 cosine similarity
  sparseScore: number;     // e.g. 3.2 - 6.8 BM25 lexical score
  fusedScore: number;      // Reciprocal Rank Fusion / Alpha weighted score
  matchedTokens?: string[];
  vectorCoordinates?: [number, number, number]; // 3D projection for visualization
}

export interface DocumentItem {
  id: string;
  title: string;
  category: "Quantum Systems" | "Distributed Protocols" | "CUDA/HPC" | "Low-Latency FinTech" | "Custom";
  fileType: "pdf" | "markdown" | "code" | "text";
  sizeKb: number;
  totalTokens: number;
  chunkCount: number;
  status: "indexed" | "processing" | "ready";
  uploadedAt: string;
  denseVectorDim: number;
  sparseTokenCount: number;
  summary: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
  retrievalMetadata?: {
    query: string;
    alpha: number;             // Dense (1.0) to Sparse (0.0)
    topK: number;
    latencyMs: number;
    denseMatchesCount: number;
    sparseMatchesCount: number;
    sources: RetrievedChunk[];
    rerankerApplied: boolean;
  };
}

export interface RAGConfig {
  alpha: number; // 0.0 = pure sparse (BM25), 1.0 = pure dense (semantic), default 0.7
  topK: number;
  enableReranker: boolean;
  activeCorpusId: string;
}
