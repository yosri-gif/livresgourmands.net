# livresgourmands.net — API REST

**Cours : Programmation Web avancée [420-WA6-AG]**
**Étape 02 : De la modélisation à l'API (BD + Express + JWT)**
**Session : Hiver 2026 | Enseignant : Kahina TAMAZOUZT**

---

## Présentation du projet

**livresgourmands.net** est une librairie en ligne spécialisée. Ce dépôt contient le backend complet : une API REST construite avec **Node.js + Express**, connectée à une base **MySQL**, avec authentification **JWT + bcrypt**, gestion des rôles, validation des entrées (Joi), et toutes les règles métier demandées (stock transactionnel, avis conditionnels, modération des commentaires, listes de cadeaux).

---

## Membre et répartition des tâches

| Membre | Rôle | Tâches réalisées |
|--------|------|-----------------|
| **Arfaoui Yosri** | Développeur unique | Modélisation BD, schéma SQL, tous les endpoints REST, authentification JWT/bcrypt, middleware de rôles, validation Joi, règles métier, script cron, documentation Postman, rapport technique |

---

## Technologies utilisées

| Technologie | Usage |
|-------------|-------|
| Node.js 20+ | Runtime JavaScript |
| Express 4 | Framework HTTP |
| MySQL 8 (XAMPP) | Base de données relationnelle |
| mysql2 | Driver MySQL pour Node.js |
| jsonwebtoken | Génération et vérification JWT |
| bcrypt | Hachage des mots de passe |
| Joi | Validation des entrées |
| uuid | Génération des codes de partage |
| dotenv | Variables d'environnement |
| nodemon | Rechargement automatique (dev) |

---

## Installation et exécution locale

