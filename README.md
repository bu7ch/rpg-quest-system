# ⚔️ Système de Gestion de Quêtes et d'Inventaire (RPG Full-Stack) 🧙‍♂️

Bienvenue dans le projet de révision Full-Stack JavaScript ! Ce projet vous met au défi de construire l'épine dorsale d'un système de jeu de rôle (RPG) pour gérer les joueurs, leurs quêtes et leur inventaire.

## 📜 Contexte du Projet

Ce projet est divisé en deux parties principales :

1.  **Le Serveur de Jeu (Backend) :** Une API RESTful construite avec **Node.js** et **Express.js** qui gère la logique de jeu, l'authentification des joueurs (via JWT) et la persistance des données (via MongoDB).
2.  **Le Client de Jeu (Frontend) :** Une interface utilisateur réactive construite avec un framework moderne (choix de l'étudiant : **React**, **Vue.js**, ou **Svelte**) qui permet aux joueurs d'interagir avec le monde (accepter des quêtes, utiliser des objets).

## 🛠️ Prérequis (L'Équipement de l'Aventurier)

Avant de commencer votre quête, assurez-vous que votre environnement est prêt :

*   **Node.js** (version 18 ou supérieure)
*   **npm** ou **yarn** (gestionnaire de paquets)
*   **MongoDB** (serveur local ou instance cloud comme MongoDB Atlas)
*   Un client HTTP pour tester l'API (ex: Postman, Insomnia)

## 🚀 Initialisation du Projet (La Préparation de la Quête)

Le projet doit être structuré en deux dossiers principaux : `backend` et `frontend`.

### 1. Initialisation du Serveur de Jeu (Backend)

1.  **Créer le dossier du projet :**
    ```bash
    mkdir rpg-quest-system
    cd rpg-quest-system
    mkdir backend
    cd backend
    ```

2.  **Initialiser Node.js et installer les dépendances de base :**
    ```bash
    npm init -y
    npm install express mongoose dotenv bcrypt jsonwebtoken
    ```

3.  **Créer le fichier de configuration :**
    Créez un fichier `.env` à la racine du dossier `backend` pour stocker vos variables d'environnement sensibles :
    ```
    # Exemple de contenu pour .env
    PORT=3000
    MONGO_URI="mongodb://localhost:27017/rpgdb"
    JWT_SECRET="votre_cle_secrete_tres_longue"
    ```

4.  **Structure de base :**
    Créez les dossiers pour organiser votre code (modèles, contrôleurs, routes, middleware).

### 2. Initialisation du Client de Jeu (Frontend)

1.  **Retourner à la racine du projet :**
    ```bash
    cd ..
    ```

2.  **Initialiser le projet Frontend (Exemple avec React/Vite) :**
    ```bash
    npm create vite@latest frontend -- --template react
    cd frontend
    npm install
    ```
    *(Adaptez cette commande si vous choisissez Vue.js ou Svelte.)*

## ▶️ Lancement de l'Application

1.  **Lancer le Serveur de Jeu (Backend) :**
    Dans le dossier `backend`, lancez votre serveur (vous devrez créer un script de démarrage dans votre `package.json`, par exemple `node server.js`).
    ```bash
    cd backend
    npm start # ou node server.js
    ```

2.  **Lancer le Client de Jeu (Frontend) :**
    Dans le dossier `frontend`, lancez l'application cliente.
    ```bash
    cd ../frontend
    npm run dev
    ```

Vous êtes maintenant prêt à commencer le développement de votre système de quêtes ! Référez-vous à l'énoncé détaillé pour les tâches spécifiques de chaque jour. Bonne chance, aventurier !

