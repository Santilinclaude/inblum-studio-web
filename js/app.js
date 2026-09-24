/* ============================================================
   INBLÜM STUDIO · Comportamiento
   El contenido vive en js/data.js. Aquí está la mecánica: el
   lavado del fondo de la primera página, las listas de Servicios
   y Proceso, el grid de Trabajo, la regla del proceso, los
   revelados enganchados al scroll y el formulario.

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
     lavado. Conforme se baja, el fondo pasa del blanco al marrón del
     panel oscuro (blanco, rubor, arcilla, úmbra) y el texto pasa de
     cacao a durazno cuando el fondo ya está oscuro. Sólo en escritorio:
     en pantallas chicas el panel llega justo después del texto y no
     hay dónde lavar.
     --------------------------------------------------------- */

  const apertura = $('#inicio');
  const cuerpo   = apertura && $('.ap-cuerpo', apertura);
  const panel    = apertura && $('.ap-panel', apertura);
  const cabeza   = apertura && $('.ap-cabeza', apertura);

  if (conGsap && cuerpo && panel && cabeza) {
    window.gsap.matchMedia().add('(min-width: 1000px)', function () {
      // El lavado dura media pantalla de scroll y termina justo cuando
      // asoma el panel, que ya es del color final. El logotipo y el
      // texto se apoyan abajo de la pantalla, así que siguen a la vista
      // mientras el fondo se oscurece: a media subida cambian de cacao
      // a durazno (el color de la declaración) para no perderse sobre
      // el marrón.
      window.gsap.timeline({
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
        .to(apertura, { backgroundColor: '#fae3cf', duration: 1 })
        .to(apertura, { backgroundColor: '#78492d', duration: 1 })
        .to(apertura, { backgroundColor: '#381a06', duration: 1 })
        .to(cabeza,   { color: '#f6c9a1', duration: .06 }, 1.84);
    });
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

  /* ---------- 4. Servicios (sidebar fijo + lista) -------------
     El mismo patrón que Proceso: una fila por servicio, con su
     número y su nombre siempre visibles; el detalle (la frase y
     la lista de qué incluye) se abre con el cursor o el foco, no
     hace falta hacer clic para leer de qué se trata cada uno.
     --------------------------------------------------------- */

  const items = $('#servicios-items');

  if (items) {
    items.innerHTML = SERVICIOS.map(function (s, i) {
      const n = String(i + 1);
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

  /* ---------- 5. Proyectos de trabajo (galería) ---------------
     A lo Grafik: cada proyecto es un mosaico de tres columnas con
     líneas finas entre celdas (algunas ocupan dos filas) y, debajo,
     su ficha en tres columnas alineadas con las celdas: número,
     nombre con año y servicios. Todo el contenido vive en PIEZAS
     (js/data.js).
     --------------------------------------------------------- */

  const piezas = $('#piezas');

  if (piezas) {
    piezas.innerHTML = !PIEZAS.length
      ? '<p class="lead">Estamos preparando esta sección. Mientras tanto, ' +
        'escríbenos y te compartimos el portafolio completo en PDF.</p>'
      : PIEZAS.map(function (p, i) {
        const celdas = p.celdas.map(function (c) {
          // Lo que se ve al abrir la página carga de inmediato; el
          // resto, hasta que se acerque.
          const carga = i === 0 ? ' fetchpriority="high"' : ' loading="lazy"';
          const img = '<img src="' + escapar(c.img) + '" alt="' + escapar(c.alt || '') + '"' +
                      carga + ' decoding="async">';
          const clase = 'celda' + (c.dispositivo ? ' celda--dispositivo' : '') +
                        (c.alto === 2 ? ' celda--alta' : '');
          return '<figure class="' + clase + '">' +
                 (c.dispositivo ? '<div class="dispositivo">' + img + '</div>' : img) +
                 '</figure>';
        }).join('');

        return '' +
          '<article class="proyecto">' +
            '<div class="proyecto__celdas">' + celdas + '</div>' +
            '<div class="proyecto__ficha">' +
              '<p>' + (i + 1) + '</p>' +
              '<p>' + escapar(p.titulo) + '<br>' + escapar(p.anio) + ' —</p>' +
              '<p>' + p.servicios.map(escapar).join('<br>') + '</p>' +
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
          '<span class="tiempo__n" aria-hidden="true">' + String(i + 1) + '</span>' +
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
