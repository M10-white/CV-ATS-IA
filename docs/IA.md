# Architecture IA

## Principe fondamental

Le logiciel est entièrement fonctionnel sans IA. L'IA enrichit l'expérience ; elle ne la conditionne pas. Aucune fonctionnalité critique ne doit échouer si aucun modèle n'est configuré.

## Cas d'usage

| Fonctionnalité | Avec IA | Sans IA (fallback) |
|---|---|---|
| Reformulation de bullet points | LLM transforme une description en réalisation mesurable | Bibliothèque de verbes d'action + templates de phrases par catégorie |
| Suggestions d'amélioration | Analyse sémantique du contenu | Heuristiques : longueur, verbes passifs, absence de chiffres |
| Adaptation sectorielle | Reformulation ciblée pour un vocabulaire sectoriel | Désactivé |
| Résumé professionnel | Génération d'un paragraphe de synthèse | Désactivé |
| Analyse d'offre d'emploi | Extraction sémantique des compétences et mots-clés | Extraction par regex et patterns de mots-clés courants |

## Interface AIProvider

Tout le code applicatif interagit avec l'IA via cette interface. Il ne sait jamais quel modèle tourne derrière.

```typescript
interface AIProvider {
  readonly name: string
  readonly type: 'local' | 'remote'

  isAvailable(): Promise<boolean>

  complete(request: AIRequest): Promise<AIResponse>

  streamComplete?(request: AIRequest): AsyncIterable<string>
}

interface AIRequest {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

interface AIResponse {
  text: string
  tokensUsed?: number
  durationMs: number
}

interface AIProviderConfig {
  provider: string       // 'ollama' | 'openai-compatible' | 'none'
  baseUrl?: string       // URL du serveur (ex: http://localhost:11434)
  model?: string         // Nom du modèle (ex: llama3.2, mistral)
  apiKey?: string        // Clé API (uniquement pour providers distants)
}
```

## Providers

### Ollama (local)

- **Type** : local
- **URL par défaut** : `http://localhost:11434`
- **Modèles recommandés** : Llama 3.2 (3B), Mistral (7B), Gemma 2 (9B)
- **Avantages** : gratuit, privé, large choix de modèles
- **Pré-requis** : Ollama installé et démarré séparément

### OpenAI-compatible (générique)

- **Type** : local ou remote (selon l'URL)
- **Compatible avec** : LM Studio, LocalAI, vLLM, OpenAI, Mistral API, etc.
- **Avantages** : couvre tout serveur exposant l'API OpenAI Chat Completions
- **Configuration** : URL + modèle + clé API (optionnelle pour local)

### None (désactivé)

- Provider par défaut au premier lancement
- Toutes les fonctionnalités IA sont désactivées
- Les fallbacks heuristiques sont actifs

## Prompts

Les prompts sont versionnés et stockés dans des fichiers séparés, pas en dur dans le code.

```
src/lib/ai/prompts/
  rephrase-bullet.ts      # Reformulation de bullet points
  suggest-improvements.ts  # Suggestions d'amélioration
  generate-summary.ts      # Génération de résumé professionnel
  analyze-job-posting.ts   # Analyse d'offre d'emploi
```

Chaque fichier exporte une fonction qui construit le prompt à partir du contexte (données CV, section, langue).

## UX de l'IA

### Indicateur de statut

Un badge discret dans la barre d'outils :
- **Gris** : IA non configurée
- **Vert** : IA connectée et disponible
- **Orange** : IA configurée mais non joignable
- Clic sur le badge → paramètres IA

### Interaction

- Les suggestions IA apparaissent dans un panneau dédié ou inline sous le champ édité
- L'utilisateur choisit : accepter, modifier ou rejeter chaque suggestion
- Jamais de modification automatique du contenu
- Le temps de réponse est affiché (transparence sur la latence du modèle local)

### Avertissement vie privée

Si un provider distant est sélectionné (URL externe), un avertissement est affiché :

> "Le contenu de votre CV sera envoyé à un serveur externe ({url}). Pour un usage totalement privé, utilisez un modèle local (Ollama, LM Studio)."

L'utilisateur doit confirmer une fois. Le choix est mémorisé.

## Sécurité

- Les clés API sont stockées dans le keychain de l'OS (via Tauri) et jamais en clair dans les fichiers de configuration
- Le contenu envoyé à un provider distant est le strict minimum (la section concernée, pas le CV entier)
- Les réponses de l'IA sont sanitizées avant affichage (pas de HTML/script injecté)
- Les logs de requêtes IA ne contiennent pas le contenu envoyé

## Extensibilité

Ajouter un nouveau provider :

1. Implémenter l'interface `AIProvider`
2. L'enregistrer dans le registre de providers
3. Ajouter l'option dans les paramètres

Le reste du code (prompts, UI, fallbacks) fonctionne sans modification.
