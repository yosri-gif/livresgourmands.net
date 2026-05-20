import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="footer-main py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="logo-icon"><i className="bi bi-book-half"></i></div>
                <div>
                  <div className="logo-title text-white">LivresGourmands</div>
                  <div className="logo-sub">Votre librairie culinaire</div>
                </div>
              </div>
              <p style={{ fontSize: '0.87rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                Votre destination pour les meilleurs livres de cuisine, gastronomie et pâtisserie.
                Des recettes authentiques aux techniques modernes.
              </p>
              <div className="d-flex gap-2 mt-3">
                {['facebook', 'instagram', 'twitter-x', 'pinterest'].map(icon => (
                  <a key={icon} href="#" className="d-flex align-items-center justify-content-center"
                    style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}>
                    <i className={`bi bi-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>

            <div className="col-lg-2 col-md-6">
              <h6>Navigation</h6>
              <ul className="list-unstyled" style={{ fontSize: '0.87rem', lineHeight: 2 }}>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/?sort=popularite">Meilleures ventes</Link></li>
                <li><Link to="/?sort=nouveautes">Nouveautés</Link></li>
                <li><Link to="/?promo=true">Promotions</Link></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6">
              <h6>Mon compte</h6>
              <ul className="list-unstyled" style={{ fontSize: '0.87rem', lineHeight: 2 }}>
                <li><Link to="/login">Connexion</Link></li>
                <li><Link to="/register">Créer un compte</Link></li>
                <li><Link to="/cart">Mon panier</Link></li>
                <li><Link to="/listes">Listes cadeaux</Link></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6>Newsletter</h6>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                Recevez nos nouveautés et offres exclusives.
              </p>
              <div className="input-group mt-2">
                <input type="email" className="form-control" placeholder="Votre email..."
                  style={{ borderRadius: '50px 0 0 50px', border: 'none', fontSize: '0.88rem' }} />
                <button className="btn btn-gold" type="button"
                  style={{ borderRadius: '0 50px 50px 0', padding: '0 1.2rem', fontSize: '0.88rem' }}>
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <span>© 2026 LivresGourmands. Tous droits réservés.</span>
          <div className="d-flex gap-3">
            <a href="#">Mentions légales</a>
            <a href="#">CGV</a>
            <a href="#">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
