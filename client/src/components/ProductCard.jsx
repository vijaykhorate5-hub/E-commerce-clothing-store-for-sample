import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const navigate = useNavigate()
  const wishlisted = isWishlisted(product.id)
  const [toast, setToast] = useState('')
  const [wishLoading, setWishLoading] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleWishlist = async (e) => {
    e.stopPropagation()
    if (wishLoading) return
    setWishLoading(true)
    const result = await toggleWishlist(product)
    setWishLoading(false)
    if (result === 'login_required') {
      showToast('Sign in to save items')
    } else if (result === 'added') {
      showToast('Added to wishlist')
    } else if (result === 'removed') {
      showToast('Removed from wishlist')
    }
  }

  return (
    <motion.div
      className="group cursor-pointer relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/90 border border-white/10 text-white text-xs tracking-widest uppercase px-3 py-1.5 whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image container */}
      <div
        className="relative overflow-hidden bg-[#111] mb-4 aspect-[3/4]"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={e => { e.target.style.display = 'none' }}
        />

        {/* Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-black/80 px-2 py-1">
            <span className="text-yellow-600 text-xs tracking-widest uppercase">{product.tag}</span>
          </div>
        )}

        {/* Wishlist heart — always visible on mobile, hover on desktop */}
        <button
          onClick={handleWishlist}
          disabled={wishLoading}
          className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-all duration-300 rounded-sm
            ${wishlisted ? 'bg-yellow-600/20 opacity-100' : 'bg-black/60 opacity-0 group-hover:opacity-100'}
            hover:scale-110 active:scale-95`}
        >
          <motion.div
            animate={{ scale: wishLoading ? 0.8 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={wishlisted ? '#c9a84c' : 'none'}
              stroke={wishlisted ? '#c9a84c' : 'white'}
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
          <button
            onClick={e => { e.stopPropagation(); addToCart(product) }}
            className="w-full py-3 bg-black/80 text-white text-xs tracking-widest uppercase hover:bg-yellow-600 hover:text-black transition-all duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div onClick={() => navigate(`/product/${product.id}`)}>
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">{product.category}</p>
        <p className="text-white text-sm font-light mb-2 hover:text-yellow-600 transition-colors">{product.name}</p>
        <p className="text-yellow-600 text-sm">${product.price}</p>
      </div>
    </motion.div>
  )
}