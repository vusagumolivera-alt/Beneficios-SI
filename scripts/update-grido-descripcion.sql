UPDATE comercios
SET
  descripcion_descuento = 'Por cada kilo comprás, llevás ½ kilo de regalo — o 50% OFF en el segundo kilo',
  condiciones           = 'Elegís entre dos opciones: llevarte medio kilo gratis por cada kilo comprado, o pagar el 50% en el segundo kilo de igual o menor valor. Solo aplica en productos seleccionados.'
WHERE nombre ILIKE '%grido%';
