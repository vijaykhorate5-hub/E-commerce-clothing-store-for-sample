import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mn_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('mn_cart', JSON.stringify(cart))
    } catch {}
  }, [cart])

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === product.size)
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev
        .map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
    try { localStorage.removeItem('mn_cart') } catch {}
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(String(item.price).replace(/,/g, '')) || 0
    return sum + price * item.quantity
  }, 0).toFixed(0)

  return (
    <CartContext.Provider value={{
      cart,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}