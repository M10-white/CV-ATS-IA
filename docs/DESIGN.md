# Design & UX

## Principes

1. **Le CV est la star.** L'aperçu PDF occupe au minimum 50% de l'écran. L'éditeur est au service du document, pas l'inverse.
2. **Édition contextuelle.** Cliquer sur une section du CV sélectionne le formulaire correspondant. Le parcours n'est pas linéaire.
3. **Feedback immédiat.** Chaque modification se reflète dans l'aperçu en < 200ms. Le score ATS se met à jour en temps réel.
4. **Progressif.** L'essentiel par défaut, les options avancées un clic plus loin.
5. **Pas de friction.** Sauvegarde automatique, pas de dialogues de confirmation superflus, export en un clic.

## Layout principal

```
┌──────────────────────────────────────────────────────────────┐
│  [Logo]  CV Architect AI    [Profil ▾]  [IA ●]  [⚙ Params] │
├────────┬──────────────────────────────┬──────────────────────┤
│        │                              │                      │
│  Nav   │     Aperçu PDF               │   Éditeur            │
│  des   │     (temps réel)             │   (section active)   │
│  sec-  │                              │                      │
│  tions │     ┌─────────────┐          │   [Identité      ]   │
│        │     │             │          │   Nom: ...           │
│  ☰ Id  │     │    CV       │          │   Titre: ...         │
│  ☰ Exp │     │   rendu     │          │   Email: ...         │
│  ☰ For │     │             │          │                      │
│  ☰ Comp│     │             │          │   ── ATS ──          │
│  ☰ Lan │     └─────────────┘          │   Score: 94/100      │
│        │                              │   ⚠ 1 avertissement  │
│  [+]   │  [◀ 1/1 ▶]  [🔍 Zoom]       │                      │
├────────┴──────────────────────────────┴──────────────────────┤
│  Score ATS: ████████████░░ 94    [Diagnostic]   [Exporter]   │
└──────────────────────────────────────────────────────────────┘
```

### Zones

- **Panneau gauche (200px)** : navigation des sections avec miniatures, drag-and-drop pour réordonner, bouton "+" pour ajouter une section
- **Zone centrale (flexible)** : aperçu PDF temps réel, zoom, pagination, clic pour sélectionner une section
- **Panneau droit (300px)** : formulaire d'édition de la section active, suggestions ATS inline, personnalisation visuelle (via onglet)
- **Barre inférieure** : score ATS global, accès au diagnostic complet, bouton d'export

### Responsive

Le panneau gauche se réduit à des icônes sur les écrans < 1200px. Le panneau droit peut être basculé en overlay sur les écrans < 1000px. L'aperçu reste toujours visible.

## Parcours utilisateur

### Premier CV (onboarding)

1. **Accueil** : deux actions : "Nouveau CV" ou "Ouvrir un CV". Pas de tutoriel obligatoire.
2. **Template** : grille de templates avec aperçu rempli de données réalistes. Badge "Score ATS: 95+".
3. **Saisie** : l'éditeur s'ouvre sur la section Identité. Tooltips discrets expliquant ce qu'attend un ATS.
4. **Remplissage** : l'utilisateur descend section par section. L'aperçu se construit en temps réel.
5. **Diagnostic** : panneau diagnostic avec analyse complète. Problèmes cliquables.
6. **Export** : un clic, un fichier PDF.

### Adaptation à une offre

1. Ouvrir un CV existant → "Adapter à une offre"
2. Coller le texte de l'annonce
3. Analyse : mots-clés, compétences, qualifications extraits
4. Tableau de couverture : présent / manquant / à reformuler
5. Clic sur une suggestion → l'éditeur s'ouvre sur le bon champ
6. Score de correspondance en temps réel

### Comparaison de versions

1. Sélectionner deux versions d'un CV (ou deux CV différents)
2. Vue côte à côte avec diff surligné
3. Scores ATS comparés en dessous

## Palette de l'interface

L'interface est sobre. L'attention va au CV, pas à l'outil.

### Couleurs fonctionnelles

| Rôle | Clair | Sombre |
|---|---|---|
| Background | `#f7f6f3` | `#151518` |
| Surface (panneaux) | `#eeedea` | `#1e1e22` |
| Raised (cartes) | `#ffffff` | `#26262b` |
| Text primary | `#1a1d23` | `#e4e3df` |
| Text secondary | `#4a4f5c` | `#b0afa8` |
| Text muted | `#7c8294` | `#7d7c76` |
| Border | `#d8d6d0` | `#333338` |
| Accent | `#2d7d9a` | `#5ab8d6` |

### Couleurs sémantiques

| Rôle | Couleur |
|---|---|
| Succès / bon score | `#3a8a5c` / `#5fb87e` |
| Avertissement | `#b8860b` / `#d4a030` |
| Erreur / critique | `#c45d4a` / `#e07a68` |

## Typographie de l'interface

- **Texte** : police système (`system-ui, -apple-system, 'Segoe UI', sans-serif`)
- **Données/scores** : `font-variant-numeric: tabular-nums` pour l'alignement des chiffres
- **Labels** : uppercase, letter-spacing 0.06em, 12px, weight 600

La typographie décorative est réservée aux templates de CV.

## Composants UI

Basés sur Radix Primitives pour l'accessibilité, stylés avec Tailwind CSS.

### Composants de base

- Button (primary, secondary, ghost, danger)
- Input (text, textarea, number)
- Select (single, avec recherche pour les longues listes)
- Dialog (modal)
- Popover (tooltips, menus contextuels)
- Tabs (pour les onglets éditeur/personnalisation)
- Slider (pour les valeurs numériques : marges, taille de texte)
- ColorPicker (pour la couleur d'accent)
- Badge (statut IA, alertes ATS)
- Toast (notifications non-bloquantes)

### Composants métier

- SectionEditor (formulaire par type de section)
- SectionNav (panneau gauche avec drag-and-drop)
- PDFPreview (rendu du PDF avec zoom/pagination)
- ATSScoreBar (barre de score avec couleur dynamique)
- ATSDiagnosticPanel (liste d'alertes avec filtres)
- TemplateCard (aperçu de template dans la grille de sélection)
- JobMatchTable (tableau de couverture compétences)
- VersionDiff (comparaison de deux versions)

## Accessibilité

- Tous les composants interactifs sont accessibles au clavier
- Les rôles ARIA sont correctement définis (via Radix)
- Le contraste respecte WCAG 2.1 AA
- Les couleurs sémantiques ne sont jamais le seul indicateur (toujours accompagnées d'un label ou d'une icône)
- `prefers-reduced-motion` respecté pour les animations

## Thème

- Clair par défaut, sombre disponible
- Bascule dans les paramètres et/ou via un toggle dans la barre d'outils
- Détection automatique de la préférence système au premier lancement
- Tokens CSS custom properties pour une bascule sans rechargement
