import { useState } from 'react'
import { motion } from 'framer-motion'

const footerLinks = {
  Navigate: [
    { label: 'Home', href: '#home' },
    { label: 'New Arrivals', href: '#new-arrivals' },
    { label: 'Collection', href: '#featured' },
    { label: 'About', href: '#about' },
  ],
  Support: [
    { label: 'Size Guide', href: '#' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 2500)
  }

  return (
    <footer className="bg-[#040404] border-t border-yellow-700/15">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10 py-14 sm:py-16 md:py-20">
        {/* Top: grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-14">
          {/* Brand */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-2xl tracking-[0.4em] text-white mb-4">
              MAISON NOIR
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed tracking-wide mb-6 max-w-xs">
              A study in quiet luxury. Tailored for those who prefer their presence to speak before they do.
            </p>
            <div className="flex gap-3">
              {['IG', 'TW', 'FB', 'PT'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-[11px] text-gray-500 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300 rounded-full"
                >
                  {social}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Columns */}
          {Object.entries(footerLinks).map(([title, links], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-yellow-400 mb-5">
                {title}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-white transition-colors duration-200 tracking-wide"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          className="border-t border-white/8 pt-8 sm:pt-10 mb-9"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 md:gap-8">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-yellow-400 mb-2">
                Stay in the know
              </p>
              <p className="text-gray-500 text-sm tracking-wide max-w-sm">
                Join the list for private drops, studio notes, and early access to new collections.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-0 w-full md:w-auto" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-[#111] border border-white/10 text-white text-xs tracking-wide px-4 sm:px-5 py-3.5 sm:py-4 w-full sm:w-72 outline-none focus:border-yellow-500/70 placeholder-gray-600 transition-colors rounded-full sm:rounded-l-full sm:rounded-r-none"
                />
                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="bg-yellow-400 text-black text-[11px] font-semibold tracking-[0.3em] uppercase px-6 py-3.5 sm:py-4 hover:bg-yellow-300 transition-all duration-300 whitespace-nowrap disabled:opacity-50 rounded-full sm:rounded-l-none sm:rounded-r-full"
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </form>
              {subscribed && (
                <motion.p
                  className="text-gray-500 text-xs mt-3 tracking-wide"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  You&apos;re in. Expect something special soon.
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <p className="text-gray-600 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase">
            © 2025 Maison Noir. All rights reserved.
          </p>
          <p className="text-gray-600 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase">
            Crafted with precision. Worn with intention.
          </p>
        </div>
      </div>
    </footer>
  )
}
