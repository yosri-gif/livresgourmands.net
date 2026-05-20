import { useNavigate } from 'react-router-dom'

const FALLBACK = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'

export default function CategoryCard({ category }) {
  const navigate = useNavigate()

  return (
    <div className="cat-card" onClick={() => navigate(`/?categorie=${category.id}`)}>
      <img
        src={category.imageUrl || FALLBACK}
        alt={category.nom}
        onError={e => { e.target.src = FALLBACK }}
      />
      <div className="cat-overlay"></div>
      <div className="cat-content">
        <h5>{category.nom}</h5>
        <p>{category.description || ''}</p>
        <div className="d-flex align-items-center justify-content-between">
          <span className="cat-count">{category.bookCount || 0} livres</span>
          <span className="d-flex align-items-center gap-1" style={{ color: 'white', fontSize: '0.88rem', fontWeight: 600 }}>
            Explorer <i className="bi bi-chevron-right"></i>
          </span>
        </div>
      </div>
    </div>
  )
}
