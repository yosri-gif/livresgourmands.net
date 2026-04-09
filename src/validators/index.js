const Joi = require('joi');

/** Applique un schéma Joi au body de la requête */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      message: 'Données invalides.',
      erreurs: error.details.map((d) => d.message),
    });
  }
  next();
};

/* ---- Auth ---- */
const registerSchema = Joi.object({
  nom:      Joi.string().min(2).max(100).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

/* ---- Ouvrages ---- */
const ouvrageSchema = Joi.object({
  titre:        Joi.string().min(1).max(255).required(),
  auteur:       Joi.string().min(1).max(150).required(),
  isbn:         Joi.string().max(20).optional().allow(null, ''),
  description:  Joi.string().optional().allow(''),
  prix:         Joi.number().min(0).required(),
  stock:        Joi.number().integer().min(0).required(),
  categorie_id: Joi.number().integer().optional().allow(null),
});

const ouvrageUpdateSchema = ouvrageSchema.fork(
  ['titre', 'auteur', 'prix', 'stock'],
  (f) => f.optional()
);

/* ---- Catégories ---- */
const categorieSchema = Joi.object({
  nom:         Joi.string().min(1).max(100).required(),
  description: Joi.string().optional().allow(''),
});

/* ---- Panier ---- */
const panierItemSchema = Joi.object({
  ouvrage_id: Joi.number().integer().required(),
  quantite:   Joi.number().integer().min(1).required(),
});

const panierItemUpdateSchema = Joi.object({
  quantite: Joi.number().integer().min(1).required(),
});

/* ---- Commandes ---- */
const commandeSchema = Joi.object({
  adresse_livraison: Joi.string().min(5).required(),
  mode_livraison:    Joi.string().optional().allow(''),
  mode_paiement:     Joi.string().optional().allow(''),
});

/* ---- Avis ---- */
const avisSchema = Joi.object({
  note:        Joi.number().integer().min(1).max(5).required(),
  commentaire: Joi.string().optional().allow(''),
});

/* ---- Commentaires ---- */
const commentaireSchema = Joi.object({
  contenu: Joi.string().min(1).required(),
});

/* ---- Listes cadeaux ---- */
const listeSchema = Joi.object({
  nom: Joi.string().min(1).max(150).required(),
});

const listeItemSchema = Joi.object({
  ouvrage_id:         Joi.number().integer().required(),
  quantite_souhaitee: Joi.number().integer().min(1).optional(),
});

module.exports = {
  validate,
  registerSchema, loginSchema,
  ouvrageSchema, ouvrageUpdateSchema,
  categorieSchema,
  panierItemSchema, panierItemUpdateSchema,
  commandeSchema,
  avisSchema,
  commentaireSchema,
  listeSchema, listeItemSchema,
};
