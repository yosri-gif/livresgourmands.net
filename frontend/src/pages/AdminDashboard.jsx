import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ouvragesAPI, commandesAPI, categoriesAPI, usersAPI } from '../services/api'

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1774415108812-9c3a82d75c46?w=80&q=60',
  'https://images.unsplash.com/photo-1606658635765-9eb667a8f063?w=80&q=60',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&q=60',
  'https://images.unsplash.com/photo-1556909211-36987daf7b4d?w=80&q=60',
]

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'bi-speedometer2', label: 'Tableau de bord' },
  { id: 'livres',    icon: 'bi-book',          label: 'Livres' },
  { id: 'categories',icon: 'bi-tags',          label: 'Catégories' },
  { id: 'commandes', icon: 'bi-cart3',         label: 'Commandes' },
  { id: 'users',     icon: 'bi-people',        label: 'Utilisateurs' },
  { id: 'listes',    icon: 'bi-gift',          label: 'Listes de cadeaux' },
]

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab,  setActiveTab]  = useState('livres')
  const [ouvrages,   setOuvrages]   = useState([])
  const [commandes,  setCommandes]  = useState([])
  const [categories, setCategories] = useState([])
  const [stats,      setStats]      = useState({ livres: 0, commandes: 0, revenu: 0, users: 0 })
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [form,       setForm]       = useState({ titre: '', auteur: '', isbn: '', description: '', prix: '', stock: '', categorie_id: '' })
  const [formMsg,    setFormMsg]    = useState(null)
  const [search,     setSearch]     = useState('')

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [ouv, cmd, cats] = await Promise.all([
        ouvragesAPI.list(),
        commandesAPI.list(),
        categoriesAPI.list(),
      ])
      const enriched = ouv.data.map((o, i) => ({ ...o, imageUrl: DEMO_IMAGES[i % DEMO_IMAGES.length] }))
      setOuvrages(enriched)
      setCommandes(cmd.data)
      setCategories(cats.data)
      setStats({
        livres:    ouv.data.length,
        commandes: cmd.data.length,
        revenu:    cmd.data.reduce((s, c) => s + Number(c.total || 0), 0),
        users:     0,
      })
    } catch { /* API peut ne pas être accessible */ }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditItem(null)
    setForm({ titre: '', auteur: '', isbn: '', description: '', prix: '', stock: '', categorie_id: '' })
    setFormMsg(null)
    setShowForm(true)
  }
  const openEdit = (o) => {
    setEditItem(o)
    setForm({ titre: o.titre, auteur: o.auteur, isbn: o.isbn || '', description: o.description || '', prix: o.prix, stock: o.stock, categorie_id: o.categorie_id || '' })
    setFormMsg(null)
    setShowForm(true)
  }
  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet ouvrage ?')) return
    try {
      await ouvragesAPI.delete(id)
      setOuvrages(prev => prev.filter(o => o.id !== id))
    } catch { alert('Erreur lors de la suppression.') }
  }
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormMsg(null)
    try {
      const payload = { ...form, prix: Number(form.prix), stock: Number(form.stock), categorie_id: form.categorie_id || null }
      if (editItem) {
        await ouvragesAPI.update(editItem.id, payload)
        setOuvrages(prev => prev.map(o => o.id === editItem.id ? { ...o, ...payload } : o))
      } else {
        const { data } = await ouvragesAPI.create(payload)
        setOuvrages(prev => [...prev, { ...payload, id: data.id, imageUrl: DEMO_IMAGES[0] }])
      }
      setFormMsg({ type: 'success', text: editItem ? 'Ouvrage mis à jour !' : 'Ouvrage créé !' })
      setTimeout(() => setShowForm(false), 1200)
    } catch (err) {
      setFormMsg({ type: 'danger', text: err.response?.data?.message || 'Erreur.' })
    }
  }

  const filtered = ouvrages.filter(o =>
    o.titre?.toLowerCase().includes(search.toLowerCase()) ||
    o.auteur?.toLowerCase().includes(search.toLowerCase())
  )

  const statCards = [
    { icon: 'bi-book', label: 'Total Livres', value: stats.livres, color: 'var(--primary)' },
    { icon: 'bi-cart3', label: 'Commandes', value: stats.commandes, color: '#2563eb' },
    { icon: 'bi-currency-dollar', label: 'Revenu', value: `${stats.revenu.toFixed(0)} $ CA`, color: '#16a34a' },
    { icon: 'bi-people', label: 'Utilisateurs', value: stats.users || '–', color: '#7c3aed' },
  ]

  return (
    <div className="admin-layout">
      {/* ── Sidebar ── */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <div className="d-flex align-items-center gap-2">
            <div className="logo-icon" style={{ width: 36, height: 36, borderRadius: 8 }}>
              <i className="bi bi-book-half" style={{ fontSize: '1rem' }}></i>
            </div>
            <div>
              <div style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.95rem' }}>LivresGourmands</div>
              <div style={{ color: 'var(--gold)', fontSize: '0.65rem' }}>Administration</div>
            </div>
          </div>
        </div>

        <nav className="py-2 flex-grow-1">
          {NAV_ITEMS.map(item => (
            <button key={item.id}
              className={`nav-link w-100 border-0 text-start ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}>
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.08) !important' }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 36, height: 36, background: 'var(--primary)', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.nom?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>{user?.nom}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{user?.role}</div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link to="/" className="btn btn-sm w-50" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', borderRadius: 8 }}>
              <i className="bi bi-house me-1"></i> Site
            </Link>
            <button className="btn btn-sm w-50" style={{ background: 'rgba(220,38,38,0.2)', color: '#fca5a5', fontSize: '0.75rem', borderRadius: 8 }}
              onClick={() => { logout(); navigate('/login') }}>
              <i className="bi bi-box-arrow-right me-1"></i> Quitter
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar d-flex align-items-center justify-content-between">
          <h5 className="mb-0" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
            {NAV_ITEMS.find(n => n.id === activeTab)?.label || 'Dashboard'}
          </h5>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {activeTab === 'livres' && (
              <button className="btn btn-primary btn-sm d-flex align-items-center gap-1" onClick={openCreate}>
                <i className="bi bi-plus-lg"></i> Ajouter un livre
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Stats cards */}
          <div className="row g-3 mb-4">
            {statCards.map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <div className="stat-card" style={{ borderLeftColor: s.color }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="stat-icon" style={{ background: `${s.color}18` }}>
                      <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
                    </div>
                  </div>
                  <div className="stat-value">{loading ? '…' : s.value}</div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tab: Livres ── */}
          {activeTab === 'livres' && (
            <div className="bg-white rounded-3 shadow-sm overflow-hidden">
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
                <h6 className="mb-0 fw-700" style={{ fontFamily: 'Poppins, sans-serif' }}>Tableau des Ouvrages</h6>
                <input type="text" className="form-control form-control-sm" placeholder="Rechercher..."
                  style={{ maxWidth: 220, borderRadius: 8 }}
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="table-responsive">
                <table className="table admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Couverture</th>
                      <th>Titre</th>
                      <th>Catégorie</th>
                      <th>Prix</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-4">
                        <span className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></span>
                      </td></tr>
                    ) : filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-4 text-muted">Aucun ouvrage trouvé.</td></tr>
                    ) : filtered.map(o => (
                      <tr key={o.id}>
                        <td>
                          <img src={o.imageUrl} alt={o.titre}
                            style={{ width: 46, height: 58, objectFit: 'cover', borderRadius: 6 }}
                            onError={e => { e.target.src = DEMO_IMAGES[0] }} />
                        </td>
                        <td>
                          <div className="fw-600" style={{ fontSize: '0.88rem' }}>{o.titre}</div>
                          <small className="text-muted">{o.auteur}</small>
                        </td>
                        <td>
                          {o.categorie_nom && (
                            <span className="badge" style={{ background: 'rgba(139,0,0,0.12)', color: 'var(--primary)', fontWeight: 600, fontSize: '0.78rem' }}>
                              {o.categorie_nom}
                            </span>
                          )}
                        </td>
                        <td>{Number(o.prix).toFixed(2)} $ CA</td>
                        <td>
                          <span className={`badge ${o.stock > 10 ? 'bg-success' : o.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            {o.stock}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                              onClick={() => openEdit(o)} style={{ borderRadius: 6, fontSize: '0.8rem' }}>
                              <i className="bi bi-pencil"></i> Modifier
                            </button>
                            <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              onClick={() => handleDelete(o.id)} style={{ borderRadius: 6, fontSize: '0.8rem' }}>
                              <i className="bi bi-trash3"></i> Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Commandes ── */}
          {activeTab === 'commandes' && (
            <div className="bg-white rounded-3 shadow-sm overflow-hidden">
              <div className="p-3 border-bottom">
                <h6 className="mb-0 fw-700" style={{ fontFamily: 'Poppins, sans-serif' }}>Commandes</h6>
              </div>
              <div className="table-responsive">
                <table className="table admin-table mb-0">
                  <thead>
                    <tr><th>#</th><th>Client</th><th>Total</th><th>Statut</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-4">
                        <span className="spinner-border spinner-border-sm" style={{ color: 'var(--primary)' }}></span>
                      </td></tr>
                    ) : commandes.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-4 text-muted">Aucune commande.</td></tr>
                    ) : commandes.map(c => (
                      <tr key={c.id}>
                        <td className="fw-600">#{c.id}</td>
                        <td>Client #{c.client_id}</td>
                        <td className="fw-600" style={{ color: 'var(--primary)' }}>{Number(c.total).toFixed(2)} $ CA</td>
                        <td>
                          <span className={`badge ${
                            c.statut === 'payee'     ? 'bg-success' :
                            c.statut === 'expediee'  ? 'bg-info text-dark' :
                            c.statut === 'annulee'   ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>{c.statut}</span>
                        </td>
                        <td className="text-muted" style={{ fontSize: '0.82rem' }}>
                          {new Date(c.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab: Catégories ── */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h6 className="fw-700 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Catégories</h6>
              <div className="row g-3">
                {categories.map(c => (
                  <div key={c.id} className="col-md-4">
                    <div className="p-3 border rounded-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 44, height: 44, background: 'rgba(139,0,0,0.1)' }}>
                        <i className="bi bi-tag" style={{ color: 'var(--primary)' }}></i>
                      </div>
                      <div>
                        <div className="fw-600">{c.nom}</div>
                        <small className="text-muted">{c.description || '—'}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tabs placeholder ── */}
          {['dashboard', 'users', 'listes'].includes(activeTab) && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-tools" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="mt-3">Section en cours de développement.</p>
            </div>
          )}
        </div>
      </main>

      {/* ── Modal Formulaire Ouvrage ── */}
      {showForm && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {editItem ? 'Modifier l\'ouvrage' : 'Ajouter un ouvrage'}
                </h5>
                <button className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                {formMsg && (
                  <div className={`alert alert-${formMsg.type} d-flex align-items-center gap-2`}>
                    <i className={`bi bi-${formMsg.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
                    {formMsg.text}
                  </div>
                )}
                <form onSubmit={handleFormSubmit}>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-600">Titre *</label>
                      <input className="form-control" value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-600">ISBN</label>
                      <input className="form-control" value={form.isbn} onChange={e => setForm(f => ({ ...f, isbn: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600">Auteur *</label>
                      <input className="form-control" value={form.auteur} onChange={e => setForm(f => ({ ...f, auteur: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600">Catégorie</label>
                      <select className="form-select" value={form.categorie_id} onChange={e => setForm(f => ({ ...f, categorie_id: e.target.value }))}>
                        <option value="">— Sélectionner —</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600">Prix ($ CA) *</label>
                      <input type="number" step="0.01" min="0" className="form-control" value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-600">Stock *</label>
                      <input type="number" min="0" className="form-control" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-600">Description</label>
                      <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary px-4">
                      {editItem ? 'Mettre à jour' : 'Créer l\'ouvrage'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
