const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')

const COUPONS_FILE = path.join(__dirname, '../data/coupons.json')

const getCoupons = () => {
  if (!fs.existsSync(COUPONS_FILE)) {
    const defaults = [
      { code: 'NOIR10', type: 'percent', value: 10, minOrder: 0, active: true, description: '10% off your order' },
      { code: 'WELCOME20', type: 'percent', value: 20, minOrder: 500, active: true, description: '20% off orders over $500' },
      { code: 'FLAT50', type: 'fixed', value: 50, minOrder: 200, active: true, description: '$50 off orders over $200' }
    ]
    fs.writeFileSync(COUPONS_FILE, JSON.stringify(defaults, null, 2))
    return defaults
  }
  return JSON.parse(fs.readFileSync(COUPONS_FILE, 'utf-8'))
}

router.post('/validate', (req, res) => {
  const { code, orderTotal } = req.body
  if (!code) return res.status(400).json({ message: 'Coupon code required' })
  const coupons = getCoupons()
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.active)
  if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' })
  if (orderTotal < coupon.minOrder) return res.status(400).json({ message: `Minimum order of $${coupon.minOrder} required` })
  const discount = coupon.type === 'percent'
    ? Math.round(orderTotal * coupon.value / 100)
    : Math.min(coupon.value, orderTotal)
  res.json({ valid: true, coupon, discount, final: orderTotal - discount })
})

module.exports = router