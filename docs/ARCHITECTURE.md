# Architecture

## Vue d'ensemble

CV Architect AI est une application desktop construite avec Tauri v2. L'architecture sépare strictement trois couches.

```
┌─────────────────────────────────────────────────┐
│           Couche Présentation                   │
│         (React + TypeScript)                    │
│                                                 │
│  Éditeur CV │ Aperçu PDF │ Diagnostic │ Config  │
└──────────────────┬──────────────────────────────┘
                   │ Tauri IPC (invoke / events)
┌──────────────────┴──────────────────────────────┐
│           Couche Logique Métier                  │
│              (TypeScript)                        │
│                                                  │
│  CV Model │ Template Engine │ ATS │ AI Provider  │
└──────────────────┬───────────────────────────────┘
                   │ API / FFI
┌──────────────────┴───────────────────────────────┐
│           Couche Système                          │
│              (Rust)                               │
│                                                   │
│    File I/O │ PDF Generation │ PDF Parsing │ OS   │
└──────────────────┬────────────────────────────────┘
                   │
┌──────────────────┴────────────────────────────────┐
│           Couche Données                           │
│         (Fichiers locaux)                          │
│                                                    │
│   JSON (CV) │ JSON (config) │ Assets │ Snapshots   │
└────────────────────────────────────────────────────┘
```

## Couche Présentation

Responsabilité : afficher l'interface et capturer les interactions utilisateur.

### Modules

- **Editor** : formulaires par section (identité, expérience, formation, compétences, etc.), drag-and-drop pour réordonner
- **Preview** : rendu PDF temps réel dans le WebView, zoom, pagination
- **Diagnostic** : panneau ATS avec scores, alertes, recommandations, vue parseur
- **Settings** : paramètres utilisateur, configuration IA, gestion des profils
- **TemplateSelector** : grille de templates avec aperçu et personnalisation visuelle

### Règles

- Pas de logique métier dans les composants — elle vit dans les stores Zustand et les modules TypeScript
- Les composants sont des fonctions pures : `(props) → JSX`
- Les effets de bord (I/O, timers) sont dans les hooks custom
- Le routing est minimal (pas de React Router) — navigation par état dans le store

## Couche Logique Métier

Responsabilité : transformer les données, analyser, décider.

### Modules

- **cv-model** : types TypeScript du modèle CV, validation, sérialisation/désérialisation, schéma JSON
- **template-engine** : application d'un template à des données CV pour produire un document Typst, gestion des paramètres visuels (couleurs, polices, marges)
- **ats-analyzer** : moteur d'analyse ATS (voir `docs/ATS.md`), pipeline extraction → structure → entités → diagnostic
- **ai-provider** : interface abstraite `AIProvider`, implémentations Ollama/OpenAI-compatible, fallbacks heuristiques
- **job-matcher** : analyse d'offre d'emploi, extraction de mots-clés, tableau de couverture
- **history** : gestion des snapshots, diff entre versions, restauration

### Règles

- Modules testables unitairement sans React ni Tauri
- Pas de dépendance au DOM ni au WebView
- Types stricts, pas de `any`
- Chaque module expose une API claire et documentée par ses types

## Couche Système

Responsabilité : interagir avec l'OS, le système de fichiers et les outils natifs.

### Commandes Tauri (Rust → Frontend)

```
save_cv(data: CVData) → Result<()>
load_cv(id: string) → Result<CVData>
list_cvs() → Result<CVSummary[]>
delete_cv(id: string) → Result<()>
generate_pdf(cv: CVData, template: Template) → Result<Vec<u8>>
parse_pdf(path: string) → Result<ExtractedText>
get_app_data_dir() → Result<string>
```

### Modules Rust

- **fs** : lecture/écriture de fichiers JSON, gestion du dossier de données, snapshots
- **pdf** : intégration Typst pour la génération, pdf-extract pour le parsing
- **os** : intégration système (dialogue fichier, notifications, tray icon si nécessaire)

### Règles

- Le Rust est cantonné aux opérations système — pas de logique métier
- Chaque commande Tauri est typée des deux côtés (Rust struct ↔ TypeScript interface)
- Gestion d'erreurs systématique (`Result<T, E>` côté Rust, erreurs typées côté TypeScript)

## Couche Données

### Format CV

JSON inspiré de JSON Resume, étendu avec des métadonnées et la personnalisation visuelle.

```json
{
  "meta": {
    "id": "uuid-v4",
    "version": "1.0",
    "template": "classic-one-column",
    "profile": "default",
    "created": "2026-07-21T10:00:00Z",
    "modified": "2026-07-21T14:30:00Z",
    "language": "fr"
  },
  "content": {
    "profile": { ... },
    "sections": [ ... ]
  },
  "customization": {
    "colors": { "accent": "#2d7d9a", "text": "#1a1d23" },
    "font": "Inter",
    "fontSize": 10,
    "margins": { "top": 20, "right": 20, "bottom": 20, "left": 20 },
    "lineSpacing": 1.15
  }
}
```

### Structure des fichiers

```
{AppData}/cv-architect/
  config.json              # Paramètres utilisateur
  profiles/
    default/
      profile.json         # Informations du profil
      cvs/
        {uuid}.json        # Données du CV
        {uuid}.history/    # Snapshots du CV
          {timestamp}.json
    work/
      ...
  templates/
    custom/                # Templates créés par l'utilisateur
      {name}.json
```

### Pourquoi JSON et pas SQLite

Un CV est un document autonome, pas une collection relationnelle. JSON offre :
- Lisibilité humaine (debugging, portabilité)
- Compatibilité avec le standard JSON Resume
- Versionnement trivial (un fichier = un snapshot)
- Pas de migration de schéma de base de données
- Import/export naturel (copier un fichier)

SQLite sera introduit uniquement si le suivi de candidatures est implémenté (données relationnelles).

## Communication Frontend ↔ Rust

Via Tauri IPC :

- **`invoke`** : appel synchrone (du point de vue du frontend) d'une commande Rust. Retourne une Promise.
- **`events`** : communication asynchrone bidirectionnelle. Utilisé pour le streaming (progression PDF, résultats IA).

Le frontend n'accède jamais directement au système de fichiers. Tout passe par les commandes Tauri.

## Décisions architecturales

| Décision | Justification |
|---|---|
| Tauri v2 plutôt qu'Electron | Taille (10 Mo vs 100+ Mo), mémoire (50 Mo vs 200+ Mo), performances natives Rust |
| React plutôt que Vue/Svelte | Écosystème le plus large, meilleur support Tauri, abondance de composants |
| Zustand plutôt que Redux | Minimal, pas de boilerplate, excellent avec TypeScript |
| Typst plutôt que LaTeX/Puppeteer | Compilation rapide (~100ms), Rust natif, contrôle typographique |
| JSON plutôt que SQLite | Un CV est un document, pas une table relationnelle |
| Biome plutôt qu'ESLint+Prettier | Un seul outil, plus rapide, zéro configuration |
| i18next dès le départ | Coût marginal maintenant, retrofit 10x plus cher plus tard |
