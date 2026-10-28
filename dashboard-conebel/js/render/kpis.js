/* ============================================================
   RENDER KPIs
   ============================================================ */
Conebel.render = Conebel.render || {};

Conebel.render.kpis = (function () {
  const { formatVal, parseLocaleNumber } = Conebel.format;
  const C = Conebel.constants;

  const ICONS = {
    vault: '<path d="M3 10V7a9 9 0 0118 0v3M5 10h14v10H5z"/><circle cx="12" cy="15" r="2"/>',
    cube: '<path d="M12 2l9 5v10l-9 5-9-5V7l9-5z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    cylinders: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-5 3 3 5-7"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    tag: '<path d="M20 12l-8 8-9-9V3h8l9 9z"/><circle cx="7" cy="7" r="1.5"/>',
    shield: '<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>',
    document: '<path d="M6 2h8l4 4v16H6z"/><path d="M14 2v4h4M9 12h6M9 16h6"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 2v5M16 2v5"/>',
    'arrow-up': '<circle cx="12" cy="12" r="9"/><path d="M12 16V8M8 12l4-4 4 4"/>'
  };

  function iconSvg(name) {
    const path = ICONS[name] || ICONS.chart;
    return `<svg class="kpi-icon" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.6"
      stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }

  function currentValue(kpi) {
    return kpi.manualVal !== null && kpi.manualVal !== undefined
      ? kpi.manualVal : kpi.sheetVal;
  }

  function buildHalfInnerHtml(kpi) {
    const val = currentValue(kpi);
    const suffix = kpi.valSuffix || '';
    const isManual = kpi.manualVal !== null && kpi.manualVal !== undefined;

    return `
      <div class="kpi-head">
        <span class="kpi-title" contenteditable="true" data-field="title">${kpi.title}</span>
        ${iconSvg(kpi.icon)}
      </div>
      <div class="kpi-value ${kpi.colorType || ''}" contenteditable="true" data-field="val">
        ${formatVal(val, kpi.format)}${suffix}
      </div>
      ${isManual ? `<button class="manual-tag" data-action="revert-val">✏️ Manual ↺</button>` : ''}
      ${kpi.banner ? `<span class="kpi-banner" contenteditable="true" data-field="banner">${kpi.banner}</span>` : ''}
      ${kpi.subdetail ? `<div class="kpi-subdetail" contenteditable="true" data-field="subdetail">${kpi.subdetail}</div>` : ''}
      ${kpi.bm1 ? `<div class="kpi-bm">${kpi.bm1}</div>` : ''}
    `;
  }

  function setupHalfListeners(halfEl, kpi, refreshFn) {
    halfEl.querySelectorAll('[contenteditable="true"]').forEach(node => {
      node.addEventListener('blur', () => {
        const field = node.dataset.field;
        if (!field) return;

        if (field === 'val') {
          kpi.manualVal = parseLocaleNumber(node.textContent);
        } else {
          kpi[field] = node.innerHTML.trim();
        }
        Conebel.store.save(Conebel.state);
        refreshFn();
      });
    });

    const revert = halfEl.querySelector('[data-action="revert-val"]');
    if (revert) {
      revert.addEventListener('click', () => {
        kpi.manualVal = null;
        Conebel.store.save(Conebel.state);
        refreshFn();
        Conebel.toast.show('Valor restaurado para o original da planilha', { type: 'success' });
      });
    }

    halfEl.querySelectorAll('.btn-edit, .btn-card-quick-edit').forEach(btn => {
      btn.addEventListener('click', () => Conebel.drawer.open(kpi, 'kpis', refreshFn));
    });
  }

  function render() {
    const container = document.getElementById('kpisContainer');
    if (!container) return;

    container.innerHTML = '';
    const state = Conebel.state;
    const rendered = new Set();

    C.CARD_LAYOUT.forEach(blockDef => {
      if (blockDef.type === 'combo') {
        const kpi1 = state.kpis.find(k => k.id === blockDef.kpiIds[0]);
        const kpi2 = state.kpis.find(k => k.id === blockDef.kpiIds[1]);
        if (!kpi1 || !kpi2) return;

        const card = document.createElement('article');
        card.className = `glass-card kpi-combo-card ${blockDef.barClass}`;

        [kpi1, kpi2].forEach(kpi => {
          const half = document.createElement('div');
          half.className = 'kpi-half';
          half.dataset.id = kpi.id;
          half.innerHTML = buildHalfInnerHtml(kpi);
          card.appendChild(half);
          setupHalfListeners(half, kpi, Conebel.render.kpis);
          rendered.add(kpi.id);
        });

        container.appendChild(card);
      } else {
        const kpi = state.kpis.find(k => k.id === blockDef.kpiIds[0]);
        if (!kpi) return;

        const card = document.createElement('article');
        card.className = `glass-card kpi-card ${blockDef.barClass}`;
        card.dataset.id = kpi.id;
        card.innerHTML = buildHalfInnerHtml(kpi);
        container.appendChild(card);
        setupHalfListeners(card, kpi, Conebel.render.kpis);
        rendered.add(kpi.id);
      }
    });

    // cards adicionados pelo usuário
    state.kpis.filter(k => !rendered.has(k.id)).forEach(kpi => {
      const card = document.createElement('article');
      card.className = 'glass-card kpi-card card-bar-cyan';
      card.dataset.id = kpi.id;
      card.innerHTML = buildHalfInnerHtml(kpi);
      container.appendChild(card);
      setupHalfListeners(card, kpi, Conebel.render.kpis);
      Conebel.actions.bindCard(card, kpi, 'kpis', Conebel.render.kpis);
    });

    const badge = document.getElementById('kpisCountBadge');
    if (badge) badge.textContent = state.kpis.length + ' Indicadores';
  }

  return render;
})();