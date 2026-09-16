/* ============================================================
   INBLÜM STUDIO · Contenido editable
   Este es el único archivo que necesitas tocar para cambiar
   servicios, piezas de portafolio y datos de contacto.
   ============================================================ */

/* ---------- 1. Contacto -------------------------------------
   PENDIENTE: sustituye los cuatro valores por los reales.
   ------------------------------------------------------------ */
const CONTACTO = {
  correo:   'hola@inblumstudio.com',      // PENDIENTE: correo real
  telefono: '+52 55 0000 0000',           // PENDIENTE: teléfono real
  ciudad:   'Ciudad de México',           // PENDIENTE: ciudad real
  redes: [
    { nombre: 'Instagram', url: 'https://instagram.com/inblumstudio' }, // PENDIENTE
    { nombre: 'Behance',   url: 'https://behance.net/inblumstudio'   }, // PENDIENTE
    { nombre: 'LinkedIn',  url: 'https://linkedin.com/company/inblumstudio' }, // PENDIENTE
    { nombre: 'Vimeo',     url: 'https://vimeo.com/inblumstudio'     }  // PENDIENTE
  ]
};

/* ---------- 2. Servicios ------------------------------------
   Las ocho áreas del Catálogo de Servicios, íntegras.
   ------------------------------------------------------------ */
const SERVICIOS = [
  {
    id: 'branding',
    nombre: 'Branding e identidad',
    frase: 'Identidad completa: logotipo, tipografía, color y sus aplicaciones.',
    items: [
      'Branding / identidad de marca',
      'Diseño gráfico',
      'Diseño editorial',
      'Diseño para impresión y empaques',
      'Arte digital',
      'Ilustración',
      'Storyboard'
    ]
  },
  {
    id: 'fotografia',
    nombre: 'Fotografía y video',
    frase: 'Fotografía y video propios, de producto, de evento o documentales.',
    items: [
      'Fotografía de producto y publicitaria',
      'Video y fotografía documental',
      'Edición de imagen',
      'Edición de video',
      'Cobertura de eventos corporativos, sociales y bodas'
    ]
  },
  {
    id: 'audiovisual',
    nombre: 'Producción audiovisual',
    frase: 'Del guion y la preproducción al corte final.',
    items: [
      'Preproducción audiovisual',
      'Dirección de proyectos audiovisuales',
      'Producción de contenidos multimedia y motion graphics',
      'Guionismo publicitario y para cine',
      'Modelado 3D',
      'Animación',
      'Producción de streaming y transmisiones en vivo'
    ]
  },
  {
    id: 'audio',
    nombre: 'Audio',
    frase: 'Grabación, mezcla, podcast y radio.',
    items: [
      'Producción radiofónica',
      'Producción de podcasts',
      'Audio y grabación',
      'Mezcla de sonido'
    ]
  },
  {
    id: 'digital',
    nombre: 'Digital y desarrollo',
    frase: 'Sitios y aplicaciones, con su mantenimiento y su posicionamiento.',
    items: [
      'Programación web',
      'Programación de aplicaciones',
      'Diseño UI/UX',
      'Mantenimiento y soporte web',
      'SEO'
    ]
  },
  {
    id: 'ia',
    nombre: 'Inteligencia artificial',
    frase: 'Automatizaciones y asistentes para las tareas repetitivas.',
    items: [
      'Automatización de procesos con IA',
      'Chatbots e integraciones con IA',
      'Generación de contenido con IA'
    ]
  },
  {
    id: 'contenido',
    nombre: 'Contenido y comunicación',
    frase: 'Textos, traducción, presentaciones e infografía.',
    items: [
      'Redacción periodística y de estilo',
      'Copywriting y redacción publicitaria',
      'Traducción y subtitulaje',
      'Diseño de presentaciones y pitch decks',
      'Infografía y visualización de datos'
    ]
  },
  {
    id: 'marketing',
    nombre: 'Marketing digital',
    frase: 'Manejo de redes sociales y community management.',
    items: [
      'Gestión de redes sociales y community management'
    ]
  }
];

/* ---------- 3. La secuencia de la portada -------------------
   Las imágenes que se pasan con el cursor sobre el cartel de la
   portada. La primera es la marca; las demás, obra del estudio.
   Para añadir una: copia el archivo a assets/obra/ y agrega su
   renglón aquí. El color del ambiente se saca solo de cada
   imagen, no hay que anotarlo.
   ------------------------------------------------------------ */
