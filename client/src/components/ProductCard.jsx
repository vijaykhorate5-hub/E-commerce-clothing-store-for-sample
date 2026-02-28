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
    if (result === 'login_required') showToast('Sign in to save items')
    else if (result === 'added') showToast('Added to wishlist')
    else if (result === 'removed') showToast('Removed from wishlist')
  }

  return (
    <motion.div
      className="group cursor-pointer relative"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/90 border border-white/12 text-white text-[9px] sm:text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 whitespace-nowrap pointer-events-none rounded-full"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image card */}
      <div
        className="relative overflow-hidden bg-[#111] mb-3 sm:mb-4 aspect-[3/4] rounded-[18px] border border-white/6"
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
          <div className="absolute top-2.5 left-2.5 bg-black/80 px-2 py-1 rounded-full">
            <span className="text-yellow-300 text-[9px] tracking-[0.22em] uppercase">
              {product.tag}
            </span>
          </div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          disabled={wishLoading}
          className={`absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full shadow-md transition-all duration-300
            ${wishlisted ? 'bg-yellow-400/20 opacity-100' : 'bg-black/70 opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}
        >
          <motion.div
            animate={{ scale: wishLoading ? 0.8 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill={wishlisted ? '#facc15' : 'none'}
              stroke={wishlisted ? '#facc15' : 'white'}
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.div>
        </button>

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
          <button
            onClick={e => { e.stopPropagation(); addToCart(product) }}
            className="w-full py-3 sm:py-3.5 bg-black/85 text-white text-[9px] sm:text-[10px] tracking-[0.28em] uppercase hover:bg-yellow-400 hover:text-black transition-all duration-300"
          >
            Add to Bag
          </button>
        </div>
      </div>

      {/* Info */}
      <div onClick={() => navigate(`/product/${product.id}`)}>
        <p className="text-gray-500 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-1">
          {product.category}
        </p>
        <p className="text-white text-sm font-light mb-1.5 hover:text-yellow-300 transition-colors line-clamp-1">
          {product.name}
        </p>
        <p className="text-yellow-300 text-sm font-medium">
          ${product.price}
        </p>
      </div>
    </motion.div>
  )
}