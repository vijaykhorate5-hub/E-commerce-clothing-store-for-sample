import { motion, AnimatePresence } from 'framer-motion'

const sizeData = [
  { size: 'XS', chest: '32-33"', waist: '24-25"', hips: '34-35"', uk: '6', eu: '34' },
  { size: 'S',  chest: '34-35"', waist: '26-27"', hips: '36-37"', uk: '8', eu: '36' },
  { size: 'M',  chest: '36-37"', waist: '28-29"', hips: '38-39"', uk: '10', eu: '38' },
  { size: 'L',  chest: '38-40"', waist: '30-31"', hips: '40-41"', uk: '12', eu: '40' },
  { size: 'XL', chest: '41-43"', waist: '32-33"', hips: '42-43"', uk: '14', eu: '42' },
]

const tips = [
  'Measure over your fullest part of the chest, keeping the tape horizontal.',
  'Measure around your natural waistline, the narrowest part of your torso.',
  'Measure around the fullest part of your hips and buttocks.',
  'When between sizes, we recommend sizing up for a relaxed fit.',
]

export default function SizeGuide({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-[#0d0d0d] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-yellow-600 mb-1">Maison Noir</p>
                <h2 className="font-serif text-2xl text-white font-light">Size Guide</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center">✕</button>
            </div>

            <div className="p-6">
              {/* Size table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['Size', 'Chest', 'Waist', 'Hips', 'UK', 'EU'].map(h => (
                        <th key={h} className="text-left text-xs tracking-widest uppercase text-gray-500 pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, i) => (
                      <tr key={row.size} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/2' : ''}`}>
                        <td className="py-3 pr-4 text-yellow-600 text-sm font-medium">{row.size}</td>
                        <td className="py-3 pr-4 text-gray-300 text-sm">{row.chest}</td>
                        <td className="py-3 pr-4 text-gray-300 text-sm">{row.waist}</td>
                        <td className="py-3 pr-4 text-gray-300 text-sm">{row.hips}</td>
                        <td className="py-3 pr-4 text-gray-400 text-sm">{row.uk}</td>
                        <td className="py-3 pr-4 text-gray-400 text-sm">{row.eu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* How to measure */}
              <div>
                <h3 className="text-white text-sm tracking-widest uppercase mb-4">How to Measure</h3>
                <div className="space-y-3">
                  {tips.map((tip, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="text-yellow-600 text-xs mt-0.5 flex-shrink-0">0{i + 1}</span>
                      <p className="text-gray-400 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}