const OBRA = [
  { img: 'assets/campo-alto.png',   titulo: 'Inblüm Studio', nota: 'Identidad' },
  { img: 'assets/obra/holografico.jpg', titulo: 'Gradiente holográfico', nota: 'Luz' },
  { img: 'assets/obra/algas.jpg',       titulo: 'Fondo marino',          nota: 'Orgánico' },
  { img: 'assets/obra/flores.jpg',      titulo: 'Flor de temporada',     nota: 'Botánico' },
  { img: 'assets/obra/abstracto.jpg',   titulo: 'Abstracto experimental', nota: 'Gráfico' },
  { img: 'assets/obra/jardin.jpg',      titulo: 'Jardín digital',        nota: 'Pixelado' },
  { img: 'assets/obra/mar.jpg',         titulo: 'Textura de mar',        nota: 'Agua' },
  { img: 'assets/obra/piel.jpg',        titulo: 'Piel animal',           nota: 'Patrón' },
  { img: 'assets/obra/papel-1.jpg',     titulo: 'Papelería 01',          nota: 'Editorial' },
  { img: 'assets/obra/papel-2.jpg',     titulo: 'Papelería 02',          nota: 'Editorial' },
  { img: 'assets/obra/porcelana.jpg',   titulo: 'Porcelana',             nota: 'Mineral' },
  { img: 'assets/obra/pincelada.jpg',   titulo: 'Pincelada a mano',      nota: 'Artesanal' },
  { img: 'assets/obra/minimal.jpg',     titulo: 'Minimalismo',           nota: 'Escena' },
  { img: 'assets/obra/hoja.jpg',        titulo: 'Hoja tropical',         nota: 'Botánico' },
  { img: 'assets/obra/concreto.jpg',    titulo: 'Concreto',              nota: 'Mineral' },
  { img: 'assets/obra/collage.jpg',     titulo: 'Collage',               nota: 'Capas' },
  { img: 'assets/obra/cimatica.jpg',    titulo: 'Cimática',              nota: 'Patrón' },
  { img: 'assets/obra/azulejo.jpg',     titulo: 'Azulejo',               nota: 'Ornamento' },
  { img: 'assets/obra/marmol.jpg',      titulo: 'Mármol',                nota: 'Mineral' },
  { img: 'assets/obra/luz.jpg',         titulo: 'Luz filtrada',          nota: 'Luz' }
];

/* ---------- 4. Piezas de portafolio -------------------------
   PENDIENTE: estas seis piezas muestran las disciplinas con
   imágenes de relleno (picsum.photos). Para publicar trabajo
   real: copia la foto a assets/work/, pon la ruta en `img` y
   cambia `titulo` y `meta` por los del proyecto.
   Tamaño recomendado: 1600x1200 px (o 1200x1600 en las dos
   piezas verticales, la segunda y la tercera).
   ------------------------------------------------------------ */
const PIEZAS = [
  {
    titulo: 'Identidad y sistema gráfico',
    meta: 'Branding',
    img: 'https://picsum.photos/seed/inblum-branding-mesa/1600/1200?blur=2',
    ancho: 1600, alto: 1200,
    alt: 'Materiales impresos de una identidad de marca sobre una mesa de trabajo'
  },
  {
    titulo: 'Fotografía de producto',
    meta: 'Fotografía',
    img: 'https://picsum.photos/seed/inblum-producto-estudio/1200/1600?blur=2',
    ancho: 1200, alto: 1600,
    alt: 'Montaje de estudio para fotografía de producto'
  },
  {
    titulo: 'Rodaje documental',
    meta: 'Producción audiovisual',
    img: 'https://picsum.photos/seed/inblum-rodaje-camara/1200/1600?blur=2',
    ancho: 1200, alto: 1600,
    alt: 'Cámara de cine montada durante un rodaje'
  },
  {
    titulo: 'Producción de podcast',
    meta: 'Audio',
    img: 'https://picsum.photos/seed/inblum-cabina-audio/1600/1200?blur=2',
    ancho: 1600, alto: 1200,
    alt: 'Cabina de grabación con micrófono y consola'
  },
  {
    titulo: 'Sitio y aplicación',
    meta: 'Digital y desarrollo',
    img: 'https://picsum.photos/seed/inblum-interfaz-pantalla/1600/1200?blur=2',
    ancho: 1600, alto: 1200,
    alt: 'Interfaz de un sitio web mostrada en pantalla'
  },
  {
    titulo: 'Campaña en redes',
    meta: 'Marketing digital',
    img: 'https://picsum.photos/seed/inblum-campana-social/1600/1200?blur=2',
    ancho: 1600, alto: 1200,
    alt: 'Piezas gráficas de una campaña vistas en un teléfono'
  }
];

/* ---------- 5. Cómo trabajamos ------------------------------ */
const PASOS = [
  {
    nombre: 'Escuchar',
    texto: 'Una sesión para entender el negocio, el público y el plazo. De ahí sale el alcance del proyecto.'
  },
  {
    nombre: 'Proponer',
    texto: 'Ruta creativa, calendario y presupuesto cerrado por escrito, antes de empezar.'
  },
  {
    nombre: 'Producir',
    texto: 'El equipo se arma según el proyecto. Revisas avances en fechas acordadas, no sólo al final.'
  },
  {
    nombre: 'Entregar',
    texto: 'Archivos editables, manual de uso y soporte después del lanzamiento.'
  }
];

