'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Heart, ShareNetwork, MapPin, CalendarBlank, CreditCard,
  InstagramLogo, Globe, NavigationArrow, IdentificationCard, Info, QrCode, Check, DeviceMobile,
  Copy, CaretRight, X, Storefront,
} from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'
import { getCupones, appLink } from '@/lib/cupones'
import CuponesGrid from '@/components/CuponesGrid'
import { Initials, DiscountPill } from '@/components/BenefitCard'

const FAVS_KEY = 'bsi-favoritos'
function getFavs(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FAVS_KEY) || '[]')) }
  catch { return new Set() }
}
function saveFavs(set: Set<string>) {
  localStorage.setItem(FAVS_KEY, JSON.stringify([...set]))
}

function parsePayment(medios: string): string[] {
  return medios.split(/[,;·]|\s+y\s+/i).map(m => m.trim()).filter(Boolean)
}

function Row({ icon: Icon, tone = 'green', title, children }: {
  icon: React.ComponentType<{ size: number; weight: 'fill' | 'regular'; className?: string }>
  tone?: 'green' | 'amber' | 'slate'
  title: string
  children: React.ReactNode
}) {
  const tones = {
    green: 'bg-[#e9f4ee] text-[#1d5c3a]',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-[#f5f7f6] text-[#6b7a72]',
  }
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <div className={`rounded-xl p-2 shrink-0 ${tones[tone]}`}>
        <Icon size={18} weight="fill" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-[#14201a] text-[13px]">{title}</p>
        <div className="text-[#4e5d55] text-[13px] mt-0.5 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

type SucInfo = {
  num: 1 | 2
  direccion: string
  localidad: string
  dias: string
  descuento: number
  descripcion: string
  medios: string[]
  mapsUrl: string
}

export default function ComercioPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [comercio, setComercio] = useState<Comercio | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFav, setIsFav] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [shared, setShared] = useState(false)
  const [cuponCopiado, setCuponCopiado] = useState(false)
  const [selectedSuc, setSelectedSuc] = useState<SucInfo | null>(null)
  const [sheetVisible, setSheetVisible] = useState(false)

  useEffect(() => {
    fetch(`/api/comercios/${id}`)
      .then(r => (r.ok ? r.json() : null))
      .then((found: Comercio | null) => {
        setComercio(found)
        if (found) setIsFav(getFavs().has(found.id))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  // animate sheet open
  useEffect(() => {
    if (selectedSuc) {
      requestAnimationFrame(() => setSheetVisible(true))
    } else {
      setSheetVisible(false)
    }
  }, [selectedSuc])

  function openSuc(suc: SucInfo) {
    setSelectedSuc(suc)
  }

  function closeSuc() {
    setSheetVisible(false)
    setTimeout(() => setSelectedSuc(null), 320)
  }

  function copiarCupon() {
    if (!comercio?.cupon_codigo) return
    navigator.clipboard.writeText(comercio.cupon_codigo).catch(() => {})
    setCuponCopiado(true)
    setTimeout(() => setCuponCopiado(false), 2000)
  }

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back()
    else router.push('/')
  }, [router])

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
    const url = `${window.location.origin}/comercio/${comercio.id}`
    const text = `${comercio.nombre}: ${comercio.descripcion_descuento}\n📍 ${comercio.direccion}, ${comercio.localidad}\n\nBeneficios para empleados de San Isidro 👉 ${url}`
    try {
      if (navigator.share) await navigator.share({ title: comercio.nombre, text, url })
      else { await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 2000) }
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5]">
        <div className="h-14 bg-white border-b border-[#e3ebe6]" />
        <div className="max-w-lg mx-auto px-4 pt-8 space-y-4">
          <div className="w-28 h-28 rounded-3xl skeleton-pulse mx-auto" />
          <div className="h-6 w-2/3 skeleton-pulse mx-auto" />
          <div className="h-4 w-1/3 skeleton-pulse mx-auto" />
          <div className="h-24 skeleton-pulse rounded-2xl mt-6" />
          <div className="h-40 skeleton-pulse rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!comercio) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-4xl">🏪</p>
        <p className="text-[#14201a] font-bold">Comercio no encontrado</p>
        <p className="text-[#6b7a72] text-sm">Puede que haya dejado de estar publicado.</p>
        <Link href="/" className="mt-2 bg-[#1d5c3a] text-white text-sm font-bold px-5 py-2.5 rounded-full">Volver al inicio</Link>
      </div>
    )
  }

  const cupones = getCupones(comercio.nombre)
  const medios = comercio.medios_pago ? parsePayment(comercio.medios_pago) : []
  const hasDireccion = !!comercio.direccion && !/varias|todas|sucursal/i.test(comercio.direccion)
  const q = encodeURIComponent(`${comercio.nombre}, ${comercio.direccion}, ${comercio.localidad}, Buenos Aires, Argentina`)
  const mapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${q}`
  const mapUrl = `https://maps.google.com/maps?q=${q}&output=embed&hl=es`

  const hasSucursales = !!comercio.sucursal_2_direccion
  const suc1: SucInfo | null = hasSucursales ? {
    num: 1,
    direccion: comercio.direccion,
    localidad: comercio.localidad,
    dias: comercio.dias_validos,
    descuento: comercio.descuento,
    descripcion: comercio.descripcion_descuento,
    medios,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${comercio.direccion}, ${comercio.localidad}, Buenos Aires`)}`,
  } : null
  const suc2: SucInfo | null = hasSucursales ? {
    num: 2,
    direccion: comercio.sucursal_2_direccion!,
    localidad: comercio.sucursal_2_localidad!,
    dias: comercio.sucursal_2_dias || comercio.dias_validos,
    descuento: comercio.sucursal_2_descuento ?? comercio.descuento,
    descripcion: comercio.sucursal_2_descripcion || comercio.descripcion_descuento,
    medios,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${comercio.sucursal_2_direccion}, ${comercio.sucursal_2_localidad}, Buenos Aires`)}`,
  } : null

  return (
    <div className="min-h-screen bg-[#f4f7f5] pb-28">

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-[#e3ebe6]">
        <div className="max-w-5xl mx-auto px-3 h-14 flex items-center justify-between">
          <button onClick={goBack} className="inline-flex items-center gap-1.5 h-10 pl-2 pr-3 rounded-full hover:bg-[#f5f7f6] text-[#14201a] font-semibold text-sm transition-colors" aria-label="Volver">
            <ArrowLeft size={18} weight="bold" /> Volver
          </button>
          <div className="flex items-center gap-1">
            <button onClick={handleShare} className="w-10 h-10 rounded-full hover:bg-[#f5f7f6] flex items-center justify-center text-[#14201a] transition-colors" aria-label="Compartir" title={shared ? 'Copiado' : 'Compartir'}>
              {shared ? <Check size={18} weight="bold" className="text-[#25a35f]" /> : <ShareNetwork size={18} weight="regular" />}
            </button>
            <button onClick={toggleFav} className="w-10 h-10 rounded-full hover:bg-[#f5f7f6] flex items-center justify-center transition-colors" aria-label={isFav ? 'Quitar favorito' : 'Guardar favorito'}>
              <Heart size={18} weight={isFav ? 'fill' : 'regular'} className={isFav ? 'text-red-500' : 'text-[#14201a]'} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start">

          {/* Columna principal */}
          <div className="min-w-0">
            {/* Identidad */}
            <div className="pt-6 pb-5 text-center lg:text-left lg:flex lg:items-center lg:gap-5">
              <div className="mx-auto lg:mx-0 w-28 h-28 shrink-0 relative">
                <div className="w-full h-full rounded-[28px] bg-white border border-[#e3ebe6] shadow-[0_8px_24px_rgba(20,32,26,0.08)] overflow-hidden">
                  {comercio.imagen_url && !imgError ? (
                    <img src={comercio.imagen_url} alt={comercio.nombre} className="w-full h-full object-contain p-3" onError={() => setImgError(true)} />
                  ) : (
                    <Initials nombre={comercio.nombre} size="lg" />
                  )}
                </div>
                {comercio.nuevo && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-amber-950 text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full rotate-6 shadow">NUEVO</span>
                )}
              </div>
              <div className="mt-4 lg:mt-0 min-w-0">
                <h1 className="text-[24px] lg:text-[28px] font-extrabold text-[#14201a] leading-tight">{comercio.nombre}</h1>
                <p className="text-[#6b7a72] text-sm mt-1">{comercio.rubro}</p>
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-[#e3ebe6] text-[#14201a] text-xs font-semibold px-3 py-1 rounded-full">
                    <MapPin size={12} weight="fill" className="text-[#25a35f]" />
                    {hasSucursales ? 'San Isidro y Martínez' : comercio.localidad}
                  </span>
                  {!hasSucursales && comercio.dias_validos && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-[#e3ebe6] text-[#4e5d55] text-xs font-medium px-3 py-1 rounded-full">
                      <CalendarBlank size={12} weight="regular" />
                      {comercio.dias_validos}
                    </span>
                  )}
                  {hasSucursales && (
                    <span className="inline-flex items-center gap-1.5 bg-white border border-[#e3ebe6] text-[#4e5d55] text-xs font-medium px-3 py-1 rounded-full">
                      <Storefront size={12} weight="regular" />
                      2 sucursales
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Beneficio */}
            <div className="rounded-[24px] bg-[#1d5c3a] text-white p-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="relative flex items-center gap-4">
                <div className="shrink-0">
                  {cupones ? (
                    <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                      <QrCode size={32} weight="bold" />
                    </div>
                  ) : (
                    <div className="text-center leading-none">
                      <p className="font-extrabold text-[44px] tracking-tight">{comercio.descuento}<span className="text-2xl">%</span></p>
                      <p className="text-[11px] font-bold tracking-[0.2em] text-green-200 mt-0.5">OFF</p>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-200">{cupones ? (cupones.qrDisponibles ? 'Cupones con QR' : 'Cupones en la app') : 'Beneficio'}</p>
                  <p className="font-bold text-[16px] leading-snug mt-1">{comercio.descripcion_descuento}</p>
                  {cupones && (
                    <a href="#cupones" className="inline-flex items-center gap-1 text-[12px] font-bold mt-2 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition-colors">
                      Ver los {cupones.cupones.length} cupones ↓
                    </a>
                  )}
                  {hasSucursales && (
                    <p className="text-[12px] text-green-200 mt-1.5">Tocá una sucursal para ver los detalles</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cupones */}
            {cupones && (
              <div className="mt-5">
                <CuponesGrid cfg={cupones} />
              </div>
            )}

            {/* Info (solo si NO tiene sucursales, que tienen su propio detalle en el popup) */}
            {!hasSucursales && (
              <div className="mt-5 bg-white rounded-[20px] border border-[#e3ebe6] divide-y divide-[#eef3f0] overflow-hidden">
                <Row icon={IdentificationCard} title="¿Cómo usar el beneficio?">
                  {cupones ? (
                    <ol className="mt-1 space-y-1.5">
                      {cupones.comoUsar.map((s, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#e9f4ee] text-[#1d5c3a] text-[11px] font-extrabold flex items-center justify-center">{i + 1}</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    'Presentá tu credencial municipal o contrato de trabajo al momento de pagar.'
                  )}
                </Row>
                {comercio.condiciones && (
                  <Row icon={Info} tone="amber" title="Condiciones">{comercio.condiciones}</Row>
                )}
                {medios.length > 0 && (
                  <Row icon={CreditCard} tone="slate" title="Medios de pago">
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {medios.map((m, i) => (
                        <span key={i} className="bg-[#f5f7f6] border border-[#e3ebe6] text-[#4e5d55] text-[11.5px] font-medium px-2.5 py-1 rounded-lg capitalize">{m}</span>
                      ))}
                    </div>
                  </Row>
                )}
              </div>
            )}

            {/* Beneficio online (cupón) */}
            {comercio.cupon_codigo && (
              <div className="mt-4 bg-white rounded-[20px] border border-indigo-100 overflow-hidden">
                <div className="px-4 pt-4 pb-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="bg-indigo-50 rounded-xl p-2 shrink-0">
                      <Globe size={18} weight="fill" className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-[#14201a] text-[13px]">Beneficio online</p>
                      <p className="text-[#4e5d55] text-xs mt-0.5">Descuento en la tienda web</p>
                    </div>
                  </div>
                  <p className="text-[#4e5d55] text-[13px] mb-3">Ingresá el código al hacer tu pedido online:</p>
                  <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <span className="font-black text-indigo-700 text-xl tracking-widest">{comercio.cupon_codigo}</span>
                    <button onClick={copiarCupon} className="ml-2 text-indigo-400 hover:text-indigo-600 transition-colors" aria-label="Copiar código">
                      {cuponCopiado
                        ? <Check size={16} weight="bold" className="text-green-600" />
                        : <Copy size={16} weight="regular" />}
                    </button>
                  </div>
                  {cuponCopiado && <p className="text-xs text-green-600 font-semibold mt-2">Código copiado.</p>}
                  {comercio.cupon_url && (
                    <a
                      href={comercio.cupon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-colors"
                    >
                      <Globe size={16} weight="fill" />
                      Ir a la tienda online
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Sucursales — botones que abren el popup */}
            {hasSucursales && suc1 && suc2 && (
              <div className="mt-4 bg-white rounded-[20px] border border-[#e3ebe6] overflow-hidden">
                <div className="px-4 pt-4 pb-0 flex items-center justify-between">
                  <p className="font-bold text-[#14201a] text-[13px]">Sucursales</p>
                  <span className="text-[11px] text-[#6b7a72]">Tocá para ver los detalles</span>
                </div>
                <div className="divide-y divide-[#eef3f0] mt-3">
                  {[suc1, suc2].map(suc => (
                    <button
                      key={suc.num}
                      onClick={() => openSuc(suc)}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-[#f8faf9] active:bg-[#f1f6f3] transition-colors text-left"
                    >
                      <div className="w-9 h-9 rounded-2xl bg-[#e9f4ee] flex items-center justify-center shrink-0">
                        <MapPin size={16} weight="fill" className="text-[#1d5c3a]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-[#14201a]">{suc.direccion}</p>
                        <p className="text-[11.5px] text-[#4e5d55] mt-0.5">{suc.localidad} · {suc.dias}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-[#1d5c3a] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-full">{suc.descuento}%</span>
                        <CaretRight size={14} weight="bold" className="text-[#b0c4b8]" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="h-3" />
              </div>
            )}
          </div>

          {/* Columna lateral */}
          <aside className="mt-5 lg:mt-6 lg:sticky lg:top-20">
            {hasSucursales && suc1 && suc2 ? (
              <div className="bg-white rounded-[20px] border border-[#e3ebe6] overflow-hidden">
                <div className="px-4 pt-4 pb-3">
                  <p className="font-bold text-[#14201a] text-[13px]">2 sucursales</p>
                  <p className="text-[#4e5d55] text-[12px] mt-0.5">Tocá una para ver la info completa</p>
                </div>
                <div className="divide-y divide-[#eef3f0]">
                  {[suc1, suc2].map(suc => (
                    <button
                      key={suc.num}
                      onClick={() => openSuc(suc)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f8faf9] transition-colors text-left"
                    >
                      <MapPin size={14} weight="fill" className="text-[#25a35f] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-semibold text-[#14201a] truncate">{suc.direccion}</p>
                        <p className="text-[11px] text-[#4e5d55]">{suc.localidad} · {suc.dias}</p>
                      </div>
                      <CaretRight size={13} weight="bold" className="text-[#b0c4b8] shrink-0" />
                    </button>
                  ))}
                </div>
                <div className="h-1" />
              </div>
            ) : hasDireccion ? (
              <div className="bg-white rounded-[20px] border border-[#e3ebe6] overflow-hidden">
                <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[#14201a] text-[13px]">Ubicación</p>
                    <p className="text-[#4e5d55] text-[13px] mt-0.5 flex items-start gap-1.5">
                      <MapPin size={14} weight="fill" className="text-[#25a35f] shrink-0 mt-0.5" />
                      <span>{comercio.direccion}, {comercio.localidad}</span>
                    </p>
                  </div>
                  <a href={mapsExternalUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-[#1d5c3a] text-xs font-bold inline-flex items-center gap-1 bg-[#e9f4ee] px-2.5 py-1.5 rounded-full">
                    <NavigationArrow size={12} weight="fill" /> Abrir
                  </a>
                </div>
                <iframe src={mapUrl} className="w-full" style={{ height: '220px', border: 'none' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Mapa de ${comercio.nombre}`} />
              </div>
            ) : (
              <div className="bg-white rounded-[20px] border border-[#e3ebe6] p-4">
                <p className="font-bold text-[#14201a] text-[13px]">Ubicación</p>
                <p className="text-[#4e5d55] text-[13px] mt-0.5">{comercio.direccion || 'Válido en todas las sucursales.'}</p>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Barra de acciones */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#e3ebe6] pb-safe">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2.5">
          {cupones ? (
            <a href={appLink(cupones)} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 text-white font-bold text-sm h-12 rounded-2xl transition-opacity hover:opacity-90 whitespace-nowrap" style={{ background: cupones.color }}>
              <DeviceMobile size={18} weight="fill" /> Abrir {cupones.appNombre}
            </a>
          ) : hasSucursales && suc1 ? (
            <button
              onClick={() => openSuc(suc1)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1d5c3a] hover:bg-[#236b43] text-white font-bold text-sm h-12 rounded-2xl transition-colors"
            >
              <Storefront size={16} weight="fill" /> Ver sucursales
            </button>
          ) : (
            <a href={mapsExternalUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#1d5c3a] hover:bg-[#236b43] text-white font-bold text-sm h-12 rounded-2xl transition-colors">
              <NavigationArrow size={16} weight="fill" /> Cómo llegar
            </a>
          )}
          {comercio.instagram_url && (
            <a href={comercio.instagram_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-white border border-[#e3ebe6] text-[#14201a] rounded-2xl hover:bg-[#f5f7f6] transition-colors" aria-label="Instagram">
              <InstagramLogo size={20} weight="regular" />
            </a>
          )}
          {comercio.website_url && (
            <a href={comercio.website_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-white border border-[#e3ebe6] text-[#14201a] rounded-2xl hover:bg-[#f5f7f6] transition-colors" aria-label="Sitio web">
              <Globe size={20} weight="regular" />
            </a>
          )}
          <button onClick={handleShare} className="w-12 h-12 flex items-center justify-center bg-white border border-[#e3ebe6] text-[#14201a] rounded-2xl hover:bg-[#f5f7f6] transition-colors" aria-label="Compartir">
            {shared ? <Check size={20} weight="bold" className="text-[#25a35f]" /> : <ShareNetwork size={20} weight="regular" />}
          </button>
        </div>
      </div>

      {/* Bottom sheet — detalle de sucursal */}
      {selectedSuc && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeSuc}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity: sheetVisible ? 1 : 0 }}
          />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] shadow-2xl transition-transform duration-300 ease-out overflow-hidden"
            style={{ transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#d4e4da]" />
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto max-h-[82vh] pb-safe">

              {/* Header */}
              <div className="px-5 pt-3 pb-4 flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#e3ebe6] shadow-sm overflow-hidden shrink-0">
                  {comercio.imagen_url && !imgError ? (
                    <img src={comercio.imagen_url} alt={comercio.nombre} className="w-full h-full object-contain p-2" />
                  ) : (
                    <Initials nombre={comercio.nombre} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-[#14201a] text-[17px] leading-tight">{comercio.nombre}</p>
                  <p className="text-[#4e5d55] text-[13px] mt-0.5 flex items-center gap-1">
                    <MapPin size={12} weight="fill" className="text-[#25a35f] shrink-0" />
                    {selectedSuc.direccion}, {selectedSuc.localidad}
                  </p>
                </div>
                <button
                  onClick={closeSuc}
                  className="w-9 h-9 rounded-full bg-[#f4f7f5] flex items-center justify-center text-[#6b7a72] hover:bg-[#e9f4ee] transition-colors shrink-0"
                  aria-label="Cerrar"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>

              {/* Beneficio badge */}
              <div className="mx-5 mb-4 rounded-[20px] bg-[#1d5c3a] text-white p-4 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="relative flex items-center gap-4">
                  <div className="text-center leading-none shrink-0">
                    <p className="font-extrabold text-[52px] tracking-tight leading-none">{selectedSuc.descuento}<span className="text-[26px]">%</span></p>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-green-200 mt-0.5">OFF</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-200 mb-1">Beneficio</p>
                    <p className="font-bold text-[15px] leading-snug">{selectedSuc.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Info rows */}
              <div className="mx-5 bg-[#f8faf9] rounded-[20px] divide-y divide-[#eef3f0] overflow-hidden mb-4">
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <div className="rounded-xl p-2 shrink-0 bg-[#e9f4ee] text-[#1d5c3a]">
                    <CalendarBlank size={16} weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#14201a] text-[13px]">Días válidos</p>
                    <p className="text-[#4e5d55] text-[13px] mt-0.5">{selectedSuc.dias}</p>
                  </div>
                </div>
                {selectedSuc.medios.length > 0 && (
                  <div className="flex items-start gap-3 px-4 py-3.5">
                    <div className="rounded-xl p-2 shrink-0 bg-[#f5f7f6] text-[#6b7a72]">
                      <CreditCard size={16} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#14201a] text-[13px]">Medios de pago</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedSuc.medios.map((m, i) => (
                          <span key={i} className="bg-white border border-[#e3ebe6] text-[#4e5d55] text-[11.5px] font-medium px-2.5 py-1 rounded-lg capitalize">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 px-4 py-3.5">
                  <div className="rounded-xl p-2 shrink-0 bg-[#e9f4ee] text-[#1d5c3a]">
                    <IdentificationCard size={16} weight="fill" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#14201a] text-[13px]">¿Cómo usar el beneficio?</p>
                    <p className="text-[#4e5d55] text-[13px] mt-0.5">Presentá tu credencial municipal o contrato de trabajo al momento de pagar.</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="px-5 pb-6">
                <a
                  href={selectedSuc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#1d5c3a] hover:bg-[#236b43] text-white font-bold text-[15px] h-13 py-3.5 rounded-2xl transition-colors"
                >
                  <NavigationArrow size={18} weight="fill" />
                  Cómo llegar a esta sucursal
                </a>
                {comercio.instagram_url && (
                  <a
                    href={comercio.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 flex items-center justify-center gap-2 bg-[#f4f7f5] hover:bg-[#e9f4ee] text-[#14201a] font-semibold text-[14px] h-12 rounded-2xl transition-colors"
                  >
                    <InstagramLogo size={17} weight="regular" />
                    Ver en Instagram
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
