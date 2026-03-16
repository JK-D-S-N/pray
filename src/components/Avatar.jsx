export default function Avatar({ initials, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  }
  return (
    <div className={`bg-gold-dim text-gold font-mono font-medium flex items-center justify-center flex-shrink-0 border border-yellow-900 ${sizes[size]} ${className}`}>
      {initials || '?'}
    </div>
  )
}
