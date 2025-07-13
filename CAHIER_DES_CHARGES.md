# CAHIER DES CHARGES
## Jeu Éducatif "Un Sénégal Propre" - Version 2.0

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Contexte
Le projet "Un Sénégal Propre" est un jeu éducatif développé pour sensibiliser les utilisateurs à l'importance du tri sélectif des déchets dans le contexte sénégalais. L'objectif est de promouvoir les bonnes pratiques environnementales à travers une approche ludique et interactive avec des fonctionnalités avancées de gaming.

### 1.2 Objectifs
- **Éducatif** : Apprendre à trier correctement les déchets selon leur catégorie
- **Sensibilisation** : Promouvoir la protection de l'environnement au Sénégal
- **Ludique** : Créer une expérience de jeu engageante et divertissante
- **Accessible** : Rendre le jeu utilisable par tous les âges
- **Engageant** : Maintenir l'intérêt avec des mécaniques de jeu avancées

### 1.3 Public cible
- Enfants et adolescents (8-16 ans)
- Adultes souhaitant s'informer sur le tri des déchets
- Établissements scolaires et éducatifs
- Associations environnementales
- Gamers occasionnels et passionnés

---

## 2. SPÉCIFICATIONS FONCTIONNELLES

### 2.1 Fonctionnalités principales

#### 2.1.1 Écran d'accueil
- **Image de fond** : Marché sénégalais authentique
- **Titre du jeu** : "Un Sénégal Propre 🌍"
- **Sélection du mode** : 4 boutons (Facile, Moyen, Difficile, Mode Survie)
- **Bouton High Scores** : Consultation des meilleurs scores
- **Design responsive** : Adaptation mobile/desktop

#### 2.1.2 Interface de jeu
- **Zone de déchets** : Affichage des déchets à trier (emojis)
- **Poubelles de tri** : 4 catégories (Plastique, Papier, Verre, Organique)
- **Système de score** : Points en temps réel avec bonus de streak
- **Chronomètre** : Temps limité selon le niveau
- **Power-ups** : Indicateurs visuels des power-ups actifs
- **Barre de progression** : Déchets triés / Total
- **Série actuelle** : Affichage du streak en cours

#### 2.1.3 Système de jeu
- **Drag & Drop** intuitif avec animations avancées
- **Validation automatique** du tri avec feedback immédiat
- **Génération aléatoire** des déchets
- **Chance d'obtenir des power-ups** aléatoirement (10%)
- **Système de streak** avec bonus de points

### 2.2 Modes de jeu

#### 2.2.1 Modes Classiques
| Niveau | Temps | Déchets | Points/Correct | Pénalité | Couleur |
|--------|-------|---------|----------------|----------|---------|
| Facile | 90s | 8 | 10 | -5 | #4CAF50 |
| Moyen | 60s | 12 | 15 | -5 | #FF9800 |
| Difficile | 45s | 16 | 20 | -5 | #f44336 |

#### 2.2.2 Mode Survie
- **Niveaux infinis** avec difficulté croissante
- **Progression** : +1 déchet et +5 secondes par niveau
- **Score cumulatif** sur tous les niveaux
- **Continuité** jusqu'à échec (temps écoulé)
- **Couleur distinctive** : #9C27B0

### 2.3 Système de Power-ups

#### 2.3.1 Types de Power-ups
- **⏸️ Geler le temps** : Arrête le chronomètre (3 secondes)
- **⭐ Points doubles** : Multiplie les points par 2 (3 secondes)
- **💡 Indices** : 3 indices par partie pour aider au tri

#### 2.3.2 Mécaniques
- **Obtention aléatoire** : 10% de chance après un bon tri
- **Activation automatique** pour geler le temps et points doubles
- **Activation manuelle** pour les indices
- **Indicateurs visuels** dans l'interface

### 2.4 Système de High Scores

#### 2.4.1 Sauvegarde
- **LocalStorage** pour persistance des données
- **Top 5** scores par niveau de difficulté
- **Métadonnées** : date, streak, partie parfaite

#### 2.4.2 Affichage
- **Modal élégant** avec classement
- **Médailles** : Or, Argent, Bronze
- **Indicateur de perfection** (⭐)
- **Tri automatique** par score

### 2.5 Statistiques Détaillées

#### 2.5.1 Métriques
- **Précision globale** : (bons tris / total) * 100
- **Série maximale** : Plus longue série de bons tris
- **Parties jouées** : Nombre total de parties
- **Score total** : Cumul de tous les scores
- **Parties parfaites** : Parties sans erreur

