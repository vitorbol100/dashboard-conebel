/* ============================================================
   RENDER CHARTS
   ============================================================ */
Conebel.render.charts = (function () {

  function render() {
    const container = document.getElementById('chartsContainer');
    if (!container) return;

    container.innerHTML = '';
    const state = Conebel.state;
    const isEdit = document.body.classList.contains('is-editing');

    state.charts.forEach(chartData => {
      const card = document.createElement('div');
      card.className = 'glass-card chart-card';
      card.dataset.id = chartData.id;
      card.draggable = isEdit;
      card.style.position = 'relative';

      card.innerHTML = `
        <div class="card-controls">
          <button class="btn-card-ctrl drag-handle" title="Arrastar">⠿</button>
          <button class="btn-card-ctrl btn-edit" title="Editar">✎</button>
          <button class="btn-card-ctrl btn-dup" title="Duplicar">⧉</button>
          <button class="btn-card-ctrl btn-del" title="Excluir">✕</button>
        </div>
        <div class="chart-head">
          <div class="chart-title" contenteditable="${isEdit}" data-field="title">${chartData.title}</div>
          <div class="chart-subtitle" contenteditable="${isEdit}" data-field="subtitle">${chartData.subtitle || ''}</div>
        </div>
        <div class="chart-container-exec" id="chartBox_${chartData.id}">
          <svg class="custom-chart-svg" id="chartSvg_${chartData.id}"
               viewBox="0 0 680 270" preserveAspectRatio="none"></svg>
          <div class="chart-tooltip" id="chartTooltip_${chartData.id}"></div>
        </div>
        <div id="chartExtra_${chartData.id}"></div>
      `;

      container.appendChild(card);

      card.querySelectorAll('[contenteditable="true"]').forEach(node => {
        node.addEventListener('blur', () => {
          const field = node.dataset.field;
          if (!field) return;
          chartData[field] = node.textContent.trim();
          Conebel.store.save(Conebel.state);
        });
      });

      card.querySelector('.btn-edit').addEventListener('click', () => {
        Conebel.drawer.openChart(chartData, Conebel.render.charts);
      });

      card.querySelector('.btn-dup').addEventListener('click', () => {
        const copy = Conebel.store.clone(chartData);
        copy.id = 'chart_' + Date.now();
        copy.title = chartData.title + ' (Cópia)';
        state.charts.push(copy);
        Conebel.store.save(state);
        Conebel.render.charts();
      });

      card.querySelector('.btn-del').addEventListener('click', () => {
        if (state.charts.length <= 1) {
          Conebel.toast.show('Mantenha ao menos um gráfico.', { type: 'error' });
          return;
        }
        if (confirm(`Excluir o gráfico "${chartData.title}"?`)) {
          state.charts = state.charts.filter(c => c.id !== chartData.id);
          Conebel.store.save(state);
          Conebel.render.charts();
        }
      });

      Conebel.actions.bindDrag(card, chartData, 'charts', Conebel.render.charts);

      drawChart(chartData);
    });

    const badge = document.getElementById('chartsCountBadge');
    if (badge) badge.textContent = state.charts.length + ' Gráficos';
  }

  function drawChart(chartData) {
    const svg = document.getElementById('chartSvg_' + chartData.id);
    const tooltip = document.getElementById('chartTooltip_' + chartData.id);
    const extra = document.getElementById('chartExtra_' + chartData.id);
    if (!svg || !tooltip || !extra) return;

    Conebel.engines.render(chartData, svg, tooltip, extra);
  }

  return render;
})();