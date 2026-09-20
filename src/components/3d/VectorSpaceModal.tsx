"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { X, Sparkles, Hash, Layers, Eye, Maximize2, Compass } from "lucide-react";
import { RetrievedChunk } from "@/types/rag";

interface VectorSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  chunks: RetrievedChunk[];
  queryText?: string;
}

interface NodePoint {
  position: [number, number, number];
  chunk: RetrievedChunk;
  color: string;
}

function VectorClusterScene({
  chunks,
  onHoverChunk,
}: {
  chunks: RetrievedChunk[];
  onHoverChunk: (chunk: RetrievedChunk | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 3D coordinates for chunks
  const nodes = useMemo<NodePoint[]>(() => {
    return chunks.map((chunk, idx) => {
      // Use predefined coordinates or hash-based 3D coordinates
      const coords = chunk.vectorCoordinates || [
        Math.sin(idx * 1.7) * 2.5,
        Math.cos(idx * 2.1) * 2.2,
        Math.sin(idx * 3.4) * 1.8,
      ];

      let color = "#38bdf8"; // hybrid
      if (chunk.matchType === "semantic") color = "#a855f7"; // purple
      if (chunk.matchType === "keyword") color = "#10b981"; // emerald

      return {
        position: coords,
        chunk,
        color,
      };
    });
  }, [chunks]);

  // Ambient background vectors
  const bgVectors = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 150; i++) {
      pts.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
    }
    return new Float32Array(pts);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background ambient vector field */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bgVectors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color="#64748b" transparent opacity={0.3} />
      </points>

      {/* Query Vector Beacon at origin */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 32]} />
        <meshBasicMaterial color="#f59e0b" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Chunk Vector Nodes */}
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverChunk(node.chunk);
            }}
            onPointerOut={() => onHoverChunk(null)}
          >
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.6}
              roughness={0.2}
            />
          </mesh>
          {/* Pulsing Outer Halo */}
          <mesh scale={[1.3, 1.3, 1.3]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.25}
              wireframe
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function VectorSpaceModal({
  isOpen,
  onClose,
  chunks,
  queryText,
}: VectorSpaceModalProps) {
  const [hoveredChunk, setHoveredChunk] = useState<RetrievedChunk | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-5xl h-[80vh] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                3D Vector Hyperspace Projection
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20">
                  Dense + Sparse Manifold
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing Top-{chunks.length} retrieved document chunks relative to current query vector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Query
              </span>
              <span className="flex items-center gap-1 text-violet-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Semantic
              </span>
              <span className="flex items-center gap-1 text-emerald-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Keyword
              </span>
              <span className="flex items-center gap-1 text-sky-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Hybrid
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Canvas Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden">
          <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} />
            <VectorClusterScene
              chunks={chunks}
              onHoverChunk={setHoveredChunk}
            />
          </Canvas>

          {/* Hover Overlay Card */}
          {hoveredChunk && (
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:max-w-md p-4 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur-xl shadow-2xl text-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-xs font-semibold text-sky-400 truncate">
                  {hoveredChunk.documentTitle}
                </div>
                <div className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {hoveredChunk.matchType}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 mb-2">
                {hoveredChunk.section}
              </div>
              <p className="text-xs text-slate-300 line-clamp-3 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                {hoveredChunk.content}
              </p>
              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Dense: {(hoveredChunk.denseScore * 100).toFixed(1)}%</span>
                <span>Sparse BM25: {hoveredChunk.sparseScore.toFixed(2)}</span>
                <span className="text-sky-400">RRF: {(hoveredChunk.fusedScore * 100).toFixed(1)}%</span>
              </div>
            </div>
          )}

          {/* Guidance helper */}
          <div className="absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 backdrop-blur-md">
            Hover over any vector node to inspect chunk metadata and relevance metrics
          </div>
        </div>
      </div>
    </div>
  );
}
