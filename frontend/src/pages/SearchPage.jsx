import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookCard from '../components/BookCard'
import { ouvragesAPI, categoriesAPI } from '../services/api'

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1774415108812-9c3a82d75c46?w=400&q=80',
  'https://images.unsplash.com/photo-1606658635765-9eb667a8f063?w=400&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
  'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=400&q=80',
  'https://images.unsplash.com/photo-1629272040444-2f7553ec7466?w=400&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
]

const SORT_OPTIONS = [
  { val: '',           label: 'Plus récents' },
  { val: 'popularite', label: 'Popularité' },
  { val: 'prix_asc',   label: 'Prix croissant' },
  { val: 'prix_desc',  label: 'Prix décroissant' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [query,      setQuery]      = useState(searchParams.get('q') || '')
  const [catFilter,  setCatFilter]  = useState(searchParams.get('categorie') || '')
  const [sortFilter, setSortFilter] = useState(searchParams.get('sort') || '')
  const [prixMin,    setPrixMin]    = useState(searchParams.get('prixMin') || '')
  const [prixMax,    setPrixMax]    = useState(searchParams.get('prixMax') || '')

  const [ouvrages,   setOuvrages]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [totalFound, setTotalFound] = useState(0)

  // Charger les catégories au montage
  useEffect(() => {
    categoriesAPI.list()
      .then(({ data }) => setCategories(data))
      .catch(() => {})
  }, [])

  // Lancer la recherche
  const doSearch = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const params = {}
      if (query)     params.search    = query
      if (catFilter) params.categorie = catFilter
      if (sortFilter)params.sort      = sortFilter

      const { data } = await ouvragesAPI.list(params)

      // Filtre prix côté client (l'API ne le gère pas nativement)
      let results = data.map((o, i) => ({
        ...o,
        imageUrl: DEMO_IMAGES[i % DEMO_IMAGES.length],
        rating:   o.note_moyenne || 0,
        reviews:  o.nb_avis || 0,
      }))
      if (prixMin) results = results.filter(o => o.prix >= Number(prixMin))
      if (prixMax) results = results.filter(o => o.prix <= Number(prixMax))

      setOuvrages(results)
      setTotalFound(results.length)
    } catch {
      setError('Erreur lors de la recherche. Vérifiez que l\'API est démarrée.')
    } finally {
      setLoading(false)
    }
  }, [query, catFilter, sortFilter, prixMin, prixMax])

  useEffect(() => { doSearch() }, [doSearch])

  const handleSubmit = (e) => {
    e.preventDefault()
    const p = {}
    if (query)     p.q         = query
    if (catFilter) p.categorie = catFilter
    if (sortFilter)p.sort      = sortFilter
    if (prixMin)   p.prixMin   = prixMin
    if (prixMax)   p.prixMax   = prixMax
    setSearchParams(p)
  }

  const resetFilters = () => {
    setQuery(''); setCatFilter(''); setSortFilter(''); setPrixMin(''); setPrixMax('')
    setSearchParams({})
  }

  const hasFilters = query || catFilter || sortFilter || prixMin || prixMax

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container py-5">
        {/* ── En-tête ── */}
        <div className="mb-4">
          <h1 className="section-title mb-1">Recherche avancée</h1>
          <p className="text-muted">Trouvez le livre parfait parmi notre catalogue culinaire</p>
        </div>

        <div className="row g-4">
          {/* ── Panneau filtres ── */}
          <div className="col-lg-3">
            <div className="bg-white rounded-3 shadow-sm p-4 sticky-top" style={{ top: 90 }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0 fw-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <i className="bi bi-funnel me-2" style={{ color: 'var(--primary)' }}></i>Filtres
                </h6>
                {hasFilters && (
                  <button className="btn btn-link p-0 text-danger" style={{ fontSize: '0.8rem' }}
                    onClick={resetFilters}>
                    Réinitialiser
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Recherche texte */}
                <div className="mb-4">
                  <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>Mot-clé</label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input type="text" className="form-control border-start-0"
                      placeholder="Titre, auteur..."
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      style={{ borderRadius: '0 8px 8px 0' }} />
                  </div>
                </div>

                {/* Catégories */}
                <div className="mb-4">
                  <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>Catégorie</label>
                  <div className="d-flex flex-column gap-1">
                    <button type="button"
                      className={`btn btn-sm text-start ${!catFilter ? 'btn-primary' : 'btn-outline-secondary'}`}
                      style={{ borderRadius: 8, fontSize: '0.82rem' }}
                      onClick={() => setCatFilter('')}>
                      Toutes les catégories
                    </button>
                    {categories.map(c => (
                      <button key={c.id} type="button"
                        className={`btn btn-sm text-start ${catFilter === String(c.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: 8, fontSize: '0.82rem' }}
                        onClick={() => setCatFilter(String(c.id))}>
                        {c.nom}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prix */}
                <div className="mb-4">
                  <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>Fourchette de prix</label>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="input-group input-group-sm">
                        <input type="number" className="form-control" placeholder="Min"
                          min="0" value={prixMin}
                          onChange={e => setPrixMin(e.target.value)}
                          style={{ borderRadius: '8px 0 0 8px' }} />
                        <span className="input-group-text" style={{ fontSize: '0.75rem' }}>$</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="input-group input-group-sm">
                        <input type="number" className="form-control" placeholder="Max"
                          min="0" value={prixMax}
                          onChange={e => setPrixMax(e.target.value)}
                          style={{ borderRadius: '8px 0 0 8px' }} />
                        <span className="input-group-text" style={{ fontSize: '0.75rem' }}>$</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tri */}
                <div className="mb-4">
                  <label className="form-label fw-600" style={{ fontSize: '0.88rem' }}>Trier par</label>
                  <div className="d-flex flex-column gap-1">
                    {SORT_OPTIONS.map(s => (
                      <button key={s.val} type="button"
                        className={`btn btn-sm text-start ${sortFilter === s.val ? 'btn-primary' : 'btn-outline-secondary'}`}
                        style={{ borderRadius: 8, fontSize: '0.82rem' }}
                        onClick={() => setSortFilter(s.val)}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-search me-2"></i> Rechercher
                </button>
              </form>
            </div>
          </div>

          {/* ── Résultats ── */}
          <div className="col-lg-9">
            {/* Barre résultats */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
              <div>
                {!loading && (
                  <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                    {totalFound === 0
                      ? 'Aucun résultat'
                      : <><strong style={{ color: 'var(--text-dark)' }}>{totalFound}</strong> ouvrage{totalFound > 1 ? 's' : ''} trouvé{totalFound > 1 ? 's' : ''}</>
                    }
                    {query && <> pour "<strong>{query}</strong>"</>}
                  </span>
                )}
              </div>

              {/* Tags filtres actifs */}
              <div className="d-flex flex-wrap gap-2">
                {query && (
                  <span className="badge d-flex align-items-center gap-1"
                    style={{ background: 'rgba(139,0,0,0.1)', color: 'var(--primary)', padding: '6px 10px', borderRadius: 20, fontWeight: 500 }}>
                    "{query}"
                    <button className="btn p-0 ms-1" style={{ lineHeight: 1 }} onClick={() => setQuery('')}>
                      <i className="bi bi-x" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}></i>
                    </button>
                  </span>
                )}
                {catFilter && categories.find(c => String(c.id) === catFilter) && (
                  <span className="badge d-flex align-items-center gap-1"
                    style={{ background: 'rgba(139,0,0,0.1)', color: 'var(--primary)', padding: '6px 10px', borderRadius: 20, fontWeight: 500 }}>
                    {categories.find(c => String(c.id) === catFilter)?.nom}
                    <button className="btn p-0 ms-1" style={{ lineHeight: 1 }} onClick={() => setCatFilter('')}>
                      <i className="bi bi-x" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}></i>
                    </button>
                  </span>
                )}
                {(prixMin || prixMax) && (
                  <span className="badge d-flex align-items-center gap-1"
                    style={{ background: 'rgba(139,0,0,0.1)', color: 'var(--primary)', padding: '6px 10px', borderRadius: 20, fontWeight: 500 }}>
                    {prixMin || '0'} $ CA – {prixMax || '∞'} $ CA
                    <button className="btn p-0 ms-1" style={{ lineHeight: 1 }}
                      onClick={() => { setPrixMin(''); setPrixMax('') }}>
                      <i className="bi bi-x" style={{ fontSize: '0.9rem', color: 'var(--primary)' }}></i>
                    </button>
                  </span>
                )}
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--primary)', width: '3rem', height: '3rem' }}></div>
                <p className="mt-3 text-muted">Recherche en cours...</p>
              </div>
            )}

            {/* Erreur */}
            {error && !loading && (
              <div className="alert alert-warning d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i> {error}
              </div>
            )}

            {/* Aucun résultat */}
            {!loading && !error && ouvrages.length === 0 && (
              <div className="text-center py-5 bg-white rounded-3 shadow-sm">
                <i className="bi bi-search" style={{ fontSize: '3.5rem', color: '#ddd' }}></i>
                <h5 className="mt-3 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Aucun ouvrage trouvé</h5>
                <p className="text-muted mb-4">Essayez avec d'autres mots-clés ou modifiez les filtres.</p>
                <button className="btn btn-outline-primary" onClick={resetFilters}>
                  Voir tous les ouvrages
                </button>
              </div>
            )}

            {/* Grille résultats */}
            {!loading && ouvrages.length > 0 && (
              <div className="row g-4">
                {ouvrages.map(book => (
                  <div key={book.id} className="col-sm-6 col-xl-4">
                    <BookCard book={book} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
