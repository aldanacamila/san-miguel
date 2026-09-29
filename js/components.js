/**
 * components.js — UI compartida por todas las páginas: navbar (estructura de zarate.gob.ar),
 * barra de accesibilidad, botones flotantes, modal del asistente, tabbar mobile y footer.
 *
 * Cada página solo necesita estos contenedores vacíos:
 *   <div id="app-header"></div>  <div id="app-a11y"></div>
 *   <div id="app-footer"></div>  <div id="app-floating"></div>
 *
 * Los botones usan `data-action="..."` (sin onclick inline); el despachador del final
 * es el único lugar donde se decide qué hace cada acción.
 */
(function () {
  var current = document.body.dataset.page || 'home';
  var e = SM.esc, ic = SM.icon;

  /* ---------- NAVBAR ---------- */
  function navItem(it, cls) {
    return '<a class="' + cls + '" href="#" ' + SM.abrirAttrs(it.t, it.d) + '>' + e(it.t) + '</a>';
  }

  function renderNav() {
    return SM.nav.map(function (g) {
      var total = g.groups.reduce(function (n, gr) { return n + gr.items.length; }, 0);
      if (total === 1) {
        return '<li class="nav-item">' + navItem(g.groups[0].items[0], 'nav-link') + '</li>';
      }
      var menu = g.groups.map(function (gr) {
        return (gr.h ? '<li><h6 class="dropdown-header">' + e(gr.h) + '</h6></li>' : '') +
          gr.items.map(function (it) { return '<li>' + navItem(it, 'dropdown-item') + '</li>'; }).join('');
      }).join('<li><hr class="dropdown-divider"></li>');
      return '<li class="nav-item dropdown">' +
        '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">' + e(g.t) + '</a>' +
        '<ul class="dropdown-menu' + (g.cols === 2 ? ' sm-dd-2col' : '') + '">' + menu + '</ul></li>';
    }).join('');
  }

  function renderHeader() {
    var buscar = current === 'home'
      ? '<button class="btn sm-icon-btn" data-action="toggle-buscar" aria-label="Buscar">' + ic('search') + '</button>' : '';
    return '' +
      '<header class="sm-header sticky-top"><nav class="navbar navbar-expand-lg" aria-label="Navegación principal"><div class="container-xl">' +
        '<a class="navbar-brand d-flex align-items-center gap-2" href="index.html" aria-label="Municipalidad de San Miguel, ir al inicio">' +
          '<img src="assets/msmlogo-circulo.svg" alt="" width="52" height="52">' +
          '<span class="sm-brand-txt d-none d-sm-block"><small>MUNICIPALIDAD DE</small><strong>SAN MIGUEL</strong></span>' +
        '</a>' +
        '<div class="d-flex align-items-center gap-1 order-lg-last">' + buscar +
          '<button class="navbar-toggler ms-1" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menú"><span class="navbar-toggler-icon"></span></button>' +
        '</div>' +
        '<div class="collapse navbar-collapse" id="mainNav">' +
          '<ul class="navbar-nav mx-lg-auto">' + renderNav() + '</ul>' +
          '<a class="btn btn-primary sm-contact ms-lg-3" href="#" ' + SM.abrirAttrs('Contacto', 'Comunicate con Atención al vecino al 147.') + '>CONTÁCTANOS</a>' +
        '</div>' +
      '</div></nav></header>';
  }

  /* ---------- BARRA DE ACCESIBILIDAD ---------- */
  function renderA11yBar() {
    return '' +
      '<div class="a11y-bar"><div class="container-xl d-flex flex-wrap align-items-center gap-2 py-2">' +
        '<b>Accesibilidad:</b><span>Texto</span>' +
        '<button class="btn btn-sm btn-outline-secondary" data-action="fuente-menos" aria-label="Disminuir tamaño de letra">A-</button>' +
        '<button class="btn btn-sm btn-outline-secondary" data-action="fuente-mas" aria-label="Aumentar tamaño de letra">A+</button>' +
        '<button class="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" data-action="contraste" role="switch" aria-checked="false">' + ic('contrast') + 'Alto contraste</button>' +
        '<button class="btn btn-sm btn-primary d-inline-flex align-items-center gap-1" data-action="modo-simple" role="switch" aria-checked="false">' + ic('accessibility_new') + 'Modo Simple</button>' +
      '</div></div>';
  }

  /* ---------- FOOTER ---------- */
  function renderFooter() {
    var links = [
      ['Portal de pagos', 'Pagá tus tasas municipales desde la web, con tarjeta o débito automático.'],
      ['Guía de trámites', 'Accedé al portal general de trámites municipales.'],
      ['Estacionamiento medido', 'Consultá zonas y tarifas del estacionamiento medido en San Miguel.'],
      ['Licencias de conducir', 'Gestioná la renovación o el trámite inicial de tu licencia de conducir.']
    ].map(function (l) {
      return '<li><a href="#" ' + SM.abrirAttrs(l[0], l[1]) + '>' + e(l[0]) + '</a></li>';
    }).join('');

    var emg = SM.emergencias.map(function (n) {
      return '<div class="col"><a class="sm-emg-item" href="tel:' + n.tel + '"><span class="sm-emg-num">' + e(n.n) + '</span><span class="sm-emg-lbl">' + e(n.t) + '</span></a></div>';
    }).join('');

    return '' +
      '<footer class="sm-footer mt-5"><div class="container-xl py-5">' +
        '<div class="row g-4 align-items-start">' +
          '<div class="col-lg-4"><div class="d-flex align-items-center gap-3 mb-3">' +
            '<img src="assets/msmlogo-circulo.svg" alt="" width="64" height="64">' +
            '<h2 class="h5 mb-0 text-white">Palacio Municipal</h2></div>' +
            '<p class="mb-1"><strong>Domingo F. Sarmiento 1551</strong></p>' +
            '<p class="mb-3">San Miguel, Buenos Aires</p>' +
            '<a class="sm-foot-link d-inline-flex align-items-center gap-1" href="tel:147">' + ic('call') + 'Atención al vecino 147</a></div>' +
          '<div class="col-sm-6 col-lg-3"><h3 class="h6 text-uppercase sm-foot-title">Links rápidos</h3><ul class="list-unstyled sm-foot-links">' + links + '</ul></div>' +
          '<div class="col-sm-6 col-lg-5"><iframe class="sm-map" title="Mapa del Palacio Municipal" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
            'src="https://maps.google.com/maps?q=Domingo%20F.%20Sarmiento%201551%2C%20San%20Miguel%2C%20Buenos%20Aires&t=m&z=16&output=embed"></iframe></div>' +
        '</div>' +
        '<hr class="sm-foot-hr">' +
        '<div class="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 text-center">' + emg + '</div>' +
      '</div>' +
      '<div class="sm-foot-bottom text-center small py-3">Copyright © 2026 Municipalidad de San Miguel</div></footer>';
  }

  /* ---------- FLOTANTES, ASISTENTE Y TABBAR ---------- */
  function tab(iconName, label, attrs, active) {
    var tag = attrs.indexOf('href=') > -1 ? 'a' : 'button';
    return '<' + tag + ' class="tab' + (active ? ' active' : '') + '" ' + attrs + '>' + ic(iconName) + label + '</' + tag + '>';
  }

  function renderFloating() {
    return '' +
      /* Mascota Miguel + sugerencia */
      '<button class="sm-mascot" data-action="mascota" aria-label="Asistente virtual Miguel, sugerencia de accesibilidad"><img src="assets/miguel_bot.png" alt="" width="92"></button>' +
      '<div class="sm-mascot-tip p-3 d-none" id="mascotTip">' +
        '<p class="small mb-2">¿Sabías que podés activar el <b>Modo Simple</b> para una versión más fácil de usar?</p>' +
        '<button class="btn btn-primary btn-sm" data-action="mascota-activar">Activar</button>' +
      '</div>' +
      /* Asistente de voz */
      '<button class="sm-fab sm-fab-assistant" data-action="asistente" aria-label="Abrir asistente de voz">' + ic('mic') + '</button>' +
      '<div class="modal fade" id="asistenteModal" tabindex="-1" aria-label="Asistente de voz" aria-hidden="true">' +
        '<div class="modal-dialog modal-dialog-centered" style="max-width:380px"><div class="modal-content rounded-4 text-center p-4">' +
          '<button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Cerrar asistente"></button>' +
          '<div class="ao-mic-wrap" id="aoMicWrap"><div class="ao-ring r1"></div><div class="ao-ring r2"></div>' +
            '<button class="ao-mic" data-action="escuchar" aria-label="Empezar a hablar">' + ic('mic') + '</button></div>' +
          '<p class="text-secondary small mb-0" id="aoStatus" aria-live="polite" style="min-height:1.3rem"></p>' +
          '<div class="bg-body-tertiary rounded-3 p-3 my-3 text-start d-none" id="aoBubble" aria-live="polite">' +
            '<small class="d-block text-secondary fw-semibold" id="aoTranscript"></small>' +
            '<p class="mb-0 fw-semibold small" id="aoReply"></p></div>' +
          '<div class="d-flex flex-wrap gap-2 justify-content-center">' +
            '<button class="btn btn-sm btn-outline-secondary rounded-pill" data-action="comando" data-cmd="reclamo">Hacer un reclamo</button>' +
            '<button class="btn btn-sm btn-outline-secondary rounded-pill" data-action="comando" data-cmd="pagar tasas">Pagar tasas</button>' +
            '<button class="btn btn-sm btn-outline-secondary rounded-pill" data-action="comando" data-cmd="turno de salud">Turnos de salud</button>' +
            '<button class="btn btn-sm btn-outline-secondary rounded-pill" data-action="comando" data-cmd="ayuda">¿Qué podés hacer?</button>' +
          '</div>' +
        '</div></div></div>' +
      /* Tabbar mobile */
      '<nav class="sm-tabbar fixed-bottom d-flex d-md-none" aria-label="Navegación mobile">' +
        tab('home', 'Inicio', 'href="index.html"', current === 'home') +
        tab('description', 'Trámites', SM.abrirAttrs('Trámites', 'Accedé al portal general de trámites municipales.'), false) +
        tab('apps', 'Programas', 'href="index.html#programas"', false) +
        tab('newspaper', 'Novedades', 'href="index.html#novedades"', false) +
        tab('accessibility_new', 'Modo Simple', 'data-action="modo-simple"', false) +
      '</nav>';
  }

  function mount(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  mount('app-header', renderHeader());
  mount('app-a11y', renderA11yBar());
  mount('app-footer', renderFooter());
  mount('app-floating', renderFloating());

  /* ---------- DESPACHADOR ÚNICO DE ACCIONES ---------- */
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest('[data-action]');
    if (!el) return;
    if (el.tagName === 'A' && el.getAttribute('href') === '#') ev.preventDefault();
    var d = el.dataset;
    switch (d.action) {
      case 'abrir-tramite':     SM.irATramite(d.titulo, d.texto); break;
      case 'fuente-menos':      SM.a11y.changeFont(-1); break;
      case 'fuente-mas':        SM.a11y.changeFont(1); break;
      case 'contraste':         SM.a11y.toggleContrast(); break;
      case 'modo-simple':       SM.a11y.toggleSimple(); break;
      case 'mascota':           document.getElementById('mascotTip').classList.toggle('d-none'); break;
      case 'mascota-activar':   SM.a11y.toggleSimple(); document.getElementById('mascotTip').classList.add('d-none'); break;
      case 'asistente':         SM.asistente.abrir(); break;
      case 'escuchar':          SM.asistente.escuchar(); break;
      case 'comando':           SM.asistente.comando(d.cmd); break;
      case 'toggle-buscar':     SM.home && SM.home.toggleBuscar(); break;
      case 'buscar':            SM.home && SM.home.buscar(); break;
      case 'eventos-prev':      SM.home && SM.home.scrollEventos(-1); break;
      case 'eventos-next':      SM.home && SM.home.scrollEventos(1); break;
      case 'juego-iniciar':     SM.juego && SM.juego.iniciar(false); break;
      case 'juego-repasar':     SM.juego && SM.juego.iniciar(true); break;
      case 'juego-siguiente':   SM.juego && SM.juego.siguiente(); break;
      case 'leer-voz':          SM.tramitePage && SM.tramitePage.leer(); break;
    }
  });
})();
