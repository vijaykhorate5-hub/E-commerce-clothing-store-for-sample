import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart()
  const navigate = useNavigate()

  const goCheckout = () => {
    setCartOpen(false)
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-[380px] md:w-[400px] bg-[#050505] border-l border-white/10 z-50 flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.9)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10">
              <div>
                <h2 className="font-serif text-lg sm:text-xl text-white font-light">
                  Shopping Bag
                </h2>
                <p className="text-gray-500 text-[11px] tracking-[0.24em] uppercase mt-1">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-white/45 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3 sm:py-4">
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <p className="text-gray-500 text-sm tracking-wide">
                      Your bag is empty
                    </p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-[11px] tracking-[0.28em] uppercase text-yellow-300 border border-yellow-500/40 px-6 py-2.5 rounded-full hover:bg-yellow-400/10 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </motion.div>
                ) : (
                  <div className="px-5 sm:px-6 space-y-3 sm:space-y-4">
                    {cart.map(item => (
                      <motion.div
                        key={`${item.id}-${item.size}`}
                        className="flex gap-3 sm:gap-4 py-3 border-b border-white/10"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        {/* Image */}
                        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-[#111] overflow-hidden rounded-md flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={e => (e.target.style.display = 'none')}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-500 text-[10px] tracking-[0.28em] uppercase mb-0.5">
                            {item.category}
                          </p>
                          <p className="text-white text-sm font-light leading-tight mb-1 truncate">
                            {item.name}
                          </p>
                          {item.size && (
                            <p className="text-gray-600 text-xs mb-1.5">
                              Size: {item.size}
                            </p>
                          )}
                          <p className="text-yellow-300 text-sm">
                            ${item.price}
                          </p>

                          {/* Quantity */}
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 border border-white/15 rounded-full text-gray-300 hover:text-white hover:border-white/40 transition-all text-sm flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="text-white text-sm w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 border border-white/15 rounded-full text-gray-300 hover:text-white hover:border-white/40 transition-all text-sm flex items-center justify-center"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-2 text-gray-600 hover:text-red-400 text-[11px] transition-colors tracking-[0.26em] uppercase"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-white/10 p-5 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm tracking-wide">
                    Subtotal
                  </span>
                  <span className="text-white text-lg font-light">
                    ${totalPrice}
                  </span>
                </div>
                <p className="text-gray-600 text-xs tracking-wide">
                  Shipping and discounts calculated at checkout.
                </p>
                <motion.button
                  onClick={goCheckout}
                  className="w-full py-3.5 bg-yellow-400 text-black text-[11px] font-semibold tracking-[0.3em] uppercase rounded-full hover:bg-yellow-300 transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                >
                  Checkout — ${totalPrice}
                </motion.button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 border border-white/15 text-gray-300 text-[11px] tracking-[0.28em] uppercase rounded-full hover:border-white/35 transition-all"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}