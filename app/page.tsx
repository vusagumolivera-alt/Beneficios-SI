'use client'

import { useEffect, useState, useMemo } from 'react'
import { SpinnerGap, MagnifyingGlass } from '@phosphor-icons/react'
import BenefitCard from '@/components/BenefitCard'
import Filters, { FilterState } from '@/components/Filters'
import HeroCarousel from '@/components/HeroCarousel'
import type { Comercio } from '@/lib/supabase'

// Quita tildes para comparar sin distinguir acentos
function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// value: palabras clave separadas por | (sin tildes)
const RUBRO_CHIPS = [
  { label: 'Todos',    value: '' },
  { label: 'Comida',   value: 'gastronomia|comidas|panaderia|pasta|fruteria' },
  { label: 'Belleza',  value: 'peluqueria|belleza' },
  { label: 'Moda',     value: 'indumentaria|textil|zapateria|moda' },
  { label: 'Helados',  value: 'helad' },
  { label: 'Electro',  value: 'audio|iluminacion|electr' },
  { label: 'Ninos',    value: 'jugueteria' },
  { label: 'Almacen',  value: 'almacen|dietetic|kiosco' },
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
      if (rubroChip) {
        const rubroNorm = norm(c.rubro)
        const keywords = rubroChip.split('|')
        if (!keywords.some(kw => rubroNorm.includes(kw))) return false
      }
      if (filters.localidad && c.localidad !== filters.localidad) return false
      if (filters.descuento && c.descuento < parseInt(filters.descuento)) return false
      return true
    })

    if (filters.orden === 'descuento') result = [...result].sort((a, b) => b.descuento - a.descuento)
    else if (filters.orden === 'nombre') result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
    else if (filters.orden === 'nuevo') result = [...result].sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0))

    return result
  }, [comercios, filters, rubroChip])

  const nuevos = filtered.filter(c => c.nuevo)
  const isFiltering = filters.search || filters.rubro || filters.localidad || filters.descuento || rubroChip

  return (
    <div className="min-h-screen bg-[#f4faf7]">

      {/* Header sticky */}
      <header className="bg-[#1d5c3a] text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Logo Mi San Isidro */}
          <img
            src="/logo-msi.png"
            alt="Mi San Isidro"
            className="h-9 w-auto shrink-0"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-none">Beneficios para empleados</h1>
          </div>
          {!loading && (
            <div className="shrink-0 bg-white/15 rounded-xl px-3 py-1.5 text-center">
              <p className="text-white font-black text-lg leading-none">{comercios.length}</p>
              <p className="text-green-300 text-[9px] font-semibold uppercase tracking-wide">comercios</p>
            </div>
          )}
        </div>

        {/* Chips de rubro — estilo tab limpio sin emojis */}
        <div className="border-t border-white/10 overflow-x-auto" style={{scrollbarWidth:'none'}}>
          <div className="flex gap-1 px-4 py-2 w-max">
            {RUBRO_CHIPS.map(chip => (
              <button
                key={chip.value}
                onClick={() => setRubroChip(chip.value)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-150 ${
                  rubroChip === chip.value
                    ? 'bg-white text-[#1d5c3a] shadow-sm'
                    : 'text-white/65 hover:text-white hover:bg-white/15'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-5">

        {/* Carousel de marketing */}
        {!isFiltering && (
          <HeroCarousel onCtaClick={() => document.getElementById('comercios-section')?.scrollIntoView({ behavior: 'smooth' })} />
        )}

        <Filters filters={filters} onChange={setFilters} rubros={rubros} localidades={localidades} />

        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <SpinnerGap size={40} className="mx-auto mb-3 animate-spin text-[#25a35f]" weight="regular" />
            <p className="font-medium">Cargando beneficios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <MagnifyingGlass size={40} className="mx-auto mb-3 text-slate-300" weight="regular" />
            <p className="font-medium text-slate-600">No se encontraron comercios</p>
            <p className="text-sm mt-1">Proba con otros filtros</p>
            <button onClick={() => { setFilters({ search:'', rubro:'', localidad:'', descuento:'', orden:'descuento' }); setRubroChip('') }}
              className="mt-3 text-sm text-[#25a35f] font-semibold hover:underline">
              Ver todos
            </button>
          </div>
        ) : (
          <div id="comercios-section" className="space-y-5">
            {/* Seccion Nuevos */}
            {nuevos.length > 0 && !isFiltering && filters.orden !== 'nuevo' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
        Programa de beneficios — Direccion de Capital Humano · Municipalidad de San Isidro
      </footer>
    </div>
  )
}
