/* ============================================================
   INBLÜM STUDIO · Comportamiento
   El contenido vive en js/data.js. Aquí está la mecánica: las
   listas de Servicios y Proceso, el grid de Trabajo, la regla del
   proceso, los revelados enganchados al scroll y el formulario.
   El fondo holográfico vive aparte, en js/holo.js.

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

  if (conGsap) {
    window.gsap.registerPlugin(window.ScrollTrigger);

    /* Los límites de cada ScrollTrigger se miden una sola vez,
       apenas se crean. Si eso pasa antes de que Cabinet Grotesk
       o JetBrains Mono terminen de cargar, los títulos cambian
       de tamaño después y todo lo que sigue se recorre: el mapa
       de scroll queda calculado contra una página que ya no
       existe. Se refresca en cuanto las tipografías y las
       imágenes asientan la página de verdad. */
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

  /* ---------- 1. La mancha del estudio -----------------------
     La fotografía de marca, ampliada detrás de la frase. Crece
     muy despacio mientras se recorre la sección: sólo transform,
     nada de repintar.
     --------------------------------------------------------- */

  const mancha = document.querySelector('#mancha');

  if (mancha) {
    mancha.style.backgroundImage = 'url(assets/campo-bajo.png)';
    mancha.style.inset = 'auto -8% -18% auto';
    mancha.style.width = 'clamp(280px, 46vw, 720px)';
    mancha.style.height = 'clamp(280px, 46vw, 720px)';

    if (conGsap) {
      window.gsap.fromTo(mancha,
        { scale: .82, yPercent: 6 },
        {
          scale: 1.08, yPercent: -6, ease: 'none',
          scrollTrigger: {
            trigger: mancha.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
    }
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

  /* ---------- 2. Navegación ---------------------------------- */

  const nav = $('#nav');

  if (nav && 'IntersectionObserver' in window) {
    const centinela = document.createElement('div');
    centinela.setAttribute('aria-hidden', 'true');
    centinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:90px;pointer-events:none;';
    document.body.prepend(centinela);
    new IntersectionObserver(function (e) {
      nav.setAttribute('data-fijo', String(!e[0].isIntersecting));
    }, { threshold: 0 }).observe(centinela);
  }

  /* Mientras cualquier campo índigo (portada, tira o contacto)
     todavía asoma detrás del nav, el nav se queda transparente y
     pasa a blanco (ver .nav[data-sobre-indigo] en el CSS): sin
     esto, el fondo esmerilado se vería otra vez como una tira
     lavanda pegada encima del índigo, sólo que al final de la
     página en vez de al principio. */
  const camposIndigo = $$('.campo-indigo');

  if (nav && camposIndigo.length) {
    let pedidoNav = false;

    function marcarSobreIndigo() {
      pedidoNav = false;
      const altoNav = nav.offsetHeight;
      const sobre = camposIndigo.some(function (c) {
        const r = c.getBoundingClientRect();
        return r.top < altoNav && r.bottom > 0;
      });
      nav.setAttribute('data-sobre-indigo', String(sobre));
    }

    function pedirMarcarSobreIndigo() {
      if (pedidoNav) return;
      pedidoNav = true;
      window.requestAnimationFrame(marcarSobreIndigo);
    }

    marcarSobreIndigo();
    window.addEventListener('scroll', pedirMarcarSobreIndigo, { passive: true });
    window.addEventListener('resize', pedirMarcarSobreIndigo);
  }

  const botonMenu = $('#menu');
  const cortina   = $('#cortina');

  function abrirMenu(abrir) {
    if (!botonMenu || !cortina) return;
    cortina.setAttribute('data-abierta', String(abrir));
    botonMenu.setAttribute('aria-expanded', String(abrir));
    botonMenu.setAttribute('aria-label', abrir ? 'Cerrar el menú' : 'Abrir el menú');
    document.body.style.overflow = abrir ? 'hidden' : '';
    if (abrir) {
      const primero = $('a', cortina);
      if (primero) window.setTimeout(function () { primero.focus(); }, 220);
    }
  }

  if (botonMenu && cortina) {
    botonMenu.addEventListener('click', function () {
      abrirMenu(cortina.getAttribute('data-abierta') !== 'true');
    });
    cortina.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) abrirMenu(false);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && cortina.getAttribute('data-abierta') === 'true') {
        abrirMenu(false);
        botonMenu.focus();
      }
    });
  }

  /* ---------- 3. Tira infinita ------------------------------- */

  const tira = $('#tira-pista');

  if (tira) {
    const bloque = SERVICIOS.map(function (s) {
      return '<span class="tira__item">' + escapar(s.nombre) +
             '<i aria-hidden="true"></i></span>';
    }).join('');
    tira.innerHTML = bloque + bloque;
    tira.setAttribute('aria-hidden', 'true');
  }

  /* ---------- 4. Servicios (sidebar fijo + lista) -------------
     El mismo patrón que Proceso: una fila por servicio, con su
     número y su nombre siempre visibles; el detalle (la frase y
     la lista de qué incluye) se abre con el cursor o el foco, no
     hace falta hacer clic para leer de qué se trata cada uno.
     --------------------------------------------------------- */

  const items = $('#servicios-items');

  if (items) {
    items.innerHTML = SERVICIOS.map(function (s, i) {
      const n = String(i + 1).padStart(2, '0');
      const detalle = s.items.map(function (it, k) {
        return '<li style="--n:' + k + '">' + escapar(it) + '</li>';
      }).join('');
      return '' +
        '<article class="item rev" data-abierta="false" style="--espera:' + (i * 40) + 'ms">' +
          '<button class="item__boton" type="button" id="btn-' + s.id + '"' +
          ' aria-expanded="false" aria-controls="cuerpo-' + s.id + '">' +
            '<span class="item__n">' + n + '</span>' +
            '<span class="item__nombre">' + escapar(s.nombre) + '</span>' +
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

  /* ---------- 5. Piezas de trabajo (grid) --------------------
     Antes era un carrusel de arrastre; a lo Patch, un grid fijo
     de 3 columnas: todas las piezas a la vista, sin arrastrar
     nada. --------------------------------------------------- */

  const piezas = $('#piezas');

  if (piezas) {
    piezas.innerHTML = !PIEZAS.length
      ? '<p class="lead">Estamos preparando esta sección. Mientras tanto, ' +
        'escríbenos y te compartimos el portafolio completo en PDF.</p>'
      : PIEZAS.map(function (p, i) {
        const n = String(i + 1).padStart(2, '0');
        return '' +
          '<figure class="placa rev" style="--espera:' + (i * 40) + 'ms">' +
            '<div class="placa__foto">' +
              '<div class="foto">' +
                '<img src="' + escapar(p.img) + '" alt="' + escapar(p.alt) + '"' +
                ' width="' + (p.ancho || 1600) + '" height="' + (p.alto || 1200) + '"' +
                ' loading="lazy" decoding="async">' +
              '</div>' +
            '</div>' +
            '<figcaption class="placa__pie">' +
              '<span class="placa__n">' + n + '</span>' +
              '<span class="placa__titulo">' + escapar(p.titulo) + '</span>' +
              '<span class="placa__area">' + escapar(p.meta) + '</span>' +
            '</figcaption>' +
          '</figure>';
      }).join('');
  }

  /* ---------- 6. Cuatro tiempos ------------------------------ */

  const tiempos = $('#tiempos');

  if (tiempos) {
    tiempos.innerHTML = PASOS.map(function (p, i) {
      return '' +
        '<div class="tiempo rev" style="--espera:' + (i * 70) + 'ms">' +
          '<span class="tiempo__n" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
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

  /* ---------- 8. Revelados ----------------------------------- */

  const porRevelar = $$('.rev');
  const sinRevelado = /(\?|&)revelado=todo\b/.test(window.location.search);

  if (porRevelar.length) {
    if (sinRevelado || quieto.matches || !('IntersectionObserver' in window)) {
      porRevelar.forEach(function (el) { el.classList.add('dentro'); });
    } else {
      const ojo = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('dentro');
          ojo.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .1 });
      porRevelar.forEach(function (el) { ojo.observe(el); });
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
      // El color del acento entra cuando la frase ya está leída.
      window.ScrollTrigger.create({
        trigger: frase,
        start: 'bottom 62%',
        onEnter: function () {
          $$('.pal--acento', frase).forEach(function (p) { p.classList.add('viva'); });
        }
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
     Una regla que se llena conforme se recorre la sección y una
     marca que baja con ella. El progreso se mide, no se ilustra.
     --------------------------------------------------------- */

  const hilo = $('#hilo');
  const seccionProceso = $('#proceso');

  if (seccionProceso) {
    const pasos = $$('.tiempo', seccionProceso);

    // El tiempo marcado es el que de verdad está a la altura de
    // la vista, no el que toque por cuenta.
    if ('IntersectionObserver' in window && !sinRevelado) {
      const ojoPasos = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          pasos.forEach(function (t) { t.classList.remove('activo'); });
          e.target.classList.add('activo');
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      pasos.forEach(function (t) { ojoPasos.observe(t); });
    }

    function avanzar(p) {
      if (hilo) hilo.style.setProperty('--avance', p.toFixed(3));
      if (sinRevelado || quieto.matches) {
        const activo = Math.min(pasos.length - 1, Math.floor(p * pasos.length));
        pasos.forEach(function (t, i) { t.classList.toggle('activo', i === activo && p > .04); });
      }
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

  /* ---------- 10b. El museo flotante -------------------------
     El campo de objetos que deriva detrás de "Cómo trabajamos".
     Las piezas viven en MUSEO (js/data.js); aquí sólo se arman y
     se les reparte el movimiento.

     Cada pieza necesita rumbo, distancia, giro, paso y punto de
     arranque propios, pero pedirle todo eso a quien edite el
     contenido sería cambiarle un archivo de piezas por una hoja
     de cálculo. Así que eso se deriva del índice: el ángulo
     avanza de 137.5° en 137.5° —el ángulo áureo, el mismo con el
     que una planta reparte sus hojas para que ninguna le tape la
     luz a otra— y el resultado es un reparto que nunca alinea dos
     piezas ni repite un patrón visible.
     --------------------------------------------------------- */

  const museo = $('#museo');

  if (museo && typeof MUSEO !== 'undefined' && MUSEO.length) {
    const capas = {
      fondo:  document.createElement('div'),
      frente: document.createElement('div')
    };
    capas.fondo.className  = 'museo__capa museo__capa--fondo';
    capas.frente.className = 'museo__capa museo__capa--frente';

    MUSEO.forEach(function (o, i) {
      const pieza = o.tipo === 'foto' ? new Image() : document.createElement('span');

      if (o.tipo === 'foto') {
        pieza.src = o.img;
        pieza.alt = '';
        pieza.loading = 'lazy';
        pieza.decoding = 'async';
      }
      pieza.className = 'museo__pieza museo__pieza--' + o.tipo;

      const rumbo = i * 137.5 * Math.PI / 180;
      const salto = 18 + (i % 5) * 7;   // en % del propio ancho

      const e = pieza.style;
      e.setProperty('--x',   o.x + '%');
      e.setProperty('--y',   o.y + '%');
      e.setProperty('--w',   o.w + 'px');
      e.setProperty('--rot', (o.rot || 0) + 'deg');
      e.setProperty('--dx',  (Math.cos(rumbo) * salto).toFixed(2) + '%');
      e.setProperty('--dy',  (Math.sin(rumbo) * salto).toFixed(2) + '%');
      e.setProperty('--giro', ((i % 2 ? 1 : -1) * (3 + i % 5)) + 'deg');
      e.setProperty('--dur',  (16 + (i * 7) % 19) + 's');
      // Retardo negativo: en vez de esperar su turno, cada pieza
      // entra con el ciclo ya empezado. Desde el primer cuadro el
      // campo se ve en movimiento, no arrancando.
      e.setProperty('--esp', '-' + (i * 1.7).toFixed(1) + 's');

      (capas[o.capa] || capas.fondo).appendChild(pieza);
    });

    museo.append(capas.fondo, capas.frente);

    /* Las dos capas se corren distinto: con el cursor, y con lo
       que lleva recorrido la sección. Es lo único que separa un
       campo de estampas de un campo con profundidad. */
    if (!quieto.matches) {
      let pedidoMuseo = false;

      function pintarMuseo() {
        pedidoMuseo = false;
        const c = museo.getBoundingClientRect();
        if (c.bottom < 0 || c.top > window.innerHeight) return;
        // -1 cuando la mesa apenas asoma por abajo, 1 cuando ya
        // casi se fue por arriba.
        const v = (window.innerHeight - c.top) / (window.innerHeight + c.height);
        museo.style.setProperty('--pms', (v * 2 - 1).toFixed(3));
      }

      function pedirMuseo() {
        if (pedidoMuseo) return;
        pedidoMuseo = true;
        window.requestAnimationFrame(pintarMuseo);
      }

      window.addEventListener('scroll', pedirMuseo, { passive: true });
      window.addEventListener('resize', pedirMuseo);
      pintarMuseo();

      if (conPuntero && seccionProceso) {
        seccionProceso.addEventListener('pointermove', function (ev) {
          const c = seccionProceso.getBoundingClientRect();
          museo.style.setProperty('--pmx', ((ev.clientX - c.left) / c.width  * 2 - 1).toFixed(3));
          museo.style.setProperty('--pmy', ((ev.clientY - c.top)  / c.height * 2 - 1).toFixed(3));
        }, { passive: true });

        seccionProceso.addEventListener('pointerleave', function () {
          museo.style.setProperty('--pmx', '0');
          museo.style.setProperty('--pmy', '0');
        });
      }
    }
  }

  /* ---------- 10c. La fotografía de portada respira ----------
     Paralaje corto sobre la imagen del retrato: se mueve menos
     que la página, así el papel parece quedarse quieto detrás.
     --------------------------------------------------------- */

  const pilaObra = $('#obra-pila');

  if (pilaObra && conGsap) {
    window.gsap.to(pilaObra, {
      yPercent: -7,
      ease: 'none',
      scrollTrigger: {
        trigger: '.portada',
        start: 'top top',
        end: 'bottom top',
        scrub: .5
      }
    });
  }

  /* Las láminas de trabajo ya entran solas por el sistema general
     de ".rev" (se les puso esa clase al armarlas, arriba): no hace
     falta una animación de GSAP aparte sólo para ellas. */

  /* ---------- 11b. La secuencia de la portada -----------------
     El cursor recorre la obra como si pasara hojas de una hoja
     de contacto, y el color de todo el rincón se saca de la
     imagen que esté al frente. Los colores no se anotan a mano:
     se leen de cada archivo al cargarlo.
     --------------------------------------------------------- */

  const retrato = $('#retrato');
  const obraCaja = $('#obra-caja');
  const obraPila = $('#obra-pila');
  const obraLogo = $('#obra-logo');
  const obraTitulo = $('#obra-titulo');
  const obraNota = $('#obra-nota');

  if (retrato && obraPila && typeof OBRA !== 'undefined' && OBRA.length) {

    /* Dos colores por imagen: se reparten los píxeles en doce
       tonos, se pesan por saturación y ganan los dos tonos con
       más presencia. Los grises y los extremos no cuentan. */
    function coloresDe(img) {
      const N = 26;
      const c = document.createElement('canvas');
      c.width = c.height = N;
      const x = c.getContext('2d', { willReadFrequently: true });
      try { x.drawImage(img, 0, 0, N, N); } catch (e) { return null; }

      let datos;
      try { datos = x.getImageData(0, 0, N, N).data; } catch (e) { return null; }

      const cubos = [];
      for (let i = 0; i < 12; i++) cubos.push({ r: 0, g: 0, b: 0, peso: 0 });
      let sr = 0, sg = 0, sb = 0, sn = 0;

      for (let i = 0; i < datos.length; i += 4) {
        const r = datos[i], g = datos[i + 1], b = datos[i + 2];
        if (datos[i + 3] < 128) continue;
        sr += r; sg += g; sb += b; sn++;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const luz = (max + min) / 510;
        const sat = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
        if (sat < 0.22 || luz < 0.12 || luz > 0.94) continue;

        let h = 0;
        if (max === r)      h = ((g - b) / (max - min)) % 6;
        else if (max === g) h = (b - r) / (max - min) + 2;
        else                h = (r - g) / (max - min) + 4;
        h = ((h * 60) + 360) % 360;

        const cubo = cubos[Math.floor(h / 30) % 12];
        const peso = sat * (0.4 + luz);
        cubo.r += r * peso; cubo.g += g * peso; cubo.b += b * peso; cubo.peso += peso;
      }

      cubos.sort(function (a, b) { return b.peso - a.peso; });

      function aColor(cubo) {
        if (!cubo || cubo.peso < 0.6) return null;
        return 'rgb(' + Math.round(cubo.r / cubo.peso) + ',' +
                        Math.round(cubo.g / cubo.peso) + ',' +
                        Math.round(cubo.b / cubo.peso) + ')';
      }

      const medio = sn
        ? 'rgb(' + Math.round(sr / sn) + ',' + Math.round(sg / sn) + ',' + Math.round(sb / sn) + ')'
        : 'rgb(120,120,130)';

      return [aColor(cubos[0]) || medio, aColor(cubos[1]) || aColor(cubos[0]) || medio];
    }

    // Marcación: una imagen por obra, apiladas.
    obraPila.innerHTML = OBRA.map(function (o, i) {
      return '<img src="' + escapar(o.img) + '" alt="' + escapar(o.titulo) + '"' +
             (i === 0 ? ' fetchpriority="high"' : ' fetchpriority="low" loading="lazy"') +
             ' decoding="async" class="' + (i === 0 ? 'esta' : '') + '">';
    }).join('');

    // El logotipo: una marca por obra, con la misma fotografía
    // recortada en la forma del wordmark. Crece y se apaga al
    // mismo tiempo que la fotografía de fondo correspondiente.
    if (obraLogo) {
      obraLogo.innerHTML = OBRA.map(function (o, i) {
        return '<span class="retrato__logo-mark' + (i === 0 ? ' esta' : '') +
               '" style="background-image:url(' + escapar(o.img) + ')"></span>';
      }).join('');
    }

    const imagenes = $$('img', obraPila);
    const marcas   = obraLogo ? $$('.retrato__logo-mark', obraLogo) : [];
    const colores  = new Array(OBRA.length).fill(null);
    let actual = 0;

    imagenes.forEach(function (img, i) {
      function leer() {
        const c = coloresDe(img);
        if (c) {
          colores[i] = c;
          // El piso de brillo del logotipo: la textura se mezcla
          // con un degradado de sus propios dos colores, así
          // ninguna foto oscura lo deja ilegible.
          if (marcas[i]) {
            marcas[i].style.backgroundImage =
              'url("' + OBRA[i].img + '"), linear-gradient(135deg,' + c[0] + ',' + c[1] + ')';
          }
        }
        if (i === actual) pintarColor(i);
      }
      if (img.complete && img.naturalWidth) leer();
      else img.addEventListener('load', leer, { once: true });
    });

    function pintarColor(i) {
      const c = colores[i];
      if (!c) return;
      retrato.style.setProperty('--obra-1', c[0]);
      retrato.style.setProperty('--obra-2', c[1]);
    }

    function mostrar(i) {
      i = Math.min(OBRA.length - 1, Math.max(0, i));
      if (i === actual) return;
      actual = i;
      imagenes.forEach(function (img, k) { img.classList.toggle('esta', k === i); });
      marcas.forEach(function (m, k) { m.classList.toggle('esta', k === i); });
      if (obraTitulo) obraTitulo.textContent = OBRA[i].titulo;
      if (obraNota)   obraNota.textContent = OBRA[i].nota;
      pintarColor(i);
    }

    // Sin cursor: la secuencia se pasa sola, despacio.
    let solo = null;
    if (!quieto.matches && OBRA.length > 1 && !conPuntero) {
      let i = 0;
      solo = window.setInterval(function () {
        if (!document.hidden) { i = (i + 1) % OBRA.length; mostrar(i); }
      }, 2600);
    }

    if (obraCaja) {
      obraCaja.addEventListener('pointerenter', function () {
        // Si aparece un cursor de verdad, el pase solo se retira.
        if (solo) { window.clearInterval(solo); solo = null; }
        retrato.setAttribute('data-activa', 'true');
      });

      obraCaja.addEventListener('pointermove', function (ev) {
        const caja = obraCaja.getBoundingClientRect();
        const px = ev.clientX - caja.left;
        // El recorrido horizontal manda: cruzar la imagen de un
        // lado a otro pasa la secuencia entera.
        mostrar(Math.floor((px / caja.width) * OBRA.length));
      }, { passive: true });

      obraCaja.addEventListener('pointerleave', function () {
        retrato.setAttribute('data-activa', 'false');
        mostrar(0);
      });
    }

    window.addEventListener('pagehide', function () {
      if (solo) window.clearInterval(solo);
    });
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