#### 2.5.2 Persistance
- **Sauvegarde automatique** après chaque partie
- **Cumul progressif** des statistiques
- **Reset manuel** possible

### 2.6 Catégories de déchets

#### 2.6.1 Plastique 🥤
- Bouteille plastique, Sachet plastique
- Bouteille de shampoing, Emballage plastique
- Canette, Bouteille d'huile

#### 2.6.2 Papier 📰
- Papier journal, Papier blanc
- Livre, Enveloppe
- Magazine, Carton

#### 2.6.3 Verre 🍾
- Bouteille en verre, Pot de confiture
- Bocal, Bouteille de vin
- Bouteille de champagne, Bouteille d'huile

#### 2.6.4 Organique 🍎
- Épluchures de pomme, Restes de carottes
- Marc de café, Coquilles d'œufs
- Peau de banane, Feuilles de salade

### 2.7 Écran de fin de partie
- **Score final** : Affichage du total des points
- **Niveau atteint** : Mode joué ou niveau survie
- **Statistiques détaillées** : Précision, streak, parties jouées
- **Boutons d'action** : Rejouer / Menu principal

---

## 3. SPÉCIFICATIONS TECHNIQUES

### 3.1 Technologies utilisées
- **HTML5** : Structure de la page et sémantique
- **CSS3** : Styles, animations et responsive design
- **JavaScript ES6+** : Logique du jeu et interactions
- **Drag & Drop API** : Interaction utilisateur
- **Web Audio API** : Effets sonores
- **LocalStorage API** : Persistance des données
- **CSS Animations** : Effets visuels avancés

### 3.2 Architecture du projet
```
ziza/
├── index.html              # Page principale avec interface complète
├── style.css               # Styles CSS avec animations avancées
├── script.js               # Logique du jeu avec toutes les fonctionnalités
├── images/
│   └── marche-senegal.jpg  # Image de fond du Sénégal
├── README.md               # Documentation utilisateur
└── CAHIER_DES_CHARGES.md   # Ce document technique
```

### 3.3 Compatibilité
- **Navigateurs** : Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Responsive** : Mobile (320px+), tablette (768px+), desktop (1024px+)
- **Systèmes** : Windows 10+, macOS 10.14+, Linux, Android 8+, iOS 12+

### 3.4 Performance
- **Temps de chargement** : < 3 secondes
- **Fluidité** : 60 FPS pour les animations
- **Mémoire** : < 50 MB de RAM
- **Responsivité** : < 100ms pour les interactions

---

## 4. FONCTIONNALITÉS AVANCÉES

### 4.1 Effets Sonores
- **API Web Audio** pour génération de sons
- **Fréquences variables** selon l'action
- **Types d'ondes** : sine, square, sawtooth
- **Durée et volume** optimisés

### 4.2 Animations Avancées
- **Particules** : Explosion lors des bons tris
- **Transitions** : Animations d'entrée pour les déchets
- **Effets de drag** : Rotation et échelle
- **Notifications** : Apparition/disparition fluide
- **Transitions de niveau** : Effet de zoom

### 4.3 Système de Streak
- **Compteur en temps réel** des bonnes réponses consécutives
- **Bonus de points** : +5 points tous les 3 bons tris
- **Affichage visuel** : Couleur dorée pour les streaks élevés
- **Reset** lors d'une erreur

### 4.4 Interface Utilisateur
- **Design moderne** avec glassmorphism
- **Effets de flou** (backdrop-filter)
- **Gradients** et ombres portées
- **Animations CSS** optimisées
- **Responsive design** complet

---

## 5. CONTRAINTES ET LIMITATIONS

### 5.1 Contraintes techniques
- **Pas de serveur** : Jeu 100% client-side
- **Pas de base de données** : Données statiques en JavaScript
- **Pas d'authentification** : Jeu en mode solo
- **Sauvegarde locale** : High scores et stats dans le navigateur

### 5.2 Contraintes fonctionnelles
- **Langue** : Interface en français uniquement
- **Connexion** : Fonctionne hors ligne (sauf sons)
- **Mise à jour** : Manuel (modification des fichiers)
- **Compatibilité** : Navigateurs modernes requis

### 5.3 Limitations
- **Pas de multijoueur** : Jeu solo uniquement
- **Pas de progression persistante** : Pas de système de niveaux débloqués
- **Pas de statistiques avancées** : Métriques basiques uniquement
- **Pas de personnalisation** : Interface fixe

