# Énoncé du Projet Fil Rouge : Système de Gestion de Quêtes et d'Inventaire pour un RPG
> Bienvenue, jeune ingénieur, dans le royaume d'Algorithmia ! Pour prouver votre valeur et obtenir le titre de Maître Codeur, vous devez construire l'épine dorsale numérique de notre prochain grand jeu de rôle. Ce projet de révision sur 4 jours vous demande de développer un système Full-Stack JavaScript pour gérer les joueurs, leurs quêtes et leur précieux inventaire.

**Technologie** : Full-Stack JavaScript (Node.js/Express.js pour le Backend, Framework Front-end de votre choix - React, Vue.js, ou Svelte). 
Objectifs Pédagogiques (Les Épreuves du Maître Codeur)

À la fin de ce projet, vous aurez démontré votre capacité à :

1. Modéliser un Univers (Base de Données) : Créer des schémas de données complexes avec des relations (Joueur, Quête, Objet).

2. Forge d'API (API RESTful) : Concevoir des points de terminaison pour les actions de jeu (accepter quête, utiliser objet, etc.).

3. Garde du Royaume (Sécurité) : Mettre en place un système d'authentification par JWT pour sécuriser les sessions de jeu.

4. Interface Magique (Frontend Réactif) : Développer une interface utilisateur dynamique pour le journal de quêtes et l'inventaire.

5. Logique du Destin (Logique Métier) : Implémenter la logique de progression et de récompense des quêtes.

6. Tests de Résistance (Qualité Logicielle) : Rédiger des tests unitaires pour la logique de jeu critique.

---
Tâche 1 : Initialisation du Serveur de Jeu

  - Initialiser un projet Node.js.
  - Installer les dépendances (Express, un ODM/ORM comme Mongoose, dotenv).
  - Configurer le serveur Express et la connexion à la base de données.

Tâche 2 : Modélisation des Entités du Royaume

  - Définir les schémas de données pour les entités suivantes :
    - Player (nom, email, mot de passe haché, niveau, expérience, inventaire). L'inventaire est une liste d'objets.
    - Item (nom, description, type - ex: "potion", "arme").
    - Quest (titre, description, statut - ex: "disponible", "en cours", "terminée", récompenses - ex: expérience, objet).
  - Crucial : Assurez-vous que les relations entre Player, Item et Quest sont correctement modélisées.

Tâche 3 : API des Données Statiques

- Créer des routes pour récupérer la liste des Item et des Quest disponibles dans le monde (données de base du jeu).
- Tester ces routes avec un outil client HTTP.
  
Tâche 4 : Authentification du Héros
  - Implémenter les routes d'authentification :
    - POST /api/auth/register : Créer un nouveau Player (avec hachage du mot de passe via bcrypt).
    - POST /api/auth/login : Connecter le Player et générer un JSON Web Token (JWT).

Tâche 5 : Le Sceau de l'Autorité (Middleware)

- Créer un middleware Express qui vérifie la validité du JWT pour s'assurer que seul un joueur authentifié peut effectuer des actions.
- Protéger toutes les routes de jeu avec ce middleware.

Tâche 6 : API des Actions de Jeu (Partie 1)
- Implémenter les endpoints suivants :
  - GET /api/player/profile : Récupérer le profil complet du joueur (stats, inventaire, quêtes en cours).
  - POST /api/player/accept-quest/:questId : Le joueur accepte une quête disponible. Mettre à jour le statut de la quête dans le profil du joueur.
  - POST /api/player/use-item/:itemId : Le joueur utilise un objet de son inventaire (simplement le retirer de l'inventaire pour l'instant).
âche 7 : Initialisation du Client de Jeu
- Initialiser un projet Frontend (React, Vue.js, ou Svelte).
- Mettre en place le routage client-side (ex: /login, /profile, /quests).

Tâche 8 : Écrans d'Authentification
- Créer les composants Login et Register.
- Gérer l'état d'authentification et le stockage du JWT côté client.

Tâche 9 : Le Journal de Quêtes
- Créer le composant QuestJournal.
- Implémenter la logique pour récupérer les quêtes disponibles et les quêtes en cours du joueur via l'API (Tâche 3 et 6).
- Afficher clairement le titre, la description et le statut de chaque quête. Inclure un bouton "Accepter" pour les quêtes disponibles.

Tâche 10 : L'Inventaire du Héros
- Créer le composant Inventory qui affiche la liste des objets du joueur.
- Chaque objet doit avoir un bouton "Utiliser" qui déclenche l'appel API correspondant (Tâche 6).
Tâche 11 : L'Accomplissement de la Quête
- Implémenter la route Backend POST /api/player/complete-quest/:questId.
- Cette route doit :
  1. Vérifier que la quête est bien "en cours" pour ce joueur.
  2. Simuler la validation (pour ce projet, la simple existence de la route suffit).
  3. Ajouter les récompenses (expérience et/ou objet) au profil du joueur.
  4. Mettre à jour le statut de la quête à "terminée".

Tâche 12 : Réactivité du Monde
- Assurer que l'interface utilisateur (Inventaire, Stats, Journal de Quêtes) se met à jour automatiquement après l'accomplissement d'une quête ou l'utilisation d'un objet.
- Ceci nécessite une bonne gestion de l'état global du joueur côté Frontend.

Tâche 13 : Tests Unitaires de Logique de Jeu
- Rédiger des tests unitaires pour au moins deux fonctions critiques du Backend :
- La fonction de calcul de récompense (ex: calculateReward(questLevel)).
- La fonction de vérification de l'inventaire avant utilisation d'un objet.
- Utiliser un framework de test comme Jest ou Mocha/Chai.

Tâche 14 : Documentation Ludique
- Rédiger un fichier README.md clair expliquant comment lancer le "Serveur de Jeu" et le "Client de Jeu", en utilisant un ton inspiré de l'univers RPG.









