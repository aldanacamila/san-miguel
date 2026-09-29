/**
 * accesibilidad.js — Tamaño de letra, alto contraste, Modo Simple y tema claro/oscuro.
 * Las preferencias se guardan en localStorage y se aplican en todas las páginas.
 */
(function () {
  var KEY = { fs: 'msm_fs', contrast: 'msm_contrast', simple: 'msm_simple' };
  var root = document.documentElement;
  var fs = parseFloat(SM.storage.get(KEY.fs, '1')) || 1;

  function setSwitchState(action, on) {
    document.querySelectorAll('[data-action="' + action + '"]').forEach(function (btn) {
      btn.classList.toggle('active', on);
      if (btn.getAttribute('role') === 'switch') btn.setAttribute('aria-checked', String(on));
    });
  }

  function applyTheme() {
    var high = root.getAttribute('data-contrast') === 'high';
    var dark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-bs-theme', (dark && !high) ? 'dark' : 'light');
  }

  SM.a11y = {
    changeFont: function (dir) {
      fs = Math.max(0.85, Math.min(1.6, fs + dir * 0.1));
      root.style.setProperty('--sm-fs', fs);
      SM.storage.set(KEY.fs, fs);
    },
    toggleContrast: function (save) {
      var on = root.getAttribute('data-contrast') !== 'high';
      root.setAttribute('data-contrast', on ? 'high' : 'normal');
      setSwitchState('contraste', on);
      applyTheme();
      if (save !== false) SM.storage.set(KEY.contrast, on ? '1' : '0');
    },
    toggleSimple: function (save) {
      var on = document.body.classList.toggle('simple');
      setSwitchState('modo-simple', on);
      if (save !== false) SM.storage.set(KEY.simple, on ? '1' : '0');
    }
  };

  /* Inicialización */
  root.style.setProperty('--sm-fs', fs);
  applyTheme();
  if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  if (SM.storage.get(KEY.contrast) === '1') SM.a11y.toggleContrast(false);
  if (SM.storage.get(KEY.simple) === '1') SM.a11y.toggleSimple(false);
})();
