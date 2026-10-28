/* ============================================================
   SHEET PARSER — extrai valores das linhas da planilha
   Mapeamento: 21 Saldo | 13 C/C | 19 Aplicações | 23 Boletos
   25 R$ dia | 26 Hectos | 33 Venda Acum | 35 Meta | 36 R$/HL Atual
   39 R$/HL Acum | 40 Meta R$/HL | 24 Inadimplência
   ============================================================ */
Conebel.sheetParser = (function () {
  const { formatVal, parseLocaleNumber, nowStamp } = Conebel.format;

  function getRowValue(rows, labelKeyword, fallbackRowIndex) {
    const keyword = String(labelKeyword).toLowerCase();

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row[0] == null) continue;
      if (String(row[0]).toLowerCase().includes(keyword)) {
        for (let c = row.length - 1; c >= 1; c--) {
          const v = parseLocaleNumber(row[c]);
          if (v !== 0) return v;
        }
      }
    }

    const fallback = rows[fallbackRowIndex];
    if (fallback) {
      for (let c = fallback.length - 1; c >= 1; c--) {
        const v = parseLocaleNumber(fallback[c]);
        if (v !== 0) return v;
      }
    }
    return null;
  }

  function parse(rows, fileName) {
    const state = Conebel.state;

    const saldoTotal = getRowValue(rows, 'saldo total', 20);
    const ccVal = getRowValue(rows, 'c/c', 12);
    const aplicacoesVal = getRowValue(rows, 'aplicações', 18);
    const boletosVencer = getRowValue(rows, 'boletos a vencer', 22);
    const valEstoqueRs = getRowValue(rows, 'estoque r$', 24);
    const valEstoqueHl = getRowValue(rows, 'hectos', 25);
    const vendaAcumulada = getRowValue(rows, 'venda acumulada', 32);
    const metaVenda = getRowValue(rows, 'meta/tendência mensal', 34);
    const rshlAtual = getRowValue(rows, 'r$/hl atual', 35);
    const rshlAcumulado = getRowValue(rows, 'r$/hl acumulado', 38);
    const metaRshl = getRowValue(rows, 'meta/tendência r$/hl', 39);
    const inadimplencia = getRowValue(rows, 'inad', 23);

    const find = id => state.kpis.find(k => k.id === id);

    const kSaldo = find('kpi_saldo_total');
    if (kSaldo) {
      if (saldoTotal !== null) kSaldo.sheetVal = saldoTotal;
      if (ccVal !== null && aplicacoesVal !== null) {
        kSaldo.subdetail = `C/C: ${formatVal(ccVal, 'currency')} • Aplicações: ${formatVal(aplicacoesVal, 'currency')}`;
      }
    }

    const kEstRs = find('kpi_val_estoque_rs');
    if (kEstRs) {
      if (valEstoqueRs !== null) kEstRs.sheetVal = valEstoqueRs;
      if (rshlAtual !== null) kEstRs.banner = `${formatVal(rshlAtual, 'int')} R$/HL ATUAL`;
    }

    const kEstHl = find('kpi_val_estoque_hl');
    if (kEstHl && valEstoqueHl !== null) kEstHl.sheetVal = valEstoqueHl;

    const kVenda = find('kpi_venda_acumulada');
    if (kVenda && vendaAcumulada !== null) kVenda.sheetVal = vendaAcumulada;

    const kMeta = find('kpi_meta_tendencia_mensal');
    if (kMeta && metaVenda !== null) kMeta.sheetVal = metaVenda;

    const kRsAcum = find('kpi_rshl_acumulado');
    if (kRsAcum && rshlAcumulado !== null) kRsAcum.sheetVal = rshlAcumulado;

    const kMetaRs = find('kpi_meta_rshl_mensal');
    if (kMetaRs && metaRshl !== null) kMetaRs.sheetVal = metaRshl;

    const kInad = find('kpi_inadimplencia');
    if (kInad && inadimplencia !== null) kInad.sheetVal = inadimplencia;

    const kBol = find('kpi_boletos_vencer');
    if (kBol && boletosVencer !== null) kBol.sheetVal = boletosVencer;

    const stamp = nowStamp();
    state.lastFile = { name: fileName, date: stamp };
    state.headerTexts.footerUpdate = 'Atualizado em ' + stamp;

    Conebel.store.save(state);
    Conebel.render.kpis();
    Conebel.render.charts();
    Conebel.render.headerFooter.update();
  }

  return { parse, getRowValue };
})();