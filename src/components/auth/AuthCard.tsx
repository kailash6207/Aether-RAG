"use client";

import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface AuthCardProps {
  onSuccess: (email: string) => void;
}

export function AuthCard({ onSuccess }: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("researcher@deeptech.ai");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email);
    }, 600);
  };

  const handleOAuth = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess(`${provider.toLowerCase()}@authorized.ai`);
    }, 600);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Glow aura behind card */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500/30 via-indigo-500/30 to-purple-500/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 -z-10 animate-pulse" />

      {/* Main Glassmorphic Card */}
      <div className="glass-card rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative overflow-hidden">
        {/* Top bar with theme toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                AETHER
              </h1>
              <p className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-semibold tracking-wide">
                HYBRID RAG // NICHE CORPUS
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>

        {/* Subtitle */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          Sign in to query high-dimensional dense embeddings and sparse keyword indices over specialized technical literature.
        </p>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => handleOAuth("Google")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-xs"
          >
            {/* Google SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuth("GitHub")}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all shadow-xs"
          >
            {/* GitHub SVG */}
            <svg
              className="w-4 h-4 fill-current text-slate-800 dark:text-slate-200"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 uppercase font-mono absolute">
            or continue with email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{isSignUp ? "Create AETHER Account" : "Sign In to Platform"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Instant Guest Demo Mode */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <button
            type="button"
            onClick={() => onSuccess("researcher.guest@aether.ai")}
            className="w-full py-2.5 px-4 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/15 text-sky-700 dark:text-sky-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Instant Demo Access (Explore Pre-loaded Corpora)</span>
          </button>
        </div>

        {/* Toggle sign in / sign up */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Create one"}
          </button>
        </div>

        {/* Feature badge footer */}
        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 text-sky-500" />
            <span>Dense 1536-d</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Sparse BM25</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3 text-violet-500" />
            <span>Qdrant RRF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
