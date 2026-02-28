const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

const WISHLIST_FILE = path.join(__dirname, '../data/wishlists.json')

const getWishlists = () => {
  try {
    if (!fs.existsSync(WISHLIST_FILE)) {
      fs.writeFileSync(WISHLIST_FILE, '{}')
      return {}
    }
    const raw = fs.readFileSync(WISHLIST_FILE, 'utf-8').trim()
    if (!raw || raw === '') return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const saveWishlists = (w) => {
  fs.writeFileSync(WISHLIST_FILE, JSON.stringify(w, null, 2))
}

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Login required' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'maisonnoir_secret')
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Get my wishlist
router.get('/', authMiddleware, (req, res) => {
  try {
    const wishlists = getWishlists()
    res.json(wishlists[req.user.id] || [])
  } catch (err) {
    res.status(500).json({ message: 'Error fetching wishlist' })
  }
})

// Toggle item
router.post('/toggle', authMiddleware, (req, res) => {
  try {
    const { product } = req.body
    if (!product) return res.status(400).json({ message: 'Product required' })
    const wishlists = getWishlists()
    const list = wishlists[req.user.id] || []
    const idx = list.findIndex(p => String(p.id) === String(product.id))
    let action
    if (idx !== -1) {
      list.splice(idx, 1)
      action = 'removed'
    } else {
      list.push(product)
      action = 'added'
    }
    wishlists[req.user.id] = list
    saveWishlists(wishlists)
    res.json({ action, wishlist: list })
  } catch (err) {
    res.status(500).json({ message: 'Error updating wishlist' })
  }
})

module.exports = router