import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Activity, ShieldCheck, Zap, GitBranch, Binary } from 'lucide-react';

interface CodeIntelligenceCoreProps {
  className?: string;
  stage?: number; // 1: SOURCE CODE, 2: AI ANALYSIS, 3: EXECUTION, 4: VISUALIZATION, 5: INSIGHT
  interactive?: boolean;
}

export const CodeIntelligenceCore: React.FC<CodeIntelligenceCoreProps> = ({
  className = '',
  stage = 1,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    // Warm pearl ambient light
    scene.fog = new THREE.FogExp2(0xF7F3EA, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 2. Studio Lighting (Warm, Pearl, Soft Terracotta & Lime highlights)
    const ambientLight = new THREE.AmbientLight(0xFFFDF8, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFEEDD, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const terracottaFill = new THREE.PointLight(0xD85C32, 1.8, 15);
    terracottaFill.position.set(-4, -2, 3);
    scene.add(terracottaFill);

    const limeRimLight = new THREE.DirectionalLight(0xB7D94B, 1.2);
    limeRimLight.position.set(-5, 4, -4);
    scene.add(limeRimLight);

    // 3. Central Translucent Pearl Core Object
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Frosted Pearl Material
    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFFDF8,
      metalness: 0.05,
      roughness: 0.22,
      transmission: 0.65,
      thickness: 1.2,
      transparent: true,
      opacity: 0.92,
      reflectivity: 0.8,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
    });

    // Outer Polyhedral Computational Lattice
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMesh = new THREE.Mesh(coreGeometry, pearlMaterial);
    coreMesh.castShadow = true;
    coreMesh.receiveShadow = true;
    coreGroup.add(coreMesh);

    // Inner Terracotta Wireframe Lattice
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xD85C32,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 1), wireframeMaterial);
    coreGroup.add(innerMesh);

    // Inner Golden Glow Core
    const innerGlowMat = new THREE.MeshStandardMaterial({
      color: 0xF28A3D,
      emissive: 0xD85C32,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const glowCore = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), innerGlowMat);
    coreGroup.add(glowCore);

    // 4. Orbital Ring System (AI Explanation, Complexity, AST, Flowchart)
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const createRing = (radius: number, tube: number, color: number, tiltX: number, tiltY: number) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      ringGroup.add(ring);
      return ring;
    };

    const ring1 = createRing(2.4, 0.015, 0xD85C32, Math.PI / 3, Math.PI / 6); // Terracotta Ring
    const ring2 = createRing(2.9, 0.012, 0xB7D94B, Math.PI / 4, -Math.PI / 4); // Digital Lime Ring
    const ring3 = createRing(3.3, 0.01, 0x6F6A61, -Math.PI / 6, Math.PI / 3); // Warm Charcoal Ring
    const ring4 = createRing(3.7, 0.014, 0xF28A3D, Math.PI / 2.2, 0); // Warm Orange Ring

    // 5. Computational Floating AST Nodes & Particles
    const particleCount = 65;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xD85C32), // Terracotta
      new THREE.Color(0xB7D94B), // Lime
      new THREE.Color(0xF28A3D), // Orange
      new THREE.Color(0x6F6A61), // Warm gray
      new THREE.Color(0xFFFDF8), // Pearl
    ];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 2.2;
      const y = (Math.random() - 0.5) * 3;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const col = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Mouse Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.45;
      targetRotationX = y * 0.35;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle core rotation
      coreGroup.rotation.y += 0.004;
      coreGroup.rotation.x += 0.002;
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      // Pulse inner glow
      glowCore.scale.setScalar(0.95 + Math.sin(elapsed * 2) * 0.08);

      // Rotate orbital rings at varying harmonic speeds
      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.005;
      ring3.rotation.x += 0.004;
      ring4.rotation.y -= 0.007;

      // Rotate particle cloud
      particles.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div className={`relative w-full h-[520px] select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Glass Analysis Card 1: AI Explanation */}
      <div
        onMouseEnter={() => setActiveCard('explanation')}
        onMouseLeave={() => setActiveCard(null)}
        className="absolute top-6 left-4 sm:left-6 pearl-glass p-3.5 rounded-2xl max-w-[210px] space-y-1.5 transition-all duration-300 hover:scale-105 hover:shadow-pearl-lg border border-border-warm"
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -8}px)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase font-bold text-terracotta tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI EXPLANATION
          </span>
          <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
        </div>
        <p className="text-xs text-charcoal font-medium leading-tight">
          "Loop processes each element sequentially."
        </p>
      </div>

      {/* Floating Glass Analysis Card 2: Complexity */}
      <div
        onMouseEnter={() => setActiveCard('complexity')}
        onMouseLeave={() => setActiveCard(null)}
        className="absolute top-10 right-4 sm:right-8 pearl-glass p-3.5 rounded-2xl min-w-[130px] space-y-1 transition-all duration-300 hover:scale-105 hover:shadow-pearl-lg border border-border-warm"
        style={{
          transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 10}px)`,
        }}
      >
        <div className="text-[10px] font-mono uppercase font-bold text-charcoal-muted">
          COMPLEXITY
        </div>
        <div className="text-2xl font-black font-mono text-terracotta flex items-baseline gap-1">
          <span>O(n)</span>
          <span className="text-[10px] text-charcoal-muted font-sans font-normal">Linear</span>
        </div>
      </div>

      {/* Floating Glass Analysis Card 3: Quality Score */}
      <div
        onMouseEnter={() => setActiveCard('quality')}
        onMouseLeave={() => setActiveCard(null)}
        className="absolute bottom-28 left-6 sm:left-10 pearl-glass p-3 rounded-2xl min-w-[140px] space-y-1 transition-all duration-300 hover:scale-105 hover:shadow-pearl-lg border border-border-warm"
        style={{
          transform: `translate(${mousePos.x * -14}px, ${mousePos.y * 12}px)`,
        }}
      >
        <div className="text-[10px] font-mono uppercase font-bold text-charcoal-muted flex items-center justify-between">
          <span>QUALITY</span>
          <span className="px-1.5 py-0.2 rounded bg-lime-soft text-charcoal text-[9px] font-bold">A+</span>
        </div>
        <div className="text-xl font-black font-mono text-charcoal">
          92 <span className="text-xs text-charcoal-muted font-normal">/ 100</span>
        </div>
      </div>

      {/* Floating Glass Analysis Card 4: Bugs / Warnings */}
      <div
        onMouseEnter={() => setActiveCard('bugs')}
        onMouseLeave={() => setActiveCard(null)}
        className="absolute bottom-8 right-8 sm:right-12 pearl-glass p-3 rounded-2xl min-w-[140px] space-y-1 transition-all duration-300 hover:scale-105 hover:shadow-pearl-lg border border-border-warm"
        style={{
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -10}px)`,
        }}
      >
        <div className="text-[10px] font-mono uppercase font-bold text-charcoal-muted flex items-center justify-between">
          <span>BUGS & AUDIT</span>
          <span className="w-1.5 h-1.5 rounded-full bg-lime-digital" />
        </div>
        <div className="text-xs font-bold text-charcoal">
          01 Warning <span className="text-terracotta text-[10px] font-mono block">Bound Check</span>
        </div>
      </div>

      {/* Floating Embedded Abstract Monospace Code Snippet */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pearl-glass px-4 py-2 rounded-xl text-[11px] font-mono text-charcoal-muted border border-border-warm hidden sm:flex items-center gap-3 shadow-pearl-sm"
      >
        <span className="text-terracotta font-bold">fn</span>
        <span>analyze(AST.tree)</span>
        <span className="text-lime-digital">→</span>
        <span className="text-charcoal font-semibold">O(n) Optimal</span>
      </div>
    </div>
  );
};
