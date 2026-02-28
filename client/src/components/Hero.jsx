import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="home"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)' }}
      className="relative min-h-screen flex items-center px-6 md:px-16 overflow-hidden"
    >
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 65%)' }}
      />

      {/* Decorative vertical line */}
      <div className="absolute left-6 md:left-16 top-1/4 h-40 w-px bg-yellow-700/30 hidden md:block" />

      <motion.div
        className="relative z-10 max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.p
          className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          New Collection 2025
        </motion.p>

        <motion.h1
          className="font-serif text-6xl md:text-8xl font-light leading-tight text-white mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Dressed in<br />
          <em className="text-yellow-600">Silence.</em>
        </motion.h1>

        <motion.p
          className="text-sm text-gray-500 leading-relaxed max-w-md mb-10 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          Where luxury meets restraint. Crafted for those who speak through what they wear.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <a
            href="#featured"
            className="inline-block px-10 py-4 bg-yellow-600 text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-yellow-500 transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            Explore Collection
          </a>
          <a
            href="#new-arrivals"
            className="inline-block px-10 py-4 border border-yellow-700/50 text-yellow-600 text-xs font-medium tracking-[0.25em] uppercase hover:bg-yellow-600 hover:text-black transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            New Arrivals
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs tracking-[0.3em] uppercase text-gray-600">Scroll</span>
        <motion.div
          className="w-px h-10 bg-yellow-700/50"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </motion.div>
    </section>
  )
}