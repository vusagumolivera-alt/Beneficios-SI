'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, QrCode, DeviceMobile, ArrowSquareOut, CalendarBlank } from '@phosphor-icons/react'
import type { CuponesConfig, Cupon } from '@/lib/cupones'

function QrImage({ src, alt, className, compact = false }: { src: string; alt: string; className?: string; compact?: boolean }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-white text-[#9aa8a0] ${className}`} title="QR próximamente">
        <QrCode size={compact ? 22 : 36} weight="regular" />
        {!compact && <span className="text-[11px] font-semibold">QR próximamente</span>}
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />
}

function BeneficioPill({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-flex items-center whitespace-nowrap text-white font-extrabold text-[11.5px] px-2.5 py-1 rounded-full shadow-sm"
      style={{ background: color }}
    >
      {text}
    </span>
  )
}

function CuponModal({ cupon, cfg, onClose }: { cupon: Cupon; cfg: CuponesConfig; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-[#14201a]/70 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="animate-sheetUp w-full sm:max-w-sm bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl overflow-hidden pb-safe"
        onClick={e => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-label={cupon.titulo}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">{cupon.emoji}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7a72] truncate">{cupon.categoria}</span>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#f5f7f6] flex items-center justify-center text-[#14201a]" aria-label="Cerrar">
            <X size={16} weight="bold" />
          </button>
        </div>

        <div className="px-5">
          <h3 className="font-extrabold text-[#14201a] text-xl leading-tight">{cupon.titulo}</h3>
          {cupon.detalle && <p className="text-[#6b7a72] text-sm mt-0.5">{cupon.detalle}</p>}
          <div className="mt-2"><BeneficioPill text={cupon.beneficio} color={cfg.color} /></div>
        </div>

        <div className="mx-5 mt-4 rounded-2xl bg-[#f5f7f6] p-4 flex items-center justify-center">
          <QrImage src={cupon.qr} alt={`QR ${cupon.titulo}`} className="w-full max-w-[260px] aspect-square rounded-xl bg-white object-contain" />
        </div>

        <div className="px-5 pt-4 pb-5">
          <p className="text-[12.5px] text-[#14201a] font-semibold flex items-center gap-1.5">
            <DeviceMobile size={15} weight="fill" className="text-[#25a35f]" />
            Escaneá el QR con la cámara del celu
          </p>
          <p className="text-[12px] text-[#6b7a72] mt-1 leading-relaxed">
            Se abre la {cfg.appNombre} con el cupón cargado. Mostralo en caja o usalo en el autopedido.
          </p>
          {cupon.nota && <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5 mt-2">* {cupon.nota}</p>}
          {cfg.vence && (
            <p className="text-[11px] text-[#6b7a72] mt-3 flex items-center gap-1">
              <CalendarBlank size={12} /> Válido hasta el {cfg.vence}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function CuponesGrid({ cfg }: { cfg: CuponesConfig }) {
  const [open, setOpen] = useState<Cupon | null>(null)

  return (
    <section id="cupones">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <QrCode size={16} weight="bold" className="text-[#14201a]" />
          <h2 className="text-[13px] font-extrabold text-[#14201a] uppercase tracking-wider">Cupones</h2>
          <span className="bg-[#e9f4ee] text-[#1d5c3a] text-[11px] font-bold px-2 py-0.5 rounded-full">{cfg.cupones.length}</span>
        </div>
        {cfg.vence && <span className="text-[11px] text-[#6b7a72]">Hasta el {cfg.vence}</span>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cfg.cupones.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setOpen(c)}
            className="group text-left bg-white rounded-[20px] border border-[#e3ebe6] shadow-[0_1px_2px_rgba(20,32,26,0.04)] hover:shadow-[0_8px_24px_rgba(20,32,26,0.08)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 overflow-hidden animate-cardEnter"
            style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
          >
            <div className="p-3 pb-0">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7a72] line-clamp-1">{c.categoria}</span>
                <span className="text-base leading-none">{c.emoji}</span>
              </div>
              <h3 className="font-bold text-[#14201a] text-[13px] leading-[1.2] mt-1 line-clamp-2 min-h-[2.4em]">{c.titulo}</h3>
              {c.detalle && <p className="text-[10.5px] text-[#6b7a72] mt-0.5 line-clamp-1">{c.detalle}</p>}
            </div>
            <div className="m-2 mt-2.5 rounded-2xl bg-[#f5f7f6] ring-1 ring-inset ring-black/[0.04] p-2 flex items-center gap-2">
              <QrImage compact src={c.qr} alt={`QR ${c.titulo}`} className="w-[52px] h-[52px] rounded-lg bg-white object-contain shrink-0 ring-1 ring-black/[0.04]" />
              <div className="min-w-0 flex-1 flex flex-col items-start gap-1">
                <BeneficioPill text={c.beneficio} color={cfg.color} />
                <p className="text-[10px] text-[#6b7a72] font-medium group-hover:text-[#1d5c3a] leading-tight">Tocá para ampliar</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* App links */}
      {cfg.appLinks && (
        <div className="mt-4 bg-white rounded-[20px] border border-[#e3ebe6] p-4">
          <p className="font-bold text-[#14201a] text-sm">¿No tenés la {cfg.appNombre}?</p>
          <p className="text-[12px] text-[#6b7a72] mt-0.5">Descargala gratis, el cupón se activa al escanear.</p>
          <div className="flex gap-2 mt-3">
            {cfg.appLinks.ios && (
              <a href={cfg.appLinks.ios} target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#14201a] bg-[#f5f7f6] hover:bg-[#e9f4ee] px-3 py-2.5 rounded-xl transition-colors">
                App Store <ArrowSquareOut size={13} />
              </a>
            )}
            {cfg.appLinks.android && (
              <a href={cfg.appLinks.android} target="_blank" rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#14201a] bg-[#f5f7f6] hover:bg-[#e9f4ee] px-3 py-2.5 rounded-xl transition-colors">
                Google Play <ArrowSquareOut size={13} />
              </a>
            )}
          </div>
        </div>
      )}

      {open && <CuponModal cupon={open} cfg={cfg} onClose={() => setOpen(null)} />}
    </section>
  )
}
