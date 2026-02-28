import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const API = 'http://localhost:3000/api'
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

const emptyForm = {
  name: '',
  category: '',
  price: '',
  tag: '',
  image: '',
  collection: 'new-arrivals',
  description: '',
}

const collections = ['new-arrivals', 'featured']
const tags = ['New', 'Featured', 'Sale', 'Limited', '']
const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!user) return navigate('/auth')
    if (!user.isAdmin) return navigate('/')
    fetchProducts()
    fetchOrders()
  }, [user, navigate])

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`)
    const data = await res.json()
    setProducts(data)
  }

  const fetchOrders = async () => {
    const res = await fetch(`${API}/orders/all`, { headers: authHeaders() })
    if (res.ok) setOrders(await res.json())
  }

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const openAdd = () => {
    setForm(emptyForm)
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = product => {
    setForm({
      ...product,
      price: String(product.price),
      description: product.description || '',
    })
    setEditing(product.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setLoading(true)
    setMsg('')
    try {
      const url = editing
        ? `${API}/admin/products/${editing}`
        : `${API}/admin/products`
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      await fetchProducts()
      setShowForm(false)
      setMsg(editing ? '✓ Product updated' : '✓ Product added')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    await fetch(`${API}/admin/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    setDeleteConfirm(null)
    await fetchProducts()
    setMsg('✓ Product deleted')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleStatusChange = async (orderId, status) => {
    await fetch(`${API}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    })
    await fetchOrders()
  }

  const inputClass =
    'w-full bg-[#050505] border border-white/12 text-white text-sm px-3.5 py-2.5 rounded-xl outline-none focus:border-yellow-400/70 placeholder-gray-700 transition-colors'
  const labelClass =
    'text-[11px] tracking-[0.2em] uppercase text-gray-500 mb-1.5 block'

  const statusColors = {
    Processing: 'text-yellow-300 border-yellow-500/35',
    Shipped: 'text-blue-300 border-blue-500/35',
    Delivered: 'text-green-300 border-green-500/35',
    Cancelled: 'text-red-300 border-red-500/35',
  }

  return (
    <>
      <div className="min-h-screen bg-[#050505] pt-[88px] sm:pt-[96px] pb-16 px-5 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-yellow-300 mb-2">
              Administration
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-white mb-2">
              Admin Panel
            </h1>
            <div className="w-16 h-px bg-yellow-400/60 mb-7" />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-6 border-b border-white/10 mb-7 sm:mb-8 overflow-x-auto">
            {['products', 'orders'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-[11px] tracking-[0.28em] uppercase transition-colors whitespace-nowrap ${
                  tab === t
                    ? 'text-yellow-300 border-b-2 border-yellow-300'
                    : 'text-gray-500 hover:text-gray-200'
                }`}
              >
                {t}{' '}
                <span className="ml-1 text-gray-600">
                  ({t === 'products' ? products.length : orders.length})
                </span>
              </button>
            ))}
          </div>

          {/* Flash message */}
          <AnimatePresence>
            {msg && (
              <motion.div
                className="mb-5 text-[11px] tracking-[0.3em] text-yellow-300 uppercase"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                {msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                <p className="text-gray-500 text-sm">
                  {products.length} products in catalog
                </p>
                <motion.button
                  onClick={openAdd}
                  className="bg-yellow-400 text-black text-[11px] font-semibold tracking-[0.28em] uppercase px-5 py-3 rounded-full hover:bg-yellow-300 transition-all"
                  whileTap={{ scale: 0.97 }}
                >
                  + Add Product
                </motion.button>
              </div>

              {/* Product table (scrollable on mobile) */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#070707]">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/20">
                      {['Product', 'Category', 'Collection', 'Price', 'Tag', 'Actions'].map(h => (
                        <th
                          key={h}
                          className="text-left text-[11px] tracking-[0.28em] uppercase text-gray-500 py-3.5 px-4"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <motion.tr
                        key={product.id}
                        className="border-b border-white/8 hover:bg-white/3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#111] overflow-hidden rounded-md flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={e => (e.target.style.display = 'none')}
                              />
                            </div>
                            <span className="text-white text-sm font-light">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-sm">
                          {product.category}
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-sm">
                          {product.collection}
                        </td>
                        <td className="py-3.5 px-4 text-yellow-300 text-sm">
                          ${product.price}
                        </td>
                        <td className="py-3.5 px-4">
                          {product.tag && (
                            <span className="text-[10px] border border-white/15 text-gray-300 px-2 py-0.5 rounded-full">
                              {product.tag}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-3 text-[10px] tracking-[0.28em] uppercase">
                            <button
                              onClick={() => openEdit(product)}
                              className="text-gray-400 hover:text-yellow-300 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="text-gray-500 hover:text-red-400 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {orders.length === 0 ? (
                <p className="text-gray-600 text-sm tracking-wide">
                  No orders yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      className="bg-[#070707] border border-white/10 p-5 sm:p-6 rounded-2xl"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-white text-sm font-medium">
                            {order.id}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {order.shipping?.firstName}{' '}
                            {order.shipping?.lastName} ·{' '}
                            {order.shipping?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="text-yellow-300 text-sm font-medium">
                            ${order.total}
                          </span>
                          <select
                            value={order.status}
                            onChange={e =>
                              handleStatusChange(order.id, e.target.value)
                            }
                            className={`bg-[#050505] border text-[10px] tracking-[0.26em] uppercase px-3 py-1.5 rounded-full outline-none cursor-pointer ${
                              statusColors[order.status] ||
                              'text-gray-400 border-white/15'
                            }`}
                          >
                            {statuses.map(s => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {order.items?.map((item, j) => (
                          <span
                            key={j}
                            className="text-[11px] text-gray-400 bg-[#111] px-3 py-1 rounded-full"
                          >
                            {item.name} × {item.quantity}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="bg-[#070707] border border-white/10 w-full max-w-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto rounded-2xl"
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-serif text-xl sm:text-2xl text-white">
                  {editing ? 'Edit Product' : 'Add Product'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Onyx Overcoat"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Outerwear"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Price (numbers only)</label>
                  <input
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="1290"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Collection</label>
                  <select
                    name="collection"
                    value={form.collection}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {collections.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tag</label>
                  <select
                    name="tag"
                    value={form.tag}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {tags.map(t => (
                      <option key={t} value={t}>
                        {t || 'None'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Image URL</label>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://images.pexels.com/..."
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description (optional)</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="A short product description..."
                    className={inputClass + ' resize-none'}
                  />
                </div>
              </div>

              {/* Preview */}
              {form.image && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#050505] overflow-hidden rounded-md">
                    <img
                      src={form.image}
                      alt="preview"
                      className="w-full h-full object-cover"
                      onError={e => (e.target.style.display = 'none')}
                    />
                  </div>
                  <p className="text-gray-500 text-xs">Image preview</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-7">
                <motion.button
                  onClick={handleSave}
                  disabled={loading || !form.name || !form.price}
                  className="flex-1 py-3 bg-yellow-400 text-black text-[11px] font-semibold tracking-[0.28em] uppercase rounded-full hover:bg-yellow-300 transition-all disabled:opacity-40"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading
                    ? 'Saving...'
                    : editing
                    ? 'Update Product'
                    : 'Add Product'}
                </motion.button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-white/12 text-gray-300 text-[11px] tracking-[0.28em] uppercase rounded-full hover:border-white/35 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#070707] border border-white/10 p-7 max-w-sm w-full text-center rounded-2xl"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
            >
              <h3 className="font-serif text-xl text-white mb-2">
                Delete Product?
              </h3>
              <p className="text-gray-500 text-sm mb-7">
                This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 bg-red-500/90 text-white text-[11px] tracking-[0.28em] uppercase rounded-full hover:bg-red-500 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 border border-white/12 text-gray-300 text-[11px] tracking-[0.28em] uppercase rounded-full hover:border-white/35 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  )
}