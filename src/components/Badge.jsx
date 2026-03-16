const STYLES = {
  personal: 'text-violet-400 border-violet-900',
  family:   'text-blue-400 border-blue-900',
  health:   'text-emerald-400 border-emerald-900',
  work:     'text-orange-400 border-orange-900',
  other:    'text-t3 border-rim-hi',
}

export default function Badge({ category }) {
  if (!category) return null
  return (
    <span className={`inline-block font-mono text-[10px] uppercase tracking-widest px-1.5 py-px border ${STYLES[category] ?? STYLES.other}`}>
      {category}
    </span>
  )
}
