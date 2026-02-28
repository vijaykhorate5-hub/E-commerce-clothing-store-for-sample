import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const WishlistContext = createContext({
  wishlist: [],
  toggleWishlist: () => {},
  isWishlisted: () => false
})

const API = 'http://localhost:3000/api'

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])
  const { user } = useAuth()

  // Re-fetch wishlist whenever user changes (login/logout)
  useEffect(() => {
    if (!user) {
      setWishlist([])
      return
    }
    const token = localStorage.getItem('token')
    fetch(`${API}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setWishlist(Array.isArray(data) ? data : []))
      .catch(() => setWishlist([]))
  }, [user])

  const toggleWishlist = async (product) => {
    if (!user) return 'login_required'
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/wishlist/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product })
      })
      if (!res.ok) return null
      const data = await res.json()
      setWishlist(data.wishlist || [])
      return data.action // 'added' or 'removed'
    } catch {
      return null
    }
  }

  const isWishlisted = (id) => wishlist.some(p => String(p.id) === String(id))

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}