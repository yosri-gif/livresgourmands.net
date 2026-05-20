import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const FALLBACK = 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=200&q=80'

export default function CartPage() {
  const { items, updateQuantite, removeItem, total, clearCart } = useCart()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')
  const [promoMsg,  setPromoMsg]  = useState(null)

  const TVA_RATE = 0.055
  const tva = total * TVA_RATE
  const livraison = total >= 50 ? 0 : 4.99
  const totalFinal = total + tva + livraison

  const handlePromo = () => {
    if (promoCode.toUpperCase() === 'CUISINE10') {
      setPromoMsg({ type: 'success', text: 'Code promo appliqué : -10% !' })
    } else {
      setPromoMsg({ type: 'danger', text: 'Code promo invalide.' })
    }
  }

  const handleCommande = () => {
    if (!token) { navigate('/login'); return }
    alert('Fonctionnalité de paiement à intégrer.')
  }

  if (items.length === 0) return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container py-5 text-center" style={{ maxWidth: 500 }}>
        <i className="bi bi-bag-x" style={{ fontSize: '4rem', color: '#ccc' }}></i>
        <h3 className="mt-3 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Votre panier est vide</h3>
        <p className="text-muted mb-4">Découvrez notre sélection de livres de cuisine et commencez votre collection.</p>
        <Link to="/" className="btn btn-primary px-5 py-3">
          <i className="bi bi-arrow-left me-2"></i> Continuer mes achats
        </Link>
      </div>
      <Footer />
    </div>
  )

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container py-4">
        <h1 className="mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Mon panier</h1>
        <p className="text-muted mb-4">{items.length} article{items.length > 1 ? 's' : ''} dans votre panier</p>

        <div className="row g-4">
          {/* ── Liste des articles ── */}
          <div className="col-lg-8">
            {/* En-tête desktop */}
            <div className="d-none d-md-flex bg-white rounded-3 px-4 py-2 mb-3 shadow-sm"
              style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              <span style={{ flex: 2 }}>Produit</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Prix unitaire</span>
              <span style={{ flex: 1, textAlign: 'center' }}>Quantité</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
              <span style={{ width: 40 }}></span>
            </div>

            {items.map(item => (
              <div key={item.id} className="cart-item mb-3">
                {/* Desktop layout */}
                <div className="d-none d-md-flex align-items-center gap-3">
                  <img src={item.imageUrl || FALLBACK} alt={item.titre}
                    className="cart-img" onError={e => { e.target.src = FALLBACK }} />
                  <div style={{ flex: 2, minWidth: 0 }}>
                    <Link to={`/product/${item.id}`} className="text-decoration-none">
                      <h6 className="mb-0 fw-600" style={{ fontFamily: 'Poppins,sans-serif', color: 'var(--text-dark)' }}>
                        {item.titre}
                      </h6>
                    </Link>
                    <small className="text-muted">{item.auteur}</small>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{Number(item.prix_unitaire).toFixed(2)} $ CA</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button className="qty-btn" onClick={() => updateQuantite(item.id, item.quantite - 1)}>
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="qty-display">{item.quantite}</span>
                      <button className="qty-btn" onClick={() => updateQuantite(item.id, item.quantite + 1)}>
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {(item.prix_unitaire * item.quantite).toFixed(2)} $ CA
                    </span>
                  </div>
                  <button className="btn btn-link text-danger p-1" onClick={() => removeItem(item.id)}>
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>

                {/* Mobile layout */}
                <div className="d-flex d-md-none gap-3">
                  <img src={item.imageUrl || FALLBACK} alt={item.titre}
                    style={{ width: 70, height: 90, objectFit: 'cover', borderRadius: 8 }}
                    onError={e => { e.target.src = FALLBACK }} />
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h6 className="mb-0 fw-600" style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.9rem' }}>{item.titre}</h6>
                      <button className="btn btn-link text-danger p-0" onClick={() => removeItem(item.id)}>
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                    <small className="text-muted">{item.auteur}</small>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                      <div className="d-flex align-items-center gap-2">
                        <button className="qty-btn" onClick={() => updateQuantite(item.id, item.quantite - 1)}>
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="qty-display">{item.quantite}</span>
                        <button className="qty-btn" onClick={() => updateQuantite(item.id, item.quantite + 1)}>
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        {(item.prix_unitaire * item.quantite).toFixed(2)} $ CA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Code promo */}
            <div className="bg-white rounded-3 p-4 shadow-sm mt-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-tag" style={{ color: 'var(--primary)' }}></i>
                <span className="fw-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Code promo</span>
              </div>
              <div className="input-group">
                <input type="text" className="form-control"
                  placeholder="Entrez votre code..."
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ borderRadius: '8px 0 0 8px' }} />
                <button className="btn btn-gold" onClick={handlePromo}
                  style={{ borderRadius: '0 8px 8px 0' }}>
                  Appliquer
                </button>
              </div>
              {promoMsg && (
                <div className={`alert alert-${promoMsg.type} py-2 mt-2 mb-0`} style={{ fontSize: '0.85rem' }}>
                  {promoMsg.text}
                </div>
              )}
            </div>

            {/* Continuer */}
            <div className="mt-3">
              <Link to="/" className="btn btn-outline-primary">
                <i className="bi bi-arrow-left me-2"></i> Continuer mes achats
              </Link>
            </div>
          </div>

          {/* ── Récapitulatif ── */}
          <div className="col-lg-4">
            <div className="cart-summary">
              <h5 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Récapitulatif</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Sous-total</span>
                <span className="fw-500">{total.toFixed(2)} $ CA</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">TVA (5,5%)</span>
                <span className="fw-500">{tva.toFixed(2)} $ CA</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Livraison</span>
                <span className={livraison === 0 ? 'text-success fw-600' : 'fw-500'}>
                  {livraison === 0 ? 'Gratuite' : `${livraison.toFixed(2)} $ CA`}
                </span>
              </div>
              {livraison > 0 && (
                <div className="alert py-2 mb-3" style={{ background: 'rgba(139,0,0,0.06)', border: 'none', fontSize: '0.82rem', color: 'var(--primary)' }}>
                  <i className="bi bi-truck me-1"></i>
                  Plus que {(50 - total).toFixed(2)} $ CA pour la livraison gratuite !
                </div>
              )}

              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-700" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.05rem' }}>Total</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)', fontFamily: 'Poppins, sans-serif' }}>
                  {totalFinal.toFixed(2)} $ CA
                </span>
              </div>

              <button className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-2"
                style={{ fontSize: '1rem' }}
                onClick={handleCommande}>
                <i className="bi bi-lock-fill"></i> Passer la commande
              </button>
              <button className="btn btn-outline-secondary w-100 py-2" style={{ borderRadius: 50 }}
                onClick={clearCart}>
                <i className="bi bi-trash me-1"></i> Vider le panier
              </button>

              {/* Sécurité */}
              <div className="d-flex justify-content-center gap-3 mt-4" style={{ color: '#aaa', fontSize: '0.75rem' }}>
                <span><i className="bi bi-shield-check me-1"></i>Paiement sécurisé</span>
                <span><i className="bi bi-lock me-1"></i>SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
