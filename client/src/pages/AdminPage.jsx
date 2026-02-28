import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const API = 'http://localhost:3000/api'
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
})

const emptyForm = {
  name: '', category: '', price: '', tag: '', image: '', collection: 'new-arrivals', description: ''
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
  }, [user])

  const fetchProducts = async () => {
    const res = await fetch(`${API}/products`)
    const data = await res.json()
    setProducts(data)
  }

  const fetchOrders = async () => {
    const res = await fetch(`${API}/orders/all`, { headers: authHeaders() })
    if (res.ok) setOrders(await res.json())
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowForm(true) }

  const openEdit = (product) => {
    setForm({ ...product, price: String(product.price), description: product.description || '' })
    setEditing(product.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    setLoading(true)
    setMsg('')
    try {
      const url = editing ? `${API}/admin/products/${editing}` : `${API}/admin/products`
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(form) })
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

  const handleDelete = async (id) => {
    await fetch(`${API}/admin/products/${id}`, { method: 'DELETE', headers: authHeaders() })
    setDeleteConfirm(null)
    await fetchProducts()
    setMsg('✓ Product deleted')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleStatusChange = async (orderId, status) => {
    await fetch(`${API}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    })
    await fetchOrders()
  }

  const inputClass = "w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-4 py-2.5 outline-none focus:border-yellow-700/50 placeholder-gray-700 transition-colors"
  const labelClass = "text-xs tracking-[0.15em] uppercase text-gray-500 mb-1.5 block"

  const statusColors = {
    Processing: 'text-yellow-500 border-yellow-700/30',
    Shipped: 'text-blue-400 border-blue-700/30',
    Delivered: 'text-green-400 border-green-700/30',
    Cancelled: 'text-red-400 border-red-700/30'
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-2">Administration</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-white mb-2">Admin Panel</h1>
            <div className="w-16 h-px bg-yellow-700/50 mb-8" />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-white/10 mb-10">
            {['products', 'orders'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-xs tracking-widest uppercase transition-colors ${tab === t ? 'text-yellow-600 border-b-2 border-yellow-600' : 'text-gray-500 hover:text-white'}`}
              >
                {t} <span className="ml-1 text-gray-600">({t === 'products' ? products.length : orders.length})</span>
              </button>
            ))}
          </div>

          {/* Flash message */}
          <AnimatePresence>
            {msg && (
              <motion.div
                className="mb-6 text-xs tracking-widest text-yellow-600 uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                {msg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* PRODUCTS TAB */}
          {tab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500 text-sm">{products.length} products in catalog</p>
                <motion.button
                  onClick={openAdd}
                  className="bg-yellow-600 text-black text-xs font-semibold tracking-[0.25em] uppercase px-6 py-3 hover:bg-yellow-500 transition-all"
                  whileTap={{ scale: 0.97 }}
                >
                  + Add Product
                </motion.button>
              </div>

              {/* Product table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Product', 'Category', 'Collection', 'Price', 'Tag', 'Actions'].map(h => (
                        <th key={h} className="text-left text-xs tracking-widest uppercase text-gray-600 pb-3 pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, i) => (
                      <motion.tr
                        key={product.id}
                        className="border-b border-white/5 hover:bg-white/2 group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <td className="py-4 pr-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                            </div>
                            <span className="text-white text-sm font-light">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-6 text-gray-400 text-sm">{product.category}</td>
                        <td className="py-4 pr-6 text-gray-400 text-sm">{product.collection}</td>
                        <td className="py-4 pr-6 text-yellow-600 text-sm">${product.price}</td>
                        <td className="py-4 pr-6">
                          {product.tag && <span className="text-xs border border-white/10 text-gray-400 px-2 py-0.5">{product.tag}</span>}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-3">
                            <button onClick={() => openEdit(product)} className="text-xs tracking-widest text-gray-500 hover:text-yellow-600 transition-colors uppercase">Edit</button>
                            <button onClick={() => setDeleteConfirm(product.id)} className="text-xs tracking-widest text-gray-500 hover:text-red-400 transition-colors uppercase">Delete</button>
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
                <p className="text-gray-600 text-sm tracking-wide">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      className="bg-[#111] border border-white/5 p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-white text-sm font-medium">{order.id}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{order.shipping?.firstName} {order.shipping?.lastName} · {order.shipping?.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-yellow-600 text-sm font-medium">${order.total}</span>
                          <select
                            value={order.status}
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            className={`bg-[#0a0a0a] border text-xs tracking-widest uppercase px-3 py-1.5 outline-none cursor-pointer ${statusColors[order.status] || 'text-gray-400 border-white/10'}`}
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items?.map((item, j) => (
                          <span key={j} className="text-xs text-gray-500 bg-[#1a1a1a] px-3 py-1">
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
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              className="bg-[#111] border border-white/10 w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white text-xl">✕</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Onyx Overcoat" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="Outerwear" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Price (numbers only)</label>
                  <input name="price" value={form.price} onChange={handleChange} placeholder="1290" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Collection</label>
                  <select name="collection" value={form.collection} onChange={handleChange} className={inputClass}>
                    {collections.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tag</label>
                  <select name="tag" value={form.tag} onChange={handleChange} className={inputClass}>
                    {tags.map(t => <option key={t} value={t}>{t || 'None'}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.pexels.com/..." className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description (optional)</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="A short product description..." className={inputClass + ' resize-none'} />
                </div>
              </div>

              {/* Preview */}
              {form.image && (
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0a0a0a] overflow-hidden">
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                  </div>
                  <p className="text-gray-500 text-xs">Image preview</p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <motion.button
                  onClick={handleSave}
                  disabled={loading || !form.name || !form.price}
                  className="flex-1 py-3 bg-yellow-600 text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-yellow-500 transition-all disabled:opacity-40"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                </motion.button>
                <button onClick={() => setShowForm(false)} className="px-6 py-3 border border-white/10 text-gray-400 text-xs tracking-widest uppercase hover:border-white/30 transition-all">
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
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#111] border border-white/10 p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            >
              <h3 className="font-serif text-xl text-white mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-8">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 bg-red-600/80 text-white text-xs tracking-widest uppercase hover:bg-red-600 transition-all">
                  Delete
                </button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-white/10 text-gray-400 text-xs tracking-widest uppercase hover:border-white/30 transition-all">
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