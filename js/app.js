/* ============================================================
   INBLÜM STUDIO · Comportamiento
   El contenido vive en js/data.js. Aquí está la mecánica de la
   calca de Homer: el panel, los títulos que se encienden, las
   tarjetas de Trabajo y de Servicios, el carrusel que se arrastra,
   el manifiesto palabra por palabra, las filas del proceso, los
   datos de contacto y el formulario. Sin librerías.
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');

  // "?revelado=todo" deja la página como quedaría ya recorrida (todos
  // los títulos en negro, el manifiesto encendido). Sirve para capturas
  // e impresión.
  const sinRevelado = /(\?|&)revelado=todo\b/.test(window.location.search);

  function escapar(txt) {
    return String(txt)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  const dosCifras = function (n) { return (n < 10 ? '0' : '') + n; };

  // Los pares de colores de la marca, como los acabados de Homer: cada
  // tarjeta lleva uno en sus dos franjas (ver css/tokens.css).
  const ACABADOS = [
    ['var(--flor)',  'var(--flor-luz)'],
    ['var(--cielo)', 'var(--cielo-luz)'],
    ['var(--polen)', 'var(--polen-luz)'],
    ['var(--hoja)',  'var(--hoja-luz)']
  ];
  const acabado = function (k) {
    const a = ACABADOS[k % ACABADOS.length];
    return '--c1:' + a[0] + ';--c2:' + a[1];
  };

  // Las reglas de una lista, con sus cuatro etiquetas diminutas.
  const reglas = function (etiquetas) {
    return '<div class="reglas" aria-hidden="true">' +
      '<span class="regla regla--1 etiqueta">' + escapar(etiquetas[0]) + '</span>' +
      '<span class="regla regla--4 etiqueta">' + escapar(etiquetas[1]) + '</span>' +
      '<span class="regla regla--5 etiqueta">' + escapar(etiquetas[2]) + '</span>' +
      '<span class="regla regla--6 etiqueta">' + escapar(etiquetas[3]) + '</span>' +
    '</div>';
  };

  /* ---------- 1. Trabajo --------------------------------------
     Cada proyecto de PIEZAS es una lista: su nombre en el título fino
     y un carrusel con una tarjeta por pieza. La barra de la tarjeta
     lleva uno de los servicios del proyecto; las franjas, un par de
     colores de la marca; el cuadrado, la pieza entera; las filas, su
     número y el año; el botón verde lleva al contacto.
     --------------------------------------------------------- */

  const piezas = $('#piezas');

  if (piezas && typeof PIEZAS !== 'undefined') {
    piezas.innerHTML = PIEZAS.map(function (p, i) {
      const total = p.celdas.length;
      const cartas = p.celdas.map(function (c, k) {
        const servicio = p.servicios[k % p.servicios.length];
        const carga = i === 0 && k < 3 ? '' : ' loading="lazy"';
        return '' +
          '<article class="carta" style="' + acabado(k) + '">' +
            '<p class="carta__barra"><span>' + escapar(servicio) + '</span></p>' +
            '<div class="carta__franjas" aria-hidden="true"></div>' +
            '<figure class="carta__foto">' +
              '<img src="' + escapar(c.img) + '" alt="' + escapar(c.alt || '') + '"' + carga + ' decoding="async">' +
            '</figure>' +
            '<p class="carta__fila">Pieza ' + dosCifras(k + 1) + ' de ' + dosCifras(total) + '</p>' +
            '<p class="carta__fila">' + escapar(p.anio) + '</p>' +
            '<a class="barra-boton barra-boton--verde carta__boton" href="#contacto">' +
              '<span>Hablemos</span><span aria-hidden="true">&#8599;</span></a>' +
          '</article>';
      }).join('');

      return '' +
        '<div class="lista proyecto" id="proyecto-' + (i + 1) + '">' +
          '<h3 class="titulo">' + escapar(p.titulo) + '</h3>' +
          '<div class="carrusel">' +
            reglas(['Servicio', 'Pieza', 'Año', 'Contacto']) +
            '<div class="carril" tabindex="0" role="group" aria-label="Piezas de ' + escapar(p.titulo) + '">' +
              cartas +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  /* ---------- 2. Servicios ------------------------------------
     Las ocho áreas en el mismo carrusel. En el cuadrado, la frase y
     lo que incluye; el botón amarillo ("Inquire" en Homer) lleva al
     formulario con el área ya elegida.
     --------------------------------------------------------- */

  const servCartas = $('#servicios-cartas');
  const selServicio = $('#servicio');

  if (servCartas && typeof SERVICIOS !== 'undefined') {
    const total = SERVICIOS.length;
    servCartas.innerHTML =
      '<div class="carrusel">' +
        reglas(['Área', 'Número', 'Incluye', 'Cotizar']) +
        '<div class="carril" tabindex="0" role="group" aria-label="Las ocho áreas de trabajo">' +
          SERVICIOS.map(function (s, i) {
            const n = s.items.length;
            return '' +
              '<article class="carta carta--servicio" id="servicio-' + s.id + '" style="' + acabado(i) + '">' +
                '<h3 class="carta__barra"><span>' + escapar(s.nombre) + '</span></h3>' +
                '<div class="carta__franjas" aria-hidden="true"></div>' +
                '<div class="carta__texto">' +
                  '<p class="carta__frase">' + escapar(s.frase) + '</p>' +
                  '<ul class="carta__lista">' + s.items.map(function (it) {
                    return '<li>' + escapar(it) + '</li>';
                  }).join('') + '</ul>' +
                '</div>' +
                '<p class="carta__fila">Área ' + dosCifras(i + 1) + ' de ' + dosCifras(total) + '</p>' +
                '<p class="carta__fila">' + n + (n === 1 ? ' servicio' : ' servicios') + '</p>' +
                '<a class="barra-boton barra-boton--amarillo carta__boton" href="#contacto"' +
                ' data-servicio="' + escapar(s.nombre) + '">' +
                  '<span>Cotizar</span><span aria-hidden="true">&#8599;</span></a>' +
              '</article>';
          }).join('') +
        '</div>' +
      '</div>';

    $$('[data-servicio]', servCartas).forEach(function (a) {
      a.addEventListener('click', function () {
        if (!selServicio) return;
        selServicio.value = a.getAttribute('data-servicio');
        selServicio.dispatchEvent(new Event('change'));
      });
    });
  }

  /* ---------- 3. Proceso: las filas --------------------------- */

  const tiempos = $('#tiempos');

  if (tiempos && typeof PASOS !== 'undefined') {
    tiempos.innerHTML = PASOS.map(function (p, i) {
      return '' +
        '<li class="fila">' +
          '<h3 class="fila__nombre">' + dosCifras(i + 1) + ' ' + escapar(p.nombre) + '</h3>' +
          '<p class="fila__texto">' + escapar(p.texto) + '</p>' +
          '<span class="etiqueta" aria-hidden="true">Paso</span>' +
        '</li>';
    }).join('');
  }

  /* ---------- 4. Datos de contacto, pie y panel --------------- */

  const telLimpio = CONTACTO.telefono.replace(/[^\d+]/g, '');

  const correoEl   = $('#dato-correo');
  const telefonoEl = $('#dato-telefono');
  const ciudadEl   = $('#dato-ciudad');
  const redesEl    = $('#redes');

  if (correoEl) {
    correoEl.textContent = CONTACTO.correo;
    correoEl.href = 'mailto:' + CONTACTO.correo;
  }
  if (telefonoEl) {
    telefonoEl.textContent = CONTACTO.telefono;
    telefonoEl.href = 'tel:' + telLimpio;
  }
  if (ciudadEl) ciudadEl.textContent = CONTACTO.ciudad;
  const estudioCiudad = $('#estudio-ciudad');
  if (estudioCiudad) estudioCiudad.textContent = CONTACTO.ciudad;

  const enlaceRed = function (r) {
    return '<a href="' + escapar(r.url) + '" target="_blank" rel="noopener noreferrer">' +
           escapar(r.nombre) + '</a>';
  };
  if (redesEl) redesEl.innerHTML = CONTACTO.redes.map(enlaceRed).join('');

  const pieCorreo = $('#pie-correo');
  const pieTel    = $('#pie-telefono');
  const pieCiudad = $('#pie-ciudad');
  const pieRedes  = $('#pie-redes');
  if (pieCorreo) { pieCorreo.textContent = CONTACTO.correo; pieCorreo.href = 'mailto:' + CONTACTO.correo; }
  if (pieTel)    { pieTel.textContent = CONTACTO.telefono; pieTel.href = 'tel:' + telLimpio; }
  if (pieCiudad) pieCiudad.textContent = CONTACTO.ciudad;
  if (pieRedes)  pieRedes.insertAdjacentHTML('beforeend', CONTACTO.redes.map(enlaceRed).join(''));

  if (selServicio) {
    selServicio.innerHTML =
      '<option value="">Elige un área</option>' +
      SERVICIOS.map(function (s) {
        return '<option value="' + escapar(s.nombre) + '">' + escapar(s.nombre) + '</option>';
      }).join('') +
      '<option value="Varias áreas">Varias áreas / todavía no lo sé</option>';
  }

  /* ---------- 5. El panel -------------------------------------
     "Menú" arriba y "Todo" abajo abren el mismo panel (un <dialog>:
     atrapa el foco y se cierra con Esc). Se cierra también con la X,
     al elegir una sección o tocando el velo. Debajo de Trabajo, una
     muestra por proyecto; debajo de Servicios, el par de colores de
     cada área.
     --------------------------------------------------------- */

  const panel = $('#panel');

  if (panel) {
    const muestrasTrabajo = $('#panel-trabajo');
    if (muestrasTrabajo && typeof PIEZAS !== 'undefined') {
      muestrasTrabajo.innerHTML = PIEZAS.map(function (p, i) {
        return '<a class="muestra" href="#proyecto-' + (i + 1) + '" data-cierra-panel' +
               ' aria-label="' + escapar(p.titulo) + '">' +
               '<img src="' + escapar(p.celdas[0].img) + '" alt="" loading="lazy" decoding="async"></a>';
      }).join('');
    }
    const muestrasServ = $('#panel-servicios');
    if (muestrasServ && typeof SERVICIOS !== 'undefined') {
      muestrasServ.innerHTML = SERVICIOS.map(function (s, i) {
        return '<a class="muestra" href="#servicio-' + s.id + '" data-cierra-panel' +
               ' aria-label="' + escapar(s.nombre) + '" style="' + acabado(i) + '"></a>';
      }).join('');
    }
    const filas = $('#panel-filas');
    if (filas) {
      filas.innerHTML =
        '<li><a href="mailto:' + escapar(CONTACTO.correo) + '">' + escapar(CONTACTO.correo) + '</a></li>' +
        '<li><a href="tel:' + escapar(telLimpio) + '">' + escapar(CONTACTO.telefono) + '</a></li>' +
        (CONTACTO.redes[0] ? '<li>' + enlaceRed(CONTACTO.redes[0]) + '</li>' : '') +
        '<li><span>México (español)</span></li>';
    }

    const abrir = function () {
      if (typeof panel.showModal === 'function') panel.showModal();
      else panel.setAttribute('open', '');
    };
    const cerrar = function () {
      if (typeof panel.close === 'function') panel.close();
      else panel.removeAttribute('open');
    };

    $$('[data-abre-panel]').forEach(function (b) { b.addEventListener('click', abrir); });
    panel.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-cierra-panel]')) { cerrar(); return; }
      // Un toque en el velo (fuera de la columna) también lo cierra.
      const r = panel.getBoundingClientRect();
      if (ev.target === panel && (ev.clientX < r.left || ev.clientY < r.top ||
          ev.clientX > r.right || ev.clientY > r.bottom)) cerrar();
    });
  }

  /* ---------- 6. Los títulos que se encienden -----------------
     Como en Homer, el título de cada lista está en gris y se vuelve
     negro mientras su lista cruza el centro de la pantalla.
     --------------------------------------------------------- */

  const listas = $$('.lista');

  if (listas.length) {
    if (sinRevelado || !('IntersectionObserver' in window)) {
      listas.forEach(function (l) { l.classList.add('activa'); });
    } else {
      const ojoListas = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) { e.target.classList.toggle('activa', e.isIntersecting); });
      }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });
      listas.forEach(function (l) { ojoListas.observe(l); });
    }
  }

  /* ---------- 7. El manifiesto, palabra por palabra -----------
     Cada palabra pasa del gris al negro conforme se baja; las dos
     palabras clave se marcan en amarillo cuando ya está leído.
     --------------------------------------------------------- */

  const frase = $('#frase');

  if (frase) {
    const texto = frase.textContent.trim();
    const palabras = texto.split(/\s+/);
    frase.setAttribute('aria-label', texto);
    frase.innerHTML = palabras.map(function (p) {
      const acento = /proveedores\.?$/i.test(p) || /equipo,?$/i.test(p);
      return '<span class="pal' + (acento ? ' pal--acento' : '') + '" aria-hidden="true">' + escapar(p) + '</span>';
    }).join(' ');

    const pals = $$('.pal', frase);

    const encender = function () {
      const r = frase.getBoundingClientRect();
      const alto = window.innerHeight;
      // 0 cuando el manifiesto asoma por abajo (78% de la pantalla), 1
      // cuando su final llega al 45%.
      const p = Math.min(1, Math.max(0, (alto * .78 - r.top) / (r.height + alto * .33)));
      const n = Math.round(p * pals.length);
      pals.forEach(function (w, i) { w.classList.toggle('viva', i < n); });
      frase.classList.toggle('leida', p >= 1);
    };

    if (sinRevelado || quieto.matches) {
      pals.forEach(function (w) { w.classList.add('viva'); });
      frase.classList.add('leida');
    } else {
      let pendiente = false;
      window.addEventListener('scroll', function () {
        if (pendiente) return;
        pendiente = true;
        window.requestAnimationFrame(function () { pendiente = false; encender(); });
      }, { passive: true });
      window.addEventListener('resize', encender);
      encender();
    }
  }

  /* ---------- 8. El carrusel que se arrastra ------------------
     Con el trackpad se desliza solo; con el ratón, arrastrando. Si
     hubo arrastre, el clic que lo termina no abre el enlace de la
     tarjeta.
     --------------------------------------------------------- */

  $$('.carril').forEach(function (carril) {
    let x0 = 0;
    let s0 = 0;
    let movido = false;
    let activo = false;

    carril.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType !== 'mouse' || ev.button !== 0) return;
      activo = true;
      movido = false;
      x0 = ev.clientX;
      s0 = carril.scrollLeft;
    });
    carril.addEventListener('pointermove', function (ev) {
      if (!activo) return;
      const dx = ev.clientX - x0;
      if (!movido && Math.abs(dx) > 5) {
        movido = true;
        carril.classList.add('arrastrando');
        carril.setPointerCapture(ev.pointerId);
      }
      if (movido) carril.scrollLeft = s0 - dx;
    });
    const soltar = function () {
      activo = false;
      carril.classList.remove('arrastrando');
    };
    carril.addEventListener('pointerup', soltar);
    carril.addEventListener('pointercancel', soltar);
    carril.addEventListener('click', function (ev) {
      if (movido) { ev.preventDefault(); ev.stopPropagation(); movido = false; }
    }, true);
  });

  /* ---------- 9. Formulario ---------------------------------- */

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
      c.addEventListener('change', function () {
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

  /* ---------- 10. Año del pie -------------------------------- */

  const anio = $('#anio');
  if (anio) anio.textContent = String(new Date().getFullYear());
})();
