'use client'

import { useState } from 'react'
import { MapPin, CalendarBlank, CreditCard, NavigationArrow, InstagramLogo, Globe, CaretDown, CaretUp } from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'

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
  const letters = words.length >= 2
    ? words[0][0] + words[1][0]
    : words[0].slice(0, 2)
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1d5c3a] to-[#25a35f] flex items-center justify-center">
      <span className="text-white font-black text-xl tracking-wide uppercase">{letters}</span>
    </div>
  )
}

export default function BenefitCard({ comercio }: { comercio: Comercio }) {
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const locColor = LOCALIDAD_COLORS[comercio.localidad] || 'bg-slate-50 text-slate-600 border-slate-200'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#e2ede8] flex flex-col overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Header verde */}
      <div className="bg-gradient-to-br from-[#1d5c3a] to-[#236b43] h-16 relative shrink-0">
        <div className="absolute top-2 right-3 bg-white/95 backdrop-blur rounded-xl px-2.5 py-1 shadow-sm">
          <span className="text-[#1d5c3a] font-black text-base leading-none">{comercio.descuento}%</span>
          <span className="text-[#25a35f] text-[10px] font-bold ml-0.5">OFF</span>
        </div>
        {comercio.nuevo && (
          <div className="absolute top-2 left-3 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
            NUEVO
          </div>
        )}
      </div>

      {/* Logo circular centrado, superpuesto */}
      <div className="flex justify-center -mt-8 px-4 relative z-10 shrink-0">
        <div className="w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
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

      {/* Info */}
      <div className="px-4 pt-2 pb-3 flex flex-col gap-1 flex-1 text-center">
        <h3 className="font-bold text-[#1d2d24] text-sm leading-tight line-clamp-2">{comercio.nombre}</h3>
        <p className="text-xs text-slate-400 line-clamp-1">{comercio.rubro}</p>
        <p className="text-[#1d5c3a] font-semibold text-xs mt-1 line-clamp-2">{comercio.descripcion_descuento}</p>

        <div className="flex items-center justify-center gap-1 mt-1">
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${locColor}`}>
            <MapPin size={10} weight="fill" />
            {comercio.localidad}
          </span>
        </div>

        <div className="mt-1 space-y-0.5">
          {comercio.dias_validos && (
            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <CalendarBlank size={10} weight="regular" />
              {comercio.dias_validos}
            </p>
          )}
          {comercio.medios_pago && (
            <p className="text-[10px] text-slate-400 line-clamp-1 flex items-center justify-center gap-1">
              <CreditCard size={10} weight="regular" />
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
              {expanded
                ? <><CaretUp size={10} weight="bold" /> Ocultar condiciones</>
                : <><CaretDown size={10} weight="bold" /> Ver condiciones</>
              }
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
        <a
          href={mapsUrl(comercio.direccion, comercio.localidad)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-[#f0f9f4] hover:text-[#1d5c3a] transition-colors"
        >
          <NavigationArrow size={13} weight="regular" />
          Maps
        </a>
        {comercio.instagram_url && (
          <>
            <div className="w-px bg-[#e8f2ec]" />
            <a
              href={comercio.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              <InstagramLogo size={13} weight="regular" />
              Instagram
            </a>
          </>
        )}
        {comercio.website_url && (
          <>
            <div className="w-px bg-[#e8f2ec]" />
            <a
              href={comercio.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:bg-[#f0f9f4] hover:text-[#1d5c3a] transition-colors"
            >
              <Globe size={13} weight="regular" />
              Web
            </a>
          </>
        )}
      </div>
    </div>
  )
}
