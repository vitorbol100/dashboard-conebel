/* ============================================================
   STORE — persistência em localStorage com fallback em memória
   ============================================================ */
Conebel.store = (function () {
  const KEY = Conebel.constants.STORAGE_KEY;
  let memory = null;

  function load(fallback) {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return clone(fallback);
      const parsed = JSON.parse(raw);

      // validação de compatibilidade
      if (!parsed || !Array.isArray(parsed.kpis) || parsed.kpis.length < 11 ||
          !Array.isArray(parsed.charts) || parsed.charts.length < 7) {
        return clone(fallback);
      }
      return parsed;
    } catch (e) {
      return memory ? clone(memory) : clone(fallback);
    }
  }

  function save(state) {
    memory = clone(state);
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* quota excedida ou modo privado: mantém em memória */
    }
  }

  function clear() {
    memory = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  return { load, save, clear, clone };
})();