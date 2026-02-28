import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const fallbackProducts = [
  { id: 1, name: 'Onyx Overcoat', category: 'Outerwear', price: '1,290', tag: 'New', image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg', collection: 'new-arrivals' },
  { id: 2, name: 'Silk Noir Blouse', category: 'Tops', price: '485', tag: 'New', image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg', collection: 'new-arrivals' },
  { id: 3, name: 'Velvet Trousers', category: 'Bottoms', price: '620', tag: 'New', image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', collection: 'new-arrivals' },
  { id: 4, name: 'Shadow Blazer', category: 'Jackets', price: '980', tag: 'New', image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', collection: 'new-arrivals' },
]

export default function NewArrivals() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products/collection/new-arrivals')

        if (!res.ok) throw new Error('API failed')

        const data = await res.json()

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data)
        }
      } catch (err) {
        console.log('Using fallback products')
        setProducts(fallbackProducts)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section id="new-arrivals" className="py-24 px-6 md:px-16 bg-[#0a0a0a]">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-4">Just In</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-white">New Arrivals</h2>
      </motion.div>

      {loading ? (
        <div style={{ textAlign: "center", color: "white" }}>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}