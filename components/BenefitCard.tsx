'use client'

import { useState } from 'react'
import type { Comercio } from '@/lib/supabase'

const RUBRO_ICONS: Record<string, string> = {
  'Peluquería': '✂️',
  'Textiles': '👗',
  'Deportes': '⛺',
  'Danzas': '💃',
  'Kiosco': '🗞️',
  'Comidas': '🥡',
  'Gastronomía': '🍽️',
  'Indumentaria': '👕',
  'Vidrios': '🪟',
  'Óptica': '👓',
  'Audio': '📺',
  'Centro cultural': '🎭',
  'Decoración': '🎁',
  'Juguetería': '🧸',
  'Zapatería': '👟',
  'Almacén': '🌿',
  'Heladería': '🍦',
  'Panadería': '🥐',
  'Automotores': '🏍️',
  'Pastas': '🍝',
  'Veterinaria': '🐾',
  'Aves': '🐔',
}

function getRubroIcon(rubro: string) {
  for (const [key, icon] of Object.entries(RUBRO_ICONS)) {
    if (rubro.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '🏪'
}

const LOCALIDAD_COLORS: Record<string, string> = {
  'San Isidro': 'bg-green-100 text-green-800',
  'Martínez': 'bg-teal-100 text-teal-800',
  'Boulogne': 'bg-emerald-100 text-emerald-800',
  'Beccar': 'bg-amber-100 text-amber-800',
  'Acassuso': 'bg-lime-100 text-lime-800',
}

function mapsUrl(direccion: string, localidad: string) {
  const q = encodeURIComponent(`${direccion}, ${localidad}, Buenos Aires, Argentina`)
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

export default function BenefitCard({ comercio }: { comercio: Comercio }) {
  const [expanded, setExpanded] = useState(false)
  const icon = getRubroIcon(comercio.rubro)
  const locColor = LOCALIDAD_COLORS[comercio.localidad] || 'bg-slate-100 text-slate-700'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#d9ede2] flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Imagen */}
      {comercio.imagen_url ? (
        <div className="h-36 overflow-hidden bg-slate-100">
          <img
            src={comercio.imagen_url}
            alt={comercio.nombre}
            className="w-full h-full object-cover"
          />
        </div>
      ) : null}

      {/* Header strip */}
      <div className="bg-[#1d5c3a] px-5 py-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{icon}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight truncate">{comercio.nombre}</h3>
            <p className="text-green-200 text-xs mt-0.5 line-clamp-2">{comercio.rubro}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-2xl font-black text-white leading-none">{comercio.descuento}%</span>
          <p className="text-green-200 text-xs">OFF</p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-3 flex-1">
        {comercio.nuevo && (
          <span className="inline-flex w-fit items-center gap-1 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-200">
            ✨ Nuevo
          </span>
        )}

        <p className="text-[#1d5c3a] font-semibold text-sm">{comercio.descripcion_descuento}</p>

        <div className="space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <span className="shrink-0">📍</span>
            <span>{comercio.direccion}</span>
          </div>
          {comercio.dias_validos && (
            <div className="flex items-start gap-2">
              <span className="shrink-0">📅</span>
              <span>{comercio.dias_validos}</span>
            </div>
          )}
          {comercio.medios_pago && (
            <div className="flex items-start gap-2">
              <span className="shrink-0">💳</span>
              <span className="line-clamp-2">{comercio.medios_pago}</span>
            </div>
          )}
        </div>

        {comercio.condiciones && (
          <div className="mt-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-[#25a35f] font-medium hover:underline"
            >
              {expanded ? '▲ Ocultar condiciones' : '▼ Ver condiciones'}
            </button>
            {expanded && (
              <p className="mt-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-3 leading-relaxed border border-slate-100">
                {comercio.condiciones}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between gap-2 flex-wrap">
        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${locColor}`}>
          📌 {comercio.localidad}
        </span>

        <div className="flex items-center gap-2">
          {/* Google Maps — siempre visible */}
          <a
            href={mapsUrl(comercio.direccion, comercio.localidad)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#1d5c3a] bg-slate-100 hover:bg-[#d9ede2] px-2.5 py-1 rounded-full transition-colors"
            title="Ver en Google Maps"
          >
            🗺️ Maps
          </a>

          {/* Instagram */}
          {comercio.instagram_url && (
            <a
              href={comercio.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-pink-600 bg-slate-100 hover:bg-pink-50 px-2.5 py-1 rounded-full transition-colors"
              title="Ver en Instagram"
            >
              📸 Instagram
            </a>
          )}

          {/* Web */}
          {comercio.website_url && (
            <a
              href={comercio.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-[#1d5c3a] bg-slate-100 hover:bg-[#d9ede2] px-2.5 py-1 rounded-full transition-colors"
              title="Sitio web"
            >
              🌐 Web
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
