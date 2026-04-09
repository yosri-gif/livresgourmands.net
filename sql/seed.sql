-- ============================================================
-- livresgourmands.net — Données de test
-- Mot de passe de tous les comptes : password123
-- Hash bcrypt (rounds=10) de "password123"
-- ============================================================

USE livresgourmands;

-- Catégories
INSERT INTO categories (nom, description) VALUES
  ('Roman',        'Fiction littéraire et romans'),
  ('Science',      'Sciences exactes et naturelles'),
  ('Informatique', 'Programmation et technologies'),
  ('Histoire',     'Histoire mondiale et biographies'),
  ('Jeunesse',     'Livres pour enfants et adolescents'),
  ('Gastronomie',  'Cuisine, recettes et art culinaire');

-- Utilisateurs (password123 → bcrypt hash)
INSERT INTO users (nom, email, password_hash, role) VALUES
  ('Arfaoui Yosri',     'admin@livresgourmands.net',      '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WvTBpFEFjoRRSVMZTYGy', 'administrateur'),
  ('Jean Éditeur',      'editeur@livresgourmands.net',    '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WvTBpFEFjoRRSVMZTYGy', 'editeur'),
  ('Marie Gestionnaire','gestionnaire@livresgourmands.net','$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WvTBpFEFjoRRSVMZTYGy', 'gestionnaire'),
  ('Alice Dupont',      'alice@example.com',              '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WvTBpFEFjoRRSVMZTYGy', 'client'),
  ('Bob Martin',        'bob@example.com',                '$2b$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WvTBpFEFjoRRSVMZTYGy', 'client');

-- Ouvrages
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES
  ('Le Petit Prince',                  'Antoine de Saint-Exupéry', '978-2-07-040850-4', 'Un classique de la littérature française.',         9.99,  25, 1),
  ('1984',                             'George Orwell',            '978-0-452-28423-4', 'Roman dystopique incontournable.',                  12.50, 15, 1),
  ('Une brève histoire du temps',      'Stephen Hawking',          '978-2-08-081090-2', 'Introduction à la cosmologie moderne.',             14.99, 10, 2),
  ('Clean Code',                       'Robert C. Martin',         '978-0-13-235088-4', 'Écrire du code propre et maintenable.',             39.99,  8, 3),
  ('Node.js Design Patterns',          'Mario Casciaro',           '978-1-78588-583-1', 'Patrons de conception pour Node.js.',               44.99,  5, 3),
  ('Sapiens',                          'Yuval Noah Harari',        '978-2-07-273676-7', 'Une brève histoire de l\'humanité.',                22.00, 20, 4),
  ('Le guide de la cuisine française', 'Auguste Escoffier',        '978-2-01-245678-9', 'La bible de la gastronomie française.',             35.00, 12, 6);

-- Panier actif pour Alice (client id=4)
INSERT INTO panier (client_id, actif) VALUES (4, TRUE);
INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (1, 1, 2, 9.99);

-- Commande existante payée pour Alice (permet de tester les avis)
INSERT INTO commandes (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement)
  VALUES (4, 12.50, 'payee', '123 rue des Lilas, Montréal QC H2X 1Y1', 'standard', 'carte');
INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire)
  VALUES (1, 2, 1, 12.50);

-- Commentaire en attente de validation
INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide)
  VALUES (4, 2, 'Roman magistral, une lecture incontournable !', FALSE);
