"use client";

import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Target,
  Search,
} from "lucide-react";
import { RetrievedChunk } from "@/types/rag";
import { HybridRAGBadge } from "./HybridRAGBadge";

interface CitationCardProps {
  chunk: RetrievedChunk;
  index: number;
}

export function CitationCard({ chunk, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(chunk.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSemantic = chunk.matchType === "semantic";
  const isKeyword = chunk.matchType === "keyword";

  // Distinct border & ambient styling based on match type
  let borderClass = "border-slate-200/90 dark:border-slate-800/90 hover:border-sky-400/50";
  let bgHoverClass = "hover:bg-slate-50/70 dark:hover:bg-slate-850";
  if (isSemantic) {
    borderClass = "border-pink-200 dark:border-pink-900/50 hover:border-pink-400/80 shadow-xs hover:shadow-pink-500/5";
    bgHoverClass = "hover:bg-pink-50/30 dark:hover:bg-pink-950/20";
  } else if (isKeyword) {
    borderClass = "border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400/80 shadow-xs hover:shadow-emerald-500/5";
    bgHoverClass = "hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20";
  }

  return (
    <div
      className={`rounded-xl border bg-white/80 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden transition-all duration-200 hover:shadow-md ${borderClass}`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer select-none bg-slate-50/50 dark:bg-slate-800/30 transition-colors ${bgHoverClass}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-mono font-medium ${
              isSemantic
                ? "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300"
                : isKeyword
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            [{index + 1}]
          </div>
          <FileText
            className={`w-4 h-4 shrink-0 ${
              isSemantic ? "text-pink-600" : isKeyword ? "text-emerald-600" : "text-sky-500"
            }`}
          />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {chunk.documentTitle}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {chunk.section} &bull; {chunk.pageOrLine}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <HybridRAGBadge
            matchType={chunk.matchType}
            score={
              chunk.matchType === "keyword"
                ? chunk.sparseScore
                : chunk.denseScore
            }
          />
          <button
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Chunk Content & Score Breakdown */}
      {expanded && (
        <div className="p-3.5 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3 bg-white/60 dark:bg-slate-900/40">
          {/* Dual Score Metric Meters: Pink for Dense Semantic & Green for Sparse BM25 */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Dense Cosine Meter (Pink) */}
            <div className="p-2.5 rounded-lg bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/40">
              <div className="flex items-center justify-between text-pink-700 dark:text-pink-300 font-medium">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-pink-600 dark:text-pink-400" /> Dense Cosine
                </span>
                <span className="font-mono font-semibold">{(chunk.denseScore * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-pink-200/70 dark:bg-pink-950/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-pink-500 dark:bg-pink-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, chunk.denseScore * 100)}%` }}
                />
              </div>
            </div>

            {/* Sparse BM25 Meter (Green) */}
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-medium">
                <span className="flex items-center gap-1">
                  <Search className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Sparse BM25
                </span>
                <span className="font-mono font-semibold">{chunk.sparseScore.toFixed(2)}</span>
              </div>
              <div className="w-full bg-emerald-200/70 dark:bg-emerald-950/80 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (chunk.sparseScore / 10) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Matched Keyword Tokens */}
          {chunk.matchedTokens && chunk.matchedTokens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">Matched terms:</span>
              {chunk.matchedTokens.map((token, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                >
                  {token}
                </span>
              ))}
            </div>
          )}

          {/* Raw Chunk Content Preview */}
          <div className="relative group/chunk">
            <pre className="p-3 rounded-lg bg-slate-100/90 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-200 dark:border-slate-800">
              {chunk.content}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-0 group-hover/chunk:opacity-100 transition-opacity text-slate-600 dark:text-slate-300 hover:text-emerald-600"
              title="Copy snippet"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
