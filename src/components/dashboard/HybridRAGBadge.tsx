"use client";

import React from "react";
import { Sparkles, Hash, Layers } from "lucide-react";
import { MatchType } from "@/types/rag";

interface HybridRAGBadgeProps {
  matchType: MatchType;
  score?: number;
  className?: string;
  size?: "sm" | "md";
}

export function HybridRAGBadge({
  matchType,
  score,
  className = "",
  size = "sm",
}: HybridRAGBadgeProps) {
  const isSm = size === "sm";

  // Semantic Match: Rose / Pink Accent
  if (matchType === "semantic") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all border shadow-xs ${
          isSm ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1"
        } bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800/80 hover:border-pink-400 dark:hover:border-pink-600 ${className}`}
        title="Retrieved via Dense Vector Cosine Similarity"
      >
        <Sparkles className={isSm ? "w-3 h-3 text-pink-600 dark:text-pink-400" : "w-3.5 h-3.5 text-pink-600 dark:text-pink-400"} />
        <span className="font-medium">Semantic (Dense)</span>
        {score !== undefined && (
          <span className="ml-1 font-mono text-[10px] bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200 px-1.5 py-0.5 rounded">
            {(score * 100).toFixed(1)}%
          </span>
        )}
      </span>
    );
  }

  // Exact Keyword Match: Emerald Green Accent
  if (matchType === "keyword") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all border shadow-xs ${
          isSm ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1"
        } bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600 ${className}`}
        title="Retrieved via Sparse Lexical BM25 Keyword Search"
      >
        <Hash className={isSm ? "w-3 h-3 text-emerald-600 dark:text-emerald-400" : "w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400"} />
        <span className="font-medium">Exact (BM25)</span>
        {score !== undefined && (
          <span className="ml-1 font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded">
            BM25: {score.toFixed(2)}
          </span>
        )}
      </span>
    );
  }

  // Hybrid match: Indigo / Sky Accent combining both
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full transition-all border shadow-xs ${
        isSm ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1"
      } bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/80 hover:border-sky-400 dark:hover:border-sky-600 ${className}`}
      title="Retrieved via Reciprocal Rank Fusion of Dense + Sparse results"
    >
      <Layers className={isSm ? "w-3 h-3 text-sky-600 dark:text-sky-400" : "w-3.5 h-3.5 text-sky-600 dark:text-sky-400"} />
      <span className="font-medium">Hybrid Fused</span>
      {score !== undefined && (
        <span className="ml-1 font-mono text-[10px] bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 px-1.5 py-0.5 rounded">
          RRF: {(score * 100).toFixed(1)}%
        </span>
      )}
    </span>
  );
}
