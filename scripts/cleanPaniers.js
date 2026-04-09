/**
 * livresgourmands.net — Nettoyage des paniers expirés
 * ─────────────────────────────────────────────────────
 * Archive (actif = FALSE) tous les paniers non modifiés depuis plus de 24h.
 *
 * Utilisation manuelle :
 *   node scripts/cleanPaniers.js
 *
 * Planification via cron (tous les jours à 2h00) :
 *   0 2 * * * cd /chemin/vers/livresgourmands && node scripts/cleanPaniers.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../src/db');

(async () => {
  try {
    const [result] = await db.query(
      `UPDATE panier
       SET actif = FALSE
       WHERE actif = TRUE
         AND updated_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );
    console.log(`✅  ${result.affectedRows} panier(s) expiré(s) archivé(s).`);
    process.exit(0);
  } catch (err) {
    console.error('❌  Erreur :', err.message);
    process.exit(1);
  }
})();
