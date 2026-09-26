# Inblüm Studio · sitio del estudio

Una sola página, estática, sin paso de compilación. Se abre con doble clic en
`index.html` y se publica subiendo la carpeta tal cual. Vive en GitHub Pages
(rama `main`, dominio en `CNAME`): cada commit que se sube a `main` se publica.

## El diseño: dos referencias

- **Grafik** es la base de todo el sitio: lienzo de papel hueso, tinta negra,
  una sola tipografía (Helvetica) en tres tamaños (20, 38 y 40 px), cero radio,
  cero sombra y líneas de 1px como único esqueleto. El color vive dentro del
  trabajo, nunca en la interfaz.
- **Beings** es sólo la primera página (la *Apertura*): una palabra enorme, un
  retrato recortado al ras, texto de 12px en mayúsculas y un campo verde al que
  se lava el fondo desde el blanco. Trae su propia paleta, pero la misma tipografía
  que todo lo demás.

## Secciones, en orden

| Sección | Qué hace |
|---|---|
| Apertura | Retrato fijo, el logotipo completo con el texto debajo y un panel verde que da paso a Trabajo |
| Trabajo | Galería: cada proyecto es un mosaico de 3x3 con su ficha debajo |
| Estudio | La frase que se enciende palabra por palabra y la nota a la derecha |
| Servicios | Las ocho áreas; el detalle se abre con el cursor o el foco |
| Proceso | Los cuatro tiempos, con una regla que se llena al avanzar |
| Contacto | Datos directos y formulario |

## Estructura

```
inblum-web/
├── index.html
├── CNAME
├── css/
│   ├── tokens.css     los dos sistemas: Grafik (papel, tinta, tamaños) y
│   │                  Beings (--b-*, sólo para la Apertura)
│   └── styles.css     el sitio, por secciones numeradas
├── js/
│   ├── data.js        ← EDITA AQUÍ: contacto, servicios, proyectos, pasos y las
│   │                  frases del titular
│   └── app.js         lavado y titular que rota de la Apertura, listas,
│                      galería, revelados, regla del proceso y formulario
└── assets/
    ├── apertura/      las cuatro ilustraciones de la primera página
    ├── obra/          texturas que se ven dentro de las tabletas de Trabajo
    ├── poster.png     imagen para compartir el enlace (og:image)
    └── favicon.png
```

`assets/wordmark.png`, `tile*.png` y `campo-*.png` son de versiones anteriores
y hoy no se usan.

## La barra de arriba

Queda fija en toda la página, hasta el pie (`position: sticky`). Por eso el
`<header class="ap-nav">` está antes de `<main>` y no dentro de la Apertura: un
elemento sticky sólo se queda mientras dure su contenedor. Lleva fondo blanco y,
en cuanto se baja, una línea de 1px debajo (`js/app.js`, sección 1c); arriba del
todo no la tiene. Su alto es `--nav-h` (`css/tokens.css`): 36.8px en escritorio,
un renglón, y 69.6px en pantallas chicas, donde son dos. De ese alto dependen el
retrato fijo de la Apertura, las columnas fijas de Servicios y Proceso y los
saltos a cada sección (`scroll-padding-top` en `html`): si cambias el tamaño de
la barra, cambia también `--nav-h`. La línea de avance de la página va encima de
ella (las capas están en `css/tokens.css`).

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
- **Las imágenes**: el retrato es una ilustración con el nombre del estudio (la
  mujer de la regadera); `mano.jpg` y `rosa.jpg` son ilustraciones de relleno,
  tomadas del portafolio. Para cambiar cualquiera, reemplaza el archivo en
  `assets/apertura/` con la misma proporción:

  | Archivo | Dónde sale | Proporción |
  |---|---|---|
  | `retrato.jpg` | El retrato grande, a la izquierda (queda fijo al bajar) | 2:3 |
  | `mano.jpg` | La segunda imagen, a la derecha | 4:5 |
  | `rosa.jpg` | Alta, al centro del panel verde | 9:16 |
  | `logo-flor.jpg` | El recuadro de flores del logotipo | 851:1126 |

  Los textos alternativos están en `index.html`; cámbialos con la imagen. El
  retrato es un recorte 2:3 (1086 × 1629 px) de una ilustración vertical de
  1121 × 2000 px: se tomó desde 35 px del borde izquierdo (para quitar una franja
  oscura, la sombra del lomo del escaneo) y 215 px del de arriba (para que las dos
  cabezas y los zapatos quepan con aire). Es 2:3 y no 4:5 porque en 4:5 se
  cortaba una cabeza o unos zapatos; si cambias el encuadre hay que volver a
  recortar la original. Su `src` lleva un `?v=` con un número: súbelo cada vez que
  cambies el archivo, para que nadie vea la copia vieja guardada en el navegador.
  Si algún día vuelve una foto 4:5, cambia también `aspect-ratio` en `.ap-retrato`
  (`css/styles.css`).
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
- **El verde y el lavado**: el verde del panel (`--b-verde`, `#888740`) es el de
  la referencia elegida. Conforme se baja, el fondo pasa del blanco a él por
  `--b-lavado-1` y `--b-lavado-2` (todos en `css/tokens.css`, que `app.js` lee) y
  termina justo cuando asoma el panel. El texto del panel va en tinta, no en
  color claro: sobre ese verde da 5.2:1 de contraste. Para cambiar el tono, edita
  esos tres valores. El lavado es sólo de escritorio: en pantallas chicas el panel
  llega enseguida y no hay dónde lavar.

