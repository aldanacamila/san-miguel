/**
 * asistente.js — Asistente Miguelito (voz + texto) conectado al servidor del bot.
 *
 * - Las acciones de la página (Modo Simple, contraste, letra, juego) se resuelven acá mismo
 *   con el array `reglasLocales`.
 * - Todo lo demás (consultas, trámites, turnos de salud) lo responde Miguelito vía POST /api/chat.
 * - Si el servidor no responde, se usan las reglas de respaldo (`reglasRespaldo`), que son las
 *   del asistente anterior.
 *
 * Servidor: BOT_URL_DEFAULT. Para probar otro servidor sin tocar código, abrir el sitio con
 * ?bot=https://mi-servidor (queda guardado en el navegador; ?bot= vacío vuelve al default).
 */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var modal = null;

  /* ---------- CONFIGURACIÓN ---------- */
  var BOT_URL_DEFAULT = '';          // '' = mismo servidor que el sitio. Ej: 'https://miguelito.midominio.com'
  var POLL_MS = 3000;                // cada cuánto se buscan mensajes nuevos (respuesta de un operador)
  var TIMEOUT_MS = 45000;

  var qsBot = new URLSearchParams(location.search).get('bot');
  if (qsBot !== null) SM.storage.set('sm_bot_url', qsBot);
  var BOT_URL = (SM.storage.get('sm_bot_url', '') || BOT_URL_DEFAULT).replace(/\/+$/, '');

  /* ---------- REGLAS ---------- */
  function tiene(t) { var ks = [].slice.call(arguments, 1); return ks.some(function (k) { return t.indexOf(k) > -1; }); }
  function abrirTramite(titulo, texto) { return function () { SM.irATramite(titulo, texto); }; }

  // Acciones sobre la página: siempre locales. `navega: true` cierra el asistente antes de la acción.
  var reglasLocales = [
    { si: function (t) { return tiene(t, 'modo simple'); },
      reply: function () { return document.body.classList.contains('simple') ? 'Desactivo el Modo Simple.' : 'Activo el Modo Simple.'; },
      accion: function () { SM.a11y.toggleSimple(); } },
    { si: function (t) { return tiene(t, 'contraste'); }, reply: 'Cambio el contraste de la página.', accion: function () { SM.a11y.toggleContrast(); } },
    { si: function (t) { return tiene(t, 'agrand', 'letra grande', 'aumentar'); }, reply: 'Agrando la letra.', accion: function () { SM.a11y.changeFont(1); } },
    { si: function (t) { return tiene(t, 'achic', 'letra chica', 'disminuir'); }, reply: 'Achico la letra.', accion: function () { SM.a11y.changeFont(-1); } },
    { si: function (t) { return tiene(t, 'aprend', 'juego') || (tiene(t, 'app') && tiene(t, 'usar')); },
      reply: 'Vamos a practicar con el juego de apps.', navega: true, accion: function () { location.href = 'juego.html'; } }
  ];

  // Respaldo si el servidor de Miguelito no está disponible (reglas del asistente anterior).
  var reglasRespaldo = [
    { si: function (t) { return tiene(t, 'hola', 'buen'); },
      reply: '¡Hola! Puedo ayudarte con reclamos, pagos, trámites, turnos de salud, la agenda o el juego de apps. ¿Qué necesitás?' },
    { si: function (t) { return tiene(t, 'reclamo'); }, reply: 'Listo, te llevo a hacer un reclamo.', navega: true,
      accion: abrirTramite('Reclamo', 'Contanos el problema (baches, luminarias, basura) y lo derivamos al área correspondiente.') },
    { si: function (t) { return tiene(t, 'pagar', 'tasa', 'pago'); }, reply: 'Te llevo al portal de pagos.', navega: true,
      accion: abrirTramite('Pagos', 'Pagá tasas municipales de forma segura desde el portal de pagos.') },
    { si: function (t) { return tiene(t, 'trámite', 'tramite', 'estado'); }, reply: 'Vamos a consultar el estado de tu trámite.', navega: true,
      accion: abrirTramite('Consultar trámite', 'Revisá el estado de un trámite que ya iniciaste.') },
    { si: function (t) { return tiene(t, 'turno') && tiene(t, 'salud'); }, reply: 'Te muestro los turnos de salud.', navega: true,
      accion: abrirTramite('Turnos de salud', 'Reservá o consultá tu turno en los centros de salud municipales.') },
    { si: function (t) { return tiene(t, 'turno'); }, reply: 'Te llevo a sacar un turno.', navega: true,
      accion: abrirTramite('Turnos', 'Pedí un turno para trámites municipales o de salud.') },
    { si: function (t) { return tiene(t, 'agenda', 'evento'); }, reply: 'Te muestro la agenda municipal.', navega: true,
      accion: abrirTramite('Agenda municipal', 'Conocé las próximas actividades del municipio.') },
    { si: function (t) { return tiene(t, 'emergencia', 'same', 'bombero', 'polic'); },
      reply: 'El SAME es 107, Bomberos (011) 4664-2222 y Atención al vecino 147.' },
    { si: function (t) { return tiene(t, 'gracias'); }, reply: '¡De nada! Para eso estoy.' }
  ];
  var porDefectoRespaldo = 'Ahora no me puedo conectar. Probá decir "hacer un reclamo", "pagar tasas" o "turnos de salud", o llamá al 147.';

  /* ---------- ESTADO ---------- */
  var lastId = 0;
  var mostrados = {};       // ids de mensajes ya dibujados (evita duplicados entre POST y polling)
  var modo = 'AI';
  var pollTimer = null;
  var historialCargado = false;
  var esperando = false;

  function sessionId() {
    var id = SM.storage.get('sm_chat_session', '');
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(id)) {
      id = (window.crypto && crypto.randomUUID)
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
      SM.storage.set('sm_chat_session', id);
    }
    return id;
  }

  function api(method, body, query) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS);
    return fetch(BOT_URL + '/api/chat' + (query || ''), {
      method: method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (timer) clearTimeout(timer);
      var ct = r.headers.get('content-type') || '';
      if (ct.indexOf('application/json') === -1) throw new Error('Respuesta inesperada del servidor (' + r.status + ')');
      return r.json().then(function (d) { d._status = r.status; return d; });
    }, function (err) { if (timer) clearTimeout(timer); throw err; });
  }

  /* ---------- UI ---------- */
  // Los enlaces a páginas de este sitio que manda Miguelito se muestran como botón y navegan acá mismo.
  var SITIO_BASE = 'https://aldanacamila.github.io/san-miguel/';
  var URL_RE = /https?:\/\/[^\s<>"]+/g;

  function limpiarUrl(u) { return u.replace(/[.,;:!?)\]]+$/, ''); }

  /** Texto → HTML seguro: enlaces externos clickeables y botones para las páginas del sitio. */
  function htmlMensaje(texto) {
    var html = '', botones = '', ultimo = 0, m;
    URL_RE.lastIndex = 0;
    while ((m = URL_RE.exec(texto))) {
      // Las URLs del sitio llevan el texto de la página en la query (puede terminar en "."): no recortar
      var url = m[0].indexOf(SITIO_BASE) === 0 ? m[0] : limpiarUrl(m[0]);
      html += SM.esc(texto.slice(ultimo, m.index));
      ultimo = m.index + url.length;
      if (url.indexOf(SITIO_BASE) === 0) {
        var rel = url.slice(SITIO_BASE.length);
        var titulo = new URLSearchParams(rel.split('?')[1] || '').get('titulo') || 'la página';
        botones += '<a class="btn btn-sm btn-primary d-inline-flex align-items-center gap-1 mt-2 me-1" href="' +
          SM.esc(rel) + '">' + SM.icon('open_in_new') + 'Abrir: ' + SM.esc(titulo) + '</a>';
      } else {
        html += '<a href="' + SM.esc(url) + '" target="_blank" rel="noopener">' + SM.esc(url) + '</a>';
      }
    }
    html += SM.esc(texto.slice(ultimo));
    return html.replace(/\s+$/, '') + (botones ? '<div>' + botones + '</div>' : '');
  }

  /** Lo que se lee en voz alta: sin URLs (leerlas no sirve a nadie). */
  function hablar(texto) {
    var sinLinks = texto.replace(URL_RE, '').replace(/\s+/g, ' ').trim();
    if (sinLinks !== texto.replace(/\s+/g, ' ').trim()) sinLinks += ' Te dejé un botón para abrir la página.';
    SM.hablar(sinLinks);
  }

  function agregar(role, texto, id) {
    if (id) {
      if (mostrados[id]) return false;
      mostrados[id] = true;
      if (id > lastId) lastId = id;
    }
    var cls = role === 'user' ? 'user' : role === 'human' ? 'human' : 'bot';
    var quien = role === 'human' ? 'Personal del municipio' : role === 'user' ? '' : 'Miguelito';
    var div = document.createElement('div');
    div.className = 'ao-msg ' + cls;
    div.innerHTML = (quien ? '<span class="ao-who">' + quien + '</span>' : '') + htmlMensaje(texto);
    var chat = $('aoChat');
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return true;
  }

  function estado(texto) { $('aoStatus').textContent = texto || ''; }

  function setModo(m) {
    if (!m || m === modo) return;
    modo = m;
    $('aoMode').textContent = m === 'HUMAN' ? 'Te atiende una persona del municipio' : 'Asistente virtual del municipio';
    if (m === 'HUMAN') estado('Una persona del municipio va a responderte por acá.');
  }

  function bloquear(b) {
    esperando = b;
    $('aoInput').disabled = b;
    $('aoSend').disabled = b;
  }

  /* ---------- CONVERSACIÓN ---------- */
  function cargarHistorial() {
    if (historialCargado) return;
    historialCargado = true;
    api('GET', null, '?sessionId=' + encodeURIComponent(sessionId()) + '&after=0').then(function (d) {
      (d.messages || []).forEach(function (m) { agregar(m.role, m.content, m.id); });
      setModo(d.mode);
    }).catch(function () { /* sin servidor: se verá al enviar */ });
  }

  function buscarNuevos() {
    if (esperando) return;
    api('GET', null, '?sessionId=' + encodeURIComponent(sessionId()) + '&after=' + lastId).then(function (d) {
      (d.messages || []).forEach(function (m) {
        if (agregar(m.role, m.content, m.id) && m.role !== 'user') hablar(m.content);
      });
      setModo(d.mode);
    }).catch(function () { /* reintenta en el próximo ciclo */ });
  }

  function responderLocal(regla, texto) {
    var reply = typeof regla.reply === 'function' ? regla.reply() : regla.reply;
    agregar('user', texto);
    agregar('bot', reply);
    hablar(reply);
    if (regla.accion) {
      if (regla.navega) setTimeout(function () { SM.asistente.cerrar(); regla.accion(); }, 1500);
      else regla.accion();
    }
  }

  function enviar(texto) {
    texto = (texto || '').trim();
    if (!texto || esperando) return;
    var t = texto.toLowerCase();

    var local = reglasLocales.find(function (r) { return r.si(t); });
    if (local) { responderLocal(local, texto); return; }

    agregar('user', texto);
    estado('Miguelito está pensando...');
    bloquear(true);

    api('POST', { sessionId: sessionId(), message: texto }).then(function (d) {
      if (d.userMessageId) { mostrados[d.userMessageId] = true; if (d.userMessageId > lastId) lastId = d.userMessageId; }
      if (d.reply) {
        estado('');
        agregar('assistant', d.reply.content, d.reply.id);
        hablar(d.reply.content);
        setModo(d.mode);
      } else if (d.mode === 'HUMAN') {
        setModo('HUMAN');
        estado('Una persona del municipio va a responderte por acá.');
      } else {
        var msg = d.fallback || d.error || porDefectoRespaldo;
        estado('');
        agregar('bot', msg);
        hablar(msg);
      }
    }).catch(function () {
      // Sin conexión con Miguelito: comportamiento del asistente anterior
      estado('');
      var regla = reglasRespaldo.find(function (r) { return r.si(t); });
      var reply = regla ? (typeof regla.reply === 'function' ? regla.reply() : regla.reply) : porDefectoRespaldo;
      agregar('bot', reply);
      hablar(reply);
      if (regla && regla.accion) setTimeout(function () { SM.asistente.cerrar(); regla.accion(); }, 1500);
    }).then(function () {
      bloquear(false);
      $('aoInput').focus();
    });
  }

  function detenerEscucha() {
    $('aoMicWrap').classList.remove('listening');
    if (window.aoRecognition) { try { window.aoRecognition.stop(); } catch (e) { /* ya detenido */ } }
  }

  SM.asistente = {
    abrir: function () {
      modal = modal || new bootstrap.Modal($('asistenteModal'));
      if (!$('aoChat').children.length) estado('Tocá el micrófono o escribí tu consulta.');
      modal.show();
      cargarHistorial();
      if (!pollTimer) pollTimer = setInterval(buscarNuevos, POLL_MS);
    },
    cerrar: function () { if (modal) modal.hide(); },

    escuchar: function () {
      var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Rec) {
        estado('Tu navegador no soporta reconocimiento de voz. Escribí tu consulta abajo.');
        $('aoInput').focus();
        return;
      }
      SM.callar();
      var r = new Rec();
      window.aoRecognition = r;
      r.lang = 'es-AR';
      estado('Escuchando...');
      $('aoMicWrap').classList.add('listening');
      r.onresult = function (e) { SM.asistente.comando(e.results[0][0].transcript); };
      r.onerror = function () { estado('No pude escucharte, probá de nuevo o escribí tu consulta.'); detenerEscucha(); };
      r.onend = detenerEscucha;
      r.start();
    },

    comando: function (texto) { enviar(texto); }
  };

  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'aoForm') return;
    e.preventDefault();
    var input = $('aoInput');
    var texto = input.value;
    input.value = '';
    enviar(texto);
  });

  document.addEventListener('hidden.bs.modal', function (e) {
    if (e.target.id !== 'asistenteModal') return;
    detenerEscucha();
    SM.callar();
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  });
})();
