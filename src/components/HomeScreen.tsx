import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../stores/cvStore";
import { useSettingsStore } from "../stores/settingsStore";
import { Button } from "./ui";

function parseTextToCV(text: string): {
  profile: { firstName: string; lastName: string; email: string; phone: string; summary: string };
} {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  let firstName = "";
  let lastName = "";
  let email = "";
  let phone = "";
  const summaryLines: string[] = [];

  for (const line of lines) {
    const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch && !email) {
      email = emailMatch[0];
      continue;
    }
    const phoneMatch = line.match(/(?:\+?\d[\d\s\-.()]{7,})/);
    if (phoneMatch && !phone) {
      phone = phoneMatch[0].trim();
      continue;
    }
    if (!firstName && !line.includes("@") && line.length < 50) {
      const parts = line.split(/\s+/);
      firstName = parts[0] ?? "";
      lastName = parts.slice(1).join(" ");
      continue;
    }
    summaryLines.push(line);
  }

  return {
    profile: { firstName, lastName, email, phone, summary: summaryLines.slice(0, 10).join("\n") },
  };
}

function Typewriter({ text, delay = 60 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span>
      {displayed}
      <span
        className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle"
        style={{
          animation: done ? "blink 1s step-end infinite" : "none",
          opacity: done ? undefined : 1,
        }}
      />
    </span>
  );
}

function FloatingOrb({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        filter: "blur(60px)",
        opacity: 0.12,
        ...style,
      }}
    />
  );
}

