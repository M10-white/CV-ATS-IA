# Objectif

## Problème

Créer un CV aujourd'hui impose un choix absurde : soit un document visuellement soigné mais rejeté par les ATS, soit un document plat qui passe les filtres mais ne retient pas l'attention.

Les outils existants aggravent ce dilemme :
- **Canva** : beau mais ATS-hostile (texte dans des images, calques)
- **Novorésumé / Zety** : cloud, payant, données sur serveurs tiers
- **Reactive Resume** : open source mais web-only, pas d'analyse ATS
- **LaTeX** : excellent ATS mais courbe d'apprentissage abrupte
- **Word** : ATS-friendly mais templates datés et mise en page fragile

Aucun outil ne réunit beauté visuelle, compatibilité ATS vérifiable et respect total de la vie privée.

## Solution

CV Architect AI est un logiciel de bureau, gratuit et entièrement hors ligne, qui permet de concevoir des CV à la fois élégants et optimisés pour les ATS. Il intègre un moteur d'analyse structurel qui simule le comportement réel des parseurs.

## Proposition de valeur

1. **Beauté + ATS** : des templates qui sont à la fois visuellement professionnels et structurellement compatibles avec les parseurs ATS
2. **Vie privée totale** : aucune donnée ne quitte la machine, aucun compte, aucun tracking
3. **Moteur ATS réel** : pas un score de mots-clés mais une analyse structurelle qui simule l'extraction des parseurs
4. **IA optionnelle** : reformulation et suggestions via un LLM local, sans dépendance à un fournisseur
5. **Gratuit et open source** : licence MIT, aucun abonnement, aucune limitation

## Différenciation

- Pas un template picker (Canva) : l'utilisateur construit son propre système de design
- Pas une app web déguisée : logiciel natif, léger, rapide
- Pas un gadget IA : le logiciel fonctionne parfaitement sans modèle IA
- Un vrai moteur ATS : analyse structurelle, pas un compteur de mots-clés

## Objectifs mesurables

| Métrique | Objectif |
|---|---|
| Création d'un premier CV | < 15 minutes |
| Adaptation à une offre | < 5 minutes |
| Score ATS des CV produits | ≥ 90/100 |
| Démarrage de l'application | < 2 secondes |
| Taille de l'installateur | < 15 Mo (sans modèle IA) |

## Ce que le projet n'est pas

- Pas un clone de Canva ou Novorésumé
- Pas un SaaS ni une application cloud
- Pas un outil dépendant d'une API payante
- Pas un projet jetable : il doit être maintenable pendant des années
