import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] sm:min-h-screen flex items-center"
      style={{
        background:
          'radial-gradient(circle at top, rgba(201,168,76,0.16) 0, rgba(0,0,0,0) 55%), linear-gradient(135deg, #050505 0%, #0c0c0c 40%, #050505 100%)',
      }}
    >
      {/* Soft vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom,_rgba(0,0,0,0.6),_transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-12 py-20 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left: text */}
        <motion.div
          className="w-full max-w-xl text-center lg:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <p className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase text-yellow-400 mb-5 sm:mb-6">
            Maison Noir · 2025 Collection
          </p>

          <motion.h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.08] text-white mb-5 sm:mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Quiet&nbsp;
            <span className="text-yellow-400">Luxury</span>
            <br className="hidden sm:block" />
            <span className="text-white/80">Louder Than Words.</span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-[15px] text-gray-400 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 sm:mb-10 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.9 }}
          >
            Tailored silhouettes, meticulous fabrics, and minimalist lines.
            Designed for those who never have to raise their voice to be seen.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <a
              href="#featured"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 bg-yellow-400 text-black text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase rounded-full hover:bg-yellow-300 hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Collection
            </a>
            <a
              href="#new-arrivals"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 border border-yellow-500/60 text-yellow-400 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-yellow-400 hover:text-black hover:-translate-y-0.5 transition-all duration-300"
            >
              New Arrivals
            </a>
          </motion.div>
        </motion.div>

        {/* Right: visual panel */}
        <motion.div
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg aspect-[3/4] overflow-hidden rounded-[26px] border border-yellow-600/20 bg-gradient-to-b from-zinc-900/70 to-black shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          <img
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80"
            alt="Maison Noir Editorial"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

          <div className="absolute bottom-5 sm:bottom-6 left-5 right-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-1">
                Lookbook · 09
              </p>
              <p className="font-serif text-lg text-white">
                Midnight Atelier
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="text-[10px] tracking-[0.25em] uppercase text-yellow-300">
                Drop II
              </span>
              <span className="text-xs text-gray-400">
                Limited pieces · Worldwide
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.9 }}
      >
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-gray-500">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 sm:h-10 bg-yellow-400/60 origin-top"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        />
      </motion.div>
    </section>
  )
}