function ActionCard3D({
  icon,
  label,
  sub,
  onClick,
  primary,
  index,
}: {
  icon: string;
  label: string;
  sub: string;
  onClick: () => void;
  primary?: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -20;
    const rotateY = (x - 0.5) * 20;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  }, []);

  const handleLeave = useCallback(() => {
    setTransform("perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative group flex flex-col items-center gap-2.5 px-5 py-6 rounded-2xl border cursor-pointer text-center overflow-hidden"
      style={{
        transform: transform || "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
        transition: transform ? "none" : "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
        transformStyle: "preserve-3d",
        animation: `cardReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${0.6 + index * 0.12}s both`,
        background: primary
          ? "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #000 20%))"
          : undefined,
        backgroundColor: primary ? undefined : "var(--color-raised)",
        borderColor: primary ? "var(--color-accent)" : "var(--color-border-light)",
        boxShadow: primary
          ? "0 8px 32px -4px color-mix(in srgb, var(--color-accent), transparent 65%), 0 0 0 1px color-mix(in srgb, var(--color-accent), transparent 50%)"
          : undefined,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, white, transparent 60%)`,
          opacity: glare.opacity,
          transition: glare.opacity ? "none" : "opacity 0.4s",
        }}
      />
      <span
        className="text-2xl relative z-10"
        style={{
          filter: primary ? "none" : "grayscale(1)",
          transition: "filter 0.3s",
        }}
      >
        {icon}
      </span>
      <span className={`text-sm font-semibold relative z-10 ${primary ? "text-white" : "text-ink"}`}>
        {label}
      </span>
      <span className={`text-[11px] leading-tight relative z-10 ${primary ? "text-white/70" : "text-ink-muted"}`}>
        {sub}
      </span>

      <style>{`
        button:hover span:first-child { filter: grayscale(0) !important; }
        button:hover { border-color: color-mix(in srgb, var(--color-accent), transparent 60%) !important; box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--color-accent), transparent 75%) !important; }
      `}</style>
    </button>
  );
}

function AvatarLogo() {
  return (
    <div
      className="relative"
      style={{
        animation: "logoEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
      }}
    >
      {/* Animated glow ring behind the avatar */}
      <div
        className="absolute -inset-2 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #8b5cf6), var(--color-accent))",
          animation: "avatarRingSpin 4s linear infinite",
          filter: "blur(8px)",
          opacity: 0.4,
        }}
      />
      <div
        className="absolute -inset-1 rounded-full"
        style={{
          background: "conic-gradient(from 180deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #6366f1), var(--color-accent))",
          animation: "avatarRingSpin 3s linear infinite reverse",
          opacity: 0.6,
        }}
      />
      {/* Avatar image */}
      <img
        src="/logo.png"
        alt="Melyha"
        className="relative w-24 h-24 rounded-full object-cover"
        style={{
          border: "3px solid var(--color-raised)",
          boxShadow: "0 8px 30px -8px color-mix(in srgb, var(--color-accent), transparent 40%)",
        }}
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          el.style.display = "none";
          const fallback = el.parentElement?.querySelector(".logo-fallback") as HTMLElement;
          if (fallback) fallback.style.display = "flex";
        }}
      />
      {/* Fallback if image not found */}
      <div
        className="logo-fallback relative w-24 h-24 rounded-full items-center justify-center hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #6366f1 30%))",
          border: "3px solid var(--color-raised)",
          boxShadow: "0 8px 30px -8px color-mix(in srgb, var(--color-accent), transparent 40%)",
        }}
      >
        <span className="text-4xl text-white font-black tracking-tighter">67</span>
      </div>
    </div>
  );
}

export function HomeScreen({ onNewCV }: { onNewCV: () => void }) {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const cvList = useCVStore((s) => s.cvList);
  const selectCV = useCVStore((s) => s.selectCV);
  const deleteCV = useCVStore((s) => s.deleteCV);
  const duplicateCV = useCVStore((s) => s.duplicateCV);
  const importCV = useCVStore((s) => s.importCV);
  const exportCV = useCVStore((s) => s.exportCV);
  const createCV = useCVStore((s) => s.createCV);
  const updateProfile = useCVStore((s) => s.updateProfile);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [hoveredCv, setHoveredCv] = useState<string | null>(null);

  const TEMPLATE_LABELS: Record<string, string> =
    language === "en"
      ? { classic: "Classic", modern: "Modern", minimal: "Minimal", executive: "Executive", creative: "Creative", compact: "Compact" }
      : { classic: "Classique", modern: "Moderne", minimal: "Minimaliste", executive: "Executive", creative: "Créatif", compact: "Compact" };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.txt";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      if (file.name.endsWith(".json")) {
        try {
          const data = JSON.parse(text);
          if (data.meta && data.profile && data.sections) importCV(data);
        } catch { /* invalid */ }
      } else {
        const parsed = parseTextToCV(text);
        createCV();
        setTimeout(() => updateProfile(parsed.profile), 50);
      }
    };
    input.click();
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) return;
    const parsed = parseTextToCV(pasteText);
    createCV();
    setTimeout(() => updateProfile(parsed.profile), 50);
    setShowPasteModal(false);
    setPasteText("");
  };

  const handleExport = (id: string, name: string) => {
    const data = exportCV(id);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "cv"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dateLocale = language === "en" ? "en-US" : "fr-FR";

  return (
    <div className="relative flex flex-col items-center min-h-screen px-6 py-10 overflow-hidden">
      {/* Floating gradient orbs */}
      <FloatingOrb style={{ width: 400, height: 400, top: -100, left: -100, background: "var(--color-accent)", animation: "orbFloat1 20s ease-in-out infinite" }} />
      <FloatingOrb style={{ width: 300, height: 300, bottom: -50, right: -80, background: "var(--color-accent)", animation: "orbFloat2 15s ease-in-out infinite" }} />
      <FloatingOrb style={{ width: 200, height: 200, top: "40%", right: "10%", background: "color-mix(in oklch, var(--color-accent), #6366f1)", animation: "orbFloat3 18s ease-in-out infinite" }} />

      <div className="relative z-10 w-full max-w-xl mt-[6vh]">
        {/* Logo + titre — cinematic entrance */}
        <div className="flex flex-col items-center mb-10">
          <AvatarLogo />

          <h1
            className="text-3xl font-black tracking-tight text-ink mt-4"
            style={{ animation: "titleSlide 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" }}
          >
            {t("app.name")}
          </h1>

          <p
            className="text-xs font-bold tracking-[0.25em] uppercase mt-2"
            style={{
              animation: "taglineFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both",
              background: "linear-gradient(135deg, var(--color-accent), color-mix(in oklch, var(--color-accent), #8b5cf6))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <Typewriter text={t("app.tagline")} delay={50} />
          </p>
        </div>

        {/* Action cards with 3D tilt */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <ActionCard3D
            icon="✦"
            label={t("home.newCv")}
            sub={language === "en" ? "Start fresh" : "Partir de zéro"}
            onClick={onNewCV}
            primary
            index={0}
          />
          <ActionCard3D
            icon="📁"
            label={t("home.importFile")}
            sub="JSON / TXT"
            onClick={handleImport}
            index={1}
          />
          <ActionCard3D
            icon="📋"
            label={t("home.pasteCV")}
            sub={language === "en" ? "Copy-paste text" : "Copier-coller"}
            onClick={() => setShowPasteModal(true)}
            index={2}
          />
        </div>

        {/* CV list with staggered reveal */}
        {cvList.length > 0 && (
          <div style={{ animation: "sectionReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both" }}>
            <div className="flex items-center gap-3 mb-4 px-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-muted">
                {t("home.yourCVs")}
              </p>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              <span
                className="text-[10px] text-accent font-bold bg-accent-dim px-2 py-0.5 rounded-full"
              >
                {cvList.length}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {cvList.map((cv, i) => {
                const name =
                  cv.profile.firstName || cv.profile.lastName
                    ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
                    : t("home.unnamed");
                const initials =
                  (cv.profile.firstName?.[0] ?? "") + (cv.profile.lastName?.[0] ?? "");
                const accentColor = cv.customization?.colors?.accent ?? "#be5985";
                const isHovered = hoveredCv === cv.meta.id;
                return (
                  <div
                    key={cv.meta.id}
                    className="group relative flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer overflow-hidden"
                    style={{
                      animation: `cvItemSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${1.0 + i * 0.08}s both`,
                      background: "var(--color-raised)",
                      border: "1px solid var(--color-border-light)",
                      transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
                      transform: isHovered ? "translateX(4px)" : "translateX(0)",
                      boxShadow: isHovered
                        ? `0 4px 20px -4px color-mix(in srgb, ${accentColor}, transparent 70%), inset 0 0 0 1px color-mix(in srgb, ${accentColor}, transparent 70%)`
                        : "none",
                    }}
                    onClick={() => selectCV(cv.meta.id)}
                    onMouseEnter={() => setHoveredCv(cv.meta.id)}
                    onMouseLeave={() => setHoveredCv(null)}
                    onKeyDown={(e) => { if (e.key === "Enter") selectCV(cv.meta.id); }}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Accent line on left */}
                    <div
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: accentColor,
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? "scaleY(1)" : "scaleY(0.3)",
                      }}
                    />

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold transition-transform duration-300"
                      style={{
                        backgroundColor: accentColor,
                        transform: isHovered ? "scale(1.08) rotate(-2deg)" : "scale(1)",
                      }}
                    >
                      {initials || "CV"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-ink truncate">{name}</p>
                      <p className="text-[11px] text-ink-muted mt-0.5 flex items-center gap-1.5">
                        <span
                          className="inline-block w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-300"
                          style={{
                            backgroundColor: accentColor,
                            transform: isHovered ? "scale(1.5)" : "scale(1)",
                          }}
                        />
                        {TEMPLATE_LABELS[cv.meta.template] ?? cv.meta.template}
                        <span className="text-border">·</span>
                        {new Date(cv.meta.modified).toLocaleDateString(dateLocale)}
                      </p>
                    </div>
                    <div
                      className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleExport(cv.meta.id, name)}
                        className="text-[11px] text-ink-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-surface transition-colors"
                        title={t("actions.export")}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => { const newId = duplicateCV(cv.meta.id); if (newId) selectCV(newId); }}
                        className="text-[11px] text-ink-muted hover:text-ink px-2 py-1 rounded-lg hover:bg-surface transition-colors"
                        title={t("actions.duplicate")}
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        onClick={() => { if (confirm(t("home.deleteConfirm", { name }))) deleteCV(cv.meta.id); }}
                        className="text-[11px] text-ink-muted hover:text-danger px-2 py-1 rounded-lg hover:bg-danger-dim transition-colors"
                        title={t("actions.delete")}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cvList.length === 0 && (
          <div
            className="relative text-center py-14 px-8 rounded-2xl border border-dashed overflow-hidden"
            style={{
              borderColor: "var(--color-border)",
              background: "color-mix(in srgb, var(--color-raised), transparent 50%)",
              backdropFilter: "blur(8px)",
              animation: "sectionReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-dim), color-mix(in srgb, var(--color-accent), transparent 85%))",
                animation: "pulse 3s ease-in-out infinite",
              }}
            >
              <span className="text-2xl text-accent">✦</span>
            </div>
            <p className="text-sm font-medium text-ink-muted">{t("home.noCvs")}</p>
            <p className="text-xs text-ink-muted/70 mt-1">{t("home.firstCVHint")}</p>
          </div>
        )}

        {/* Version */}
        <p
          className="text-center text-[10px] text-ink-muted/50 mt-10 tracking-wide"
          style={{ animation: "taglineFade 1s ease 1.2s both" }}
        >
          v0.1.0
        </p>
      </div>

      {/* Paste modal */}
      {showPasteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ animation: "modalOverlay 0.3s ease both" }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => { setShowPasteModal(false); setPasteText(""); }} />
          <div
            className="relative bg-raised border border-border rounded-2xl shadow-2xl w-full max-w-lg p-6"
            style={{ animation: "modalContent 0.4s cubic-bezier(0.16, 1, 0.3, 1) both" }}
          >
            <h2 className="text-base font-bold text-ink mb-1">{t("home.pasteTitle")}</h2>
            <p className="text-xs text-ink-muted mb-4">{t("home.pasteHint")}</p>
            <textarea
              className="w-full h-44 p-3 rounded-xl border border-border bg-paper text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
              placeholder={t("home.pastePlaceholder")}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => { setShowPasteModal(false); setPasteText(""); }}>
                {t("actions.cancel")}
              </Button>
              <Button onClick={handlePasteImport} disabled={!pasteText.trim()}>
                {t("actions.import")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes logoEntrance {
          0% { opacity: 0; transform: scale(0.3) rotate(-20deg); filter: blur(10px); }
          60% { transform: scale(1.08) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); filter: blur(0); }
        }

        @keyframes avatarRingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes titleSlide {
          0% { opacity: 0; transform: translateY(30px); letter-spacing: 0.3em; filter: blur(6px); }
          100% { opacity: 1; transform: translateY(0); letter-spacing: -0.025em; filter: blur(0); }
        }

        @keyframes taglineFade {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardReveal {
          0% { opacity: 0; transform: perspective(600px) rotateX(15deg) translateY(40px) scale(0.9); }
          100% { opacity: 1; transform: perspective(600px) rotateX(0deg) translateY(0) scale(1); }
        }

        @keyframes sectionReveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes cvItemSlide {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.1); }
          66% { transform: translate(-20px, -15px) scale(0.95); }
        }

        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, -20px) scale(1.15); }
        }

        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-25px, 20px); }
          66% { transform: translate(15px, -30px); }
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes modalOverlay {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes modalContent {
          0% { opacity: 0; transform: scale(0.92) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
