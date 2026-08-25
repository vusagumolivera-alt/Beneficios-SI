'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Heart, Share, MapPin, CalendarBlank, CreditCard,
  InstagramLogo, Globe, NavigationArrow, IdentificationCard, Info,
} from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'

const FAVS_KEY = 'bsi-favoritos'
function getFavs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')) }
  catch { return new Set() }
}
function saveFavs(set: Set<string>) {
  localStorage.setItem(FAVS_KEY, JSON.stringify([...set]))
}

function getGradient(rubro: string): string {
  const r = rubro.toLowerCase()
  if (r.includes('gastro') || r.includes('comida') || r.includes('pasta') || r.includes('panaderia'))
    return 'from-orange-800 to-orange-600'
  if (r.includes('peluqueria') || r.includes('belleza') || r.includes('spa'))
    return 'from-pink-800 to-pink-600'
  if (r.includes('danzas') || r.includes('gimnasia'))
    return 'from-violet-800 to-violet-600'
  if (r.includes('helad'))
    return 'from-cyan-800 to-cyan-600'
  if (r.includes('farmacia') || r.includes('salud'))
    return 'from-blue-800 to-blue-600'
  if (r.includes('optica') || r.includes('óptica'))
    return 'from-indigo-800 to-indigo-600'
  if (r.includes('deporte') || r.includes('camping'))
    return 'from-emerald-800 to-emerald-600'
  if (r.includes('zapateria') || r.includes('indumentaria') || r.includes('textil'))
    return 'from-purple-800 to-purple-600'
  if (r.includes('juguet'))
    return 'from-amber-700 to-amber-500'
  if (r.includes('automotor') || r.includes('moto'))
    return 'from-slate-700 to-slate-500'
  return 'from-[#1d5c3a] to-[#25a35f]'
}

function Initials({ nombre }: { nombre: string }) {
  const words = nombre.trim().split(/\s+/)
  const letters = words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2)
  return (
    <div className="w-full h-full bg-white/20 flex items-center justify-center">
      <span className="text-white font-black text-3xl tracking-wide uppercase">{letters}</span>
    </div>
  )
}

function parsePayment(medios: string): string[] {
  return medios.split(/[,;·]/).map(m => m.trim()).filter(Boolean)
}

function paymentIcon(medio: string) {
  const m = medio.toLowerCase()
  if (m.includes('efectivo')) return '💵'
  if (m.includes('mercado') || m === 'mp') return '🔵'
  if (m.includes('transfer')) return '🔄'
  if (m.includes('modo')) return '📱'
  if (m.includes('débito') || m.includes('debito')) return '💳'
  if (m.includes('crédito') || m.includes('credito')) return '💳'
  return '💳'
}

