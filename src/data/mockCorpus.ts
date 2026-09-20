import { DocumentItem, RetrievedChunk } from "@/types/rag";

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-quantum-surface",
    title: "Surface-Code-Quantum-Error-Correction-v2.pdf",
    category: "Quantum Systems",
    fileType: "pdf",
    sizeKb: 1420,
    totalTokens: 18450,
    chunkCount: 36,
    status: "indexed",
    uploadedAt: "2026-09-18 10:14",
    denseVectorDim: 1536,
    sparseTokenCount: 2840,
    summary: "Comprehensive fault-tolerant threshold theorem analysis for rotated surface codes under depolarizing noise models with minimum-weight perfect matching decoders.",
  },
  {
    id: "doc-raft-consensus",
    title: "raft-byzantine-safety-invariants.md",
    category: "Distributed Protocols",
    fileType: "markdown",
    sizeKb: 840,
    totalTokens: 12200,
    chunkCount: 24,
    status: "indexed",
    uploadedAt: "2026-09-19 14:22",
    denseVectorDim: 1536,
    sparseTokenCount: 1950,
    summary: "Formal verification of Raft election safety, log matching invariants, leader completeness, and network partition resilience across distributed quorums.",
  },
  {
    id: "doc-cuda-kernel",
    title: "flash_attention_tensor_core_opt.cu",
    category: "CUDA/HPC",
    fileType: "code",
    sizeKb: 610,
    totalTokens: 9800,
    chunkCount: 19,
    status: "indexed",
    uploadedAt: "2026-09-20 08:05",
    denseVectorDim: 1536,
    sparseTokenCount: 1420,
    summary: "SRAM memory hierarchy tiling and online softmax reduction with warp-level matrix multiply-accumulate (WMMA) primitives on Hopper H100 architectures.",
  },
  {
    id: "doc-hft-engine",
    title: "ultra-low-latency-matching-engine-spec.json",
    category: "Low-Latency FinTech",
    fileType: "code",
    sizeKb: 512,
    totalTokens: 7600,
    chunkCount: 15,
    status: "indexed",
    uploadedAt: "2026-09-20 12:40",
    denseVectorDim: 1536,
    sparseTokenCount: 1180,
    summary: "Lock-free circular ring buffer IPC, cacheline aligned price-time priority limit order book (LOB), and sub-50-nanosecond tick-to-trade kernel bypassing.",
  },
];

export const MOCK_KNOWLEDGE_BASE: Record<
  string,
  {
    answer: string;
    sources: RetrievedChunk[];
  }
