'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ComercioForm from '@/components/admin/ComercioForm'
import type { Comercio } from '@/lib/supabase'

type Modal =
  | { type: 'add' }
  | { type: 'edit'; comercio: Comercio }
  | null

export default function AdminPage() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()

  async function load() {
    const res = await fetch('/api/admin/comercios')
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    setComercios(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd(data: Partial<Comercio>) {
    const res = await fetch('/api/comercios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { alert('Error al agregar'); return }
    setModal(null)
    load()
  }

  async function handleEdit(id: string, data: Partial<Comercio>) {
    const res = await fetch(`/api/comercios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { alert('Error al editar'); return }
    setModal(null)
    load()
  }

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return
    await fetch(`/api/comercios/${id}`, { method: 'DELETE' })
    load()
  }

  async function togglePublicado(c: Comercio) {
    await fetch(`/api/comercios/${c.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicado: !c.publicado }),
    })
    load()
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const filtered = comercios.filter(c =>
    !search || c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.localidad.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#f0f7f3]">
      {/* Header */}
      <header className="bg-[#1d5c3a] text-white px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">Panel de Administración</h1>
            <p className="text-green-300 text-xs">Beneficios para empleados — San Isidro</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://vercel.com/vusagumolivera-alts-projects/beneficios-si/analytics" target="_blank" rel="noopener noreferrer"
              className="text-xs text-white bg-white/15 hover:bg-white/25 border border-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-semibold">
              📊 Ver métricas
            </a>
            <a href="/" target="_blank"
              className="text-xs text-green-200 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors">
              Ver app ↗
            </a>
            <button onClick={handleLogout}
              className="text-xs text-green-200 hover:text-white">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre o localidad..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-4 py-2.5 text-sm border border-[#d9ede2] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#25a35f]/20 focus:border-[#25a35f]"
          />
          <button
            onClick={() => setModal({ type: 'add' })}
            className="bg-[#1d5c3a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#236b43] transition-colors whitespace-nowrap flex items-center gap-2"
          >
            + Agregar comercio
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Total', value: comercios.length, color: 'text-[#1d5c3a]' },
            { label: 'Publicados', value: comercios.filter(c => c.publicado).length, color: 'text-green-600' },
            { label: 'Nuevos', value: comercios.filter(c => c.nuevo).length, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-[#d9ede2] p-3 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#d9ede2] shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-slate-500">Cargando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#d9ede2] bg-[#f0f7f3]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Comercio</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rubro</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localidad</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Dto.</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} className={`border-b border-[#f0f4f8] hover:bg-[#f0f7f3] transition-colors ${i % 2 === 0 ? '' : 'bg-[#fcfcfd]'}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{c.nombre}</div>
                        {c.nuevo && <span className="text-xs text-amber-600 font-medium">✨ Nuevo</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        <span className="line-clamp-2">{c.rubro}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{c.localidad}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-[#1d5c3a]">{c.descuento}%</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => togglePublicado(c)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                            c.publicado
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {c.publicado ? '● Publicado' : '○ Oculto'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setModal({ type: 'edit', comercio: c })}
                            className="text-xs text-[#25a35f] hover:underline font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.nombre)}
                            className="text-xs text-red-500 hover:underline font-medium"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">No hay comercios</div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-[#d9ede2] flex items-center justify-between">
              <h2 className="font-bold text-[#1d5c3a]">
                {modal.type === 'add' ? 'Agregar comercio' : 'Editar comercio'}
              </h2>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
            </div>
            <div className="p-6">
              <ComercioForm
                initial={modal.type === 'edit' ? modal.comercio : {}}
                onSubmit={modal.type === 'add'
                  ? handleAdd
                  : (data) => handleEdit((modal as { type: 'edit'; comercio: Comercio }).comercio.id, data)}
                onCancel={() => setModal(null)}
                submitLabel={modal.type === 'add' ? 'Agregar' : 'Guardar cambios'}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
