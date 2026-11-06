'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
  from?: 'bottom' | 'left'
  className?: string
}

export default function Reveal({ children, delay = 0, from = 'bottom', className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true); setDone(true); return
    }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.05, rootMargin: '0px 0px -16px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const animClass = from === 'left' ? 'animate-slideInLeft' : 'animate-revealUp'

  return (
    <div
      ref={ref}
      className={`${done ? '' : visible ? animClass : 'opacity-0'} ${className}`}
      style={visible && !done ? { animationDelay: `${delay}ms` } : undefined}
      onAnimationEnd={() => setDone(true)}
    >
      {children}
    </div>
  )
}
