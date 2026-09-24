# Inblüm Studio · sitio del estudio

Una sola página, estática, sin paso de compilación. Se abre con doble clic en
`index.html` y se publica subiendo la carpeta tal cual. Vive en GitHub Pages
(rama `main`, dominio en `CNAME`): cada commit que se sube a `main` se publica.

## El diseño: dos referencias

- **Grafik** es la base de todo el sitio: lienzo de papel hueso, tinta negra,
  una sola tipografía (Inter 400) en tres tamaños (20, 38 y 40 px), cero radio,
  cero sombra y líneas de 1px como único esqueleto. El color vive dentro del
  trabajo, nunca en la interfaz.
- **Beings** es sólo la primera página (la *Apertura*): una palabra enorme, un
  retrato recortado al ras, texto de 12px en mayúsculas y campos cálidos que se
  lavan del blanco al marrón. Trae su propia paleta y sus propias tipografías,
  y no se mezcla con lo demás.

## Secciones, en orden

| Sección | Qué hace |
|---|---|
| Apertura | Logotipo a lo ancho, retrato, aro fino y un panel oscuro que da paso a Trabajo |
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
│   │                  Beings (--b-* y --f-*, sólo para la Apertura)
│   └── styles.css     el sitio, por secciones numeradas
├── js/
│   ├── data.js        ← EDITA AQUÍ: contacto, servicios, proyectos, pasos
│   └── app.js         entrada y lavado de la Apertura, listas, galería,
│                      revelados, regla del proceso y formulario
└── assets/
    ├── apertura/      las cuatro ilustraciones de la primera página
    ├── obra/          texturas que se ven dentro de las tabletas de Trabajo
    ├── poster.png     imagen para compartir el enlace (og:image)
    └── favicon.png
```

`assets/wordmark.png`, `tile*.png` y `campo-*.png` son de versiones anteriores
y hoy no se usan.

## La Apertura, por dentro

Está en `index.html` (bloque `Apertura`), en la sección 5 de `css/styles.css` y
en la sección 0 de `js/app.js`.

- **El logotipo** es el original vectorizado: dos SVG en línea, "IN" y "BLÜM",
  con una foto entre ellos. Al cargar, la foto se cierra y las letras se juntan
  con su espaciado de origen. Para cambiar el tamaño de la palabra cerrada,
  `--marca` en `.ap-marca` (por defecto 84, en % del ancho).
- **Las ilustraciones** son de relleno, tomadas del portafolio. Para cambiarlas,
  reemplaza el archivo en `assets/apertura/` con la misma proporción:

  | Archivo | Dónde sale | Proporción |
  |---|---|---|
  | `retrato.jpg` | El retrato grande, a la izquierda (queda fijo al bajar) | 4:5 |
  | `mano.jpg` | La segunda imagen, a la derecha | 4:5 |
  | `rosa.jpg` | Alta, al centro del panel oscuro | 9:16 |
  | `fieltro.jpg` | La foto que abre el logotipo | casi cuadrada |

  Los textos alternativos están en `index.html`; cámbialos con la imagen.
- **El lavado**: conforme se baja, el fondo pasa de blanco a rubor, arcilla y
  úmbra (los mismos colores de `tokens.css`) y termina justo cuando asoma el
  panel. Sólo en escritorio: en pantallas chicas el panel llega enseguida y no
  hay dónde lavar. El aro crece con el mismo recorrido.
- **La entrada** la describe la clase `intro` del `<html>`, que pone un script
  del `<head>` y quita `app.js` al terminar. Si GSAP no llega en cinco segundos,
  se quita sola: la página nunca queda escondida.

## Tipografía y librerías

- **Inter 400** para todo el sitio, desde Google Fonts. Grotesk, la de la
  referencia Grafik, es de paga; Inter es el sustituto que la propia referencia
  sugiere.
- La **Apertura** usa los sustitutos libres de las cuatro caras de Beings:
  Anton (Bonto), Archivo 700 (Die Grotesk B Bold), Archivo Black (Die Grotesk C
  Black) y Space Grotesk 500 (Die Grotesk B SemiBold).
- **GSAP + ScrollTrigger** desde CDN, sólo para lo que va enganchado al scroll
  (entrada y lavado de la Apertura, frase palabra por palabra, regla del
  proceso). Si el CDN no carga, la página funciona igual: lo mismo se resuelve
  con IntersectionObserver.

Si quieres el sitio sin dependencias externas, descarga los `.woff2` y los dos
archivos de GSAP, ponlos en `assets/` y cambia los `<link>` y `<script>` del
`<head>`.

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
quedaría ya recorrida, sin la entrada de la Apertura ni los revelados. Sirve
para revisarla o capturarla.

Si editas `css/` o `js/` y no ves el cambio, recarga forzando caché
(Cmd+Shift+R): el navegador guarda esos archivos. Al publicar una versión nueva,
sube el número de `?v=` en las cuatro etiquetas `<link>` y `<script>` del
`<head>` y nadie verá una copia vieja.

## Accesibilidad y rendimiento

- `prefers-reduced-motion` apaga la entrada, el lavado y los revelados: la
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
