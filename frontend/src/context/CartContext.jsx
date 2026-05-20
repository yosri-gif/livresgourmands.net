import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'lg_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  // Persister dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (ouvrage, quantite = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === ouvrage.id)
      if (existing) {
        const newQty = existing.quantite + quantite
        if (ouvrage.stock && newQty > ouvrage.stock) {
          return prev.map(i =>
            i.id === ouvrage.id ? { ...i, quantite: ouvrage.stock } : i
          )
        }
        return prev.map(i =>
          i.id === ouvrage.id ? { ...i, quantite: newQty } : i
        )
      }
      return [...prev, {
        id:            ouvrage.id,
        titre:         ouvrage.titre,
        auteur:        ouvrage.auteur,
        prix:          ouvrage.prix,
        prix_unitaire: ouvrage.prix,
        imageUrl:      ouvrage.imageUrl || ouvrage.image_url || null,
        stock:         ouvrage.stock,
        quantite,
      }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQuantite = (id, quantite) => {
    if (quantite < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantite } : i))
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, i) => sum + i.prix_unitaire * i.quantite, 0)
  const count = items.reduce((sum, i) => sum + i.quantite, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantite, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
