'use client'

import { motion } from 'framer-motion'

export function LightsRow() {
  return (
    <div className="flex justify-center gap-3 py-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.08, duration: 0.3, ease: 'easeOut' }}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#2a2820',
            border: '1px solid #3a3830',
          }}
        />
      ))}
    </div>
  )
}
