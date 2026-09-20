# AETHER Hybrid RAG Backend (Python + FastAPI + Qdrant)

This is the Python FastAPI backend for the **AETHER** Hybrid RAG platform over niche technical corpora.

## Architectural Features
- **Multi-Vector Qdrant Storage**: Stores both 1536-dimensional dense vectors (semantic embeddings) and sparse vectors (BM25 lexical index) within each point payload.
- **Reciprocal Rank Fusion (RRF)**: Merges ranked candidate lists from dense and sparse retrieval channels using $RRF(d) = \sum \frac{w}{60 + rank(d)}$.
- **Dynamic Alpha Tuning ($\alpha$)**: Allows real-time balance between semantic generalization ($\alpha \to 1.0$) and exact keyword precision ($\alpha \to 0.0$).
- **In-Memory & Production Qdrant Support**: Automatically detects if a live Qdrant cluster is reachable; if not, falls back to local in-memory storage for zero-friction local development.

---

## Quickstart

### 1. Create Virtual Environment & Install Dependencies
```bash
cd backend
py -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Optional: Run Qdrant with Docker
To run an external Qdrant instance:
```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v $(pwd)/qdrant_storage:/qdrant/storage:z \
    qdrant/qdrant
```

*(Note: If Docker is not running, the backend automatically uses an embedded in-memory Qdrant instance.)*

### 3. Launch the FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```

The interactive OpenAPI Swagger documentation will be available at:
`http://localhost:8000/docs`

---

## API Endpoints

- `GET /api/health`: Health status and active Qdrant collections.
- `POST /api/documents/upload`: Upload and index technical documents (PDF, Markdown, CUDA, Python).
- `POST /api/hybrid-search`: Execute hybrid search query with alpha weighting, top-k, and source citations.
