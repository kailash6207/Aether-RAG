# AETHER — Hybrid RAG Platform over Niche Technical Corpora

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://kailash6207.github.io/Aether-RAG/)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React Three Fiber](https://img.shields.io/badge/Three.js-R3F-blue?logo=three.js)](https://threejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Multi--Vector-DC2626?logo=qdrant)](https://qdrant.tech/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🌐 **Live Website**: [https://kailash6207.github.io/Aether-RAG/](https://kailash6207.github.io/Aether-RAG/)

A high-performance AI retrieval and research platform built for specialized technical literature. It combines **Dense Transformer Embeddings** (semantic generalization) with **Sparse Lexical Search** (BM25 token precision) using **Qdrant Multi-Vector** storage and **Reciprocal Rank Fusion (RRF)**.

---

## Architecture Overview

```
                      +---------------------------------------------------------+
                      |         Next.js Frontend (React 19 + Tailwind v4)       |
                      |  - Interactive 3D Vector Node Graph (Three.js / R3F)    |
                      |  - Apple / Linear Aesthetic + next-themes (Dark/Light)  |
                      |  - Drag & Drop Multi-stage Ingestion Pipeline           |
                      |  - Real-time Hybrid RAG Chat Interface                  |
                      +----------------------------+----------------------------+
                                                   |
                                           JSON HTTP Request
                                  (/api/hybrid-rag Proxy or Direct)
                                                   |
                                                   v
                      +---------------------------------------------------------+
                      |            Python FastAPI Backend (`backend/`)          |
                      |                                                         |
                      |    +-----------------------+   +---------------------+  |
                      |    | Dense Vector Channel  |   | Sparse BM25 Channel |  |
                      |    | (Transformer Cosine)  |   | (Inverted Lexical)  |  |
                      |    +-----------+-----------+   +----------+----------+  |
                      |                |                          |             |
                      |                +-------------+------------+             |
                      |                              v                          |
                      |       Reciprocal Rank Fusion (RRF) & Alpha Weighting    |
                      |    Score = a*Dense + (1-a)*Sparse + Reranker Scoring    |
                      +----------------------------+----------------------------+
                                                   |
                                                   v
                      +---------------------------------------------------------+
                      |           Qdrant Hybrid Vector Store Engine             |
                      |       - Dense: 1536-dim HNSW Cosine Index               |
                      |       - Sparse: Lexical Token Inverted Index            |
                      |       - Payload: Document Chunks & Section Offsets      |
                      +---------------------------------------------------------+
```

---

## Core Features

- **Interactive 3D Hyperspace Background (Three.js / React Three Fiber)**:
  - Constellation of data vector nodes reacting smoothly to mouse parallax.
  - In **Light Mode**, distinct **Rose Pink** (Dense Semantic) and **Emerald Green** (Sparse Keyword) nodes visually represent the dual retrieval manifold.
- **Dynamic Hybrid Tuning ($\alpha$ Ratio Slider)**:
  - Seamlessly interpolate between **BM25 Lexical ($\alpha = 0.0$)** and **Dense Semantic ($\alpha = 1.0$)** in real time.
- **Multi-Channel Retrieval Benchmark**:
  - Compare Pure Dense vs. Pure Sparse vs. Fused Hybrid side-by-side to visualize hallucination elimination and keyword precision.
- **Document Management & Ingestion Pipeline**:
  - Drag-and-drop ingestion for PDF, Markdown, CUDA (`.cu`), C++, Python, and JSON.
  - Multi-stage pipeline: Text extraction $\to$ 1536-d dense embedding $\to$ BM25 token index $\to$ Qdrant upsert.
- **Deep Document & Chunk Inspector**:
  - Inspect document partitions, vector dimensions, and token frequency metrics.
- **Academic Citation & Research Exporter**:
  - Export answers and citations directly to **BibTeX (`.bib`)**, **Academic Markdown with footnotes**, or **JSON**.
- **Voice Text-to-Speech (TTS)**:
  - Listen to technical answers read aloud using the Web Speech API.
- **OWASP Hardened Security**:
  - Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, anti-malware executable extension blocking, path traversal prevention, and payload size bounds.

---

## Pre-Indexed Niche Corpora

1. **Quantum Systems**: `Surface-Code-Quantum-Error-Correction-v2.pdf` (Rotated planar lattices, syndrome cycles, MWPM decoders).
2. **Distributed Protocols**: `raft-byzantine-safety-invariants.md` (Leader completeness, term epoch safety, quorum intersection).
3. **CUDA / HPC**: `flash_attention_tensor_core_opt.cu` (Hopper TMA async pipeline, SRAM tiling, online softmax).
4. **Low-Latency FinTech**: `ultra-low-latency-matching-engine-spec.json` (Lock-free circular ring buffers, Solarflare kernel bypass).

---

## Getting Started

### 1. Frontend Setup (Next.js)

```bash
# Clone repository
git clone https://github.com/kailash6207/hybrid-rag-niche.git
cd hybrid-rag-niche

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
# Or build and start optimized production server
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)**.

### 2. Python Backend Setup (FastAPI + Qdrant)

```bash
cd backend

# Create virtual environment
py -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload --port 8000
```
Swagger UI documentation will be available at `http://localhost:8000/docs`.

---

## License

MIT License &copy; 2026 AETHER Hybrid RAG Platform.
