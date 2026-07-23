import { useEffect, useRef, useState } from "react";
import { CevoryLogo } from "./CevoryLogo";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(onDone, 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number; size: number }[] = [];
    let t = 0;
    let running = true;

    const animate = () => {
      if (!running) return;
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (t % 3 === 0 && particles.length < 60) {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2;
        particles.push({
          x: cx + (Math.random() - 0.5) * 100,
          y: cy + (Math.random() - 0.5) * 100,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue: 330 + Math.random() * 30,
          size: 1 + Math.random() * 2,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.008;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.life * 0.5})`;
        ctx.fill();
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: "var(--color-paper)",
        opacity: phase >= 4 ? 0 : 1,
        transition: "opacity 0.6s ease-in-out",
        pointerEvents: phase >= 4 ? "none" : "auto",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="relative flex flex-col items-center gap-4">
        <div
          className="relative"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "scale(1) rotate(0deg)" : "scale(0.2) rotate(-30deg)",
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <CevoryLogo size={112} className="relative drop-shadow-[0_0_40px_var(--color-accent)]" />
        </div>

        <h1
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            fontSize: "1.8rem",
            fontWeight: 900,
            color: "var(--color-ink)",
            letterSpacing: "-0.03em",
          }}
        >
          Cevory
        </h1>

        <div
          className="flex items-center gap-2"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0) scale(1)" : "translateY(10px) scale(0.95)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="h-px w-8 bg-accent/40" />
          <span
            className="text-[11px] font-bold tracking-[0.25em] uppercase"
            style={{
              background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #8b5cf6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your CV, perfected
          </span>
          <div className="h-px w-8 bg-accent/40" />
        </div>
      </div>
      <style>{`
        @keyframes splashRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
