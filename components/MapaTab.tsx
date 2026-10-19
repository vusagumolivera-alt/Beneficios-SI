'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, NavigationArrow, X, Heart } from '@phosphor-icons/react'
import type { Comercio } from '@/lib/supabase'

type Props = { comercios: Comercio[] }

/* ── color por rubro ── */
const RUBRO_COLOR: Record<string, string> = {
  panaderia: '#d97706', confiteria: '#d97706',
  gastronomia: '#e0552a', comidas: '#e0552a', pasta: '#e0552a', fruteria: '#e0552a',
  farmacia: '#c0255e', salud: '#c0255e', optica: '#c0255e',
  indumentaria: '#6d28d9', moda: '#6d28d9', zapateria: '#6d28d9',
  peluqueria: '#0891b2', belleza: '#0891b2',
  helad: '#0284c7',
  default: '#1d5c3a',
}

function pinColor(rubro: string) {
  const r = rubro.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  for (const [key, color] of Object.entries(RUBRO_COLOR)) {
    if (key !== 'default' && r.includes(key)) return color
  }
  return RUBRO_COLOR.default
}

function initials(nombre: string) {
  return nombre.split(' ').filter(w => w.length > 2).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('').slice(0, 2)
}

/* ── HTML del pin ── */
function pinHtml(c: Comercio, active: boolean) {
  const size = active ? 46 : 38
  const border = active ? 3.5 : 3
  const shadow = active
    ? 'drop-shadow(0 6px 12px rgba(0,0,0,.42))'
    : 'drop-shadow(0 3px 8px rgba(0,0,0,.32))'
  const col = pinColor(c.rubro)
  const ini = initials(c.nombre)
  const tailSize = active ? 10 : 8.5

  const innerContent = c.imagen_url
    ? `<img
        src="${c.imagen_url}"
        style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        alt="${ini}"
      /><span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;font-family:Inter,-apple-system,sans-serif;font-size:${active ? 13 : 11}px;font-weight:900;color:#fff;">${ini}</span>`
    : `<span style="font-family:Inter,-apple-system,sans-serif;font-size:${active ? 13 : 11}px;font-weight:900;color:#fff;">${ini}</span>`

  return `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${col};border:${border}px solid #fff;
      filter:${shadow};
      display:flex;align-items:center;justify-content:center;
      overflow:hidden;
      transition:all .2s;
    ">${innerContent}</div>
    <div style="width:0;height:0;border-left:${tailSize / 2 + 1}px solid transparent;border-right:${tailSize / 2 + 1}px solid transparent;border-top:${tailSize}px solid ${col};margin-top:-1.5px;"></div>
  </div>`
}

