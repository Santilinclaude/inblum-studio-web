# Inblüm Studio · sitio del estudio

Una sola página, estática, sin paso de compilación. Se abre con doble clic en
`index.html` y se publica subiendo la carpeta tal cual. Vive en GitHub Pages
(rama `main`, dominio en `CNAME`): cada commit que se sube a `main` se publica.

## El diseño: un solo sistema, sacado de la marca

Todo el sitio habla el mismo idioma que la primera página (la dirección
**Beings**), con los colores del logotipo:

- **Tinta y papel.** La tinta es cacao (`#1B0800`), nunca negro puro. El lienzo
  es papel blanco en la Apertura y papel leche (`#FFF4EC`) en el resto.
- **Los colores de la marca**, medidos sobre el recuadro de flores del logotipo
  (`assets/apertura/logo-flor.jpg`): el fucsia de las flores (`--flor`, el
  acento principal: la línea de avance, los botones al pasar el cursor, el
  campo del manifiesto), el azul del cielo (`--cielo`), el amarillo del polen
  (`--polen`) y el verde olivo (`--hoja`). Todos en `css/tokens.css`, con su
  contraste anotado.
- **Campos de color, en este orden:** Apertura (blanco que se lava al azul) →
  panel en degradado azul → amarillo → Trabajo (leche) → Estudio (rosa →
  naranja) → Servicios y Proceso (leche) → Contacto (verde → lima) → pie
  (cacao).
- **La tipografía de Homer**, en su mezcla de tres cortes: lo grande (titulares
  de sección, manifiesto, nombres de áreas, pasos y proyectos, el titular de la
  portada) en un corte finísimo; el texto en regular; y lo chico (etiquetas,
  barra, botones, números) en negra. Homer usa Unica77 LL, que es de licencia;
  aquí va Helvetica Neue Thin para lo fino (casi idéntica, y ya viene en Mac,
  iPhone e iPad) e Inter Tight Black para lo negro; fuera de Apple, todo en
  Inter Tight. Ver "Tipografía y librerías".
- **Duotono.** La mezcla de dos tonos de Homer (sus acabados se llaman
  "Cadmium Red/Infrared"): dos franjas planas de 7px con 9px entre ellas, un
  color de la marca y su luz (`.duo`, con `.duo--flor`, `--cielo`, `--polen`,
  `--hoja`). Es la línea de la cabecera de cada sección (fucsia en Trabajo y
  Contacto, polen en Estudio, cielo en Servicios, olivo en Proceso), va bajo
  cada proyecto, junto al número de cada área, arriba de cada tiempo y en la
  ficha del retrato. Al asomar, las dos franjas se dibujan de izquierda a
  derecha, una tras otra.
- **Formas del logotipo.** Las imágenes llevan el radio del recuadro de flores
  (`--r-tile`) y los botones son píldoras (`.boton`).
- **Cabecera de sección** (`.cabecera`): el duotono, una fila de 12px (número,
  nombre y una nota), el titular enorme, que entra palabra por palabra, y una
  entrada corta recargada a la derecha. Se repite igual en Trabajo, Servicios,
  Proceso y Contacto; el manifiesto usa sólo la fila.
- **Degradados, sólo en los fondos.** Detrás de los campos claros hay un aura
  (`.aura`): tres manchas de color del recuadro de flores que derivan despacio,
  sólo mientras el campo está en pantalla (`.aura--apertura`, `--trabajo` y
  `--luz` para Servicios y Proceso juntos). Y tres campos son degradados entre
  los dos tonos de un acabado de Homer (tomados de su sitio), cada uno una sola
  vez, como su línea de productos: "Nimbus Blue/Acid Yellow" en el panel de la
  Apertura, "Retba Pink/Flame" en el manifiesto y "Clover/Cody Green" en el
  contacto (`--b-panel-*` y `--h-*` en `css/tokens.css`). En todos, la tinta da
  por lo menos 5.6:1. En los elementos (franjas, botones, filas) los colores van
  planos.
