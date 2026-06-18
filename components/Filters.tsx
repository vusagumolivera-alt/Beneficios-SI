'use client'

import { MagnifyingGlass, MapPin, Storefront, Percent, SortAscending } from '@phosphor-icons/react'

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

  const selectCls = "w-full pl-8 pr-3 py-2.5 text-sm border border-[#d9ede2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f] bg-white appearance-none cursor-pointer text-slate-700"

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <MagnifyingGlass
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          size={16}
          weight="regular"
        />
        <input
          type="text"
          placeholder="Buscar comercio o rubro..."
          value={filters.search}
          onChange={set('search')}
          style={{ fontSize: '16px' }}
          className="w-full pl-11 pr-4 py-3.5 border border-[#d9ede2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/25 focus:border-[#25a35f] bg-white shadow-sm text-slate-800"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg leading-none"
          >×</button>
        )}
      </div>

      {/* Filter + sort row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="relative">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="regular" />
          <select value={filters.localidad} onChange={set('localidad')} className={selectCls}>
            <option value="">Todas las zonas</option>
            {localidades.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="relative">
          <Storefront className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="regular" />
          <select value={filters.rubro} onChange={set('rubro')} className={selectCls}>
            <option value="">Todos los rubros</option>
            {rubros.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="relative">
          <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="regular" />
          <select value={filters.descuento} onChange={set('descuento')} className={selectCls}>
            <option value="">Cualquier descuento</option>
            <option value="10">+10% OFF</option>
            <option value="15">+15% OFF</option>
            <option value="20">+20% OFF</option>
            <option value="30">+30% OFF</option>
          </select>
        </div>

        <div className="relative">
          <SortAscending className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} weight="regular" />
          <select value={filters.orden} onChange={set('orden')} className={selectCls}>
            <option value="descuento">Mayor descuento</option>
            <option value="nombre">A a Z</option>
            <option value="nuevo">Mas nuevos</option>
          </select>
        </div>
      </div>

      {hasActive && (
        <button
          onClick={() => onChange({ ...filters, rubro: '', localidad: '', descuento: '' })}
          className="text-xs text-[#25a35f] font-semibold hover:underline"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
