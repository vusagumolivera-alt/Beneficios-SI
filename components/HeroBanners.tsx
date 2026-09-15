'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, QrCode, Sparkle, Storefront } from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'
import { getCupones } from '@/lib/cupones'

const H = 'h-[168px] sm:h-[184px]'

function BannerMc({ comercio }: { comercio: Comercio }) {
  const cfg = getCupones(comercio.nombre)!
  return (
    <Link href={`/comercio/${comercio.id}`} className={`group relative block w-full ${H} overflow-hidden bg-[#14201a] text-white`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full opacity-25 blur-2xl" style={{ background: cfg.color }} />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-[#25a35f] opacity-20 blur-2xl" />
      </div>
      <div className="relative z-10 h-full flex items-center gap-4 px-4 sm:px-5">
        <div className="shrink-0 w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden ring-1 ring-white/20">
          {comercio.imagen_url ? <img src={comercio.imagen_url} alt={cfg.marca} className="w-full h-full object-contain p-2.5" /> : <span className="text-3xl">🍔</span>}
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full">
            <Sparkle size={10} weight="fill" /> NUEVO
          </span>
          <h2 className="mt-1.5 font-extrabold text-[18px] sm:text-[22px] leading-tight">Llegó {cfg.marca}</h2>
          <p className="text-white/75 text-[12.5px] sm:text-sm mt-1 leading-snug line-clamp-2">
            {comercio.descripcion_descuento || `${cfg.cupones.length} cupones con QR para usar en la ${cfg.appNombre}`}
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-bold bg-white/12 group-hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full">
            <QrCode size={14} weight="bold" /> Ver los {cfg.cupones.length} cupones
            <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BannerRed({ total, onClick }: { total: number; onClick?: () => void }) {
  const redondeado = Math.floor(total / 10) * 10
  return (
    <button onClick={onClick} className={`group relative block w-full text-left ${H} overflow-hidden bg-gradient-to-r from-[#1d5c3a] to-[#1a7a4a] text-white`}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/8" />
        <div className="absolute -bottom-10 -left-8 w-36 h-36 rounded-full bg-white/6" />
      </div>
      <div className="relative z-10 h-full flex items-center gap-4 px-4 sm:px-5">
        <div className="shrink-0 w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-2xl bg-white/12 flex flex-col items-center justify-center ring-1 ring-white/15">
          <span className="font-extrabold text-[30px] sm:text-4xl leading-none">{redondeado}+</span>
          <span className="text-green-200 text-[10px] font-bold tracking-widest mt-1">LOCALES</span>
        </div>
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1 text-green-200 text-[10px] font-bold uppercase tracking-widest">
            <Storefront size={11} weight="fill" /> Red en crecimiento
          </span>
          <h2 className="mt-1.5 font-extrabold text-[18px] sm:text-[22px] leading-tight">Más de {redondeado} locales adheridos</h2>
          <p className="text-green-100/85 text-[12.5px] sm:text-sm mt-1 leading-snug line-clamp-2">
            En San Isidro, Martínez, Boulogne, Beccar y Acassuso. Y seguimos sumando.
          </p>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-bold bg-white/15 group-hover:bg-white/25 transition-colors px-3 py-1.5 rounded-full">
            Ver todos los comercios <ArrowRight size={12} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  )
}

export default function HeroBanners({ lanzamiento, total, onVerTodos }: { lanzamiento: Comercio | null; total: number; onVerTodos?: () => void }) {
  const slides = [
    ...(lanzamiento ? [{ key: 'mc', node: <BannerMc comercio={lanzamiento} /> }] : []),
    { key: 'red', node: <BannerRed total={total} onClick={onVerTodos} /> },
  ]
  const n = slides.length
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)

  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n])

  useEffect(() => {
    if (paused || n < 2) return
    const t = setInterval(() => setI(c => (c + 1) % n), 5000)
    return () => clearInterval(t)
  }, [paused, n])

  return (
    <div
      className="relative rounded-[24px] overflow-hidden shadow-[0_12px_32px_rgba(20,32,26,0.18)] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; setPaused(true) }}
      onTouchEnd={e => {
        if (touchX.current !== null) {
          const d = touchX.current - e.changedTouches[0].clientX
          if (Math.abs(d) > 40) go(i + (d > 0 ? 1 : -1))
        }
        touchX.current = null; setPaused(false)
      }}
    >
      {/* Pista: ambos banners tienen la misma altura fija, el cambio es un deslizamiento sin salto */}
      <div className="flex transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map(s => <div key={s.key} className="w-full shrink-0">{s.node}</div>)}
      </div>

      {n > 1 && (
        <div className="absolute top-3 right-4 z-20 flex gap-1.5 pointer-events-none">
          {slides.map((s, k) => (
            <button
              key={s.key}
              onClick={() => go(k)}
              className={`pointer-events-auto h-1.5 rounded-full transition-all duration-300 ${k === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
              aria-label={`Banner ${k + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
