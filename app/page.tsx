'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { SpinnerGap, MagnifyingGlass, SquaresFour, ForkKnife, Scissors, TShirt, Eye, Snowflake, Baby, FirstAidKit, ShoppingBag, Flower, WhatsappLogo, List, X, ArrowRight, Storefront } from '@phosphor-icons/react'
import BenefitCard from '@/components/BenefitCard'
import Filters, { FilterState } from '@/components/Filters'
import HeroCarousel from '@/components/HeroCarousel'
import type { Comercio } from '@/lib/supabase'

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const RUBRO_CHIPS = [
  { label: 'Todos',    value: '',                                          icon: SquaresFour },
  { label: 'Comida',   value: 'gastronomia|comidas|panaderia|pasta|fruteria', icon: ForkKnife },
  { label: 'Belleza',  value: 'peluqueria|belleza',                        icon: Scissors },
  { label: 'Moda',     value: 'indumentaria|textil|zapateria|moda',        icon: TShirt },
  { label: 'Óptica',   value: 'optica|ortopedia|fotografia',               icon: Eye },
  { label: 'Salud',    value: 'farmacia|salud',                            icon: FirstAidKit },
  { label: 'Helados',  value: 'helad',                                     icon: Snowflake },
  { label: 'Niños',    value: 'jugueteria',                                icon: Baby },
  { label: 'Almacén',  value: 'almacen|dietetic|kiosco',                   icon: ShoppingBag },
  { label: 'Flores',   value: 'floreria',                                  icon: Flower },
]

const EMPTY_FILTERS: FilterState = { search: '', localidad: '', descuento: '', orden: 'descuento' }

export default function HomePage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [menuOpen, setMenuOpen] = useState(true)

  useEffect(() => {
    fetch('/api/comercios')
      .then(r => r.json())
      .then(d => { setComercios(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleHighDiscount = useCallback(() => {
    setFilters(f => ({ ...f, descuento: '35+' }))
    setActiveChips([])
    setTimeout(() => document.getElementById('comercios-section')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  const resetAll = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setActiveChips([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const toggleChip = useCallback((value: string) => {
    if (value === '') {
      setActiveChips([])
      return
    }
    setActiveChips(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }, [])

  const localidades = useMemo(() =>
    [...new Set(comercios.map(c => c.localidad.trim()))].sort(), [comercios])

  const filtered = useMemo(() => {
    let result = comercios.filter(c => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!c.nombre.toLowerCase().includes(q) && !c.rubro.toLowerCase().includes(q)) return false
      }
      if (activeChips.length > 0) {
        const rubroNorm = norm(c.rubro)
        const matchesAny = activeChips.some(chipValue => {
          const keywords = chipValue.split('|')
          return keywords.some(kw => rubroNorm.includes(kw))
        })
        if (!matchesAny) return false
      }
      if (filters.localidad && c.localidad.trim() !== filters.localidad) return false
      if (filters.descuento) {
        if (filters.descuento === '35+') { if (c.descuento < 35) return false }
        else { if (c.descuento !== parseInt(filters.descuento)) return false }
      }
      return true
    })

    if (filters.orden === 'descuento') result = [...result].sort((a, b) => b.descuento - a.descuento)
    else if (filters.orden === 'nombre') result = [...result].sort((a, b) => a.nombre.localeCompare(b.nombre))
    else if (filters.orden === 'nuevo') result = [...result].sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0))

    return result
  }, [comercios, filters, activeChips])

  const nuevos = filtered.filter(c => c.nuevo)
  const isFiltering = !!(filters.search || filters.localidad || filters.descuento || activeChips.length > 0)

  return (
    <div className="min-h-screen bg-[#f4faf7]">

      <header className="bg-[#1d5c3a] text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={resetAll} className="shrink-0 hover:opacity-80 transition-opacity" aria-label="Volver al inicio">
            <img
              src="/logo-msi.png"
              alt="Mi San Isidro"
              className="h-9 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-none">Beneficios para empleados</h1>
          </div>
          {!loading && (
            <div className="shrink-0 bg-white/15 rounded-xl px-3 py-1.5 text-center">
              <p className="text-white font-black text-lg leading-none">{comercios.length}</p>
              <p className="text-green-300 text-[9px] font-semibold uppercase tracking-wide">comercios</p>
            </div>
          )}

          {/* Desktop: botón adherirse */}
          <a
            href="https://tesi.sanisidro.gob.ar/tramites/nuevo/fortalecimiento_comercio_local"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Storefront size={14} weight="regular" />
            Sumate como comercio
          </a>

          {/* Mobile: hamburguesa */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="sm:hidden shrink-0 p-1.5 rounded-lg hover:bg-white/15 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="regular" />}
          </button>
        </div>

        {/* Menú mobile drawer */}
        {menuOpen && (
          <div className="sm:hidden border-t border-white/10 bg-[#1a5234] px-4 py-3">
            <a
              href="https://tesi.sanisidro.gob.ar/tramites/nuevo/fortalecimiento_comercio_local"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition-colors"
            >
              <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                <Storefront size={18} weight="regular" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm">¿Sos un comercio?</p>
                <p className="text-white/60 text-xs">Sumate al programa de beneficios</p>
              </div>
              <ArrowRight size={16} className="text-white/40 ml-auto shrink-0" />
            </a>
          </div>
        )}

        {/* Chips — centrados en desktop, scroll en móvil */}
        <div className="border-t border-white/10 overflow-x-auto" style={{scrollbarWidth:'none'}}>
          <div className="flex gap-1 px-4 py-2 w-max sm:w-auto sm:justify-center sm:flex-wrap">
            {RUBRO_CHIPS.map(chip => {
              const isActive = chip.value === ''
                ? activeChips.length === 0
                : activeChips.includes(chip.value)
              const Icon = chip.icon
              return (
                <button
                  key={chip.value}
                  onClick={() => toggleChip(chip.value)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-[#1d5c3a] shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/15'
                  }`}
                >
                  <Icon size={12} weight={isActive ? 'fill' : 'regular'} />
                  {chip.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-5">

        {!isFiltering && (
          <HeroCarousel
            onCtaClick={() => document.getElementById('comercios-section')?.scrollIntoView({ behavior: 'smooth' })}
            onHighDiscountClick={handleHighDiscount}
          />
        )}

        <Filters filters={filters} onChange={setFilters} localidades={localidades} />

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
            <button onClick={resetAll} className="mt-3 text-sm text-[#25a35f] font-semibold hover:underline">
              Ver todos
            </button>
          </div>
        ) : (
          <div id="comercios-section" className="space-y-5">
            {nuevos.length > 0 && !isFiltering && filters.orden !== 'nuevo' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider">Nuevos este mes</h2>
                  <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{nuevos.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {nuevos.map(c => <BenefitCard key={c.id} comercio={c} />)}
                </div>
                <div className="mt-5 border-t border-[#d9ede2]" />
              </section>
            )}

            <section>
              <div className="flex items-center justify-between mb-3">
                {!isFiltering
                  ? <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Todos los comercios</h2>
                      <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full">{filtered.filter(c => !c.nuevo).length}</span>
                    </div>
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

      {/* Botón flotante WhatsApp */}
      <a
        href="https://whatsapp.com/channel/0029VbAh4uIDp2QAfEVLmO3j"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-4 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold"
        aria-label="Canal de WhatsApp oficial MSI"
      >
        <WhatsappLogo size={20} weight="fill" />
        <span>Canal MSI</span>
      </a>
    </div>
  )
}
