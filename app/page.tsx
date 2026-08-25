'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import {
  SquaresFour, ForkKnife, Scissors, TShirt, Eye, Snowflake, Baby,
  FirstAidKit, ShoppingBag, Flower, WhatsappLogo, Storefront, ArrowUp,
  ArrowRight, Fire, Star,
} from '@phosphor-icons/react'
import BenefitCard from '@/components/BenefitCard'
import SkeletonCard from '@/components/SkeletonCard'
import Filters, { FilterState } from '@/components/Filters'
import HeroCarousel from '@/components/HeroCarousel'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'
import type { Comercio } from '@/lib/supabase'

function useCountUp(target: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target) return
    let current = 0
    const step = Math.max(1, Math.floor(target / 25))
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setCount(current)
      if (current >= target) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [target])
  return count
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const RUBRO_CHIPS = [
  { label: 'Todos',   value: '',                                            icon: SquaresFour },
  { label: 'Comida',  value: 'gastronomia|comidas|panaderia|pasta|fruteria', icon: ForkKnife },
  { label: 'Belleza', value: 'peluqueria|belleza',                          icon: Scissors },
  { label: 'Moda',    value: 'indumentaria|textil|zapateria|moda',          icon: TShirt },
  { label: 'Óptica',  value: 'optica|ortopedia|fotografia',                 icon: Eye },
  { label: 'Salud',   value: 'farmacia|salud',                              icon: FirstAidKit },
  { label: 'Helados', value: 'helad',                                       icon: Snowflake },
  { label: 'Niños',   value: 'jugueteria',                                  icon: Baby },
  { label: 'Almacén', value: 'almacen|dietetic|kiosco',                     icon: ShoppingBag },
  { label: 'Flores',  value: 'floreria',                                    icon: Flower },
]

const EMPTY_FILTERS: FilterState = { search: '', localidad: '', descuento: '', orden: 'descuento' }

type Tab = 'inicio' | 'favoritos' | 'buscar' | 'mapa'

