'use client'

import { useEffect, useState, useCallback } from 'react'
import QRCode from 'react-qr-code'
import { X, Storefront, Users, ArrowRight, CheckCircle, MapPin } from '@phosphor-icons/react'

const TESI_URL = 'https://tesi.sanisidro.gob.ar/tramites/nuevo/fortalecimiento_comercio_local'

const BENEFICIOS = [
  { icon: Users,     text: 'Tu comercio llega a toda la comunidad municipal de San Isidro' },
  { icon: Storefront, text: 'Clientes nuevos sin costo de publicidad ni comisiones' },
  { icon: CheckCircle, text: 'Simple y gratuito — el municipio te acompaña en el proceso' },
  { icon: MapPin,    text: 'Solo para comercios del Partido de San Isidro' },
]

type Props = { onClose: () => void }

export default function SumateModal({ onClose }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const close = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 340)
  }, [onClose])

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-[60] transition-opacity duration-300"
        style={{ background: 'rgba(0,0,0,.5)', opacity: visible ? 1 : 0 }}
        onClick={close}
      />

      {/* sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[61] bg-white rounded-t-[24px] shadow-2xl transition-transform duration-[380ms] max-h-[92vh] overflow-y-auto"
        style={{
          transitionTimingFunction: 'cubic-bezier(.32,.72,0,1)',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* handle */}
        <div className="w-9 h-1 rounded-full bg-[#dde8e1] mx-auto mt-3 mb-1 shrink-0" />

        {/* header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-[#25a35f] mb-1">Programa de Beneficios</p>
            <h2 className="text-[22px] font-black text-[#14201a] leading-tight tracking-tight">
              Sumá un comercio<br />a los beneficios
            </h2>
          </div>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full bg-[#f0f7f3] flex items-center justify-center shrink-0 mt-0.5"
          >
            <X size={15} weight="bold" className="text-[#4e5d55]" />
          </button>
        </div>

        {/* intro */}
        <p className="px-5 text-[13.5px] text-[#4e5d55] leading-relaxed pb-4 border-b border-[#edf3ef]">
          ¿Tenés un comercio propio o conocés a alguien que tiene uno en San Isidro?
          Contales que pueden sumarse y llegar a toda la comunidad municipal.
        </p>

        {/* beneficios */}
        <div className="px-5 pt-4 pb-5 flex flex-col gap-3 border-b border-[#edf3ef]">
          {BENEFICIOS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#e9f4ee] flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={15} weight="fill" className="text-[#1d5c3a]" />
              </div>
              <p className="text-[13px] text-[#2a3d31] leading-snug pt-1.5">{text}</p>
            </div>
          ))}
        </div>

        {/* QR */}
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-bold tracking-widest uppercase text-[#4e5d55] mb-4">
            Escaneá para registrar el comercio
          </p>
          <div className="flex gap-4 items-center">
            <div className="bg-white border-2 border-[#dde8e1] rounded-2xl p-3 shrink-0">
              <QRCode
                value={TESI_URL}
                size={120}
                fgColor="#1d5c3a"
                bgColor="#ffffff"
                level="M"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#4e5d55] leading-relaxed mb-3">
                Apuntá la cámara del celular al código o tocá el botón para abrir el formulario.
              </p>
              <a
                href={TESI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#1d5c3a] text-white text-[12.5px] font-bold px-4 py-2.5 rounded-[13px] no-underline"
              >
                Ir al formulario
                <ArrowRight size={13} weight="bold" />
              </a>
            </div>
          </div>
        </div>

        {/* footer nota */}
        <div className="mx-5 mb-6 mt-3 bg-[#f0f7f3] rounded-2xl px-4 py-3">
          <p className="text-[11.5px] text-[#4e5d55] leading-relaxed">
            <span className="font-semibold text-[#1d5c3a]">Requisito:</span> el comercio debe estar ubicado dentro del Partido de San Isidro. La adhesión es gratuita y el municipio acompaña el proceso.
          </p>
        </div>
      </div>
    </>
  )
}
