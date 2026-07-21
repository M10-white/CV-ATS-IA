# Moteur ATS

## Comment fonctionne un ATS

Un Applicant Tracking System (Workday, Greenhouse, Lever, Taleo, iCIMS) reçoit un CV en PDF et tente d'en extraire des données structurées via un pipeline :

1. **Extraction de texte** — le parseur lit le contenu textuel du PDF. Le texte dans des images est perdu.
2. **Identification des sections** — le parseur cherche des en-têtes standard et catégorise le contenu.
3. **Extraction des entités** — noms, dates, entreprises, postes, compétences, diplômes sont mappés dans un formulaire.
4. **Scoring** — les mots-clés extraits sont comparés aux critères de l'offre d'emploi.

Les CV échouent rarement à l'étape 4. Ils échouent aux étapes 1-3 : texte illisible, sections non reconnues, données mal extraites.

## Architecture du moteur

Le moteur fonctionne en pipeline. Chaque étape consomme la sortie de la précédente.

```
Données CV (JSON) ──→ Extraction ──→ Structure ──→ Entités ──→ Diagnostic
                         │               │            │            │
                    Texte brut      Sections      Dates,       Score,
                    simulé          identifiées   Entreprises  Alertes,
                                                  Compétences  Recommandations
```

### Étape 1 — Extraction

Simule l'extraction de texte du PDF.

**v1 (Phase 3)** : travaille sur les données JSON structurées du CV — pas sur le PDF. C'est une approximation valide pour les templates intégrés (contrôlés par nous).

**v2 (Phase 7)** : extrait réellement le texte du PDF généré via `pdf-extract` (Rust). Valide que le PDF produit est correctement lisible.

