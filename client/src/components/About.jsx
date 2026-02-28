import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-16 bg-[#0e0e0e]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

        {/* Image Side */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="About Maison Noir"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          {/* Decorative gold border offset */}
          <div className="absolute -bottom-4 -right-4 w-full h-full border border-yellow-700/30 -z-10" />
        </motion.div>

        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-4">Our Story</p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white leading-tight mb-8">
            Born from Silence,<br />
            <em className="text-yellow-600">Built for Legacy.</em>
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 tracking-wide">
            MAISON NOIR was founded on a single belief — that true luxury is felt, not flaunted. Every piece in our collection is a study in restraint, precision, and timeless elegance.
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 tracking-wide">
            We source only the finest fabrics from ateliers across Europe, crafting garments that outlast trends and define identity. Each stitch is intentional. Each silhouette, deliberate.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mb-10 border-t border-white/10 pt-8">
            {[
              { value: '2015', label: 'Est.' },
              { value: '200+', label: 'Pieces' },
              { value: '40+', label: 'Countries' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl text-yellow-600 mb-1">{stat.value}</p>
                <p className="text-xs tracking-widest uppercase text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <a
            href="#featured"
            className="inline-block px-10 py-4 border border-yellow-700/50 text-yellow-600 text-xs font-medium tracking-[0.25em] uppercase hover:bg-yellow-600 hover:text-black transition-all duration-300 hover:-translate-y-0.5"
          >
            Discover More
          </a>
        </motion.div>

      </div>
    </section>
  )
}
