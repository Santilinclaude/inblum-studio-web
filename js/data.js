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
