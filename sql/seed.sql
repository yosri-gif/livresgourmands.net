-- ============================================================
-- livresgourmands.net — Données de test
-- Mot de passe de tous les comptes : password123
-- Hash bcrypt (rounds=10) de "password123"
-- ============================================================

USE livresgourmands;

-- Catégories culinaires
INSERT INTO categories (nom, description) VALUES
  ('Cuisine française',     'Recettes et techniques de la gastronomie française traditionnelle'),
  ('Pâtisserie & Desserts', 'L''art de la pâtisserie, gâteaux, tartes et douceurs sucrées'),
  ('Cuisine du monde',      'Voyages culinaires à travers les saveurs des quatre coins du globe'),
  ('Végétarien & Vegan',    'Recettes saines et savoureuses sans viande ni produits animaux'),
  ('BBQ & Grillades',       'Maîtriser le feu : techniques et recettes pour le barbecue et les grillades'),
  ('Boulangerie',           'Pains artisanaux, viennoiseries, brioches et levains maison');

-- Utilisateurs (password123 → bcrypt hash)
INSERT INTO users (nom, email, password_hash, role, actif) VALUES
  ('Arfaoui Yosri',     'admin@livresgourmands.net',       '$2b$10$rraBXsDZ/IG9L/3ityq7yu4FoPks5GB5AKVfABtGgJfaHoFRd3m2m', 'administrateur', 1),
  ('Jean Éditeur',      'editeur@livresgourmands.net',     '$2b$10$rraBXsDZ/IG9L/3ityq7yu4FoPks5GB5AKVfABtGgJfaHoFRd3m2m', 'editeur',         1),
  ('Marie Gestionnaire','gestionnaire@livresgourmands.net','$2b$10$rraBXsDZ/IG9L/3ityq7yu4FoPks5GB5AKVfABtGgJfaHoFRd3m2m', 'gestionnaire',    1),
  ('Alice Dupont',      'alice@example.com',               '$2b$10$rraBXsDZ/IG9L/3ityq7yu4FoPks5GB5AKVfABtGgJfaHoFRd3m2m', 'client',          1),
  ('Bob Martin',        'bob@example.com',                 '$2b$10$rraBXsDZ/IG9L/3ityq7yu4FoPks5GB5AKVfABtGgJfaHoFRd3m2m', 'client',          1);

