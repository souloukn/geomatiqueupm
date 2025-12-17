# Outil d'évaluation des étudiants

Application web d'évaluation pédagogique développée avec HTML, CSS et JavaScript (Vanilla JS) utilisant le stockage local du navigateur.

## Fonctionnalités

### Interface Enseignant
- Authentification par code enseignant (pré-généré: TEACHER123)
- Création et gestion des épreuves
- Génération automatique de codes d'épreuve
- Création de questions QCM (choix unique)
- Visualisation des résultats des étudiants
- Publication des résultats
- Exportation des résultats (formats Excel, Word, PDF - simulation)

### Interface Étudiant
- Accès aux épreuves via code d'épreuve et matricule
- Sécurité: un matricule ne peut composer qu'une seule fois par épreuve
- Chronomètre intégré
- Navigation entre les questions
- Soumission automatique à la fin du temps imparti

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- localStorage (stockage des données côté client)

## Installation et utilisation

1. Téléchargez ou clonez ce dépôt
2. Ouvrez le fichier `index.html` dans un navigateur web moderne
3. Commencez à utiliser l'application

### Connexion Enseignant
- Cliquez sur "Enseignant"
- Entrez le code enseignant: `TEACHER123`
- Accédez à l'interface de gestion des épreuves

### Connexion Étudiant
- Cliquez sur "Étudiant"
- Entrez le code d'épreuve fourni par l'enseignant
- Entrez votre matricule

## Déploiement sur GitHub Pages

Ce projet est prêt pour le déploiement sur GitHub Pages. Vous pouvez utiliser l'une des méthodes suivantes :

### Méthode 1 : Utilisation de l'interface GitHub
1. Allez dans les paramètres de votre dépôt
2. Faites défiler jusqu'à la section "Pages"
3. Sélectionnez "Deploy from a branch"
4. Choisissez la branche principale et le dossier racine (/)
5. Cliquez sur "Save"

### Méthode 2 : Utilisation du script de déploiement
Sur Windows, exécutez `deploy.bat`. Sur les systèmes Unix/Linux/Mac, exécutez `deploy.sh`.

### Méthode 3 : Déploiement automatique avec GitHub Actions
Le workflow GitHub Actions est déjà configuré dans `.github/workflows/deploy.yml` et se déclenchera automatiquement lors des pushes sur la branche principale.

## Structure du projet

```
.
├── index.html          # Page principale
├── styles.css          # Feuille de style
├── app.js              # Logique de l'application
├── teacher-login.html  # Page alternative de connexion enseignant
├── Logo.png            # Logo de l'application
├── .gitignore          # Fichiers à ignorer dans Git
├── 404.html            # Page d'erreur 404 personnalisée
├── deploy.bat          # Script de déploiement Windows
├── deploy.sh           # Script de déploiement Unix/Linux/Mac
├── .github/
│   └── workflows/
│       └── deploy.yml  # Workflow GitHub Actions
└── README.md           # Documentation
```

## Stockage des données

Toutes les données sont stockées dans le `localStorage` du navigateur :
- Informations sur les épreuves
- Résultats des étudiants
- Code enseignant

## Sécurité

- Interfaces strictement séparées
- Vérification des codes d'accès
- Blocage des tentatives multiples par matricule
- Protection contre l'accès direct aux résultats

## Évolutions possibles

- Ajout de questions à réponse multiple
- Mode aléatoire des questions
- Interface responsive (mobile/tablette)
- Historique des épreuves
- Statistiques avancées

## Notes importantes

- Cette application fonctionne entièrement côté client
- Les données sont stockées localement dans le navigateur
- Pour une utilisation en production, des mesures de sécurité supplémentaires seraient nécessaires