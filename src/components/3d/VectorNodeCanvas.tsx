"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "next-themes";

interface ParticleSystemProps {
  isDark: boolean;
}

function VectorGraph({ isDark }: ParticleSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Generate clustered vector nodes with distinct colors (Pink for Semantic, Green for Keyword)
  const { nodePositions, nodeColors, linePositions, originalPositions } = useMemo(() => {
    const nodeCount = 110;
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);
    const orig = new Float32Array(nodeCount * 3);

    // Primary cluster centroids
    const clusters = [
      new THREE.Vector3(-2.2, 1.2, -0.5),  // Cluster A (Pink / Semantic)
      new THREE.Vector3(2.4, -0.8, -1.0),  // Cluster B (Green / Lexical)
      new THREE.Vector3(0.2, -1.5, 1.2),   // Cluster C (Pink / Dense)
      new THREE.Vector3(-1.0, -1.8, -1.5), // Cluster D (Green / Sparse)
    ];

    const pinkColorDark = new THREE.Color("#f472b6");
    const greenColorDark = new THREE.Color("#34d399");
    const pinkColorLight = new THREE.Color("#db2777");
    const greenColorLight = new THREE.Color("#059669");

    for (let i = 0; i < nodeCount; i++) {
      const clusterIdx = i % clusters.length;
      const cluster = clusters[clusterIdx];
      const spread = 2.5;
      const x = cluster.x + (Math.random() - 0.5) * spread;
      const y = cluster.y + (Math.random() - 0.5) * spread;
      const z = cluster.z + (Math.random() - 0.5) * spread;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      orig[i * 3] = x;
      orig[i * 3 + 1] = y;
      orig[i * 3 + 2] = z;

      // Even nodes = Pink (Semantic Dense), Odd nodes = Green (Keyword Sparse)
      const isPinkNode = i % 2 === 0;
      let c: THREE.Color;
      if (isDark) {
        c = isPinkNode ? pinkColorDark : greenColorDark;
      } else {
        c = isPinkNode ? pinkColorLight : greenColorLight;
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    // Connect nodes within a distance threshold
    const lineCoords: number[] = [];
    const threshold = 1.9;

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold) {
          lineCoords.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2],
            positions[j * 3],
            positions[j * 3 + 1],
            positions[j * 3 + 2]
          );
        }
      }
    }

    return {
      nodePositions: positions,
      nodeColors: colors,
      linePositions: new Float32Array(lineCoords),
      originalPositions: orig,
    };
  }, [isDark]);

  // Ambient dust particles
  const ambientParticles = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 22;
      pos[i + 1] = (Math.random() - 0.5) * 22;
      pos[i + 2] = (Math.random() - 0.5) * 16;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow rotation
    groupRef.current.rotation.y += delta * 0.08;
    groupRef.current.rotation.x += delta * 0.03;

    // Smooth subtle mouse responsiveness
    const targetX = state.pointer.x * 0.45;
    const targetY = state.pointer.y * 0.35;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.05
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.05
    );

    // Gently breathe nodes
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.attributes.position;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < posAttr.count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];
        const wave = Math.sin(time * 1.5 + i) * 0.08;

        posAttr.setXYZ(i, ox + wave, oy + wave, oz + wave);
      }
      posAttr.needsUpdate = true;
    }
  });

  const lineColor = isDark ? "#818cf8" : "#94a3b8";
  const ambientColor = isDark ? "#64748b" : "#cbd5e1";

  return (
    <group ref={groupRef}>
      {/* Vector Point Nodes with Pink & Green Vertex Colors */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[nodeColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isDark ? 0.16 : 0.18}
          vertexColors
          transparent
          opacity={isDark ? 0.9 : 0.85}
          sizeAttenuation
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      {/* Sparse Connectivity Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={isDark ? 0.28 : 0.25}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </lineSegments>

      {/* Ambient Embedding Cloud */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ambientParticles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={ambientColor}
          transparent
          opacity={isDark ? 0.35 : 0.22}
          sizeAttenuation
        />
      </points>

      {/* Floating Geometric Cluster Polyhedron (Icosahedron wireframe) */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[3.2, 1]} />
        <meshBasicMaterial
          color={isDark ? "#3b82f6" : "#db2777"}
          wireframe
          transparent
          opacity={isDark ? 0.08 : 0.08}
        />
      </mesh>
    </group>
  );
}

export default function VectorNodeCanvas() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-slate-50 to-emerald-50 dark:from-slate-950 dark:via-[#090d16] dark:to-slate-900 -z-10" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={isDark ? 0.4 : 0.8} />
        <VectorGraph isDark={isDark} />
      </Canvas>
      {/* Vignette Gradient Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_center,transparent_20%,#090d16_85%)]"
            : "bg-[radial-gradient(ellipse_at_center,transparent_20%,#fbfcfe_85%)]"
        }`}
      />
    </div>
  );
}
