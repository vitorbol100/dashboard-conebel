/* ============================================================
   ENGINES — os 7 motores de gráfico
   Cada engine recebe (svg, tooltip, extraDiv, chartData) e desenha.
   ============================================================ */
Conebel.engines = (function () {
  const S = Conebel.svg;
  const W = 680;
  const H = 270;

  /* ---------- tooltip ---------- */
  function makeTooltip(svg, tooltipEl) {
    return {
      show(xSvg, ySvg, html) {
        const box = svg.getBoundingClientRect();
        const px = (xSvg / W) * box.width;
        const py = (ySvg / H) * box.height;
        tooltipEl.innerHTML = html;
        tooltipEl.style.left = Math.min(px + 12, box.width - 190) + 'px';
        tooltipEl.style.top = Math.max(py - 10, 0) + 'px';
        tooltipEl.classList.add('show');
      },
      hide() { tooltipEl.classList.remove('show'); }
    };
  }

  /* ---------- legenda ---------- */
  function legend(extraDiv, items) {
    extraDiv.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'chart-legend';
    items.forEach(it => {
      const span = document.createElement('span');
      span.className = 'legend-item';
      span.innerHTML =
        `<span class="legend-swatch" style="background:${it.color}"></span>${it.label}`;
      wrap.appendChild(span);
    });
    extraDiv.appendChild(wrap);
  }

  /* ============================================================
     1. dual_combined — Saldo, Boletos e Hectos
     ============================================================ */
  function dualCombined(svg, tooltip, extraDiv, c) {
    const padL = 60, padR = 45, padT = 20, padB = 40;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const days = c.days || Conebel.constants.MONTH_DAYS;
    const sSaldo = c.seriesSaldo || [];
    const sBoletos = c.seriesBoletos || [];
    const sHectos = c.seriesHectos || [];
    const maxLeft = 10, maxRight = 70;
    const tt = makeTooltip(svg, tooltip);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      svg.appendChild(S.line(padL, y, W - padR, y, 'rgba(255,255,255,.08)', 1));
      const yVal = maxLeft - (maxLeft / 4) * i;
      const yRVal = maxRight - (maxRight / 4) * i;
      svg.appendChild(S.text(padL - 8, y + 4, 'R$ ' + yVal.toFixed(0) + 'M', 'end', '#8b949e', 9));
      svg.appendChild(S.text(W - padR + 8, y + 4, yRVal.toFixed(0) + 'k', 'start', '#FFAB40', 9));
    }

    const stepW = cW / days.length;
    const barW = Math.max(stepW * 0.35, 4);

    days.forEach((d, i) => {
      const x = padL + stepW * i + stepW / 2;
      const vSaldo = sSaldo[i] || 0;
      const vBol = sBoletos[i] || 0;
      const vHec = sHectos[i] || 0;

      const hSaldo = (vSaldo / maxLeft) * cH;
      const hBol = (vBol / maxLeft) * cH;

      svg.appendChild(S.rect(x - barW - 1, padT + cH - hSaldo, barW, hSaldo, '#00E5FF', 2));
      svg.appendChild(S.rect(x + 1, padT + cH - hBol, barW, hBol, '#525F6F', 2));

      if (i % 2 === 0 || days.length <= 15) {
        svg.appendChild(S.text(x, H - padB + 16, d, 'middle', '#8b949e', 9));
      }

      const yHec = padT + cH - (vHec / maxRight) * cH;
      svg.appendChild(S.circle(x, yHec, 3, '#FFAB40', '#0B1220'));

      const hit = S.rect(x - stepW / 2, padT, stepW, cH, 'transparent', 0);
      hit.style.cursor = 'pointer';
      hit.addEventListener('mouseenter', () => {
        tt.show(x, yHec, `
          <strong>Dia ${d} do Mês</strong><br>
          Saldo TT C/C + Inv.: R$ ${vSaldo.toFixed(2)}M<br>
          Boletos a Vencer: R$ ${vBol.toFixed(2)}M<br>
          Hectos R$ por Dia: ${vHec.toFixed(1)}k hl`);
      });
      hit.addEventListener('mouseleave', () => tt.hide());
      svg.appendChild(hit);
    });

    // linha de hectos
    let dPath = '';
    days.forEach((d, i) => {
      const x = padL + stepW * i + stepW / 2;
      const y = padT + cH - ((sHectos[i] || 0) / maxRight) * cH;
      dPath += (i === 0 ? 'M' : 'L') + x + ' ' + y + ' ';
    });
    svg.appendChild(S.path(dPath, 'none', '#FFAB40', 2.5));

    legend(extraDiv, [
      { color: '#00E5FF', label: 'SALDO TT C/C + INVESTIMENTOS' },
      { color: '#525F6F', label: 'Boletos a Vencer (Total)' },
      { color: '#FFAB40', label: 'Hectos R$ por Dia' }
    ]);
  }

  /* ============================================================
     2. grouped_bars_fluxo — Entradas vs Saídas
     ============================================================ */
  function groupedBarsFluxo(svg, tooltip, extraDiv, c) {
    const padL = 65, padR = 25, padT = 20, padB = 40;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const days = c.days || Conebel.constants.MONTH_DAYS;
    const sCob = c.seriesCobranca || [];
    const sPag = c.seriesContasPagas || [];
    const maxVal = 7.22;
    const tt = makeTooltip(svg, tooltip);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      svg.appendChild(S.line(padL, y, W - padR, y, 'rgba(255,255,255,.08)', 1));
      const v = maxVal - (maxVal / 4) * i;
      svg.appendChild(S.text(padL - 8, y + 4, 'R$ ' + v.toFixed(1) + 'M', 'end', '#8b949e', 9));
    }

    const stepW = cW / days.length;
    const barW = Math.max(stepW * 0.38, 4);

    days.forEach((d, i) => {
      const x = padL + stepW * i + stepW / 2;
      const vCob = sCob[i] || 0;
      const vPag = sPag[i] || 0;

      const hCob = (vCob / maxVal) * cH;
      const hPag = (vPag / maxVal) * cH;

      svg.appendChild(S.rect(x - barW - 1, padT + cH - hCob, barW, hCob, '#29C1D9', 2));
      svg.appendChild(S.rect(x + 1, padT + cH - hPag, barW, hPag, '#F3B250', 2));

      if (i % 2 === 0 || days.length <= 15) {
        svg.appendChild(S.text(x, H - padB + 16, d, 'middle', '#8b949e', 9));
      }

      const hit = S.rect(x - stepW / 2, padT, stepW, cH, 'transparent', 0);
      hit.addEventListener('mouseenter', () => {
        tt.show(x, padT + 20, `
          <strong>Dia ${d}</strong><br>
          COBRANÇA: R$ ${vCob.toFixed(2)}M<br>
          CONTAS PAGAS DO DIA: R$ ${vPag.toFixed(2)}M<br>
          Saldo do Dia: R$ ${(vCob - vPag).toFixed(2)}M`);
      });
      hit.addEventListener('mouseleave', () => tt.hide());
      svg.appendChild(hit);
    });

    legend(extraDiv, [
      { color: '#29C1D9', label: 'COBRANÇA (Entradas)' },
      { color: '#F3B250', label: 'CONTAS PAGAS DO DIA (Saídas)' }
    ]);
  }

  /* ============================================================
     3. bars_inadimplencia
     ============================================================ */
  function barsInadimplencia(svg, tooltip, extraDiv, c) {
    const padL = 60, padR = 25, padT = 20, padB = 40;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const days = c.days || Conebel.constants.MONTH_DAYS;
    const sInad = c.seriesInad || [];
    const maxVal = 500;
    const tt = makeTooltip(svg, tooltip);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      svg.appendChild(S.line(padL, y, W - padR, y, 'rgba(255,255,255,.08)', 1));
      const v = maxVal - (maxVal / 4) * i;
      svg.appendChild(S.text(padL - 8, y + 4, v.toFixed(0) + 'k', 'end', '#8b949e', 9));
    }

    const stepW = cW / days.length;
    const barW = Math.max(stepW * 0.55, 5);

    days.forEach((d, i) => {
      const x = padL + stepW * i + stepW / 2;
      const val = sInad[i] || 0;
      const h = (val / maxVal) * cH;

      svg.appendChild(S.rect(x - barW / 2, padT + cH - h, barW, h, '#FF7A85', 3));

      if (i % 2 === 0 || days.length <= 15) {
        svg.appendChild(S.text(x, H - padB + 16, d, 'middle', '#8b949e', 9));
      }

      const hit = S.rect(x - stepW / 2, padT, stepW, cH, 'transparent', 0);
      hit.addEventListener('mouseenter', () => {
        tt.show(x, padT + cH - h, `
          <strong>Dia ${d} — Inadimplência</strong><br>
          Inad(Mês) Linha 24: R$ ${(val * 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      });
      hit.addEventListener('mouseleave', () => tt.hide());
      svg.appendChild(hit);
    });

    legend(extraDiv, [{ color: '#FF7A85', label: 'Inadimplência diária (R$)' }]);
  }

  /* ============================================================
     4. line_area_meta — Venda vs Meta
     ============================================================ */
  function lineAreaMeta(svg, tooltip, extraDiv, c) {
    const padL = 60, padR = 25, padT = 25, padB = 40;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const days = c.days || Conebel.constants.MONTH_DAYS;
    const sVenda = c.seriesVenda || [];
    const sMeta = c.seriesMeta || [];
    const maxVal = 45;
    const tt = makeTooltip(svg, tooltip);

    const gradId = 'areaGrad_' + c.id;
    const defs = document.createElementNS(S.NS, 'defs');
    const grad = document.createElementNS(S.NS, 'linearGradient');
    grad.setAttribute('id', gradId);
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');

    [[0, '0.38'], [1, '0']].forEach(([off, op]) => {
      const stop = document.createElementNS(S.NS, 'stop');
      stop.setAttribute('offset', off * 100 + '%');
      stop.setAttribute('stop-color', '#00D4FF');
      stop.setAttribute('stop-opacity', op);
      grad.appendChild(stop);
    });

    defs.appendChild(grad);
    svg.appendChild(defs);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      svg.appendChild(S.line(padL, y, W - padR, y, 'rgba(255,255,255,.08)', 1));
      const v = maxVal - (maxVal / 4) * i;
      svg.appendChild(S.text(padL - 8, y + 4, 'R$ ' + v.toFixed(0) + 'M', 'end', '#8b949e', 9));
    }

    const getX = i => padL + (i / (days.length - 1)) * cW;
    const getY = v => padT + cH - (v / maxVal) * cH;

    // área
    let areaD = 'M' + getX(0) + ' ' + (padT + cH) + ' ';
    sVenda.forEach((v, i) => { areaD += 'L' + getX(i) + ' ' + getY(v) + ' '; });
    areaD += 'L' + getX(sVenda.length - 1) + ' ' + (padT + cH) + ' Z';
    svg.appendChild(S.path(areaD, `url(#${gradId})`, null));

    // meta tracejada
    let metaD = '';
    sMeta.forEach((v, i) => { metaD += (i === 0 ? 'M' : 'L') + getX(i) + ' ' + getY(v) + ' '; });
    svg.appendChild(S.path(metaD, 'none', '#7B61FF', 2.5, '6 5'));

    // venda
    let vendaD = '';
    sVenda.forEach((v, i) => { vendaD += (i === 0 ? 'M' : 'L') + getX(i) + ' ' + getY(v) + ' '; });
    svg.appendChild(S.path(vendaD, 'none', '#00D4FF', 3));

    days.forEach((d, i) => {
      const x = getX(i);
      const vReal = sVenda[i] || 0;
      const vM = sMeta[i] || 0;
      const yV = getY(vReal);

      svg.appendChild(S.circle(x, yV, 3, '#00D4FF', '#0B1220'));

      if (i % 2 === 0 || days.length <= 15) {
        svg.appendChild(S.text(x, H - padB + 16, d, 'middle', '#8b949e', 9));
      }

      const hit = S.rect(x - cW / days.length / 2, padT, cW / days.length, cH, 'transparent', 0);
      hit.addEventListener('mouseenter', () => {
        const pct = vM ? ((vReal / vM) * 100).toFixed(1) : '0';
        tt.show(x, yV, `
          <strong>Dia ${d}</strong><br>
          Venda Acumulada: R$ ${vReal.toFixed(2)}M<br>
          Meta Linear: R$ ${vM.toFixed(2)}M<br>
          Atingimento: ${pct}%`);
      });
      hit.addEventListener('mouseleave', () => tt.hide());
      svg.appendChild(hit);
    });

    legend(extraDiv, [
      { color: '#00D4FF', label: 'Venda Acumulada (Realizado)' },
      { color: '#7B61FF', label: 'Meta Mensal Linear' }
    ]);
  }

  /* ============================================================
     5. grouped_bars_semanas
     ============================================================ */
  function groupedBarsSemanas(svg, tooltip, extraDiv, c) {
    const padL = 65, padR = 25, padT = 25, padB = 40;
    const cW = W - padL - padR;
    const cH = H - padT - padB;
    const weeks = c.weeks || ['Semana 1', 'Semana 2', 'Semana 3'];
    const sAtual = c.seriesAtual || [9.85, 10.42, 9.95];
    const sAnt = c.seriesAnterior || [9.10, 9.75, 9.30];
    const maxVal = 12;
    const tt = makeTooltip(svg, tooltip);

    for (let i = 0; i <= 4; i++) {
      const y = padT + (cH / 4) * i;
      svg.appendChild(S.line(padL, y, W - padR, y, 'rgba(255,255,255,.08)', 1));
      const v = maxVal - (maxVal / 4) * i;
      svg.appendChild(S.text(padL - 8, y + 4, 'R$ ' + v.toFixed(0) + 'M', 'end', '#8b949e', 9));
    }

    const stepW = cW / weeks.length;
    const barW = stepW * 0.22;

    weeks.forEach((w, i) => {
      const cx = padL + stepW * i + stepW / 2;
      const vAtual = sAtual[i] || 0;
      const vAnt = sAnt[i] || 0;

      const hA = (vAtual / maxVal) * cH;
      const hB = (vAnt / maxVal) * cH;

      svg.appendChild(S.rect(cx - barW - 3, padT + cH - hA, barW, hA, '#00E5FF', 4));
      svg.appendChild(S.rect(cx + 3, padT + cH - hB, barW, hB, '#586D7E', 4));

      svg.appendChild(S.text(cx, H - padB + 16, w, 'middle', '#8b949e', 10));

      const hit = S.rect(cx - stepW / 2, padT, stepW, cH, 'transparent', 0);
      hit.addEventListener('mouseenter', () => {
        const delta = vAnt ? (((vAtual - vAnt) / vAnt) * 100).toFixed(1) : '0';
        tt.show(cx, padT + cH - hA, `
          <strong>${w}</strong><br>
          Mês Atual: R$ ${vAtual.toFixed(2)}M<br>
          Mês Anterior: R$ ${vAnt.toFixed(2)}M<br>
          Crescimento: +${delta}%`);
      });
      hit.addEventListener('mouseleave', () => tt.hide());
      svg.appendChild(hit);
    });

    legend(extraDiv, [
      { color: '#00E5FF', label: 'Mês Atual' },
      { color: '#586D7E', label: 'Mês Anterior' }
    ]);
  }

  /* ============================================================
     6. donut_canais
     ============================================================ */
  function donutCanais(svg, tooltip, extraDiv, c) {
    const cx = W / 2;
    const cy = H / 2 - 8;
    const r = 85;
    const innerR = 56;
    const channels = c.channels || [
      { name: 'Venda Direta', val: 15755155.73, pct: 79, color: '#00D4FF' },
      { name: 'Marketplace', val: 4149550.91, pct: 21, color: '#FFAB40' }
    ];
    const tt = makeTooltip(svg, tooltip);

    let start = -Math.PI / 2;

    channels.forEach(ch => {
      const slice = (ch.pct / 100) * (2 * Math.PI);
      const end = start + slice;
      const largeArc = ch.pct > 50 ? 1 : 0;

      const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
      const x3 = cx + innerR * Math.cos(end), y3 = cy + innerR * Math.sin(end);
      const x4 = cx + innerR * Math.cos(start), y4 = cy + innerR * Math.sin(start);

      const d = `M${x1} ${y1} A${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}
                 L${x3} ${y3} A${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

      const path = S.path(d, ch.color, null);
      path.setAttribute('opacity', '0.92');
      path.style.cursor = 'pointer';

      path.addEventListener('mouseenter', () => {
        path.setAttribute('opacity', '1');
        const mid = start + slice / 2;
        tt.show(cx + (r * 0.7) * Math.cos(mid), cy + (r * 0.7) * Math.sin(mid), `
          <strong>${ch.name}</strong><br>
          Participação: ${ch.pct}%<br>
          Faturamento: R$ ${ch.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
      });
      path.addEventListener('mouseleave', () => {
        path.setAttribute('opacity', '0.92');
        tt.hide();
      });

      svg.appendChild(path);
      start = end;
    });

    svg.appendChild(S.text(cx, cy - 2, c.totalCenter || 'R$ 19.904.707', 'middle', '#ffffff', 14, 700));
    svg.appendChild(S.text(cx, cy + 14, c.totalLabel || 'Faturamento', 'middle', '#8b949e', 10, 500));

    legend(extraDiv, channels.map(ch => ({
      color: ch.color,
      label: `${ch.name}: R$ ${ch.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${ch.pct}%)`
    })));
  }

  /* ============================================================
     7. stacked_horizontal_contas
     ============================================================ */
  function stackedHorizontalContas(svg, tooltip, extraDiv, c) {
    const padL = 35, padR = 35;
    const barW = W - padL - padR;
    const barH = 46;
    const barY = 55;
    const categories = c.categories || [];
    const tt = makeTooltip(svg, tooltip);

    svg.appendChild(S.text(padL, 34, 'Distribuição dos Desembolsos Líquidos no Período',
      'start', '#8b949e', 11, 600));

    let offset = 0;

    categories.forEach(cat => {
      const segW = (cat.pct / 100) * barW;
      const rect = S.rect(padL + offset, barY, segW, barH, cat.color, 4);
      rect.style.cursor = 'pointer';

      rect.addEventListener('mouseenter', () => {
        tt.show(padL + offset + segW / 2, barY, `
          <strong>${cat.name}</strong><br>
          Valor: R$ ${cat.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br>
          Participação: ${cat.pct}%`);
      });
      rect.addEventListener('mouseleave', () => tt.hide());

      svg.appendChild(rect);

      if (segW > 35) {
        svg.appendChild(S.text(padL + offset + segW / 2, barY + barH / 2 + 4,
          Math.round(cat.pct) + '%', 'middle', '#ffffff', 12, 700));
      }

      offset += segW;
    });

    legend(extraDiv, categories.map(cat => ({
      color: cat.color,
      label: `${cat.name}: R$ ${cat.val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${cat.pct}%)`
    })));

    const footer = document.createElement('div');
    footer.className = 'chart-footer-text';
    footer.textContent = c.footerText || 'Total Liquidado no Mês: R$ 35.445.292,05';
    extraDiv.appendChild(footer);
  }

  /* ---------- registro ---------- */
  const registry = {
    dual_combined: dualCombined,
    grouped_bars_fluxo: groupedBarsFluxo,
    bars_inadimplencia: barsInadimplencia,
    line_area_meta: lineAreaMeta,
    grouped_bars_semanas: groupedBarsSemanas,
    donut_canais: donutCanais,
    stacked_horizontal_contas: stackedHorizontalContas
  };

  function render(chartData, svg, tooltip, extraDiv) {
    svg.innerHTML = '';
    const fn = registry[chartData.chartType];
    if (fn) {
      fn(svg, tooltip, extraDiv, chartData);
    } else {
      svg.appendChild(S.text(W / 2, H / 2, 'Tipo de gráfico não suportado',
        'middle', '#8b949e', 12));
    }
  }

  return { render, registry };
})();