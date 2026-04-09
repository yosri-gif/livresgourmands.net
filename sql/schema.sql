-- ============================================================
-- livresgourmands.net — Schéma de base de données
-- Cours : Programmation Web avancée [420-WA6-AG]
-- Auteur : Arfaoui Yosri
-- ============================================================

CREATE DATABASE IF NOT EXISTS livresgourmands
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE livresgourmands;

-- ------------------------------------------------------------
-- 1. users
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('client','editeur','gestionnaire','administrateur') NOT NULL DEFAULT 'client',
  actif         BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. categories
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- ------------------------------------------------------------
-- 3. ouvrages
-- ------------------------------------------------------------
CREATE TABLE ouvrages (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  titre        VARCHAR(255)   NOT NULL,
  auteur       VARCHAR(150)   NOT NULL,
  isbn         VARCHAR(20)    UNIQUE,
  description  TEXT,
  prix         DECIMAL(10,2)  NOT NULL CHECK (prix >= 0),
  stock        INT            NOT NULL DEFAULT 0 CHECK (stock >= 0),
  categorie_id INT,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 4. panier
-- ------------------------------------------------------------
CREATE TABLE panier (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  client_id  INT     NOT NULL,
  actif      BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. panier_items
-- ------------------------------------------------------------
CREATE TABLE panier_items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  panier_id      INT           NOT NULL,
  ouvrage_id     INT           NOT NULL,
  quantite       INT           NOT NULL CHECK (quantite > 0),
  prix_unitaire  DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (panier_id)  REFERENCES panier(id)   ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 6. commandes
-- ------------------------------------------------------------
CREATE TABLE commandes (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  client_id           INT           NOT NULL,
  date                DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  total               DECIMAL(10,2) NOT NULL,
  statut              ENUM('en_cours','payee','annulee','expediee') NOT NULL DEFAULT 'en_cours',
  adresse_livraison   TEXT          NOT NULL,
  mode_livraison      VARCHAR(50),
  mode_paiement       VARCHAR(50),
  payment_provider_id VARCHAR(255),
  created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- 7. commande_items
-- ------------------------------------------------------------
CREATE TABLE commande_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  commande_id   INT           NOT NULL,
  ouvrage_id    INT           NOT NULL,
  quantite      INT           NOT NULL CHECK (quantite > 0),
  prix_unitaire DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id)  REFERENCES ouvrages(id)  ON DELETE RESTRICT
);

-- ------------------------------------------------------------
-- 8. listes_cadeaux
-- ------------------------------------------------------------
CREATE TABLE listes_cadeaux (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  nom            VARCHAR(150) NOT NULL,
  proprietaire_id INT         NOT NULL,
  code_partage   VARCHAR(64)  NOT NULL UNIQUE,
  date_creation  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 9. liste_items
-- ------------------------------------------------------------
CREATE TABLE liste_items (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  liste_id          INT NOT NULL,
  ouvrage_id        INT NOT NULL,
  quantite_souhaitee INT NOT NULL DEFAULT 1,
  FOREIGN KEY (liste_id)   REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)       ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 10. avis
-- ------------------------------------------------------------
CREATE TABLE avis (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  client_id   INT NOT NULL,
  ouvrage_id  INT NOT NULL,
  note        INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  date        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_avis_client_ouvrage (client_id, ouvrage_id),
  FOREIGN KEY (client_id)  REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 11. commentaires
-- ------------------------------------------------------------
CREATE TABLE commentaires (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  client_id        INT      NOT NULL,
  ouvrage_id       INT      NOT NULL,
  contenu          TEXT     NOT NULL,
  valide           BOOLEAN  NOT NULL DEFAULT FALSE,
  date_soumission  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_validation  DATETIME,
  valide_par       INT,
  FOREIGN KEY (client_id)  REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
  FOREIGN KEY (valide_par) REFERENCES users(id)    ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 12. payments (optionnel)
-- ------------------------------------------------------------
CREATE TABLE payments (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  commande_id         INT           NOT NULL,
  provider            VARCHAR(50),
  provider_payment_id VARCHAR(255),
  statut              VARCHAR(50),
  amount              DECIMAL(10,2) NOT NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Index supplémentaires pour les performances
-- ------------------------------------------------------------
CREATE INDEX idx_ouvrages_categorie  ON ouvrages(categorie_id);
CREATE INDEX idx_ouvrages_stock      ON ouvrages(stock);
CREATE INDEX idx_commandes_client    ON commandes(client_id);
CREATE INDEX idx_avis_ouvrage        ON avis(ouvrage_id);
CREATE INDEX idx_commentaires_ouvrage ON commentaires(ouvrage_id);
