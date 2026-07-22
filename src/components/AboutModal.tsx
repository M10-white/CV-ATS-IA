import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui";

function MiniParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; hue: number }[] = [];
    let running = true;

    const animate = () => {
      if (!running) return;
      ctx.clearRect(0, 0, 400, 400);

      if (particles.length < 30 && Math.random() > 0.7) {
        particles.push({
          x: 200 + (Math.random() - 0.5) * 60,
          y: 200 + (Math.random() - 0.5) * 60,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          life: 1,
          hue: 330 + Math.random() * 40,
        });
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 65%, ${p.life * 0.4})`;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

export function AboutModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [entered, setEntered] = useState(false);
  const [eggClicks, setEggClicks] = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setEntered(true));
  }, []);

  const handleEggClick = () => {
    const next = eggClicks + 1;
    setEggClicks(next);
    if (next >= 3) {
      setSpinning(true);
      setEggClicks(0);
      setTimeout(() => setSpinning(false), 1200);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        opacity: entered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(12px)",
        }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border"
        style={{
          background: "var(--color-raised)",
          borderColor: "var(--color-border)",
          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
          transform: entered ? "scale(1) translateY(0)" : "scale(0.9) translateY(20px)",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Top gradient banner */}
        <div
          className="relative h-32 flex items-center justify-center overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #6366f1 30%))",
          }}
        >
          <MiniParticles active={entered} />
          <div
            className="relative cursor-pointer"
            onClick={handleEggClick}
            style={{
              animation: spinning ? "eggSpin 1.2s cubic-bezier(0.16, 1, 0.3, 1)" : "aboutLogoPulse 3s ease-in-out infinite",
            }}
          >
            <div
              className="absolute -inset-1 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, rgba(255,255,255,0.4), transparent, rgba(255,255,255,0.4))",
                animation: "aboutRingSpin 3s linear infinite",
              }}
            />
            <img
              src="/logo.png"
              alt="Melyha"
              className="relative w-20 h-20 rounded-full object-cover"
              style={{
                border: "3px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = "none";
                const fb = el.parentElement?.querySelector(".about-fb") as HTMLElement;
                if (fb) fb.style.display = "flex";
              }}
            />
            <div
              className="about-fb relative w-20 h-20 rounded-full items-center justify-center hidden"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "3px solid rgba(255,255,255,0.3)",
              }}
            >
              <span className="text-4xl text-white font-black tracking-tighter select-none">67</span>
            </div>
          </div>
        </div>

        <div className="p-6 text-center -mt-4">
          <div
            className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3"
            style={{
              background: "var(--color-accent-dim)",
              color: "var(--color-accent-text)",
            }}
          >
            v0.2.0
          </div>

          <h2 className="text-xl font-black text-ink mb-1">{t("app.name")}</h2>

          <p className="text-sm text-ink-secondary mb-5 leading-relaxed">
            {t("about.description")}
          </p>

          <a
            href="https://github.com/M10-white/CV-ATS-IA"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-ink-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-border-light)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            GitHub
          </a>

          <div className="my-5">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          <p
            className="text-sm font-medium mb-5"
            style={{
              background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #8b5cf6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("about.madeFor")} 💖
          </p>

          <Button variant="ghost" onClick={onClose}>
            {t("actions.close")}
          </Button>
        </div>

        <style>{`
          @keyframes aboutLogoPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes aboutRingSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes eggSpin {
            0% { transform: rotate(0deg) scale(1); }
            30% { transform: rotate(360deg) scale(1.2); }
            60% { transform: rotate(720deg) scale(0.9); }
            100% { transform: rotate(1080deg) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
