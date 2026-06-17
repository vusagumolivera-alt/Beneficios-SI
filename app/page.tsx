'use client'

import { useEffect, useState, useMemo } from 'react'
import BenefitCard from '@/components/BenefitCard'
import Filters, { FilterState } from '@/components/Filters'
import type { Comercio } from '@/lib/supabase'

const RUBRO_CHIPS = [
  { label: 'Todos', value: '', icon: '🏪' },
  { label: 'Gastronomía', value: 'gastronomia', icon: '🍽️' },
  { label: 'Belleza', value: 'belleza', icon: '💅' },
  { label: 'Indumentaria', value: 'indumentaria', icon: '👗' },
  { label: 'Heladerías', value: 'helado', icon: '🍦' },
  { label: 'Deportes', value: 'camping', icon: '⛺' },
  { label: 'Óptica', value: 'ptica', icon: '👓' },
  { label: 'Electro', value: 'audio', icon: '📺' },
  { label: 'Pastas', value: 'pastas', icon: '🍝' },
  { label: 'Veterinaria', value: 'veterinaria', icon: '🐾' },
]

export default function HomePage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '', rubro: '', localidad: '', descuento: '', orden: 'descuento',
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
    let result = comercios.filter(c => {
      if (filters.search && !c.nombre.toLowerCase().includes(filters.search.toLowerCase()) &&
          !c.rubro.toLowerCase().includes(filters.search.toLowerCase())) return false
      if (filters.rubro && c.rubro !== filters.rubro) return false
      if (rubroChip && !c.rubro.toLowerCase().includes(rubroChip)) return false
      if (filters.localidad && c.localidad !== filters.localidad) return false
      if (filters.descuento && c.descuento < parseInt(filters.descuento)) return false
      return true
    })

    if (filters.orden === 'descuento') result = [...result].sort((a, b) => b.descuento - a.descuento)
    else if (filters.orden === 'nombre') result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
    else if (filters.orden === 'nuevo') result = [...result].sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0))

    return result
  }, [comercios, filters, rubroChip])

  const topDeal = useMemo(() =>
    [...comercios].sort((a, b) => b.descuento - a.descuento)[0], [comercios])

  const nuevos = filtered.filter(c => c.nuevo)
  const isFiltering = filters.search || filters.rubro || filters.localidad || filters.descuento || rubroChip

  return (
    <div className="min-h-screen bg-[#f4faf7]">

      {/* Header sticky */}
      <header className="bg-[#1d5c3a] text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center text-lg shrink-0">🏛️</div>
          <div className="min-w-0 flex-1">
            <p className="text-green-300 text-[10px] font-semibold uppercase tracking-widest leading-none mb-0.5">Municipalidad de San Isidro</p>
            <h1 className="text-base font-bold leading-none">Beneficios para empleados</h1>
          </div>
          {!loading && (
            <div className="shrink-0 bg-white/15 rounded-xl px-3 py-1.5 text-center">
              <p className="text-white font-black text-lg leading-none">{comercios.length}</p>
              <p className="text-green-300 text-[9px] font-semibold uppercase tracking-wide">comercios</p>
            </div>
          )}
        </div>

        {/* Chips de rubro */}
        <div className="border-t border-white/10 overflow-x-auto" style={{scrollbarWidth:'none'}}>
          <div className="flex gap-2 px-4 py-2 w-max">
            {RUBRO_CHIPS.map(chip => (
              <button
                key={chip.value}
                onClick={() => setRubroChip(chip.value)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  rubroChip === chip.value
                    ? 'bg-white text-[#1d5c3a] shadow-sm scale-105'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <span>{chip.icon}</span>{chip.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-5">

        {/* Banner destacado — mejor deal */}
        {!loading && topDeal && !isFiltering && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1d5c3a] to-[#1a7a4a] p-5 flex items-center gap-4 shadow-md">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-white/30" />
              <div className="absolute top-8 -right-8 w-20 h-20 rounded-full bg-white/20" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md overflow-hidden shrink-0">
              {topDeal.imagen_url
                ? <img src={topDeal.imagen_url} alt={topDeal.nombre} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-white/20 flex items-center justify-center text-white font-black text-xl">{topDeal.nombre[0]}</div>
              }
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-green-300 text-[10px] font-bold uppercase tracking-widest">🔥 Mejor descuento del mes</p>
              <h3 className="text-white font-bold text-base leading-tight truncate">{topDeal.nombre}</h3>
              <p className="text-green-200 text-xs truncate">{topDeal.descripcion_descuento}</p>
            </div>
            <div className="shrink-0 relative z-10 text-right">
              <p className="text-white font-black text-4xl leading-none">{topDeal.descuento}%</p>
              <p className="text-green-300 text-xs font-bold">OFF</p>
            </div>
          </div>
        )}

        <Filters filters={filters} onChange={setFilters} rubros={rubros} localidades={localidades} />

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-3">⏳</div>
            <p className="font-medium">Cargando beneficios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium text-slate-600">No se encontraron comercios</p>
            <p className="text-sm mt-1">Probá con otros filtros</p>
            <button onClick={() => { setFilters({ search:'', rubro:'', localidad:'', descuento:'', orden:'descuento' }); setRubroChip('') }}
              className="mt-3 text-sm text-[#25a35f] font-semibold hover:underline">
              Ver todos
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Sección Nuevos — solo cuando no se filtra */}
            {nuevos.length > 0 && !isFiltering && filters.orden !== 'nuevo' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500">✨</span>
                  <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider">Nuevos este mes</h2>
                  <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{nuevos.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {nuevos.map(c => <BenefitCard key={c.id} comercio={c} />)}
                </div>
                <div className="mt-5 border-t border-[#d9ede2]" />
              </section>
            )}

            {/* Todos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                {!isFiltering
                  ? <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Todos los comercios</h2>
                  : <p className="text-sm text-slate-500"><span className="font-bold text-[#1d5c3a]">{filtered.length}</span> resultado{filtered.length !== 1 ? 's' : ''}</p>
                }
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(isFiltering || filters.orden === 'nuevo'
                  ? filtered
                  : filtered.filter(c => !c.nuevo)
                ).map(c => <BenefitCard key={c.id} comercio={c} />)}
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
