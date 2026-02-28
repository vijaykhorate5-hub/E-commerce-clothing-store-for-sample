const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

const USERS_FILE = path.join(__dirname, '../data/users.json')

const getUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return []
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'))
}

const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET || 'maisonnoir_secret',
    { expiresIn: '7d' }
  )
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' })

    const users = getUsers()
    if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashed,
      isAdmin: false,
      orders: [],
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveUsers(users)

    const token = generateToken(newUser)
    res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'All fields required' })

    const users = getUsers()
    const user = users.find(u => u.email === email)
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = generateToken(user)
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'No token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'maisonnoir_secret')
    const users = getUsers()
    const user = users.find(u => u.id === decoded.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.json({ id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin })
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' })
  }
})

module.exports = router






