# Roadmap

Chaque phase produit un logiciel fonctionnel. Pas de phase qui se termine sur un logiciel cassé.

## Phase 0 — Fondation

**Durée estimée : 2-3 semaines**

Setup technique complet. À la fin, l'application démarre, affiche une fenêtre, et le pipeline build/test/lint fonctionne.

- [ ] Initialisation Tauri v2 + React 19 + TypeScript + Vite
- [ ] Configuration Biome (lint + format)
- [ ] Configuration Vitest
- [ ] Configuration i18next (français par défaut)
- [ ] Structure de dossiers selon ARCHITECTURE.md
- [ ] Commandes Tauri de base (lecture/écriture fichiers JSON)
- [ ] Design tokens (couleurs, typographie, espacements) en CSS custom properties
- [ ] Composants de base (Button, Input, Select, Dialog) avec Radix Primitives
- [ ] Thème clair/sombre
- [ ] CI : build + tests + lint

**Livrable** : une fenêtre Tauri avec le shell de l'application, le thème clair/sombre et un "Hello World" persisté en JSON.

---

## Phase 1 — Éditeur de CV

**Durée estimée : 3-4 semaines**

L'utilisateur peut créer un CV, le remplir section par section, et le voir se construire.

- [ ] Modèle de données CV (types TypeScript + JSON schema)
- [ ] Store Zustand pour le CV (`useCVStore`)
- [ ] Éditeur de section : Identité (nom, titre, email, téléphone, localisation)
- [ ] Éditeur de section : Expérience professionnelle (entreprise, poste, dates, descriptions)
- [ ] Éditeur de section : Formation (établissement, diplôme, dates)
- [ ] Éditeur de section : Compétences (catégories + items)
- [ ] Éditeur de section : Langues
- [ ] Éditeur de section : Section libre (titre + contenu)
- [ ] Drag-and-drop pour réordonner les sections (dnd-kit)
- [ ] Sauvegarde automatique (debounce 2s)
- [ ] Liste des CV (créer, dupliquer, supprimer, renommer)
- [ ] Aperçu HTML temps réel (placeholder avant Typst)

**Livrable** : un éditeur fonctionnel avec sauvegarde locale. L'aperçu est en HTML basique — le vrai rendu PDF arrive en Phase 2.

---

## Phase 2 — Templates et PDF

**Durée estimée : 3-4 semaines**

L'aperçu devient un vrai PDF. Les templates sont appliqués et personnalisables.

- [ ] Intégration Typst dans le backend Rust
- [ ] Template "Classique" (une colonne, sobre, ATS-optimal)
- [ ] Template "Moderne" (accents de couleur, sections bien délimitées)
- [ ] Template "Minimaliste" (épuré, focus contenu)
- [ ] Moteur de template : données CV → document Typst → PDF
- [ ] Aperçu PDF temps réel dans le WebView (rendu page par page)
- [ ] Personnalisation visuelle : couleur d'accent, police, taille de texte, marges
- [ ] Export PDF avec métadonnées (titre, auteur, mots-clés)
- [ ] Polices ATS-safe embarquées (Inter, Source Sans, Lato, Roboto)
- [ ] Sélecteur de template avec aperçu

**Livrable** : un logiciel complet de création de CV avec export PDF professionnel. Utilisable au quotidien.

---

## Phase 3 — Moteur ATS

**Durée estimée : 2-3 semaines**

Le diagnostic ATS est intégré. L'utilisateur voit ses scores et les problèmes à corriger.

