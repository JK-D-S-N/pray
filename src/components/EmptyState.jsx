import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, description, to }) {
  const inner = (
    <>
      {Icon && <Icon className="w-7 h-7 text-t3 mb-3" strokeWidth={1.25} />}
      <p className="font-mono text-xs uppercase tracking-widest text-t3">{title}</p>
      {description && <p className="font-mono text-[11px] text-t3 mt-1 opacity-60">{description}</p>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-rim hover:border-rim-hi transition-colors">
        {inner}
      </Link>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-rim">
      {inner}
    </div>
  )
}
