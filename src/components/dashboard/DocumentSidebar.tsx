"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileCode,
  FileText,
  Trash2,
  CheckCircle2,
  Loader2,
  Database,
  Layers,
  Sparkles,
  Server,
  Plus,
  Eye,
  ShieldAlert,
} from "lucide-react";
import { DocumentItem } from "@/types/rag";

interface DocumentSidebarProps {
  documents: DocumentItem[];
  onUpload: (newDoc: DocumentItem) => void;
  onDelete: (id: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function DocumentSidebar({
  documents,
  onUpload,
  onDelete,
  onSelectDocument,
  isOpen,
  onToggle,
}: DocumentSidebarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingStage, setUploadingStage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DANGEROUS_EXTENSIONS = [
    "exe", "dll", "bat", "cmd", "sh", "vbs", "ps1", "scr", "com",
    "pif", "msi", "jar", "hta", "iso", "sys", "wsf", "bin"
  ];
  const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB limit

  const simulateIngestion = (rawFileName: string, fileSize: number) => {
    setSecurityError(null);

    // 1. Sanitize file name to prevent path traversal attacks
    const sanitizedFileName = rawFileName.replace(/[\/\\]/g, "").replace(/\.\./g, "").trim();

    // 2. Validate file extension against malware / executable blacklist
    const ext = sanitizedFileName.split(".").pop()?.toLowerCase() || "";
    if (DANGEROUS_EXTENSIONS.includes(ext)) {
      setSecurityError(`Security Alert: Executable or binary file type (.${ext}) blocked for malware protection.`);
      return;
    }

    // 3. Prevent DoS via excessive file size (Zip bombs / memory exhaustion)
    if (fileSize > MAX_FILE_SIZE_BYTES) {
      setSecurityError(`Security Alert: File exceeds maximum allowed size (25MB) to protect against buffer exhaustion.`);
      return;
    }

    setUploadingStage("Scanning for malware signatures & tokenizing...");
    setUploadProgress(25);

    setTimeout(() => {
      setUploadingStage("Computing 1536-d Dense Embeddings...");
      setUploadProgress(55);

      setTimeout(() => {
        setUploadingStage("Generating BM25 Sparse Inverted Index...");
        setUploadProgress(80);

        setTimeout(() => {
          setUploadingStage("Upserting verified vectors into Qdrant...");
          setUploadProgress(95);

          setTimeout(() => {
            setUploadingStage(null);
            setUploadProgress(0);

            let cat: DocumentItem["category"] = "Custom";
            let ftype: DocumentItem["fileType"] = "text";

            if (ext === "pdf") ftype = "pdf";
            else if (ext === "md") ftype = "markdown";
            else if (ext === "cu" || ext === "cpp" || ext === "py" || ext === "json") ftype = "code";

            const newDoc: DocumentItem = {
              id: `doc-${Date.now()}`,
              title: sanitizedFileName,
              category: cat,
              fileType: ftype,
              sizeKb: Math.max(12, Math.round(fileSize / 1024)),
              totalTokens: Math.floor(Math.random() * 8000 + 3000),
              chunkCount: Math.floor(Math.random() * 18 + 6),
              status: "indexed",
              uploadedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              denseVectorDim: 1536,
              sparseTokenCount: Math.floor(Math.random() * 1200 + 400),
              summary: "Verified and sanitized technical document indexed for hybrid multi-vector retrieval.",
            };

            onUpload(newDoc);
          }, 600);
        }, 800);
      }, 800);
    }, 900);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateIngestion(file.name, file.size);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      simulateIngestion(file.name, file.size);
    }
  };

  const totalChunks = documents.reduce((acc, d) => acc + d.chunkCount, 0);

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-30 w-80 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Niche Corpus
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {documents.length} Docs &bull; {totalChunks} Chunks Indexed
            </p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-colors"
          title="Upload Document"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.md,.txt,.json,.cu,.cpp,.py,.rs"
          className="hidden"
          onChange={handleFileChange}
        />
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all ${
            isDragging
              ? "border-sky-500 bg-sky-500/10 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700/80 hover:border-sky-400/60 bg-slate-50/50 dark:bg-slate-800/30"
          }`}
        >
          <UploadCloud className="w-6 h-6 mx-auto mb-2 text-sky-500" />
          <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
            Drop technical document here
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            PDF, Markdown, C++, CUDA, Python, JSON
          </p>
        </div>

        {/* Malware and File Security Protection Alert */}
        {securityError && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-[11px] text-red-700 dark:text-red-300 flex items-start gap-2 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <span>{securityError}</span>
          </div>
        )}

        {/* Processing Ingestion Progress Bar */}
        {uploadingStage && (
          <div className="mt-3 p-3 rounded-lg bg-sky-500/10 border border-sky-500/20 space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-sky-700 dark:text-sky-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {uploadingStage}
              </span>
              <span className="font-mono text-[10px]">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-sky-950/20 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Indexed Documents
        </div>

        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onSelectDocument(doc)}
            className="group relative p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-all duration-200 hover:border-sky-500/40 hover:shadow-xs cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5">
                  {doc.fileType === "code" ? (
                    <FileCode className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {doc.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-400 font-mono">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.chunkCount} chunks
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDocument(doc);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-sky-600 transition-opacity"
                  title="Inspect Document"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(doc.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-opacity"
                  title="Remove Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Dense & Sparse indexing badges with distinct Pink and Green styling */}
            <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[10px] font-mono">
              <span className="flex items-center gap-1 text-pink-700 dark:text-pink-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Dense: {doc.denseVectorDim}d
              </span>
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sparse: {doc.sparseTokenCount} tk
              </span>
              <span className="text-sky-600 dark:text-sky-400 flex items-center gap-0.5 font-sans font-medium">
                <CheckCircle2 className="w-3 h-3" /> Ready
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Qdrant Cluster Status Footer */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/40 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <Server className="w-3.5 h-3.5 text-sky-500" />
              Qdrant Hybrid Engine
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Collection: niche_vectors</span>
            <span>RRF / HNSW</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
