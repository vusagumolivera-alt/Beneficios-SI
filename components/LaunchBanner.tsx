'use client'

import Link from 'next/link'
import { ArrowRight, QrCode, Sparkle } from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'
import { getCupones } from '@/lib/cupones'

/**
 * Banner de lanzamiento para un comercio con cupones (ej. McDonald's).
 * Se muestra solo si el comercio existe en la base y tiene cupones configurados.
 */
export default function LaunchBanner({ comercio }: { comercio: Comercio }) {
  const cfg = getCupones(comercio.nombre)
  if (!cfg) return null

  return (
    <Link
      href={`/comercio/${comercio.id}`}
      className="group relative block overflow-hidden rounded-[24px] bg-[#14201a] text-white shadow-[0_12px_32px_rgba(20,32,26,0.18)]"
    >
      {/* fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full opacity-25 blur-2xl" style={{ background: cfg.color }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-[#25a35f] opacity-20 blur-2xl" />
      </div>

      <div className="relative z-10 flex items-center gap-4 p-4 sm:p-5">
        {/* Logo */}
        <div className="shrink-0 w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden ring-1 ring-white/20">
          {comercio.imagen_url ? (
            <img src={comercio.imagen_url} alt={cfg.marca} className="w-full h-full object-contain p-2.5" />
          ) : (
            <span className="text-3xl">🍔</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full">
            <Sparkle size={10} weight="fill" /> NUEVO
          </span>
          <h2 className="mt-1.5 font-extrabold text-[18px] sm:text-[22px] leading-tight">
            Llegó {cfg.marca}
          </h2>
          <p className="text-white/75 text-[12.5px] sm:text-sm mt-1 leading-snug">
            {comercio.descripcion_descuento || `${cfg.cupones.length} cupones con QR para usar en la ${cfg.appNombre}`}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-bold text-white bg-white/12 group-hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full">
            <QrCode size={14} weight="bold" />
            Ver los {cfg.cupones.length} cupones
            <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}
