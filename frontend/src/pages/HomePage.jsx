import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookCard from '../components/BookCard'
import CategoryCard from '../components/CategoryCard'
import { ouvragesAPI, categoriesAPI } from '../services/api'

// Images statiques pour les catégories
const CAT_IMAGES = {
  'Cuisine Française': 'https://images.unsplash.com/photo-1774415108812-9c3a82d75c46?w=600&q=80',
  'Pâtisserie':        'https://images.unsplash.com/photo-1606658635765-9eb667a8f063?w=600&q=80',
  'Cuisine du Monde':  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'Gastronomie':       'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
}

const HERO_IMG = 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?w=1400&q=80'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const [ouvrages,    setOuvrages]    = useState([])
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [activeSort,  setActiveSort]  = useState('recent')
  const [searchValue, setSearchValue] = useState('')

  const searchQ   = searchParams.get('search')    || ''
  const catFilter = searchParams.get('categorie') || ''
  const sortParam = searchParams.get('sort')      || ''

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const params = {}
        if (searchQ)               params.search    = searchQ
        if (catFilter && catFilter !== 'all') params.categorie = catFilter
        if (sortParam)             params.sort      = sortParam

        const [ouv, cats] = await Promise.all([
          ouvragesAPI.list(params),
          categoriesAPI.list(),
        ])

        // Enrichir les ouvrages avec des images Unsplash de démo
        const DEMO_IMAGES = [
          'https://images.unsplash.com/photo-1774415108812-9c3a82d75c46?w=400&q=80',
          'https://images.unsplash.com/photo-1606658635765-9eb667a8f063?w=400&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
          'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=400&q=80',
          'https://images.unsplash.com/photo-1629272040444-2f7553ec7466?w=400&q=80',
          'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
        ]
        const enriched = ouv.data.map((o, i) => ({
          ...o,
          imageUrl: DEMO_IMAGES[i % DEMO_IMAGES.length],
          rating: o.note_moyenne || 0,
          reviews: o.nb_avis || 0,
        }))
        setOuvrages(enriched)

        // Enrichir les catégories
        const enrichedCats = cats.data.map(c => ({
          ...c,
          imageUrl:  CAT_IMAGES[c.nom] || null,
          bookCount: enriched.filter(o => o.categorie_id === c.id).length,
        }))
        setCategories(enrichedCats)
      } catch (err) {
        setError('Impossible de charger les ouvrages. Vérifiez que l\'API est démarrée.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [searchQ, catFilter, sortParam])

  const features = [
    { icon: 'bi-truck', title: 'Livraison gratuite', sub: 'Dès 50 $ CA d\'achat' },
    { icon: 'bi-shield-check', title: 'Paiement sécurisé', sub: '100% sécurisé' },
    { icon: 'bi-patch-check', title: 'Qualité garantie', sub: 'Livres authentiques' },
    { icon: 'bi-graph-up-arrow', title: 'Best-sellers', sub: 'Les plus vendus' },
  ]

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero ── */}
      <div className="container py-4">
        <div className="hero-section" style={{ minHeight: 460 }}>
          <img src={HERO_IMG} alt="LivresGourmands hero" />
          <div className="hero-overlay"></div>
          <div className="hero-content p-4 p-md-5 d-flex flex-column justify-content-center h-100">
            <h1 className="mb-3">L'art culinaire à<br />portée de main</h1>
            <p className="mb-4" style={{ maxWidth: 480 }}>
              Découvrez notre collection exclusive de livres de cuisine, gastronomie et pâtisserie.
              Des recettes authentiques aux techniques modernes.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/?categorie=all" className="btn btn-primary px-4 py-3 d-flex align-items-center gap-2">
                Découvrir les ouvrages <i className="bi bi-chevron-right"></i>
              </Link>
              <Link to="/?sort=popularite" className="btn-hero-outline px-4 py-3">
                Voir les bestsellers
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Features bar ── */}
      <div className="features-bar py-4 my-2">
        <div className="container">
          <div className="row g-3">
            {features.map(f => (
              <div className="col-6 col-md-3" key={f.title}>
                <div className="d-flex align-items-center gap-3">
                  <div className="feature-icon flex-shrink-0"><i className={`bi ${f.icon}`}></i></div>
                  <div>
                    <div className="fw-600" style={{ fontSize: '0.92rem', fontFamily: 'Poppins, sans-serif' }}>{f.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{f.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Meilleures ventes ── */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="section-title">Nos meilleures ventes</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 560 }}>
            Découvrez notre sélection de livres de cuisine les plus populaires,
            choisis par nos experts et appréciés par nos clients.
          </p>
        </div>

        {/* Filtres */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          {[
            { label: 'Récents', val: 'recent' },
            { label: 'Populaires', val: 'popularite' },
            { label: 'Prix ↑', val: 'prix_asc' },
            { label: 'Prix ↓', val: 'prix_desc' },
          ].map(f => (
            <Link key={f.val}
              to={`/?sort=${f.val}`}
              className={`btn btn-sm ${sortParam === f.val || (!sortParam && f.val === 'recent') ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ borderRadius: 20, padding: '5px 16px', fontSize: '0.85rem' }}>
              {f.label}
            </Link>
          ))}
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }}></div>
            <p className="mt-3 text-muted">Chargement des ouvrages...</p>
          </div>
        )}

        {error && !loading && (
          <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row g-4">
            {ouvrages.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <p className="mt-3 text-muted">Aucun ouvrage trouvé.</p>
              </div>
            ) : ouvrages.slice(0, 6).map(book => (
              <div key={book.id} className="col-6 col-md-4 col-lg-4">
                <BookCard book={book} />
              </div>
            ))}
          </div>
        )}

        {!loading && ouvrages.length > 6 && (
          <div className="text-center mt-5">
            <Link to="/?categorie=all" className="btn btn-outline-primary px-5 py-3">
              Voir tous les ouvrages ({ouvrages.length})
            </Link>
          </div>
        )}
      </div>

      {/* ── Catégories ── */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="section-title">Explorez nos catégories</h2>
          <p className="text-muted">Parcourez notre collection organisée par thématiques culinaires</p>
        </div>
        <div className="row g-3">
          {(categories.length > 0 ? categories : [
            { id: 1, nom: 'Cuisine Française', description: 'Des recettes traditionnelles aux créations modernes', bookCount: 487, imageUrl: CAT_IMAGES['Cuisine Française'] },
            { id: 2, nom: 'Pâtisserie', description: 'Maîtrisez l\'art de la pâtisserie française et internationale', bookCount: 356, imageUrl: CAT_IMAGES['Pâtisserie'] },
            { id: 3, nom: 'Cuisine du Monde', description: 'Voyagez à travers les saveurs du monde entier', bookCount: 523, imageUrl: CAT_IMAGES['Cuisine du Monde'] },
            { id: 4, nom: 'Gastronomie', description: 'L\'excellence culinaire et les techniques des plus grands chefs', bookCount: 298, imageUrl: CAT_IMAGES['Gastronomie'] },
          ]).map(cat => (
            <div key={cat.id} className="col-6 col-lg-3">
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Newsletter ── */}
      <div className="newsletter-section py-5 my-4">
        <div className="container text-center" style={{ maxWidth: 600 }}>
          <h2 className="text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
            Inscrivez-vous à notre newsletter
          </h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Recevez en avant-première nos nouveautés, offres exclusives et conseils culinaires
          </p>
          <div className="input-group mx-auto" style={{ maxWidth: 460 }}>
            <input type="email" className="form-control"
              placeholder="Votre adresse email"
              style={{ borderRadius: '50px 0 0 50px', border: 'none', padding: '14px 20px' }} />
            <button className="btn btn-gold" type="button"
              style={{ borderRadius: '0 50px 50px 0', padding: '0 1.5rem' }}>
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