export default function ComercioPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [comercio, setComercio] = useState<Comercio | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    fetch('/api/comercios')
      .then(r => r.json())
      .then((all: Comercio[]) => {
        const found = Array.isArray(all) ? all.find(c => c.id === id) : null
        setComercio(found || null)
        if (found) setIsFav(getFavs().has(found.id))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  function toggleFav() {
    if (!comercio) return
    const favs = getFavs()
    if (favs.has(comercio.id)) favs.delete(comercio.id)
    else favs.add(comercio.id)
    saveFavs(favs)
    setIsFav(favs.has(comercio.id))
  }

  async function handleShare() {
    if (!comercio) return
    const text = `${comercio.nombre} — ${comercio.descripcion_descuento}\n📍 ${comercio.direccion}, ${comercio.localidad}\n\nBeneficios para empleados de San Isidro 👉 https://beneficios-si.vercel.app`
    try {
      if (navigator.share) await navigator.share({ title: comercio.nombre, text })
      else { await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 2000) }
    } catch {}
  }

  const mapUrl = comercio
    ? `https://maps.google.com/maps?q=${encodeURIComponent(comercio.direccion + ', ' + comercio.localidad + ', Buenos Aires, Argentina')}&output=embed&hl=es`
    : ''

  const mapsExternalUrl = comercio
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comercio.direccion + ', ' + comercio.localidad + ', Buenos Aires, Argentina')}`
    : ''

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f7f3]">
        <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
        <div className="max-w-lg mx-auto px-4 pt-10 space-y-4">
          <div className="h-6 bg-slate-200 rounded-xl animate-pulse w-2/3 mx-auto" />
          <div className="h-4 bg-slate-200 rounded-xl animate-pulse w-1/3 mx-auto" />
          <div className="h-24 bg-slate-200 rounded-2xl animate-pulse mt-6" />
        </div>
      </div>
    )
  }

  if (!comercio) {
    return (
      <div className="min-h-screen bg-[#f0f7f3] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-medium">Comercio no encontrado</p>
        <button onClick={() => router.push('/')} className="text-[#25a35f] font-semibold">← Volver al inicio</button>
      </div>
    )
  }

  const gradient = getGradient(comercio.rubro)
  const medios = comercio.medios_pago ? parsePayment(comercio.medios_pago) : []

  return (
    <div className="min-h-screen bg-[#f0f7f3] pb-32">

      {/* Hero header */}
      <div className={`bg-gradient-to-br ${gradient} relative`} style={{ minHeight: '240px' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <button
            onClick={() => router.back()}
            className="bg-black/20 hover:bg-black/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Volver"
          >
            <ArrowLeft size={20} weight="bold" className="text-white" />
          </button>
          <button
            onClick={toggleFav}
            className="bg-black/20 hover:bg-black/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label={isFav ? 'Quitar favorito' : 'Guardar favorito'}
          >
            <Heart size={20} weight={isFav ? 'fill' : 'regular'} className={isFav ? 'text-red-400' : 'text-white'} />
          </button>
        </div>

        {/* Discount badge */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2">
          <div className="bg-white/95 rounded-2xl px-5 py-2 shadow-lg text-center">
            <span className="text-[#1d5c3a] font-black text-4xl leading-none">{comercio.descuento}%</span>
            <span className="text-[#25a35f] text-lg font-black ml-1">OFF</span>
          </div>
        </div>

        {/* Logo overlapping */}
        <div className="flex justify-center pb-0 mt-16">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
            {comercio.imagen_url && !imgError ? (
              <img
                src={comercio.imagen_url}
                alt={comercio.nombre}
                className="w-full h-full object-contain p-2"
                onError={() => setImgError(true)}
              />
            ) : (
              <Initials nombre={comercio.nombre} />
            )}
          </div>
        </div>

        {/* Nuevo badge */}
        {comercio.nuevo && (
          <div className="absolute top-14 left-4 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full shadow">
            ✨ NUEVO
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="max-w-lg mx-auto px-4">

        {/* Name + category */}
        <div className="text-center pt-5 pb-4">
          <h1 className="text-2xl font-black text-[#1d2d24] leading-tight">{comercio.nombre}</h1>
          <p className="text-slate-400 text-sm mt-1">{comercio.rubro}</p>
          <p className="text-[#1d5c3a] font-semibold text-base mt-3 leading-snug">{comercio.descripcion_descuento}</p>
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-[#e8f5ef] text-[#1d5c3a] text-xs font-semibold px-3 py-1 rounded-full">
              <MapPin size={12} weight="fill" />
              {comercio.localidad}
            </span>
            {comercio.dias_validos && (
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 text-xs font-medium px-3 py-1 rounded-full">
                <CalendarBlank size={12} weight="regular" />
                {comercio.dias_validos}
              </span>
            )}
          </div>
        </div>

        {/* Cómo usar */}
        <div className="bg-white rounded-2xl border border-[#e2ede8] shadow-sm p-4 mb-3">
          <div className="flex items-start gap-3">
            <div className="bg-[#e8f5ef] rounded-xl p-2.5 shrink-0">
              <IdentificationCard size={20} weight="fill" className="text-[#1d5c3a]" />
            </div>
            <div>
              <p className="font-bold text-[#1d2d24] text-sm">¿Cómo usar el beneficio?</p>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                Presentá tu credencial municipal o contrato de trabajo al momento de pagar.
              </p>
            </div>
          </div>
        </div>

        {/* Condiciones */}
        {comercio.condiciones && (
          <div className="bg-white rounded-2xl border border-[#e2ede8] shadow-sm p-4 mb-3">
            <div className="flex items-start gap-3">
              <div className="bg-amber-50 rounded-xl p-2.5 shrink-0">
                <Info size={20} weight="fill" className="text-amber-500" />
              </div>
              <div>
                <p className="font-bold text-[#1d2d24] text-sm">Condiciones</p>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{comercio.condiciones}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="bg-white rounded-2xl border border-[#e2ede8] shadow-sm overflow-hidden mb-3">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between">
            <p className="font-bold text-[#1d2d24] text-sm">Ubicación</p>
            <a
              href={mapsExternalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25a35f] text-xs font-semibold flex items-center gap-1"
            >
              <NavigationArrow size={12} weight="fill" />
              Abrir Maps
            </a>
          </div>
          <p className="px-4 pb-3 text-slate-500 text-xs flex items-center gap-1.5">
            <MapPin size={12} weight="fill" className="text-[#1d5c3a] shrink-0" />
            {comercio.direccion}, {comercio.localidad}
          </p>
          <iframe
            src={mapUrl}
            className="w-full"
            style={{ height: '200px', border: 'none' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa de ${comercio.nombre}`}
          />
        </div>

        {/* Medios de pago */}
        {medios.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#e2ede8] shadow-sm p-4 mb-3">
            <p className="font-bold text-[#1d2d24] text-sm mb-3">Medios de pago</p>
            <div className="flex flex-wrap gap-2">
              {medios.map((m, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-[#f0f7f3] border border-[#d9ede2] text-slate-600 text-xs font-medium px-3 py-1.5 rounded-xl">
                  <span>{paymentIcon(m)}</span>
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#d9ede2] px-4 py-3 flex gap-3">
        <a
          href={mapsExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#1d5c3a] hover:bg-[#236b43] text-white font-semibold text-sm py-3 rounded-xl transition-colors"
        >
          <NavigationArrow size={16} weight="fill" />
          Cómo llegar
        </a>
        {comercio.instagram_url && (
          <a
            href={comercio.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#f0f7f3] border border-[#d9ede2] text-slate-700 font-semibold text-sm px-4 py-3 rounded-xl transition-colors hover:bg-[#e4f0ea]"
          >
            <InstagramLogo size={18} weight="regular" />
          </a>
        )}
        {comercio.website_url && (
          <a
            href={comercio.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#f0f7f3] border border-[#d9ede2] text-slate-700 font-semibold text-sm px-4 py-3 rounded-xl transition-colors hover:bg-[#e4f0ea]"
          >
            <Globe size={18} weight="regular" />
          </a>
        )}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-[#f0f7f3] border border-[#d9ede2] text-slate-700 font-semibold text-sm px-4 py-3 rounded-xl transition-colors hover:bg-[#e4f0ea]"
          title={shared ? '¡Copiado!' : 'Compartir'}
        >
          <Share size={18} weight={shared ? 'fill' : 'regular'} className={shared ? 'text-[#25a35f]' : ''} />
        </button>
      </div>

    </div>
  )
}
