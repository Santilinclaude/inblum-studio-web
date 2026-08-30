# Inblüm Studio · sitio del estudio

Una sola página, estática, sin paso de compilación. Se abre con doble clic en
`index.html` y se publica subiendo la carpeta tal cual.

## La idea: in bloom

Inblüm es "en flor". El sitio toma esa idea al pie de la letra y la convierte
en un herbario: papel, láminas, rótulos a máquina de escribir y dibujos
botánicos que crecen conforme se recorre la página.

- **La fotografía manda.** El cartel de marca aparece grande y a sangre por el
  filo derecho, con una segunda toma colgando de su canto izquierdo. Al cargar,
  la imagen se abre de abajo hacia arriba mientras la foto de dentro asienta su
  escala. No hay ni un dibujo hecho a mano: la fotografía ya es buena, sólo hay
  que presentarla.
- **El cartel es una hoja de contacto.** Recorrer el marco con el cursor pasa
  entre 20 fotografías y texturas, todas recortadas al mismo encuadre, sin un
  solo espacio en blanco. El nombre del estudio queda siempre encima, como una
  ventana recortada con la forma exacta del logotipo: las letras muestran la
  misma imagen que hay detrás, así que cambian de color y de textura con cada
  una. Ninguna foto oscura lo deja ilegible porque el color de piso de las
  letras sale de la propia imagen (ver la sección de abajo).
- **Papel y tinta.** Fondo de papel hueso con grano y tinta casi negra. Todo el
  color sale del pigmento de la fotografía original. Un solo acento: el rosa.
- **Luz holográfica de fondo.** Un shader a pantalla completa simula la luz
  descompuesta en el canto de un cristal: bandas de cian, azul, magenta y ámbar
  que se mueven con el tiempo, con el cursor y con el desplazamiento. Se
  multiplica sobre el papel, así que tiñe sin ensuciar, y se retira del centro
  para que la tipografía siempre gane.
- **Bloom como comportamiento.** Lo que florece son las cosas al abrirse: la
  frase se enciende palabra por palabra, las ocho láminas se despliegan a lo
  ancho y las piezas de trabajo pasan de desaturado a color.

## Secciones

| Sección | Qué hace |
|---|---|
| Portada | Qué hace el estudio y la hoja de contacto que se recorre con el cursor |
| Tira | Las ocho áreas pasando de largo, sin parar |
| Estudio | La frase que se enciende palabra por palabra |
| Servicios | Herbario de ocho láminas que se abren a lo ancho |
| Trabajo | Carrusel de láminas montadas, se arrastra con el cursor |
| Proceso | Los cuatro tiempos, con una rama que florece de fondo al avanzar |
| Contacto | Datos directos y formulario |

## Estructura

```
inblum-web/
├── index.html
├── css/
│   ├── tokens.css     papel, tinta, pigmentos, ritmo, curvas
│   └── styles.css     el sitio, en dos partes comentadas
├── js/
│   ├── data.js        ← EDITA AQUÍ: servicios, portafolio, contacto y OBRA
│   ├── holo.js         el fondo holográfico (WebGL, sin librerías)
│   ├── proceso-fondo.js  la secuencia de la rama, atada al scroll
│   └── app.js          herbario, carrusel, revelados, formulario y la
│                        hoja de contacto del cartel
└── assets/
    ├── wordmark.png     el nombre, recortado del logotipo (también se usa
    │                    como máscara del logotipo sobre cada textura)
    ├── poster.png       el cartel completo
    ├── tile.png         el recuadro floral (flor y pétalos)
    ├── campo-*.png      recortes de pigmento para las láminas
    ├── obra/             19 fotografías y texturas para el cartel de
    │                    portada, más el logo animado
    ├── proceso/          147 cuadros de la rama que florece (1280x720)
    └── favicon.png
```

### El cartel de portada, por dentro

En `js/data.js`, el arreglo `OBRA` define qué se ve al recorrer el cartel con
el cursor. Cada entrada es una imagen, un título y una categoría corta:

