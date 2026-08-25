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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-[#d9ede2] flex">
      {items.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
            active === key ? 'text-[#1d5c3a]' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label={label}
        >
          <Icon size={22} weight={active === key ? 'fill' : 'regular'} />
          <span className="text-[10px] font-semibold">{label}</span>
        </button>
      ))}
    </div>
  )
}
