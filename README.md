# Inblüm Studio · sitio del estudio

Una sola página, estática, sin paso de compilación. Se abre con doble clic en
`index.html` y se publica subiendo la carpeta tal cual. Vive en GitHub Pages
(rama `main`, dominio en `CNAME`): cada commit que se sube a `main` se publica.

## El diseño: una calca de Homer

El sitio calca el sistema de [homer.com](https://www.homer.com) con el contenido
del estudio. Las medidas y los colores se tomaron de su sitio, a 1418px de ancho
y en teléfono:

- **Colores.** Blanco y negro; `#F9F9F9` de fondo de cada pieza; `#ECE9E9` en
  las barras de las tarjetas, las reglas y los títulos apagados; `#F2F1F0` en el
  panel, la caja de abajo y el pie; `#808080` en las etiquetas diminutas; el
  verde `#00AF66` de su botón de compra y el amarillo `#FFCD00` de "Inquire".
  Todo en `css/tokens.css`.
- **Los colores de la marca** van donde Homer pone los de cada acabado: en las
  dos franjas de cada tarjeta, en pares de un color y su luz (fucsia y pétalo,
  azul cielo y celeste, polen y limón, olivo y salvia), medidos sobre el
  recuadro de flores del logotipo.
- **Tipografía.** Homer usa **Unica77 LL** (de Lineto) en tres cortes: Thin
  para los títulos, Regular para el texto y Black para las etiquetas. Es de
  licencia y no se puede tomar de su sitio, así que aquí va lo más parecido:
  - los títulos y el texto en **Helvetica Neue**, que ya viene en Mac, iPhone e
    iPad (su Thin es casi idéntica a la de Unica77, en trazo y en ancho);
  - las etiquetas en **Inter Tight Black**, libre, de Google Fonts (Helvetica no
    tiene un corte tan negro);
  - fuera de los equipos de Apple, todo en Inter Tight.

  Las tres pilas están en `css/tokens.css` (`--f-fina`, `--f-texto`,
  `--f-negra`). Si el estudio compra la licencia web de Unica77 en
  [lineto.com](https://lineto.com), pon los `.woff2` (Thin, Regular y Black) en
  `assets/fuentes/`, declara la familia `"Unica77 LL"` con `@font-face` al
  principio de `css/tokens.css` (Thin con `font-weight: 200`, Regular con 400 y
  Black con 900) y ponla primera en las tres pilas.
- **Escala.** Títulos de 72px en el corte fino, interlineado 1.15 y -3% de
  espaciado (30px en teléfono); texto de 18px; etiquetas en negra de 14px (18px
  en la barra y el menú); 12px en la barra de abajo; 10px en el pie y el panel;
  6px en las etiquetas de cada fila.
- **Retícula.** Margen de 56px (24px en teléfono). Tarjetas de 397px con 46px
  entre ellas (300px con 24px en teléfono).

## Las piezas del sistema

- **La barra de arriba** (`.cabeza`): el logotipo a la izquierda (a 33px de
  alto, como el de Homer) y tres palabras en negra de 18px a la derecha, con
  79px entre ellas: "Menú" (abre el panel), "Trabajo" y "Hablemos". En teléfono
  quedan dos. En Homer la barra se va con la página; aquí se queda fija arriba,
  sobre blanco, porque así se pidió antes.
- **Los títulos** (`.titulo`): en gris hasta que su lista cruza el centro de la
  pantalla, entonces en negro (`js/app.js`, sección 6).
- **Las tarjetas** (`.carta`), en un carrusel que se desliza de lado con el
  trackpad, arrastrando con el ratón o con las flechas del teclado. Seis filas:
  la barra gris de 42px con el nombre en negra y el triángulo del selector; las
  dos franjas de 7px del par de colores; la pieza entera al centro de un
  cuadrado gris claro (nunca se recorta); dos filas de 42px; y el botón de color
  de 42px con el texto arriba a la izquierda, sin relleno.
- **Las reglas** (`.reglas`): a todo lo ancho de cada lista, líneas de 1px
  justo en los bordes de las filas de las tarjetas, con su etiqueta de 6px en
  mayúsculas y gris a la derecha.
- **Los botones** (`.barra-boton`): verde (el principal), amarillo (cotizar) y
  gris. Al pasar el cursor se vuelven negros.
- **El pie**: gris, el logotipo chico al centro y cuatro columnas de 10px.
- **La barra fija de abajo** (`.fijo`): la caja gris de 341px a la izquierda
  ("All" en Homer, "Todo" aquí) abre el panel, y al centro va una línea en 12px.
- **El panel** (`#panel`, un `<dialog>`): una columna gris de 340px a la
  derecha, sobre un velo negro al 40%. Lleva "Todo", las secciones en negra y
  mayúsculas (debajo de Trabajo, una muestra de cada proyecto; debajo de
  Servicios, el color de cada área) y, al final, filas en 10px con el correo, el
  teléfono y la primera red. Se cierra con la X, con Esc, al elegir una sección o
  tocando el velo.

## Secciones, en orden

| Sección | Qué hace |
|---|---|
| Portada | Mucho blanco arriba y tres imágenes pegadas a la misma altura (retrato, regadera y mano), con margen, como la vitrina de Homer |
| Entrada | El título fino con la frase del estudio, el texto y dos botones: amarillo ("Hablemos") y gris ("Ver servicios") |
| Trabajo | Una lista por proyecto: su nombre en título fino y un carrusel con una tarjeta por pieza (un servicio del proyecto en la barra, la pieza, su número, el año y el botón verde) |
| Estudio | El manifiesto en un título fino que pasa del gris al negro palabra por palabra al bajar; las palabras clave se marcan en amarillo al terminar. Debajo, la nota en dos columnas y la ciudad en negra de 24px, a la derecha |
| Servicios | Las ocho áreas en el mismo carrusel: la frase y lo que incluye en el cuadrado, y el botón amarillo "Cotizar", que lleva al formulario con el área ya elegida |
| Proceso | Los cuatro tiempos como filas entre reglas: el nombre en negra, el texto y la etiqueta a la derecha |
| Contacto | Los datos y el formulario, en filas; el botón es la barra verde |
| Pie | Gris, con el logotipo chico y cuatro columnas |

## Estructura

```
inblum-web/
├── index.html
├── CNAME
├── css/
│   ├── tokens.css     colores, pares de colores de la marca, tipografía, escala,
│   │                  medidas y capas
│   └── styles.css     el sitio, por secciones numeradas
├── js/
│   ├── data.js        ← EDITA AQUÍ: contacto, servicios, proyectos y pasos
│   └── app.js         tarjetas de Trabajo y Servicios, filas del proceso, datos,
│                      panel, títulos que se encienden, manifiesto, carrusel y
│                      formulario (sin librerías)
└── assets/
    ├── apertura/      las imágenes de la portada y el recuadro de flores
    ├── work/          las piezas reales de Trabajo
    ├── obra/          texturas de relleno
    ├── poster.png     imagen para compartir el enlace (og:image)
    └── favicon.png
```

`assets/wordmark.png`, `tile*.png` y `campo-*.png` son de versiones anteriores y
hoy no se usan. `FRASES`, en `data.js`, tampoco: era el titular que rotaba en
la portada anterior.

## El logotipo

El logotipo completo (el recuadro de flores y "INBLÜM STUDIO" en dos líneas) es
un SVG que está una sola vez en `index.html` (`<symbol id="logo">`), y la barra
de arriba y el pie lo usan. El nombre está vectorizado del logotipo original;
el recuadro es `assets/apertura/logo-flor.jpg`, con sus esquinas redondeadas.

## La portada

Tres imágenes de `assets/apertura/`, pegadas y a la misma altura: cada columna
mide lo que su proporción (`grid-template-columns` en `.portada__imagenes`). En
teléfono, el retrato va arriba a todo lo ancho y las otras dos debajo. Para
cambiar una, reemplaza el archivo con la misma proporción, o cambia su
proporción en `css/styles.css` (sección 4):

| Archivo | Proporción |
|---|---|
| `retrato.jpg` | 4:5 (1040 × 1300 px, recortado centrado en el libro) |
| `regadera.jpg` | 9:16 (900 × 1600 px) |
| `mano.jpg` | 1000 × 1252 px |

El `src` del retrato lleva un `?v=`: súbelo cada vez que cambies el archivo,
para que nadie vea la copia vieja guardada en el navegador. Los textos
alternativos están en `index.html`.

## Qué falta por llenar

### 1. Datos de contacto
En `js/data.js`, hasta arriba, marcados con `PENDIENTE`: correo, teléfono,
ciudad y redes. Salen en el contacto, en el pie, en el panel y en el manifiesto
(la ciudad).

### 2. Proyectos
También en `js/data.js`, en `PIEZAS`. Casi todo sigue siendo de relleno
(texturas de `assets/obra` y fotos de `picsum.photos`). La excepción es
"Identidad y sistema gráfico": sus piezas ya son ilustraciones reales en
`assets/work/` (prefijo `graf-`). Cada pieza (`celdas`) es una tarjeta: se ve
entera al centro del cuadrado, así que cualquier proporción sirve. La barra de
cada tarjeta lleva uno de los `servicios` del proyecto, en orden. Si cambias un
archivo de `assets/work/` sin cambiarle el nombre, súbele el `?v=` de su ruta en
`data.js`. Para publicar trabajo real:

1. Copia las imágenes a `assets/work/`.
2. Pon cada ruta en `img`, con su `alt`, y cambia `titulo`, `anio` y
   `servicios`.

```js
{ titulo: 'Campaña Primavera', anio: 2026,
  servicios: ['Branding / identidad de marca', 'Diseño gráfico'],
  celdas: [
    { img: 'assets/work/primavera-1.jpg', alt: 'Cartel pegado en la calle' },
    { img: 'assets/work/primavera-2.jpg', alt: 'Retrato de la campaña' }
  ] }
```

(`alto` y `dispositivo`, que usaba la galería anterior, ya no hacen nada.)

### 3. Recibir los mensajes del formulario
Hoy el formulario **abre el correo del visitante** con el mensaje ya escrito.
Para que te llegue directo a tu bandeja:

1. Crea un formulario gratuito en [formspree.io](https://formspree.io).
2. En `js/app.js`, busca el comentario `Sin servidor:` y sustituye el bloque del
   `mailto` por el `fetch` que está ahí documentado, con tu ID.

## Una nota sobre el catálogo

El sitio reproduce íntegro el `Catalogo_de_Servicios.docx`. La octava área,
*Marketing digital*, aparece en el documento con un solo renglón. Si ahí se
quedó corto, agrega los renglones que falten en `js/data.js` y la tarjeta crece
sola.

## Verlo en local

Doble clic en `index.html` funciona para todo. Si prefieres servirlo por HTTP,
desde esta carpeta:

```bash
python3 -m http.server 4180
```

Luego abre <http://localhost:4180>.

Truco útil: `http://localhost:4180/?revelado=todo` muestra todos los títulos en
negro y el manifiesto encendido. Sirve para revisarla o capturarla.

Si editas `css/` o `js/` y no ves el cambio, recarga forzando caché
(Cmd+Shift+R). Al publicar una versión nueva, sube el número de `?v=` en las
cuatro etiquetas `<link>` y `<script>` de `index.html`.

## Accesibilidad y rendimiento

- Sin librerías: la página sólo carga Inter Tight de Google Fonts.
- `prefers-reduced-motion` apaga las transiciones y la entrada del panel.
- Navegación por teclado: enlace para saltar al contenido, foco visible, los
  carruseles se recorren con las flechas y el panel atrapa el foco y se cierra
  con Esc.
- El formulario valida en español, explica qué falta campo por campo y lleva el
  foco al primer error.
- El logotipo lleva su nombre accesible ("Inblüm Studio") y las imágenes su
  texto alternativo. Las etiquetas de 6px de las reglas son decorativas
  (`aria-hidden`): lo que dicen ya está en cada fila.
