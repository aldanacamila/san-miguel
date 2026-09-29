/**
 * utils.js — Utilidades compartidas por todas las páginas.
 * Expone el namespace global `SM` (Sistema Municipal) que usan el resto de los scripts.
 */
window.SM = window.SM || {};

/** Escapa texto para insertarlo de forma segura en HTML / atributos. */
SM.esc = function (str) {
  return String(str).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
};

/** localStorage tolerante a errores (modo privado, permisos, etc.). */
SM.storage = {
  get: function (key, fallback) {
    try { var v = localStorage.getItem(key); return v === null ? fallback : v; }
    catch (e) { return fallback; }
  },
  set: function (key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* sin persistencia */ }
  }
};

/** Navega a la página de detalle de un trámite/servicio. */
SM.irATramite = function (titulo, texto) {
  var q = new URLSearchParams({ titulo: titulo, texto: texto || '' });
  window.location.href = 'tramite.html?' + q.toString();
};

/** Lectura en voz alta (Web Speech API). */
SM.hablar = function (texto) {
  if (!('speechSynthesis' in window)) return false;
  var u = new SpeechSynthesisUtterance(texto);
  u.lang = 'es-AR';
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  return true;
};
SM.callar = function () {
  if ('speechSynthesis' in window) speechSynthesis.cancel();
};

/** Ícono de Google Material Symbols (la fuente se carga desde Google Fonts en el <head>). */
SM.icon = function (name, extraClass) {
  return '<span class="material-symbols-outlined ' + (extraClass || '') + '" aria-hidden="true">' + name + '</span>';
};

/** Atributos data-* que abren la página de detalle (los resuelve components.js). */
SM.abrirAttrs = function (titulo, texto) {
  return 'data-action="abrir-tramite" data-titulo="' + SM.esc(titulo) + '" data-texto="' + SM.esc(texto) + '"';
};