## Tipografía y librerías

- **Helvetica** para todo el sitio, incluida la Apertura: peso 400 en Grafik y
  500 / 700 en la Apertura (texto y cabecera, titular, declaración y la palabra
  grande). Está en `--f-texto`, en `css/tokens.css`, como
  `"Helvetica Neue", Helvetica, Arial, sans-serif`.
- Helvetica **no es libre ni está en Google Fonts**, así que no se descarga: se
  pide al sistema del visitante. En Mac, iPhone y iPad sale Helvetica de verdad;
  en Windows sale Arial (se hizo para igualar sus métricas) y en Android, la
  sans-serif del sistema. Es lo que hace cualquier sitio que usa Helvetica sin
  licencia web.
- **GSAP + ScrollTrigger** desde CDN, sólo para lo que va enganchado al scroll
  (lavado de la Apertura, frase palabra por palabra, regla del proceso). Si el CDN no carga, la página funciona igual: lo mismo se resuelve
  con IntersectionObserver.

Si quieres que Helvetica salga idéntica en todos los dispositivos, compra la
licencia web (Helvetica Now o Neue Haas Grotesk, de Monotype), pon los `.woff2`
en `assets/fonts/`, declara la familia con `@font-face` al principio de
`css/tokens.css` y ponla de primera en `--f-texto`. Para dejar el sitio sin
dependencias externas, descarga también los dos archivos de GSAP, ponlos en
`assets/` y cambia los `<script>` del `<head>`.

## Qué falta por llenar

### 1. Datos de contacto
En `js/data.js`, hasta arriba, marcados con `PENDIENTE`: correo, teléfono,
ciudad y redes.

### 2. Proyectos
También en `js/data.js`, en `PIEZAS`. Todo es de relleno: las tabletas muestran
texturas de `assets/obra` y las imágenes altas son fotos de `picsum.photos`.
Para publicar trabajo real:

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

`dispositivo: true` muestra la imagen dentro de una tableta sobre negro
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

- `prefers-reduced-motion` apaga el lavado y los revelados: la
  página queda completa y legible, en su estado final.
- Navegación por teclado completa: enlace para saltar al contenido, foco
  visible y las filas de Servicios se recorren con las flechas.
- El formulario valida en español, explica qué falta campo por campo y lleva el
  foco al primer error.
- El logotipo lleva su nombre accesible ("Inblüm Studio") y las ilustraciones
  su texto alternativo.
- Las celdas de la galería reservan su espacio y las imágenes de la Apertura
  traen sus medidas, así que la página no salta al cargar; las que quedan lejos
  se cargan al acercarse.
