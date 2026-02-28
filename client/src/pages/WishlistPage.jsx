import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-14 h-14 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <p className="text-gray-400 text-[11px] tracking-[0.3em] uppercase">
          Sign in to view your saved items
        </p>
        <button
          onClick={() => navigate('/auth')}
          className="text-[11px] tracking-[0.3em] uppercase bg-yellow-400 text-black px-8 py-3 rounded-full hover:bg-yellow-300 transition-all"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#050505] pt-[84px] sm:pt-[92px] pb-16">
        {/* Header */}
        <div className="bg-[#070707] border-b border-white/10 px-5 sm:px-6 lg:px-16 py-7 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] sm:text-[11px] tracking-[0.36em] uppercase text-yellow-300 mb-2">
              Saved Items
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-light">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {wishlist.length}{' '}
              {wishlist.length === 1 ? 'item saved' : 'items saved'}
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-16 pt-8 sm:pt-10">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-gray-700 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <p className="text-gray-500 text-sm tracking-wide mb-5 max-w-sm">
                Your wishlist is empty. Start exploring the collection and save your
                favourite pieces.
              </p>
              <button
                onClick={() => navigate('/')}
                className="text-[11px] tracking-[0.3em] uppercase bg-yellow-400 text-black px-8 py-3 rounded-full hover:bg-yellow-300 transition-all"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {wishlist.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="group bg-[#070707] border border-white/10 hover:border-yellow-500/35 transition-all duration-300 rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <div
                    className="relative overflow-hidden aspect-[3/4] cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={e => (e.target.style.display = 'none')}
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        toggleWishlist(product)
                      }}
                      className="absolute top-2.5 right-2.5 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-yellow-300 hover:text-red-400 transition-colors"
                    >
                      ♥
                    </button>
                  </div>
                  <div className="p-3.5 sm:p-4">
                    <p className="text-gray-500 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-1">
                      {product.category}
                    </p>
                    <p
                      className="text-white text-sm font-light mb-1.5 cursor-pointer hover:text-yellow-300 transition-colors line-clamp-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-yellow-300 text-sm">
                        ${product.price}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase text-gray-300 border border-white/15 px-2.5 sm:px-3 py-1.5 rounded-full hover:border-yellow-400 hover:text-yellow-300 transition-all whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}