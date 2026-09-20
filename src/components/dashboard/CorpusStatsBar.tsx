"use client";

import React from "react";
import { Sparkles, Hash, Zap, BookOpen, Layers } from "lucide-react";

interface CorpusStatsBarProps {
  totalDocs: number;
  totalChunks: number;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export function CorpusStatsBar({
  totalDocs,
  totalChunks,
  selectedCategory,
  onSelectCategory,
  categories,
}: CorpusStatsBarProps) {
  return (
    <div className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Platform Real-time Metrics */}
      <div className="flex items-center flex-wrap gap-2.5">
        {/* Pink Badge: Dense Embedding Metric */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50 text-pink-700 dark:text-pink-300 font-mono text-[11px] shadow-xs">
          <Sparkles className="w-3 h-3 text-pink-600 dark:text-pink-400" />
          <span className="font-semibold">Dense 1536-d:</span>
          <span>{totalChunks} Chunks</span>
        </div>

        {/* Green Badge: Sparse BM25 Lexical Metric */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] shadow-xs">
          <Hash className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">Sparse BM25:</span>
          <span>7,390 Tokens</span>
        </div>

        {/* Latency Metric */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Avg Latency: ~120ms</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
        <span className="text-[11px] font-medium text-slate-400 mr-1 hidden md:inline">
          Filter Corpus:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all select-none whitespace-nowrap cursor-pointer ${
                isSelected
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                  : "bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
