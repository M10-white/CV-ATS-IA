import { useTranslation } from "react-i18next";
import { Button } from "./ui";

export function AboutModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-raised border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
        <img
          src="/logo.png"
          alt=""
          className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-accent/20"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <h2 className="text-xl font-bold text-ink mb-1">{t("app.name")}</h2>
        <p className="text-xs text-ink-muted mb-4">v0.1.0</p>

        <p className="text-sm text-ink-secondary mb-6">
          {t("about.description")}
        </p>

        <div className="flex flex-col gap-2 mb-6">
          <a
            href="https://github.com/M10-white/CV-ATS-IA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent hover:underline"
          >
            GitHub
          </a>
        </div>

        <p className="text-xs text-ink-muted mb-4">{t("about.madeFor")}</p>

        <Button variant="ghost" onClick={onClose}>
          {t("actions.close")}
        </Button>
      </div>
    </div>
  );
}
