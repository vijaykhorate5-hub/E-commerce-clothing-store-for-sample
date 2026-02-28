import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import SearchFilter from './components/SearchFilter'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import AuthPage from './pages/AuthPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import WishlistPage from './pages/WishlistPage'

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <SearchFilter />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Routes>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  )
}