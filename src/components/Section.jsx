import { motion } from 'framer-motion'

export default function Section({ id, className = '', children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`py-16 md:py-24 ${className}`}
    >
      {children}
    </motion.section>
  )
}
