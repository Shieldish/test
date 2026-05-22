# LFI3 — Application d'analyse de contenu multilingue

Application web full-stack avec Angular (frontend), PHP (API REST), MySQL (base de données) et Elasticsearch (moteur de recherche), le tout orchestré via Docker Compose.

---

## Prérequis

Avant de démarrer, assurez-vous d'avoir installé :

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (version 20.10 ou supérieure)
- [Docker Compose](https://docs.docker.com/compose/install/) (inclus dans Docker Desktop)
- Git (pour cloner le dépôt)

> **Windows** : Activez WSL2 dans Docker Desktop pour de meilleures performances.

---

## Architecture des services

| Service         | Technologie             | Port local | URL d'accès                    |
|-----------------|-------------------------|------------|-------------------------------|
| Frontend        | Angular 13 + Node/Express | 8080     | http://localhost:8080          |
| API backend     | PHP 8.1 + Apache        | 8081       | http://localhost:8081          |
| Base de données | MySQL 8.0               | 3306       | —                              |
| Moteur de recherche | Elasticsearch 7.17  | 9200       | http://localhost:9200          |
| Tableau de bord ES  | Kibana 7.17         | 5601       | http://localhost:5601          |
| Emails de test  | MailPit                 | 8025 (UI), 1025 (SMTP) | http://localhost:8025 |

---

## Démarrage rapide

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd LFI3
```

### 2. Se placer dans le dossier `test`

Tous les fichiers Docker se trouvent dans le sous-dossier `test/` :

```bash
cd test
```

### 3. Lancer tous les services

```bash
docker compose up --build
```

> La première exécution prend **5 à 10 minutes** : téléchargement des images Docker, compilation Angular, initialisation de la base de données et de l'index Elasticsearch.

Attendez de voir dans les logs :

```
app_node     | Server running on port 8080
app_mysql    | ready for connections
app_elasticsearch | started
```

### 4. Accéder à l'application

Ouvrez votre navigateur sur **http://localhost:8080**

---

## Détail des étapes de démarrage

### Ordre de démarrage des conteneurs

Docker Compose démarre les services dans cet ordre en respectant les dépendances :

```
mailpit  ──┐
mysql    ──┤──► php ──► node
           │
elasticsearch ──► kibana
```

### Ce qui se passe automatiquement

1. **MySQL** : crée la base de données `id19066703_pfe_users` et la table `Users` à partir de `db/init.sql`
2. **PHP/Apache** : monte l'API REST sur le port 8081
3. **Node/Express** : compile l'application Angular et sert les fichiers statiques sur le port 8080
4. **Elasticsearch** : initialise l'index `echantillon` avec 15 documents de test multilingues (FR/EN/AR) via `db/init-elasticsearch.sh`
5. **Kibana** : se connecte à Elasticsearch pour la visualisation
6. **MailPit** : intercepte tous les emails envoyés par l'application (vérification de compte, réinitialisation de mot de passe)

---

## Utilisation

### Créer un compte

1. Aller sur http://localhost:8080
2. Cliquer sur **S'inscrire**
3. Remplir le formulaire (nom, email, mot de passe)
4. Un email de vérification est envoyé — ouvrir **http://localhost:8025** pour le consulter dans MailPit
5. Cliquer sur le lien de vérification pour activer le compte

### Connexion

- Email + mot de passe sur http://localhost:8080
- Les comptes non vérifiés ne peuvent pas se connecter

### Accès administrateur

Un administrateur peut activer/désactiver des comptes utilisateurs et gérer les permissions de téléchargement depuis le tableau de bord admin.

---

## Commandes utiles

### Démarrer en arrière-plan

```bash
docker compose up --build -d
```

### Voir les logs en temps réel

```bash
# Tous les services
docker compose logs -f

# Un seul service
docker compose logs -f app_node
docker compose logs -f app_php
docker compose logs -f app_mysql
```

### Arrêter les services

```bash
docker compose down
```

### Arrêter et supprimer les volumes (reset complet)

```bash
docker compose down -v
```

> **Attention** : cette commande supprime toutes les données MySQL et Elasticsearch.

### Reconstruire un seul service

```bash
docker compose up --build app_node
```

### Accéder à un conteneur en ligne de commande

```bash
# Conteneur Node
docker exec -it app_node sh

# Conteneur PHP
docker exec -it app_php bash

# MySQL
docker exec -it app_mysql mysql -u id19066703_pfe -p id19066703_pfe_users
```

---

## Variables d'environnement

Les variables sont définies directement dans `docker-compose.yml`. Voici les valeurs par défaut :

| Variable              | Valeur                  | Utilisé par        |
|-----------------------|-------------------------|--------------------|
| `MYSQL_DATABASE`      | `id19066703_pfe_users`  | MySQL              |
| `MYSQL_USER`          | `id19066703_pfe`        | MySQL              |
| `MYSQL_PASSWORD`      | `fFrP955!N3?G`          | MySQL / PHP        |
| `MYSQL_ROOT_PASSWORD` | `rootpassword`          | MySQL              |
| `DB_HOST`             | `mysql`                 | PHP                |
| `ELASTICSEARCH_HOSTS` | `http://elasticsearch:9200` | Elasticsearch  |

Pour modifier ces valeurs, éditez le fichier `test/docker-compose.yml` et mettez à jour `test/api/config.php` en conséquence.

---

## Structure du projet

```
LFI3/
├── test/                        # Application principale (Docker)
│   ├── docker-compose.yml       # Orchestration des services
│   ├── Dockerfile               # Image Node.js (frontend + Express)
│   ├── Dockerfile.php           # Image PHP/Apache (API)
│   ├── server.js                # Serveur Express (port 8080)
│   ├── package.json             # Dépendances Node/Angular
│   ├── angular.json             # Configuration Angular CLI
│   ├── src/                     # Code source Angular
│   │   └── app/
│   │       ├── account/         # Authentification (login, register, admin)
│   │       ├── recherche-*/     # Composants de recherche
│   │       └── Alert/           # Notifications
│   ├── api/                     # Endpoints PHP (REST API)
│   │   ├── config.php           # Connexion base de données
│   │   ├── login.php
│   │   ├── registration.php
│   │   ├── forgetpassword.php
│   │   └── ...
│   └── db/
│       ├── init.sql             # Schéma initial MySQL
│       └── init-elasticsearch.sh # Données de test Elasticsearch
│
└── Api-test/                    # Ancienne version API (PHP standalone)
```

---

## Résolution des problèmes courants

### Le port 8080 est déjà utilisé

```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080

# Changer le port dans docker-compose.yml
ports:
  - "3000:8080"   # Accessible sur http://localhost:3000
```

### Elasticsearch ne démarre pas

Elasticsearch nécessite au minimum **2 Go de RAM** alloués à Docker.

Dans Docker Desktop → Settings → Resources → Memory : augmenter à **4 Go minimum**.

Sur Linux :
```bash
sudo sysctl -w vm.max_map_count=262144
```

### La base de données ne s'initialise pas

Si MySQL a déjà un volume persistant avec une ancienne version :

```bash
docker compose down -v   # Supprime les volumes
docker compose up --build
```

### Les emails ne sont pas reçus dans MailPit

Vérifier que le service MailPit tourne :
```bash
docker compose ps app_mailpit
```

Puis accéder à http://localhost:8025.

### L'application Angular n'est pas à jour après modification

```bash
docker compose up --build app_node
```

---

## Technologies utilisées

- **Frontend** : Angular 13, Angular Material, Bootstrap 4, Chart.js
- **Backend API** : PHP 8.1, Apache
- **Serveur statique** : Node.js 16, Express 4
- **Base de données** : MySQL 8.0
- **Moteur de recherche** : Elasticsearch 7.17, Kibana 7.17
- **Emails** : MailPit
- **Conteneurisation** : Docker, Docker Compose
