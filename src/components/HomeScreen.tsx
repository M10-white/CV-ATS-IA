import { useTranslation } from "react-i18next";
import { useCVStore } from "../stores/cvStore";
import { Button } from "./ui";

export function HomeScreen({ onNewCV }: { onNewCV: () => void }) {
  const { t } = useTranslation();
  const cvList = useCVStore((s) => s.cvList);
  const selectCV = useCVStore((s) => s.selectCV);
  const deleteCV = useCVStore((s) => s.deleteCV);
  const duplicateCV = useCVStore((s) => s.duplicateCV);
  const importCV = useCVStore((s) => s.importCV);
  const exportCV = useCVStore((s) => s.exportCV);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        const data = JSON.parse(text);
        if (data.meta && data.profile && data.sections) {
          importCV(data);
        }
      } catch {
        // invalid JSON
      }
    };
    input.click();
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-ink">{t("app.name")}</h1>
        <p className="mt-2 text-ink-secondary">{t("app.tagline")}</p>
      </div>

      <div className="flex gap-4">
        <Button size="lg" onClick={onNewCV}>
          {t("home.newCv")}
        </Button>
        <Button variant="secondary" size="lg" onClick={handleImport}>
          Importer un CV
        </Button>
      </div>

      {cvList.length > 0 && (
        <div className="w-full max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
            Vos CV
          </p>
          <div className="flex flex-col gap-2">
            {cvList.map((cv) => {
              const name =
                cv.profile.firstName || cv.profile.lastName
                  ? `${cv.profile.firstName} ${cv.profile.lastName}`.trim()
                  : "CV sans nom";
              return (
                <div
                  key={cv.meta.id}
                  className="flex items-center gap-3 px-4 py-3 bg-surface border border-border-light rounded-lg hover:border-border transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => selectCV(cv.meta.id)}
                    className="flex-1 text-left"
                  >
                    <p className="text-sm font-medium text-ink">{name}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {cv.meta.template} · Modifié le{" "}
                      {new Date(cv.meta.modified).toLocaleDateString("fr-FR")}
                    </p>
                  </button>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleExport(cv.meta.id, name)}
                      className="text-xs text-ink-muted hover:text-ink px-2 py-1"
                      title="Exporter"
                    >
                      JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newId = duplicateCV(cv.meta.id);
                        if (newId) selectCV(newId);
                      }}
                      className="text-xs text-ink-muted hover:text-ink px-2 py-1"
                      title="Dupliquer"
                    >
                      Dupliquer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Supprimer "${name}" ?`)) deleteCV(cv.meta.id);
                      }}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1"
                      title="Supprimer"
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
        <div className="mt-8 text-center">
          <p className="text-sm text-ink-muted">{t("home.noCvs")}</p>
        </div>
      )}
    </div>
  );
}
