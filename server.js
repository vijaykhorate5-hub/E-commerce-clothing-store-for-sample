const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const fs = require('fs')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const getProducts = () => JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf-8'))

app.get('/api/products', (req, res) => res.json(getProducts()))
app.get('/api/products/collection/:name', (req, res) => res.json(getProducts().filter(p => p.collection === req.params.name)))
app.get('/api/products/:id', (req, res) => {
  const product = getProducts().find(p => p.id === parseInt(req.params.id))
  product ? res.json(product) : res.status(404).json({ message: 'Not found' })
})

app.use('/api/auth', require('./routes/auth'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/admin/products', require('./routes/adminProducts'))
app.use('/api/reviews', require('./routes/reviews'))
app.use('/api/wishlist', require('./routes/wishlist'))
app.use('/api/coupons', require('./routes/coupons'))

app.get('/api/status', (req, res) => res.json({ message: 'Maison Noir API running!' }))
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))