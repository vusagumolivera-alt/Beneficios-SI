'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, MapPin } from '@phosphor-icons/react'
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
  'San Isidro': 'bg-emerald-50 text-emerald-700',
  'Martínez':   'bg-teal-50 text-teal-700',
  'Boulogne':   'bg-green-50 text-green-700',
  'Beccar':     'bg-lime-50 text-lime-700',
  'Acassuso':   'bg-cyan-50 text-cyan-700',
}

function getGradient(rubro: string): string {
  const r = rubro.toLowerCase()
  if (r.includes('gastro') || r.includes('comida') || r.includes('pasta') || r.includes('panaderia') || r.includes('fruteria'))
    return 'from-orange-800 to-orange-600'
  if (r.includes('peluqueria') || r.includes('belleza') || r.includes('spa'))
    return 'from-pink-800 to-pink-600'
  if (r.includes('danzas') || r.includes('gimnasia'))
    return 'from-violet-800 to-violet-600'
  if (r.includes('helad'))
    return 'from-cyan-800 to-cyan-600'
  if (r.includes('farmacia') || r.includes('salud'))
    return 'from-blue-800 to-blue-600'
  if (r.includes('optica') || r.includes('óptica') || r.includes('ortopedia'))
    return 'from-indigo-800 to-indigo-600'
  if (r.includes('deporte') || r.includes('camping') || r.includes('nautica') || r.includes('pesca'))
    return 'from-emerald-800 to-emerald-600'
  if (r.includes('zapateria') || r.includes('indumentaria') || r.includes('textil') || r.includes('moda'))
    return 'from-purple-800 to-purple-600'
  if (r.includes('juguet'))
    return 'from-amber-700 to-amber-500'
  if (r.includes('automotor') || r.includes('moto'))
    return 'from-slate-700 to-slate-500'
  if (r.includes('decorac') || r.includes('regalo'))
    return 'from-rose-700 to-rose-500'
  return 'from-[#1d5c3a] to-[#25a35f]'
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
  const [isFav, setIsFav] = useState(false)
  const [imgError, setImgError] = useState(false)
  const locColor = LOCALIDAD_COLORS[comercio.localidad] || 'bg-slate-50 text-slate-600'
  const gradient = getGradient(comercio.rubro)

  useEffect(() => { setIsFav(getFavs().has(comercio.id)) }, [comercio.id])

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const favs = getFavs()
    if (favs.has(comercio.id)) favs.delete(comercio.id)
    else favs.add(comercio.id)
    saveFavs(favs)
    setIsFav(favs.has(comercio.id))
  }

  return (
    <Link
      href={`/comercio/${comercio.id}`}
      className="block bg-white rounded-2xl border border-[#e2ede8] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-cardEnter"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      {/* Header gradient */}
      <div className={`bg-gradient-to-br ${gradient} h-24 rounded-t-2xl relative`}>
        {comercio.nuevo && (
          <div className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-full">
            NUEVO
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/95 rounded-xl px-2 py-0.5 shadow-sm">
          <span className="text-[#1d5c3a] font-black text-sm leading-none">{comercio.descuento}%</span>
          <span className="text-[#25a35f] text-[9px] font-bold ml-0.5">OFF</span>
        </div>
        <button
          onClick={toggleFav}
          className="absolute bottom-2 right-2 bg-black/20 hover:bg-black/35 rounded-full w-7 h-7 flex items-center justify-center transition-colors"
          aria-label={isFav ? 'Quitar favorito' : 'Guardar favorito'}
        >
          <Heart size={13} weight={isFav ? 'fill' : 'regular'} className={isFav ? 'text-red-400' : 'text-white'} />
        </button>
      </div>

      {/* Logo overlap */}
      <div className="flex justify-center -mt-7 px-3 relative z-10">
        <div className="w-14 h-14 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-white shrink-0">
          {comercio.imagen_url && !imgError ? (
            <img
              src={comercio.imagen_url}
              alt={comercio.nombre}
              className="w-full h-full object-contain p-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <Initials nombre={comercio.nombre} />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-3 pb-3 pt-2 text-center">
        <h3 className="font-bold text-[#1d2d24] text-[13px] leading-tight line-clamp-2">{comercio.nombre}</h3>
        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{comercio.rubro}</p>
        <div className="mt-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${locColor}`}>
            <MapPin size={9} weight="fill" />
            {comercio.localidad}
          </span>
        </div>
      </div>
    </Link>
  )
}
