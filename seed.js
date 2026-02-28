const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')

dotenv.config()

const products = [
  {
    name: 'Onyx Overcoat',
    category: 'Outerwear',
    price: '1,290',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1548536934-a9d2d9498f59?w=600&q=80',
    description: 'A structured overcoat in premium wool blend.',
    collection: 'new-arrivals',
  },
  {
    name: 'Silk Noir Blouse',
    category: 'Tops',
    price: '485',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80',
    description: 'Fluid silk blouse with a minimalist silhouette.',
    collection: 'new-arrivals',
  },
  {
    name: 'Velvet Trousers',
    category: 'Bottoms',
    price: '620',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b9585?w=600&q=80',
    description: 'Tailored velvet trousers with a straight leg cut.',
    collection: 'new-arrivals',
  },
  {
    name: 'Shadow Blazer',
    category: 'Jackets',
    price: '980',
    tag: 'New',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    description: 'Sharp structured blazer in dark charcoal.',
    collection: 'new-arrivals',
  },
  {
    name: 'Midnight Cashmere',
    category: 'Knitwear',
    price: '890',
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    description: 'Pure cashmere sweater in midnight black.',
    collection: 'featured',
  },
  {
    name: 'Noir Leather Jacket',
    category: 'Outerwear',
    price: '2,150',
    tag: 'Limited',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
    description: 'Full-grain leather jacket with matte hardware.',
    collection: 'featured',
  },
  {
    name: 'Obsidian Dress',
    category: 'Dresses',
    price: '1,100',
    tag: null,
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80',
    description: 'Floor-length dress in obsidian crepe fabric.',
    collection: 'featured',
  },
  {
    name: 'Carbon Suit',
    category: 'Tailoring',
    price: '3,200',
    tag: 'Limited',
    image: 'https://images.unsplash.com/photo-1594938374182-a55e3c52a4ba?w=600&q=80',
    description: 'Two-piece suit in carbon grey Italian wool.',
    collection: 'featured',
  },
  {
    name: 'Dusk Silk Scarf',
    category: 'Accessories',
    price: '320',
    tag: null,
    image: 'https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=600&q=80',
    description: 'Hand-rolled silk scarf in dusky tones.',
    collection: 'featured',
  },
  {
    name: 'Eclipse Turtleneck',
    category: 'Tops',
    price: '540',
    tag: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80',
    description: 'Fine-knit turtleneck in eclipse black.',
    collection: 'featured',
  },
]

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    await Product.deleteMany({})
    console.log('Cleared existing products')
    await Product.insertMany(products)
    console.log('Seeded', products.length, 'products successfully!')
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seedDB()
