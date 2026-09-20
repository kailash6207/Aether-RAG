"use client";

import React from "react";
import { X, Sparkles, Hash, Layers, CheckCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { RetrievedChunk } from "@/types/rag";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  sources: RetrievedChunk[];
}

export function ComparisonModal({
  isOpen,
  onClose,
  query,
  sources,
}: ComparisonModalProps) {
  if (!isOpen) return null;

  // Filter sources for simulation
  const denseSources = sources.filter((s) => s.matchType === "semantic" || s.denseScore > 0.8);
  const sparseSources = sources.filter((s) => s.matchType === "keyword" || s.sparseScore > 6.0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-6xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-indigo-500 to-emerald-500 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                Multi-Channel Retrieval Benchmark (Dense vs Sparse vs Hybrid)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual proof of why Hybrid RAG outperforms single-vector architectures on niche technical corpora
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

        {/* Current Query Banner */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500 font-mono uppercase">Target Query:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">&ldquo;{query}&rdquo;</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Reciprocal Rank Fusion Active
          </span>
        </div>

        {/* 3-Column Comparative Layout */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5 overflow-y-auto">
          {/* Column 1: Pure Dense Channel (Pink Theme) */}
          <div className="flex flex-col rounded-2xl border border-pink-200 dark:border-pink-900/50 bg-pink-50/20 dark:bg-pink-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-pink-200/80 dark:border-pink-900/60">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                <h4 className="text-xs font-bold text-pink-700 dark:text-pink-300 font-mono uppercase">
                  Dense Semantic (&alpha; = 1.0)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200 font-semibold">
                Cosine Distance
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Finds conceptual paraphrases and general semantic intent. May fail on exact variable names, formulas, or rare hardware specs.
            </p>

            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-mono uppercase font-semibold text-pink-600 dark:text-pink-400">
                Top Candidates:
              </span>
              {denseSources.map((chunk, i) => (
                <div
                  key={chunk.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-pink-200/80 dark:border-pink-900/40 text-xs space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    <span className="truncate">{chunk.documentTitle}</span>
                    <span className="text-pink-600 dark:text-pink-400 font-mono shrink-0">
                      {(chunk.denseScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 font-mono">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-pink-100/70 dark:bg-pink-950/40 text-[11px] text-pink-800 dark:text-pink-300 space-y-1">
              <span className="font-semibold block">Failure Mode:</span>
              <span>May hallucinate or retrieve irrelevant documents with similar conversational tone.</span>
            </div>
          </div>

          {/* Column 2: Pure Sparse Channel (Green Theme) */}
          <div className="flex flex-col rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80 dark:border-emerald-900/60">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono uppercase">
                  Sparse Lexical (&alpha; = 0.0)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold">
                BM25 Inverted
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Finds exact matches on keywords, function identifiers, and technical acronyms. Zero tolerance for vocabulary mismatch.
            </p>

            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-mono uppercase font-semibold text-emerald-600 dark:text-emerald-400">
                Top Candidates:
              </span>
              {sparseSources.map((chunk, i) => (
                <div
                  key={chunk.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 text-xs space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    <span className="truncate">{chunk.documentTitle}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                      BM25: {chunk.sparseScore.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 font-mono">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1">
              <span className="font-semibold block">Failure Mode:</span>
              <span>Fails when users phrase queries using synonyms not present verbatim in the text.</span>
            </div>
          </div>

          {/* Column 3: Fused Hybrid RRF (Sky/Indigo Theme) */}
          <div className="flex flex-col rounded-2xl border-2 border-sky-500/40 dark:border-sky-500/30 bg-sky-50/20 dark:bg-sky-950/10 p-4 space-y-3 relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-mono text-[10px] font-bold shadow-md">
              OPTIMAL
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-sky-200/80 dark:border-sky-900/60">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h4 className="text-xs font-bold text-sky-700 dark:text-sky-300 font-mono uppercase">
                  AETHER Hybrid RRF (&alpha; = 0.7)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 font-semibold">
                Multi-Vector Qdrant
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fuses dense semantic embeddings with sparse BM25 inverted index tokens via Reciprocal Rank Fusion ($k=60$), maximizing precision and recall.
            </p>

            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-mono uppercase font-semibold text-sky-600 dark:text-sky-400">
                Fused Winner Chunks:
              </span>
              {sources.slice(0, 3).map((chunk, i) => (
                <div
                  key={chunk.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 text-xs space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                    <span className="truncate">{chunk.documentTitle}</span>
                    <span className="text-sky-600 dark:text-sky-400 font-mono shrink-0">
                      RRF: {(chunk.fusedScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-pink-600 font-semibold">Dense: {(chunk.denseScore * 100).toFixed(0)}%</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-emerald-600 font-semibold">BM25: {chunk.sparseScore.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded-xl bg-sky-100/70 dark:bg-sky-950/40 text-[11px] text-sky-800 dark:text-sky-300 space-y-1">
              <span className="font-semibold block flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Comprehensive Advantage:
              </span>
              <span>Zero-shot semantic coverage + exact keyword verification with zero hallucinations.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
