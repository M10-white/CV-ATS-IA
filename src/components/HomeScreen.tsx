import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCVStore } from "../stores/cvStore";
import { Button } from "./ui";

const TEMPLATE_LABELS: Record<string, string> = {
  classic: "Classique",
  modern: "Moderne",
  minimal: "Minimaliste",
  executive: "Executive",
  creative: "Créatif",
  compact: "Compact",
};

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
    profile: {
      firstName,
      lastName,
      email,
      phone,
      summary: summaryLines.slice(0, 10).join("\n"),
    },
  };
}

export function HomeScreen({ onNewCV }: { onNewCV: () => void }) {
  const { t } = useTranslation();
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
          if (data.meta && data.profile && data.sections) {
            importCV(data);
          }
        } catch {
          // invalid JSON
        }
      } else {
        const parsed = parseTextToCV(text);
        createCV();
        setTimeout(() => {
          updateProfile(parsed.profile);
        }, 50);
      }
    };
    input.click();
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) return;
    const parsed = parseTextToCV(pasteText);
    createCV();
    setTimeout(() => {
      updateProfile(parsed.profile);
    }, 50);
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

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="w-full max-w-2xl mt-[12vh]">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink mb-2">{t("app.name")}</h1>
          <p className="text-ink-secondary text-base">{t("app.tagline")}</p>
        </div>

        <div className="flex gap-3 justify-center mb-12">
          <Button size="lg" onClick={onNewCV} className="rounded-xl shadow-sm">
            {t("home.newCv")}
          </Button>
          <Button variant="secondary" size="lg" onClick={handleImport} className="rounded-xl">
            Importer (JSON/TXT)
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setShowPasteModal(true)}
            className="rounded-xl"
          >
            Coller un CV
          </Button>
        </div>

        {cvList.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-4 px-1">
              Tes CV
            </p>
            <div className="flex flex-col gap-3">
              {cvList.map((cv) => {
                const name =
                  cv.profile.firstName || cv.profile.lastName
                    ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
                    : "CV sans nom";
                const initials =
                  (cv.profile.firstName?.[0] ?? "") + (cv.profile.lastName?.[0] ?? "");
                return (
                  <div
                    key={cv.meta.id}
                    className="group flex items-center gap-4 px-5 py-4 bg-raised border border-border-light rounded-2xl hover:border-accent/30 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => selectCV(cv.meta.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") selectCV(cv.meta.id);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-accent">{initials || "CV"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{name}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {TEMPLATE_LABELS[cv.meta.template] ?? cv.meta.template} · Modifié le{" "}
                        {new Date(cv.meta.modified).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div
                      className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleExport(cv.meta.id, name)}
                        className="text-xs text-ink-muted hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-surface transition-colors"
                      >
                        Exporter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newId = duplicateCV(cv.meta.id);
                          if (newId) selectCV(newId);
                        }}
                        className="text-xs text-ink-muted hover:text-ink px-2.5 py-1.5 rounded-lg hover:bg-surface transition-colors"
                      >
                        Dupliquer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Supprimer "${name}" ?`)) deleteCV(cv.meta.id);
                        }}
                        className="text-xs text-danger hover:text-danger/80 px-2.5 py-1.5 rounded-lg hover:bg-danger-dim transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {cvList.length === 0 && (
          <div className="text-center py-16 px-8 rounded-2xl border-2 border-dashed border-border-light">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-accent">+</span>
            </div>
            <p className="text-sm text-ink-muted">{t("home.noCvs")}</p>
            <p className="text-xs text-ink-muted mt-1">Crée ton premier CV en un clic</p>
          </div>
        )}
      </div>

      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-raised border border-border rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold text-ink mb-2">Coller le contenu d'un CV</h2>
            <p className="text-xs text-ink-muted mb-4">
              Colle ici le texte de ton CV — nom, email, téléphone, résumé. On extraira les infos
              automatiquement.
            </p>
            <textarea
              className="w-full h-48 p-3 rounded-xl border border-border bg-paper text-sm text-ink resize-none focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder={
                "Jean Dupont\njean@email.com\n+33 6 12 34 56 78\nDéveloppeur web avec 5 ans d'expérience..."
              }
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowPasteModal(false);
                  setPasteText("");
                }}
              >
                Annuler
              </Button>
              <Button onClick={handlePasteImport} disabled={!pasteText.trim()}>
                Importer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
