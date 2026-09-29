/**
 * home.js — Renderiza el contenido dinámico de index.html a partir de js/data.js.
 */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var e = SM.esc, ic = SM.icon;


  /* Accesos principales */
  $('grid-tramites').innerHTML = SM.tramites.map(function (t) {
    return '<div class="col"><button class="sm-portal" aria-label="' + e(t.t) + '" ' + SM.abrirAttrs(t.t, t.d) + '>' +
      ic(t.ic) + '<strong>' + e(t.t) + '</strong></button></div>';
  }).join('');

  /* Programas y servicios (incluye los contenedores extra) */
  $('grid-programas').innerHTML = SM.programas.map(function (p) {
    return '<div class="col"><button class="sm-prog" aria-label="' + e(p.t + ': ' + p.d) + '" ' + SM.abrirAttrs(p.t, p.d) + '>' +
      '<span class="sm-prog-ic" style="background:' + p.c + '">' + ic(p.ic) + '</span>' +
      '<span class="sm-prog-label">' + e(p.t) + '</span></button></div>';
  }).join('');

  /* Eventos en la ciudad (carrusel) */
  $('lista-eventos').innerHTML = SM.eventos.map(function (ev) {
    return '<button class="sm-event" style="background:' + ev.c + '" aria-label="' + e(ev.t) + '" ' + SM.abrirAttrs(ev.t, ev.d) + '>' +
      '<span class="sm-pill">' + e(ev.cat) + '</span>' + ic(ev.ic, 'sm-event-ic') +
      '<h3>' + e(ev.t) + '</h3><p>' + e(ev.d) + '</p></button>';
  }).join('');

  /* Novedades */
  $('lista-novedades').innerHTML = SM.novedades.map(function (n) {
    return '<div class="col"><article class="card h-100 overflow-hidden">' +
      '<div class="sm-news-img" aria-hidden="true" style="background:' + n.color + '">' + ic(n.ic) + '</div>' +
      '<div class="card-body"><span class="sm-pill mb-2">' + e(n.cat) + '</span>' +
      '<h3 class="h6 fw-bold">' + e(n.t) + '</h3><p class="small text-secondary mb-0">' + e(n.d) + '</p></div></article></div>';
  }).join('');

  SM.home = {
    /* Lupa del navbar */
    toggleBuscar: function () {
      var strip = $('searchStrip');
      strip.classList.toggle('d-none');
      if (!strip.classList.contains('d-none')) $('searchInput').focus();
    },
    buscar: function () {
      var q = $('searchInput').value.toLowerCase().trim();
      var msg = $('searchMsg');
      msg.classList.add('d-none');
      if (!q) return;
      var hit = SM.programas.find(function (p) { return p.t.toLowerCase().indexOf(q) > -1; }) ||
                SM.tramites.find(function (t) { return t.t.toLowerCase().indexOf(q) > -1; });
      if (hit) { SM.irATramite(hit.t, hit.d); return; }
      msg.textContent = 'No encontramos resultados para "' + $('searchInput').value.trim() + '". Te mostramos todos los programas y servicios.';
      msg.classList.remove('d-none');
      $('programas').scrollIntoView({ behavior: 'smooth' });
    },
    /* Flechas del carrusel de eventos */
    scrollEventos: function (dir) {
      var track = $('lista-eventos');
      track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: 'smooth' });
    }
  };
  $('searchInput').addEventListener('keydown', function (ev) { if (ev.key === 'Enter') SM.home.buscar(); });
})();
