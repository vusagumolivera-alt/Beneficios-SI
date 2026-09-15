'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, MapPin, QrCode } from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'
import { tieneCupones } from '@/lib/cupones'

const FAVS_KEY = 'bsi-favoritos'
function getFavs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')) }
  catch { return new Set() }
}
function saveFavs(set: Set<string>) {
  localStorage.setItem(FAVS_KEY, JSON.stringify([...set]))
}

export function Initials({ nombre, size = 'md' }: { nombre: string; size?: 'md' | 'lg' }) {
  const words = nombre.trim().split(/\s+/)
  const letters = words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2)
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className={`text-[#1d5c3a] font-extrabold tracking-wide uppercase ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>{letters}</span>
    </div>
  )
}

export function DiscountPill({ comercio, size = 'sm' }: { comercio: Comercio; size?: 'sm' | 'md' }) {
  const cupones = tieneCupones(comercio.nombre)
  const cls = size === 'md' ? 'text-sm px-3 py-1.5' : 'text-[11px] px-2.5 py-1'
  if (cupones) {
    return (
      <span className={`inline-flex items-center gap-1 bg-[#14201a] text-white font-bold rounded-full ${cls}`}>
        <QrCode size={size === 'md' ? 14 : 11} weight="bold" />
        Cupones
      </span>
    )
  }
  return (
    <span className={`inline-flex items-baseline bg-[#1d5c3a] text-white font-extrabold rounded-full ${cls}`}>
      {comercio.descuento}%<span className="font-semibold text-[0.8em] ml-0.5 opacity-80">OFF</span>
    </span>
  )
}

export default function BenefitCard({ comercio, index = 0 }: { comercio: Comercio; index?: number }) {
  const [isFav, setIsFav] = useState(false)
  const [imgError, setImgError] = useState(false)

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
      className="group block bg-white rounded-[20px] border border-[#e3ebe6] shadow-[0_1px_2px_rgba(20,32,26,0.04)] hover:shadow-[0_8px_24px_rgba(20,32,26,0.08)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 animate-cardEnter overflow-hidden"
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
    >
      {/* Logo tile */}
      <div className="relative m-2 mb-0 h-[116px] rounded-2xl bg-[#f5f7f6] ring-1 ring-inset ring-black/[0.04] overflow-hidden">
        {comercio.imagen_url && !imgError ? (
          <img
            src={comercio.imagen_url}
            alt={comercio.nombre}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-contain p-5 group-hover:scale-[1.03] transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <Initials nombre={comercio.nombre} />
        )}

        {comercio.nuevo && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-950 text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full">
            NUEVO
          </span>
        )}

        <button
          onClick={toggleFav}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur border border-black/[0.05] flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          aria-label={isFav ? 'Quitar favorito' : 'Guardar favorito'}
        >
          <Heart size={14} weight={isFav ? 'fill' : 'regular'} className={isFav ? 'text-red-500' : 'text-slate-500'} />
        </button>
      </div>

      {/* Body */}
      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#14201a] text-[13.5px] leading-[1.2] line-clamp-2 min-h-[2.4em]">{comercio.nombre}</h3>
        </div>
        <p className="text-[11px] text-[#6b7a72] mt-1 line-clamp-1">{comercio.rubro}</p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#6b7a72] min-w-0">
            <MapPin size={11} weight="fill" className="text-[#25a35f] shrink-0" />
            <span className="truncate">{comercio.localidad}</span>
          </span>
          <DiscountPill comercio={comercio} />
        </div>
      </div>
    </Link>
  )
}
