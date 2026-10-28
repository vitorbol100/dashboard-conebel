/* ============================================================
   DEFAULT STATE — 11 KPIs + 7 gráficos
   ATENÇÃO: as séries diárias abaixo são placeholders que terminam
   nos valores documentados. Substitua pelas séries reais do seu
   arquivo original ou deixe a planilha preencher.
   ============================================================ */
Conebel.defaultState = {
  theme: 'deep-tech',
  themeOverrides: {},
  lastFile: null,

  headerTexts: {
    title: 'Fluxo de Caixa — Indicadores do Mês',
    company: 'CONEBEL • Distribuidora Ambev',
    tag1: 'DIRETORIA EXECUTIVA',
    footerUpdate: 'Atualizado em 23/10/2026 às 18:50',
    footerSource: 'Fonte: Planilha de Fluxo de Caixa — Conebel',
    footerCompany: 'Distribuição Ambev Brasil • Apresentação de Resultados'
  },

  kpis: [
    {
      id: 'kpi_saldo_total', sheetRow: 21, title: 'SALDO TOTAL DISPONÍVEL',
      format: 'currency', sheetVal: 8433785.37, manualVal: null,
      subdetail: 'C/C: R$ 895.111,91 • Aplicações: R$ 7.538.673,46',
      badgeText: 'DISPONÍVEL', badgeType: 'cyan', colorType: 'pos',
      bm1: 'Disponibilidade Imediata', icon: 'vault'
    },
    {
      id: 'kpi_val_estoque_rs', sheetRow: 25, title: 'VALORIZAÇÃO ESTOQUE R$',
      format: 'currency', sheetVal: 35667091.87, manualVal: null,
      banner: '646 R$/HL ATUAL', colorType: 'pos',
      bm1: 'Custo Médio Ponderado', icon: 'cube'
    },
    {
      id: 'kpi_val_estoque_hl', sheetRow: 26, title: 'VALORIZAÇÃO ESTOQUE HECTOS',
      format: 'hl', sheetVal: 55187, manualVal: null,
      subdetail: 'Volume físico do dia', colorType: 'pos',
      bm1: 'Capacidade Operacional', icon: 'cylinders'
    },
    {
      id: 'kpi_venda_acumulada', sheetRow: 33, title: 'VENDA ACUMULADA',
      format: 'currency', sheetVal: 40062581.20, manualVal: null,
      subdetail: '<span class="delta-badge delta-up">100% ATINGIDO</span>',
      badgeText: 'META SUPERADA', badgeType: 'pos', colorType: 'pos',
      bm1: 'vs Meta: +R$ 62.581', icon: 'chart'
    },
    {
      id: 'kpi_meta_tendencia_mensal', sheetRow: 35, title: 'META / TENDÊNCIA MENSAL',
      format: 'currency', sheetVal: 40062581.20, manualVal: null,
      subdetail: 'Projeção linear do mês', colorType: 'pos',
      bm1: 'Target Ambev Fechado', icon: 'target'
    },
    {
      id: 'kpi_rshl_acumulado', sheetRow: 39, title: 'R$/HL ACUMULADO MES',
      format: 'int', sheetVal: 38775, manualVal: null,
      subdetail: '<span class="delta-badge delta-up">▲ 2,4% VS META</span>',
      colorType: 'pos', bm1: 'Receita líquida por hl', icon: 'tag'
    },
    {
      id: 'kpi_meta_rshl_mensal', sheetRow: 40, title: 'META / TENDÊNCIA R$/HL MENSAL',
      format: 'int', sheetVal: 38775, manualVal: null,
      subdetail: 'Alvo operacional', colorType: 'pos',
      bm1: 'Parâmetro de Mix Ambev', icon: 'target'
    },
    {
      id: 'kpi_inadimplencia', sheetRow: 24, title: 'INADIMPLÊNCIA',
      format: 'currency', sheetVal: 180077.86, manualVal: null,
      valSuffix: ' (0,4%)',
      subdetail: '<span class="delta-badge delta-amber">-2,1 p.p. vs mês ant.</span>',
      badgeText: 'ATENÇÃO', badgeType: 'warn', colorType: 'warn',
      bm1: 'Teto Ambev: 0,8%', icon: 'shield'
    },
    {
      id: 'kpi_boletos_vencer', sheetRow: 23, title: 'BOLETOS A VENCER',
      format: 'currency', sheetVal: 12759548.14, manualVal: null,
      subdetail: 'Fluxo a liquidar', colorType: 'warn',
      bm1: 'Compromissos D+7', icon: 'document'
    },
    {
      id: 'kpi_contas_pagas', sheetRow: 45, title: 'CONTAS PAGAS NO MÊS',
      format: 'currency', sheetVal: 59169014.67, manualVal: null,
      subdetail: 'Folha, Puxadas e Fornec.', colorType: 'warn',
      bm1: 'Desembolso do Mês', icon: 'calendar'
    },
    {
      id: 'kpi_cobranca_recebida', sheetRow: 50, title: 'COBRANÇA RECEBIDA',
      format: 'currency', sheetVal: 44657036.77, manualVal: null,
      subdetail: '<span class="delta-badge delta-up">▲ 98,6% ADIMPLÊNCIA</span>',
      colorType: 'pos', bm1: 'Entradas de Clientes', icon: 'arrow-up'
    }
  ],

  charts: [
    {
      id: 'chart_comb_saldo_boletos', chartType: 'dual_combined',
      title: 'Saldo Total, Boletos a Vencer e Hectos R$ por Dia',
      subtitle: 'Barras ciano (Saldo TT), cinza (Boletos) e linha laranja (Hectos R$)',
      days: [2,3,4,6,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23,24,26,27,28,29,30],
      seriesSaldo:   [5.2,5.4,5.6,5.9,6.1,6.3,6.5,6.7,6.9,7.1,7.2,7.3,7.4,7.5,7.6,7.7,7.8,7.9,8.0,8.1,8.2,8.25,8.3,8.38,8.43],
      seriesBoletos: [3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.9,4.0,4.1,4.2,4.3,4.4,4.5,4.55,4.6,4.65,4.7,4.75,4.8,4.82,4.85,4.88,4.9],
      seriesHectos:  [30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,54,55.2]
    },
    {
      id: 'chart_fluxo_entrada_saida', chartType: 'grouped_bars_fluxo',
      title: 'FLUXO - ENTRADA E SAÍDA (R$)',
      subtitle: 'Comparativo diário de Cobrança (Entradas) vs Contas Pagas do Dia (Saídas)',
      days: [2,3,4,6,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23,24,26,27,28,29,30],
      seriesCobranca:   [2.4,2.5,2.6,2.7,2.8,2.9,3.0,3.1,3.2,3.3,3.4,3.45,3.5,3.55,3.6,3.62,3.65,3.68,3.7,3.72,3.74,3.76,3.78,3.79,3.8],
      seriesContasPagas:[2.2,2.3,2.4,2.5,2.6,2.7,2.8,2.9,3.0,3.1,3.2,3.25,3.3,3.35,3.4,3.42,3.44,3.46,3.47,3.48,3.49,3.5,3.5,3.5,3.5]
    },
    {
      id: 'chart_inadimplencia_diaria', chartType: 'bars_inadimplencia',
      title: 'Inadimplência diária do mês',
      subtitle: 'Valores diários da linha 24 (Inad(Mês))',
      days: [2,3,4,6,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23,24,26,27,28,29,30],
      seriesInad: [120,124,128,132,136,140,144,148,152,156,160,163,166,169,171,173,175,176,177,178,179,179.5,180,180,180]
    },
    {
      id: 'chart_venda_vs_meta', chartType: 'line_area_meta',
      title: 'Venda Acumulada vs Meta Mensal',
      subtitle: 'Realizado com preenchimento em gradiente ciano vs Meta linear tracejada',
      days: [2,3,4,6,7,8,9,10,12,13,14,15,16,17,19,20,21,22,23,24,26,27,28,29,30],
      seriesVenda: [1.6,3.2,4.8,6.4,8.0,9.6,11.2,12.8,14.4,16.0,17.6,19.2,20.8,22.4,24.0,25.6,27.2,28.8,30.4,32.0,33.6,35.2,36.8,38.4,40.06],
      seriesMeta:  [1.6,3.2,4.8,6.4,8.0,9.6,11.2,12.8,14.4,16.0,17.6,19.2,20.8,22.4,24.0,25.6,27.2,28.8,30.4,32.0,33.6,35.2,36.8,38.4,40.06]
    },
    {
      id: 'chart_vendas_semana', chartType: 'grouped_bars_semanas',
      title: 'Comparativo de Vendas por Semana: Mês Atual vs Mês Anterior (R$)',
      subtitle: 'Mês Atual vs Mês Anterior (Semana 1 a Semana 3)',
      weeks: ['Semana 1', 'Semana 2', 'Semana 3'],
      seriesAtual: [9.85, 10.42, 9.95],
      seriesAnterior: [9.10, 9.75, 9.30]
    },
    {
      id: 'chart_canais_faturamento', chartType: 'donut_canais',
      title: 'Canais de Faturamento (%) — Venda Direta vs Marketplace',
      subtitle: 'Distribuição percentual da receita operacional',
      channels: [
        { name: 'Venda Direta', val: 15755155.73, pct: 79, color: '#00D4FF' },
        { name: 'Marketplace', val: 4149550.91, pct: 21, color: '#FFAB40' }
      ],
      totalCenter: 'R$ 19.904.707',
      totalLabel: 'Faturamento'
    },
    {
      id: 'chart_composicao_contas', chartType: 'stacked_horizontal_contas',
      title: 'Composição das Contas Pagas',
      subtitle: 'Rateio por categoria de desembolso corporativo',
      categories: [
        { name: 'Puxadas Ambev (Frete/Logística)', val: 29745676.88, pct: 83.9, color: '#1E40AF' },
        { name: 'Folha de Pagamento + Impostos', val: 1614436.67, pct: 4.6, color: '#F59E0B' },
        { name: 'Fornecedores Gerais e Custos Adm', val: 4085178.50, pct: 11.5, color: '#64748B' }
      ],
      footerText: 'Total Liquidado no Mês: R$ 35.445.292,05'
    }
  ]
};