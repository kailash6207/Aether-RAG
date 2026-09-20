"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Sanitize any raw math dollar signs and clean up stray characters
  const cleanContent = content
    .replace(/\$([a-zA-Z0-9_\^\-]+)\$/g, "$1")
    .replace(/\$1\.05\\%\$/g, "1.05%")
    .replace(/\\%/g, "%");

  return (
    <div className={`markdown-body text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-3 mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1.5 border-b border-slate-200/60 dark:border-slate-800/60 pb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2.5 mb-1 text-sky-600 dark:text-sky-400">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 leading-relaxed text-slate-800 dark:text-slate-200">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950 dark:text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-slate-700 dark:text-slate-300">
              {children}
            </em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-2.5 space-y-1 text-slate-800 dark:text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-2.5 space-y-1.5 text-slate-800 dark:text-slate-200 font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-mono text-xs border border-slate-200/80 dark:border-slate-700/80"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 my-2 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
