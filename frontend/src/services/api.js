import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Intercepteur réponse : gestion globale des erreurs 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('lg_token')
      localStorage.removeItem('lg_user')
      // Rediriger vers login si token expiré
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

// ── Helpers API ────────────────────────────────────────────

export const ouvragesAPI = {
  list:   (params) => api.get('/ouvrages', { params }),
  get:    (id)     => api.get(`/ouvrages/${id}`),
  create: (data)   => api.post('/ouvrages', data),
  update: (id, d)  => api.put(`/ouvrages/${id}`, d),
  delete: (id)     => api.delete(`/ouvrages/${id}`),
}

export const categoriesAPI = {
  list:   ()       => api.get('/categories'),
  create: (data)   => api.post('/categories', data),
}

export const commandesAPI = {
  list: ()   => api.get('/commandes'),
  get:  (id) => api.get(`/commandes/${id}`),
  create: (data) => api.post('/commandes', data),
  updateStatut: (id, statut) => api.put(`/commandes/${id}/status`, { statut }),
}

export const panierAPI = {
  get:        ()          => api.get('/panier'),
  addItem:    (data)      => api.post('/panier/items', data),
  updateItem: (id, qty)   => api.put(`/panier/items/${id}`, { quantite: qty }),
  removeItem: (id)        => api.delete(`/panier/items/${id}`),
}

export const usersAPI = {
  list: () => api.get('/users'),
}