```js
{ img: 'assets/obra/marmol.jpg', titulo: 'Mármol', nota: 'Mineral' }
```

Para agregar o quitar una: copia la imagen a `assets/obra/` (recomendado:
recorte vertical, cualquier tamaño, se ajusta solo) y agrega o quita su
renglón. La primera entrada siempre es la marca; las demás pueden ser tantas
como quieras, se reparten solas a lo ancho del cartel.

Dos cosas pasan automáticamente con cada imagen nueva, sin anotar nada a mano:

1. **El color ambiental.** Se leen sus píxeles en un lienzo diminuto, se
   agrupan por tono y ganan los dos colores con más presencia. Esos dos
   colores encienden el resplandor que rodea al cartel.
2. **El color de piso del logotipo.** Los mismos dos colores arman un
   degradado que se mezcla con la fotografía (con `background-blend-mode:
   screen`) dentro de las letras. Así, aunque la foto sea casi negra (el
   mármol, por ejemplo), el logotipo nunca deja de leerse: toma como mínimo
   el color de la propia imagen.

Todo lo de `assets/` sale del logotipo original que está en
`Desktop/Inblüm/Logos`. No hay ilustración: cada mancha de color es un recorte
de esa misma fotografía.

### El fondo del proceso

Detrás de los cuatro tiempos hay una secuencia de 147 cuadros a sangre: una
rama de bonsái, en macro, pasando de hoja a flor. No corre con un reloj: el
cuadro visible depende de cuánto has recorrido la sección, así que florece al
ritmo de tu lectura y retrocede si subes.

- Va a pantalla completa detrás del texto, con un velo del color del papel
  encima: la rama se lee como una textura tenue, nunca como una foto a color
  compitiendo con el contenido. La sección sigue siendo de papel, sólo que con
  algo de vida atrás.
- El lienzo va pegajoso dentro de la sección: llena la pantalla y se queda ahí
  mientras la columna de tiempos sigue subiendo, y se suelta al salir de la
  sección.
- Los cuadros se piden sólo cuando la sección se acerca (a metro y medio de
  distancia), de dos en dos y en orden. El lienzo siempre dibuja el cuadro más
  avanzado que ya haya llegado, así que nunca hay hueco aunque bajes rápido.
- Con `prefers-reduced-motion` se pide un solo archivo, el último, y el fondo
  aparece ya en flor.

Los 147 archivos ya venían optimizados (23 KB en promedio, 3,4 MB en total) y
se copiaron tal cual, sólo renombrados a `000.jpg`…`146.jpg` para que el
componente los pida por número.

## Tipografía y librerías

- **Cabinet Grotesk** para títulos y **Satoshi** para texto, desde Fontshare.
- **JetBrains Mono** para los rótulos de herbario, desde Google Fonts.
- **GSAP + ScrollTrigger** desde CDN, sólo para lo que necesita ir enganchado al
  scroll: encender la frase palabra por palabra, llenar la regla del proceso,
  el paralaje corto de la fotografía y la mancha de color. Si el CDN no carga,
  la página funciona igual: lo mismo se resuelve con IntersectionObserver.
- **El fondo holográfico no usa ninguna librería**: WebGL a pelo.

Si quieres el sitio sin dependencias externas, descarga los `.woff2` y los dos
archivos de GSAP, ponlos en `assets/` y cambia los `<link>` y `<script>` del
`<head>`.

## Qué falta por llenar

### 1. Datos de contacto
En `js/data.js`, hasta arriba, marcados con `PENDIENTE`:

```js
const CONTACTO = {
  correo:   'hola@inblumstudio.com',   // PENDIENTE: correo real
  telefono: '+52 55 0000 0000',        // PENDIENTE: teléfono real
  ciudad:   'Ciudad de México',        // PENDIENTE: ciudad real
  redes: [ ... ]                       // PENDIENTE: URLs reales
};
```