### Prérequis
- Node.js ≥ 18 installé ([nodejs.org](https://nodejs.org))
- XAMPP avec MySQL démarré ([apachefriends.org](https://apachefriends.org))

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/arfaouiyosri/livresgourmands.git
cd livresgourmands

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration
cp .env.example .env
# Puis ouvrir .env et remplir DB_PASSWORD si nécessaire

# 4. Créer la base de données (via phpMyAdmin ou terminal)
#    → Ouvrir phpMyAdmin, onglet SQL, coller le contenu de sql/schema.sql, Exécuter
#    → Puis coller sql/seed.sql de la même façon

# 5. Démarrer le serveur
npm start
```

Le serveur démarre sur **http://localhost:3000**

```
✅  livresgourmands.net — Serveur démarré sur http://localhost:3000
```

### Variables d'environnement (.env)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=          # vide par défaut avec XAMPP
DB_NAME=livresgourmands
JWT_SECRET=livresgourmands_secret_jwt_2026_changer_en_prod
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

---

## Comptes de test (après exécution de seed.sql)

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@livresgourmands.net | password123 | administrateur |
| editeur@livresgourmands.net | password123 | editeur |
| gestionnaire@livresgourmands.net | password123 | gestionnaire |
| alice@example.com | password123 | client |
| bob@example.com | password123 | client |

---

## Endpoints disponibles

### Auth & Utilisateurs

| Méthode | Endpoint | Auth requise | Description |
|---------|----------|-------------|-------------|
| POST | `/api/auth/register` | — | Inscription (hash bcrypt) |
| POST | `/api/auth/login` | — | Connexion → retourne JWT |
| GET | `/api/users/me` | JWT | Mon profil |
| PUT | `/api/users/:id` | JWT (owner ou admin) | Modifier un utilisateur |
| GET | `/api/users` | Admin | Liste tous les utilisateurs |

### Produits & Catégories

| Méthode | Endpoint | Auth requise | Description |
|---------|----------|-------------|-------------|
| GET | `/api/ouvrages` | — | Liste (stock > 0). Filtres : `?search=`, `?categorie=`, `?sort=popularite\|prix_asc\|prix_desc` |
| GET | `/api/ouvrages/:id` | — | Détail + avis + commentaires validés |
| POST | `/api/ouvrages` | gestionnaire / editeur | Créer un ouvrage |
| PUT | `/api/ouvrages/:id` | gestionnaire / editeur | Modifier un ouvrage |
| DELETE | `/api/ouvrages/:id` | gestionnaire / admin | Supprimer un ouvrage |
| GET | `/api/categories` | — | Liste des catégories |
| POST | `/api/categories` | editeur / gestionnaire | Créer une catégorie |
| PUT | `/api/categories/:id` | editeur / gestionnaire | Modifier |
| DELETE | `/api/categories/:id` | gestionnaire / admin | Supprimer |

### Panier

| Méthode | Endpoint | Auth requise | Description |
|---------|----------|-------------|-------------|
| GET | `/api/panier` | JWT | Voir le panier actif |
| POST | `/api/panier/items` | JWT | Ajouter un article |
| PUT | `/api/panier/items/:id` | JWT | Modifier la quantité |
| DELETE | `/api/panier/items/:id` | JWT | Retirer un article |

### Commandes

| Méthode | Endpoint | Auth requise | Description |
|---------|----------|-------------|-------------|
| POST | `/api/commandes` | JWT | Créer commande (décrémente stock, transactionnel) |
| GET | `/api/commandes` | JWT | Historique (client : les siennes ; admin : toutes) |
| GET | `/api/commandes/:id` | JWT | Détail d'une commande |
| PUT | `/api/commandes/:id/status` | gestionnaire / admin | Changer le statut |

### Listes de cadeaux

| Méthode | Endpoint | Auth requise | Description |
|---------|----------|-------------|-------------|
| POST | `/api/listes` | JWT | Créer une liste (génère code_partage) |
| GET | `/api/listes/:code` | — | Consulter par code (accessible à un ami) |
| POST | `/api/listes/:id/items` | JWT | Ajouter un ouvrage à la liste |
| POST | `/api/listes/:id/acheter` | JWT | Achat direct depuis la liste |

### Avis & Commentaires

| Méthode | Endpoint | Auth requise | Description |
|---------|----------|-------------|-------------|
| POST | `/api/ouvrages/:id/avis` | JWT | Ajouter un avis (vérif achat obligatoire) |
| POST | `/api/ouvrages/:id/commentaires` | JWT | Soumettre commentaire (valide=false) |
| GET | `/api/commentaires/pending` | editeur / admin | Commentaires en attente |
| PUT | `/api/commentaires/:id/valider` | editeur / admin | Valider ou rejeter |

---

## Exemples de requêtes curl

```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Jean Dupont","email":"jean@test.com","password":"motdepasse123"}'

# Connexion (récupérer le token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

# Lister les ouvrages avec recherche
curl "http://localhost:3000/api/ouvrages?search=1984"

# Ajouter un article au panier
curl -X POST http://localhost:3000/api/panier/items \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"ouvrage_id":2,"quantite":1}'

# Créer une commande
curl -X POST http://localhost:3000/api/commandes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"adresse_livraison":"123 rue des Lilas, Montréal QC","mode_livraison":"standard","mode_paiement":"carte"}'

# Laisser un avis (client doit avoir acheté l'ouvrage)
curl -X POST http://localhost:3000/api/ouvrages/2/avis \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"note":5,"commentaire":"Excellent !"}'

# Valider un commentaire (éditeur)
curl -X PUT http://localhost:3000/api/commentaires/1/valider \
  -H "Authorization: Bearer <TOKEN_EDITEUR>" \
  -H "Content-Type: application/json" \
  -d '{"action":"valider"}'

# Créer une liste de cadeaux
curl -X POST http://localhost:3000/api/listes \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"nom":"Ma liste de Noël"}'
```

---

## Structure du projet

```
livresgourmands/
├── src/
│   ├── app.js                        ← Point d'entrée Express
│   ├── db.js                         ← Pool de connexion MySQL
│   ├── controllers/
│   │   ├── authController.js         ← register, login
│   │   ├── usersController.js        ← getMe, listUsers, updateUser
│   │   ├── ouvragesController.js     ← CRUD ouvrages
│   │   ├── categoriesController.js   ← CRUD catégories
│   │   ├── panierController.js       ← panier + items
│   │   ├── commandesController.js    ← commandes (transactionnel)
│   │   ├── avisController.js         ← avis + commentaires
│   │   └── listesController.js       ← listes cadeaux
│   ├── middleware/
│   │   ├── auth.js                   ← authenticate, authorize (JWT + rôles)
│   │   └── errorHandler.js           ← gestion centralisée des erreurs
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── ouvrages.js
│   │   ├── categories.js
│   │   ├── panier.js
│   │   ├── commandes.js
│   │   ├── listes.js
│   │   └── commentaires.js
│   └── validators/
│       └── index.js                  ← tous les schémas Joi
├── sql/
│   ├── schema.sql                    ← DDL : 12 tables
│   └── seed.sql                      ← données de test
├── scripts/
│   └── cleanPaniers.js               ← archivage paniers expirés (cron)
├── docs/
│   ├── postman_collection.json       ← collection Postman complète
│   └── rapport.pdf                   ← rapport technique
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Script cron — Paniers expirés

```bash
# Exécution manuelle
node scripts/cleanPaniers.js

# Planification automatique (cron, tous les jours à 2h)
0 2 * * * cd /chemin/vers/livresgourmands && node scripts/cleanPaniers.js
```
