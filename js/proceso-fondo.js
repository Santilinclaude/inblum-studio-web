/* ============================================================
   INBLÜM STUDIO · El fondo del proceso
   Una secuencia de 147 cuadros: una rama de bonsái, en macro,
   pasando de hoja a flor. Va a sangre detrás de los cuatro
   tiempos, no es un ícono: es la atmósfera de la sección.

   No es una animación con reloj: el cuadro que se ve depende de
   cuánto has recorrido la sección, así que la rama florece al
   ritmo de tu lectura y retrocede si subes.

   Los cuadros se piden sólo cuando la sección se acerca, en
   orden, y el lienzo siempre dibuja el más avanzado que ya haya
   llegado. Nunca hay hueco: si vas más rápido que la red, se ve
   el último cuadro disponible.
   ============================================================ */

window.PROCESO_FONDO = (function () {
  'use strict';

  const CUADROS = 147;
  const RUTA = 'assets/proceso/';
  const ANCHO = 1280, ALTO = 720;   // proporción de los archivos

  let lienzo, ctx, dpr = 1;
  let ancho = 0, alto = 0;
  let avance = 0, dibujado = -1;
  let quieto = false, arrancado = false;
  const imagenes = new Array(CUADROS).fill(null);
  let cargados = 0;

  /* ---------- Carga ------------------------------------------
     De dos en dos y en orden: los primeros cuadros llegan antes
     de que hagan falta, y la cola nunca satura la conexión.
     --------------------------------------------------------- */
  function cargar(desde) {
    if (desde >= CUADROS) return;
    const img = new Image();
    img.decoding = 'async';
    img.onload = function () {
      imagenes[desde] = img;
      cargados++;
      if (cargados === 1 || indice() === desde) pinta(true);
      cargar(desde + 2);
    };
    img.onerror = function () { cargar(desde + 2); };
    img.src = RUTA + String(desde).padStart(3, '0') + '.jpg';
  }

  function arranca() {
    if (arrancado) return;
    arrancado = true;
    cargar(0);
    cargar(1);
  }

  /* ---------- Medidas ---------------------------------------- */
  function mide() {
    if (!lienzo) return;
    const caja = lienzo.getBoundingClientRect();
    if (!caja.width || !caja.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    ancho = caja.width; alto = caja.height;
    lienzo.width  = Math.round(ancho * dpr);
    lienzo.height = Math.round(alto * dpr);
    ctx = lienzo.getContext('2d');
    dibujado = -1;
    pinta(true);
  }

  function indice() {
    const i = Math.round(avance * (CUADROS - 1));
    return Math.max(0, Math.min(CUADROS - 1, i));
  }

  /* El cuadro pedido, o el más cercano por debajo que ya esté
     cargado: así la rama nunca desaparece a media carga. */
  function disponible(i) {
    for (let k = i; k >= 0; k--) if (imagenes[k]) return imagenes[k];
    for (let k = i + 1; k < CUADROS; k++) if (imagenes[k]) return imagenes[k];
    return null;
  }

  function pinta(forzar) {
    if (!ctx) return;
    const i = indice();
    if (!forzar && i === dibujado) return;
    const img = disponible(i);
    if (!img) return;
    dibujado = i;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, ancho, alto);

    // "Cover": a sangre en todo el lienzo, recortando por los
    // lados si hace falta. Es fondo, no una foto enmarcada.
    const escala = Math.max(ancho / ANCHO, alto / ALTO);
    const w = ANCHO * escala, h = ALTO * escala;
    ctx.drawImage(img, (ancho - w) / 2, (alto - h) / 2, w, h);
  }

  return {
    init: function (elemento, sinMovimiento) {
      lienzo = elemento;
      quieto = !!sinMovimiento;
      mide();

      let pendiente = false;
      window.addEventListener('resize', function () {
        if (pendiente) return;
        pendiente = true;
        window.requestAnimationFrame(function () { pendiente = false; mide(); });
      });

      if (quieto) {
        // Sin movimiento: sólo el final, ya en flor.
        avance = 1;
        const img = new Image();
        img.onload = function () { imagenes[CUADROS - 1] = img; cargados++; pinta(true); };
        img.src = RUTA + String(CUADROS - 1).padStart(3, '0') + '.jpg';
        return;
      }

      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) arranca();
        }, { rootMargin: '150% 0px' }).observe(lienzo);
      } else {
        arranca();
      }
    },

    avance: function (p) {
      avance = Math.min(1, Math.max(0, p));
      if (!quieto) pinta(false);
    }
  };
})();
