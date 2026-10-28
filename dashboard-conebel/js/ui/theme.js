/* ============================================================
   THEME — troca de tema e customização de cores
   ============================================================ */
Conebel.theme = (function () {
  const C = Conebel.constants;
  const { rgbToHex } = Conebel.format;

  const CSS_MAP = {
    tcBg: 'bg', tcCardBg: 'cardBg', tcAccent: 'accent', tcAccentSec: 'accentSec',
    tcPos: 'pos', tcWarn: 'warn', tcNeg: 'neg', tcTextMain: 'textMain'
  };

  const CSS_VARS = {
    bg: '--app-bg', cardBg: '--card-bg', accent: '--accent',
    accentSec: '--accent-sec', pos: '--c-pos', warn: '--c-warn',
    neg: '--c-neg', textMain: '--t-main'
  };

  function applyOverrides(themeKey) {
    const root = document.documentElement;
    const overrides = (Conebel.state.themeOverrides || {})[themeKey];

    Object.entries(CSS_VARS).forEach(([key, cssVar]) => {
      if (overrides && overrides[key]) {
        root.style.setProperty(cssVar, overrides[key]);
      } else {
        root.style.removeProperty(cssVar);
      }
    });
  }

  function switchTheme(themeKey) {
    Conebel.state.theme = themeKey;
    document.documentElement.setAttribute('data-dashboard-theme', themeKey);

    document.querySelectorAll('[data-set-theme]').forEach(btn => {
      const active = btn.getAttribute('data-set-theme') === themeKey;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', String(active));
    });

    const tag = document.getElementById('currentThemeTag');
    if (tag) tag.textContent = (C.THEME_NAMES[themeKey] || themeKey).toUpperCase();

    applyOverrides(themeKey);
    Conebel.store.save(Conebel.state);
    Conebel.render.kpis();
    Conebel.render.charts();
  }

  function openColorDialog() {
    const themeKey = Conebel.state.theme;
    const overrides = (Conebel.state.themeOverrides || {})[themeKey] || {};
    const computed = getComputedStyle(document.documentElement);

    Object.keys(CSS_MAP).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      const key = CSS_MAP[id];
      const fallback = C.THEME_DEFAULTS[key];
      const current = overrides[key] || computed.getPropertyValue(CSS_VARS[key]).trim();
      input.value = rgbToHex(current) || fallback;
    });

    document.getElementById('dlgThemeColors').showModal();
  }

  function bindColorInputs() {
    Object.keys(CSS_MAP).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;

      input.addEventListener('input', () => {
        const themeKey = Conebel.state.theme;
        Conebel.state.themeOverrides = Conebel.state.themeOverrides || {};
        Conebel.state.themeOverrides[themeKey] =
          Conebel.state.themeOverrides[themeKey] || {};

        Conebel.state.themeOverrides[themeKey][CSS_MAP[id]] = input.value;
        applyOverrides(themeKey);
        Conebel.store.save(Conebel.state);
        Conebel.render.charts();
      });
    });
  }

  function resetColors() {
    const themeKey = Conebel.state.theme;
    if (Conebel.state.themeOverrides) delete Conebel.state.themeOverrides[themeKey];
    applyOverrides(themeKey);
    Conebel.store.save(Conebel.state);
    Conebel.render.charts();
    document.getElementById('dlgThemeColors').close();
    Conebel.toast.show('Cores do tema restauradas para o padrão!', { type: 'success' });
  }

  function init() {
    document.querySelectorAll('[data-set-theme]').forEach(btn => {
      btn.addEventListener('click', () => switchTheme(btn.getAttribute('data-set-theme')));
    });

    document.getElementById('btnOpenThemeColors').addEventListener('click', openColorDialog);
    document.getElementById('btnCloseThemeColors').addEventListener('click', () => {
      document.getElementById('dlgThemeColors').close();
    });
    document.getElementById('btnResetThemeColors').addEventListener('click', resetColors);

    bindColorInputs();
  }

  return { switchTheme, applyOverrides, init };
})();