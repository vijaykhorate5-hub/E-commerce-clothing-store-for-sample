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

  if (!user) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <p className="text-gray-400 text-sm tracking-widest uppercase">Sign in to view your saved items</p>
      <button onClick={() => navigate('/auth')} className="text-xs tracking-widest uppercase bg-yellow-600 text-black px-8 py-3 hover:bg-yellow-500 transition-all">
        Sign In
      </button>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] pb-24">
        <div className="bg-[#0d0d0d] border-b border-white/5 pt-28 pb-10 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-2">Saved Items</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white font-light">My Wishlist</h1>
            <p className="text-gray-500 text-sm mt-1">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 pt-10">
          {wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-500 text-sm tracking-wide mb-6">Your wishlist is empty</p>
              <button onClick={() => navigate('/')} className="text-xs tracking-widest uppercase bg-yellow-600 text-black px-8 py-3 hover:bg-yellow-500 transition-all">
                Browse Collection
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlist.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="group bg-[#0d0d0d] border border-white/5 hover:border-yellow-700/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  layout
                >
                  <div
                    className="relative overflow-hidden aspect-[3/4] cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img
                      src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={e => e.target.style.display='none'}
                    />
                    <button
                      onClick={e => { e.stopPropagation(); toggleWishlist(product) }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/70 flex items-center justify-center text-yellow-500 hover:text-red-400 transition-colors"
                    >
                      ♥
                    </button>
                  </div>
                  <div className="p-3 md:p-4">
                    <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">{product.category}</p>
                    <p
                      className="text-white text-sm font-light mb-2 cursor-pointer hover:text-yellow-600 transition-colors line-clamp-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-yellow-600 text-sm">${product.price}</span>
                      <button
                        onClick={() => addToCart(product)}
                        className="text-xs tracking-widest uppercase text-gray-400 border border-white/10 px-2 md:px-3 py-1.5 hover:border-yellow-700/50 hover:text-yellow-600 transition-all whitespace-nowrap"
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