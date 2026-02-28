const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

const REVIEWS_FILE = path.join(__dirname, '../data/reviews.json')

const getReviews = () => {
  if (!fs.existsSync(REVIEWS_FILE)) return []
  return JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'))
}
const saveReviews = (r) => fs.writeFileSync(REVIEWS_FILE, JSON.stringify(r, null, 2))

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

// Get reviews for a product
router.get('/:productId', (req, res) => {
  const all = getReviews().filter(r => r.productId === req.params.productId)
  res.json(all)
})

// Add a review
router.post('/:productId', authMiddleware, (req, res) => {
  const { rating, comment } = req.body
  if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment required' })
  const reviews = getReviews()
  const already = reviews.find(r => r.productId === req.params.productId && r.userId === req.user.id)
  if (already) return res.status(400).json({ message: 'You have already reviewed this product' })

  const review = {
    id: 'REV-' + Date.now(),
    productId: req.params.productId,
    userId: req.user.id,
    userName: req.user.name || 'Customer',
    rating: parseInt(rating),
    comment,
    createdAt: new Date().toISOString()
  }
  reviews.push(review)
  saveReviews(reviews)
  res.status(201).json(review)
})

// Delete own review
router.delete('/:id', authMiddleware, (req, res) => {
  let reviews = getReviews()
  const review = reviews.find(r => r.id === req.params.id)
  if (!review) return res.status(404).json({ message: 'Not found' })
  if (review.userId !== req.user.id && !req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' })
  reviews = reviews.filter(r => r.id !== req.params.id)
  saveReviews(reviews)
  res.json({ message: 'Deleted' })
})

module.exports = router