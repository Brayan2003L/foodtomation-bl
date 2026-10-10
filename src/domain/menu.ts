import type { Category, MenuItem } from './types'

// Fotografías de Unsplash (licencia libre), incluidas en /public/img para
// que el prototipo no dependa de un servicio externo.
const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}.jpg`

export const CATEGORIES: Category[] = [
  { id: 'entradas', label: 'Entradas' },
  { id: 'fuertes', label: 'Platos fuertes' },
  { id: 'pastas', label: 'Pastas y pizzas' },
  { id: 'postres', label: 'Postres' },
  { id: 'bebidas', label: 'Bebidas' },
]

const COMMON_ALLERGY = { id: 'sin-gluten', label: 'Sin gluten' }

export const MENU: MenuItem[] = [
  // ── Entradas ───────────────────────────────────────────────
  {
    id: 'ensalada-casa', categoryId: 'entradas', station: 'frio',
    name: 'Ensalada de la casa',
    description: 'Hojas verdes, aguacate, quinoa, tomate cherry y vinagreta de maracuyá.',
    price: 14, image: img('ensalada-casa'),
    modifiers: [
      { id: 'sin-cebolla', label: 'Sin cebolla' },
      { id: 'aderezo-aparte', label: 'Aderezo aparte' },
      { id: 'add-pollo', label: 'Agregar pollo', surcharge: 5 },
    ],
  },
  {
    id: 'brochetas', categoryId: 'entradas', station: 'caliente',
    name: 'Brochetas a la parrilla',
    description: 'Res y pimentón asados al carbón con chimichurri de la casa.',
    price: 16, image: img('brochetas'),
    modifiers: [
      { id: 'sin-picante', label: 'Sin picante' },
      { id: 'salsa-aparte', label: 'Salsa aparte' },
      { id: 'extra-chimi', label: 'Extra chimichurri', surcharge: 2 },
    ],
  },
  {
    id: 'tartar-atun', categoryId: 'entradas', station: 'frio',
    name: 'Tartar de atún',
    description: 'Atún fresco, aguacate, ajonjolí tostado y crocantes de plátano.',
    price: 18,
    modifiers: [
      { id: 'sin-ajonjoli', label: 'Sin ajonjolí' },
      { id: 'sin-picante', label: 'Sin picante' },
    ],
  },

  // ── Platos fuertes ─────────────────────────────────────────
  {
    id: 'lomo-res', categoryId: 'fuertes', station: 'caliente',
    name: 'Lomo de res a la parrilla',
    description: 'Lomo fino en tajadas, ensalada de hojas verdes, chiles frescos y salsa de la casa.',
    price: 34, image: img('lomo-res'),
    modifiers: [
      { id: 'termino-medio', label: 'Término medio' },
      { id: 'bien-cocido', label: 'Bien cocido' },
      { id: 'sin-picante', label: 'Sin picante' },
      { id: 'salsa-aparte', label: 'Salsa aparte' },
      COMMON_ALLERGY,
      { id: 'add-papas', label: 'Agregar papas criollas', surcharge: 4 },
    ],
  },
  {
    id: 'costillas-bbq', categoryId: 'fuertes', station: 'caliente',
    name: 'Costillas BBQ',
    description: 'Costillas de cerdo en cocción lenta, glaseadas con salsa BBQ, tomate fresco y papas a la francesa.',
    price: 32, image: img('costillas-bbq'),
    modifiers: [
      { id: 'salsa-aparte', label: 'Salsa BBQ aparte' },
      { id: 'sin-papas', label: 'Cambiar papas por ensalada' },
      { id: 'extra-salsa', label: 'Extra salsa', surcharge: 2 },
    ],
  },
  {
    id: 'hamburguesa', categoryId: 'fuertes', station: 'caliente',
    name: 'Hamburguesa de la casa',
    description: 'Carne angus de 200 g, queso cheddar madurado, tocineta y papas rústicas.',
    price: 22, image: img('hamburguesa'),
    modifiers: [
      { id: 'sin-cebolla', label: 'Sin cebolla' },
      { id: 'sin-tocineta', label: 'Sin tocineta' },
      { id: 'bien-cocido', label: 'Carne bien cocida' },
      COMMON_ALLERGY,
      { id: 'doble-carne', label: 'Doble carne', surcharge: 7 },
    ],
  },
  {
    id: 'bowl-pollo', categoryId: 'fuertes', station: 'frio',
    name: 'Bowl de pollo',
    description: 'Pollo a la plancha, arroz integral, garbanzos, vegetales frescos y hummus.',
    price: 19, image: img('bowl-pollo'),
    modifiers: [
      { id: 'sin-hummus', label: 'Sin hummus' },
      { id: 'vegano', label: 'Versión vegana (tofu)' },
      { id: 'extra-proteina', label: 'Proteína extra', surcharge: 5 },
    ],
  },

  // ── Pastas y pizzas ────────────────────────────────────────
  {
    id: 'pizza-hawaiana', categoryId: 'pastas', station: 'caliente',
    name: 'Pizza hawaiana',
    description: 'Masa madre, salsa de tomate, mozzarella, jamón, piña asada y cebolla morada.',
    price: 21, image: img('pizza-hawaiana'),
    modifiers: [
      { id: 'sin-pina', label: 'Sin piña' },
      { id: 'sin-cebolla', label: 'Sin cebolla' },
      { id: 'extra-queso', label: 'Extra queso', surcharge: 3 },
      COMMON_ALLERGY,
    ],
  },
  {
    id: 'pasta-pesto', categoryId: 'pastas', station: 'caliente',
    name: 'Pasta al pesto',
    description: 'Farfalle con pesto de albahaca, tomate cherry y hojas de rúgula.',
    price: 20, image: img('pasta-pesto'),
    modifiers: [
      { id: 'sin-queso', label: 'Sin queso' },
      COMMON_ALLERGY,
      { id: 'add-camarones', label: 'Agregar camarones', surcharge: 8 },
    ],
  },

  // ── Postres ────────────────────────────────────────────────
  {
    id: 'pancakes', categoryId: 'postres', station: 'frio',
    name: 'Pancakes de la casa',
    description: 'Torre de pancakes, frutos rojos, miel de maple y mantequilla batida.',
    price: 12, image: img('pancakes'),
    modifiers: [
      { id: 'sin-mantequilla', label: 'Sin mantequilla' },
      { id: 'add-helado', label: 'Agregar helado', surcharge: 3 },
    ],
  },
  {
    id: 'tres-leches', categoryId: 'postres', station: 'frio',
    name: 'Torta tres leches',
    description: 'Bizcocho húmedo, merengue flameado y canela.',
    price: 10,
    modifiers: [{ id: 'sin-canela', label: 'Sin canela' }],
  },

  // ── Bebidas ────────────────────────────────────────────────
  {
    id: 'limonada-coco', categoryId: 'bebidas', station: 'barra',
    name: 'Limonada de coco',
    description: 'Limón fresco, crema de coco y hielo frappé.',
    price: 7,
    modifiers: [
      { id: 'sin-azucar', label: 'Sin azúcar' },
      { id: 'sin-hielo', label: 'Sin hielo' },
    ],
  },
  {
    id: 'cafe', categoryId: 'bebidas', station: 'barra',
    name: 'Café de origen',
    description: 'Café colombiano de especialidad, preparado en método filtrado.',
    price: 5,
    modifiers: [
      { id: 'leche-almendra', label: 'Con leche de almendras', surcharge: 1 },
      { id: 'sin-azucar', label: 'Sin azúcar' },
    ],
  },
  {
    id: 'jugo-natural', categoryId: 'bebidas', station: 'barra',
    name: 'Jugo natural',
    description: 'Fruta de temporada: mango, lulo o mora. En agua o en leche.',
    price: 6,
    modifiers: [
      { id: 'en-leche', label: 'En leche' },
      { id: 'sin-azucar', label: 'Sin azúcar' },
    ],
  },
]

export function findItem(id: string): MenuItem | undefined {
  return MENU.find(i => i.id === id)
}
