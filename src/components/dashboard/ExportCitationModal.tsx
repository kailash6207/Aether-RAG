"use client";

import React, { useState } from "react";
import { X, Copy, Check, FileDown, BookOpen } from "lucide-react";
import { RetrievedChunk } from "@/types/rag";

interface ExportCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  answer: string;
  sources: RetrievedChunk[];
}

export function ExportCitationModal({
  isOpen,
  onClose,
  query,
  answer,
  sources,
}: ExportCitationModalProps) {
  const [format, setFormat] = useState<"markdown" | "bibtex" | "json">("markdown");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate output text
  let content = "";
  if (format === "markdown") {
    content = `# Technical Query: ${query}\n\n## Answer\n${answer}\n\n## References & Sources\n`;
    sources.forEach((s, idx) => {
      content += `\n[^${idx + 1}]: **${s.documentTitle}** (${s.section}, ${s.pageOrLine})\n    Match: ${s.matchType} (Dense Cosine: ${(s.denseScore * 100).toFixed(1)}%, BM25: ${s.sparseScore.toFixed(2)})\n    > "${s.content.replace(/\n/g, " ")}"\n`;
    });
  } else if (format === "bibtex") {
    sources.forEach((s, idx) => {
      const cleanId = s.id.replace(/[^a-zA-Z0-9]/g, "_");
      content += `@article{${cleanId},\n  title = {${s.documentTitle}},\n  section = {${s.section}},\n  pages = {${s.pageOrLine}},\n  year = {2026},\n  note = {Retrieved via AETHER Hybrid RAG (Score: ${(s.fusedScore * 100).toFixed(1)}%)}\n}\n\n`;
    });
  } else if (format === "json") {
    content = JSON.stringify(
      {
        query,
        answer,
        retrieved_at: new Date().toISOString(),
        sources: sources.map((s) => ({
          document: s.documentTitle,
          section: s.section,
          page_or_line: s.pageOrLine,
          match_type: s.matchType,
          dense_cosine_score: s.denseScore,
          sparse_bm25_score: s.sparseScore,
          fused_rrf_score: s.fusedScore,
          snippet: s.content,
        })),
      },
      null,
      2
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === "markdown" ? "md" : format === "bibtex" ? "bib" : "json";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aether-rag-citation-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">
                Export Technical Citations & Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate formatted research citations in Markdown, BibTeX, or JSON
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

        {/* Format Selector Pills */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(["markdown", "bibtex", "json"] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase transition-all ${
                  format === fmt
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="p-6 flex-1 overflow-y-auto">
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 selection:bg-sky-500/30">
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}
