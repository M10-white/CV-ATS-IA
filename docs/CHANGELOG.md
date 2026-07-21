# Changelog

Tous les changements notables du projet sont documentés ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Non publié]

### Ajouté

- Design Document complet (vision, architecture, stack, ATS, IA, UX, roadmap)
- Documentation du projet :
  - `CLAUDE.md` — conventions et configuration du projet
  - `docs/OBJECTIF.md` — problème, solution, proposition de valeur
  - `docs/DIRECTIVES.md` — règles non négociables
  - `docs/ARCHITECTURE.md` — architecture en couches, format de données, décisions
  - `docs/ROADMAP.md` — 8 phases de développement détaillées
  - `docs/ATS.md` — spécification du moteur d'analyse ATS
  - `docs/IA.md` — architecture IA, providers, fallbacks
  - `docs/DESIGN.md` — principes UX, layout, palette, composants
  - `docs/STACK.md` — choix techniques argumentés
  - `docs/TODOS.md` — tâches en cours
  - `docs/CHANGELOG.md` — ce fichier

### Décidé

- Stack : Tauri v2 + React 19 + TypeScript + Vite
- PDF : Typst (via Rust) avec fallback WebView print
- State : Zustand
- Styling : Tailwind CSS 4 + Radix Primitives
- Lint : Biome
- Tests : Vitest + Playwright
- i18n : i18next (français par défaut, anglais prévu)
- Données : JSON (pas de base de données)
- Licence : MIT
- Auto-updates : Tauri Updater + GitHub Releases
- Templates : personnalisation par paramètres visuels uniquement (pas d'accès au code)
