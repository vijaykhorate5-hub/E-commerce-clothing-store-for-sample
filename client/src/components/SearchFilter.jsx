import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const CATEGORIES = [
  'All',
  'Outerwear',
  'Tops',
  'Bottoms',
  'Dresses',
  'Jackets',
  'Knitwear',
  'Tailoring',
  'Accessories',
]
const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Name: A-Z']

export default function SearchFilter() {
  const [allProducts, setAllProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('Default')
  const [isOpen, setIsOpen] = useState(false)
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data)
        setFiltered(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    let result = [...allProducts]
    if (search) {
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()),
      )
    }
    if (category !== 'All') result = result.filter(p => p.category === category)
    if (sort === 'Price: Low to High')
      result.sort(
        (a, b) =>
          parseFloat(String(a.price).replace(',', '')) -
          parseFloat(String(b.price).replace(',', '')),
      )
    if (sort === 'Price: High to Low')
      result.sort(
        (a, b) =>
          parseFloat(String(b.price).replace(',', '')) -
          parseFloat(String(a.price).replace(',', '')),
      )
    if (sort === 'Name: A-Z') result.sort((a, b) => a.name.localeCompare(b.name))
    setFiltered(result)
  }, [search, category, sort, allProducts])

  return (
    <>
      {/* Floating search button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-5 sm:bottom-8 sm:right-7 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-yellow-400 text-black flex items-center justify-center rounded-full shadow-lg shadow-yellow-900/40"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed inset-3 sm:inset-8 lg:inset-16 bg-[#050505] z-50 flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-yellow-400 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-white text-base sm:text-lg outline-none placeholder-gray-600 tracking-wide"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors text-xl ml-1 sm:ml-2"
                >
                  ✕
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/6">
                <div className="flex flex-wrap gap-2 max-w-full">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-[10px] sm:text-[11px] tracking-[0.26em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 ${
                        category === cat
                          ? 'border-yellow-400 bg-yellow-400 text-black'
                          : 'border-white/10 text-gray-500 hover:border-yellow-500/60 hover:text-yellow-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="ml-auto bg-[#101010] border border-white/10 text-gray-300 text-xs sm:text-[11px] tracking-wide px-3 py-2 rounded-full outline-none"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results info */}
              <div className="px-4 sm:px-6 py-2.5 border-b border-white/6">
                <p className="text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-gray-500">
                  {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {/* Results grid */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <p className="font-serif text-xl sm:text-2xl text-white">
                      No products found
                    </p>
                    <p className="text-gray-500 text-sm tracking-wide max-w-xs">
                      Try a different search term or filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {filtered.map((product, index) => (
                      <motion.div
                        key={product.id}
                        className="bg-[#101010] rounded-2xl overflow-hidden group cursor-pointer border border-white/6"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.03 }}
                        whileHover={{ y: -4 }}
                      >
                        <div
                          className="relative aspect-[3/4] overflow-hidden bg-[#111]"
                          onClick={() => {
                            setIsOpen(false)
                            navigate(`/product/${product.id}`)
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={e => {
                              e.target.style.display = 'none'
                            }}
                          />
                          {product.tag && (
                            <div className="absolute top-2.5 left-2.5 bg-yellow-400 text-black text-[9px] tracking-[0.22em] uppercase px-2 py-0.5 rounded-full">
                              {product.tag}
                            </div>
                          )}
                        </div>
                        <div className="p-3 sm:p-3.5">
                          <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-0.5">
                            {product.category}
                          </p>
                          <p
                            className="font-serif text-sm text-white mb-1.5 hover:text-yellow-300 transition-colors line-clamp-1"
                            onClick={() => {
                              setIsOpen(false)
                              navigate(`/product/${product.id}`)
                            }}
                          >
                            {product.name}
                          </p>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-serif text-yellow-300 text-sm">
                              ${product.price}
                            </span>
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                addToCart(product)
                              }}
                              className="text-[9px] sm:text-[10px] tracking-[0.26em] uppercase border border-yellow-500/50 text-yellow-300 px-2.5 py-1 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-200"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}