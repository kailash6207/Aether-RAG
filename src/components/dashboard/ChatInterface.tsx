"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Sliders,
  Compass,
  GitMerge,
  Bot,
  User,
  Clock,
  ShieldCheck,
  Volume2,
  VolumeX,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { ChatMessage, RAGConfig, RetrievedChunk } from "@/types/rag";
import { CitationCard } from "./CitationCard";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { SAMPLE_PROMPTS, MOCK_KNOWLEDGE_BASE } from "@/data/mockCorpus";

interface ChatInterfaceProps {
  config: RAGConfig;
  onConfigChange: (newConfig: RAGConfig) => void;
  onOpenVectorSpace: (chunks: RetrievedChunk[], query: string) => void;
  onOpenInspector: (data: {
    query: string;
    alpha: number;
    sources: RetrievedChunk[];
    latencyMs: number;
  }) => void;
  onOpenExport: (data: {
    query: string;
    answer: string;
    sources: RetrievedChunk[];
  }) => void;
  onOpenBenchmark: () => void;
}

export function ChatInterface({
  config,
  onConfigChange,
  onOpenVectorSpace,
  onOpenInspector,
  onOpenExport,
  onOpenBenchmark,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      content: `Welcome to **AETHER Hybrid RAG** for Niche Technical Corpora.

This system combines **Dense Vector Search** (deep contextual semantics via transformer embeddings) with **Sparse Lexical Search** (exact token precision via BM25) to provide verifiable, hallucination-free answers over specialized technical documentation.

Select a sample query below or type your own question to inspect how the multi-vector retrieval pipeline fuses candidate documents.`,
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up TTS on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeech = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
    } else {
      window.speechSynthesis.cancel();
      // Clean markdown tags for clear speech
      const cleanText = text.replace(/[#*`_\[\]]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSend = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    setInputQuery("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const startTime = performance.now();

    try {
      let resData = null;
      try {
        const apiRes = await fetch("/api/hybrid-rag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: text,
            alpha: config.alpha,
            topK: config.topK,
            enableReranker: config.enableReranker,
          }),
        });
        if (apiRes.ok) {
          resData = await apiRes.json();
        }
      } catch (err) {
        console.warn("Falling back to client hybrid retrieval engine", err);
      }

      const lower = text.toLowerCase();
      let matchedData = MOCK_KNOWLEDGE_BASE.quantum;

      if (lower.includes("raft") || lower.includes("consensus") || lower.includes("election") || lower.includes("partition")) {
        matchedData = MOCK_KNOWLEDGE_BASE.raft;
      } else if (lower.includes("cuda") || lower.includes("flash") || lower.includes("sram") || lower.includes("gpu") || lower.includes("hopper")) {
        matchedData = MOCK_KNOWLEDGE_BASE.cuda;
      } else if (lower.includes("latency") || lower.includes("order") || lower.includes("matching") || lower.includes("hft") || lower.includes("disruptor")) {
        matchedData = MOCK_KNOWLEDGE_BASE.hft;
      }

      // Filter and score based on alpha
      const weightedSources = (resData?.sources || matchedData.sources).map((s: any) => {
        const denseNorm = s.dense_score ?? s.denseScore;
        const sparseNorm = (s.sparse_score ?? s.sparseScore) / 10;
        const fused = config.alpha * denseNorm + (1 - config.alpha) * sparseNorm;

        let matchType = s.match_type ?? s.matchType;
        if (config.alpha > 0.8) matchType = "semantic";
        else if (config.alpha < 0.3) matchType = "keyword";

        return {
          id: s.id,
          documentId: s.document_id ?? s.documentId,
          documentTitle: s.document_title ?? s.documentTitle,
          section: s.section,
          pageOrLine: s.page_or_line ?? s.pageOrLine,
          content: s.content,
          denseScore: denseNorm,
          sparseScore: s.sparse_score ?? s.sparseScore,
          fusedScore: Number(fused.toFixed(3)),
          matchType,
          matchedTokens: s.matched_tokens ?? s.matchedTokens,
          vectorCoordinates: s.vectorCoordinates,
        };
      });

      const latencyMs = resData?.latency_ms || Math.round(performance.now() - startTime);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        content: resData?.answer || matchedData.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        retrievalMetadata: {
          query: text,
          alpha: config.alpha,
          topK: config.topK,
          latencyMs,
          denseMatchesCount: weightedSources.filter((s: any) => s.matchType === "semantic").length,
          sparseMatchesCount: weightedSources.filter((s: any) => s.matchType === "keyword").length,
          sources: weightedSources.slice(0, config.topK),
          rerankerApplied: config.enableReranker,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputQuery);
    }
  };
  // Sanitize any raw LaTeX math delimiters (e.g. $X$ -> X, $Z$ -> Z, $d^2$ -> d²)
  const formatCleanText = (text: string) => {
    return text
      .replace(/\$([a-zA-Z0-9_\^]+)\$/g, "$1")
      .replace(/\$1\.05\\%\$/g, "1.05%")
      .replace(/\\%/g, "%");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-[#080c14] overflow-hidden">
      {/* Top Hybrid RAG Tuning Bar with Distinct Light Green & Pink Accents */}
      <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Alpha Weighting Slider (BM25 Green <--> Dense Pink) */}
        <div className="flex items-center gap-3 min-w-[310px]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-sky-500" />
            <span>Hybrid Ratio (&alpha;):</span>
          </div>
          <div className="flex-1 flex items-center gap-2">
            {/* Green Lexical Label */}
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40">
              BM25 ({((1 - config.alpha) * 100).toFixed(0)}%)
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.alpha}
              onChange={(e) =>
                onConfigChange({ ...config, alpha: parseFloat(e.target.value) })
              }
              className="w-24 sm:w-28 h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-emerald-400 via-sky-400 to-pink-500 accent-slate-900 dark:accent-white"
              title={`Alpha: ${config.alpha}`}
            />
            {/* Pink Dense Label */}
            <span className="text-[11px] font-mono text-pink-700 dark:text-pink-400 font-semibold px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/40">
              Dense ({(config.alpha * 100).toFixed(0)}%)
            </span>
          </div>
        </div>

        {/* Top-K, Reranker, and Comparison Actions */}
        <div className="flex items-center gap-2 text-xs">
          {/* Channel Benchmark Quick Button */}
          <button
            onClick={onOpenBenchmark}
            className="px-2.5 py-1 rounded-lg border border-pink-200 dark:border-pink-900/60 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 font-medium flex items-center gap-1.5 transition-all hover:bg-pink-100/70"
            title="Open 3-Way Channel Comparison"
          >
            <BarChart3 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span className="hidden sm:inline">Compare Channels</span>
          </button>

          {/* Top-K */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] text-slate-500">Top-K:</span>
            <select
              value={config.topK}
              onChange={(e) =>
                onConfigChange({ ...config, topK: parseInt(e.target.value) })
              }
              className="bg-transparent font-mono text-xs text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>

          {/* Reranker Toggle */}
          <button
            onClick={() =>
              onConfigChange({
                ...config,
                enableReranker: !config.enableReranker,
              })
            }
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              config.enableReranker
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}
            title="Toggle Cross-Encoder Reranker"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reranker: {config.enableReranker ? "ON" : "OFF"}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-4xl mx-auto ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {/* AI Avatar */}
            {msg.sender === "ai" && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            {/* Bubble Container */}
            <div
              className={`space-y-3 max-w-3xl ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`p-4 md:p-5 rounded-2xl transition-all ${
                  msg.sender === "user"
                    ? "bg-slate-900 dark:bg-sky-600 text-white rounded-tr-none shadow-md ml-auto"
                    : "glass-card text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/90 dark:border-slate-800"
                }`}
              >
                {msg.sender === "user" ? (
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {msg.content}
                  </div>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}

                {/* Footer bar with TTS, Copy, Feedback & Timestamp */}
                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.sender === "ai" && (
                    <div className="flex items-center gap-1.5">
                      {/* Text-to-Speech (TTS) Voice playback */}
                      <button
                        onClick={() => handleToggleSpeech(msg.id, msg.content)}
                        className={`p-1 rounded-md transition-colors ${
                          speakingMsgId === msg.id
                            ? "text-pink-600 bg-pink-50 dark:bg-pink-950/40"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                        title={speakingMsgId === msg.id ? "Stop voice audio" : "Listen to response"}
                      >
                        {speakingMsgId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Copy response */}
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title="Copy answer"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Export Citations */}
                      {msg.retrievalMetadata && (
                        <button
                          onClick={() =>
                            onOpenExport({
                              query: msg.retrievalMetadata!.query,
                              answer: msg.content,
                              sources: msg.retrievalMetadata!.sources,
                            })
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-sky-600 transition-colors"
                          title="Export Citations (BibTeX / Markdown)"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Feedback Thumbs */}
                      <button
                        onClick={() =>
                          setFeedbackGiven((prev) => ({ ...prev, [msg.id]: "up" }))
                        }
                        className={`p-1 rounded-md transition-colors ${
                          feedbackGiven[msg.id] === "up"
                            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                        title="Accurate and grounded"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setFeedbackGiven((prev) => ({ ...prev, [msg.id]: "down" }))
                        }
                        className={`p-1 rounded-md transition-colors ${
                          feedbackGiven[msg.id] === "down"
                            ? "text-red-500 bg-red-50 dark:bg-red-950/40"
                            : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                        title="Suboptimal or missing nuance"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Hybrid RAG Sources Attribution Section */}
              {msg.retrievalMetadata && msg.retrievalMetadata.sources.length > 0 && (
                <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md space-y-3 shadow-xs">
                  {/* Sources Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Retrieved Sources ({msg.retrievalMetadata.sources.length})
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {msg.retrievalMetadata.latencyMs}ms
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Open 3D Vector Space Hyperspace modal */}
                      <button
                        onClick={() =>
                          onOpenVectorSpace(
                            msg.retrievalMetadata!.sources,
                            msg.retrievalMetadata!.query
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5 transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>3D Vector Space</span>
                      </button>

                      {/* Open Retrieval Inspector */}
                      <button
                        onClick={() =>
                          onOpenInspector({
                            query: msg.retrievalMetadata!.query,
                            alpha: msg.retrievalMetadata!.alpha,
                            sources: msg.retrievalMetadata!.sources,
                            latencyMs: msg.retrievalMetadata!.latencyMs,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <GitMerge className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                        <span>Score Inspector</span>
                      </button>

                      {/* Export Citation */}
                      <button
                        onClick={() =>
                          onOpenExport({
                            query: msg.retrievalMetadata!.query,
                            answer: msg.content,
                            sources: msg.retrievalMetadata!.sources,
                          })
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  {/* List of Citation Cards */}
                  <div className="space-y-2">
                    {msg.retrievalMetadata.sources.map((chunk, i) => (
                      <CitationCard key={chunk.id} chunk={chunk} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 flex items-center justify-center text-white shrink-0 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-md animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl glass-card rounded-tl-none flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                Running hybrid dense (1536-d) & sparse (BM25) multi-vector search...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Technical Prompts */}
      <div className="px-4 py-2 bg-transparent max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-pink-600" /> Prompts:
          </span>
          {SAMPLE_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.query)}
              className="shrink-0 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:bg-sky-50 dark:hover:bg-sky-500/15 hover:border-sky-300 text-slate-700 dark:text-slate-300 text-xs transition-colors cursor-pointer shadow-xs"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <textarea
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a technical question over the indexed corpus (e.g. rotated surface code thresholds, Raft leader invariants...)"
            rows={1}
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 resize-none transition-all shadow-inner"
          />
          <button
            onClick={() => handleSend(inputQuery)}
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white transition-all shadow-md cursor-pointer"
            title="Execute Hybrid Search"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
