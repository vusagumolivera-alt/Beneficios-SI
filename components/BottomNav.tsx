'use client'

import Link from 'next/link'
import { House, Heart, MagnifyingGlass, MapTrifold } from '@phosphor-icons/react'

type Tab = 'inicio' | 'favoritos' | 'buscar' | 'mapa'

export default function BottomNav({
  active,
  onChange,
}: {
  active: Tab
  onChange: (tab: Tab) => void
}) {
  const items: { key: Tab; label: string; Icon: typeof House }[] = [
    { key: 'inicio',    label: 'Inicio',    Icon: House },
    { key: 'favoritos', label: 'Favoritos', Icon: Heart },
    { key: 'buscar',    label: 'Buscar',    Icon: MagnifyingGlass },
    { key: 'mapa',      label: 'Mapa',      Icon: MapTrifold },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e8f0eb] flex pb-safe">
      {items.map(({ key, label, Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors"
            aria-label={label}
          >
            <div className={`flex items-center justify-center w-14 h-7 rounded-full transition-all duration-200 ${isActive ? 'bg-[#e4f0ea]' : ''}`}>
              <Icon size={20} weight={isActive ? 'fill' : 'regular'} className={isActive ? 'text-[#1d5c3a]' : 'text-slate-400'} />
            </div>
            <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-[#1d5c3a]' : 'text-slate-400'}`}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
