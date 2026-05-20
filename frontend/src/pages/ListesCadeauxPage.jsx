import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api, { ouvragesAPI } from '../services/api'

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1774415108812-9c3a82d75c46?w=120&q=70',
  'https://images.unsplash.com/photo-1606658635765-9eb667a8f063?w=120&q=70',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=70',
  'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=120&q=70',
  'https://images.unsplash.com/photo-1629272040444-2f7553ec7466?w=120&q=70',
]

const LS_KEY = 'lg_mes_listes'

// Persister les listes créées dans localStorage (l'API n'a pas de GET /listes/mine)
function loadMesListes()  { try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] } }
function saveMesListes(l) { localStorage.setItem(LS_KEY, JSON.stringify(l)) }

export default function ListesCadeauxPage() {
  const { token, user } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [mesListes,     setMesListes]     = useState(loadMesListes)
  const [selectedListe, setSelectedListe] = useState(null)  // { id, nom, code_partage, items[] }
  const [listeDetails,  setListeDetails]  = useState(null)

  // Créer une liste
  const [showCreate,    setShowCreate]    = useState(false)
  const [newNom,        setNewNom]        = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [createMsg,     setCreateMsg]     = useState(null)

  // Accéder à une liste par code (mode ami)
  const [codeInput,     setCodeInput]     = useState('')
  const [codeResult,    setCodeResult]    = useState(null)
  const [codeError,     setCodeError]     = useState(null)
  const [codeLoading,   setCodeLoading]   = useState(false)

  // Rechercher des ouvrages à ajouter
  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [addMsg,        setAddMsg]        = useState(null)

  // Copier le lien de partage
  const [copiedCode, setCopiedCode] = useState(false)

  // Charger le détail d'une liste sélectionnée
  useEffect(() => {
    if (!selectedListe) { setListeDetails(null); return }
    api.get(`/listes/${selectedListe.code_partage}`)
      .then(({ data }) => setListeDetails(data))
      .catch(() => setListeDetails({ ...selectedListe, items: [] }))
  }, [selectedListe])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!token) { navigate('/login'); return }
    setCreateLoading(true); setCreateMsg(null)
    try {
      const { data } = await api.post('/listes', { nom: newNom })
      const newListe = { id: data.id, nom: newNom, code_partage: data.code_partage, items: [] }
      const updated  = [newListe, ...mesListes]
      setMesListes(updated)
      saveMesListes(updated)
      setCreateMsg({ type: 'success', text: `Liste créée ! Code de partage : ${data.code_partage}` })
      setNewNom('')
      setTimeout(() => { setShowCreate(false); setCreateMsg(null); setSelectedListe(newListe) }, 1800)
    } catch (err) {
      setCreateMsg({ type: 'danger', text: err.response?.data?.message || 'Erreur lors de la création.' })
    } finally {
      setCreateLoading(false)
    }
  }

  const handleSearchOuvrages = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearchLoading(true)
    try {
      const { data } = await ouvragesAPI.list({ search: searchQuery })
      setSearchResults(data.map((o, i) => ({ ...o, imageUrl: DEMO_IMAGES[i % DEMO_IMAGES.length] })))
    } catch { setSearchResults([]) }
    finally { setSearchLoading(false) }
  }

  const handleAddToListe = async (ouvrage) => {
    if (!selectedListe) return
    setAddMsg(null)
    try {
      await api.post(`/listes/${selectedListe.id}/items`, { ouvrage_id: ouvrage.id, quantite_souhaitee: 1 })
      setAddMsg({ type: 'success', text: `"${ouvrage.titre}" ajouté à la liste !` })
      // Refresh
      const { data } = await api.get(`/listes/${selectedListe.code_partage}`)
      setListeDetails(data)
      setTimeout(() => setAddMsg(null), 2000)
    } catch (err) {
      setAddMsg({ type: 'danger', text: err.response?.data?.message || 'Erreur lors de l\'ajout.' })
    }
  }

  const handleCodeSearch = async (e) => {
    e.preventDefault()
    if (!codeInput.trim()) return
    setCodeLoading(true); setCodeError(null); setCodeResult(null)
    try {
      const { data } = await api.get(`/listes/${codeInput.trim()}`)
      setCodeResult(data)
    } catch {
      setCodeError('Liste introuvable. Vérifiez le code de partage.')
    } finally {
      setCodeLoading(false) }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleDeleteListe = (id) => {
    if (!window.confirm('Supprimer cette liste ?')) return
    const updated = mesListes.filter(l => l.id !== id)
    setMesListes(updated)
    saveMesListes(updated)
    if (selectedListe?.id === id) { setSelectedListe(null); setListeDetails(null) }
  }

  if (!token) return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />
      <div className="container py-5 text-center" style={{ maxWidth: 500 }}>
        <i className="bi bi-gift" style={{ fontSize: '4rem', color: 'var(--primary)' }}></i>
        <h3 className="mt-3 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Listes de cadeaux</h3>
        <p className="text-muted mb-4">Connectez-vous pour créer et gérer vos listes de cadeaux.</p>
        <Link to="/login" className="btn btn-primary px-5 py-3">Se connecter</Link>
      </div>
      <Footer />
    </div>
  )

  return (
    <div style={{ background: 'var(--bg-cream)', minHeight: '100vh' }}>
      <Navbar />

      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h1 className="section-title mb-1">Mes Listes de Cadeaux</h1>
            <p className="text-muted">Créez des listes et partagez-les avec vos proches</p>
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowCreate(true)}>
            <i className="bi bi-plus-circle-fill"></i> Créer une nouvelle liste
          </button>
        </div>

        {/* ── Accès par code ami ── */}
        <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
          <h6 className="fw-700 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <i className="bi bi-qr-code me-2" style={{ color: 'var(--primary)' }}></i>
            Accéder à une liste par code
          </h6>
          <form className="d-flex gap-2" onSubmit={handleCodeSearch} style={{ maxWidth: 500 }}>
            <input type="text" className="form-control"
              placeholder="Entrez le code de partage..."
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              style={{ borderRadius: 10 }} />
            <button className="btn btn-primary flex-shrink-0" type="submit" disabled={codeLoading}>
              {codeLoading
                ? <span className="spinner-border spinner-border-sm"></span>
                : <><i className="bi bi-search me-1"></i> Parcourir</>
              }
            </button>
          </form>
          {codeError && <div className="alert alert-danger mt-2 py-2 mb-0">{codeError}</div>}
        </div>

        {/* ── Résultat code ami ── */}
        {codeResult && (
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-700 mb-0" style={{ fontFamily: 'Poppins, sans-serif' }}>{codeResult.nom}</h5>
                <small className="text-muted">Liste de {codeResult.proprietaire_nom}</small>
              </div>
              <button className="btn btn-link text-muted p-0" onClick={() => setCodeResult(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            {codeResult.items?.length === 0
              ? <p className="text-muted mb-0">Cette liste est vide.</p>
              : (
                <div className="row g-3">
                  {codeResult.items.map((item, i) => (
                    <div key={item.id} className="col-md-6">
                      <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                        <img src={DEMO_IMAGES[i % DEMO_IMAGES.length]} alt={item.titre}
                          style={{ width: 54, height: 68, objectFit: 'cover', borderRadius: 8 }}
                          onError={e => { e.target.src = DEMO_IMAGES[0] }} />
                        <div className="flex-grow-1 min-width-0">
                          <div className="fw-600" style={{ fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif' }}>{item.titre}</div>
                          <div className="text-muted" style={{ fontSize: '0.78rem' }}>{item.auteur}</div>
                          <div className="fw-700 mt-1" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
                            {Number(item.prix).toFixed(2)} $ CA
                          </div>
                          <span className={`badge mt-1 ${item.stock > 0 ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                            {item.stock > 0 ? 'DISPONIBLE' : 'ÉPUISÉ'}
                          </span>
                        </div>
                        <button className="btn btn-sm btn-primary"
                          onClick={() => addItem({ ...item, imageUrl: DEMO_IMAGES[i % DEMO_IMAGES.length] })}
                          disabled={item.stock === 0}
                          title="Ajouter au panier">
                          <i className="bi bi-cart-plus"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ── Layout principal ── */}
        <div className="row g-4">
          {/* ── Mes listes (panneau gauche) ── */}
          <div className="col-lg-4">
            <h6 className="fw-700 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Mes Listes Existantes
              <span className="ms-2 badge" style={{ background: 'rgba(139,0,0,0.1)', color: 'var(--primary)', fontSize: '0.75rem' }}>
                {mesListes.length}
              </span>
            </h6>

            {mesListes.length === 0 ? (
              <div className="bg-white rounded-3 shadow-sm p-4 text-center">
                <i className="bi bi-gift" style={{ fontSize: '2.5rem', color: '#ddd' }}></i>
                <p className="text-muted mt-2 mb-3" style={{ fontSize: '0.88rem' }}>
                  Vous n'avez pas encore de liste.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
                  Créer ma première liste
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {mesListes.map(liste => (
                  <div key={liste.id}
                    className={`bg-white rounded-3 shadow-sm p-3 cursor-pointer border-2 ${selectedListe?.id === liste.id ? 'border' : 'border-0'}`}
                    style={{ borderColor: selectedListe?.id === liste.id ? 'var(--primary)' : 'transparent', cursor: 'pointer' }}
                    onClick={() => setSelectedListe(liste)}>
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div>
                        <div className="fw-700" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.92rem' }}>{liste.nom}</div>
                        <small className="text-muted">Code : <code style={{ color: 'var(--primary)' }}>{liste.code_partage}</code></small>
                      </div>
                      <button className="btn btn-link text-danger p-0 ms-2"
                        onClick={e => { e.stopPropagation(); handleDeleteListe(liste.id) }}>
                        <i className="bi bi-trash3" style={{ fontSize: '0.85rem' }}></i>
                      </button>
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-sm w-50"
                        style={{ background: 'rgba(139,0,0,0.08)', color: 'var(--primary)', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600 }}
                        onClick={e => { e.stopPropagation(); copyCode(liste.code_partage) }}>
                        <i className={`bi bi-${copiedCode === liste.code_partage ? 'check2' : 'share'} me-1`}></i>
                        {copiedCode === liste.code_partage ? 'Copié !' : 'Partager'}
                      </button>
                      <button className="btn btn-sm w-50"
                        style={{ background: '#f8f8f8', color: '#555', borderRadius: 8, fontSize: '0.78rem' }}
                        onClick={e => { e.stopPropagation(); setSelectedListe(liste) }}>
                        <i className="bi bi-list-ul me-1"></i> Gérer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Contenu liste sélectionnée (panneau droit) ── */}
          <div className="col-lg-8">
            {!selectedListe ? (
              <div className="bg-white rounded-3 shadow-sm p-5 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                <i className="bi bi-hand-index" style={{ fontSize: '3rem', color: '#ddd' }}></i>
                <h6 className="mt-3 text-muted">Sélectionnez une liste pour la gérer</h6>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                  ou créez une nouvelle liste de cadeaux
                </p>
                <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)}>
                  <i className="bi bi-plus-circle me-2"></i>Créer une liste
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3 shadow-sm overflow-hidden">
                {/* Header liste */}
                <div className="p-4 border-bottom" style={{ background: 'rgba(139,0,0,0.03)' }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h5 className="fw-700 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {selectedListe.nom}
                      </h5>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="text-muted" style={{ fontSize: '0.83rem' }}>Code de partage :</span>
                        <code style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: 1 }}>
                          {selectedListe.code_partage}
                        </code>
                        <button className="btn btn-sm p-0"
                          style={{ color: 'var(--primary)' }}
                          onClick={() => copyCode(selectedListe.code_partage)}
                          title="Copier le code">
                          <i className={`bi bi-${copiedCode === selectedListe.code_partage ? 'check2-circle-fill' : 'clipboard'}`}></i>
                        </button>
                      </div>
                    </div>
                    <span className="badge" style={{ background: 'rgba(139,0,0,0.1)', color: 'var(--primary)', padding: '6px 12px', borderRadius: 20 }}>
                      {listeDetails?.items?.length || 0} ouvrage{(listeDetails?.items?.length || 0) > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  {/* Recherche ouvrages à ajouter */}
                  <h6 className="fw-700 mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>
                    Ajouter des ouvrages au catalogue
                  </h6>
                  <form className="d-flex gap-2 mb-3" onSubmit={handleSearchOuvrages}>
                    <input type="text" className="form-control"
                      placeholder="Rechercher un livre..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{ borderRadius: 10 }} />
                    <button className="btn btn-primary flex-shrink-0" type="submit" disabled={searchLoading}>
                      {searchLoading
                        ? <span className="spinner-border spinner-border-sm"></span>
                        : <><i className="bi bi-search me-1"></i> Parcourir</>
                      }
                    </button>
                  </form>

                  {addMsg && (
                    <div className={`alert alert-${addMsg.type} py-2 mb-3 d-flex align-items-center gap-2`} style={{ fontSize: '0.85rem' }}>
                      <i className={`bi bi-${addMsg.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
                      {addMsg.text}
                    </div>
                  )}

                  {/* Résultats de recherche */}
                  {searchResults.length > 0 && (
                    <div className="mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <small className="text-muted">{searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}</small>
                        <button className="btn btn-link p-0 text-muted" style={{ fontSize: '0.8rem' }}
                          onClick={() => setSearchResults([])}>Fermer</button>
                      </div>
                      <div className="row g-2">
                        {searchResults.slice(0, 6).map((o, i) => (
                          <div key={o.id} className="col-md-6">
                            <div className="d-flex align-items-center gap-2 p-2 border rounded-3"
                              style={{ background: '#fafafa' }}>
                              <img src={o.imageUrl} alt={o.titre}
                                style={{ width: 44, height: 55, objectFit: 'cover', borderRadius: 6 }}
                                onError={e => { e.target.src = DEMO_IMAGES[0] }} />
                              <div className="flex-grow-1 min-width-0">
                                <div className="fw-600" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {o.titre}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.72rem' }}>{o.auteur}</div>
                                <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.82rem' }}>
                                  {Number(o.prix).toFixed(2)}€
                                </div>
                              </div>
                              <button className="btn btn-sm btn-primary flex-shrink-0"
                                style={{ borderRadius: 8, fontSize: '0.75rem' }}
                                onClick={() => handleAddToListe(o)}>
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items de la liste */}
                  <h6 className="fw-700 mb-3" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem' }}>
                    Contenu de la liste
                  </h6>

                  {!listeDetails ? (
                    <div className="text-center py-3">
                      <span className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></span>
                    </div>
                  ) : listeDetails.items?.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-inbox" style={{ fontSize: '2rem', color: '#ddd' }}></i>
                      <p className="mt-2 mb-0" style={{ fontSize: '0.88rem' }}>
                        Liste vide. Recherchez des ouvrages à ajouter ci-dessus.
                      </p>
                    </div>
                  ) : (
                    <div className="row g-3">
                      {listeDetails.items.map((item, i) => (
                        <div key={item.id} className="col-md-6">
                          <div className="d-flex align-items-center gap-3 p-3 border rounded-3 position-relative">
                            <img src={DEMO_IMAGES[i % DEMO_IMAGES.length]} alt={item.titre}
                              style={{ width: 54, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                              onError={e => { e.target.src = DEMO_IMAGES[0] }} />
                            <div className="flex-grow-1 min-width-0">
                              <div className="fw-600" style={{ fontSize: '0.88rem', fontFamily: 'Poppins, sans-serif' }}>{item.titre}</div>
                              <div className="text-muted" style={{ fontSize: '0.78rem' }}>{item.auteur}</div>
                              <div className="d-flex align-items-center gap-2 mt-1">
                                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
                                  {Number(item.prix).toFixed(2)} $ CA
                                </span>
                                <span className={`badge ${item.stock > 0 ? 'text-bg-success' : 'text-bg-secondary'}`}
                                  style={{ fontSize: '0.65rem' }}>
                                  {item.stock > 0 ? '✓ DISPONIBLE' : 'ÉPUISÉ'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex gap-2 mt-1 px-1">
                            <button className="btn btn-sm"
                              style={{ background: '#f8f8f8', color: '#555', borderRadius: 8, fontSize: '0.75rem', flex: 1 }}
                              onClick={() => addItem({ ...item, imageUrl: DEMO_IMAGES[i % DEMO_IMAGES.length] })}>
                              <i className="bi bi-cart-plus me-1"></i> Ajouter au panier
                            </button>
                            <Link to={`/product/${item.ouvrage_id}`}
                              className="btn btn-sm"
                              style={{ background: 'rgba(139,0,0,0.07)', color: 'var(--primary)', borderRadius: 8, fontSize: '0.75rem' }}>
                              <i className="bi bi-eye"></i>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Créer une liste ── */}
      {showCreate && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 440 }}>
            <div className="modal-content" style={{ borderRadius: 20 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <i className="bi bi-gift me-2" style={{ color: 'var(--primary)' }}></i>
                  Créer une nouvelle liste
                </h5>
                <button className="btn-close" onClick={() => { setShowCreate(false); setCreateMsg(null) }}></button>
              </div>
              <div className="modal-body">
                {createMsg && (
                  <div className={`alert alert-${createMsg.type} d-flex align-items-center gap-2`}>
                    <i className={`bi bi-${createMsg.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
                    {createMsg.text}
                  </div>
                )}
                <form onSubmit={handleCreate}>
                  <div className="mb-3">
                    <label className="form-label fw-600">Nom de la liste</label>
                    <input type="text" className="form-control"
                      placeholder="Ex : Cadeaux d'anniversaire d'Hélène"
                      value={newNom}
                      onChange={e => setNewNom(e.target.value)}
                      required
                      style={{ borderRadius: 12 }} />
                    <small className="text-muted">Un code de partage unique sera généré automatiquement.</small>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-secondary flex-grow-1"
                      onClick={() => { setShowCreate(false); setCreateMsg(null) }}>
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary flex-grow-1" disabled={createLoading}>
                      {createLoading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                        : <><i className="bi bi-plus-circle me-2"></i>Créer</>
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
