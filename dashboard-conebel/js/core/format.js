/* ============================================================
   FORMAT — formatação e parsing de números pt-BR
   ============================================================ */
Conebel.format = (function () {

  function formatVal(val, format) {
    if (val === null || val === undefined || isNaN(val)) return '—';
    const n = Number(val);

    if (format === 'currency') {
      return 'R$ ' + n.toLocaleString('pt-BR', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
      });
    }
    if (format === 'decimal') {
      return n.toLocaleString('pt-BR', {
        minimumFractionDigits: 2, maximumFractionDigits: 2
      });
    }
    if (format === 'hl') {
      return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' hl';
    }
    return n.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  }

  function parseLocaleNumber(str) {
    if (typeof str === 'number') return str;
    if (!str) return 0;
    const clean = String(str)
      .replace(/[R$\shl%]/gi, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const n = parseFloat(clean);
    return isNaN(n) ? 0 : n;
  }

  function rgbToHex(str) {
    if (!str) return '#00D4FF';
    if (str.startsWith('#') && str.length === 7) return str;
    const nums = str.match(/\d+/g);
    if (!nums || nums.length < 3) return '#00D4FF';
    return '#' + nums.slice(0, 3)
      .map(v => Number(v).toString(16).padStart(2, '0'))
      .join('');
  }

  function nowStamp() {
    const d = new Date();
    return d.toLocaleDateString('pt-BR') + ' às ' +
      d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return { formatVal, parseLocaleNumber, rgbToHex, nowStamp };
})();