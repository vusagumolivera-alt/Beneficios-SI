import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Beneficios Empleados — Municipalidad de San Isidro',
  description: 'Descuentos y beneficios exclusivos para el personal de la Municipalidad de San Isidro',
}

export const viewport: Viewport = {
  themeColor: '#1d5c3a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="min-h-screen bg-[#f4f7f5]">{children}<Analytics /></body>
    </html>
  )
}
