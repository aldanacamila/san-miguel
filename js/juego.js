/**
 * juego.js — Juego "Aprendé a usar las apps" (intro → preguntas → resultado).
 * Preguntas en js/data.js (SM.preguntas).
 */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var vistas = { intro: $('juego-intro'), juego: $('juego-pregunta'), resultado: $('juego-resultado') };
  var idx = 0, score = 0, fallidas = [], activas = [];

  function mostrar(nombre) {
    Object.keys(vistas).forEach(function (k) { vistas[k].classList.toggle('d-none', k !== nombre); });
  }

  function mostrarPregunta() {
    var p = SM.preguntas[activas[idx]];
    $('progress-bar').style.width = Math.round((idx / activas.length) * 100) + '%';
    $('progress').setAttribute('aria-valuenow', Math.round((idx / activas.length) * 100));
    $('pregunta-texto').textContent = (idx + 1) + '. ' + p.q;

    var cont = $('opciones');
    cont.innerHTML = '';
    p.o.forEach(function (texto, i) {
      var b = document.createElement('button');
      b.className = 'opt btn';
      b.textContent = texto;
      b.addEventListener('click', function () { responder(i, b, cont); });
      cont.appendChild(b);
    });
    $('feedback').textContent = '';
    $('feedback').className = 'feedback';
    $('btn-siguiente').classList.add('d-none');
  }

  function responder(i, btn, cont) {
    var qIndex = activas[idx], p = SM.preguntas[qIndex];
    var todas = cont.querySelectorAll('.opt');
    todas.forEach(function (o) { o.disabled = true; });
    var fb = $('feedback');
    if (i === p.c) {
      btn.classList.add('correct'); score++;
      fb.textContent = 'Correcto. ' + p.exp; fb.className = 'feedback ok';
    } else {
      btn.classList.add('wrong'); todas[p.c].classList.add('correct'); fallidas.push(qIndex);
      fb.textContent = 'No era esa. ' + p.exp; fb.className = 'feedback no';
    }
    $('btn-siguiente').classList.remove('d-none');
  }

  function mostrarResultado() {
    $('score-final').textContent = score + ' / ' + activas.length;
    var msg = score === activas.length ? '¡Excelente! Ya conocés bien estas apps.'
      : (score >= activas.length / 2 ? 'Muy bien, vas por buen camino.' : 'Está bueno practicar de nuevo, de a poco se aprende.');
    $('score-msg').textContent = msg;
    $('btn-repasar').classList.toggle('d-none', fallidas.length === 0);
    mostrar('resultado');
  }

  SM.juego = {
    mostrar: mostrar,
    iniciar: function (soloFallidas) {
      activas = (soloFallidas && fallidas.length) ? fallidas.slice() : SM.preguntas.map(function (_, i) { return i; });
      idx = 0; score = 0; fallidas = [];
      mostrar('juego');
      mostrarPregunta();
    },
    siguiente: function () {
      idx++;
      if (idx >= activas.length) mostrarResultado(); else mostrarPregunta();
    }
  };
})();
