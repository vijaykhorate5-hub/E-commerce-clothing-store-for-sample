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

  const inputClass = "w-full bg-[#111] border border-white/8 text-white text-sm px-4 py-4 outline-none focus:border-yellow-700/60 placeholder-gray-700 transition-all duration-200"
  const labelClass = "text-xs tracking-[0.2em] uppercase text-gray-500 mb-2 block"

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-[#0d0d0d] border-r border-white/5 flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h1 className="font-serif text-5xl tracking-widest text-white mb-4">MAISON NOIR</h1>
          <div className="w-16 h-px bg-yellow-700/50 mx-auto mb-6" />
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Luxury fashion for those who appreciate the finer things in life. Crafted with intention, worn with distinction.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            {[['10+', 'Years'], ['500+', 'Products'], ['50K+', 'Clients']].map(([num, label]) => (
              <div key={label}>
                <p className="font-serif text-2xl text-yellow-600">{num}</p>
                <p className="text-gray-600 text-xs tracking-widest uppercase mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="font-serif text-3xl tracking-widest text-white">MAISON NOIR</h1>
            <div className="w-10 h-px bg-yellow-700/50 mx-auto mt-3" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Tabs */}
            <div className="flex mb-8 border-b border-white/5">
              {['Sign In', 'Create Account'].map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(i === 0); setError('') }}
                  className={`flex-1 pb-3 text-xs tracking-widest uppercase transition-all duration-200 ${
                    (isLogin ? i === 0 : i === 1)
                      ? 'text-yellow-600 border-b-2 border-yellow-600 -mb-px'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
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
                      <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        name="password" type={showPass ? 'text' : 'password'}
                        value={form.password} onChange={handleChange}
                        placeholder="••••••••" className={inputClass + ' pr-12'}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 text-xs transition-colors">
                        {showPass ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      className="mt-4 bg-red-600/10 border border-red-600/20 px-4 py-3"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-red-400 text-xs tracking-wide">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-yellow-600 text-black text-xs font-semibold tracking-[0.3em] uppercase hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50"
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : (isLogin ? 'Sign In' : 'Create Account')}
                </motion.button>

                <p className="text-center text-gray-600 text-xs mt-5 tracking-wide">
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-yellow-600 hover:text-yellow-500 transition-colors">
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