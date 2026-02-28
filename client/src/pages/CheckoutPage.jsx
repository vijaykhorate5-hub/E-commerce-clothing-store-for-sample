import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const API = 'http://localhost:3000/api'
const steps = ['Shipping', 'Payment', 'Review']

const inputClass = "w-full bg-[#111] border border-white/8 text-white text-sm px-4 py-3.5 outline-none focus:border-yellow-700/60 placeholder-gray-700 transition-all duration-200 rounded-none"
const labelClass = "text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 block"

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: user?.email || '',
    phone: '', address: '', city: '', state: '', zip: '', country: 'India'
  })
  const [payment, setPayment] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' })

  // Coupon state
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState('')
  const [discount, setDiscount] = useState(0)

  const finalTotal = totalPrice - discount

  const handleShipping = e => setShipping({ ...shipping, [e.target.name]: e.target.value })
  const handlePayment = e => setPayment({ ...payment, [e.target.name]: e.target.value })

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await fetch(`${API}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal: totalPrice })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setCoupon(data.coupon)
      setDiscount(data.discount)
    } catch (err) {
      setCouponError(err.message)
      setCoupon(null)
      setDiscount(0)
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setCoupon(null)
    setDiscount(0)
    setCouponCode('')
    setCouponError('')
  }

  const placeOrder = async () => {
    setLoading(true)
    try {
      const orderData = { items: cart, shipping, total: finalTotal, coupon: coupon?.code || null, discount }
      let newOrderId = 'ORD-' + Date.now()
      if (user) {
        const res = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(orderData)
        })
        const data = await res.json()
        if (data.id) newOrderId = data.id
      }
      setOrderId(newOrderId)
      clearCart()
      setDone(true)
      setTimeout(() => navigate('/'), 5000)
    } catch {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
        <motion.div
          className="w-20 h-20 border-2 border-yellow-600 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <span className="text-yellow-600 text-3xl">✓</span>
        </motion.div>
        <h1 className="font-serif text-4xl text-white mb-3">Order Confirmed</h1>
        <p className="text-yellow-600 text-sm tracking-widest mb-2">{orderId}</p>
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-8">A confirmation has been sent to {shipping.email}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {user && (
            <button onClick={() => navigate('/account')} className="text-xs tracking-widest uppercase text-yellow-600 border border-yellow-700/30 px-6 py-3 hover:bg-yellow-600/10 transition-all">
              View Orders
            </button>
          )}
          <button onClick={() => navigate('/')} className="text-xs tracking-widest uppercase text-gray-400 border border-white/10 px-6 py-3 hover:border-white/30 transition-all">
            Continue Shopping
          </button>
        </div>
        <p className="text-gray-700 text-xs mt-8 tracking-wide">Redirecting in 5 seconds...</p>
      </motion.div>
    </div>
  )

  if (cart.length === 0) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-5">
      <p className="font-serif text-2xl text-white">Your cart is empty</p>
      <button onClick={() => navigate('/')} className="text-xs tracking-widest uppercase text-yellow-600 border border-yellow-700/30 px-8 py-3 hover:bg-yellow-600/10 transition-all">
        Browse Collection
      </button>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-2">Secure Checkout</p>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-white">Complete Your Order</h1>
          </div>

          {/* Step indicators */}
          <div className="flex items-center mb-10 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-shrink-0">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-yellow-600' : 'text-gray-600'}`}>
                  <div className={`w-7 h-7 flex items-center justify-center border text-xs font-medium transition-all ${
                    i < step ? 'bg-yellow-600 border-yellow-600 text-black' :
                    i === step ? 'border-yellow-600 text-yellow-600' : 'border-white/10 text-gray-600'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className="text-xs tracking-widest uppercase hidden sm:block">{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-8 md:w-16 h-px mx-3 transition-all ${i < step ? 'bg-yellow-600/50' : 'bg-white/5'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form area */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

                {/* STEP 0 — Shipping */}
                {step === 0 && (
                  <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-serif text-2xl text-white mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className={labelClass}>First Name</label><input name="firstName" value={shipping.firstName} onChange={handleShipping} className={inputClass} placeholder="John" /></div>
                      <div><label className={labelClass}>Last Name</label><input name="lastName" value={shipping.lastName} onChange={handleShipping} className={inputClass} placeholder="Doe" /></div>
                      <div><label className={labelClass}>Email</label><input name="email" type="email" value={shipping.email} onChange={handleShipping} className={inputClass} placeholder="john@example.com" /></div>
                      <div><label className={labelClass}>Phone</label><input name="phone" value={shipping.phone} onChange={handleShipping} className={inputClass} placeholder="+91 98765 43210" /></div>
                      <div className="sm:col-span-2"><label className={labelClass}>Address</label><input name="address" value={shipping.address} onChange={handleShipping} className={inputClass} placeholder="123 Street, Apt 4B" /></div>
                      <div><label className={labelClass}>City</label><input name="city" value={shipping.city} onChange={handleShipping} className={inputClass} placeholder="Mumbai" /></div>
                      <div><label className={labelClass}>State</label><input name="state" value={shipping.state} onChange={handleShipping} className={inputClass} placeholder="Maharashtra" /></div>
                      <div><label className={labelClass}>ZIP</label><input name="zip" value={shipping.zip} onChange={handleShipping} className={inputClass} placeholder="400001" /></div>
                      <div><label className={labelClass}>Country</label><input name="country" value={shipping.country} onChange={handleShipping} className={inputClass} /></div>
                    </div>
                    <motion.button onClick={() => setStep(1)} disabled={!shipping.firstName || !shipping.email || !shipping.address}
                      className="mt-8 w-full sm:w-auto px-12 py-4 bg-yellow-600 text-black text-xs font-semibold tracking-[0.3em] uppercase hover:bg-yellow-500 transition-all disabled:opacity-40"
                      whileTap={{ scale: 0.98 }}>
                      Continue to Payment
                    </motion.button>
                  </motion.div>
                )}

                {/* STEP 1 — Payment */}
                {step === 1 && (
                  <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-serif text-2xl text-white mb-6">Payment Details</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div><label className={labelClass}>Card Number</label><input name="cardNumber" value={payment.cardNumber} onChange={handlePayment} className={inputClass} placeholder="4242 4242 4242 4242" maxLength={19} /></div>
                      <div><label className={labelClass}>Cardholder Name</label><input name="cardName" value={payment.cardName} onChange={handlePayment} className={inputClass} placeholder="John Doe" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className={labelClass}>Expiry</label><input name="expiry" value={payment.expiry} onChange={handlePayment} className={inputClass} placeholder="MM/YY" maxLength={5} /></div>
                        <div><label className={labelClass}>CVV</label><input name="cvv" value={payment.cvv} onChange={handlePayment} className={inputClass} placeholder="•••" maxLength={4} type="password" /></div>
                      </div>
                    </div>

                    {/* Coupon section */}
                    <div className="mt-6 border-t border-white/5 pt-6">
                      <h3 className="text-xs tracking-widest uppercase text-gray-400 mb-3">Coupon Code</h3>
                      {!coupon ? (
                        <div className="flex gap-2">
                          <input
                            value={couponCode}
                            onChange={e => { setCouponCode(e.target.value); setCouponError('') }}
                            onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                            className={inputClass + ' flex-1'}
                            placeholder="Enter code (e.g. NOIR10)"
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={couponLoading || !couponCode}
                            className="px-5 py-3.5 border border-yellow-700/40 text-yellow-600 text-xs tracking-widest uppercase hover:bg-yellow-600/10 transition-all disabled:opacity-40 flex-shrink-0"
                          >
                            {couponLoading ? '...' : 'Apply'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between bg-yellow-600/10 border border-yellow-700/30 px-4 py-3">
                          <div>
                            <p className="text-yellow-600 text-sm font-medium">{coupon.code}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{coupon.description} — saving ${discount}</p>
                          </div>
                          <button onClick={removeCoupon} className="text-gray-500 hover:text-red-400 text-xs transition-colors">Remove</button>
                        </div>
                      )}
                      {couponError && <p className="text-red-400 text-xs mt-2 tracking-wide">{couponError}</p>}
                      {!coupon && <p className="text-gray-600 text-xs mt-2">Try: NOIR10 · WELCOME20 · FLAT50</p>}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => setStep(0)} className="px-6 py-4 border border-white/10 text-gray-400 text-xs tracking-widest uppercase hover:border-white/30 transition-all">Back</button>
                      <motion.button onClick={() => setStep(2)} disabled={!payment.cardNumber || !payment.cardName || !payment.expiry || !payment.cvv}
                        className="flex-1 py-4 bg-yellow-600 text-black text-xs font-semibold tracking-[0.3em] uppercase hover:bg-yellow-500 transition-all disabled:opacity-40"
                        whileTap={{ scale: 0.98 }}>
                        Review Order
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2 — Review */}
                {step === 2 && (
                  <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h2 className="font-serif text-2xl text-white mb-6">Review & Confirm</h2>
                    <div className="space-y-3 mb-6">
                      <div className="bg-[#111] border border-white/5 p-5">
                        <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">Shipping To</p>
                        <p className="text-white text-sm">{shipping.firstName} {shipping.lastName}</p>
                        <p className="text-gray-400 text-sm">{shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                        <p className="text-gray-400 text-sm">{shipping.email}</p>
                      </div>
                      <div className="bg-[#111] border border-white/5 p-5">
                        <p className="text-xs tracking-widest uppercase text-gray-500 mb-3">Payment</p>
                        <p className="text-white text-sm">•••• •••• •••• {payment.cardNumber.slice(-4)}</p>
                        <p className="text-gray-400 text-sm">{payment.cardName}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="px-6 py-4 border border-white/10 text-gray-400 text-xs tracking-widest uppercase hover:border-white/30 transition-all">Back</button>
                      <motion.button onClick={placeOrder} disabled={loading}
                        className="flex-1 py-4 bg-yellow-600 text-black text-xs font-semibold tracking-[0.3em] uppercase hover:bg-yellow-500 transition-all disabled:opacity-50"
                        whileTap={{ scale: 0.98 }}>
                        {loading ? 'Placing Order...' : `Place Order — $${finalTotal}`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Order summary sidebar */}
            <div className="lg:sticky lg:top-24 self-start">
              <div className="bg-[#0d0d0d] border border-white/5 p-6">
                <h3 className="font-serif text-lg text-white mb-5">Order Summary</h3>
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3 items-start">
                      <div className="w-14 h-18 bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-tight truncate">{item.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">Qty: {item.quantity} {item.size && `· ${item.size}`}</p>
                        <p className="text-yellow-600/80 text-xs mt-0.5">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span><span>${totalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount ({coupon?.code})</span><span>−${discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Shipping</span><span>Free</span>
                  </div>
                  <div className="flex justify-between text-white font-medium text-base pt-2 border-t border-white/5">
                    <span>Total</span><span className="text-yellow-500">${finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}