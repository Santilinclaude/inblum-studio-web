/* ============================================================
   INBLÜM STUDIO · Comportamiento
   El contenido vive en js/data.js. Aquí está la mecánica: el
   lavado del fondo de la primera página, los titulares que entran
   palabra por palabra, las listas de Servicios y Proceso, el grid
   de Trabajo, el vidrio de
   la barra, la regla del proceso, los revelados enganchados al
   scroll (y las franjas del duotono que se dibujan) y el formulario.

   GSAP se carga desde CDN y sólo mejora lo que ya funciona:
   si no llega, todo queda visible y se anima con CSS.
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const quieto     = window.matchMedia('(prefers-reduced-motion: reduce)');
  const conPuntero = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const conGsap    = !quieto.matches && typeof window.gsap !== 'undefined' &&
                     typeof window.ScrollTrigger !== 'undefined';

  // "?revelado=todo" deja la página como quedaría ya recorrida: sin
  // revelados. Sirve para capturas e impresión.
  const sinRevelado = /(\?|&)revelado=todo\b/.test(window.location.search);

  if (conGsap) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    /* Los límites de cada ScrollTrigger se miden una sola vez,
       apenas se crean. Si eso pasa antes de que asienten las
       imágenes (o una tipografía web, si algún día se añade una
       licencia de Helvetica), la página cambia de alto después y
       todo lo que sigue se recorre: el mapa de scroll queda
       calculado contra una página que ya no existe. Se refresca
       en cuanto todo eso termina de cargar. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
    }
    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
  }

  function escapar(txt) {
    return String(txt)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- 0. Apertura (la primera página) -----------------
     Una sola mejora sobre una portada que ya funciona sin ella: el
     lavado. Conforme se baja, el fondo pasa del blanco al verde del
     panel (blanco, --b-lavado-1, --b-lavado-2, --b-verde: los colores
     viven en css/tokens.css). Sólo en escritorio:
     en pantallas chicas el panel llega justo después del texto y no
     hay dónde lavar.
     --------------------------------------------------------- */

  const apertura = $('#inicio');
  const cuerpo   = apertura && $('.ap-cuerpo', apertura);
  const panel    = apertura && $('.ap-panel', apertura);

  if (conGsap && cuerpo && panel) {
    window.gsap.matchMedia().add('(min-width: 1000px)', function () {
      // El lavado dura media pantalla de scroll y termina justo cuando
      // asoma el panel, que ya es del color final. El logotipo y el
      // texto, en medio de la primera pantalla, ya salieron por arriba
      // (o van saliendo, todavía sobre un fondo claro) cuando el fondo
      // se oscurece.
      const paleta = window.getComputedStyle(document.documentElement);
      const tono = function (token) { return paleta.getPropertyValue(token).trim(); };

      const lavado = window.gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: cuerpo,
          start: function () {
            return Math.max(0, window.scrollY + panel.getBoundingClientRect().top - window.innerHeight * 1.5);
          },
          end: function () {
            return window.scrollY + panel.getBoundingClientRect().top - window.innerHeight;
          },
          scrub: true,
          invalidateOnRefresh: true
        }
      })
        .to(apertura, { backgroundColor: tono('--b-lavado-1'), duration: 1 })
        .to(apertura, { backgroundColor: tono('--b-lavado-2'), duration: 1 })
        .to(apertura, { backgroundColor: tono('--b-verde'), duration: 1 });
    });
  }

  /* ---------- 0c. Los titulares, palabra por palabra ----------
     Cada titular de sección se parte en palabras, cada una dentro de
     su máscara, para que suban una tras otra al asomar (la sección 8
     le pone .dentro, como a los demás revelados). El texto sigue
     siendo el mismo para los lectores de pantalla.
     --------------------------------------------------------- */
  $$('.cabecera__titulo').forEach(function (h) {
    const palabras = h.textContent.trim().split(/\s+/);
    h.innerHTML = palabras.map(function (p, k) {
      return '<span class="tt"><span class="tt__in" style="--k:' + k + '">' + escapar(p) + '</span></span>';
    }).join(' ');
    h.classList.add('rev-titulo');
  });

  /* ---------- 0b. El titular que rota -------------------------
     El titular de la Apertura alterna entre las frases de FRASES
     (js/data.js). Cada letra recorre un espectro de colores —del
     rosa al naranja, el amarillo, el celeste y el azul— y se
     desvanece, con un desfase de izquierda a derecha; la frase
     siguiente entra con el mismo recorrido a la inversa. El recorrido
     y el orden son los de la animación de referencia, medidos cuadro
     por cuadro; el ritmo se aceleró (ver T).

     No usa GSAP: el estado de cada letra es una función del tiempo
     (pintar), y un requestAnimationFrame sólo lo avanza. Se pausa
     con el cursor encima (al terminar la transición en curso, para
     que nunca se quede el texto a medio desvanecer) y fuera de
     pantalla, y no corre con "reducir movimiento" ni con
     ?revelado=todo: ahí queda la primera frase.
     --------------------------------------------------------- */

  const titular = $('.rota');

  if (titular && typeof FRASES !== 'undefined' && FRASES.length > 1 &&
      !quieto.matches && !sinRevelado) {

    // Los tiempos, en segundos. Entre paréntesis, lo que medí en la
    // referencia; aquí van más rápidos porque así se sentía largo.
    const T = {
      espera: 3,      // cada frase se queda quieta 3s (referencia: 6)
      salida: .6,     // una letra tarda 0.6s en recorrer el espectro al salir (.93)...
      entrada: .55,   // ...y 0.55s al entrar (.85)
      pasoS: .013,    // desfase entre letras, de izquierda a derecha, por carácter (.0205)
      pasoE: .0138,   // (.0215)
      solape: .7      // la frase siguiente empieza a entrar 0.7s después de que la anterior empezó a salir (1.11)
    };

    // El espectro de una letra al salir, del color base a transparente
    // (al entrar se recorre a la inversa). Son los colores medidos en
    // la referencia, a intervalos iguales.
    const ESPECTRO = [
      '#f8cefe', '#e58ff4', '#e966f5', '#e84b86', '#e63c35', '#f26424', '#f7a541', '#f4cb74',
      '#ecd3ad', '#dcd9fa', '#8cc6f4', '#36b0f2', '#1c92d4', '#1f719f', '#1a4e70', '#1b3142'
    ];

    const rgba = function (hex) {
      const n = parseInt(hex.slice(1), 16);
      return [n >> 16, (n >> 8) & 255, n & 255, 1];
    };
    const rgbBase = window.getComputedStyle(titular).color.match(/[\d.]+/g).map(Number);
    const ultimo  = rgba(ESPECTRO[ESPECTRO.length - 1]);
    const PUNTOS  = [[rgbBase[0], rgbBase[1], rgbBase[2], 1]]
      .concat(ESPECTRO.map(rgba), [[ultimo[0], ultimo[1], ultimo[2], 0]]);
    const TRAMOS  = PUNTOS.length - 1;

    // p = 0 es el color base de la letra; p = 1, transparente.
    function colorEn(p) {
      const x = Math.min(Math.max(p, 0), 1) * TRAMOS;
      const i = Math.min(Math.floor(x), TRAMOS - 1);
      const f = x - i;
      const a = PUNTOS[i];
      const b = PUNTOS[i + 1];
      return 'rgba(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' +
                       Math.round(a[1] + (b[1] - a[1]) * f) + ',' +
                       Math.round(a[2] + (b[2] - a[2]) * f) + ',' +
                       (a[3] + (b[3] - a[3]) * f).toFixed(3) + ')';
    }

    // Cada frase es un bloque con sus letras en <span>; las palabras
    // no se parten (white-space: nowrap) y los espacios cuentan para
    // el desfase, como en la referencia. Sólo la primera frase queda
    // para los lectores de pantalla.
    const frases = FRASES.map(function (texto) {
      const cont = document.createElement('span');
      cont.className = 'rota__frase';
      cont.setAttribute('aria-hidden', 'true');
      const chars = [];
      let n = 0;
      texto.split(' ').forEach(function (palabra, w) {
        if (w > 0) { cont.appendChild(document.createTextNode(' ')); n++; }
        const pal = document.createElement('span');
        pal.className = 'rota__pal';
        Array.from(palabra).forEach(function (ch) {
          const c = document.createElement('span');
          c.textContent = ch;
          pal.appendChild(c);
          chars.push({ el: c, i: n, col: '' });
          n++;
        });
        cont.appendChild(pal);
      });
      return { el: cont, chars: chars, n: n };
    });

    titular.textContent = '';
    frases.forEach(function (f) { titular.appendChild(f.el); });
    titular.setAttribute('aria-label', FRASES[0]);
    titular.classList.add('rota--viva');

    // El calendario de un ciclo completo, con la frase 0 empezando a entrar en t = 0.
    let cursor = 0;
    frases.forEach(function (f) {
      f.e0 = cursor;                                        // empieza a entrar
      f.e1 = f.e0 + (f.n - 1) * T.pasoE + T.entrada;        // ya entró entera
      f.s0 = f.e1 + T.espera;                               // empieza a salir
      f.s1 = f.s0 + (f.n - 1) * T.pasoS + T.salida;         // ya salió entera
      cursor = f.s0 + T.solape;                             // la siguiente empieza a entrar
    });
    const CICLO = cursor;

    function pintar(tau) {
      frases.forEach(function (f, k) {
        // La salida de la última frase se alarga un poco más allá del
        // ciclo, sobre la entrada de la primera.
        let t = tau;
        if (k === frases.length - 1 && tau < f.s1 - CICLO) t = tau + CICLO;

        const dentro = t >= f.e0 && t <= f.s1;
        f.el.classList.toggle('activa', dentro);
        if (!dentro) return;

        f.chars.forEach(function (c) {
          const pe = (t - f.e0 - c.i * T.pasoE) / T.entrada;   // progreso de entrada
          const ps = (t - f.s0 - c.i * T.pasoS) / T.salida;    // progreso de salida
          let col = '';                                        // en reposo: el color base
          if (ps >= 1 || pe <= 0) col = 'rgba(0,0,0,0)';
          else if (ps > 0)        col = colorEn(ps);
          else if (pe < 1)        col = colorEn(1 - pe);
          if (c.col !== col) { c.el.style.color = col; c.col = col; }
        });
      });
    }

    // Reposo: ninguna letra está a mitad de recorrido.
    function enReposo(tau) {
      return frases.some(function (f) { return tau >= f.e1 && tau < f.s0; });
    }

    // Arranca con la primera frase ya entera.
    let reloj     = frases[0].e1;
    let previo    = 0;
    let vista     = true;
    let conCursor = false;   // el cursor está encima
    let congelada = false;   // congelada a mano (para revisar, desde la consola)

    pintar(reloj);

    function marco(ahora) {
      const parar = congelada || (conCursor && enReposo(reloj % CICLO));
      if (previo && vista && !parar) reloj += Math.min(.1, (ahora - previo) / 1000);
      previo = ahora;
      if (vista) pintar(reloj % CICLO);
      window.requestAnimationFrame(marco);
    }
    window.requestAnimationFrame(marco);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { vista = e[0].isIntersecting; }).observe(titular);
    }
    if (conPuntero) {
      titular.addEventListener('pointerenter', function () { conCursor = true; });
      titular.addEventListener('pointerleave', function () { conCursor = false; });
    }

    // Para revisar cualquier instante desde la consola:
    //   document.querySelector('.rota').rotador.ir(9.5)
    titular.rotador = {
      ciclo: CICLO,
      frases: frases.map(function (f) { return { e0: f.e0, e1: f.e1, s0: f.s0, s1: f.s1 }; }),
      pausar: function (si) { congelada = si; },
      tiempo: function () { return reloj % CICLO; },
      enReposo: function (t) { return enReposo(t); },
      ir: function (t) { reloj = t; pintar(reloj % CICLO); }
    };
  }

  /* ---------- 1b. Progreso de la página -----------------------
     La misma barra que se llena en Proceso, pero de toda la
     hoja: cuánto scroll llevas, de un vistazo. Sin GSAP: es un
     valor directo, no necesita easing de librería. */
  const lineaProgreso = $('#progreso-linea');

  if (lineaProgreso) {
    const fijarRecorrido = function () {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const frac = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
      lineaProgreso.style.setProperty('--recorrido', frac.toFixed(4));
    };
    fijarRecorrido();
    let pendienteProgreso = false;
    window.addEventListener('scroll', function () {
      if (pendienteProgreso) return;
      pendienteProgreso = true;
      window.requestAnimationFrame(function () { pendienteProgreso = false; fijarRecorrido(); });
    }, { passive: true });
    window.addEventListener('resize', fijarRecorrido);
  }

  /* ---------- 1c. La barra de arriba --------------------------
     Que quede fija en toda la página es CSS (sticky). Lo único que
     hace el script es marcarla en cuanto se baja (ap-nav--baja), y
     su sombra se hace más honda: ya flota sobre el contenido.
     --------------------------------------------------------- */
  const barra = $('.ap-nav');

  if (barra) {
    const marcarBarra = function () {
      barra.classList.toggle('ap-nav--baja', window.scrollY > 2);
    };
    marcarBarra();
    window.addEventListener('scroll', marcarBarra, { passive: true });
  }

  /* ---------- 1d. La sección en la que estás ------------------
     El enlace de la barra que corresponde a la sección que ocupa el
     centro de la pantalla se subraya (y lleva aria-current), para
     que siempre se sepa dónde se está.
     --------------------------------------------------------- */
  const enlacesBarra = $$('.ap-nav__enlaces a, .ap-nav__cta');

  if (enlacesBarra.length && 'IntersectionObserver' in window) {
    const porSeccion = {};
    enlacesBarra.forEach(function (a) {
      const id = (a.getAttribute('href') || '').slice(1);
      if (id) porSeccion[id] = a;
    });
    const marcarEnlace = function (id) {
      enlacesBarra.forEach(function (a) {
        const es = a === porSeccion[id];
        a.classList.toggle('actual', es);
        if (es) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    };
    const ojoSecciones = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) marcarEnlace(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    ['inicio', 'trabajo', 'estudio', 'servicios', 'proceso', 'contacto'].forEach(function (id) {
      const s = document.getElementById(id);
      if (s) ojoSecciones.observe(s);
    });
  }

  // La barra pasa a vidrio oscuro cuando lo que tiene justo debajo es
  // el cacao del contacto o del pie (una franja fina arriba de la
  // pantalla, a la altura de la barra).
  const oscuros = $$('#contacto, .pie');

  if (barra && oscuros.length && 'IntersectionObserver' in window) {
    const debajo = new Set();
    const ojoOscuro = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) debajo.add(e.target);
        else debajo.delete(e.target);
      });
      barra.classList.toggle('ap-nav--oscura', debajo.size > 0);
    }, { rootMargin: '-20px 0px -94% 0px', threshold: 0 });
    oscuros.forEach(function (o) { ojoOscuro.observe(o); });
  }

  /* ---------- 4. Servicios (sidebar fijo + lista) -------------
     El mismo patrón que Proceso: una fila por servicio, con su
     número y su nombre siempre visibles; el detalle (la frase y
     la lista de qué incluye) se abre con el cursor o el foco, no
     hace falta hacer clic para leer de qué se trata cada uno.
     --------------------------------------------------------- */

  const items = $('#servicios-items');

  // Cada fila abierta se llena con uno de los colores de la marca, en
  // este orden, y con la tinta que le da contraste (ver css/tokens.css).
  const TONOS = [
    ['var(--flor)',  'var(--crema)'],
    ['var(--cielo)', 'var(--crema)'],
    ['var(--polen)', 'var(--tinta)'],
    ['var(--hoja)',  'var(--tinta)']
  ];
  const dosCifras = function (n) { return (n < 10 ? '0' : '') + n; };

  // El duotono: un color de la marca y su luz, en dos franjas (ver .duo
  // en css/styles.css). Mismo orden que TONOS.
  const PARES = ['duo--flor', 'duo--cielo', 'duo--polen', 'duo--hoja'];
  const duo = function (k, clase) {
    return '<span class="duo ' + PARES[k % PARES.length] + (clase ? ' ' + clase : '') +
           '" aria-hidden="true"></span>';
  };

  if (items) {
    items.innerHTML = SERVICIOS.map(function (s, i) {
      const n = dosCifras(i + 1);
      const tono = TONOS[i % TONOS.length];
      const detalle = s.items.map(function (it, k) {
        return '<li style="--n:' + k + '">' + escapar(it) + '</li>';
      }).join('');
      return '' +
        '<article class="item rev" data-abierta="false" style="--espera:' + (i * 40) + 'ms;' +
        '--tono:' + tono[0] + ';--sobre:' + tono[1] + '">' +
          '<button class="item__boton" type="button" id="btn-' + s.id + '"' +
          ' aria-expanded="false" aria-controls="cuerpo-' + s.id + '">' +
            '<span class="item__n">' + n + duo(i, 'item__duo') + '</span>' +
            '<span class="item__nombre">' + escapar(s.nombre) + '</span>' +
            '<span class="item__signo" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="item__cuerpo" id="cuerpo-' + s.id + '" role="region"' +
          ' aria-labelledby="btn-' + s.id + '">' +
            '<div class="item__interior">' +
              '<div class="item__contenido">' +
                '<p class="item__frase">' + escapar(s.frase) + '</p>' +
                '<ul class="item__lista">' + detalle + '</ul>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');

    const filas   = $$('.item', items);
    const botones = $$('.item__boton', items);

    function abrir(indice) {
      filas.forEach(function (f, i) {
        const abierta = i === indice;
        f.setAttribute('data-abierta', String(abierta));
        botones[i].setAttribute('aria-expanded', String(abierta));
      });
    }

    botones.forEach(function (b, i) {
      b.addEventListener('click', function () { abrir(i); });
      b.addEventListener('mouseenter', function () {
        if (conPuntero && !quieto.matches) abrir(i);
      });
      b.addEventListener('focus', function () { abrir(i); });

      b.addEventListener('keydown', function (ev) {
        let destino = null;
        if (ev.key === 'ArrowDown') destino = (i + 1) % botones.length;
        if (ev.key === 'ArrowUp')   destino = (i - 1 + botones.length) % botones.length;
        if (ev.key === 'Home') destino = 0;
        if (ev.key === 'End')  destino = botones.length - 1;
        if (destino === null) return;
        ev.preventDefault();
        botones[destino].focus();
      });
    });

    abrir(0);
  }

  /* ---------- 5. Proyectos de trabajo (galería) ---------------
     Cada proyecto es un mosaico de tres columnas (algunas celdas
     ocupan dos filas) con celdas redondeadas como el recuadro del
     logotipo y, debajo, su duotono y su ficha alineada con las
     columnas: número, nombre con año y servicios. Las piezas reales
     (assets/work) van a color; el relleno (las texturas de assets/obra
     y las fotos de muestra) va en gris hasta que llegue el trabajo
     real, y toma su color con el cursor. Cada celda entra rápido, en
     una cascada corta, y con el cursor encima muestra su rótulo.

     Todo el contenido vive en PIEZAS (js/data.js).
     --------------------------------------------------------- */

  const piezas = $('#piezas');
  const esRelleno = function (src) { return /^https?:|assets\/obra\//.test(src); };

  function celdasHTML(p, i) {
    return p.celdas.map(function (c, k) {
      // Lo que se ve al abrir la página carga de inmediato; el resto,
      // hasta que se acerque.
      const carga = i === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
      const img = '<img src="' + escapar(c.img) + '" alt="' + escapar(c.alt || '') + '"' +
                  carga + ' decoding="async">';
      const clase = 'celda rev' + (c.dispositivo ? ' celda--dispositivo' : '') +
                    (c.alto === 2 ? ' celda--alta' : '') +
                    (esRelleno(c.img) ? ' celda--relleno' : '');
      // El rótulo repite el nombre del proyecto (ya está en su ficha):
      // es sólo para la vista.
      const rotulo = '<figcaption class="celda__rotulo vidrio" aria-hidden="true">' +
                     '<b>' + dosCifras(k + 1) + '/' + dosCifras(p.celdas.length) + '</b>' +
                     '<span>' + escapar(p.titulo) + '</span></figcaption>';
      return '<figure class="' + clase + '" style="--espera:' + (k * 40) + 'ms">' +
             (c.dispositivo ? '<div class="dispositivo">' + img + '</div>' : img) +
             rotulo + '</figure>';
    }).join('');
  }

  if (piezas) {
    piezas.innerHTML = !PIEZAS.length
      ? '<p class="cabecera__lead">Estamos preparando esta sección. Mientras tanto, ' +
        'escríbenos y te compartimos el portafolio completo en PDF.</p>'
      : PIEZAS.map(function (p, i) {
        const cuerpo = '<div class="proyecto__celdas">' + celdasHTML(p, i) + '</div>';

        const etiquetas = p.servicios.map(function (s) {
          return '<li>' + escapar(s) + '</li>';
        }).join('');

        return '' +
          '<article class="proyecto" aria-label="' + escapar(p.titulo) + '">' +
            cuerpo +
            duo(i, 'proyecto__duo') +
            '<div class="proyecto__ficha">' +
              '<p class="proyecto__n">' + dosCifras(i + 1) + '</p>' +
              '<p class="proyecto__nombre">' + escapar(p.titulo) +
                '<span class="proyecto__anio">' + escapar(p.anio) + '</span></p>' +
              '<ul class="proyecto__etiquetas">' + etiquetas + '</ul>' +
            '</div>' +
          '</article>';
      }).join('');
  }

  /* ---------- 6. Cuatro tiempos ------------------------------ */

  const tiempos = $('#tiempos');

  if (tiempos) {
    tiempos.innerHTML = PASOS.map(function (p, i) {
      return '' +
        '<div class="tiempo rev" style="--espera:' + (i * 70) + 'ms">' +
          duo(i, 'tiempo__duo') +
          '<span class="tiempo__n" aria-hidden="true">' + dosCifras(i + 1) + '</span>' +
          '<div>' +
            '<h3 class="tiempo__nombre">' + escapar(p.nombre) + '</h3>' +
            '<p>' + escapar(p.texto) + '</p>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  /* ---------- 7. Datos de contacto --------------------------- */

  const correoEl    = $('#dato-correo');
  const telefonoEl  = $('#dato-telefono');
  const ciudadEl    = $('#dato-ciudad');
  const redesEl     = $('#redes');
  const selServicio = $('#servicio');

  if (correoEl) {
    correoEl.textContent = CONTACTO.correo;
    correoEl.href = 'mailto:' + CONTACTO.correo;
  }
  if (telefonoEl) {
    telefonoEl.textContent = CONTACTO.telefono;
    telefonoEl.href = 'tel:' + CONTACTO.telefono.replace(/[^\d+]/g, '');
  }
  if (ciudadEl) ciudadEl.textContent = CONTACTO.ciudad;

  if (redesEl) {
    redesEl.innerHTML = CONTACTO.redes.map(function (r) {
      return '<a href="' + escapar(r.url) + '" target="_blank" rel="noopener noreferrer">' +
             escapar(r.nombre) + '</a>';
    }).join('');
  }

  if (selServicio) {
    selServicio.innerHTML =
      '<option value="">Elige un área</option>' +
      SERVICIOS.map(function (s) {
        return '<option value="' + escapar(s.nombre) + '">' + escapar(s.nombre) + '</option>';
      }).join('') +
      '<option value="Varias áreas">Varias áreas / todavía no lo sé</option>';
  }

  /* ---------- 7c. Vidrio de verdad ---------------------------
     Lo que hace que una lámina (.vidrio) se lea como vidrio y no como
     una sombra es que dobla lo que tiene detrás, sobre todo en los
     bordes, como una lente. Eso se hace con un filtro SVG en el
     backdrop-filter: un mapa de desplazamiento (rojo para mover en x,
     verde en y, gris neutro en el centro) que empuja hacia afuera lo
     que queda en el canto. El mapa depende del tamaño y del radio de
     cada lámina, así que se talla uno por lámina y se vuelve a tallar
     cuando cambia de tamaño (mientras cambia, queda el vidrio sin
     doblar). Sólo en Chrome (Safari y Firefox no aplican filtros SVG
     al fondo: ahí queda el desenfoque de respaldo del CSS) y en
     pantallas de 700px o más, por rendimiento.
     --------------------------------------------------------- */

  const SVGNS = 'http://www.w3.org/2000/svg';
  const conRefraccion = !!window.chrome &&
    window.matchMedia('(min-width: 700px)').matches &&
    window.CSS && CSS.supports('backdrop-filter', 'url(#a)');

  // El mapa de una lámina de w x h con radio r y un canto de b px: rojo
  // que crece de izquierda a derecha, verde de arriba abajo, y el centro
  // tapado de gris neutro (que no mueve nada) con el borde difuminado.
  // Se pinta una sola vez en un canvas a un cuarto de tamaño (el mapa es
  // suave: el filtro lo estira sin que se note) y se entrega como PNG,
  // para que el navegador no tenga que redibujarlo en cada cuadro.
  const lienzoMapa = document.createElement('canvas');
  function mapaCanto(w, h, r, b) {
    const k = .25;
    const cw = Math.max(4, Math.round(w * k));
    const ch = Math.max(4, Math.round(h * k));
    lienzoMapa.width = cw;
    lienzoMapa.height = ch;
    const c = lienzoMapa.getContext('2d');
    const redondo = function (x, y, a, l, rr) {
      c.beginPath();
      if (c.roundRect) c.roundRect(x, y, a, l, Math.max(0, rr));
      else c.rect(x, y, a, l);
      c.fill();
    };
    c.filter = 'none';
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#000';
    c.fillRect(0, 0, cw, ch);
    const gx = c.createLinearGradient(0, 0, cw, 0);
    gx.addColorStop(0, '#000'); gx.addColorStop(1, '#f00');
    c.fillStyle = gx;
    redondo(0, 0, cw, ch, r * k);
    c.globalCompositeOperation = 'lighter';
    const gy = c.createLinearGradient(0, 0, 0, ch);
    gy.addColorStop(0, '#000'); gy.addColorStop(1, '#0f0');
    c.fillStyle = gy;
    redondo(0, 0, cw, ch, r * k);
    c.globalCompositeOperation = 'source-over';
    c.filter = 'blur(' + (b * k / 2).toFixed(2) + 'px)';
    c.fillStyle = '#808000';
    redondo(b * k, b * k, cw - 2 * b * k, ch - 2 * b * k, (r - b) * k);
    c.filter = 'none';
    return lienzoMapa.toDataURL('image/png');
  }

  if (conRefraccion) {
    const lienzo = document.createElementNS(SVGNS, 'svg');
    lienzo.setAttribute('width', '0');
    lienzo.setAttribute('height', '0');
    lienzo.setAttribute('aria-hidden', 'true');
    lienzo.style.position = 'absolute';
    document.body.appendChild(lienzo);

    let cuenta = 0;
    const tallar = function (el) {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const lente = el.lente || (el.lente = { id: 'lente-' + (cuenta++) });
      if (lente.w === w && lente.h === h) return;
      const r = Math.min(parseFloat(window.getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      const b = Math.round(Math.max(8, Math.min(26, Math.min(w, h) * .16)));
      if (!lente.filtro) {
        lente.filtro = document.createElementNS(SVGNS, 'filter');
        lente.filtro.id = lente.id;
        lente.filtro.setAttribute('filterUnits', 'userSpaceOnUse');
        lente.filtro.setAttribute('primitiveUnits', 'userSpaceOnUse');
        lente.filtro.setAttribute('color-interpolation-filters', 'sRGB');
        lienzo.appendChild(lente.filtro);
      }
      lente.filtro.setAttribute('x', 0);
      lente.filtro.setAttribute('y', 0);
      lente.filtro.setAttribute('width', w);
      lente.filtro.setAttribute('height', h);
      lente.filtro.innerHTML =
        '<feImage x="0" y="0" width="' + w + '" height="' + h + '" preserveAspectRatio="none"' +
        ' result="mapa" href="' + mapaCanto(w, h, r, b) + '"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="mapa" scale="' + (-2.7 * b).toFixed(1) + '"' +
        ' xChannelSelector="R" yChannelSelector="G"/>';
      lente.w = w;
      lente.h = h;
      el.style.setProperty('--refraccion', 'url(#' + lente.id + ')');
    };

    const laminas = $$('.vidrio');
    laminas.forEach(tallar);
    document.documentElement.classList.add('con-refraccion');

    if ('ResizeObserver' in window) {
      const esperas = new Map();
      const ojoTamanos = new ResizeObserver(function (entradas) {
        entradas.forEach(function (e) {
          const el = e.target;
          const l = el.lente;
          if (l && l.w === Math.round(el.offsetWidth) && l.h === Math.round(el.offsetHeight)) return;
          el.style.removeProperty('--refraccion');
          window.clearTimeout(esperas.get(el));
          esperas.set(el, window.setTimeout(function () { tallar(el); }, 160));
        });
      });
      laminas.forEach(function (el) { ojoTamanos.observe(el); });
    }
  }

  /* ---------- 8. Revelados -----------------------------------
     Los bloques suben y aparecen al asomar. Las celdas de la galería
     van aparte y antes: en cuanto asoma su borde (con un pequeño
     adelanto), para que las fotos nunca se hagan esperar. */

  // Las franjas del duotono (las de las cabeceras y las sueltas) se
  // dibujan al asomar.
  $$('.duo, .cabecera__fila').forEach(function (el) { el.classList.add('rev-linea'); });

  const porRevelar = $$('.rev, .rev-titulo, .rev-linea');

  if (porRevelar.length) {
    if (sinRevelado || quieto.matches || !('IntersectionObserver' in window)) {
      porRevelar.forEach(function (el) { el.classList.add('dentro'); });
    } else {
      const alEntrar = function (entradas, observador) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('dentro');
          observador.unobserve(e.target);
        });
      };
      const ojo      = new IntersectionObserver(alEntrar, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
      const ojoFotos = new IntersectionObserver(alEntrar, { rootMargin: '0px 0px 6% 0px', threshold: 0 });
      porRevelar.forEach(function (el) {
        (el.classList.contains('celda') ? ojoFotos : ojo).observe(el);
      });
    }
  }

  /* ---------- 9. La frase, palabra por palabra ---------------
     Cada palabra sube de opacidad conforme se desplaza. Con GSAP
     va enganchada al scroll; sin GSAP, en cascada al entrar.
     --------------------------------------------------------- */

  const frase = $('#frase');

  if (frase) {
    const palabras = frase.textContent.trim().split(/\s+/);
    frase.innerHTML = palabras.map(function (p) {
      const acento = /proveedores\.?$/i.test(p) || /equipo,?$/i.test(p);
      return '<span class="pal' + (acento ? ' pal--acento' : '') + '">' + escapar(p) + '</span>';
    }).join(' ');

    const pals = $$('.pal', frase);

    if (sinRevelado || quieto.matches) {
      pals.forEach(function (p) { p.classList.add('viva'); });
    } else if (conGsap) {
      window.gsap.to(pals, {
        opacity: 1,
        ease: 'none',
        stagger: 1,
        scrollTrigger: {
          trigger: frase,
          start: 'top 78%',
          end: 'bottom 58%',
          scrub: true
        }
      });
      // El resaltado de las palabras clave entra cuando la frase ya está
      // leída, y se va si se vuelve a subir: si se quedara, pintaría de
      // amarillo unas palabras todavía apagadas.
      const acentos = $$('.pal--acento', frase);
      const resaltar = function (si) {
        acentos.forEach(function (p) { p.classList.toggle('viva', si); });
      };
      window.ScrollTrigger.create({
        trigger: frase,
        start: 'bottom 62%',
        onEnter: function () { resaltar(true); },
        onLeaveBack: function () { resaltar(false); }
      });
    } else if ('IntersectionObserver' in window) {
      const ojo2 = new IntersectionObserver(function (e) {
        if (!e[0].isIntersecting) return;
        pals.forEach(function (p, i) {
          window.setTimeout(function () { p.classList.add('viva'); }, i * 45);
        });
        ojo2.disconnect();
      }, { threshold: .35 });
      ojo2.observe(frase);
    }
  }

  /* ---------- 10. El avance del proceso ----------------------
     Una regla que se llena conforme se recorre la sección, con el
     recuadro de flores como marca que avanza. En escritorio los
     cuatro tiempos van en fila y la regla corre a lo ancho, encima de
     ellos; en pantallas chicas van uno bajo otro y la regla no se
     muestra. En los dos casos el tiempo encendido sale del avance: el
     cuarto de recorrido en el que va la regla.
     --------------------------------------------------------- */

  const hilo = $('#hilo');
  const seccionProceso = $('#proceso');

  if (seccionProceso) {
    const pasos = $$('.tiempo', seccionProceso);

    function avanzar(p) {
      if (hilo) hilo.style.setProperty('--avance', p.toFixed(3));
      const activo = Math.min(pasos.length - 1, Math.max(0, Math.ceil(p * pasos.length) - 1));
      pasos.forEach(function (t, i) { t.classList.toggle('activo', i === activo && p > .02); });
    }

    if (sinRevelado || quieto.matches) {
      avanzar(1);
    } else if (conGsap) {
      // El recorrido abarca la sección entera: el árbol termina de
      // florecer junto al último tiempo, no a medio camino.
      window.ScrollTrigger.create({
        trigger: seccionProceso,
        // "top top" / "bottom top" ataba el avance al alto total
        // de la sección: con el título y el aire entre tiempos
        // de por medio, eso son casi dos pantallas de puro
        // desplazamiento antes de que pase nada, y se sentía
        // como que nunca arrancaba. Centrar el primer tiempo
        // tampoco alcanzaba: para centrarlo hay que subirlo casi
        // hasta la mitad de la pantalla, así que seguía sintiéndose
        // tarde. En vez de eso: el avance es 0 en cuanto el primer
        // tiempo asoma (su filo de arriba entra al 80% de la
        // pantalla) y 1 cuando el último ya casi se fue (su filo de
        // abajo llega al 20%). Arranca con la lectura, no a medio
        // camino de ella.
        start: function () {
          const r = pasos[0].getBoundingClientRect();
          return window.scrollY + r.top - window.innerHeight * .8;
        },
        end: function () {
          const r = pasos[pasos.length - 1].getBoundingClientRect();
          return window.scrollY + r.bottom - window.innerHeight * .2;
        },
        scrub: .35,
        invalidateOnRefresh: true,
        onUpdate: function (self) { avanzar(self.progress); },
        onRefresh: function (self) { avanzar(self.progress); }
      });
    } else if ('IntersectionObserver' in window) {
      const total = pasos.length;
      const ojo3 = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          avanzar((pasos.indexOf(e.target) + 1) / total);
        });
      }, { threshold: .5 });
      pasos.forEach(function (t) { ojo3.observe(t); });
    }
  }

  /* ---------- 12. Formulario --------------------------------- */

  const forma  = $('#forma');
  const estado = $('#forma-estado');

  const REGLAS = {
    nombre: {
      valida: function (v) { return v.trim().length >= 2; },
      error: 'Escribe tu nombre para saber cómo dirigirnos a ti.'
    },
    correo: {
      valida: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      error: 'Revisa el correo: falta la arroba o el dominio.'
    },
    servicio: {
      valida: function (v) { return v !== ''; },
      error: 'Elige el área que te interesa. Si son varias, hay una opción para eso.'
    },
    mensaje: {
      valida: function (v) { return v.trim().length >= 12; },
      error: 'Cuéntanos un poco más: al menos una frase sobre el proyecto.'
    }
  };

  function marcar(campo, ok, mensaje) {
    const caja  = campo.closest('.campo');
    const aviso = $('.campo__error', caja);
    caja.setAttribute('data-invalido', String(!ok));
    campo.setAttribute('aria-invalid', String(!ok));
    aviso.textContent = ok ? '' : mensaje;
  }

  function revisar(campo) {
    const regla = REGLAS[campo.name];
    if (!regla) return true;
    const ok = regla.valida(campo.value);
    marcar(campo, ok, regla.error);
    return ok;
  }

  if (forma) {
    const campos = $$('[name]', forma).filter(function (c) { return REGLAS[c.name]; });
    let intentado = false;

    campos.forEach(function (c) {
      c.addEventListener('blur', function () { if (intentado) revisar(c); });
      c.addEventListener('input', function () {
        if (intentado && c.getAttribute('aria-invalid') === 'true') revisar(c);
      });
    });

    forma.addEventListener('submit', function (ev) {
      ev.preventDefault();
      intentado = true;

      const malos = campos.filter(function (c) { return !revisar(c); });

      if (malos.length) {
        estado.setAttribute('data-visible', 'true');
        estado.setAttribute('data-tipo', 'error');
        estado.textContent = malos.length === 1
          ? 'Falta un campo por corregir.'
          : 'Faltan ' + malos.length + ' campos por corregir.';
        malos[0].focus();
        return;
      }

      const boton = $('#enviar', forma);
      const txt   = $('.btn__txt', boton);
      boton.disabled = true;
      txt.textContent = 'Enviando…';
      estado.setAttribute('data-visible', 'true');
      estado.setAttribute('data-tipo', 'espera');
      estado.textContent = 'Preparando tu mensaje…';

      const datos = {
        nombre:   forma.nombre.value.trim(),
        correo:   forma.correo.value.trim(),
        servicio: forma.servicio.value,
        mensaje:  forma.mensaje.value.trim()
      };

      /* Sin servidor: se abre el correo del visitante con el mensaje
         ya escrito. Para recibirlo directo en tu bandeja, crea un
         formulario en formspree.io y cambia este bloque por:

         fetch('https://formspree.io/f/TU_ID', {
           method: 'POST',
           headers: { 'Accept': 'application/json' },
           body: new FormData(forma)
         })
           .then(function (r) { return r.ok ? exito() : falla(); })
           .catch(falla);
      */
      const asunto = 'Proyecto: ' + datos.servicio + ' (' + datos.nombre + ')';
      const cuerpo =
        'Nombre: ' + datos.nombre + '\n' +
        'Correo: ' + datos.correo + '\n' +
        'Área: '   + datos.servicio + '\n\n' +
        datos.mensaje;

      window.setTimeout(function () {
        window.location.href = 'mailto:' + CONTACTO.correo +
          '?subject=' + encodeURIComponent(asunto) +
          '&body='    + encodeURIComponent(cuerpo);
        exito();
      }, 450);

      function restablecer() {
        boton.disabled = false;
        txt.textContent = 'Enviar mensaje';
      }

      function exito() {
        restablecer();
        estado.setAttribute('data-tipo', 'ok');
        estado.textContent = 'Listo. Se abrió tu correo con el mensaje escrito. ' +
          'Si no ocurrió nada, escríbenos a ' + CONTACTO.correo + '.';
        forma.reset();
        campos.forEach(function (c) { marcar(c, true, ''); });
        intentado = false;
      }

      function falla() {
        restablecer();
        estado.setAttribute('data-tipo', 'error');
        estado.textContent = 'No pudimos enviarlo. Escríbenos a ' + CONTACTO.correo + '.';
      }
    });
  }

  /* ---------- 13. Año del pie -------------------------------- */

  const anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
