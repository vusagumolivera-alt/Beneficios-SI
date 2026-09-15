#!/usr/bin/env python3
"""
Recorta los QR de las placas de cupones de McDonald's (grilla 3x2) y los guarda
en public/cupones/mcdonalds/<id>.png con el nombre que espera lib/cupones.ts.

Uso:
  python3 scripts/recortar-qr-mcdonalds.py placa1.png placa2.png

Cada placa tiene 6 tiles (3 columnas x 2 filas). El QR está enmarcado en un
borde amarillo; el script busca ese marco dentro de cada tile y recorta.
Si no lo encuentra, guarda el tile completo para recortar a mano.

Orden de los cupones en cada placa (izq→der, arriba→abajo):
  placa1: ensalada-cesar, cappuccino-bagel, cafe-sandwich, cuarto-libra, sundae-2x1, papas-2x1
  placa2: tasty-feat, cuarto-libra, triple-cajita, tostado-cafe, sundae-2x1, papas-2x1
"""
import sys, os
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'cupones', 'mcdonalds')
ORDEN = {
    0: ['ensalada-cesar', 'cappuccino-bagel', 'cafe-sandwich', 'cuarto-libra', 'sundae-2x1', 'papas-2x1'],
    1: ['tasty-feat', 'cuarto-libra', 'triple-cajita', 'tostado-cafe', 'sundae-2x1', 'papas-2x1'],
}

def es_amarillo(p):
    r, g, b = p[:3]
    return r > 200 and g > 150 and b < 120 and (r - b) > 90

def buscar_marco(tile):
    """Bounding box del marco amarillo del QR dentro del tile (solo mitad superior)."""
    w, h = tile.size
    px = tile.convert('RGB').load()
    xs, ys = [], []
    for y in range(0, int(h * 0.65), 2):
        for x in range(0, w, 2):
            if es_amarillo(px[x, y]):
                xs.append(x); ys.append(y)
    if len(xs) < 200:
        return None
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    # descartar hallazgos que no sean cuadrados (ej. fondo amarillo del combo)
    bw, bh = x1 - x0, y1 - y0
    if bw < 40 or bh < 40 or abs(bw - bh) > max(bw, bh) * 0.25:
        return None
    m = int(max(bw, bh) * 0.04)
    return (max(0, x0 - m), max(0, y0 - m), min(w, x1 + m), min(h, y1 + m))

def main(paths):
    os.makedirs(OUT, exist_ok=True)
    for i, path in enumerate(paths):
        im = Image.open(path).convert('RGB')
        W, H = im.size
        # zona de la grilla: descartamos el pie ("Descubrí más promociones") ~ 16% inferior
        gh = int(H * 0.84)
        cols, rows = 3, 2
        tw, th = W / cols, gh / rows
        nombres = ORDEN.get(i, [f'placa{i+1}-{k}' for k in range(6)])
        for k in range(6):
            c, r = k % cols, k // cols
            tile = im.crop((int(c * tw), int(r * th), int((c + 1) * tw), int((r + 1) * th)))
            box = buscar_marco(tile)
            nombre = nombres[k]
            dest = os.path.join(OUT, f'{nombre}.png')
            if box:
                qr = tile.crop(box)
                # margen blanco alrededor para que escanee bien
                s = max(qr.size)
                canvas = Image.new('RGB', (int(s * 1.12), int(s * 1.12)), 'white')
                canvas.paste(qr, ((canvas.width - qr.width) // 2, (canvas.height - qr.height) // 2))
                canvas = canvas.resize((600, 600), Image.LANCZOS)
                canvas.save(dest)
                print(f'OK   {nombre}  <- {os.path.basename(path)} tile {k+1}')
            else:
                tile.save(os.path.join(OUT, f'_revisar-{nombre}.png'))
                print(f'?    {nombre}  no encontré el marco, guardé el tile completo como _revisar-{nombre}.png')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    main(sys.argv[1:])
