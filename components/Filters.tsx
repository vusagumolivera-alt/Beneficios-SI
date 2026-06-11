'use client'

export type FilterState = {
  search: string
  rubro: string
  localidad: string
  descuento: string
}

type Props = {
  filters: FilterState
  onChange: (f: FilterState) => void
  rubros: string[]
  localidades: string[]
}

const DESCUENTO_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: '10% o más', value: '10' },
  { label: '15% o más', value: '15' },
  { label: '20% o más', value: '20' },
  { label: '30% o más', value: '30' },
]

export default function Filters({ filters, onChange, rubros, localidades }: Props) {
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value })

  const hasActive = filters.rubro || filters.localidad || filters.descuento

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#d9ede2] p-4 flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Buscar comercio..."
          value={filters.search}
          onChange={set('search')}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#d9ede2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f] bg-[#f0f7f3]"
        />
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Rubro</label>
          <select
            value={filters.rubro}
            onChange={set('rubro')}
            className="w-full px-3 py-2 text-sm border border-[#d9ede2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f] bg-[#f0f7f3]"
          >
            <option value="">Todos los rubros</option>
            {rubros.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Localidad</label>
          <select
            value={filters.localidad}
            onChange={set('localidad')}
            className="w-full px-3 py-2 text-sm border border-[#d9ede2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f] bg-[#f0f7f3]"
          >
            <option value="">Todas las localidades</option>
            {localidades.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Descuento mínimo</label>
          <select
            value={filters.descuento}
            onChange={set('descuento')}
            className="w-full px-3 py-2 text-sm border border-[#d9ede2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f] bg-[#f0f7f3]"
          >
            {DESCUENTO_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {hasActive && (
        <button
          onClick={() => onChange({ search: filters.search, rubro: '', localidad: '', descuento: '' })}
          className="text-xs text-[#25a35f] font-medium self-start hover:underline"
        >
          × Limpiar filtros
        </button>
      )}
    </div>
  )
}
