import { useTranslation } from "react-i18next";
import { Button } from "./ui";

interface HomeScreenProps {
  onNewCV: () => void;
}

export function HomeScreen({ onNewCV }: HomeScreenProps) {
  const { t } = useTranslation();

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
        <Button variant="secondary" size="lg" disabled>
          {t("home.openCv")}
        </Button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-ink-muted">{t("home.noCvs")}</p>
      </div>
    </div>
  );
}