- **Sin adornos.** El vidrio queda sólo donde hay algo detrás que se vea a
  través: la barra de
  arriba, la ficha del retrato y los rótulos de la galería (en Chrome, en
  pantallas de 700px o más, además dobla lo de atrás en los bordes: `js/app.js`,
  sección 7c). El logotipo completo sale una vez, en la primera pantalla; la
  barra lleva el recuadro en miniatura y el pie no lo lleva.
- **Movimiento.** Los titulares entran palabra por palabra, las franjas se
  dibujan, el manifiesto se enciende al bajar, la regla del proceso avanza, las
  fotos entran rápido (medio segundo, en cascada de 40ms). Todo se apaga con
  "reducir movimiento".

## Secciones, en orden

| Sección | Qué hace |
|---|---|
| Apertura | Retrato fijo con su ficha de vidrio, el logotipo completo con el texto debajo y un panel en degradado azul → amarillo que da paso a Trabajo |
| Trabajo | Galería: cada proyecto es un mosaico de 3x3 de celdas redondeadas, con su duotono y su ficha encima (número, nombre, año y servicios como etiquetas). Las piezas reales van a color; el relleno, en gris |
| Estudio | El manifiesto en tinta sobre el degradado rosa → naranja: se enciende palabra por palabra y "Un equipo" va en negra, el corte grueso. A un lado, la nota; debajo, la promesa en una línea discreta: un interlocutor, un calendario, un presupuesto |
| Servicios | Las ocho áreas, una fila por área con su duotono; la fila abierta se llena con un color de la marca (fucsia, azul, amarillo, verde, en ese orden) |
| Proceso | Los cuatro tiempos, cada uno con su duotono, bajo una regla que se llena al bajar; el número del tiempo en curso se enciende |
| Contacto | Sobre el degradado verde → lima: el correo (contacto@inblumstudio.com) en grande con un botón para copiarlo, el Instagram en una fila y el formulario, donde las áreas se eligen como píldoras (una o varias) |
| Pie | Sobre cacao: la frase, los enlaces y el aviso legal (sin el nombre del estudio) |

## Estructura

```
inblum-web/
├── index.html
├── CNAME
├── css/
│   ├── tokens.css     colores de la marca, tamaños, radios, ritmo y capas;
│   │                  la paleta propia de la Apertura (--b-*)
│   └── styles.css     el sitio, por secciones numeradas
├── js/
│   ├── data.js        ← EDITA AQUÍ: contacto, servicios, proyectos, pasos y las
│   │                  frases del titular
│   └── app.js         lavado y titular que rota de la Apertura, barra, titulares
│                      por palabra, listas, galería,
│                      vidrio de la barra, revelados y franjas, regla del
│                      proceso y formulario
└── assets/
    ├── apertura/      las imágenes de la primera página y el recuadro de flores
    ├── work/          las piezas reales de Trabajo
    ├── obra/          texturas de relleno que se ven dentro de las tabletas
    ├── poster.png     imagen para compartir el enlace (og:image)
    └── favicon.png
```

`assets/wordmark.png`, `tile*.png` y `campo-*.png` son de versiones anteriores
y hoy no se usan.

## La barra de arriba

Queda fija en toda la página, hasta el pie (`position: sticky`). Por eso el
`<header class="ap-nav">` está antes de `<main>` y no dentro de la Apertura: un
elemento sticky sólo se queda mientras dure su contenedor. Es una lámina de
vidrio que flota a 6px del borde (`--nav-sep`): lo que pasa por debajo se ve
a través de ella. Su margen de abajo es negativo, así que no ocupa lugar: la Apertura
empieza arriba del todo, detrás de ella, y reserva ese alto con su relleno. Lleva
el recuadro de flores en miniatura junto al nombre; en cuanto se baja, la lámina
se vuelve un poco más opaca (`js/app.js`, sección 1c), y sobre el cacao del
contacto y el pie pasa a oscura con la letra en crema (sección 1d). El
enlace de la sección en la que estás se subraya (sección 1d) y "Hablemos" es una
píldora que se vuelve fucsia al llegar al contacto. Su alto es `--nav-h`
(`css/tokens.css`): 40.8px en escritorio, un renglón, y 73.6px en pantallas
chicas, donde son dos; `--nav-ocupa` le suma el aire de arriba. De ese total
dependen el retrato fijo de la Apertura y los saltos a cada sección
(`scroll-padding-top` en `html`): si cambias el tamaño de la barra, cambia
también `--nav-h`. La línea de avance de la página, fucsia, va encima de ella (las capas están en `css/tokens.css`).

