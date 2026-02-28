const express = require('express')
const router = express.Router()
const Product = require('../models/Product')

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET products by collection
router.get('/collection/:name', async (req, res) => {
  try {
    const products = await Product.find({ collection: req.params.name })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