export default function HomePage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [activeChips, setActiveChips] = useState<string[]>([])
  const [showTop, setShowTop] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('inicio')
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const filtersRef = useRef<HTMLDivElement>(null)
  const displayCount = useCountUp(comercios.length)

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    fetch('/api/comercios')
      .then(r => r.json())
      .then(d => { setComercios(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    try {
      const ids = new Set<string>(JSON.parse(localStorage.getItem('bsi-favoritos') || '[]'))
      setFavIds(ids)
    } catch {}
  }, [activeTab])

  const handleHighDiscount = useCallback(() => {
    setFilters(f => ({ ...f, descuento: '35+' }))
    setActiveChips([])
    setTimeout(() => document.getElementById('comercios-section')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  const resetAll = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    setActiveChips([])
    setActiveTab('inicio')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const toggleChip = useCallback((value: string) => {
    if (value === '') { setActiveChips([]); return }
    setActiveChips(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }, [])

  const localidades = useMemo(() =>
    [...new Set(comercios.map(c => c.localidad.trim()))].sort(), [comercios])

  const filtered = useMemo(() => {
    let result = comercios.filter(c => {
      if (activeTab === 'favoritos' && !favIds.has(c.id)) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!c.nombre.toLowerCase().includes(q) && !c.rubro.toLowerCase().includes(q)) return false
      }
      if (activeChips.length > 0) {
        const rubroNorm = norm(c.rubro)
        if (!activeChips.some(chip => chip.split('|').some(kw => rubroNorm.includes(kw)))) return false
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
  }, [comercios, filters, activeChips, activeTab, favIds])

  const nuevos = useMemo(() => filtered.filter(c => c.nuevo), [filtered])
  const destacados = useMemo(() =>
    [...comercios].sort((a, b) => b.descuento - a.descuento).slice(0, 8), [comercios])
  const isFiltering = !!(filters.search || filters.localidad || filters.descuento || activeChips.length > 0)

  function handleTabChange(tab: Tab) {
    setActiveTab(tab)
    if (tab === 'buscar') {
      setTimeout(() => filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
    if (tab === 'inicio') { resetAll() }
  }

  return (
    <div className="min-h-screen bg-[#f0f7f3]">

      {/* Header */}
      <header className="bg-[#1d5c3a] text-white sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={resetAll} className="shrink-0 hover:opacity-80 transition-opacity" aria-label="Inicio">
            <img src="/logo-msi.png" alt="Mi San Isidro" className="h-9 w-auto" style={{ filter: 'brightness(0) invert(1)' }} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold leading-none">Beneficios para empleados</h1>
            <p className="text-green-300 text-[10px] mt-0.5">Municipalidad de San Isidro</p>
          </div>
          {!loading && (
            <div className="shrink-0 bg-white/15 rounded-xl px-3 py-1.5 text-center">
              <p className="text-white font-black text-lg leading-none">{displayCount}</p>
              <p className="text-green-300 text-[9px] font-semibold uppercase tracking-wide">comercios</p>
            </div>
          )}
          <a
            href="https://tesi.sanisidro.gob.ar/tramites/nuevo/fortalecimiento_comercio_local"
            target="_blank" rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            <Storefront size={14} weight="regular" />
            Sumate
          </a>
        </div>

        {/* Rubro chips */}
        <div className="border-t border-white/10 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-1 px-4 py-2 w-max sm:w-auto sm:justify-center sm:flex-wrap">
            {RUBRO_CHIPS.map(chip => {
              const isActive = chip.value === '' ? activeChips.length === 0 : activeChips.includes(chip.value)
              const Icon = chip.icon
              return (
                <button
                  key={chip.value}
                  onClick={() => toggleChip(chip.value)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-150 ${
                    isActive ? 'bg-white text-[#1d5c3a] shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/15'
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

      <main className="max-w-6xl mx-auto px-4 py-5 space-y-5 pb-28">

        {/* Favoritos vacío */}
        {/* Vista mapa */}
        {activeTab === 'mapa' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#e2ede8] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e2ede8]">
                <h2 className="font-bold text-[#1d2d24] text-sm">Comercios en San Isidro</h2>
                <p className="text-xs text-slate-400 mt-0.5">Zona del partido — {comercios.length} comercios adheridos</p>
              </div>
              <iframe
                src="https://maps.google.com/maps?q=San+Isidro,+Buenos+Aires,+Argentina&output=embed&hl=es&z=13"
                className="w-full"
                style={{ height: '420px', border: 'none' }}
                loading="lazy"
                title="Mapa de San Isidro"
              />
            </div>
            <p className="text-center text-xs text-slate-400 px-2">
              Para ver la dirección exacta de cada comercio, abrí su ficha desde el inicio y tocá "Cómo llegar"
            </p>
          </div>
        )}

        {activeTab === 'favoritos' && !loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🤍</p>
            <p className="font-bold text-slate-600">Sin favoritos todavía</p>
            <p className="text-sm text-slate-400 mt-1">Tocá el corazón en cualquier comercio para guardarlo acá</p>
            <button onClick={() => setActiveTab('inicio')} className="mt-4 text-sm text-[#25a35f] font-semibold hover:underline">
              Ver todos los comercios
            </button>
          </div>
        )}

        {activeTab === 'inicio' && !isFiltering && (
          <>
            {/* Hero carousel */}
            <HeroCarousel
              onCtaClick={() => document.getElementById('comercios-section')?.scrollIntoView({ behavior: 'smooth' })}
              onHighDiscountClick={handleHighDiscount}
            />

            {/* Mejores descuentos — horizontal scroll */}
            {!loading && destacados.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Fire size={16} weight="fill" className="text-orange-500" />
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Mejores descuentos</h2>
                  </div>
                  <button
                    onClick={handleHighDiscount}
                    className="text-xs text-[#25a35f] font-semibold flex items-center gap-0.5"
                  >
                    Ver todos <ArrowRight size={12} weight="bold" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {destacados.map((c, i) => (
                    <Link
                      key={c.id}
                      href={`/comercio/${c.id}`}
                      className="flex-shrink-0 w-36 bg-white rounded-2xl border border-[#e2ede8] shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="h-20 bg-gradient-to-br from-[#1d5c3a] to-[#25a35f] relative">
                        <div className="absolute top-2 right-2 bg-white/95 rounded-xl px-2 py-0.5">
                          <span className="text-[#1d5c3a] font-black text-sm">{c.descuento}%</span>
                          <span className="text-[#25a35f] text-[8px] font-bold ml-0.5">OFF</span>
                        </div>
                        {c.nuevo && (
                          <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">NEW</div>
                        )}
                      </div>
                      <div className="p-2.5">
                        <p className="font-bold text-[#1d2d24] text-[11px] leading-tight line-clamp-2">{c.nombre}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.localidad}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Filters */}
        {activeTab !== 'mapa' && (
          <div ref={filtersRef}>
            <Filters filters={filters} onChange={setFilters} localidades={localidades} />
          </div>
        )}

        {/* Cards grid */}
        {activeTab !== 'mapa' && loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : activeTab !== 'mapa' && filtered.length === 0 && activeTab !== 'favoritos' ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-slate-600">No se encontraron comercios</p>
            <p className="text-sm mt-1">Probá con otros filtros</p>
            <button onClick={resetAll} className="mt-3 text-sm text-[#25a35f] font-semibold hover:underline">Ver todos</button>
          </div>
        ) : activeTab !== 'mapa' ? (
          <div id="comercios-section" className="space-y-5">
            {/* Nuevos */}
            {nuevos.length > 0 && activeTab === 'inicio' && !isFiltering && filters.orden !== 'nuevo' && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} weight="fill" className="text-amber-500" />
                  <h2 className="text-sm font-bold text-amber-600 uppercase tracking-wider">Nuevos este mes</h2>
                  <span className="bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full">{nuevos.length}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {nuevos.map((c, i) => <BenefitCard key={c.id} comercio={c} index={i} />)}
                </div>
                <div className="mt-5 border-t border-[#d9ede2]" />
              </section>
            )}

            {/* Todos */}
            <section>
              <div className="flex items-center justify-between mb-3">
                {activeTab === 'favoritos' ? (
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Mis favoritos</h2>
                    <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full">{filtered.length}</span>
                  </div>
                ) : !isFiltering ? (
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Todos los comercios</h2>
                    <span className="bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full">{filtered.filter(c => !c.nuevo).length}</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    <span className="font-bold text-[#1d5c3a]">{filtered.length}</span> resultado{filtered.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {(activeTab === 'favoritos' || isFiltering || filters.orden === 'nuevo'
                  ? filtered
                  : filtered.filter(c => !c.nuevo)
                ).map((c, i) => <BenefitCard key={c.id} comercio={c} index={i} />)}
              </div>
            </section>
          </div>
        ) : null}
      </main>

      <footer className="pb-24 pt-5 text-center text-xs text-slate-400 border-t border-[#d9ede2]">
        Programa de beneficios — Dirección de Capital Humano · Municipalidad de San Isidro
      </footer>

      {/* Volver arriba */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-50 bg-white border border-[#d9ede2] shadow-md hover:shadow-lg text-[#1d5c3a] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          aria-label="Volver arriba"
        >
          <ArrowUp size={18} weight="bold" />
        </button>
      )}

      {/* WhatsApp */}
      <a
        href="https://whatsapp.com/channel/0029VbAh4uIDp2QAfEVLmO3j"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-20 left-4 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold"
        aria-label="Canal de WhatsApp"
      >
        <WhatsappLogo size={20} weight="fill" />
        <span className="hidden sm:inline">Canal MSI</span>
      </a>

      {/* Bottom Nav */}
      <BottomNav active={activeTab} onChange={handleTabChange} />
    </div>
  )
}
