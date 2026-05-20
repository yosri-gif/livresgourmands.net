import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', adresse: '', telephone: '',
    password: '', confirmPassword: ''
  })
  const [showPass,  setShowPass]  = useState(false)
  const [error,     setError]     = useState(null)
  const [success,   setSuccess]   = useState(false)

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    const result = await register(`${form.prenom} ${form.nom}`, form.email, form.password)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } else {
      setError(result.message)
    }
  }

  const fields = [
    { label: 'Prénom',                    key: 'prenom',          type: 'text',     placeholder: 'Votre prénom',     icon: 'bi-person' },
    { label: 'Nom',                       key: 'nom',             type: 'text',     placeholder: 'Votre nom',        icon: 'bi-person' },
    { label: 'Adresse email',             key: 'email',           type: 'email',    placeholder: 'votre@email.com', icon: 'bi-envelope' },
    { label: 'Adresse complète',          key: 'adresse',         type: 'text',     placeholder: 'Adresse complète', icon: 'bi-geo-alt' },
    { label: 'Téléphone',                 key: 'telephone',       type: 'tel',      placeholder: '+33 6 00 00 00 00', icon: 'bi-telephone' },
    { label: 'Mot de passe',              key: 'password',        type: 'password', placeholder: 'Minimum 6 caractères', icon: 'bi-lock' },
    { label: 'Confirmer le mot de passe', key: 'confirmPassword', type: 'password', placeholder: 'Répétez votre mot de passe', icon: 'bi-lock-fill' },
  ]

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      <main className="py-4">
        <div className="container" style={{ maxWidth: 500 }}>
          <div className="text-center mb-4">
            <h2 className="fw-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Créez votre compte LivresGourmands
            </h2>
          </div>

          <div className="auth-card">
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2">
                <i className="bi bi-check-circle-fill"></i>
                Compte créé avec succès ! Redirection vers la connexion...
              </div>
            )}
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {fields.map(f => (
                <div key={f.key} className="mb-3">
                  <label className="form-label" style={{ fontWeight: 500, fontSize: '0.9rem' }}>{f.label}</label>
                  <div className="position-relative">
                    <i className={`bi ${f.icon} input-icon`}></i>
                    <input
                      type={f.key.includes('password') ? (showPass ? 'text' : 'password') : f.type}
                      className="form-control form-control-pill"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={set(f.key)}
                      required={!['adresse', 'telephone'].includes(f.key)}
                    />
                    {f.key === 'password' && (
                      <button type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                        onClick={() => setShowPass(!showPass)}
                        style={{ color: '#aaa', zIndex: 5 }}>
                        <i className={`bi bi-eye${showPass ? '-slash' : ''}`}></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button type="submit" className="btn btn-primary w-100 py-3 mt-2"
                disabled={loading || success}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                  : 'Créer un compte'
                }
              </button>
            </form>

            <p className="text-center text-muted mt-4 mb-0" style={{ fontSize: '0.88rem' }}>
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="fw-600 text-decoration-none" style={{ color: 'var(--primary)' }}>
                Connectez-vous
              </Link>
            </p>
          </div>

          {/* Footer features */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4" style={{ fontSize: '0.78rem', color: '#888' }}>
            <span><i className="bi bi-truck me-1"></i>Livraison gratuite dès 50 $ CA</span>
            <span><i className="bi bi-shield-check me-1"></i>Paiement sécurisé</span>
            <span><i className="bi bi-arrow-repeat me-1"></i>Retour gratuit</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
