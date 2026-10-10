import { useEffect, useRef } from 'react'
import { CATEGORIES, MENU } from '../../domain/menu'
import { tableOrders } from '../../domain/orderStore'
import { formatPrice } from '../../domain/pricing'
import { useCart } from '../../state/CartContext'
import { useOrders } from '../../state/OrdersContext'
import { DishImage, Logo } from './shared'

export function MenuScreen({
  categoryId,
  onCategory,
  onSelect,
  onCart,
  onOrders,
}: {
  categoryId: string
  onCategory: (id: string) => void
  onSelect: (itemId: string) => void
  onCart: () => void
  onOrders: () => void
}) {
  const { table, count, total } = useCart()
  const { orders, billRequests } = useOrders()
  const mine = tableOrders(orders, table, billRequests)
  const activeOrders = mine.filter(o => o.status !== 'entregado').length
  const hasReady = mine.some(o => o.status === 'listo')
  // Recomendación 2 de la evaluación: el estado del pedido visible en el menú.
  const tracked = mine.filter(o => o.status !== 'entregado')
  const STATUS_TEXT = {
    en_cola: 'Recibido en cocina, en cola',
    en_preparacion: 'En preparación',
    listo: '¡Listo! Un mesero lo lleva a tu mesa',
    entregado: 'Entregado',
  } as const
  const STEP = { en_cola: 1, en_preparacion: 2, listo: 3, entregado: 4 } as const
  const items = MENU.filter(i => i.categoryId === categoryId)
  const category = CATEGORIES.find(c => c.id === categoryId)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gridRef.current?.scrollTo({ top: 0 })
  }, [categoryId])

  return (
    <div className="k-screen">
      <header className="k-header">
        <Logo />
        <div className="k-table-pill">
          <span className="k-eyebrow">Tu mesa</span>
          <strong>{table}</strong>
        </div>
        <button type="button" className={`k-orders-btn ${hasReady ? 'is-ready' : ''}`} onClick={onOrders}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Mis pedidos</span>
          {activeOrders > 0 && <span className="k-orders-count">{activeOrders}</span>}
        </button>
        <button type="button" className={`k-cart-btn ${count ? 'has-items' : ''}`} onClick={onCart}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M3 4h2l2.4 11.2a1 1 0 001 .8h9.2a1 1 0 001-.8L20 8H6.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" />
          </svg>
          <span>Carrito</span>
          {count > 0 && (
            <>
              <span className="k-cart-count">{count}</span>
              <span className="k-cart-total">{formatPrice(total)}</span>
            </>
          )}
        </button>
      </header>

      <nav className="k-tabs scrollbar-hide" aria-label="Categorías">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            type="button"
            className={`k-tab ${c.id === categoryId ? 'is-active' : ''}`}
            onClick={() => onCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      {tracked.length > 0 && (
        <button type="button" className={`k-statusbar ${hasReady ? 'is-ready' : ''}`} onClick={onOrders}>
          {tracked.slice(0, 2).map(o => (
            <span key={o.id} className="k-statusbar-item">
              <span className="k-statusbar-id">Pedido #{o.id}</span>
              <span className="k-statusbar-dots" aria-hidden>
                {[1, 2, 3, 4].map(n => <i key={n} className={n <= STEP[o.status] ? 'is-on' : ''} />)}
              </span>
              <span className="k-statusbar-text">{STATUS_TEXT[o.status]}</span>
            </span>
          ))}
          <span className="k-statusbar-link">Ver detalle →</span>
        </button>
      )}

      <main className="k-menu-scroll" ref={gridRef}>
        <div className="k-section-head">
          <h2>{category?.label}</h2>
          <span>{items.length} opciones</span>
        </div>
        <div className="k-grid">
          {items.map(item => (
            <button key={item.id} type="button" className="k-card" onClick={() => onSelect(item.id)}>
              <DishImage src={item.image} name={item.name} className="k-card-img" />
              <div className="k-card-body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="k-card-foot">
                  <span className="k-price">{formatPrice(item.price)}</span>
                  <span className="k-card-add" aria-hidden>+</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
