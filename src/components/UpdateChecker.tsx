import { useEffect, useState } from "react";

type UpdateStatus = "idle" | "checking" | "available" | "downloading" | "done" | "error";

export function UpdateChecker() {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [version, setVersion] = useState("");

  useEffect(() => {
    if (!("__TAURI_INTERNALS__" in window)) return;

    const checkUpdate = async () => {
      try {
        setStatus("checking");
        const { check } = await import("@tauri-apps/plugin-updater");
        const update = await check();
        if (update) {
          setVersion(update.version);
          setStatus("available");
        } else {
          setStatus("idle");
        }
      } catch {
        setStatus("idle");
      }
    };

    const timer = setTimeout(checkUpdate, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdate = async () => {
    try {
      setStatus("downloading");
      const { check } = await import("@tauri-apps/plugin-updater");
      const update = await check();
      if (update) {
        await update.downloadAndInstall();
        setStatus("done");
        const { relaunch } = await import("@tauri-apps/plugin-process");
        await relaunch();
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "idle" || status === "checking") return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-raised border border-border rounded-xl shadow-lg p-4 max-w-xs animate-in fade-in slide-in-from-bottom-2">
      {status === "available" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-ink">
            Mise à jour v{version} disponible
          </p>
          <button
            type="button"
            onClick={handleUpdate}
            className="px-3 py-1.5 bg-accent text-white text-sm rounded-lg hover:bg-accent/90 transition-colors"
          >
            Installer et relancer
          </button>
        </div>
      )}
      {status === "downloading" && (
        <p className="text-sm text-ink-secondary">Téléchargement en cours...</p>
      )}
      {status === "done" && (
        <p className="text-sm text-ink-secondary">Redémarrage...</p>
      )}
      {status === "error" && (
        <div className="flex flex-col gap-1">
          <p className="text-sm text-danger">Erreur de mise à jour</p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-xs text-ink-muted hover:text-ink"
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
