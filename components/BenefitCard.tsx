'use client'

import { useState, useEffect } from 'react'
import { MapPin, CalendarBlank, CreditCard, NavigationArrow, InstagramLogo, Globe, CaretDown, CaretUp, Heart, Export } from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'

const FAVS_KEY = 'bsi-favoritos'

function getFavs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')) }
  catch { return new Set() }
}
function saveFavs(set: Set<string>) {
  localStorage.setItem(FAVS_KEY, JSON.stringify([...set]))
}

const LOCALIDAD_COLORS: Record<string, string> = {
  'San Isidro': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Martínez':   'bg-teal-50 text-teal-700 border-teal-200',
  'Boulogne':   'bg-green-50 text-green-700 border-green-200',
  'Beccar':     'bg-lime-50 text-lime-700 border-lime-200',
  'Acassuso':   'bg-cyan-50 text-cyan-700 border-cyan-200',
}

function mapsUrl(direccion: string, localidad: string) {
  const q = encodeURIComponent(`${direccion}, ${localidad}, Buenos Aires, Argentina`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

function Initials({ nombre }: { nombre: string }) {
  const words = nombre.trim().split(/\s+/)
  const letters = words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2)
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1d5c3a] to-[#25a35f] flex items-center justify-center">
      <span className="text-white font-black text-xl tracking-wide uppercase">{letters}</span>
    </div>
  )
}

export default function BenefitCard({ comercio, index = 0 }: { comercio: Comercio; index?: number }) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [shared, setShared] = useState(false)
  const locColor = LOCALIDAD_COLORS[comercio.localidad] || 'bg-slate-50 text-slate-600 border-slate-200'

  useEffect(() => {
    setIsFav(getFavs().has(comercio.id))
  }, [comercio.id])

  function toggleFav(e: React.MouseEvent) {
    e.stopPropagation()
    const favs = getFavs()
    if (favs.has(comercio.id)) favs.delete(comercio.id)
    else favs.add(comercio.id)
    saveFavs(favs)
    setIsFav(favs.has(comercio.id))
  }

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation()
    const text = `${comercio.nombre} — ${comercio.descripcion_descuento}\n📍 ${comercio.direccion}, ${comercio.localidad}\n\nBeneficios para empleados de San Isidro 👉 https://beneficios-si.vercel.app`
    try {
      if (navigator.share) {
        await navigator.share({ title: comercio.nombre, text })
      } else {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    } catch {}
  }

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-[#e2ede8] flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-cardEnter"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      {/* Header verde */}
      <div className="bg-gradient-to-br from-[#1d5c3a] to-[#236b43] h-16 relative shrink-0">
        <div className="absolute top-2 right-3 bg-white/95 backdrop-blur rounded-xl px-2 py-0.5 shadow-sm">
          <span className="text-[#1d5c3a] font-black text-sm leading-none">{comercio.descuento}%</span>
          <span className="text-[#25a35f] text-[9px] font-bold ml-0.5">OFF</span>
        </div>
        {comercio.nuevo && (
          <div className="absolute top-2 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            NUEVO
          </div>
        )}
      </div>

      {/* Logo circular */}
      <div className="flex justify-center -mt-8 px-4 relative z-10 shrink-0">
        <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
          {comercio.imagen_url && !imgError ? (
            <img src={comercio.imagen_url} alt={comercio.nombre} className="w-full h-full object-contain p-1" onError={() => setImgError(true)} />
          ) : (
            <Initials nombre={comercio.nombre} />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-2 pb-3 flex flex-col gap-1 flex-1 text-center relative">
        {/* Botones fav + share */}
        <div className="absolute top-0 right-0 flex items-center">
          <button
            onClick={handleShare}
            className="p-1.5 text-slate-300 hover:text-[#25a35f] transition-colors"
            aria-label="Compartir"
            title={shared ? '¡Copiado!' : 'Compartir'}
          >
            <Export size={13} weight={shared ? 'fill' : 'regular'} className={shared ? 'text-[#25a35f]' : ''} />
          </button>
          <button
            onClick={toggleFav}
            className="p-1.5 transition-colors"
            aria-label={isFav ? 'Quitar favorito' : 'Guardar favorito'}
          >
            <Heart size={13} weight={isFav ? 'fill' : 'regular'} className={isFav ? 'text-red-400' : 'text-slate-300 hover:text-red-400'} />
          </button>
        </div>

        <h3 className="font-bold text-[#1d2d24] text-[15px] leading-tight line-clamp-2">{comercio.nombre}</h3>
        <p className="text-[13px] text-slate-400 line-clamp-1">{comercio.rubro}</p>
        <p className="text-[#1d5c3a] font-semibold text-[13px] mt-1 line-clamp-2">{comercio.descripcion_descuento}</p>

        <div className="flex items-center justify-center gap-1 mt-1">
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${locColor}`}>
            <MapPin size={11} weight="fill" />
            {comercio.localidad}
          </span>
        </div>

        <div className="mt-1 space-y-0.5">
          {comercio.dias_validos && (
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <CalendarBlank size={11} weight="regular" className="shrink-0" />
              {comercio.dias_validos}
            </p>
          )}
          {comercio.medios_pago && (
            <p className="text-[11px] text-slate-400 line-clamp-1 flex items-center justify-center gap-1">
              <CreditCard size={11} weight="regular" className="shrink-0" />
              {comercio.medios_pago}
            </p>
          )}
        </div>

        {comercio.condiciones && (
          <div className="mt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-[#25a35f] font-medium hover:underline inline-flex items-center gap-0.5"
            >
              {expanded ? <><CaretUp size={10} weight="bold" /> Ocultar condiciones</> : <><CaretDown size={10} weight="bold" /> Ver condiciones</>}
            </button>
            {expanded && (
              <p className="mt-1 text-[10px] text-slate-500 bg-slate-50 rounded-lg p-2 leading-relaxed text-left border border-slate-100">
                {comercio.condiciones}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer acciones */}
      <div className="border-t border-[#e8f2ec] flex shrink-0">
        <a href={mapsUrl(comercio.direccion, comercio.localidad)} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-[#f0f9f4] hover:text-[#1d5c3a] transition-colors">
          <NavigationArrow size={13} weight="regular" />
          Maps
        </a>
        {comercio.instagram_url && (
          <>
            <div className="w-px bg-[#e8f2ec]" />
            <a href={comercio.instagram_url} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-pink-50 hover:text-pink-600 transition-colors">
              <InstagramLogo size={13} weight="regular" />
              Instagram
            </a>
          </>
        )}
        {comercio.website_url && (
          <>
            <div className="w-px bg-[#e8f2ec]" />
            <a href={comercio.website_url} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-[#f0f9f4] hover:text-[#1d5c3a] transition-colors">
              <Globe size={13} weight="regular" />
              Web
            </a>
          </>
        )}
      </div>
    </div>
  )
}
