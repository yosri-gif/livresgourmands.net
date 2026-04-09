require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Middlewares globaux ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/ouvrages',      require('./routes/ouvrages'));
app.use('/api/categories',    require('./routes/categories'));
app.use('/api/panier',        require('./routes/panier'));
app.use('/api/commandes',     require('./routes/commandes'));
app.use('/api/listes',        require('./routes/listes'));
app.use('/api/commentaires',  require('./routes/commentaires'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', projet: 'livresgourmands.net', timestamp: new Date().toISOString() });
});

// ── 404 ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.path}` });
});

// ── Gestion centralisée des erreurs ──────────────────────────
app.use(errorHandler);

// ── Démarrage ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅  livresgourmands.net — Serveur démarré sur http://localhost:${PORT}`);
  console.log(`    Environnement : ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
