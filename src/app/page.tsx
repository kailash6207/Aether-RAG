"use client";

import React, { useState, useMemo } from "react";
import VectorNodeBackground from "@/components/3d/VectorNodeBackground";
import { AuthCard } from "@/components/auth/AuthCard";
import { Navbar } from "@/components/Navbar";
import { DocumentSidebar } from "@/components/dashboard/DocumentSidebar";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { CorpusStatsBar } from "@/components/dashboard/CorpusStatsBar";
import { ComparisonModal } from "@/components/dashboard/ComparisonModal";
import { DocumentDetailModal } from "@/components/dashboard/DocumentDetailModal";
import { ExportCitationModal } from "@/components/dashboard/ExportCitationModal";
import { VectorSpaceModal } from "@/components/3d/VectorSpaceModal";
import { RetrievalInspectorModal } from "@/components/dashboard/RetrievalInspectorModal";
import { INITIAL_DOCUMENTS, MOCK_KNOWLEDGE_BASE } from "@/data/mockCorpus";
import { DocumentItem, RAGConfig, RetrievedChunk } from "@/types/rag";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // RAG Pipeline Configuration
  const [ragConfig, setRagConfig] = useState<RAGConfig>({
    alpha: 0.7,
    topK: 5,
    enableReranker: true,
    activeCorpusId: "all",
  });

  // Modal States
  const [vectorSpaceOpen, setVectorSpaceOpen] = useState(false);
  const [activeVectorChunks, setActiveVectorChunks] = useState<RetrievedChunk[]>(
    MOCK_KNOWLEDGE_BASE.quantum.sources
  );
  const [activeQueryText, setActiveQueryText] = useState(
    "Rotated surface code fault-tolerance threshold"
  );

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorData, setInspectorData] = useState<{
    query: string;
    alpha: number;
    sources: RetrievedChunk[];
    latencyMs: number;
  }>({
    query: "Rotated surface code fault-tolerance threshold",
    alpha: 0.7,
    sources: MOCK_KNOWLEDGE_BASE.quantum.sources,
    latencyMs: 124,
  });

  // New Feature Modals
  const [benchmarkOpen, setBenchmarkOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [documentDetailOpen, setDocumentDetailOpen] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportData, setExportData] = useState<{
    query: string;
    answer: string;
    sources: RetrievedChunk[];
  }>({
    query: "Rotated surface code fault-tolerance threshold",
    answer: MOCK_KNOWLEDGE_BASE.quantum.answer,
    sources: MOCK_KNOWLEDGE_BASE.quantum.sources,
  });

  const categories = useMemo(() => {
    return [
      "All",
      "Quantum Systems",
      "Distributed Protocols",
      "CUDA/HPC",
      "Low-Latency FinTech",
    ];
  }, []);

  const filteredDocuments = useMemo(() => {
    if (selectedCategory === "All") return documents;
    return documents.filter((d) => d.category === selectedCategory);
  }, [documents, selectedCategory]);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
  };

  const handleUploadDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSelectDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setDocumentDetailOpen(true);
  };

  const handleOpenVectorSpace = (chunks?: RetrievedChunk[], query?: string) => {
    if (chunks && chunks.length > 0) {
      setActiveVectorChunks(chunks);
    }
    if (query) {
      setActiveQueryText(query);
    }
    setVectorSpaceOpen(true);
  };

  const handleOpenInspector = (data: {
    query: string;
    alpha: number;
    sources: RetrievedChunk[];
    latencyMs: number;
  }) => {
    setInspectorData(data);
    setInspectorOpen(true);
  };

  const handleOpenExport = (data: {
    query: string;
    answer: string;
    sources: RetrievedChunk[];
  }) => {
    setExportData(data);
    setExportOpen(true);
  };

  // If not logged in, render the 3D Landing & Auth Page
  if (!isAuthenticated) {
    return (
      <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Interactive 3D Particle Network / Vector Graph Canvas with Pink & Green Nodes */}
        <VectorNodeBackground />

        {/* Centered Glassmorphic Auth Card */}
        <div className="z-10 w-full flex flex-col items-center">
          <AuthCard onSuccess={handleLoginSuccess} />

          {/* Minimalist Footer */}
          <div className="mt-8 text-center text-xs font-mono text-slate-500 dark:text-slate-400">
            Powered by Next.js &bull; React Three Fiber &bull; Qdrant Multi-Vector &bull; Dense + Sparse Fusion
          </div>
        </div>
      </main>
    );
  }

  // Main Dashboard Post-Login
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100">
      {/* Sticky Top Navigation Bar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenVectorSpace={() => handleOpenVectorSpace()}
        onOpenBenchmark={() => setBenchmarkOpen(true)}
        onLogout={handleLogout}
        isBackendConnected={isBackendConnected}
        onToggleBackendMode={() => setIsBackendConnected(!isBackendConnected)}
      />

      {/* Live Corpus Statistics Ribbon with Pink & Green Platform Badges */}
      <CorpusStatsBar
        totalDocs={documents.length}
        totalChunks={documents.reduce((acc, d) => acc + d.chunkCount, 0)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Main Content Area: Sidebar + Chat Interface */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Document Management Sidebar */}
        <DocumentSidebar
          documents={filteredDocuments}
          onUpload={handleUploadDocument}
          onDelete={handleDeleteDocument}
          onSelectDocument={handleSelectDocument}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Chat / Search Interface */}
        <ChatInterface
          config={ragConfig}
          onConfigChange={setRagConfig}
          onOpenVectorSpace={(chunks, query) => handleOpenVectorSpace(chunks, query)}
          onOpenInspector={handleOpenInspector}
          onOpenExport={handleOpenExport}
          onOpenBenchmark={() => setBenchmarkOpen(true)}
        />
      </div>

      {/* Feature Modal: 3-Way Channel Benchmark (Dense vs Sparse vs Hybrid) */}
      <ComparisonModal
        isOpen={benchmarkOpen}
        onClose={() => setBenchmarkOpen(false)}
        query={activeQueryText}
        sources={activeVectorChunks}
      />

      {/* Feature Modal: Document Chunk & Vector Inspector */}
      <DocumentDetailModal
        document={selectedDocument}
        isOpen={documentDetailOpen}
        onClose={() => setDocumentDetailOpen(false)}
        onQueryDocument={(title) => {
          setActiveQueryText(`Key technical specifications in ${title}`);
        }}
      />

      {/* Feature Modal: Citation & Research Report Exporter */}
      <ExportCitationModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        query={exportData.query}
        answer={exportData.answer}
        sources={exportData.sources}
      />

      {/* 3D Vector Space Hyperspace Modal */}
      <VectorSpaceModal
        isOpen={vectorSpaceOpen}
        onClose={() => setVectorSpaceOpen(false)}
        chunks={activeVectorChunks}
        queryText={activeQueryText}
      />

      {/* Retrieval Inspector Modal */}
      <RetrievalInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        query={inspectorData.query}
        alpha={inspectorData.alpha}
        sources={inspectorData.sources}
        latencyMs={inspectorData.latencyMs}
      />
    </div>
  );
}
