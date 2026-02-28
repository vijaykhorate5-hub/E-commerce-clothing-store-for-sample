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
      .then(res => (res.ok ? res.json() : null))
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-5 px-6 text-center">
        <p className="font-serif text-2xl sm:text-3xl text-white">Product Not Found</p>
        <button
          onClick={() => navigate('/')}
          className="text-[11px] tracking-[0.28em] uppercase text-yellow-400 border border-yellow-600/40 px-8 py-3 hover:bg-yellow-500/10 transition-all"
        >
          Return to Home
        </button>
      </div>
    )
  }

  const wishlisted = isWishlisted(product.id)

  return (
    <>
      <div className="min-h-screen bg-[#050505] pt-[80px] sm:pt-[88px] pb-16">
        {/* Breadcrumb */}
        <div className="px-5 sm:px-6 lg:px-16 pb-3 border-b border-white/5 bg-[#050505]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-gray-600 overflow-x-auto">
            <button
              onClick={() => navigate('/')}
              className="hover:text-yellow-400 transition-colors whitespace-nowrap"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-gray-500 whitespace-nowrap">{product.category}</span>
            <span>/</span>
            <span className="text-gray-300 truncate max-w-[160px] sm:max-w-[220px]">
              {product.name}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-16 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <ImageGallery image={product.image} name={product.name} />
            </motion.div>

            {/* Details */}
            <motion.div
              className="order-1 lg:order-2 flex flex-col justify-start pt-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <span className="text-gray-500 text-[10px] sm:text-[11px] tracking-[0.28em] uppercase">
                  {product.category}
                </span>
                {product.tag && (
                  <span className="text-yellow-400 text-[10px] tracking-[0.28em] uppercase border border-yellow-600/30 px-2 py-0.5">
                    {product.tag}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="w-12 h-px bg-yellow-600/60 mb-4" />
              <p className="text-yellow-300 text-xl sm:text-2xl md:text-3xl font-light mb-4">
                ${product.price}
              </p>

              {product.description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                  {product.description}
                </p>
              )}

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-gray-500">
                    Size — <span className="text-white">{selectedSize}</span>
                  </p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-yellow-400/80 hover:text-yellow-300 transition-colors underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 text-[11px] tracking-[0.26em] border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-yellow-400 text-yellow-300 bg-yellow-400/10'
                          : 'border-white/10 text-gray-400 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex items-center gap-3 mb-4">
                <motion.button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 sm:py-4 text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase rounded-full transition-all duration-300 ${
                    added
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                      : 'bg-yellow-400 text-black hover:bg-yellow-300'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {added ? '✓ Added to Bag' : 'Add to Bag'}
                </motion.button>

                <motion.button
                  onClick={handleWishlist}
                  className={`w-12 h-12 sm:w-14 sm:h-14 border flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0 ${
                    wishlisted ? 'border-yellow-400/60 bg-yellow-400/10' : 'border-white/15 hover:border-white/35'
                  }`}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill={wishlisted ? '#facc15' : 'none'}
                    stroke={wishlisted ? '#facc15' : 'rgba(255,255,255,0.6)'}
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </motion.button>
              </div>

              {wishToast && (
                <motion.p
                  className="text-yellow-300 text-[11px] tracking-[0.26em] mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {wishToast}
                </motion.p>
              )}

              {/* Perks */}
              <div className="border-t border-white/6 pt-4 sm:pt-5 space-y-3">
                {[
                  { icon: '🚚', text: 'Free shipping on orders over $500' },
                  { icon: '↩️', text: 'Complimentary returns within 30 days' },
                  { icon: '🎁', text: 'Hand-wrapped packaging on all orders' },
                  { icon: '✦', text: 'Authenticity certificate included' },
                ].map(item => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-sm mt-0.5">{item.icon}</span>
                    <p className="text-gray-500 text-xs sm:text-[13px] tracking-wide">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Reviews + Recently viewed */}
          <div className="mt-10 sm:mt-12 space-y-10">
            <ReviewSection productId={String(id)} />
            <RecentlyViewed excludeId={id} />
          </div>
        </div>
      </div>

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <Footer />
    </>
  )
}