import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ouvragesAPI } from '../services/api'
import { useCart } from '../context/CartContext'

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1774415108812-9c3a82d75c46?w=700&q=80',
  'https://images.unsplash.com/photo-1606658635765-9eb667a8f063?w=700&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80',
]

function Stars({ rating, size = '1rem' }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <i key={i}
          className={`bi bi-star${i <= Math.floor(rating) ? '-fill' : (i - 0.5 <= rating ? '-half' : '')}`}
          style={{ color: i <= Math.round(rating) ? 'var(--gold)' : '#ddd', fontSize: size }}></i>
      ))}
    </span>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [book,     setBook]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [qty,      setQty]      = useState(1)
  const [wished,   setWished]   = useState(false)
  const [added,    setAdded]    = useState(false)

  useEffect(() => {
    ouvragesAPI.get(id)
      .then(({ data }) => {
        setBook({ ...data, imageUrl: DEMO_IMAGES[id % DEMO_IMAGES.length] })
      })
      .catch(() => setError('Ouvrage introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddCart = () => {
    addItem({ ...book, imageUrl: book.imageUrl }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
      </div>
    </div>
  )

  if (error || !book) return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container py-5 text-center">
        <i className="bi bi-exclamation-circle" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
        <h4 className="mt-3">{error}</h4>
        <Link to="/" className="btn btn-primary mt-3">Retour à l'accueil</Link>
      </div>
      <Footer />
    </div>
  )

  const discount = book.originalPrice
    ? Math.round((1 - book.prix / book.originalPrice) * 100)
    : null

  const ratingBars = [5,4,3,2,1].map(star => ({
    star,
    pct: star === 5 ? 75 : star === 4 ? 20 : 5,
  }))

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Accueil</Link></li>
            {book.categorie_nom && (
              <li className="breadcrumb-item">
                <Link to={`/?categorie=${book.categorie_id}`}>{book.categorie_nom}</Link>
              </li>
            )}
            <li className="breadcrumb-item active">{book.titre}</li>
          </ol>
        </nav>

        <div className="row g-4 g-lg-5">
          {/* ── Image ── */}
          <div className="col-md-5">
            <div className="product-img-wrap" style={{ borderRadius: 'var(--radius-card)' }}>
              <img src={book.imageUrl} alt={book.titre}
                style={{ width: '100%', borderRadius: 'var(--radius-card)', maxHeight: 520, objectFit: 'cover' }}
                onError={e => { e.target.src = DEMO_IMAGES[0] }} />
              <button className="btn-wish-large" onClick={() => setWished(!wished)}>
                <i className={`bi bi-heart${wished ? '-fill' : ''}`}
                  style={{ color: wished ? 'var(--primary)' : '#888' }}></i>
              </button>
            </div>

            {/* Feature boxes */}
            <div className="row g-2 mt-3">
              {[
                { icon: 'bi-truck', label: 'Livraison rapide' },
                { icon: 'bi-arrow-repeat', label: 'Retour 30 jours' },
                { icon: 'bi-shield-check', label: 'Paiement sécurisé' },
              ].map(f => (
                <div key={f.label} className="col-4">
                  <div className="feature-box">
                    <i className={`bi ${f.icon} d-block mb-1`} style={{ color: 'var(--primary)', fontSize: '1.4rem' }}></i>
                    <small>{f.label}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Infos ── */}
          <div className="col-md-7">
            {book.categorie_nom && (
              <span className="badge-cat mb-2 d-inline-block">{book.categorie_nom}</span>
            )}
            <h1 className="mb-2" style={{ fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>{book.titre}</h1>
            <p className="text-muted mb-2">par {book.auteur}</p>

            {/* Stars */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <Stars rating={book.note_moyenne || 4.8} size="1rem" />
              <span style={{ fontWeight: 700 }}>{(book.note_moyenne || 4.8).toFixed(1)}</span>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>({book.nb_avis || 128} avis)</span>
            </div>

            {/* ISBN */}
            {book.isbn && (
              <div className="mb-3 p-2 rounded" style={{ background: '#f8f8f8', fontSize: '0.85rem' }}>
                <span className="fw-600">ISBN :</span> {book.isbn}
              </div>
            )}

            {/* Description */}
            <h6 className="fw-700 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Description</h6>
            <p className="text-muted mb-4" style={{ lineHeight: 1.7, fontSize: '0.92rem' }}>
              {book.description || 'Aucune description disponible.'}
            </p>

            {/* Prix */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                {Number(book.prix).toFixed(2)} $ CA
              </span>
              {book.originalPrice && (
                <>
                  <span className="price-old" style={{ fontSize: '1.1rem' }}>{Number(book.originalPrice).toFixed(2)} $ CA</span>
                  <span className="price-badge">-{discount}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mb-4">
              {book.stock > 0 ? (
                <span className="stock-ok d-flex align-items-center gap-1" style={{ fontSize: '0.88rem' }}>
                  <i className="bi bi-circle-fill" style={{ fontSize: '0.5rem' }}></i>
                  En stock — Livraison sous 24–48h ({book.stock} disponibles)
                </span>
              ) : (
                <span className="stock-low d-flex align-items-center gap-1" style={{ fontSize: '0.88rem' }}>
                  <i className="bi bi-x-circle-fill"></i> Rupture de stock
                </span>
              )}
            </div>

            {/* Quantité */}
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-600" style={{ fontFamily: 'Poppins, sans-serif' }}>Quantité</span>
              <div className="d-flex align-items-center gap-2">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>
                  <i className="bi bi-dash"></i>
                </button>
                <span className="qty-display">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => Math.min(book.stock, q + 1))}>
                  <i className="bi bi-plus"></i>
                </button>
              </div>
              <small className="text-muted">(10 max par commande)</small>
            </div>

            {/* CTA buttons */}
            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: '1rem' }}
                onClick={handleAddCart}
                disabled={book.stock === 0}>
                {added
                  ? <><i className="bi bi-check-circle-fill"></i> Ajouté au panier !</>
                  : <><i className="bi bi-cart-plus"></i> Ajouter au panier — {(book.prix * qty).toFixed(2)} $ CA</>
                }
              </button>
              <div className="row g-2">
                <div className="col-6">
                  <button className="btn btn-outline-primary w-100 py-2">
                    <i className="bi bi-gift me-1"></i> Ajouter à ma liste
                  </button>
                </div>
                <div className="col-6">
                  <button className="btn btn-outline-primary w-100 py-2">
                    <i className="bi bi-share me-1"></i> Offrir ce livre
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Avis clients ── */}
        <div className="mt-5 p-4 bg-white rounded-3 shadow-sm">
          <h4 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>Avis clients</h4>
          <div className="row g-4">
            {/* Score global */}
            <div className="col-md-4 border-end">
              <div className="text-center">
                <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--text-dark)', fontFamily: 'Poppins,sans-serif' }}>
                  {(book.note_moyenne || 4.8).toFixed(1)}
                </div>
                <Stars rating={book.note_moyenne || 4.8} size="1.3rem" />
                <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>Basé sur {book.nb_avis || 128} avis</p>
              </div>
            </div>
            {/* Barres */}
            <div className="col-md-8">
              {ratingBars.map(({ star, pct }) => (
                <div key={star} className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ width: 60, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{star} étoiles</span>
                  <div className="rating-bar flex-grow-1">
                    <div className="rating-bar-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                  <span style={{ width: 36, fontSize: '0.82rem', textAlign: 'right' }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Avis individuels */}
          {book.avis && book.avis.length > 0 ? (
            <div className="mt-4">
              {book.avis.map(avis => (
                <div key={avis.id} className="border-top pt-3 mt-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: 36, height: 36, background: 'var(--bg-cream)', fontWeight: 700, fontFamily: 'Poppins,sans-serif' }}>
                      {avis.auteur_nom?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-600" style={{ fontSize: '0.9rem' }}>{avis.auteur_nom}</div>
                      <Stars rating={avis.note} size="0.75rem" />
                    </div>
                  </div>
                  {avis.commentaire && <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>{avis.commentaire}</p>}
                </div>
              ))}
            </div>
          ) : (
            <div className="border-top mt-4 pt-3 text-center text-muted" style={{ fontSize: '0.9rem' }}>
              Aucun avis pour l'instant. Soyez le premier à donner votre avis !
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
