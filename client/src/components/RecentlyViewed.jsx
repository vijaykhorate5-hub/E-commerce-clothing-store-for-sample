import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function addToRecentlyViewed(product) {
  try {
    const key = 'mn_recently_viewed'
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const filtered = existing.filter(p => String(p.id) !== String(product.id))
    const updated = [product, ...filtered].slice(0, 6)
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {}
}

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem('mn_recently_viewed') || '[]')
  } catch {
    return []
  }
}

export default function RecentlyViewed({ excludeId }) {
  const navigate = useNavigate()
  const items = getRecentlyViewed().filter(p => String(p.id) !== String(excludeId))
  if (items.length === 0) return null

  return (
    <div className="mt-16 border-t border-white/5 pt-12">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-1">Your Journey</p>
          <h3 className="font-serif text-2xl text-white font-light">Recently Viewed</h3>
        </div>
        <div className="flex-1 h-px bg-white/5" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/product/${product.id}`)}
            whileHover={{ y: -3 }}
          >
            <div className="aspect-[3/4] bg-[#111] overflow-hidden mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => e.target.style.display = 'none'}
              />
            </div>
            <p className="text-white text-xs font-light truncate group-hover:text-yellow-600 transition-colors">{product.name}</p>
            <p className="text-yellow-600/70 text-xs mt-0.5">${product.price}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}