## La Apertura, por dentro

Está en `index.html` (bloque `Apertura`), en la sección 5 de `css/styles.css` y
en la sección 0 de `js/app.js`.

- **El logotipo completo** (el recuadro de flores y "INBLÜM STUDIO" en dos
  líneas) es un SVG en línea en `index.html`. El nombre está vectorizado del
  logotipo original y toma el color del texto; el recuadro es
  `assets/apertura/logo-flor.jpg`, recortado del mismo original, y conserva sus
  esquinas redondeadas. Va encima del texto, en la columna derecha (tres
  columnas de ancho); en pantallas chicas, arriba de todo, sobre el retrato. El
  bloque del logotipo y el texto queda en medio de la primera pantalla
  (`align-self: center` en `.ap-cabeza`; para subirlo o bajarlo, `start` o `end`).
- **El texto** (titular, párrafo y botones) usa en escritorio los tamaños del
  resto del sitio, 38px y 20px, y baja a 28px y 17px en pantallas chicas. Está
  en `.ap-intro` de `css/styles.css`.
- **Las imágenes**: el retrato es una foto del estudio (el libro «2026 Inblüm
  Studio»); `mano.jpg` es una ilustración de relleno, tomada del portafolio, y
  `regadera.jpg`, la del panel, es una ilustración con el nombre del
  estudio. Para cambiar cualquiera, reemplaza el archivo en `assets/apertura/`
  con la misma proporción:

  | Archivo | Dónde sale | Proporción |
  |---|---|---|
  | `retrato.jpg` | El retrato grande, a la izquierda (queda fijo al bajar) | 4:5 |
  | `mano.jpg` | La segunda imagen, a la derecha | 4:5 |
  | `regadera.jpg` | Alta, al centro del panel | 9:16 |
  | `logo-flor.jpg` | El recuadro de flores del logotipo | 851:1126 |

  Los textos alternativos están en `index.html`; cámbialos con la imagen. El
  retrato es un recorte 4:5 (1040 × 1300 px) de una foto vertical de 1109 × 2000
  px, centrado en el libro: se tomó desde 68 px del borde izquierdo y 316 px del
  de arriba, así que el libro queda justo en el centro del marco. Para mover el
  encuadre hay que volver a recortar la foto original. Su `src` lleva un `?v=` con un
  número: súbelo cada vez que cambies el archivo, para que nadie vea la copia
  vieja guardada en el navegador. La proporción del marco está en `aspect-ratio`
  de `.ap-retrato` (`css/styles.css`): con una imagen que no sea 4:5, por ejemplo
  una ilustración vertical completa, cámbiala junto con el archivo (ver el
  comentario ahí). `regadera.jpg` es un recorte 9:16 (900 × 1600 px) de una
  ilustración de 1121 × 2000 px: se le quitó una franja oscura del borde
  izquierdo, la sombra del lomo del escaneo. Se ve entera también en pantallas
  chicas (`.ap-panel__foto` es 9:16 en todos los tamaños).
