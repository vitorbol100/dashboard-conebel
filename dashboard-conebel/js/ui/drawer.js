/* ============================================================
   DRAWER — painel lateral de edição
   ============================================================ */
Conebel.drawer = (function () {
  const { $ } = Conebel.dom;
  const { formatVal, parseLocaleNumber } = Conebel.format;
  const C = Conebel.constants;

  let ctx = null;

  function open(item, arrayKey, refreshFn) {
    ctx = { item, arrayKey, refreshFn, isChart: false };
    $('#drawerItemTitle').textContent = 'Editar Card';
    $('#drawerBody').innerHTML = cardForm(item);
    activate();
  }

  function openChart(chartData, refreshFn) {
    ctx = { item: chartData, refreshFn, isChart: true };
    $('#drawerItemTitle').textContent = 'Editar Gráfico';
    $('#drawerBody').innerHTML = chartForm(chartData);
    activate();
  }

  function activate() {
    $('#editDrawer').classList.add('open');
    $('#editDrawer').setAttribute('aria-hidden', 'false');
    $('#drawerBackdrop').classList.add('open');
  }

  function close() {
    $('#editDrawer').classList.remove('open');
    $('#editDrawer').setAttribute('aria-hidden', 'true');
    $('#drawerBackdrop').classList.remove('open');
    ctx = null;
  }

  /* ---------- formulário de card ---------- */
  function cardForm(item) {
    const curVal = item.manualVal !== null && item.manualVal !== undefined
      ? item.manualVal : item.sheetVal;

    const formatOpts = Object.entries(C.FORMATS)
      .map(([k, label]) =>
        `<option value="${k}" ${item.format === k ? 'selected' : ''}>${label}</option>`)
      .join('');

    let html = `
      <div class="field">
        <label for="d_title">Título do Card</label>
        <input id="d_title" type="text" value="${escapeAttr(item.title)}">
      </div>
      <div class="field">
        <label for="d_val">Valor Manual ou Sobrescrito</label>
        <input id="d_val" type="text" value="${curVal != null ? curVal : ''}">
        <span class="hint">Digite o valor numérico. Deixe vazio para voltar à planilha.</span>
      </div>
      <div class="field">
        <label for="d_format">Formato Numérico</label>
        <select id="d_format">${formatOpts}</select>
      </div>
      <div class="field">
        <label for="d_banner">Faixa / Banner Amarelo</label>
        <input id="d_banner" type="text" value="${escapeAttr(item.banner || '')}">
      </div>`;

    if (item.badgeText !== undefined) {
      const badgeOpts = Object.entries(C.BADGE_TYPES)
        .map(([k, label]) =>
          `<option value="${k}" ${item.badgeType === k ? 'selected' : ''}>${label}</option>`)
        .join('');

      html += `
        <div class="field">
          <label for="d_badgeText">Texto do Badge de Status</label>
          <input id="d_badgeText" type="text" value="${escapeAttr(item.badgeText || '')}">
        </div>
        <div class="field">
          <label for="d_badgeType">Tipo do Badge</label>
          <select id="d_badgeType">${badgeOpts}</select>
        </div>
        <div class="field">
          <label for="d_colorType">Cor do Valor</label>
          <select id="d_colorType">${badgeOpts.replace(/value="(\w+)"/g, 'value="$1"')}</select>
        </div>`;
    }

    if (item.subdetail !== undefined) {
      html += `
        <div class="field">
          <label for="d_subdetail">Subdetalhes / Legenda</label>
          <textarea id="d_subdetail" rows="3">${item.subdetail || ''}</textarea>
          <span class="hint">HTML é suportado.</span>
        </div>`;
    }

    return html;
  }

  /* ---------- formulário de gráfico ---------- */
  function chartForm(c) {
    return `
      <div class="field">
        <label for="c_title">Título do Gráfico</label>
        <input id="c_title" type="text" value="${escapeAttr(c.title)}">
      </div>
      <div class="field">
        <label for="c_type">Tipo de Gráfico</label>
        <select id="c_type">
          <option value="line" ${c.type === 'line' ? 'selected' : ''}>Linha com Gradiente</option>
          <option value="bar" ${c.type === 'bar' ? 'selected' : ''}>Barras</option>
          <option value="donut" ${c.type === 'donut' ? 'selected' : ''}>Rosca (Donut)</option>
        </select>
      </div>
      <div class="field">
        <label for="c_s1_label">Rótulo Série 1</label>
        <input id="c_s1_label" type="text" value="${escapeAttr(c.series1Label || '')}">
      </div>
      <div class="field">
        <label for="c_s1_color">Cor Série 1</label>
        <input id="c_s1_color" type="color" value="${c.series1Color || '#00D4FF'}">
      </div>
      <div class="field">
        <label for="c_s2_label">Rótulo Série 2 (opcional)</label>
        <input id="c_s2_label" type="text" value="${escapeAttr(c.series2Label || '')}">
      </div>
      <div class="field">
        <label for="c_s2_color">Cor Série 2</label>
        <input id="c_s2_color" type="color" value="${c.series2Color || '#7B61FF'}">
      </div>`;
  }

  /* ---------- salvar ---------- */
  function save() {
    if (!ctx) return;
    const { item, isChart, refreshFn } = ctx;

    if (isChart) {
      item.title = val('#c_title');
      item.type = val('#c_type');
      item.series1Label = val('#c_s1_label');
      item.series1Color = val('#c_s1_color');
      item.series2Label = val('#c_s2_label');
      item.series2Color = val('#c_s2_color');
    } else {
      item.title = val('#d_title');

      const rawVal = val('#d_val');
      item.manualVal = rawVal === '' ? null : parseLocaleNumber(rawVal);

      item.format = val('#d_format');
      item.banner = val('#d_banner');

      if (document.getElementById('d_badgeText')) {
        item.badgeText = val('#d_badgeText');
        item.badgeType = val('#d_badgeType');
        item.colorType = val('#d_colorType');
      }
      if (document.getElementById('d_subdetail')) {
        item.subdetail = document.getElementById('d_subdetail').value;
      }
    }

    Conebel.store.save(Conebel.state);
    if (typeof refreshFn === 'function') refreshFn();
    close();
    Conebel.toast.show('Alterações salvas com sucesso!', { type: 'success' });
  }

  function val(sel) {
    const node = document.querySelector(sel);
    return node ? node.value.trim() : '';
  }

  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/"/g, '&quot;');
  }

  function init() {
    document.getElementById('btnDrawerClose').addEventListener('click', close);
    document.getElementById('drawerBackdrop').addEventListener('click', close);
    document.getElementById('btnDrawerSave').addEventListener('click', save);
  }

  return { open, openChart, close, save, init };
})();