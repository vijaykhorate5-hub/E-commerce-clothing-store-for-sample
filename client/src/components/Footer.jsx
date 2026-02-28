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
  return (
    <footer className="bg-[#060606] border-t border-yellow-700/10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">

        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-serif text-2xl tracking-widest text-white mb-4">MAISON NOIR</h3>
            <p className="text-gray-500 text-xs leading-relaxed tracking-wide mb-6">
              Luxury redefined. Silence elevated. Crafted for those who need no introduction.
            </p>
            <div className="flex gap-4">
              {['IG', 'TW', 'FB', 'PT'].map((social) => (
                <a key={social} href="#" className="w-8 h-8 border border-white/10 flex items-center justify-center text-xs text-gray-500 hover:border-yellow-600 hover:text-yellow-600 transition-all duration-300">
                  {social}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h4 className="text-xs tracking-[0.3em] uppercase text-yellow-600 mb-6">{title}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-gray-500 text-sm hover:text-white transition-colors duration-300 tracking-wide">
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
          className="border-t border-white/5 pt-12 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-yellow-600 mb-2">Stay in the Know</p>
              <p className="text-gray-500 text-sm tracking-wide">Subscribe for exclusive drops and early access.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-[#1a1a1a] border border-white/10 text-white text-xs tracking-wide px-5 py-4 w-full md:w-72 outline-none focus:border-yellow-700/50 placeholder-gray-600 transition-colors"
              />
              <button className="bg-yellow-600 text-black text-xs font-semibold tracking-widest uppercase px-6 py-4 hover:bg-yellow-500 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs tracking-widest">
            © 2025 MAISON NOIR. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs tracking-widest">
            Crafted with precision. Worn with intention.
          </p>
        </div>

      </div>
    </footer>
  )
}
