// Cupones con QR para comercios que trabajan con app propia (ej. McDonald's).
// Por ahora la configuración es estática: se asocia al comercio por su "slug"
// (nombre normalizado). Cuando el comercio se carga en el admin con ese nombre,
// la ficha muestra automáticamente la grilla de cupones.

export type Cupon = {
  id: string
  categoria?: string       // "McCombo Mediano", "Menú con Bebida"
  titulo: string           // "Cuarto de Libra c/Queso"
  detalle?: string         // "sabores a elección"
  beneficio: string        // "30% OFF", "2x1", "GRATIS"
  nota?: string            // "Exclusivo en locales con McCafé"
  qr: string               // ruta de la imagen del QR
  link?: string            // URL que codifica el QR (abre la app con el cupón). Opcional hasta tenerla.
  emoji?: string
}

export type CuponesConfig = {
  slug: string
  marca: string
  color: string            // color de marca para acentos
  colorSuave: string       // fondo suave
  vence?: string
  comoUsar: string[]
  appNombre: string
  appLinks?: { ios?: string; android?: string }
  appWeb?: string          // fallback en desktop
  cupones: Cupon[]
}

const MC = '/cupones/mcdonalds'

export const CUPONES: Record<string, CuponesConfig> = {
  mcdonalds: {
    slug: 'mcdonalds',
    marca: "McDonald's",
    color: '#DA291C',
    colorSuave: '#FFF4E0',
    vence: '31/12/2026',
    appNombre: "App de McDonald's",
    appLinks: {
      ios: 'https://apps.apple.com/ar/app/mcdonalds-app/id1119426125',
      android: 'https://play.google.com/store/apps/details?id=com.mcdo.mcdonalds',
    },
    appWeb: 'https://www.mcdonalds.com.ar/',
    comoUsar: [
      'Escaneá el QR con la cámara del celu (o tocalo para abrirlo).',
      "Se abre la App de McDonald's con el cupón ya cargado.",
      'Mostrá el cupón generado en la caja, en el AutoMac o en el kiosco de autopedido.',
    ],
    cupones: [
      { id: 'cuarto-libra',    categoria: 'McCombo Mediano',       titulo: 'Cuarto de Libra c/Queso',                 beneficio: '30% OFF', qr: `${MC}/cuarto-libra.png`,    emoji: '🍔' },
      { id: 'tasty-feat',      categoria: 'McCombo Mediano',       titulo: 'Tasty Feat Cuarto Doble',                 beneficio: '30% OFF', qr: `${MC}/tasty-feat.png`,      emoji: '🍔' },
      { id: 'triple-cajita',   categoria: 'McCombo Mediano',       titulo: 'Triple Hamburguesa c/Queso + Cajita Feliz', beneficio: '20% OFF', qr: `${MC}/triple-cajita.png`, emoji: '🎁' },
      { id: 'ensalada-cesar',  categoria: 'Menú con Bebida',       titulo: 'Ensalada César con pollo Crispy',         beneficio: '20% OFF', qr: `${MC}/ensalada-cesar.png`,  emoji: '🥗' },
      { id: 'papas-2x1',       categoria: 'Papas Fritas',          titulo: 'Papas Fritas Grandes',                    beneficio: '2x1',     qr: `${MC}/papas-2x1.png`,       emoji: '🍟' },
      { id: 'sundae-2x1',      categoria: 'Postres',               titulo: 'Sundaes',  detalle: 'sabores a elección',  beneficio: '2x1',     qr: `${MC}/sundae-2x1.png`,      emoji: '🍨' },
      { id: 'cappuccino-bagel',categoria: 'McCafé',                titulo: 'Cappuccino Espresso + Bagel con Palta',   beneficio: '15% OFF', nota: 'Exclusivo en locales con McCafé', qr: `${MC}/cappuccino-bagel.png`, emoji: '☕' },
      { id: 'cafe-sandwich',   categoria: 'McCafé',                titulo: 'Café Filtrado + Sándwich de Palta, Huevo y Queso', beneficio: '15% OFF', qr: `${MC}/cafe-sandwich.png`, emoji: '🥪' },
      { id: 'tostado-cafe',    categoria: 'McCafé',                titulo: 'Café Filtrado GRATIS', detalle: 'con la compra de un Gran Tostado de Jamón y Queso', beneficio: 'GRATIS', qr: `${MC}/tostado-cafe.png`, emoji: '🥪' },
    ],
  },
}

export function slugify(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
}

/** Devuelve la config de cupones si el comercio tiene una asociada. */
export function getCupones(nombre: string): CuponesConfig | null {
  const s = slugify(nombre)
  for (const key of Object.keys(CUPONES)) {
    if (s.includes(key)) return CUPONES[key]
  }
  return null
}

export function tieneCupones(nombre: string): boolean {
  return getCupones(nombre) !== null
}

/** Link para abrir la app según el dispositivo (App Store / Google Play / web). */
export function appLink(cfg: CuponesConfig): string {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent
    if (/iPhone|iPad|iPod/i.test(ua) && cfg.appLinks?.ios) return cfg.appLinks.ios
    if (/Android/i.test(ua) && cfg.appLinks?.android) return cfg.appLinks.android
  }
  return cfg.appWeb || cfg.appLinks?.android || cfg.appLinks?.ios || '#'
}
