import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`)
    else navigate('/search')
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar navbar-livres navbar-expand-lg sticky-top">
      <div className="container">

        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div className="logo-icon">
            <i className="bi bi-book-half"></i>
          </div>
          <div>
            <div className="logo-title">LivresGourmands</div>
            <div className="logo-sub">Votre librairie culinaire</div>
          </div>
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {/* Nav links */}
          <ul className="navbar-nav me-auto ms-4 gap-1">
            <li className="nav-item"><Link className="nav-link" to="/?sort=popularite">Meilleures ventes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/?sort=nouveautes">Nouveautés</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/search">Recherche</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/?promo=true">Promotions</Link></li>
          </ul>

          {/* Search */}
          <form className="d-flex mx-3 flex-grow-1" style={{ maxWidth: 360 }} onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control search-bar border-end-0"
                placeholder="Rechercher un livre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="btn btn-outline-secondary border-start-0" type="submit"
                style={{ borderRadius: '0 50px 50px 0', borderColor: '#ddd', background: 'white' }}>
                <i className="bi bi-search text-muted"></i>
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="d-flex align-items-center gap-2 ms-2">
            {user ? (
              <div className="dropdown">
                <button className="btn btn-link text-decoration-none d-flex align-items-center gap-1 text-dark"
                  data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle fs-5" style={{ color: 'var(--primary)' }}></i>
                  <span className="fw-500 d-none d-md-inline" style={{ fontSize: '0.9rem' }}>{user.nom}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: '0.7rem' }}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" style={{ borderRadius: 12 }}>
                  {['administrateur', 'gestionnaire'].includes(user.role) && (
                    <li><Link className="dropdown-item" to="/admin"><i className="bi bi-speedometer2 me-2"></i>Dashboard</Link></li>
                  )}
                  <li><Link className="dropdown-item" to="/commandes"><i className="bi bi-bag me-2"></i>Mes commandes</Link></li>
                  <li><Link className="dropdown-item" to="/listes"><i className="bi bi-gift me-2"></i>Listes cadeaux</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Déconnexion</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="d-flex align-items-center gap-1 text-decoration-none fw-500"
                style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                <i className="bi bi-person fs-5"></i>
                <span className="d-none d-md-inline">Connexion</span>
              </Link>
            )}

            <Link to="/listes" className="icon-btn text-decoration-none">
              <i className="bi bi-gift fs-5" style={{ color: 'var(--gold)' }}></i>
            </Link>

            <Link to="/cart" className="icon-btn text-decoration-none">
              <i className="bi bi-cart2 fs-5" style={{ color: 'var(--primary)' }}></i>
              {count > 0 && <span className="badge-count">{count}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
