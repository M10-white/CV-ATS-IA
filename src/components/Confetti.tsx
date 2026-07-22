import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  width: number;
  height: number;
  color: string;
  life: number;
}

const COLORS = [
  "#be5985", "#e879a8", "#f9a8d4", "#8b5cf6", "#a78bfa",
  "#6366f1", "#34d399", "#fbbf24", "#f87171", "#38bdf8",
];

export function Confetti({ active, onDone }: { active: boolean; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 120; i++) {
      const x = canvas.width / 2 + (Math.random() - 0.5) * 200;
      pieces.push({
        x,
        y: canvas.height * 0.3 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 12,
        vy: -8 - Math.random() * 8,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        width: 6 + Math.random() * 6,
        height: 4 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
      });
    }

    let frame = 0;
    let running = true;

    const animate = () => {
      if (!running) return;
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of pieces) {
        p.vy += 0.18;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (frame > 60) p.life -= 0.015;
        if (p.life <= 0) continue;
        alive = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.min(p.life, 1);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }

      if (!alive) {
        onDone();
        return;
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => { running = false; };
  }, [active, onDone]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  );
}
