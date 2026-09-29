/**
 * tramite.js — Página de detalle: lee ?titulo=...&texto=... de la URL.
 */
(function () {
  var params = new URLSearchParams(location.search);
  var titulo = params.get('titulo') || 'Trámite';
  var texto = (params.get('texto') || 'Información no disponible.') + SM.DEMO_NOTE;

  document.title = titulo + ' · Municipalidad de San Miguel';
  document.getElementById('tramite-titulo').textContent = titulo;
  document.getElementById('tramite-texto').textContent = texto;

  SM.tramitePage = {
    leer: function () {
      if (!SM.hablar(titulo + '. ' + texto)) alert('Tu navegador no soporta lectura en voz alta.');
    }
  };
  window.addEventListener('pagehide', SM.callar);
})();
