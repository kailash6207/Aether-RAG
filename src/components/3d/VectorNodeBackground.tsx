"use client";

import dynamic from "next/dynamic";

const VectorNodeCanvas = dynamic(
  () => import("@/components/3d/VectorNodeCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 dark:from-slate-950 dark:via-[#090d16] dark:to-slate-900 -z-10 animate-pulse" />
    ),
  }
);

export default function VectorNodeBackground() {
  return <VectorNodeCanvas />;
}
