const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true },
  tag: { type: String, default: null },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  collection: { type: String, enum: ['new-arrivals', 'featured'], required: true },
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
