/* ============================================================
   INBLÜM STUDIO · Fondo holográfico
   Un solo cuadrilátero a pantalla completa con un shader que
   simula la luz refractada en un canto de cristal: campo de
   ondas deformado, paleta iridiscente y un filo especular donde
   el campo cambia rápido.

   Reacciona al tiempo, al cursor y al desplazamiento. Si no hay
   WebGL, o si el visitante pidió menos movimiento, el lienzo se
   retira y el papel se queda solo.
   ============================================================ */

(function () {
  'use strict';

  const lienzo = document.getElementById('holo');
  if (!lienzo) return;

  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (quieto.matches) { lienzo.remove(); return; }

  const gl = lienzo.getContext('webgl', {
    alpha: true, antialias: false, depth: false, stencil: false,
    premultipliedAlpha: false, powerPreference: 'low-power'
  });
  if (!gl) { lienzo.remove(); return; }

  const VERTICE = [
    'attribute vec2 pos;',
    'void main() { gl_Position = vec4(pos, 0.0, 1.0); }'
  ].join('\n');

  const FRAGMENTO = [
    'precision highp float;',
    'uniform vec2  u_res;',
    'uniform float u_tiempo;',
    'uniform vec2  u_raton;',
    'uniform float u_scroll;',

    /* Paleta iridiscente por cosenos: cian, azul, violeta,
       magenta y ámbar, los mismos del canto de un cristal. */
    'vec3 iris(float t) {',
    '  vec3 a = vec3(0.60, 0.58, 0.64);',
    '  vec3 b = vec3(0.40, 0.38, 0.36);',
    '  vec3 c = vec3(1.00, 1.00, 1.00);',
    '  vec3 d = vec3(0.00, 0.16, 0.42);',
    '  return a + b * cos(6.28318 * (c * t + d));',
    '}',

    /* Campo de ondas: cuatro frecuencias que no son múltiplos
       entre sí, para que el patrón nunca se repita a la vista. */
    'float campo(vec2 p, float t) {',
    '  float v = 0.0;',
    '  v += sin(p.x * 1.62 + t * 0.33);',
    '  v += sin(p.y * 1.91 - t * 0.27);',
    '  v += sin((p.x + p.y) * 1.24 + t * 0.21);',
    '  v += 0.65 * sin(length(p - vec2(0.55, -0.35)) * 3.3 - t * 0.38);',
    '  return v / 3.4;',
    '}',

    'void main() {',
    '  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;',
    '  vec2 p  = uv * 2.15;',

    /* Deformación del dominio: lo que separa una superficie
       viva de un degradado plano. */
    '  p += 0.34 * vec2(sin(p.y * 1.42 + u_tiempo * 0.19),',
    '                   cos(p.x * 1.31 - u_tiempo * 0.16));',
    '  p += u_raton * 0.28;',
    '  p.y += u_scroll * 0.75;',

    '  float f = campo(p, u_tiempo);',

    /* Derivada a mano: no depende de extensiones. */
    '  float e  = 0.014;',
    '  float fx = campo(p + vec2(e, 0.0), u_tiempo) - f;',
    '  float fy = campo(p + vec2(0.0, e), u_tiempo) - f;',
    '  float pendiente = length(vec2(fx, fy)) / e;',
    '  float filo = smoothstep(0.55, 2.30, pendiente);',

    '  vec3 color = iris(f * 0.72 + 0.16 + u_raton.x * 0.08);',

    /* El centro se calma para que la tipografía siempre gane; la
       luz se concentra en los márgenes y en los filos del campo,
       que es donde un cristal descompone la luz de verdad. */
    '  float centro = smoothstep(0.06, 0.66, abs(uv.x));',
    '  float arriba = smoothstep(0.16, 0.48, abs(uv.y));',
    '  float borde  = clamp(max(centro, arriba * 0.7), 0.0, 1.0);',
    '  float fuerza = (0.10 + 0.46 * filo) * (0.08 + 0.92 * borde);',

    /* Se mezcla contra blanco: al multiplicarse sobre el papel
       sólo tiñe, nunca ensucia. */
    '  vec3 salida = mix(vec3(1.0), color, clamp(fuerza, 0.0, 1.0));',
    '  gl_FragColor = vec4(salida, 1.0);',
    '}'
  ].join('\n');

  function compilar(tipo, fuente) {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = compilar(gl.VERTEX_SHADER, VERTICE);
  const fs = compilar(gl.FRAGMENT_SHADER, FRAGMENTO);
  if (!vs || !fs) { lienzo.remove(); return; }

  const programa = gl.createProgram();
  gl.attachShader(programa, vs);
  gl.attachShader(programa, fs);
  gl.linkProgram(programa);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) { lienzo.remove(); return; }
  gl.useProgram(programa);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(programa, 'pos');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uRes    = gl.getUniformLocation(programa, 'u_res');
  const uTiempo = gl.getUniformLocation(programa, 'u_tiempo');
  const uRaton  = gl.getUniformLocation(programa, 'u_raton');
  const uScroll = gl.getUniformLocation(programa, 'u_scroll');

  // Media resolución: el patrón es suave, nadie nota la diferencia
  // y el trabajo de la tarjeta gráfica se reduce a la mitad.
  const ESCALA = window.innerWidth < 900 ? 0.42 : 0.55;

  function medir() {
    const w = Math.max(1, Math.round(window.innerWidth  * ESCALA));
    const h = Math.max(1, Math.round(window.innerHeight * ESCALA));
    if (lienzo.width !== w || lienzo.height !== h) {
      lienzo.width = w;
      lienzo.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }
  medir();
  window.addEventListener('resize', medir);

  let ratonX = 0, ratonY = 0, metaX = 0, metaY = 0;
  window.addEventListener('pointermove', function (ev) {
    metaX = (ev.clientX / window.innerWidth  - 0.5) * 2;
    metaY = (ev.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  let avance = 0;
  let corriendo = true;
  document.addEventListener('visibilitychange', function () {
    corriendo = !document.hidden;
    if (corriendo) window.requestAnimationFrame(cuadro);
  });

  const inicio = performance.now();

  function cuadro(ahora) {
    if (!corriendo) return;
    const t = (ahora - inicio) / 1000;

    // El cursor llega con inercia: el material parece pesado.
    ratonX += (metaX - ratonX) * 0.045;
    ratonY += (metaY - ratonY) * 0.045;

    const alto = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    avance += ((window.scrollY / alto) - avance) * 0.08;

    gl.uniform1f(uTiempo, t);
    gl.uniform2f(uRaton, ratonX, ratonY);
    gl.uniform1f(uScroll, avance);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    window.requestAnimationFrame(cuadro);
  }

  window.requestAnimationFrame(cuadro);
})();