- **El titular que rota**: el `<h2>` alterna entre las frases de `FRASES`
  (`js/data.js`) con un barrido de colores letra por letra. Cada letra recorre un
  espectro (rosa, naranja, amarillo, celeste, azul) y se desvanece, con un
  desfase de izquierda a derecha; la frase siguiente entra con el mismo recorrido
  a la inversa, en loop. Es la animación de una referencia: el recorrido de
  colores y el orden se midieron cuadro por cuadro, y el ritmo se aceleró (cada
  frase se queda quieta 3 s, una letra tarda 0.6 s en salir y 0.55 s en entrar,
  con 13 ms de desfase por letra; la referencia iba al doble de espera). Los
  tiempos (`T`) y el espectro están en la sección 0b de `js/app.js`. Frases de unos 55
  caracteres son lo ideal: ocupan dos líneas y el bloque no se mueve. La primera
  frase es la que ve quien no tiene animación (sin JavaScript, con "reducir
  movimiento" o con `?revelado=todo`) y la que leen los lectores de pantalla; se
  pausa con el cursor encima. Para ver un instante concreto, desde la consola:
  `document.querySelector('.rota').rotador.pausar(true)` y luego `.ir(9.5)`.
- **El panel y el lavado**: el panel es un degradado de arriba abajo entre los
  dos tonos del acabado "Nimbus Blue/Acid Yellow" de Homer (`--b-panel-1`,
  `#A7C6ED`, y `--b-panel-2`, `#E0E722`, tomados de su sitio). Se eligió por ser
  el más legible de sus pares (la tinta da 11:1 sobre el azul y 14.6:1 sobre el
  amarillo) y porque repite el cielo y el polen del recuadro de flores. La
  mezcla es la directa, como la de los degradados de Homer: a la mitad pasa por
  un lima pálido. Conforme se baja, el fondo de la Apertura pasa del blanco al
  azul del panel por `--b-lavado-1` y `--b-lavado-2` (todos en
  `css/tokens.css`, que `app.js` lee) y termina justo cuando asoma el panel;
  a la vez se apaga el aura de la primera pantalla. Para cambiar el acabado,
  edita esos cuatro valores. El lavado es sólo de escritorio: en pantallas
  chicas el panel llega enseguida y no hay dónde lavar.

## Tipografía y librerías

- **La mezcla de Homer**, en tres pilas de `css/tokens.css`: `--f-fina` (peso
  200, para lo grande), `--f-texto` (400) y `--f-negra` (900, para lo chico).
- Homer usa **Unica77 LL** (de Lineto), que es de licencia: no se puede tomar
  de su sitio. En su lugar, lo fino y el texto van en **Helvetica Neue**, que ya
  viene instalada en Mac, iPhone e iPad (su Thin es casi idéntica a la Unica77
  Thin), y lo negro en **Inter Tight Black**, libre, que se carga de Google
  Fonts (Helvetica no tiene un corte tan negro). Fuera de Apple, todo sale en
  Inter Tight.
- **GSAP + ScrollTrigger** desde CDN, sólo para lo que va enganchado al scroll
  (lavado de la Apertura, frase palabra por palabra, regla del proceso). Si el
  CDN no carga, la página funciona igual: lo mismo se resuelve con
  IntersectionObserver.

Si el estudio compra la licencia web de Unica77 en [lineto.com](https://lineto.com),
pon los `.woff2` (Thin, Regular y Black) en `assets/fuentes/`, declara la
familia `"Unica77 LL"` con `@font-face` al principio de `css/tokens.css` (Thin
con `font-weight: 200`, Regular con 400 y Black con 900) y ponla primera en las
tres pilas. Para dejar el sitio sin dependencias externas, descarga también los
dos archivos de GSAP, ponlos en `assets/` y cambia los `<script>`.

## Qué falta por llenar

### 1. Datos de contacto
En `js/data.js`, hasta arriba: el correo y el usuario de Instagram. El sitio
no muestra teléfono ni dirección.

### 2. Proyectos
También en `js/data.js`, en `PIEZAS`. Casi todo sigue siendo de relleno: las
tabletas muestran texturas de `assets/obra` y las imágenes altas son fotos de
`picsum.photos`. La excepción es "Identidad y sistema gráfico": sus diez celdas
ya son ilustraciones reales en `assets/work/` (prefijo `graf-`), sin tableta
porque no son capturas de pantalla; con cinco altas y cinco normales llena
cinco filas enteras (quince espacios). "Fotografía de producto" también es
real (prefijo `prod-`): siete fotos altas y dos panorámicas a lo ancho de dos
columnas (`ancho: 2`), seis filas enteras. En celular, si una cantidad impar
de celdas altas deja un hueco junto a la última, esa última ocupa las dos
columnas. La galería distingue sola lo real
del relleno: lo que viene de `assets/obra/` o de una dirección `https://` se
muestra en gris (y toma su color con el cursor); lo de `assets/work/`, siempre a
color. Si cambias un archivo de `assets/work/` sin cambiarle el nombre, súbele
el `?v=` de su ruta en `data.js`, para que nadie vea la copia vieja. Para
publicar trabajo real en el resto de los proyectos:

1. Copia las imágenes a `assets/work/` (820x580 px las normales, 820x1160 las
   altas).
2. Pon cada ruta en `img` y cambia `titulo`, `anio` y `servicios`.

```js
{ titulo: 'Campaña Primavera', anio: 2026,
  servicios: ['Branding / identidad de marca', 'Diseño gráfico'],
  celdas: [
    { img: 'assets/work/primavera-1.jpg', alt: 'Cartel pegado en la calle' },
    { img: 'assets/work/primavera-2.jpg', alt: 'Retrato de la campaña', alto: 2 },
    { img: 'assets/work/sitio.jpg', dispositivo: true }
  ] }
```

`dispositivo: true` muestra la imagen dentro de una tableta sobre cacao
(capturas de sitios y apps). `alto: 2` hace que la celda ocupe dos filas. La
cuadrícula acomoda las celdas sola; un proyecto completo suma nueve espacios.


### 3. Recibir los mensajes del formulario
Hoy el formulario **abre el correo del visitante** con el mensaje ya escrito.
Para que te llegue directo a tu bandeja:

1. Crea un formulario gratuito en [formspree.io](https://formspree.io).
2. En `js/app.js`, busca el comentario `Sin servidor:` y sustituye el bloque del
   `mailto` por el `fetch` que está ahí documentado, con tu ID.

## Una nota sobre el catálogo

El sitio reproduce íntegro el `Catalogo_de_Servicios.docx`. La octava área,
*Marketing digital*, aparece en el documento con un solo renglón. Si ahí se
quedó corto, agrega los renglones que falten en `js/data.js` y la fila crece
sola.

## Verlo en local

Doble clic en `index.html` funciona para todo. Si prefieres servirlo por HTTP,
desde esta carpeta:

```bash
python3 -m http.server 4180
```

Luego abre <http://localhost:4180>.

Truco útil: `http://localhost:4180/?revelado=todo` muestra la página como
quedaría ya recorrida, sin los revelados. Sirve para revisarla o capturarla.

Si editas `css/` o `js/` y no ves el cambio, recarga forzando caché
(Cmd+Shift+R): el navegador guarda esos archivos. Al publicar una versión nueva,
sube el número de `?v=` en las cuatro etiquetas `<link>` y `<script>` del
`<head>` y nadie verá una copia vieja.

## Accesibilidad y rendimiento

- `prefers-reduced-motion` apaga el lavado, los revelados, las franjas que se
  dibujan y la deriva de las auras: la página queda completa y legible, en su
  estado final.
- El vidrio (`backdrop-filter`) se usa en tres piezas, y el rótulo de cada
  celda queda oculto de verdad (`visibility`) mientras no se ve, para no
  desenfocar cuarenta cosas a la vez.
- Navegación por teclado completa: enlace para saltar al contenido, foco
  visible y las filas de Servicios se recorren con las flechas.
- El formulario valida en español, explica qué falta campo por campo y lleva el
  foco al primer error. Las áreas son casillas de verdad (escondidas bajo las
  píldoras), así que se eligen con el teclado.
- Los números del manifiesto son decorativos para los lectores de pantalla
  (`aria-hidden`); la línea de abajo lo dice con palabras.
- El logotipo lleva su nombre accesible ("Inblüm Studio") y las ilustraciones
  su texto alternativo.
- Las celdas de la galería reservan su espacio y las imágenes de la Apertura
  traen sus medidas, así que la página no salta al cargar; las que quedan lejos
  se cargan al acercarse.
