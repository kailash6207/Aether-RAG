"use client";

import React from "react";
import { X, FileText, Database, Sparkles, Hash, Layers, CheckCircle, Search } from "lucide-react";
import { DocumentItem } from "@/types/rag";

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onQueryDocument?: (title: string) => void;
}

export function DocumentDetailModal({
  document,
  isOpen,
  onClose,
  onQueryDocument,
}: DocumentDetailModalProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold truncate max-w-md">
                {document.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {document.category} &bull; {document.sizeKb} KB &bull; {document.uploadedAt}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Dual Vector Metrics (Pink for Dense, Green for Sparse) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dense Embedding Spec (Pink) */}
            <div className="p-4 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/40 dark:bg-pink-950/20 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-pink-700 dark:text-pink-300">
                <span className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  Dense Vector Config
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200 font-semibold">
                  Cosine Distance
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Vector Dimensions: <strong className="font-mono">{document.denseVectorDim}d</strong>
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Model: OpenAI text-embedding-3 / Transformer
              </div>
            </div>

            {/* Sparse Token Index Spec (Green) */}
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase">
                  <Hash className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Sparse Lexical Config
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold">
                  BM25 Inverted
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Unique Tokens: <strong className="font-mono">{document.sparseTokenCount} tokens</strong>
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Tokenizer: Regex Technical Alphanumeric
              </div>
            </div>
          </div>

          {/* Document Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs uppercase font-mono font-semibold text-slate-500">
              Corpus Synthesis & Abstract
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {document.summary}
            </p>
          </div>

          {/* Chunk Partition Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-500">
                Indexed Chunks ({document.chunkCount})
              </span>
              <span className="text-xs font-mono text-slate-400">
                Avg 512 tokens / chunk &bull; 64-token stride
              </span>
            </div>

            <div className="space-y-2">
              {Array.from({ length: Math.min(4, document.chunkCount) }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/40 text-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono text-[10px] flex items-center justify-center shrink-0">
                      #{i + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                      {document.title} - Segment {i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                    <span className="text-pink-600 dark:text-pink-400">1536-d</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="text-emerald-600 dark:text-emerald-400">BM25 Ready</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Active in Qdrant Multi-Vector Collection
          </span>

          <button
            onClick={() => {
              onClose();
              if (onQueryDocument) {
                onQueryDocument(document.title);
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Query this Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
