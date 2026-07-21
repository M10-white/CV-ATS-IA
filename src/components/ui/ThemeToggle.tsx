import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const { t } = useTranslation();

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";

  const icon = resolvedTheme === "dark" ? "☾" : "☀";
  const label = theme === "system" ? "auto" : "";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-md text-ink-secondary hover:bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      title={t("theme.toggle")}
      aria-label={t("theme.toggle")}
    >
      <span className="text-lg">{icon}</span>
      {label && (
        <span className="absolute bottom-0.5 right-0.5 text-[8px] font-bold uppercase tracking-wide text-ink-muted">
          {label}
        </span>
      )}
    </button>
  );
}
