import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [rememberMe,  setRememberMe]  = useState(false)
  const [error,       setError]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const result = await login(email, password)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.message)
    }
  }

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      <main className="py-5">
        <div className="container" style={{ maxWidth: 480 }}>
          {/* Logo centré */}
          <div className="text-center mb-4">
            <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 mb-4">
              <div className="logo-icon" style={{ width: 56, height: 56, borderRadius: 16 }}>
                <i className="bi bi-book-half" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <div className="text-start">
                <div className="logo-title" style={{ fontSize: '1.4rem' }}>LivresGourmands</div>
                <div className="logo-sub" style={{ fontSize: '0.8rem' }}>Votre librairie culinaire</div>
              </div>
            </Link>
            <h2 className="fw-700 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Bon retour parmi nous</h2>
            <p className="text-muted">Connectez-vous pour accéder à votre compte</p>
          </div>

          <div className="auth-card">
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Adresse email
                </label>
                <div className="position-relative">
                  <i className="bi bi-envelope input-icon"></i>
                  <input type="email" className="form-control form-control-pill"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Mot de passe
                </label>
                <div className="position-relative">
                  <i className="bi bi-lock input-icon"></i>
                  <input type={showPass ? 'text' : 'password'}
                    className="form-control form-control-pill"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required />
                  <button type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                    onClick={() => setShowPass(!showPass)}
                    style={{ color: '#aaa', zIndex: 5 }}>
                    <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
                  </button>
                </div>
              </div>

              {/* Remember me + forgot */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe"
                    checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    style={{ accentColor: 'var(--primary)' }} />
                  <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '0.88rem' }}>
                    Se souvenir de moi
                  </label>
                </div>
                <Link to="/forgot-password" className="text-decoration-none fw-600"
                  style={{ color: 'var(--primary)', fontSize: '0.88rem' }}>
                  Mot de passe oublié ?
                </Link>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 mb-3"
                style={{ fontSize: '1rem' }}
                disabled={loading}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Connexion...</>
                  : 'Se connecter'
                }
              </button>
            </form>

            {/* Divider */}
            <div className="divider-text text-muted my-4" style={{ fontSize: '0.85rem' }}>
              <span className="px-3 bg-white">ou</span>
            </div>

            <Link to="/register" className="btn btn-outline-primary w-100 py-3"
              style={{ fontSize: '1rem' }}>
              Créer un compte
            </Link>
          </div>

          {/* Info box */}
          <div className="mt-3 p-3 rounded-3 d-flex gap-3 align-items-start"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.8)' }}>
            <div className="feature-icon flex-shrink-0" style={{ width: 44, height: 44 }}>
              <i className="bi bi-person-check-fill"></i>
            </div>
            <div>
              <div className="fw-600" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.92rem' }}>
                Rejoignez notre communauté
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.82rem' }}>
                Accédez à vos listes de souhaits, suivez vos commandes et découvrez des recommandations personnalisées.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
