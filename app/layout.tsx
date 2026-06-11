import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Beneficios Empleados — Municipalidad de San Isidro',
  description: 'Descuentos y beneficios exclusivos para el personal de la Municipalidad de San Isidro',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f0f7f3]">{children}</body>
    </html>
  )
}
