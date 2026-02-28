import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const API = 'http://localhost:3000/api'

const statusColors = {
  Processing: 'text-yellow-300 border-yellow-500/35',
  Shipped: 'text-blue-300 border-blue-500/35',
  Delivered: 'text-green-300 border-green-500/35',
  Cancelled: 'text-red-300 border-red-500/35',
}

export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetch(`${API}/orders/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false))
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <>
      <div className="min-h-screen bg-[#050505] pb-16">
        {/* Hero header */}
        <div className="bg-[#070707] border-b border-white/10 pt-[88px] sm:pt-[96px] pb-8 px-5 sm:px-6 lg:px-16">
          <div className="max-w-5xl mx-auto flex items-center gap-5 sm:gap-6">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-yellow-400/10 border border-yellow-500/40 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-xl sm:text-2xl text-yellow-300">
                {user?.name[0]}
              </span>
            </div>
            {/* Name block */}
            <div>
              <p className="text-[10px] sm:text-[11px] tracking-[0.36em] uppercase text-yellow-300 mb-1">
                My Account
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl text-white font-light">
                Welcome back,{' '}
                <span className="text-yellow-300">{firstName}</span>
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {user?.email}
              </p>
              {user?.isAdmin && (
                <span className="text-[10px] tracking-[0.26em] uppercase text-yellow-300 border border-yellow-500/40 px-2 py-0.5 mt-1 inline-block rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-16 pt-8 sm:pt-10">
          {/* Quick action cards */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { label: 'Shop', icon: '🛍️', action: () => navigate('/') },
              {
                label: 'Checkout',
                icon: '💳',
                action: () => navigate('/checkout'),
              },
              user?.isAdmin
                ? {
                    label: 'Admin Panel',
                    icon: '⚙️',
                    action: () => navigate('/admin'),
                  }
                : null,
              { label: 'Sign Out', icon: '🚪', action: handleLogout },
            ]
              .filter(Boolean)
              .map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={item.action}
                  className="bg-[#070707] border border-white/10 p-4 sm:p-5 text-left hover:border-yellow-500/35 transition-all group rounded-2xl"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <span className="text-xl sm:text-2xl mb-2 block">
                    {item.icon}
                  </span>
                  <p className="text-white text-sm group-hover:text-yellow-300 transition-colors">
                    {item.label}
                  </p>
                </motion.button>
              ))}
          </motion.div>

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-serif text-xl sm:text-2xl text-white">
                Order History
              </h2>
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-gray-600 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>

            {loadingOrders ? (
              <p className="text-gray-600 text-sm tracking-wide">
                Loading orders...
              </p>
            ) : orders.length === 0 ? (
              <div className="bg-[#070707] border border-white/10 p-8 sm:p-10 text-center rounded-2xl">
                <p className="text-gray-500 text-sm tracking-wide mb-4">
                  You have no orders yet.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="text-[11px] tracking-[0.3em] uppercase text-yellow-300 hover:text-yellow-200 transition-colors"
                >
                  Start Shopping →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .slice()
                  .reverse()
                  .map((order, i) => (
                    <motion.div
                      key={order.id}
                      className="bg-[#070707] border border-white/10 p-5 sm:p-6 rounded-2xl"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
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
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-300 text-sm font-medium">
                            ${order.total}
                          </span>
                          <span
                            className={`text-[10px] tracking-[0.28em] uppercase px-2.5 py-1 rounded-full border ${
                              statusColors[order.status] ||
                              'text-gray-400 border-white/15'
                            }`}
                          >
                            {order.status}
                          </span>
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
        </div>
      </div>
      <Footer />
    </>
  )
}