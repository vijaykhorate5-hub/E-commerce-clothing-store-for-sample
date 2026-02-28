import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const API = 'http://localhost:3000/api'

const statusColors = {
  Processing: 'text-yellow-500',
  Shipped: 'text-blue-400',
  Delivered: 'text-green-400',
  Cancelled: 'text-red-400'
}

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    fetch(`${API}/orders/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [user])

  const handleLogout = () => { logout(); navigate('/') }

  // Only use first name for the greeting
  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] pb-24">

        {/* Page hero — separate full-width section so nothing can overlap navbar */}
        <div className="bg-[#0d0d0d] border-b border-white/5 pt-28 pb-10 px-6 md:px-16">
          <div className="max-w-5xl mx-auto flex items-center gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 bg-yellow-600/10 border border-yellow-700/30 flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-2xl text-yellow-600">{user?.name[0]}</span>
            </div>
            {/* Name block */}
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-1">My Account</p>
              <h1 className="font-serif text-2xl text-white font-light">
                Welcome back, <span className="text-yellow-500">{firstName}</span>
              </h1>
              <p className="text-gray-500 text-xs mt-1 tracking-wide">{user?.email}</p>
              {user?.isAdmin && (
                <span className="text-xs tracking-widest uppercase text-yellow-600 border border-yellow-700/30 px-2 py-0.5 mt-1 inline-block">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 md:px-16 pt-10">

          {/* Quick action cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { label: 'Shop', icon: '🛍️', action: () => navigate('/') },
              { label: 'Checkout', icon: '💳', action: () => navigate('/checkout') },
              user?.isAdmin ? { label: 'Admin Panel', icon: '⚙️', action: () => navigate('/admin') } : null,
              { label: 'Sign Out', icon: '🚪', action: handleLogout },
            ].filter(Boolean).map((item, i) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className="bg-[#111] border border-white/5 p-5 text-left hover:border-yellow-700/30 transition-all group"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-white text-sm group-hover:text-yellow-600 transition-colors">{item.label}</p>
              </motion.button>
            ))}
          </motion.div>

          {/* Order History */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-serif text-2xl text-white">Order History</h2>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-gray-600 text-xs tracking-widest uppercase">{orders.length} orders</span>
            </div>

            {loadingOrders ? (
              <p className="text-gray-600 text-sm tracking-wide">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="bg-[#111] border border-white/5 p-10 text-center">
                <p className="text-gray-600 text-sm tracking-wide mb-4">No orders yet.</p>
                <button onClick={() => navigate('/')} className="text-xs tracking-widest uppercase text-yellow-600 hover:text-yellow-500 transition-colors">
                  Start Shopping →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.slice().reverse().map((order, i) => (
                  <motion.div
                    key={order.id}
                    className="bg-[#111] border border-white/5 p-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-white text-sm font-medium">{order.id}</p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-yellow-600 text-sm">${order.total}</span>
                        <span className={`text-xs tracking-widest uppercase ${statusColors[order.status] || 'text-gray-400'}`}>
                          {order.status}
                        </span>
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

        </div>
      </div>
      <Footer />
    </>
  )
}