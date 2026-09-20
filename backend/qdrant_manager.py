import os
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models as rest
from schemas import ChunkPayload

class QdrantManager:
    """
    Manages Qdrant vector database connection, multi-vector collection setup
    (Dense + Sparse), upsertion, and hybrid retrieval.
    """

    def __init__(
        self,
        url: Optional[str] = None,
        api_key: Optional[str] = None,
        prefer_memory: bool = False,
    ):
        qdrant_url = url or os.getenv("QDRANT_URL", "http://localhost:6333")
        qdrant_key = api_key or os.getenv("QDRANT_API_KEY", None)

        try:
            if prefer_memory:
                self.client = QdrantClient(":memory:")
            else:
                self.client = QdrantClient(url=qdrant_url, api_key=qdrant_key, timeout=3.0)
                # Test connectivity
                self.client.get_collections()
        except Exception:
            # Fallback to local in-memory instance for seamless developer experience
            print("Connecting to Qdrant local in-memory fallback instance...")
            self.client = QdrantClient(":memory:")

    def ensure_collection(self, collection_name: str, dense_dim: int = 1536):
        """
        Creates collection configured for both Dense embeddings (Cosine)
        and Sparse vectors (BM25 token inverted index).
        """
        collections = [c.name for c in self.client.get_collections().collections]
        if collection_name not in collections:
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config={
                    "dense": rest.VectorParams(
                        size=dense_dim,
                        distance=rest.Distance.COSINE,
                    )
                },
                sparse_vectors_config={
                    "sparse": rest.SparseVectorParams(
                        index=rest.SparseIndexParams(
                            on_disk=False,
                        )
                    )
                },
            )
            print(f"Created hybrid multi-vector Qdrant collection: {collection_name}")

    def upsert_chunks(
        self,
        collection_name: str,
        chunks: List[Dict[str, Any]],
        dense_vectors: List[List[float]],
        sparse_vectors: List[Dict[int, float]],
    ):
        """
        Upserts chunk payloads with both dense and sparse representations.
        """
        points = []
        for i, chunk in enumerate(chunks):
            sparse_indices = list(sparse_vectors[i].keys())
            sparse_values = list(sparse_vectors[i].values())

            points.append(
                rest.PointStruct(
                    id=chunk.get("id", str(i)),
                    vector={
                        "dense": dense_vectors[i],
                        "sparse": rest.SparseVector(
                            indices=sparse_indices,
                            values=sparse_values,
                        ),
                    },
                    payload=chunk,
                )
            )

        self.client.upsert(
            collection_name=collection_name,
            points=points,
        )

    def search_dense(
        self,
        collection_name: str,
        query_dense_vector: List[float],
        limit: int = 10,
    ) -> List[Any]:
        return self.client.search(
            collection_name=collection_name,
            query_vector=("dense", query_dense_vector),
            limit=limit,
            with_payload=True,
        )

    def search_sparse(
        self,
        collection_name: str,
        query_sparse_vector: Dict[int, float],
        limit: int = 10,
    ) -> List[Any]:
        sparse_obj = rest.SparseVector(
            indices=list(query_sparse_vector.keys()),
            values=list(query_sparse_vector.values()),
        )
        return self.client.search(
            collection_name=collection_name,
            query_vector=rest.NamedSparseVector(
                name="sparse",
                vector=sparse_obj,
            ),
            limit=limit,
            with_payload=True,
        )
