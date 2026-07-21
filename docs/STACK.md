# Stack technique

Chaque choix est argumenté. Aucune technologie n'est imposée par habitude.

## Résumé

| Rôle | Choix | Version |
|---|---|---|
| Desktop shell | Tauri | v2 |
| Frontend | React + TypeScript | React 19, TS 5.x |
| Build | Vite | 6.x |
| State management | Zustand | 5.x |
| Styling | Tailwind CSS | v4 |
| UI primitives | Radix Primitives | latest |
| Drag-and-drop | dnd-kit | latest |
| i18n | i18next + react-i18next | latest |
| PDF generation | Typst (Rust) | latest |
| PDF parsing | pdf-extract (Rust) | latest |
| Tests unitaires | Vitest | latest |
| Tests E2E | Playwright | latest |
| Lint + format | Biome | latest |
| Licence | MIT | — |

## Justifications détaillées

### Tauri v2 plutôt qu'Electron

| Critère | Tauri v2 | Electron |
|---|---|---|
| Taille installateur | 5-15 Mo | 80-150 Mo |
| Mémoire au repos | 30-80 Mo | 150-300 Mo |
| Backend | Rust (natif) | Node.js |
| WebView | Système (WebView2/WebKit) | Chromium embarqué |
| Sécurité | Sandbox stricte, permissions granulaires | Accès complet Node.js |
| Maturité | v2 stable (2024) | Très mature (2013) |

**Verdict** : les contraintes du projet (légèreté, performance, vie privée) s'alignent avec Tauri. Le risque WebView système est gérable avec du CSS standard.

### React 19 + TypeScript plutôt que Vue, Svelte ou Solid

- **Écosystème** : le plus large. Radix, dnd-kit, react-i18next — tout existe en React.
- **Support Tauri** : documentation officielle et exemples React, intégration mature.
- **TypeScript** : le meilleur support de typage des trois frameworks.
- **Recrutement futur** : si le projet grandit, React est le framework le plus connu.

Vue et Svelte sont d'excellents choix mais n'apportent pas d'avantage significatif ici. Solid serait performant mais son écosystème est trop jeune.

### Zustand plutôt que Redux, Jotai ou MobX

- **Zéro boilerplate** : un store = une fonction. Pas d'actions, reducers, dispatchers.
- **TypeScript natif** : inférence de types automatique.
- **Taille** : ~1 Ko. Redux Toolkit : ~11 Ko.
- **Suffisant** : le state de l'application n'est pas complexe au point de nécessiter Redux. Un CV a ~10 sections, pas 10 000 entités normalisées.

### Tailwind CSS 4 plutôt que CSS Modules ou styled-components

- **Productivité** : composition rapide, pas de fichiers CSS séparés, pas de nommage.
- **Cohérence** : design tokens intégrés (spacing, colors, typography).
- **Performance** : CSS statique généré au build, pas de runtime.
- **Tailwind v4** : tokens CSS natifs (`@theme`), plus rapide, API simplifiée.

styled-components introduit un runtime CSS-in-JS inutile. CSS Modules est viable mais plus verbeux.

### Radix Primitives plutôt que shadcn/ui, MUI ou Ant Design

- **Sans style** : Radix fournit le comportement (accessibilité, keyboard, focus) sans imposer de design.
- **Identité propre** : on construit notre design system, pas celui de quelqu'un d'autre.
- **Léger** : pas de CSS framework UI complet à charger.

shadcn/ui serait acceptable comme accélérateur si la vitesse de développement prime. MUI et Ant Design sont trop lourds et imposent leur esthétique.

### Typst plutôt que LaTeX, Puppeteer ou react-pdf

| Critère | Typst | LaTeX | Puppeteer | react-pdf |
|---|---|---|---|---|
| Temps de compilation | ~100ms | 2-5s | 1-3s | ~500ms |
| Langage | Lisible, scriptable | Complexe | HTML/CSS | React JSX |
| Intégration Rust | Natif (bibliothèque Rust) | Externe (CLI) | Externe (Node.js) | Frontend only |
| Qualité typographique | Excellente | Excellente | Bonne | Correcte |
| Taille | ~5 Mo | 200+ Mo | 100+ Mo (Chromium) | ~500 Ko |

**Verdict** : Typst combine la qualité typographique de LaTeX avec la rapidité d'un outil moderne, dans un package Rust natif. C'est le choix idéal pour Tauri.

**Risque** : Typst est jeune. Si un cas de mise en page bloque, le fallback est `webview.print()` (HTML → PDF via le WebView).

### Biome plutôt qu'ESLint + Prettier

- **Un seul outil** pour lint et format. Pas de conflits de configuration.
- **Plus rapide** : écrit en Rust, 10-100x plus rapide qu'ESLint.
- **Zéro plugin** : les règles TypeScript et React sont intégrées.

ESLint + Prettier est éprouvé mais c'est deux outils avec des configurations parfois conflictuelles. Biome simplifie.

### Vitest + Playwright plutôt que Jest + Cypress

- **Vitest** : partage la configuration Vite, plus rapide que Jest, API compatible.
- **Playwright** : plus fiable que Cypress pour les tests E2E, supporte les apps desktop Tauri via le plugin `@playwright/test`.

### i18next dès le départ

- Le coût d'intégration est marginal si fait dès le début (externaliser les chaînes dans des fichiers JSON).
- Retrofitter l'i18n plus tard coûte 10x plus cher (toucher chaque composant).
- Français par défaut, anglais ajouté quand le MVP est stable.
- L'interpolation et la pluralisation sont gérées nativement.

## Dépendances critiques (à surveiller)

| Dépendance | Risque | Mitigation |
|---|---|---|
| Tauri v2 | Écosystème plus jeune qu'Electron | Communauté en forte croissance, backing Crabnebula |
| Typst | Projet jeune, API peut changer | Isolé derrière une interface, fallback WebView print |
| Radix | Maintenance dépend d'une petite équipe | Primitives stables, peu de breaking changes historiques |
| dnd-kit | Maintenu par un seul développeur | Alternatives disponibles (pragmatic-dnd) |