- [ ] Module ATS : analyse de lisibilité (texte sélectionnable, encodage, polices)
- [ ] Module ATS : analyse structurelle (sections reconnues, en-têtes standard, ordre)
- [ ] Module ATS : analyse d'extraction (dates, entités, compétences, contacts)
- [ ] Module ATS : analyse de contenu (longueur, verbes d'action, chiffres)
- [ ] Score par catégorie (lisibilité, structure, extraction, contenu)
- [ ] Alertes hiérarchisées : critique / avertissement / suggestion
- [ ] Recommandations cliquables → navigation vers la section concernée
- [ ] Vue "parseur" : texte brut tel que l'ATS le voit
- [ ] Panneau diagnostic dans l'éditeur (panneau latéral ou onglet)
- [ ] Mise à jour temps réel du score à chaque modification

**Livrable** : l'outil de diagnostic ATS est fonctionnel. Les CV produits sont analysés en temps réel.

---

## Phase 4 — Profils et historique

**Durée estimée : 2 semaines**

Gestion multi-profils et historique des modifications.

- [ ] Gestion de profils (créer, renommer, supprimer, switcher)
- [ ] Chaque profil a ses propres CV et paramètres
- [ ] Snapshots automatiques à chaque sauvegarde significative
- [ ] Liste des versions avec horodatage
- [ ] Diff visuel entre deux versions (contenu modifié surligné)
- [ ] Restauration d'une version antérieure
- [ ] Paramètres utilisateur : langue, thème, police par défaut, dossier de données

**Livrable** : l'utilisateur peut gérer plusieurs identités et revenir sur ses modifications.

---

## Phase 5 — Adaptation et comparaison

**Durée estimée : 2-3 semaines**

L'outil aide à adapter un CV à une offre et à comparer des versions.

- [ ] Zone de saisie/collage d'une offre d'emploi
- [ ] Extraction de mots-clés et compétences de l'offre (regex + heuristiques)
- [ ] Tableau de couverture : compétences demandées vs présentes dans le CV
- [ ] Suggestions de mots-clés manquants à intégrer
- [ ] Score de correspondance CV/offre
- [ ] Comparaison côte à côte de deux CV (même profil ou différents)
- [ ] Diff des scores ATS entre les deux versions

**Livrable** : l'utilisateur peut adapter efficacement un CV à une offre spécifique.

---

## Phase 6 — Module IA

**Durée estimée : 2-3 semaines**

L'IA optionnelle est intégrée pour la reformulation et les suggestions.

- [ ] Interface `AIProvider` et système de providers
- [ ] Provider Ollama (LLM local)
- [ ] Provider OpenAI-compatible (API générique)
- [ ] Configuration IA dans les paramètres (URL, modèle, test de connexion)
- [ ] Reformulation de bullet points (transformer description → réalisation)
- [ ] Suggestions d'amélioration (verbes faibles, phrases vagues, chiffres manquants)
- [ ] Génération de résumé professionnel
- [ ] Fallbacks heuristiques pour chaque fonctionnalité IA
- [ ] Badge de statut IA (connecté/déconnecté)
- [ ] Avertissement si provider distant sélectionné (données envoyées hors machine)

**Livrable** : l'IA enrichit l'expérience pour ceux qui l'installent. Le logiciel reste identique sans.

---

## Phase 7 — Templates avancés et polish

**Durée estimée : 3-4 semaines**

L'utilisateur peut créer ses templates. Le logiciel est prêt pour une release publique.

- [ ] Éditeur de templates visuel (paramètres de layout, sections, espacement)
- [ ] Import de templates (fichier JSON/ZIP)
- [ ] Export de templates (fichier JSON/ZIP avec polices et assets)
- [ ] 2 templates supplémentaires
- [ ] Moteur ATS v2 : extraction réelle du PDF généré (via pdf-extract en Rust)
- [ ] Raccourcis clavier complets
- [ ] Onboarding subtil (tooltips contextuels au premier lancement)
- [ ] Tests E2E avec Playwright
- [ ] Auto-update via Tauri Updater + GitHub Releases
- [ ] Packaging : installateurs signés Windows/macOS/Linux
- [ ] Page GitHub avec README, screenshots, instructions d'installation

**Livrable** : version 1.0 publiable.

---

## Futur (post-v1)

Pas planifié en détail. Candidats :

- Lettre de motivation liée au CV
- Import depuis LinkedIn (export JSON) et PDF existants
- Mode multi-langue pour le contenu du CV
- Mode "coaching CV" (diagnostic global au-delà de l'ATS)
- Provider IA Anthropic
- Suivi de candidatures (kanban minimaliste)
- Export HTML statique (mini-portfolio)
- Bibliothèque de bullet points réutilisables
- IA embarquée (petit modèle intégré à l'installateur)