Vérifications :
- Texte entièrement sélectionnable (pas d'images contenant du texte)
- Encodage correct (pas de caractères mojibake)
- Polices embarquées dans le PDF
- Pas de calques superposés masquant du texte
- Taille du fichier raisonnable (< 2 Mo)

### Étape 2 — Structure

Analyse la structure du document.

Vérifications :
- Chaque section est-elle identifiable par un en-tête standard ?
- Les noms de sections suivent-ils les conventions ATS ?
  - Accepté : "Experience", "Expérience professionnelle", "Work Experience"
  - Risqué : "Where I've Been", "My Journey", "Parcours"
- L'ordre des sections est-il cohérent avec les attentes des parseurs ?
  - Ordre recommandé : Identité → Résumé → Expérience → Formation → Compétences
- Y a-t-il des sections manquantes critiques ?
- L'ordre de lecture est-il correct (pas de colonnes lues dans le mauvais sens) ?

### Étape 3 — Entités

Vérifie que les données sont extractibles.

Vérifications :
- **Dates** : format parseable (MM/YYYY, YYYY, "Janvier 2024") — pas "il y a 3 ans"
- **Entreprises et postes** : clairement séparés et identifiables
- **Compétences** : listées individuellement (pas dans une phrase continue)
- **Contact** : email et téléphone dans un format reconnaissable
- **Liens** : LinkedIn, GitHub sous forme d'URL complète
- **Localisation** : ville + pays plutôt que coordonnées vagues

### Étape 4 — Diagnostic

Produit le résultat final.

## Format du diagnostic

```typescript
interface ATSDiagnostic {
  scores: {
    readability: number    // 0-100
    structure: number      // 0-100
    extraction: number     // 0-100
    content: number        // 0-100
    overall: number        // Moyenne pondérée
  }
  alerts: ATSAlert[]
  parserView: string       // Texte brut tel que l'ATS le voit
}

interface ATSAlert {
  severity: 'critical' | 'warning' | 'suggestion'
  category: 'readability' | 'structure' | 'extraction' | 'content'
  message: string          // Description du problème
  recommendation: string   // Action corrective
  section?: string         // Section concernée (pour navigation)
  field?: string           // Champ spécifique
}
```

## Catégories de score

### Lisibilité (25%)

Évalue si le texte peut être extrait correctement du PDF.

| Critère | Impact |
|---|---|
| Texte sélectionnable | Critique |
| Polices standard embarquées | Élevé |
| Pas de texte dans des images | Critique |
| Encodage UTF-8 correct | Élevé |
| Version PDF compatible (1.4-1.7) | Moyen |
| Pas de cryptage | Critique |

### Structure (30%)

Évalue si les sections sont identifiables et ordonnées.

| Critère | Impact |
|---|---|
| En-têtes de section standard | Élevé |
| Ordre logique des sections | Moyen |
| Sections critiques présentes | Élevé |
| Pas de mise en page multi-colonne complexe | Moyen |
| Pas d'en-tête/pied de page avec infos critiques | Moyen |

### Extraction (25%)

Évalue si les données sont correctement extractibles.

| Critère | Impact |
|---|---|
| Format de dates parseable | Élevé |
| Contact dans un format standard | Élevé |
| Compétences listées individuellement | Moyen |
| Entreprises et postes séparés | Moyen |
| Pas de caractères spéciaux dans les titres | Faible |

### Contenu (20%)

Évalue la qualité du contenu pour le scoring ATS.

| Critère | Impact |
|---|---|
| Utilisation de verbes d'action | Moyen |
| Présence de résultats chiffrés | Moyen |
| Longueur des descriptions (ni trop court, ni trop long) | Faible |
| Cohérence des temps verbaux | Faible |
| Pas de pronoms personnels | Faible |

## Hiérarchie des alertes

- **Critique** : le CV sera probablement rejeté ou mal interprété. Action immédiate requise.
  - Exemple : "La section Expérience n'a pas d'en-tête reconnaissable"
- **Avertissement** : risque de perte d'information. Action recommandée.
  - Exemple : "Les dates utilisent un format non standard (Q3 2024)"
- **Suggestion** : amélioration possible. Optionnel.
  - Exemple : "La description du poste X ne contient pas de résultat chiffré"

## Vue "parseur"

Affiche le texte brut du CV dans l'ordre exact où un ATS le lirait. Les sections sont colorées par statut :
- Vert : section correctement identifiée
- Orange : section identifiée avec des risques
- Rouge : section non identifiable ou contenu problématique
- Gris : contenu qui pourrait être ignoré par le parseur

## Noms de sections standards

Le moteur reconnaît ces noms de sections (français et anglais) :

| Section | Noms acceptés (FR) | Noms acceptés (EN) |
|---|---|---|
| Identité | Informations personnelles, Coordonnées | Personal Information, Contact |
| Résumé | Résumé, Profil, À propos | Summary, Profile, About |
| Expérience | Expérience professionnelle, Expériences | Work Experience, Experience, Employment |
| Formation | Formation, Études, Parcours académique | Education, Academic Background |
| Compétences | Compétences, Aptitudes | Skills, Technical Skills, Core Competencies |
| Langues | Langues | Languages |
| Certifications | Certifications, Accréditations | Certifications, Licenses |
| Projets | Projets | Projects |
| Bénévolat | Bénévolat, Engagement associatif | Volunteer, Community Involvement |
| Publications | Publications | Publications |
| Références | Références | References |

Les noms créatifs ("Where I've Been", "My Superpowers") sont signalés comme risqués.

## Limitations connues

1. Le moteur ne peut pas reproduire exactement le comportement de chaque ATS — leurs parseurs sont propriétaires et diffèrent.
2. La v1 analyse les données structurées, pas le PDF réel — les problèmes liés au rendu spécifique d'un template ne sont pas détectés.
3. Les règles sont basées sur les bonnes pratiques documentées et les conventions communes, pas sur du reverse-engineering d'ATS spécifiques.
4. Le contenu est analysé par heuristiques (regex, patterns) — l'analyse sémantique profonde nécessite l'IA.
