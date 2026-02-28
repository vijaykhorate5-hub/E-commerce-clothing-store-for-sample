import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ImageGallery({ image, name }) {
  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // Generate multiple views from same image with different crop hints via CSS
  const views = [
    { label: 'Front', style: 'object-center' },
    { label: 'Detail', style: 'object-top' },
    { label: 'Side', style: 'object-bottom' },
    { label: 'Back', style: 'object-left' },
  ]

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-3">
        {/* Thumbnails */}
        <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {views.map((view, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all duration-200 ${
                selected === i ? 'border-yellow-600' : 'border-white/5 hover:border-white/20'
              }`}
            >
              <img
                src={image}
                alt={`${name} view ${i + 1}`}
                className={`w-full h-full object-cover ${view.style}`}
                onError={e => e.target.style.display = 'none'}
              />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div
          className="relative flex-1 aspect-[3/4] bg-[#111] overflow-hidden cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selected}
              src={image}
              alt={name}
              className={`w-full h-full object-cover ${views[selected].style}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              onError={e => {
                e.target.style.display = 'none'
                e.target.parentElement.innerHTML += '<div class="w-full h-full flex items-center justify-center absolute inset-0"><span class="font-serif text-6xl text-gray-700">MN</span></div>'
              }}
            />
          </AnimatePresence>

          {/* View label */}
          <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1">
            <span className="text-white/60 text-xs tracking-widest uppercase">{views[selected].label}</span>
          </div>

          {/* Zoom hint */}
          <div className="absolute top-3 right-3 bg-black/60 p-1.5 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <motion.img
              src={image}
              alt={name}
              className={`max-h-[90vh] max-w-full object-contain ${views[selected].style}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl transition-colors"
              onClick={() => setLightbox(false)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}