-- Ouvrages culinaires
INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id) VALUES
  -- Cuisine française (cat 1)
  ('Le Guide de la cuisine française',       'Auguste Escoffier',    '978-2-01-245678-9', 'La bible absolue de la gastronomie française. Sauces, viandes, poissons : toutes les bases classiques expliquées par le maître incontesté de la cuisine française.',                                          44.99, 12, 1),
  ('Larousse Gastronomique',                 'Prosper Montagné',     '978-2-03-584301-2', 'L''encyclopédie de référence de la gastronomie mondiale. Plus de 4 000 recettes, techniques et définitions pour tout savoir sur l''art culinaire.',                                                           59.99,  8, 1),
  ('La Cuisine de Joël Robuchon',            'Joël Robuchon',        '978-2-07-056789-3', 'Le chef le plus étoilé du monde partage ses recettes emblématiques. De la purée de pommes de terre parfaite aux plats gastronomiques accessibles à tous.',                                                    38.50, 15, 1),
  ('Recettes bistrot — Tradition & Saveurs', 'Yves Camdeborde',      '978-2-84-123456-1', 'Bœuf bourguignon, cassoulet, tarte Tatin : les grands classiques du bistrot français revisités avec générosité. Une cuisine du terroir authentique et réconfortante.',                                        29.99, 20, 1),

  -- Pâtisserie & Desserts (cat 2)
  ('La Pâtisserie de Référence',             'Christophe Felder',    '978-2-08-124099-4', 'Le manuel complet de pâtisserie professionnelle adapté aux amateurs passionnés. Plus de 230 recettes avec étapes détaillées et photos. Incontournable pour tout passionné de sucre.',                        49.95, 10, 2),
  ('Encyclopédie du Chocolat',               'Frédéric Bau',         '978-2-08-124600-2', 'Tout sur le chocolat, de la fève à la tablette. Ganaches, mousses, pralinés, tempérage : le chef de l''École Valrhona révèle tous ses secrets pour sublimer cet ingrédient d''exception.',                 42.00,  7, 2),
  ('Les Desserts de Pierre Hermé',           'Pierre Hermé',         '978-2-23-001234-7', 'Le pape de la pâtisserie française dévoile ses créations les plus iconiques : macarons, tartes infiniment citron, Ispahan... Un livre d''art autant qu''un livre de recettes.',                             55.00,  5, 2),
  ('Pâtisserie maison — Gâteaux & Tartes',  'Mercotte',             '978-2-01-388765-0', 'Les meilleures recettes de la jurée de l''émission Le Meilleur Pâtissier. Clairs, précis et illustrés pas à pas, ces 80 recettes sont à la portée de tous, même des débutants.',                           27.90, 18, 2),

  -- Cuisine du monde (cat 3)
  ('Sushi & Sashimi — L''art japonais',      'Nobu Matsuhisa',       '978-2-84-567890-2', 'Le chef Nobu révèle les secrets de la cuisine japonaise : découpe du poisson, préparation du riz à sushi, rouleaux makis et sashimis. Une initiation rigoureuse à un art millénaire.',                      36.00,  9, 3),
  ('Curry & Épices — Voyage en Inde',        'Madhur Jaffrey',       '978-0-09-188839-5', 'La référence de la cuisine indienne en occident. Currys, biryanis, tandooris et dals : 200 recettes parfumées d''épices avec conseils pour composer son propre mélange de masala.',                          32.50, 14, 3),
  ('La Cuisine italienne authentique',       'Marcella Hazan',       '978-0-34-585098-8', 'Les fondamentaux de la vraie cuisine italienne : pâtes fraîches maison, risottos, osso buco et tiramisu. Un tour complet des régions d''Italie à travers 300 recettes indispensables.',                     34.99, 11, 3),
  ('Mezze & Saveurs du Moyen-Orient',        'Yotam Ottolenghi',     '978-1-84-533477-4', 'Un voyage sensoriel de Jérusalem à Beyrouth. Houmous, falafels, tabboulé, kebbé : les recettes emblématiques du Levant revisitées avec créativité et générosité par l''auteur de Jerusalem.',              39.00,  6, 3),
  ('Tacos & Cuisine mexicaine',              'Rick Bayless',         '978-0-74-324540-3', 'Bien plus que des tacos : moles complexes, enchiladas, guacamole et salsas fraîches. Le guide ultime pour explorer toute la richesse et la diversité de la gastronomie mexicaine authentique.',             31.50, 13, 3),

  -- Végétarien & Vegan (cat 4)
  ('Végétarien — 200 recettes du quotidien', 'Alice Waters',         '978-2-01-237654-3', 'Des recettes végétariennes savoureuses et équilibrées pour toute la semaine. Soupes, salades, plats mijotés et légumes grillés : prouver que manger sans viande, c''est délicieux.',                       26.99, 22, 4),
  ('Vegan pour tous — La bible',             'Isa Chandra Moskowitz','978-0-73-821562-4', 'Plus de 200 recettes veganes accessibles, gourmandes et variées. Burgers de légumineuses, fromages végétaux, desserts sans œufs : une cuisine végétale qui régale tout le monde.',                         33.00, 16, 4),
  ('Salade Repas — Créatives & Nourrissantes','Ottavia Romano',      '978-2-84-999123-6', 'La salade réinventée en plat complet et satisfaisant. Céréales, légumineuses, légumes rôtis, graines et sauces créatives pour 60 recettes de salades repas rassasiantes.',                                 24.90, 25, 4),

  -- BBQ & Grillades (cat 5)
  ('La Bible du BBQ',                        'Steven Raichlen',      '978-0-76-111979-5', 'LE livre de référence mondial sur le barbecue. Côtes levées, brisket texan, poulet fumé, légumes grillés : 500 recettes et toutes les techniques de fumage, marinade et cuisson sur feu.',                 45.00, 10, 5),
  ('Grill Master — Viandes & Marinades',     'Francis Mallmann',     '978-1-57-965488-7', 'Le maître argentin du feu partage sa philosophie et ses techniques de cuisson à la braise. Asados, légumes cendres, sauces chimichurri : la cuisine du feu portée au rang d''art.',                       41.50,  6, 5),
  ('Fumage & Slow BBQ',                      'Aaron Franklin',       '978-1-60-774678-6', 'Le fondateur du restaurant BBQ le plus réputé du Texas dévoile tous ses secrets. Sélection du bois, contrôle de la température, timing : tout pour réussir un brisket de compétition.',                   37.99,  8, 5),

  -- Boulangerie (cat 6)
  ('Le Pain artisanal au levain',            'Chad Robertson',       '978-1-45-210258-4', 'La méthode révolutionnaire de la boulangerie Tartine (San Francisco) pour faire son pain au levain maison. Hydratation, fermentation longue, façonnage et cuisson en cocotte.',                            38.00, 11, 6),
  ('Viennoiseries & Brioches maison',        'Christophe Michalak',  '978-2-23-001567-6', 'Croissants feuilletés, pains au chocolat, brioches tressées et kouign-amann : le chef pâtissier démystifie les viennoiseries et guide pas à pas vers des résultats de boulangerie.',                      35.90,  9, 6),
  ('Boulangerie naturelle — Sans gluten',    'Isabelle Huot',        '978-2-89-695432-1', 'Des pains savoureux et moelleux sans gluten, à base de farines alternatives (riz, sarrasin, teff, manioc). Idéal pour les personnes intolérantes ou souhaitant diversifier leurs farines.',               29.50, 14, 6);

-- Panier actif pour Alice (client id=4) — livre id=1
INSERT INTO panier (client_id, actif) VALUES (4, TRUE);
INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (1, 1, 2, 44.99);

-- Commande existante payée pour Alice — livre id=2
INSERT INTO commandes (client_id, total, statut, adresse_livraison, mode_livraison, mode_paiement)
  VALUES (4, 59.99, 'payee', '123 rue des Lilas, Montréal QC H2X 1Y1', 'standard', 'carte');
INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire)
  VALUES (1, 2, 1, 59.99);

-- Commentaire en attente de validation
INSERT INTO commentaires (client_id, ouvrage_id, contenu, valide)
  VALUES (4, 2, 'Une encyclopédie impressionnante, indispensable dans toute cuisine !', FALSE);