> = {
  quantum: {
    answer: `In rotated surface code quantum architectures, the fault-tolerant threshold is approximately **1.05%** under standard depolarizing noise models when decoded via Minimum-Weight Perfect Matching (MWPM) or Union-Find algorithms.

### Key Architectural Mechanisms:
1. **Syndrome Extraction**:
   - **X-stabilizers** detect bit-flip errors (Z errors on physical data qubits).
   - **Z-stabilizers** detect phase-flip errors (X errors on physical data qubits).
2. **Lattice Geometry**:
   - Rotated planar lattices reduce the physical qubit overhead by nearly a factor of 2 compared to unrotated surface codes, requiring **d^2** data qubits for code distance **d**.
3. **Decoders**:
   - Recent neural graph decoders (such as GNN-based belief propagation) achieve near-optimal thresholds while maintaining **O(N log N)** latency suitable for real-time FPGA syndrome processing.`,
    sources: [
      {
        id: "chunk-q1",
        documentId: "doc-quantum-surface",
        documentTitle: "Surface-Code-Quantum-Error-Correction-v2.pdf",
        section: "Section 3.2: Rotated Planar Geometry & Syndrome Cycles",
        pageOrLine: "Page 14, Paras 3-5",
        content:
          "Rotated surface codes achieve fault tolerance by alternating X and Z stabilizer measurements on an array of ancilla qubits. For code distance d = 5, physical error rates below 0.7% guarantee an exponential suppression of logical error rates: P_L ~ A * (p / p_th)^((d+1)/2).",
        matchType: "semantic",
        denseScore: 0.942,
        sparseScore: 4.82,
        fusedScore: 0.915,
        matchedTokens: ["rotated surface codes", "fault tolerance", "stabilizer measurements", "logical error rates"],
        vectorCoordinates: [-1.8, 1.4, 0.6],
      },
      {
        id: "chunk-q2",
        documentId: "doc-quantum-surface",
        documentTitle: "Surface-Code-Quantum-Error-Correction-v2.pdf",
        section: "Section 5.1: Minimum-Weight Perfect Matching (MWPM) Complexity",
        pageOrLine: "Page 27, Eq. 18",
        content:
          "Exact keyword definition: MWPM decoder creates space-time defect graphs G=(V,E) where vertices correspond to non-trivial syndrome measurement outcomes. The Blossom algorithm pairs syndromes in O(V^3) worst-case time.",
        matchType: "keyword",
        denseScore: 0.781,
        sparseScore: 7.95,
        fusedScore: 0.884,
        matchedTokens: ["MWPM decoder", "Blossom algorithm", "syndrome measurement", "defect graphs"],
        vectorCoordinates: [-1.2, 1.9, -0.4],
      },
      {
        id: "chunk-q3",
        documentId: "doc-quantum-surface",
        documentTitle: "Surface-Code-Quantum-Error-Correction-v2.pdf",
        section: "Section 7.4: FPGA Real-time Latency Budget",
        pageOrLine: "Page 42, Table 4",
        content:
          "Hardware constraints dictate that syndrome cycles must execute within the qubit coherence window (~1 microsecond for superconducting transmon architectures). Neural decoders pipelined on UltraScale+ FPGAs yield < 450ns inference.",
        matchType: "hybrid",
        denseScore: 0.896,
        sparseScore: 6.14,
        fusedScore: 0.898,
        matchedTokens: ["FPGA", "syndrome cycles", "coherence window", "superconducting transmon"],
        vectorCoordinates: [-2.1, 0.8, -0.9],
      },
    ],
  },
  raft: {
    answer: `The Raft consensus protocol guarantees **Leader Completeness** and **Election Safety** via its strict term-based epoch counter and randomized election timeouts.

### Invariants Maintained:
1. **Election Safety**: At most one leader can be elected in a given term (enforced via single-vote grants per node per term).
2. **Leader Append-Only**: A leader never overwrites or truncates its own log entries; it only appends new ones.
3. **Log Matching Property**: If two logs contain an entry with the same index and term, they are guaranteed identical up to that index.
4. **Leader Completeness**: If a log entry is committed in a given term, that entry is guaranteed present in the logs of the leaders for all higher-numbered terms.`,
    sources: [
      {
        id: "chunk-r1",
        documentId: "doc-raft-consensus",
        documentTitle: "raft-byzantine-safety-invariants.md",
        section: "§4.1: Election Safety & Quorum Intersections",
        pageOrLine: "Lines 112-148",
        content:
          "Leader Completeness Proof: Any candidate seeking election must receive votes from a majority of the cluster (N/2 + 1). Because committed entries reside on at least a majority of nodes, every valid candidate quorum must intersect with at least one node holding the committed entry.",
        matchType: "semantic",
        denseScore: 0.958,
        sparseScore: 5.41,
        fusedScore: 0.932,
        matchedTokens: ["Leader Completeness", "quorum", "candidate", "majority"],
        vectorCoordinates: [2.1, -0.7, -1.2],
      },
      {
        id: "chunk-r2",
        documentId: "doc-raft-consensus",
        documentTitle: "raft-byzantine-safety-invariants.md",
        section: "§6.3: Network Partitioning Split-Brain Avoidance",
        pageOrLine: "Lines 290-335",
        content:
          "Exact keyword invariant: `RequestVote(term, candidateId, lastLogIndex, lastLogTerm)`. A follower denies its vote if `candidate.lastLogTerm < follower.lastLogTerm` or if terms match but `candidate.lastLogIndex < follower.lastLogIndex`.",
        matchType: "keyword",
        denseScore: 0.742,
        sparseScore: 8.65,
        fusedScore: 0.891,
        matchedTokens: ["RequestVote", "lastLogTerm", "lastLogIndex", "follower"],
        vectorCoordinates: [1.8, -1.4, -0.5],
      },
    ],
  },
  cuda: {
    answer: `In modern GPU architectures (NVIDIA Hopper H100 / Blackwell), **FlashAttention** achieves near-optimal memory bandwidth efficiency by tiling computation across high-speed on-chip **Shared Memory (SRAM)**, avoiding costly round-trips to High Bandwidth Memory (HBM).

- **Tiling (Br x Bc)**: Matrix blocks of Query (Q), Key (K), and Value (V) are loaded incrementally into SRAM.
- **Online Softmax**: Normalization statistics are tracked incrementally via running softmax accumulators.
- **Asynchronous Data Transfers (cuda::memcpy_async)**: Tensor Memory Accelerator (TMA) enables warp-level asynchronous bulk copies directly from HBM to shared memory without consuming register files.`,
    sources: [
      {
        id: "chunk-c1",
        documentId: "doc-cuda-kernel",
        documentTitle: "flash_attention_tensor_core_opt.cu",
        section: "Kernel: __global__ void flash_fwd_kernel_tiled()",
        pageOrLine: "Lines 85-132",
        content:
          "Tile sizes Br = 64, Bc = 64. Outer loop iterates over K, V blocks while inner warp calculates Q @ K^T using wmma::mma_sync. Online softmax scales intermediate accumulator using __expf(old_max - new_max).",
        matchType: "hybrid",
        denseScore: 0.931,
        sparseScore: 8.12,
        fusedScore: 0.945,
        matchedTokens: ["flash_fwd_kernel_tiled", "wmma::mma_sync", "online softmax", "SRAM"],
        vectorCoordinates: [0.3, -1.8, 1.4],
      },
      {
        id: "chunk-c2",
        documentId: "doc-cuda-kernel",
        documentTitle: "flash_attention_tensor_core_opt.cu",
        section: "Header: TMA Asynchronous Pipeline Setup",
        pageOrLine: "Lines 18-42",
        content:
          "Hopper Tensor Memory Accelerator (TMA) bypasses registers entirely: cuda::barrier<cuda::thread_scope_block> barrier; cuda::memcpy_async(smem_ptr, gmem_tensor_map, barrier);",
        matchType: "keyword",
        denseScore: 0.765,
        sparseScore: 9.34,
        fusedScore: 0.902,
        matchedTokens: ["TMA", "memcpy_async", "Hopper", "smem_ptr"],
        vectorCoordinates: [0.8, -1.2, 0.9],
      },
    ],
  },
  hft: {
    answer: `The ultra-low-latency order matching engine utilizes a **lock-free single-writer principle (LMAX Disruptor pattern)** paired with CPU core pinning and kernel-bypassing network cards (Solarflare OpenOnload).

### Micro-Architecture Highlights:
1. **Cacheline Aligned Ring Buffer**: Eliminates false sharing by padding ring slots to 64 bytes (alignas(64)).
2. **BBO & Depth Representation**: Price-time priority arrays represented via unrolled fixed-size circular price levels with O(1) limit order insertion and cancellation.
3. **Tick-to-Trade Latency**: Deterministic 99.99th percentile tick-to-trade latency under **48 nanoseconds** on dedicated AMD EPYC / Intel Xeon overclocked cores.`,
    sources: [
      {
        id: "chunk-h1",
        documentId: "doc-hft-engine",
        documentTitle: "ultra-low-latency-matching-engine-spec.json",
        section: "Architecture Spec: LockFreeRingBuffer.hpp",
        pageOrLine: "JSON key: ring_buffer_ipc_spec",
        content:
          "Lock-free sequence tracking: atomic<uint64_t> cursor with memory_order_release on write and memory_order_acquire on reader polling. Zero heap allocation during live trading state.",
        matchType: "semantic",
        denseScore: 0.927,
        sparseScore: 6.78,
        fusedScore: 0.912,
        matchedTokens: ["lock-free", "memory_order_release", "ring buffer", "zero heap"],
        vectorCoordinates: [-0.9, -1.9, -1.3],
      },
      {
        id: "chunk-h2",
        documentId: "doc-hft-engine",
        documentTitle: "ultra-low-latency-matching-engine-spec.json",
        section: "Hardware Acceleration: NIC Solarflare Kernel Bypass",
        pageOrLine: "JSON key: onload_ef_vi_zero_copy",
        content:
          "EF_VI direct DMA buffer mapping into user-space virtual addresses. Bypasses Linux TCP/IP network stack entirely, slicing 8 microseconds down to 420 nanoseconds for raw Ethernet frame ingestion.",
        matchType: "keyword",
        denseScore: 0.792,
        sparseScore: 8.91,
        fusedScore: 0.895,
        matchedTokens: ["EF_VI", "DMA buffer", "kernel bypass", "Ethernet frame"],
        vectorCoordinates: [-1.4, -1.3, -1.8],
      },
    ],
  },
};

export const SAMPLE_PROMPTS = [
  {
    title: "Quantum Error Thresholds",
    query: "What is the fault-tolerant threshold for rotated surface codes under depolarizing noise?",
    domain: "Quantum Systems",
    corpusKey: "quantum",
  },
  {
    title: "Raft Leader Completeness",
    query: "Explain how Raft guarantees election safety and leader completeness during network partitions.",
    domain: "Distributed Protocols",
    corpusKey: "raft",
  },
  {
    title: "CUDA FlashAttention SRAM Tiling",
    query: "How does FlashAttention utilize SRAM tiling and online softmax to minimize HBM round-trips?",
    domain: "CUDA/HPC",
    corpusKey: "cuda",
  },
  {
    title: "Lock-Free Matching Engine",
    query: "What lock-free data structures and kernel-bypass methods achieve sub-50ns tick-to-trade latency?",
    domain: "Low-Latency FinTech",
    corpusKey: "hft",
  },
];
