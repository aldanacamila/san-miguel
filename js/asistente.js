/**
 * asistente.js — Asistente de voz (reconocimiento + respuesta hablada).
 * Para agregar un comando nuevo, sumar una regla al array `reglas` (se evalúan en orden).
 */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var modal = null;

  function tiene(t) { var ks = [].slice.call(arguments, 1); return ks.some(function (k) { return t.indexOf(k) > -1; }); }
  function abrirTramite(titulo, texto) { return function () { SM.irATramite(titulo, texto); }; }

  var reglas = [
    { si: function (t) { return tiene(t, 'hola', 'buen'); },
      reply: '¡Hola! Puedo ayudarte con reclamos, pagos, trámites, turnos de salud, la agenda o el juego de apps. ¿Qué necesitás?' },
    { si: function (t) { return tiene(t, 'reclamo'); }, reply: 'Listo, te llevo a hacer un reclamo.',
      accion: abrirTramite('Reclamo', 'Contanos el problema (baches, luminarias, basura) y lo derivamos al área correspondiente.') },
    { si: function (t) { return tiene(t, 'pagar', 'tasa', 'pago'); }, reply: 'Te llevo al portal de pagos.',
      accion: abrirTramite('Pagos', 'Pagá tasas municipales de forma segura desde el portal de pagos.') },
    { si: function (t) { return tiene(t, 'trámite', 'tramite', 'estado'); }, reply: 'Vamos a consultar el estado de tu trámite.',
      accion: abrirTramite('Consultar trámite', 'Revisá el estado de un trámite que ya iniciaste.') },
    { si: function (t) { return tiene(t, 'turno') && tiene(t, 'salud'); }, reply: 'Te muestro los turnos de salud.',
      accion: abrirTramite('Turnos de salud', 'Reservá o consultá tu turno en los centros de salud municipales.') },
    { si: function (t) { return tiene(t, 'turno'); }, reply: 'Te llevo a sacar un turno.',
      accion: abrirTramite('Turnos', 'Pedí un turno para trámites municipales o de salud.') },
    { si: function (t) { return tiene(t, 'agenda', 'evento'); }, reply: 'Te muestro la agenda municipal.',
      accion: abrirTramite('Agenda municipal', 'Conocé las próximas actividades del municipio.') },
    { si: function (t) { return tiene(t, 'aprend', 'juego') || (tiene(t, 'app') && tiene(t, 'usar')); },
      reply: 'Vamos a practicar con el juego de apps.', accion: function () { location.href = 'juego.html'; } },
    { si: function (t) { return tiene(t, 'modo simple'); },
      reply: function () { return document.body.classList.contains('simple') ? 'Desactivo el Modo Simple.' : 'Activo el Modo Simple.'; },
      accion: function () { SM.a11y.toggleSimple(); } },
    { si: function (t) { return tiene(t, 'contraste'); }, reply: 'Cambio el contraste de la página.', accion: function () { SM.a11y.toggleContrast(); } },
    { si: function (t) { return tiene(t, 'agrand', 'letra grande', 'aumentar'); }, reply: 'Agrando la letra.', accion: function () { SM.a11y.changeFont(1); } },
    { si: function (t) { return tiene(t, 'achic', 'letra chica', 'disminuir'); }, reply: 'Achico la letra.', accion: function () { SM.a11y.changeFont(-1); } },
    { si: function (t) { return tiene(t, 'emergencia', 'same', 'bombero', 'polic'); },
      reply: 'El SAME es 107, Bomberos (011) 4664-2222 y Atención al vecino 147.' },
    { si: function (t) { return tiene(t, 'gracias'); }, reply: '¡De nada! Para eso estoy.' },
    { si: function (t) { return tiene(t, 'ayuda', 'podés', 'podes'); },
      reply: 'Puedo ayudarte a hacer un reclamo, pagar tasas, consultar un trámite, sacar un turno de salud, ver la agenda, jugar para aprender apps, o activar el Modo Simple y el alto contraste.' }
  ];
  var porDefecto = 'No te entendí bien. Probá decir "hacer un reclamo", "pagar tasas" o "turnos de salud", o tocá una opción de abajo.';

  function detenerEscucha() {
    $('aoMicWrap').classList.remove('listening');
    if (window.aoRecognition) { try { window.aoRecognition.stop(); } catch (e) { /* ya detenido */ } }
  }

  SM.asistente = {
    abrir: function () {
      modal = modal || new bootstrap.Modal($('asistenteModal'));
      $('aoStatus').textContent = 'Presioná el micrófono y decime qué necesitás.';
      $('aoBubble').classList.add('d-none');
      modal.show();
    },
    cerrar: function () { if (modal) modal.hide(); },

    escuchar: function () {
      var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Rec) {
        $('aoStatus').textContent = 'Tu navegador no soporta reconocimiento de voz. Probá con Chrome, o tocá una opción de abajo.';
        return;
      }
      var r = new Rec();
      window.aoRecognition = r;
      r.lang = 'es-AR';
      $('aoStatus').textContent = 'Escuchando...';
      $('aoMicWrap').classList.add('listening');
      r.onresult = function (e) { SM.asistente.comando(e.results[0][0].transcript); };
      r.onerror = function () { $('aoStatus').textContent = 'No pude escucharte, probá de nuevo.'; detenerEscucha(); };
      r.onend = detenerEscucha;
      r.start();
    },

    comando: function (texto) {
      var t = texto.toLowerCase();
      var regla = reglas.find(function (r) { return r.si(t); });
      var reply = regla ? (typeof regla.reply === 'function' ? regla.reply() : regla.reply) : porDefecto;

      $('aoTranscript').textContent = '"' + texto + '"';
      $('aoBubble').classList.remove('d-none');
      $('aoStatus').textContent = '';
      $('aoReply').textContent = reply;
      SM.hablar(reply);

      if (regla && regla.accion) {
        setTimeout(function () { SM.asistente.cerrar(); regla.accion(); }, 1500);
      }
    }
  };

  document.addEventListener('hidden.bs.modal', function (e) {
    if (e.target.id === 'asistenteModal') { detenerEscucha(); SM.callar(); }
  });
})();
