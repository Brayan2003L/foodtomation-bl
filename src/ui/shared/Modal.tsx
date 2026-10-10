// Ventana modal de confirmación, reutilizable en todas las vistas.
// Patrón de diseño: "Modal dialog" — bloquea el fondo para que una
// acción irreversible (enviar un pedido, cobrar una cuenta) se confirme
// de forma explícita.
import { useEffect, type ReactNode } from 'react'

export function Modal({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  tone = 'kiosk',
  danger,
}: {
  open: boolean
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  tone?: 'kiosk' | 'caja'
  danger?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className={`modal-backdrop modal-${tone}`} onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
      >
        <h2 id="modal-title" className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button type="button" className="modal-btn modal-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={`modal-btn modal-confirm ${danger ? 'is-danger' : ''}`} onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
