'use client';

/**
 * HeroParticles — lightweight Three.js floating-leaf/particle layer for the Hero.
 *
 * Additive enhancement only:
 *  - Sits BEHIND hero content (the canvas is absolute, z-0, pointer-events:none).
 *  - Soft green particles (#52b788) drifting gently upward + subtle mouse parallax.
 *  - 300 particles on desktop, 150 on mobile (< 768px).
 *  - Respects prefers-reduced-motion (renders nothing).
 *  - Skips gracefully if WebGL is unavailable.
 *  - Disposes geometry/material/renderer on unmount to avoid leaks.
 *
 * Three.js is loaded from the CDN (r134) at runtime, so no build dependency is added.
 */

import { useEffect, useRef } from 'react';

const THREE_CDN =
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';

// Load the CDN script once and reuse the same promise across mounts.
let threeLoader: Promise<any> | null = null;
function loadThree(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if ((window as any).THREE) return Promise.resolve((window as any).THREE);
  if (threeLoader) return threeLoader;

  threeLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${THREE_CDN}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve((window as any).THREE));
      existing.addEventListener('error', reject);
      if ((window as any).THREE) resolve((window as any).THREE);
      return;
    }
    const script = document.createElement('script');
    script.src = THREE_CDN;
    script.async = true;
    script.onload = () => resolve((window as any).THREE);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return threeLoader;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function HeroParticles() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Honor reduced-motion + WebGL availability.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced || !hasWebGL()) return;

    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let frameId = 0;
    let renderer: any;
    let geometry: any;
    let material: any;
    let sprite: any;
    let scene: any;
    let camera: any;
    let points: any;
    let velocities: Float32Array;
    const cleanupFns: Array<() => void> = [];

    // Pointer target for parallax (normalized -1..1), eased toward.
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    loadThree()
      .then((THREE) => {
        if (disposed || !mount) return;

        const isMobile = window.innerWidth < 768;
        const COUNT = isMobile ? 150 : 300;

        const width = mount.clientWidth || window.innerWidth;
        const height = mount.clientHeight || window.innerHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.z = 60;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0); // transparent
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        mount.appendChild(renderer.domElement);

        // Soft round sprite drawn on a canvas (radial gradient) → leaf-ish glow dot.
        const tex = document.createElement('canvas');
        tex.width = 64;
        tex.height = 64;
        const ctx = tex.getContext('2d')!;
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(109, 217, 140, 0.9)');
        grad.addColorStop(0.4, 'rgba(82, 183, 136, 0.55)');
        grad.addColorStop(1, 'rgba(82, 183, 136, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        sprite = new THREE.CanvasTexture(tex);

        // Particle field.
        const positions = new Float32Array(COUNT * 3);
        velocities = new Float32Array(COUNT);
        const spreadX = 120;
        const spreadY = 90;
        for (let i = 0; i < COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * spreadX;
          positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
          velocities[i] = 0.04 + Math.random() * 0.08; // upward drift speed
        }

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positions, 3)
        );

        material = new THREE.PointsMaterial({
          size: isMobile ? 2.2 : 2.8,
          map: sprite,
          color: 0x52b788,
          transparent: true,
          opacity: 0.5,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);

        const topY = spreadY / 2;
        const bottomY = -spreadY / 2;

        const onPointerMove = (e: PointerEvent) => {
          pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
          pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        cleanupFns.push(() =>
          window.removeEventListener('pointermove', onPointerMove)
        );

        const onResize = () => {
          if (!mount || !renderer || !camera) return;
          const w = mount.clientWidth || window.innerWidth;
          const h = mount.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);
        cleanupFns.push(() => window.removeEventListener('resize', onResize));

        const pos = geometry.attributes.position.array as Float32Array;

        const animate = () => {
          frameId = requestAnimationFrame(animate);

          // Upward drift; wrap back to bottom when off the top.
          for (let i = 0; i < COUNT; i++) {
            pos[i * 3 + 1] += velocities[i];
            if (pos[i * 3 + 1] > topY) {
              pos[i * 3 + 1] = bottomY;
              pos[i * 3] = (Math.random() - 0.5) * spreadX;
            }
            // gentle horizontal sway
            pos[i * 3] += Math.sin((pos[i * 3 + 1] + i) * 0.05) * 0.012;
          }
          geometry.attributes.position.needsUpdate = true;

          // Eased mouse parallax — clamp group offset to a small range (±~8 units ≈ ±20px feel).
          eased.x += (pointer.x - eased.x) * 0.05;
          eased.y += (pointer.y - eased.y) * 0.05;
          points.position.x = eased.x * 8;
          points.position.y = -eased.y * 5;
          points.rotation.z += 0.0004;

          renderer.render(scene, camera);
        };
        animate();
      })
      .catch(() => {
        // CDN failed → silently skip the effect; hero remains fully usable.
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      cleanupFns.forEach((fn) => fn());
      try {
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        if (sprite) sprite.dispose();
        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        }
      } catch {
        /* no-op */
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
