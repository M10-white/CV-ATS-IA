import { useCallback, useEffect, useRef, useState } from "react";

const PHRASES = [
  "Tu vas y arriver !",
  "C'est toi la plus forte !",
  "Mode Cevory: ON",
  "Ce job est fait pour toi",
  "Les recruteurs vont t'adorer",
  "Confiance absolue",
  "Boss des entretiens",
  "Ton CV va tout déchirer",
  "Inarrêtable",
  "Le monde du travail n'est pas prêt",
  "Power level: max",
  "Main character energy",
  "Future recrue du mois",
  "CV parfait en vue",
  "Unstoppable",
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export function MotivationalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);
  const [phrase, setPhrase] = useState("");
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.floor((w * h) / 12000);
    particlesRef.current = Array.from({ length: Math.min(count, 80) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.25,
      hue: 330 + Math.random() * 40,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let running = true;
    const animate = () => {
      if (!running) return;
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const force = (180 - dist) / 180;
          p.vx -= (dx / dist) * force * 0.08;
          p.vy -= (dy / dist) * force * 0.08;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${a.hue}, 60%, 65%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = dist < 200 ? (200 - dist) / 200 : 0;
        const finalOpacity = p.opacity + glow * 0.4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + glow * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${finalOpacity})`;
        ctx.fill();

        if (glow > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + glow * 8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, ${glow * 0.1})`;
          ctx.fill();
        }
      }

      if (mouse.x > 0) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        gradient.addColorStop(0, "hsla(340, 70%, 65%, 0.04)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(mouse.x - 200, mouse.y - 200, 400, 400);
      }

      frameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [initParticles]);

  useEffect(() => {
    const showPhrase = () => {
      const next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      setPhrase(next);
      setPosition({ x: 15 + Math.random() * 70, y: 20 + Math.random() * 60 });
      setVisible(true);
      setTimeout(() => setVisible(false), 2200);
    };
    showPhrase();
    const interval = setInterval(showPhrase, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <span
          style={{
            position: "absolute",
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: visible ? 0.06 : 0,
            transition: "opacity 1.2s ease-in-out",
            fontSize: "clamp(1.5rem, 4vw, 3rem)",
            fontWeight: 800,
            color: "var(--color-accent)",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          {phrase}
        </span>
      </div>
    </>
  );
}
