"use client";

import React from "react";
import { X, Cpu, GitMerge, Sliders, ShieldCheck, Zap } from "lucide-react";
import { RetrievedChunk } from "@/types/rag";

interface RetrievalInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  alpha: number;
  sources: RetrievedChunk[];
  latencyMs: number;
}

export function RetrievalInspectorModal({
  isOpen,
  onClose,
  query,
  alpha,
  sources,
  latencyMs,
}: RetrievalInspectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <GitMerge className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                Hybrid RAG Pipeline & Scoring Inspector
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-Vector Dense (Qdrant Cosine) + Sparse (BM25 Lexical) Fusion Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Query & Execution Stats */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-500">
                Analyzed Query
              </span>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                &ldquo;{query}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                Latency: {latencyMs}ms
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                Alpha &alpha;: {alpha.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Fusion Mathematics Graphic */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/5 via-sky-500/5 to-emerald-500/5 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-500" />
              Reciprocal Rank Fusion (RRF) & Hybrid Alpha Weighting
            </h4>
            <div className="p-3 rounded-lg bg-slate-900 text-sky-300 font-mono text-xs overflow-x-auto">
              <code>
                Score(d) = {alpha.toFixed(2)} &times; Normalize(Dense_Cosine(q, d)) + {(1 - alpha).toFixed(2)} &times; Normalize(Sparse_BM25(q, d))
              </code>
              <div className="text-[11px] text-slate-400 mt-1">
                + Reciprocal Rank Fusion: RRF(d) = &sum; [ w_channel / (k + rank_channel(d)) ] with k = 60
              </div>
            </div>
          </div>

          {/* Dual Channel Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dense Channel */}
            <div className="p-4 rounded-xl border border-violet-500/20 bg-violet-500/5 dark:bg-violet-950/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Channel 1: Dense Semantic
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Weight: {(alpha * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Encodes semantic meaning into 1536-dimensional hyper-space vectors via transformer embeddings, matching conceptual synonyms even without keyword overlap.
              </p>
              <div className="text-xs font-mono text-slate-500">
                Metric: Cosine Similarity [-1.0, 1.0]
              </div>
            </div>

            {/* Sparse Channel */}
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Channel 2: Sparse Lexical (BM25)
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Weight: {((1 - alpha) * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Indexes exact code tokens, formulas, function names, and technical terms using term frequency / inverse document frequency (TF-IDF / BM25).
              </p>
              <div className="text-xs font-mono text-slate-500">
                Metric: Okapi BM25 Lexical Score
              </div>
            </div>
          </div>

          {/* Retrieved Chunks Scoring Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-600 dark:text-slate-300">
              Ranked Chunk Candidates
            </h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Document & Section</th>
                    <th className="p-3">Dense Cosine</th>
                    <th className="p-3">Sparse BM25</th>
                    <th className="p-3">Fused RRF</th>
                    <th className="p-3">Match Attribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {sources.map((chunk, i) => (
                    <tr key={chunk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-mono font-medium">#{i + 1}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs">
                          {chunk.documentTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {chunk.section}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-violet-600 dark:text-violet-400">
                        {(chunk.denseScore * 100).toFixed(1)}%
                      </td>
                      <td className="p-3 font-mono text-emerald-600 dark:text-emerald-400">
                        {chunk.sparseScore.toFixed(2)}
                      </td>
                      <td className="p-3 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {(chunk.fusedScore * 100).toFixed(1)}%
                      </td>
                      <td className="p-3">
                        <span className="capitalize text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                          {chunk.matchType}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
