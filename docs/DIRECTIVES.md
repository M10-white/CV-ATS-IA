# Directives

Règles non négociables du projet. Toute décision technique doit respecter ces directives.

## Vie privée

- Aucune donnée ne quitte la machine sans action explicite de l'utilisateur
- Pas de télémétrie, pas d'analytics, pas de crash reporting automatique
- Pas de compte utilisateur, pas d'authentification
- Pas de connexion réseau par défaut — le réseau n'est activé que pour l'IA distante (opt-in) et les mises à jour (opt-in)
- Les fichiers CV sont stockés localement dans le dossier utilisateur

## Indépendance

- Le logiciel fonctionne entièrement hors ligne
- Aucune dépendance à un service cloud obligatoire
- Aucune dépendance à une API payante
- L'IA est toujours optionnelle — chaque fonctionnalité IA a un fallback heuristique
- Aucune dépendance forte à un fournisseur (vendor lock-in)

## Qualité du code

- TypeScript strict : `strict: true`, pas de `any`, pas de `as` sauf cast justifié
- Un composant = un fichier = une responsabilité
- Pas de code mort, pas d'imports inutilisés
- Pas de commentaires évidents — uniquement quand le "pourquoi" est non trivial
- Tests pour toute logique métier (moteur ATS, modèle CV, providers IA)
- Biome enforced : le code ne compile pas s'il ne passe pas le linter

## Sécurité

- Sanitization de tout contenu utilisateur avant rendu HTML/PDF
- Pas de `dangerouslySetInnerHTML`
- Validation stricte des templates importés (JSON schema)
- Pas d'exécution de code arbitraire dans les templates
- CSP stricte dans le WebView Tauri
- Permissions Tauri minimales (principe du moindre privilège)

## Performance

- Démarrage < 2 secondes
- Mise à jour de l'aperçu < 200ms
- Analyse ATS < 500ms
- Export PDF < 1 seconde
- Mémoire au repos < 100 Mo
- Lazy loading de tout module non critique au démarrage

## UX

- Le CV est toujours visible — l'aperçu occupe au minimum la moitié de l'écran
- Sauvegarde automatique — pas de bouton "enregistrer"
- Feedback immédiat sur chaque modification
- Interface progressive — l'essentiel d'abord, les options avancées un clic plus loin
- Les suggestions IA sont des propositions, jamais des modifications automatiques
- Thème clair et sombre

## Architecture

- Trois couches séparées : présentation, logique métier, système
- Le frontend ne fait jamais d'I/O fichier directement — tout passe par Tauri IPC
- La génération PDF est isolée derrière une interface (remplaçable)
- L'IA est isolée derrière une interface `AIProvider` (interchangeable)
- Le moteur ATS est un module indépendant, testable unitairement
- Pas de logique métier dans les composants React — elle vit dans les stores et les modules

## Internationalisation

- Toutes les chaînes de l'interface sont externalisées via i18next
- Pas de texte en dur dans les composants
- Français par défaut, anglais prévu
- Les clés de traduction sont descriptives (`editor.section.experience.title`, pas `t1`)

## Documentation

- La documentation dans `docs/` est la source de vérité
- Toute décision architecturale importante est documentée avec sa justification
- Le CHANGELOG est mis à jour à chaque changement notable
- Le code qui contredit la documentation est un bug du code, pas de la documentation
