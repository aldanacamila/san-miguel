/**
 * data.js — Contenido del sitio (datos separados de la lógica).
 * Para editar textos, programas, áreas o preguntas del juego, tocar solo este archivo.
 */
window.SM = window.SM || {};

SM.DEMO_NOTE = ' (simulación para la demo del hackatón)';

/** Accesos principales (tarjetas superpuestas al hero). */
SM.tramites = [
  { ic: 'checklist', t: 'Portal de trámites',      d: 'Accedé al portal general de trámites municipales.' },
  { ic: 'local_parking', t: 'Estacionamiento medido',  d: 'Consultá zonas y tarifas del estacionamiento medido en San Miguel.' },
  { ic: 'desktop_windows', t: 'Portal de pagos',         d: 'Pagá tus tasas municipales desde la web, con tarjeta o débito automático.' },
  { ic: 'badge', t: 'Licencias de conducir',   d: 'Gestioná la renovación o el trámite inicial de tu licencia de conducir.' },
  { ic: 'medical_information', t: 'Portal pacientes',        d: 'Ingresá al portal de pacientes de los centros de salud municipales.' }
];

/** Programas y servicios (c = color del ícono). */
SM.programas = [
  { ic: 'forum', c: '#1CADE4', t: 'Atención al vecino',   d: 'Consultas y reclamos, línea 147.' },
  { ic: 'music_note', c: '#F5A623', t: 'Cultura',              d: 'Talleres y espacios culturales.' },
  { ic: 'sports_tennis', c: '#8C8C8C', t: 'Deportes',             d: 'Actividades deportivas municipales.' },
  { ic: 'local_hospital', c: '#6EC6E8', t: 'Salud',                d: 'Hospitales y centros de salud del municipio.' },
  { ic: 'pets', c: '#B7B23A', t: 'Zoonosis',             d: 'Vacunación y cuidado de mascotas.' },
  { ic: 'handshake', c: '#E0536E', t: 'Emprendedores',        d: 'Apoyo a emprendimientos locales.' },
  { ic: 'accessible', c: '#C97B63', t: 'Discapacidad',         d: 'Trámites de CUD y accesibilidad.' },
  { ic: 'menu_book', c: '#2D3A4A', t: 'Educación',            d: 'Escuelas e institutos municipales.' },
  { ic: 'devices', c: '#1B6FC9', t: 'Tecnología',           d: 'UTEC y programas tecnológicos.' },
  { ic: 'child_care', c: '#9B59B6', t: 'Infancia y familia',   d: 'Programas para niñez y familia.' },
  { ic: 'elderly', c: '#E0791E', t: 'Adultos mayores',      d: 'Programas y actividades para la tercera edad.' },
  { ic: 'volunteer_activism', c: '#2FA89A', t: 'Adicciones',           d: 'Centro de día "Nunca es tarde".' },
  { ic: 'eco', c: '#7A5B45', t: 'Ambiente',             d: 'Programas ambientales del municipio.' },
  { ic: 'recycling', c: '#3FA84C', t: 'Reciclaje',            d: 'Puntos verdes y circuito de reciclaje.' },
  { ic: 'home_work', c: '#C9A876', t: 'Tierras y viviendas',  d: 'Trámites de regularización de tierras.' },
  { ic: 'work', c: '#1F5C8B', t: 'Empleo',               d: 'Oficina de empleo municipal.' },
  { ic: 'factory', c: '#F0A93A', t: 'Industria y comercio', d: 'Habilitaciones comerciales.' },
  { ic: 'pedal_bike', c: '#B05060', t: 'Bicicleteros',         d: 'Bicicleteros municipales gratuitos.' },
  { ic: 'autorenew',       c: '#2E7D9A', t: 'Débito automático',     d: 'Adherite al débito automático y ganá tranquilidad todos los meses.', extra: true },
  { ic: 'visibility',      c: '#5B6673', t: 'Ojos en alerta',        d: 'Reportá situaciones sospechosas en tu barrio, tu mirada puede cambiar todo.', extra: true },
  { ic: 'account_balance', c: '#3A6EA5', t: 'Áreas de gobierno',     d: 'Conocé las secretarías que forman parte del municipio.', extra: true },
  { ic: 'public',          c: '#2FA89A', t: 'Gobierno abierto',      d: 'Accedé a información pública y de gestión.', extra: true },
  { ic: 'photo_library',   c: '#E0791E', t: 'San Miguel en imágenes', d: 'Galería de fotos de actividades municipales.', extra: true },
  { ic: 'assignment',      c: '#1CADE4', t: 'Guía de trámites',      d: 'Accedé al portal general de trámites municipales.', extra: true }
];

SM.areas = [
  'Jefatura de Gabinete', 'Secretaría de Gobierno', 'Secretaría de Economía y Finanzas',
  'Secretaría de Salud', 'Secretaría de Obras y Espacio Público', 'Secretaría de Seguridad',
  'Secretaría de Planeamiento y Desarrollo Urbano', 'Secretaría de Infancia y Familia',
  'Secretaría de Educación y Trabajo', 'Secretaría de Comunicación y Deportes'
];

