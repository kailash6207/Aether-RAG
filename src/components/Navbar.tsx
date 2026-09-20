"use client";

import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import {
  Compass,
  Layers,
  LogOut,
  Menu,
  BarChart3,
} from "lucide-react";

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenVectorSpace: () => void;
  onOpenBenchmark: () => void;
  onLogout: () => void;
  isBackendConnected: boolean;
  onToggleBackendMode: () => void;
}

export function Navbar({
  onToggleSidebar,
  onOpenVectorSpace,
  onOpenBenchmark,
  onLogout,
  isBackendConnected,
  onToggleBackendMode,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-xl transition-all">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Mobile Sidebar Toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
            title="Toggle Document Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base text-slate-900 dark:text-slate-100 font-sans">
                  AETHER
                </span>
                <span className="text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  HYBRID RAG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Dense + Sparse Neural Retrieval Engine
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions, Benchmark, Backend Status, 3D Vector Space, Theme Toggle, User */}
        <div className="flex items-center gap-2.5">
          {/* Multi-Channel Benchmark Trigger */}
          <button
            onClick={onOpenBenchmark}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/50 hover:bg-pink-100/60 dark:bg-pink-950/30 dark:hover:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-medium transition-all shadow-xs"
            title="Compare Dense vs Sparse vs Hybrid Retrieval Side-by-Side"
          >
            <BarChart3 className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
            <span>Channel Benchmark</span>
          </button>

          {/* Backend Status Pill (FastAPI vs Standalone Demo) */}
          <button
            onClick={onToggleBackendMode}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              isBackendConnected
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300"
            }`}
            title="Click to toggle FastAPI Server mode vs Built-in Standalone Engine"
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                isBackendConnected ? "bg-emerald-500" : "bg-emerald-500"
              }`}
            />
            <span>
              {isBackendConnected ? "FastAPI: Connected" : "Engine: Qdrant Hybrid"}
            </span>
          </button>

          {/* 3D Vector Space Modal Trigger */}
          <button
            onClick={onOpenVectorSpace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all shadow-xs"
            title="Explore 3D Vector Hyperspace"
          >
            <Compass className="w-4 h-4 text-sky-500" />
            <span className="hidden lg:inline">3D Vector Space</span>
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <ThemeToggle />

          {/* Logout / Switch User */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 text-slate-500 hover:text-red-500 hover:border-red-500/30 transition-all"
            title="Log Out / Return to 3D Landing"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
