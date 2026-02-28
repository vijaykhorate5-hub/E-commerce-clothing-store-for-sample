import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import ImageGallery from '../components/ImageGallery'
import SizeGuide from '../components/SizeGuide'
import ReviewSection from '../components/ReviewSection'
import RecentlyViewed, { addToRecentlyViewed } from '../components/RecentlyViewed'
import Footer from '../components/Footer'

const API = 'http://localhost:3000/api'
const sizes = ['XS', 'S', 'M', 'L', 'XL']

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('M')
  const [added, setAdded] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [wishToast, setWishToast] = useState('')

  useEffect(() => {
    setLoading(true)
    window.scrollTo(0, 0)
    fetch(`${API}/products/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setProduct(data)
        if (data) addToRecentlyViewed(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize })
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const handleWishlist = async () => {
    const result = await toggleWishlist(product)
    if (result === 'login_required') setWishToast('Sign in to save items')
    else if (result === 'added') setWishToast('Saved to wishlist ♥')
    else if (result === 'removed') setWishToast('Removed from wishlist')
    setTimeout(() => setWishToast(''), 2500)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border border-yellow-600/30 border-t-yellow-600 rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5">
      <p className="font-serif text-3xl text-white">Product Not Found</p>
      <button onClick={() => navigate('/')} className="text-xs tracking-widest uppercase text-yellow-600 border border-yellow-700/30 px-8 py-3 hover:bg-yellow-600/10 transition-all">
        Return to Home
      </button>
    </div>
  )

  const wishlisted = isWishlisted(product.id)

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a]">

        {/* Breadcrumb — properly spaced below fixed navbar */}
        <div className="pt-28 pb-4 px-4 md:px-8 lg:px-16 border-b border-white/5 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs tracking-widest uppercase text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-yellow-600 transition-colors">Home</button>
            <span>/</span>
            <span className="text-gray-500">{product.category}</span>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-[160px]">{product.name}</span>
          </div>
        </div>

        {/* Main product section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageGallery image={product.image} name={product.name} />
            </motion.div>

            {/* Details */}
            <motion.div
              className="flex flex-col justify-start pt-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-gray-500 text-xs tracking-widest uppercase">{product.category}</span>
                {product.tag && (
                  <span className="text-yellow-600 text-xs tracking-widest uppercase border border-yellow-700/30 px-2 py-0.5">{product.tag}</span>
                )}
              </div>

              <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light text-white mb-3 leading-tight">{product.name}</h1>
              <div className="w-12 h-px bg-yellow-700/50 mb-4" />
              <p className="text-yellow-500 text-2xl md:text-3xl font-light mb-5">${product.price}</p>

              {product.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">{product.description}</p>
              )}

              {/* Size selector */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest uppercase text-gray-500">
                    Size — <span className="text-white">{selectedSize}</span>
                  </p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs tracking-widest uppercase text-yellow-600/70 hover:text-yellow-600 transition-colors underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 text-xs tracking-widest border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-yellow-600 text-yellow-600 bg-yellow-600/10'
                          : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mb-4">
                <motion.button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 text-xs font-semibold tracking-[0.3em] uppercase transition-all duration-300 ${
                    added ? 'bg-green-600/20 text-green-400 border border-green-600/30' : 'bg-yellow-600 text-black hover:bg-yellow-500'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {added ? '✓ Added to Bag' : 'Add to Bag'}
                </motion.button>

                <motion.button
                  onClick={handleWishlist}
                  className={`w-14 h-14 border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                    wishlisted ? 'border-yellow-600/50 bg-yellow-600/10' : 'border-white/10 hover:border-white/30'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"
                    fill={wishlisted ? '#c9a84c' : 'none'}
                    stroke={wishlisted ? '#c9a84c' : 'rgba(255,255,255,0.5)'}
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </motion.button>
              </div>

              {wishToast && (
                <motion.p className="text-yellow-600 text-xs tracking-widest mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {wishToast}
                </motion.p>
              )}

              {/* Perks */}
              <div className="border-t border-white/5 pt-5 space-y-3">
                {[
                  { icon: '🚚', text: 'Free shipping on orders over $500' },
                  { icon: '↩️', text: 'Free returns within 30 days' },
                  { icon: '🎁', text: 'Complimentary gift wrapping available' },
                  { icon: '✦', text: 'Authenticity guaranteed' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3">
                    <span className="text-sm">{item.icon}</span>
                    <p className="text-gray-500 text-xs tracking-wide">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <ReviewSection productId={String(id)} />
          <RecentlyViewed excludeId={id} />
        </div>
      </div>

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <Footer />
    </>
  )
}