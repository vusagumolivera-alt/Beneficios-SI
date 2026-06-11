'use client'

import { useEffect, useState, useMemo } from 'react'
import BenefitCard from '@/components/BenefitCard'
import Filters, { FilterState } from '@/components/Filters'
import type { Comercio } from '@/lib/supabase'

export default function HomePage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    search: '', rubro: '', localidad: '', descuento: '',
  })

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
      if (filters.localidad && c.localidad !== filters.localidad) return false
      if (filters.descuento && c.descuento < parseInt(filters.descuento)) return false
      return true
    })
  }, [comercios, filters])

  const nuevos = filtered.filter(c => c.nuevo)
  const resto = filtered.filter(c => !c.nuevo)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#1d5c3a] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
            🏛️
          </div>
          <div>
            <p className="text-green-200 text-xs font-medium uppercase tracking-wider">Municipalidad de San Isidro</p>
            <h1 className="text-xl font-bold leading-tight">Beneficios para empleados</h1>
            <p className="text-green-200 text-sm mt-0.5">Descuentos exclusivos en comercios adheridos</p>
          </div>
        </div>
        {!loading && (
          <div className="bg-[#154d2f] border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-2 flex gap-6 text-xs text-green-200">
              <span><strong className="text-white">{comercios.length}</strong> comercios adheridos</span>
              <span><strong className="text-white">{nuevos.length > 0 ? nuevos.length : ''}</strong>{nuevos.length > 0 ? ' nuevos este mes' : ''}</span>
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6" style={{background: '#f0f7f3'}}>
        <Filters filters={filters} onChange={setFilters} rubros={rubros} localidades={localidades} />

        {loading ? (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">⏳</div>
            <p>Cargando beneficios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">No se encontraron comercios</p>
            <p className="text-sm mt-1">Probá con otros filtros</p>
          </div>
        ) : (
          <>
            {nuevos.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  ✨ Nuevos este mes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nuevos.map(c => <BenefitCard key={c.id} comercio={c} />)}
                </div>
              </section>
            )}

            {resto.length > 0 && (
              <section>
                {nuevos.length > 0 && (
                  <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Todos los comercios adheridos
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resto.map(c => <BenefitCard key={c.id} comercio={c} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-slate-400 border-t border-[#dde4ec] mt-8">
        Programa de beneficios — Dirección de Capital Humano · Municipalidad de San Isidro
      </footer>
    </div>
  )
}
