import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const fallbackProducts = [
  { id: 5, name: 'Midnight Cashmere', category: 'Knitwear', price: '890', tag: 'Bestseller', image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600', collection: 'featured' },
  { id: 6, name: 'Noir Leather Jacket', category: 'Outerwear', price: '2,150', tag: 'Limited', image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=600', collection: 'featured' },
  { id: 7, name: 'Obsidian Dress', category: 'Dresses', price: '1,100', tag: null, image: 'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=600', collection: 'featured' },
  { id: 8, name: 'Carbon Suit', category: 'Tailoring', price: '3,200', tag: 'Limited', image: 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=600', collection: 'featured' },
  { id: 9, name: 'Dusk Silk Scarf', category: 'Accessories', price: '320', tag: null, image: 'https://images.pexels.com/photos/1030946/pexels-photo-1030946.jpeg?auto=compress&cs=tinysrgb&w=600', collection: 'featured' },
  { id: 10, name: 'Eclipse Turtleneck', category: 'Tops', price: '540', tag: 'Bestseller', image: 'https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=600', collection: 'featured' },
]

export default function FeaturedCollection() {
  const [products, setProducts] = useState(fallbackProducts)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/products/collection/featured')
      .then(res => res.json())
      .then(data => { if (data && data.length > 0) setProducts(data) })
      .catch(() => setProducts(fallbackProducts))
  }, [])

  return (
    <section id="featured" className="py-24 px-6 md:px-16 bg-[#111111]">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-4">Curated For You</p>
        <h2 className="font-serif text-4xl md:text-5xl font-light text-white">Featured Collection</h2>
        <div className="w-16 h-px bg-yellow-700/50 mx-auto mt-6" />
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border border-yellow-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}