export default function MapaTab({ comercios }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const [selected, setSelected] = useState<Comercio | null>(null)
  const [cardVisible, setCardVisible] = useState(false)
  const [favIds, setFavIds] = useState<Set<string>>(new Set())

  const withCoords = comercios.filter(c => c.lat != null && c.lng != null)

  const openCard = useCallback((c: Comercio) => {
    setSelected(c)
    requestAnimationFrame(() => setCardVisible(true))
  }, [])

  const closeCard = useCallback((prevSelected?: Comercio | null) => {
    setCardVisible(false)
    setTimeout(() => {
      setSelected(null)
      // resetear pin activo
      const L = (window as any).__L
      if (!L || !prevSelected) return
      const m = markersRef.current.get(prevSelected.id)
      if (!m) return
      m.setIcon(L.divIcon({
        html: pinHtml(prevSelected, false),
        className: '',
        iconSize: [38, 46],
        iconAnchor: [19, 46],
      }))
    }, 340)
  }, [])

  /* ── inicialización del mapa ── */
  useEffect(() => {
    if (!mapContainerRef.current) return

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(L => {
      ;(window as any).__L = L
      if (mapRef.current) return

      const map = L.map(mapContainerRef.current!, {
        center: [-34.4726, -58.5218],
        zoom: 14,
        zoomControl: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      withCoords.forEach(c => addMarker(L, map, c))
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current.clear()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ── re-agregar markers cuando cambian los datos ── */
  useEffect(() => {
    const L = (window as any).__L
    if (!L || !mapRef.current) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current.clear()
    withCoords.forEach(c => addMarker(L, mapRef.current, c))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comercios])

  function addMarker(L: any, map: any, c: Comercio) {
    const icon = L.divIcon({
      html: pinHtml(c, false),
      className: '',
      iconSize: [38, 46],
      iconAnchor: [19, 46],
    })
    const marker = L.marker([c.lat!, c.lng!], { icon }).addTo(map)
    markersRef.current.set(c.id, marker)

    marker.on('click', () => {
      // activar este pin, desactivar el resto
      markersRef.current.forEach((m, id) => {
        const cc = withCoords.find(x => x.id === id)!
        const isActive = id === c.id
        m.setIcon(L.divIcon({
          html: pinHtml(cc, isActive),
          className: '',
          iconSize: isActive ? [46, 56] : [38, 46],
          iconAnchor: isActive ? [23, 56] : [19, 46],
        }))
      })
      openCard(c)
    })
  }

  const toggleFav = (id: string) => {
    setFavIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const mapsUrl = selected
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        selected.direccion + ' ' + selected.localidad + ' Buenos Aires Argentina'
      )}`
    : '#'

  return (
    <div
      className="fixed inset-x-0"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 46px)', bottom: 64 }}
    >
      {/* Mapa */}
      <div ref={mapContainerRef} className="absolute inset-0" />

      {/* Counter */}
      {withCoords.length > 0 && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-bold text-[#14201a] shadow border border-[#e3ebe6]">
          {withCoords.length} comercio{withCoords.length !== 1 ? 's' : ''} en el mapa
        </div>
      )}

      {/* Estado sin coordenadas */}
      {withCoords.length === 0 && !mapRef.current && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-6 mx-6 text-center shadow-xl border border-[#e3ebe6]">
            <MapPin size={32} className="text-[#25a35f] mx-auto mb-2" weight="fill" />
            <p className="font-bold text-[#14201a] text-sm">Sin ubicaciones cargadas</p>
            <p className="text-xs text-[#4e5d55] mt-1 leading-relaxed">
              Agregá lat/lng a los comercios desde el panel de Supabase para verlos acá
            </p>
          </div>
        </div>
      )}

      {/* Overlay */}
      {selected && (
        <div
          className="absolute inset-0 z-[1001] transition-opacity duration-300"
          style={{ background: 'rgba(0,0,0,.45)', opacity: cardVisible ? 1 : 0 }}
          onClick={() => closeCard(selected)}
        />
      )}

      {/* Card */}
      {selected && (
        <div
          className="absolute bottom-0 left-0 right-0 z-[1002] bg-white rounded-t-[24px] shadow-2xl transition-transform duration-[380ms]"
          style={{
            transitionTimingFunction: 'cubic-bezier(.32,.72,0,1)',
            transform: cardVisible ? 'translateY(0)' : 'translateY(100%)',
          }}
        >
          <div className="w-9 h-1 rounded-full bg-[#e3ebe6] mx-auto mt-2.5 mb-1" />

          <div className="flex items-center gap-3.5 px-5 pt-3">
            {/* Logo */}
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#e9f4ee] border border-[#e3ebe6] overflow-hidden shrink-0 flex items-center justify-center">
              {selected.imagen_url ? (
                <img
                  src={selected.imagen_url}
                  alt={selected.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                    ;(e.target as HTMLImageElement).parentElement!.innerHTML =
                      `<span class="text-[15px] font-black text-[#1d5c3a] tracking-tight">${initials(selected.nombre)}</span>`
                  }}
                />
              ) : (
                <span className="text-[15px] font-black text-[#1d5c3a] tracking-tight">
                  {initials(selected.nombre)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-[15px] text-[#14201a] truncate">{selected.nombre}</p>
              <p className="text-[11.5px] text-[#4e5d55] mt-0.5">{selected.rubro}</p>
              <p className="text-[11.5px] text-[#4e5d55] mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25a35f] shrink-0" />
                {selected.direccion}, {selected.localidad}
              </p>
            </div>

            <div className="bg-[#1d5c3a] text-white rounded-[13px] px-3 py-2 text-center shrink-0">
              <span className="block text-[22px] font-black leading-none tracking-tight">{selected.descuento}%</span>
              <span className="block text-[9px] font-bold opacity-70 tracking-widest">OFF</span>
            </div>
          </div>

          <div className="flex gap-2 px-5 pt-3 pb-5">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#1d5c3a] text-white rounded-[14px] py-3 text-[13.5px] font-bold flex items-center justify-center gap-1.5 no-underline"
            >
              <NavigationArrow size={15} weight="fill" />
              Cómo llegar
            </a>
            <button
              onClick={() => toggleFav(selected.id)}
              className="w-11 h-11 rounded-[14px] border border-[#e3ebe6] bg-[#f4f7f5] flex items-center justify-center shrink-0 transition-colors"
            >
              <Heart
                size={18}
                weight={favIds.has(selected.id) ? 'fill' : 'regular'}
                className={favIds.has(selected.id) ? 'text-rose-500' : 'text-[#4e5d55]'}
              />
            </button>
            <button
              onClick={() => closeCard(selected)}
              className="w-11 h-11 rounded-[14px] border border-[#e3ebe6] bg-[#f4f7f5] flex items-center justify-center shrink-0"
            >
              <X size={15} weight="bold" className="text-[#4e5d55]" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