SM.novedades = [
  { cat: 'Seguridad', ic: 'local_police', color: '#5B6673', t: 'Persecución a un auto sin patente en San Miguel',
    d: 'La Policía Municipal detuvo al conductor de un vehículo que circulaba sin patente delantera.' },
  { cat: 'Eventos', ic: 'directions_car', color: '#1CADE4', t: 'Desfile de autos clásicos, motos y bicicletas',
    d: 'Miles de vecinos disfrutaron de una exhibición de vehículos en las principales calles del distrito.' },
  { cat: 'Obras', ic: 'add_road', color: '#8C8C8C', t: 'Avanza la repavimentación de Gaspar Campos',
    d: 'Continúa la repavimentación de la avenida entre Balbín y Arrisueño.' }
];

SM.hero = [
  { e: 'NUEVOS',    h: 'BICICLETEROS MUNICIPALES' },
  { e: 'CAMPAÑA',   h: 'VACUNACIÓN ANTIRRÁBICA GRATUITA' },
  { e: 'INSCRIBITE', h: 'TALLERES CULTURALES 2026' }
];

/** Preguntas del juego "Aprendé a usar apps". c = índice de la opción correcta. */
SM.preguntas = [
  { q: 'Querés mandarle una foto a tu nieto/a. ¿Qué app usás?',
    o: ['WhatsApp', 'Mercado Pago', 'Home banking', 'Mi Argentina'], c: 0,
    exp: 'WhatsApp sirve para mandar mensajes, fotos y hacer videollamadas gratis.' },
  { q: 'Recibiste un cobro y querés pagarlo escaneando un código en el celular. ¿Qué usás?',
    o: ['Mi Argentina', 'Mercado Pago', 'Instagram', 'Contactos'], c: 1,
    exp: 'Mercado Pago permite pagar escaneando un código QR en el comercio.' },
  { q: 'Necesitás tu Libreta de Salud o DNI digital sin llevar el papel. ¿Dónde lo buscás?',
    o: ['Mercado Pago', 'WhatsApp', 'Mi Argentina', 'Google Maps'], c: 2,
    exp: 'Mi Argentina guarda tus documentos oficiales en el celular.' },
  { q: 'Querés saber cuánta plata tenés en el banco sin ir a la sucursal. ¿Qué usás?',
    o: ['La app del banco (home banking)', 'WhatsApp', 'Una cámara de seguridad', 'Netflix'], c: 0,
    exp: 'El home banking te muestra el saldo y los movimientos de tu cuenta.' },
  { q: 'Alguien te pide el "código de un solo uso" por teléfono para "verificar tu cuenta". ¿Qué hacés?',
    o: ['Se lo doy si suena confiable', 'Nunca lo comparto, corto y llamo a mi banco', 'Lo publico en redes', 'Se lo mando por WhatsApp'], c: 1,
    exp: 'Ningún banco o app pide ese código por teléfono. Si te lo piden, es un engaño.' }
];


/** Eventos en la ciudad (carrusel). Reemplazar por los reales; c = color de fondo. */
SM.eventos = [
  { cat: 'Zoonosis',   ic: 'pets',          c: '#B7B23A', t: 'Vacunación antirrábica gratuita',       d: 'Campaña municipal de vacunación para perros y gatos.' },
  { cat: 'Cultura',    ic: 'music_note',    c: '#F5A623', t: 'Talleres culturales 2026',               d: 'Inscripciones abiertas en los espacios culturales del municipio.' },
  { cat: 'Eventos',    ic: 'directions_car', c: '#1CADE4', t: 'Desfile de autos clásicos, motos y bicicletas', d: 'Exhibición de vehículos en las principales calles del distrito.' },
  { cat: 'Movilidad',  ic: 'pedal_bike',    c: '#B05060', t: 'Nuevos bicicleteros municipales',        d: 'Bicicleteros gratuitos para todos los vecinos.' },
  { cat: 'Ambiente',   ic: 'recycling',     c: '#3FA84C', t: 'Puntos verdes y reciclaje',              d: 'Conocé el circuito de reciclaje y los puntos verdes.' },
  { cat: 'Deportes',   ic: 'sports_tennis', c: '#8C8C8C', t: 'Actividades deportivas municipales',     d: 'Propuestas para todas las edades en el distrito.' }
];

/** Números de emergencia (footer). */
SM.emergencias = [
  { n: '107',              tel: '107',         t: 'SAME' },
  { n: '(011) 4664-2222',  tel: '01146642222', t: 'Bomberos' },
  { n: '147',              tel: '147',         t: 'Atención al vecino' },
  { n: '0800-333-1055',    tel: '08003331055', t: 'COM' },
  { n: '(011) 4455-0371',  tel: '01144550371', t: 'Comisaría de la mujer' }
];

/** Menú principal (estructura tomada de zarate.gob.ar). Cada grupo: {h: encabezado, items:[{t,d}]}. */
SM.nav = [
  { t: 'Municipio', groups: [
      { h: 'Áreas de gobierno', items: SM.areas.map(function (a) { return { t: a, d: 'Información de la ' + a + '.' }; }) }
  ] },
  { t: 'Vecino', cols: 2, groups: [
      { items: SM.programas.filter(function (p) { return !p.extra; }).map(function (p) { return { t: p.t, d: p.d }; }) }
  ] },
  { t: 'Trámites y servicios', groups: [
      { items: [{ t: 'Guía de trámites', d: 'Accedé al portal general de trámites municipales.' }].concat(SM.tramites.slice(1).map(function (t) { return { t: t.t, d: t.d }; })) }
  ] },
];