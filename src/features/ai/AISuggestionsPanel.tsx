import { useState } from "react";
import { Button } from "../../components/ui";
import { useCVStore } from "../../stores/cvStore";
import { useSettingsStore } from "../../stores/settingsStore";
import { createOpenAIProvider } from "./provider";
import { getAISuggestions, getManualSuggestions, type Suggestion } from "./suggestions";

const TYPE_LABELS: Record<string, string> = {
  summary: "Résumé",
  experience: "Expérience",
  skills: "Compétences",
  general: "Général",
};

const TYPE_COLORS: Record<string, string> = {
  summary: "#2e86c1",
  experience: "#148f77",
  skills: "#7d3c98",
  general: "#34495e",
};

export function AISuggestionsPanel() {
  const cv = useCVStore((s) => s.getCurrentCV());
  const aiProvider = useSettingsStore((s) => s.aiProvider);
  const aiApiKey = useSettingsStore((s) => s.aiApiKey);
  const aiBaseUrl = useSettingsStore((s) => s.aiBaseUrl);
  const aiModel = useSettingsStore((s) => s.aiModel);
  const setAIConfig = useSettingsStore((s) => s.setAIConfig);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const [configDraft, setConfigDraft] = useState({
    provider: aiProvider,
    apiKey: aiApiKey,
    baseUrl: aiBaseUrl || "https://api.openai.com/v1",
    model: aiModel || "gpt-4o-mini",
  });

  if (!cv) return null;

  const isAIConfigured = aiProvider !== "none" && aiApiKey;

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      if (isAIConfigured) {
        const provider = createOpenAIProvider(aiApiKey, aiBaseUrl, aiModel);
        const results = await getAISuggestions(cv, provider);
        setSuggestions(results.length > 0 ? results : getManualSuggestions(cv));
      } else {
        setSuggestions(getManualSuggestions(cv));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setSuggestions(getManualSuggestions(cv));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    setAIConfig({
      provider: configDraft.provider,
      apiKey: configDraft.apiKey,
      baseUrl: configDraft.baseUrl,
      model: configDraft.model,
    });
    setShowConfig(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Suggestions IA</h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowConfig(!showConfig)}>
            {isAIConfigured ? "IA configurée" : "Configurer l'IA"}
          </Button>
          <Button size="sm" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyse…" : "Analyser"}
          </Button>
        </div>
      </div>

      {showConfig && (
        <div className="rounded-md border border-border-light bg-raised p-4 flex flex-col gap-3">
          <p className="text-xs text-ink-muted">
            Optionnel — Sans configuration, des suggestions basiques sont générées localement.
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-ink-secondary">
              Fournisseur
              <select
                value={configDraft.provider}
                onChange={(e) => setConfigDraft({ ...configDraft, provider: e.target.value })}
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              >
                <option value="none">Aucun (suggestions locales)</option>
                <option value="openai">OpenAI</option>
                <option value="custom">API compatible OpenAI</option>
              </select>
            </label>
            {configDraft.provider !== "none" && (
              <>
                <label className="text-xs font-medium text-ink-secondary">
                  Clé API
                  <input
                    type="password"
                    value={configDraft.apiKey}
                    onChange={(e) => setConfigDraft({ ...configDraft, apiKey: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
                    placeholder="sk-..."
                  />
                </label>
                {configDraft.provider === "custom" && (
                  <label className="text-xs font-medium text-ink-secondary">
                    URL de base
                    <input
                      type="text"
                      value={configDraft.baseUrl}
                      onChange={(e) => setConfigDraft({ ...configDraft, baseUrl: e.target.value })}
                      className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
                      placeholder="https://api.openai.com/v1"
                    />
                  </label>
                )}
                <label className="text-xs font-medium text-ink-secondary">
                  Modèle
                  <input
                    type="text"
                    value={configDraft.model}
                    onChange={(e) => setConfigDraft({ ...configDraft, model: e.target.value })}
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
                    placeholder="gpt-4o-mini"
                  />
                </label>
              </>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowConfig(false)}>
              Annuler
            </Button>
            <Button size="sm" onClick={handleSaveConfig}>
              Enregistrer
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2">
          <p className="text-xs text-danger">{error}</p>
          <p className="text-xs text-ink-muted mt-1">
            Les suggestions locales ont été utilisées à la place.
          </p>
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-sm text-ink-muted mb-2">
            Cliquez sur « Analyser » pour obtenir des suggestions d'amélioration.
          </p>
          <p className="text-xs text-ink-muted">
            {isAIConfigured
              ? "L'IA analysera votre CV et proposera des améliorations personnalisées."
              : "Sans IA configurée, des conseils basiques seront générés localement."}
          </p>
        </div>
      )}

      {suggestions.map((s) => (
        <div
          key={s.id}
          className="rounded-md border border-border-light bg-raised p-4 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${TYPE_COLORS[s.type]}15`,
                color: TYPE_COLORS[s.type],
              }}
            >
              {TYPE_LABELS[s.type] ?? s.type}
            </span>
          </div>
          <p className="text-sm text-ink">{s.reason}</p>
          {s.original && (
            <div className="text-xs">
              <span className="text-ink-muted">Actuel : </span>
              <span className="text-ink-secondary line-through">{s.original}</span>
            </div>
          )}
          {s.suggested && (
            <div className="text-xs">
              <span className="text-ink-muted">Suggestion : </span>
              <span className="text-ink font-medium">{s.suggested}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