/* ---------- 6. El museo flotante ----------------------------
   Las piezas que derivan detrás de "Cómo trabajamos", como
   objetos colgados en el aire sobre una mesa de museo.

   PENDIENTE: las fotos son de relleno. Cuando lleguen los
   recortes de verdad (PNG con fondo transparente), guárdalos en
   assets/museo/ y cambia sólo `img`. Los tipos que no son
   'foto' no llevan archivo: son los "modelos 3d", dibujados con
   puro CSS (esfera cromada, anillo de gelatina, cápsula, bloque
   de yeso, gota y disco). Para quitar una pieza, borra su línea.

   capa  'fondo'  pálida, puede pasar por detrás del texto.
         'frente' a todo color; sólo en los bordes y en las
                  bandas de arriba y abajo, donde no hay lectura.
   x, y  posición en % del lienzo, desde su esquina superior
         izquierda. Los valores negativos o mayores a 100 se
         recortan contra el filo de la mesa, a propósito.
   w     ancho en px; el alto sale de la forma de cada pieza.
   rot   inclinación de salida, en grados. La deriva y el giro
         lento los reparte el código.
   ------------------------------------------------------------ */
const MUSEO = [
  /* --- Capa de fondo: el yeso pálido que da el volumen --- */
  { tipo: 'gota',    capa: 'fondo',  x: 28,  y: 20, w: 340, rot:  -8 },
  { tipo: 'bloque',  capa: 'fondo',  x:  7,  y:  5, w: 150, rot:  10 },
  { tipo: 'esfera',  capa: 'fondo',  x: 61,  y: 13, w: 120, rot:   0 },
  { tipo: 'capsula', capa: 'fondo',  x: 19,  y: 69, w: 200, rot: -14 },
  { tipo: 'foto',    capa: 'fondo',  x: 45,  y: 57, w: 175, rot:   7, img: 'assets/obra/marmol.jpg' },
  { tipo: 'gota',    capa: 'fondo',  x: 70,  y: 61, w: 240, rot:  14 },
  { tipo: 'bloque',  capa: 'fondo',  x: 39,  y: 83, w: 130, rot:  -6 },
  { tipo: 'foto',    capa: 'fondo',  x: 11,  y: 39, w: 165, rot:  12, img: 'assets/obra/concreto.jpg' },
  { tipo: 'esfera',  capa: 'fondo',  x: 85,  y: 37, w: 105, rot:   0 },
  { tipo: 'capsula', capa: 'fondo',  x: 54,  y:  3, w: 170, rot:   8 },
  { tipo: 'gota',    capa: 'fondo',  x:  3,  y: 77, w: 190, rot: -10 },
  { tipo: 'foto',    capa: 'fondo',  x: 65,  y: 87, w: 155, rot:   5, img: 'assets/obra/porcelana.jpg' },
  { tipo: 'bloque',  capa: 'fondo',  x: 77,  y: 73, w: 125, rot:  16 },
  { tipo: 'esfera',  capa: 'fondo',  x: 33,  y: 45, w:  95, rot:   0 },

  /* --- Capa de frente: el color, sólo por los filos ---
     Dónde puede ir el color no es capricho, es consecuencia del
     título fijo: mientras se recorre la sección, el bloque de la
     izquierda se queda clavado y todo lo demás le pasa por
     detrás, así que cualquier pieza puesta en esa mitad termina,
     tarde o temprano, debajo de la lectura. De ahí las tres
     zonas: el filo derecho —que baja al mismo paso que los
     tiempos y nunca se desalinea—, la banda de arriba —a la que
     el título nunca sube— y la de abajo por la mitad derecha.
     El resto del lienzo lo sostiene el yeso de la capa de
     fondo. */
  { tipo: 'anillo',  capa: 'frente', x: 93,  y:  9, w: 165, rot:  12 },
  { tipo: 'foto',    capa: 'frente', x: 95,  y: 27, w: 130, rot:   8, img: 'assets/obra/flores.jpg' },
  { tipo: 'disco',   capa: 'frente', x: 92,  y: 47, w: 140, rot:  -5 },
  { tipo: 'foto',    capa: 'frente', x: 96,  y: 65, w: 120, rot:   9, img: 'assets/obra/azulejo.jpg' },
  { tipo: 'foto',    capa: 'frente', x: 93,  y: 85, w: 135, rot:  -7, img: 'assets/obra/cimatica.jpg' },
  { tipo: 'anillo',  capa: 'frente', x: -1,  y:  2, w: 125, rot: -18 },
  { tipo: 'foto',    capa: 'frente', x: 12,  y: -4, w: 125, rot: -12, img: 'assets/obra/holografico.jpg' },
  { tipo: 'foto',    capa: 'frente', x: 30,  y: -4, w: 130, rot:  11, img: 'assets/obra/algas.jpg' },
  { tipo: 'foto',    capa: 'frente', x: 46,  y: -4, w: 110, rot:   6, img: 'assets/obra/luz.jpg' },
  { tipo: 'foto',    capa: 'frente', x: 47,  y: 96, w: 125, rot:  -9, img: 'assets/obra/jardin.jpg' },
  { tipo: 'disco',   capa: 'frente', x: 63,  y: 95, w: 115, rot:  13 },
  { tipo: 'esfera',  capa: 'frente', x: 79,  y: 93, w: 110, rot:   0 }
];
