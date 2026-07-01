'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Star, CurrencyDollar, Storefront } from '@phosphor-icons/react'

const SLIDES = [
  {
    Icon: Star,
    label: 'Programa de Beneficios — San Isidro',
    title: 'Descuentos exclusivos para vos',
    subtitle: 'Aprovechá los beneficios que la Municipalidad de San Isidro tiene para su personal.',
    cta: 'Ver todos los descuentos',
    highlight: null,
    accentColor: 'text-green-300',
  },
  {
    Icon: CurrencyDollar,
    label: 'Ahorrá en cada compra',
    title: 'Los mejores descuentos: hasta 50% OFF',
    subtitle: 'Gastronomía, belleza, indumentaria y mucho más cerca tuyo.',
    cta: 'Ver los mejores descuentos →',
    ctaKey: 'highDiscount',
    highlight: null,
    accentColor: 'text-green-200',
  },
  {
    Icon: Storefront,
    label: 'Red en crecimiento',
    title: 'Más de 30 locales adheridos',
    subtitle: 'En San Isidro, Martínez, Boulogne, Beccar y Acassuso. Y seguimos sumando.',
    cta: null,
    highlight: '30+',
    accentColor: 'text-emerald-300',
  },
]

interface HeroCarouselProps {
  onCtaClick?: () => void
  onHighDiscountClick?: () => void
}

export default function HeroCarousel({ onCtaClick, onHighDiscountClick }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [animating, setAnimating] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 400)
  }, [animating])

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length)
  }, [current, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [paused])

  const slide = SLIDES[current]
  const { Icon } = slide

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1d5c3a] to-[#1a7a4a] shadow-md select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return
        const diff = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
        touchStartX.current = null
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/8" />
        <div className="absolute top-10 -right-10 w-24 h-24 rounded-full bg-white/6" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/6" />
      </div>

      {/* Slide content */}
      <div
        key={current}
        className="animate-fadeSlide relative z-10 px-5 pt-5 pb-4 min-h-[148px]"
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
            <Icon size={24} weight="regular" className="text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className={`${slide.accentColor} text-[10px] font-bold uppercase tracking-widest mb-1`}>
              {slide.label}
            </p>
            <h2 className="text-white font-bold text-[15px] leading-tight mb-1.5">
              {slide.title}
            </h2>
            <p className="text-green-100/85 text-xs leading-relaxed">
              {slide.subtitle}
            </p>
            {slide.cta && (
              <button
                onClick={'ctaKey' in slide && slide.ctaKey === 'highDiscount' ? onHighDiscountClick : onCtaClick}
                className="mt-3 bg-white/20 hover:bg-white/30 active:bg-white/35 text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full transition-colors"
              >
                {slide.cta}
              </button>
            )}
          </div>

          {/* Percentage highlight */}
          {slide.highlight && (
            <div className="shrink-0 text-right ml-1">
              <p className="text-white font-black text-4xl leading-none">{slide.highlight}</p>
              <p className="text-green-300 text-xs font-bold">
                {slide.highlight.includes('%') ? 'OFF' : 'locales'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom: dots + nav */}
      <div className="relative z-10 flex items-center justify-between px-5 pb-4">
        {/* Prev */}
        <button
          onClick={prev}
          className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs flex items-center justify-center transition-colors"
          aria-label="Anterior"
        >
          ‹
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className="w-6 h-6 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs flex items-center justify-center transition-colors"
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

    </div>
  )
}
