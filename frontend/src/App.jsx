import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'

import HomePage          from './pages/HomePage'
import ProductPage       from './pages/ProductPage'
import CartPage          from './pages/CartPage'
import LoginPage         from './pages/LoginPage'
import RegisterPage      from './pages/RegisterPage'
import AdminDashboard    from './pages/AdminDashboard'
import SearchPage        from './pages/SearchPage'
import ListesCadeauxPage from './pages/ListesCadeauxPage'

// Route protégée — redirige vers /login si non connecté
function PrivateRoute({ children, adminOnly = false }) {
  const { user, token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (adminOnly && !['administrateur', 'gestionnaire'].includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/"           element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart"       element={<CartPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/search"     element={<SearchPage />} />
            <Route path="/listes"     element={
              <PrivateRoute>
                <ListesCadeauxPage />
              </PrivateRoute>
            } />
            <Route path="/admin"      element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