---

## 6. LIVRABLES

### 6.1 Fichiers de développement
- `index.html` : Page web complète et fonctionnelle
- `style.css` : Styles CSS optimisés et responsive avec animations
- `script.js` : Code JavaScript documenté et commenté avec toutes les fonctionnalités
- `images/marche-senegal.jpg` : Image de fond du Sénégal

### 6.2 Documentation
- `README.md` : Guide d'utilisation et d'installation complet
- `CAHIER_DES_CHARGES.md` : Ce document technique

### 6.3 Tests et validation
- **Tests fonctionnels** : Vérification de toutes les fonctionnalités
- **Tests de compatibilité** : Validation sur différents navigateurs
- **Tests responsive** : Vérification sur mobile et desktop
- **Tests de performance** : Optimisation des animations

---

## 7. CRITÈRES D'ACCEPTATION

### 7.1 Fonctionnalités obligatoires
- [x] Sélection du mode de jeu (4 modes)
- [x] Génération aléatoire des déchets
- [x] Système de drag & drop fonctionnel
- [x] Validation du tri (bon/mauvais)
- [x] Calcul et affichage du score avec bonus
- [x] Chronomètre fonctionnel
- [x] Animations de feedback avancées
- [x] Écran de fin de partie avec stats
- [x] Bouton "Rejouer" fonctionnel
- [x] Mode survie avec niveaux infinis
- [x] Système de power-ups
- [x] High scores avec persistance
- [x] Statistiques détaillées
- [x] Effets sonores
- [x] Système de streak

### 7.2 Qualité attendue
- [x] Interface utilisateur intuitive et moderne
- [x] Design responsive et attrayant
- [x] Code propre et documenté
- [x] Performance optimisée
- [x] Compatibilité multi-navigateurs
- [x] Animations fluides (60 FPS)
- [x] Effets visuels professionnels

### 7.3 Contenu éducatif
- [x] Déchets réalistes et variés (24 types)
- [x] Catégories de tri correctes
- [x] Contexte sénégalais respecté
- [x] Message environnemental clair
- [x] Expérience d'apprentissage engageante

---

## 8. MAINTENANCE ET ÉVOLUTION

### 8.1 Maintenance
- **Mise à jour des images** : Remplacement de l'image de fond si nécessaire
- **Correction de bugs** : Résolution des problèmes éventuels
- **Optimisations** : Amélioration des performances
- **Compatibilité** : Mise à jour pour les nouveaux navigateurs

### 8.2 Évolutions possibles
- **Nouvelles catégories** : Ajout de types de déchets
- **Système de niveaux** : Progression persistante avec déblocages
- **Multijoueur** : Mode compétitif en temps réel
- **Statistiques avancées** : Graphiques et analyses détaillées
- **Sons** : Effets sonores et musique de fond
- **Animations** : Effets visuels supplémentaires
- **Mode campagne** : Histoire et progression narrative
- **Système de badges** : Achievements et récompenses
- **Intégration sociale** : Partage de scores sur réseaux sociaux
- **Mode éducatif** : Explications détaillées et conseils

---

## 9. MÉTRIQUES DE SUCCÈS

### 9.1 Performance technique
- **Temps de chargement** < 3 secondes
- **Fluidité** : 60 FPS maintenu
- **Compatibilité** : 95% des navigateurs modernes
- **Responsive** : Fonctionnel sur tous les écrans

### 9.2 Expérience utilisateur
- **Engagement** : Temps de jeu moyen > 5 minutes
- **Rétention** : Retour des utilisateurs > 70%
- **Satisfaction** : Interface intuitive et attrayante
- **Accessibilité** : Utilisable par tous les âges

### 9.3 Objectifs éducatifs
- **Apprentissage** : Amélioration des connaissances sur le tri
- **Sensibilisation** : Prise de conscience environnementale
- **Adoption** : Changement de comportement vers le tri
- **Diffusion** : Utilisation dans les écoles et associations

---

## 10. CONCLUSION

Le jeu "Un Sénégal Propre" version 2.0 répond aux objectifs de sensibilisation environnementale tout en offrant une expérience de jeu moderne et engageante. Le projet respecte les contraintes techniques et fonctionnelles définies, et peut évoluer selon les besoins futurs.

**Date de création** : 2024  
**Version** : 2.0  
**Statut** : Terminé et fonctionnel avec fonctionnalités avancées 