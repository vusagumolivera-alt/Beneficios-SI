'use client'

import { useEffect, useState, useMemo } from 'react'
import BenefitCard from '@/components/BenefitCard'
import Filters, { FilterState } from '@/components/Filters'
import type { Comercio } from '@/lib/supabase'

const RUBRO_CHIPS = [
  { label: 'Todos', value: '' },
  { label: 'Gastronomía', value: 'gastronomia' },
  { label: 'Belleza', value: 'belleza' },
  { label: 'Indumentaria', value: 'indumentaria' },
  { label: 'Deportes', value: 'deportes' },
  { label: 'Heladerías', value: 'helado' },
  { label: 'Óptica', value: 'optica' },
  { label: 'Electro', value: 'audio' },
]

export default function HomePage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '', rubro: '', localidad: '', descuento: '',
  })
  const [rubroChip, setRubroChip] = useState('')

  useEffect(() => {
    fetch('/api/comercios')
      .then(r => r.json())
      .then(d => { setComercios(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const rubros = useMemo(() =>
    [...new Set(comercios.map(c => c.rubro))].sort(), [comercios])
  const localidades = useMemo(() =>
    [...new Set(comercios.map(c => c.localidad))].sort(), [comercios])

  const filtered = useMemo(() => {
    return comercios.filter(c => {
      if (filters.search && !c.nombre.toLowerCase().includes(filters.search.toLowerCase()) &&
          !c.rubro.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.rubro && c.rubro !== filters.rubro) return false
      if (rubroChip && !c.rubro.toLowerCase().includes(rubroChip)) return false
      if (filters.localidad && c.localidad !== filters.localidad) return false
      if (filters.descuento && c.descuento < parseInt(filters.descuento)) return false
      return true
    })
  }, [comercios, filters, rubroChip])

  const nuevos = filtered.filter(c => c.nuevo)
  const resto = filtered.filter(c => !c.nuevo)

  return (
    <div className="min-h-screen bg-[#f4faf7]">

      {/* Header */}
      <header className="bg-[#1d5c3a] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl shrink-0">
            🏛️
          </div>
          <div className="min-w-0">
            <p className="text-green-300 text-[10px] font-semibold uppercase tracking-widest">Municipalidad de San Isidro</p>
            <h1 className="text-lg font-bold leading-tight">Beneficios para empleados</h1>
          </div>
          {!loading && (
            <div className="ml-auto shrink-0 text-right">
              <p className="text-white font-bold text-lg leading-none">{comercios.length}</p>
              <p className="text-green-300 text-[10px]">comercios</p>
            </div>
          )}
        </div>

        {/* Chips de rubro */}
        <div className="border-t border-white/10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-2.5 w-max">
            {RUBRO_CHIPS.map(chip => (
              <button
                key={chip.value}
                onClick={() => setRubroChip(chip.value)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  rubroChip === chip.value
                    ? 'bg-white text-[#1d5c3a] shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-5 space-y-5">

        <Filters filters={filters} onChange={setFilters} rubros={rubros} localidades={localidades} />

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-3 animate-bounce">⏳</div>
            <p className="font-medium">Cargando beneficios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium text-slate-600">No se encontraron comercios</p>
            <p className="text-sm mt-1">Probá con otros filtros</p>
          </div>
        ) : (
          <div className="space-y-6">
            {nuevos.length > 0 && !filters.rubro && !rubroChip && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500 text-base">✨</span>
                  <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider">Nuevos este mes</h2>
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{nuevos.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {nuevos.map(c => <BenefitCard key={c.id} comercio={c} />)}
                </div>
                <div className="mt-6 border-t border-[#d9ede2]" />
              </section>
            )}

            <section>
              {(nuevos.length > 0 && !filters.rubro && !rubroChip) && (
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Todos los comercios adheridos</h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(nuevos.length > 0 && !filters.rubro && !rubroChip ? resto : filtered).map(c => (
                  <BenefitCard key={c.id} comercio={c} />
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-8 py-5 text-center text-xs text-slate-400 border-t border-[#d9ede2]">
        Programa de beneficios — Dirección de Capital Humano · Municipalidad de San Isidro
      </footer>
    </div>
  )
}
