import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      if (isLogin) await login(form.email, form.password)
      else await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3.5 rounded-xl outline-none focus:border-yellow-500/70 placeholder-gray-700 transition-all duration-200'
  const labelClass =
    'text-[11px] tracking-[0.22em] uppercase text-gray-500 mb-2 block'

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col lg:flex-row">
      {/* Left panel (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#070707] border-r border-white/6 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-transparent to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h1 className="font-serif text-4xl xl:text-5xl tracking-[0.4em] text-white mb-4">
            MAISON NOIR
          </h1>
          <div className="w-16 h-px bg-yellow-500/60 mx-auto mb-6" />
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Luxury fashion for those who appreciate the finer things in life.
            Crafted with intention, worn with distinction.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 text-center">
            {[
              ['10+', 'Years'],
              ['500+', 'Pieces'],
              ['50K+', 'Clients'],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="font-serif text-2xl text-yellow-400">{num}</p>
                <p className="text-gray-600 text-[11px] tracking-[0.24em] uppercase mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="font-serif text-3xl tracking-[0.4em] text-white">
              MAISON NOIR
            </h1>
            <div className="w-10 h-px bg-yellow-500/60 mx-auto mt-3" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tabs */}
            <div className="flex mb-8 border-b border-white/8">
              {['Sign In', 'Create Account'].map((tab, i) => {
                const active = isLogin ? i === 0 : i === 1
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setIsLogin(i === 0)
                      setError('')
                    }}
                    className={`flex-1 pb-3 text-[11px] tracking-[0.28em] uppercase transition-all duration-200 ${
                      active
                        ? 'text-yellow-400 border-b-2 border-yellow-400 -mb-px'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={inputClass}
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className={inputClass + ' pr-12'}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-[11px] transition-colors"
                      >
                        {showPass ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mt-4 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-lg"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-red-300 text-xs tracking-wide">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-6 py-3.5 bg-yellow-400 text-black text-[11px] font-semibold tracking-[0.32em] uppercase rounded-full hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : isLogin ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </motion.button>

                <p className="text-center text-gray-600 text-xs mt-5 tracking-wide">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError('')
                    }}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    {isLogin ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}