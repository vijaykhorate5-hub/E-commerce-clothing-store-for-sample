const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json')

const getProducts = () => JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'))
const saveProducts = (p) => fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(p, null, 2))

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'maisonnoir_secret')
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

const adminMiddleware = (req, res, next) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' })
  next()
}

// Add product
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  const products = getProducts()
  const newProduct = {
    id: Date.now(),
    ...req.body,
    price: String(req.body.price)
  }
  products.push(newProduct)
  saveProducts(products)
  res.status(201).json(newProduct)
})

// Update product
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  const products = getProducts()
  const idx = products.findIndex(p => p.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ message: 'Product not found' })
  products[idx] = { ...products[idx], ...req.body }
  saveProducts(products)
  res.json(products[idx])
})

// Delete product
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  let products = getProducts()
  products = products.filter(p => p.id !== parseInt(req.params.id))
  saveProducts(products)
  res.json({ message: 'Deleted' })
})

// Make a user admin (only existing admins)
router.post('/make-admin', authMiddleware, adminMiddleware, (req, res) => {
  const USERS_FILE = path.join(__dirname, '../data/users.json')
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
  const idx = users.findIndex(u => u.email === req.body.email)
  if (idx === -1) return res.status(404).json({ message: 'User not found' })
  users[idx].isAdmin = true
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  res.json({ message: 'User is now admin' })
})

module.exports = router