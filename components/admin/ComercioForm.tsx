'use client'

import { useState } from 'react'
import type { Comercio } from '@/lib/supabase'

type Props = {
  initial?: Partial<Comercio>
  onSubmit: (data: Partial<Comercio>) => Promise<void>
  onCancel: () => void
  submitLabel: string
}

const LOCALIDADES = ['San Isidro', 'Martínez', 'Boulogne', 'Beccar', 'Acassuso', 'Otra']

export default function ComercioForm({ initial = {}, onSubmit, onCancel, submitLabel }: Props) {
  const [form, setForm] = useState({
    nombre: initial.nombre || '',
    descripcion_descuento: initial.descripcion_descuento || '',
    descuento: initial.descuento ?? 10,
    rubro: initial.rubro || '',
    direccion: initial.direccion || '',
    localidad: initial.localidad || 'San Isidro',
    dias_validos: initial.dias_validos || '',
    medios_pago: initial.medios_pago || '',
    condiciones: initial.condiciones || '',
    publicado: initial.publicado ?? true,
    nuevo: initial.nuevo ?? true,
  })
  const [loading, setLoading] = useState(false)

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const setNum = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: parseInt(e.target.value) || 0 }))

  const setBool = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.checked }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(form)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-3 py-2 text-sm border border-[#d9ede2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f]"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del comercio *</label>
          <input required value={form.nombre} onChange={set('nombre')} className={inputCls}
            placeholder="Ej: M&A Beauty Spa" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Descuento (%) *</label>
          <input required type="number" min={1} max={100} value={form.descuento} onChange={setNum('descuento')} className={inputCls} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción del descuento *</label>
          <input required value={form.descripcion_descuento} onChange={set('descripcion_descuento')} className={inputCls}
            placeholder="Ej: 10% OFF en manicura" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Rubro *</label>
          <input required value={form.rubro} onChange={set('rubro')} className={inputCls}
            placeholder="Ej: Peluquería y salón de belleza" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Dirección *</label>
          <input required value={form.direccion} onChange={set('direccion')} className={inputCls}
            placeholder="Ej: Juan Segundo Fernández 1267" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Localidad *</label>
          <select required value={form.localidad} onChange={set('localidad')} className={inputCls}>
            {LOCALIDADES.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Días válidos</label>
          <input value={form.dias_validos} onChange={set('dias_validos')} className={inputCls}
            placeholder="Ej: Lunes a sábado" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Medios de pago</label>
          <input value={form.medios_pago} onChange={set('medios_pago')} className={inputCls}
            placeholder="Ej: Efectivo y transferencia" />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Condiciones</label>
          <textarea value={form.condiciones} onChange={set('condiciones')} rows={3} className={`${inputCls} resize-none`}
            placeholder="Describí las condiciones del beneficio..." />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.publicado} onChange={setBool('publicado')}
              className="w-4 h-4 rounded accent-[#25a35f]" />
            <span className="text-sm text-slate-700">Publicado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.nuevo} onChange={setBool('nuevo')}
              className="w-4 h-4 rounded accent-amber-500" />
            <span className="text-sm text-slate-700">Marcar como nuevo</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-[#1d5c3a] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#236b43] disabled:opacity-50 transition-colors">
          {loading ? 'Guardando...' : submitLabel}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