### 2. Portafolio
También en `js/data.js`. Las seis piezas usan fotografías de relleno de
`picsum.photos`, desaturadas para que se lean como una serie. Para publicar
trabajo real:

1. Copia la imagen a `assets/work/` (1600x1200 px, o 1200x1600 si es vertical).
2. Cambia `img` por la ruta local, ajusta `ancho` y `alto`, y escribe `titulo`,
   `meta` y `alt` reales.

```js
{ titulo: 'Campaña Primavera', meta: 'Branding',
  img: 'assets/work/primavera.jpg', ancho: 1600, alto: 1200,
  alt: 'Cartel de la campaña pegado en la calle' }
```

El carrusel acepta las piezas que quieras: crece solo. Si dejas `PIEZAS` vacío,
la sección muestra un aviso en lugar de romperse.

### 3. Recibir los mensajes del formulario
Hoy el formulario **abre el correo del visitante** con el mensaje ya escrito.
Para que te llegue directo a tu bandeja:

1. Crea un formulario gratuito en [formspree.io](https://formspree.io).
2. En `js/app.js`, busca el comentario `Sin servidor:` y sustituye el bloque del
   `mailto` por el `fetch` que está ahí documentado, con tu ID.

En Netlify, la otra opción es añadir `netlify` y `name="contacto"` a la etiqueta
`<form>` y quitar el `preventDefault`.

## Una nota sobre el catálogo

El sitio reproduce íntegro el `Catalogo_de_Servicios.docx`. La octava área,
*Marketing digital*, aparece en el documento con un solo renglón. Si ahí se
quedó corto, agrega los renglones que falten en `js/data.js` y la lámina crece
sola.

## Paleta

| | |
|---|---|
| Papel | `#F1F0EA` · lámina `#FBFAF7` · segundo plano `#E7E6DE` |
| Tinta | `#14150F` · secundaria `#4B4D42` · terciaria `#767869` |
| Rosa (acento) | `#C4256F` · vivo `#FF3D9A` |
| Azul eléctrico (tira) | `#1957D8` |
| Amarillo (contacto) | `#F5D923` |

Los tres colores del cartel no viven en detalles sino en bloques enteros: la
tira de disciplinas es azul con tipografía blanca, el contacto es un bloque
amarillo a sangre, el pie cierra en tinta, y cada lámina de servicios lleva su
propio baño de color turnando azul, rosa y amarillo. El papel entre bloque y
bloque es donde se ve la luz holográfica.

## Verlo en local

Doble clic en `index.html` funciona para todo. Si prefieres servirlo por HTTP,
desde esta carpeta:

```bash
python3 -m http.server 4180
```

Luego abre <http://localhost:4180>.

Truco útil: `http://localhost:4180/?revelado=todo` muestra la página entera de
golpe, sin esperar los revelados. Sirve para revisarla o capturarla.

Si editas `css/` o `js/` y no ves el cambio, recarga forzando caché
(Cmd+Shift+R): el navegador guarda esos archivos. Al publicar una versión
nueva, sube el número de `?v=1` en las etiquetas `<link>` y `<script>` del
`<head>` y nadie verá una copia vieja.

## Accesibilidad y rendimiento

- `prefers-reduced-motion` apaga todo: el fondo holográfico se retira y las
  aperturas y revelados quedan en su estado final. La página completa y
  legible, sin una sola animación.
- El fondo se dibuja a media resolución (42% en móvil, 55% en escritorio) y se
  detiene cuando la pestaña se oculta.
- Navegación por teclado completa: enlace para saltar al contenido, foco
  visible, menú de pantalla completa con Escape, las ocho láminas se recorren
  con las flechas, y el carrusel también.
- El formulario valida en español, explica qué falta campo por campo y lleva el
  foco al primer error.
- Sólo se animan `transform`, `opacity` y `clip-path`; nada que obligue a
  recalcular la maqueta. Las imágenes traen medidas, así que la página no salta al cargar.
