const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

const ORDERS_FILE = path.join(__dirname, '../data/orders.json')
const USERS_FILE = path.join(__dirname, '../data/users.json')

const getOrders = () => {
  if (!fs.existsSync(ORDERS_FILE)) return []
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'))
}
const saveOrders = (o) => fs.writeFileSync(ORDERS_FILE, JSON.stringify(o, null, 2))
const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return []
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
}
const saveUsers = (u) => fs.writeFileSync(USERS_FILE, JSON.stringify(u, null, 2))

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

// Create order + send confirmation email
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shipping, total } = req.body
    const orders = getOrders()
    const newOrder = {
      id: 'ORD-' + Date.now(),
      userId: req.user.id,
      items,
      shipping,
      total,
      status: 'Processing',
      createdAt: new Date().toISOString()
    }
    orders.push(newOrder)
    saveOrders(newOrder ? orders : orders)

    // Attach to user
    const users = getUsers()
    const idx = users.findIndex(u => u.id === req.user.id)
    if (idx !== -1) {
      users[idx].orders = users[idx].orders || []
      users[idx].orders.push(newOrder.id)
      saveUsers(users)
    }

    // Send confirmation email (non-blocking)
    try {
      const { sendOrderConfirmation } = require('../services/emailService')
      await sendOrderConfirmation(newOrder, shipping.email)
    } catch (emailErr) {
      console.log('Email not sent (check .env config):', emailErr.message)
    }

    res.status(201).json(newOrder)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get my orders
router.get('/my', authMiddleware, (req, res) => {
  const orders = getOrders().filter(o => o.userId === req.user.id)
  res.json(orders)
})

// Get all orders (admin)
router.get('/all', authMiddleware, adminMiddleware, (req, res) => {
  res.json(getOrders())
})

// Update order status (admin)
router.patch('/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  const orders = getOrders()
  const idx = orders.findIndex(o => o.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Not found' })
  orders[idx].status = req.body.status
  saveOrders(orders)
  res.json(orders[idx])
})

module.exports = router