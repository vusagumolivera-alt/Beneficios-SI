'use client'

export type FilterState = {
  search: string
  rubro: string
  localidad: string
  descuento: string
  orden: string
}

type Props = {
  filters: FilterState
  onChange: (f: FilterState) => void
  rubros: string[]
  localidades: string[]
}

export default function Filters({ filters, onChange, rubros, localidades }: Props) {
  const set = (key: keyof FilterState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [key]: e.target.value })

  const hasActive = filters.rubro || filters.localidad || filters.descuento

  const selectCls = "w-full px-3 py-2.5 text-sm border border-[#d9ede2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f] bg-white appearance-none cursor-pointer"

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">🔍</span>
        <input
          type="text"
          placeholder="Buscar comercio o rubro..."
          value={filters.search}
          onChange={set('search')}
          className="w-full pl-11 pr-4 py-3.5 text-sm border border-[#d9ede2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/25 focus:border-[#25a35f] bg-white shadow-sm"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg"
          >×</button>
        )}
      </div>

      {/* Filter + sort row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <select value={filters.localidad} onChange={set('localidad')} className={selectCls}>
          <option value="">📍 Todas las zonas</option>
          {localidades.map(l => <option key={l} value={l}>📍 {l}</option>)}
        </select>

        <select value={filters.rubro} onChange={set('rubro')} className={selectCls}>
          <option value="">🏪 Todos los rubros</option>
          {rubros.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select value={filters.descuento} onChange={set('descuento')} className={selectCls}>
          <option value="">💰 Cualquier %</option>
          <option value="10">+10% OFF</option>
          <option value="15">+15% OFF</option>
          <option value="20">+20% OFF</option>
          <option value="30">+30% OFF</option>
        </select>

        <select value={filters.orden} onChange={set('orden')} className={selectCls}>
          <option value="descuento">⬆️ Mayor descuento</option>
          <option value="nombre">🔤 A → Z</option>
          <option value="nuevo">✨ Más nuevos</option>
        </select>
      </div>

      {hasActive && (
        <button
          onClick={() => onChange({ ...filters, rubro: '', localidad: '', descuento: '' })}
          className="text-xs text-[#25a35f] font-semibold hover:underline flex items-center gap-1"
        >
          × Limpiar filtros
        </button>
      )}
    </div>
  )
}
