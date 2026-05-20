import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const FALLBACK = 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80'

function Stars({ rating }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map(i => (
        <i key={i} className={`bi bi-star${i <= Math.round(rating) ? '-fill' : (i - 0.5 <= rating ? '-half' : '')}`}
          style={{ color: i <= Math.round(rating) ? 'var(--gold)' : '#ddd', fontSize: '0.85rem' }}></i>
      ))}
    </span>
  )
}

export default function BookCard({ book }) {
  const { addItem } = useCart()

  const badge = book.badge || (book.nb_avis > 100 ? 'Bestseller' : null)
  const imageUrl = book.imageUrl || book.image_url || FALLBACK

  return (
    <div className="book-card">
      <div className="card-img-wrap">
        <img src={imageUrl} alt={book.titre}
          onError={e => { e.target.src = FALLBACK }} />

        {badge && (
          <span className={`badge-book ${badge === 'Nouveau' ? 'nouveau' : badge === 'Top rated' ? 'top' : ''}`}>
            {badge}
          </span>
        )}

        <button className="btn-wish" title="Ajouter aux favoris">
          <i className="bi bi-heart" style={{ fontSize: '0.9rem' }}></i>
        </button>
      </div>

      <div className="p-3">
        <Link to={`/product/${book.id}`} className="text-decoration-none">
          <h6 className="fw-600 mb-1" style={{
            color: 'var(--text-dark)', lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            minHeight: '2.7em', fontFamily: 'Poppins, sans-serif'
          }}>{book.titre}</h6>
        </Link>
        <p className="text-muted mb-2" style={{ fontSize: '0.82rem' }}>{book.auteur}</p>

        <div className="d-flex align-items-center gap-1 mb-2">
          <Stars rating={book.note_moyenne || book.rating || 0} />
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            ({book.nb_avis || book.reviews || 0})
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-baseline gap-2">
            <span className="price-main">{Number(book.prix).toFixed(2)} $ CA</span>
            {book.originalPrice && (
              <span className="price-old">{Number(book.originalPrice).toFixed(2)} $ CA</span>
            )}
          </div>
          {book.stock <= 5 && book.stock > 0 && (
            <small className="text-warning fw-600" style={{ fontSize: '0.75rem' }}>
              Plus que {book.stock} !
            </small>
          )}
        </div>

        <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={() => addItem(book)}
          disabled={book.stock === 0}>
          <i className="bi bi-cart-plus"></i>
          {book.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  )
}
