'use client'

import { MagnifyingGlass, MapPin, Percent, SortAscending, CaretDown, X } from '@phosphor-icons/react'

export type FilterState = {
  search: string
  localidad: string
  descuento: string
  orden: string
}

type Props = {
  filters: FilterState
  onChange: (f: FilterState) => void
  localidades: string[]
}

const DESCUENTO_OPTIONS = [
  { label: 'Cualquier descuento', value: '' },
  { label: '10% OFF', value: '10' },
  { label: '15% OFF', value: '15' },
  { label: '20% OFF', value: '20' },
  { label: '30% OFF', value: '30' },
  { label: '40% y 50% OFF', value: '35+' },
]

const ORDEN_OPTIONS = [
  { label: 'Mayor descuento', value: 'descuento' },
  { label: 'Nombre A–Z', value: 'nombre' },
  { label: 'Más nuevos', value: 'nuevo' },
]

type PillProps = {
  icon: React.ComponentType<{ size: number; weight: 'regular' | 'fill' }>
  placeholder: string
  activeLabel?: string
  isActive?: boolean
  value: string
  options: { label: string; value: string }[]
  onChange: (val: string) => void
}

function FilterPill({ icon: Icon, placeholder, activeLabel, isActive, value, options, onChange }: PillProps) {
  return (
    <div
      className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
        isActive
          ? 'bg-[#1d5c3a] text-white border-[#1d5c3a] shadow-sm'
          : 'bg-white text-slate-600 border-[#d9ede2] hover:border-[#1d5c3a]/40 hover:text-[#1d5c3a]'
      }`}
    >
      <Icon size={13} weight={isActive ? 'fill' : 'regular'} />
      <span>{isActive && activeLabel ? activeLabel : placeholder}</span>
      <CaretDown size={9} className={isActive ? 'text-white/60' : 'text-slate-400'} />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full"
        aria-label={placeholder}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export default function Filters({ filters, onChange, localidades }: Props) {
  const localidadOptions = [
    { label: 'Todas las zonas', value: '' },
    ...localidades.map(l => ({ label: l, value: l })),
  ]

  const descuentoLabel = DESCUENTO_OPTIONS.find(o => o.value === filters.descuento)?.label
  const ordenLabel = ORDEN_OPTIONS.find(o => o.value === filters.orden)?.label ?? 'Ordenar'
  const hasActive = !!(filters.localidad || filters.descuento)

  return (
    <div className="space-y-2.5">
      {/* Buscador */}
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
          onChange={e => onChange({ ...filters, search: e.target.value })}
          style={{ fontSize: '16px' }}
          className="w-full pl-11 pr-10 py-3.5 border border-[#d9ede2] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#25a35f]/25 focus:border-[#25a35f] bg-white shadow-sm text-slate-800 placeholder:text-slate-400"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X size={15} weight="bold" />
          </button>
        )}
      </div>

      {/* Pills de filtro */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
        <FilterPill
          icon={MapPin}
          placeholder="Zona"
          activeLabel={filters.localidad}
          isActive={!!filters.localidad}
          value={filters.localidad}
          options={localidadOptions}
          onChange={val => onChange({ ...filters, localidad: val })}
        />

        <FilterPill
          icon={Percent}
          placeholder="Descuento"
          activeLabel={descuentoLabel}
          isActive={!!filters.descuento}
          value={filters.descuento}
          options={DESCUENTO_OPTIONS}
          onChange={val => onChange({ ...filters, descuento: val })}
        />

        <div className="w-px h-4 bg-slate-200 shrink-0" />

        <FilterPill
          icon={SortAscending}
          placeholder={ordenLabel}
          isActive={false}
          value={filters.orden}
          options={ORDEN_OPTIONS}
          onChange={val => onChange({ ...filters, orden: val })}
        />

        {hasActive && (
          <button
            onClick={() => onChange({ ...filters, localidad: '', descuento: '' })}
            className="shrink-0 flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-500 font-medium transition-colors ml-auto"
          >
            <X size={11} weight="bold" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
