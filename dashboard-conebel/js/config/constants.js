/* ============================================================
   CONSTANTS — valores fixos do dashboard
   ============================================================ */
window.Conebel = window.Conebel || {};

Conebel.constants = {
  STORAGE_KEY: 'conebel_dashboard_exec_v4',

  // Dias úteis do mês corrente
  MONTH_DAYS: [2, 3, 4, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17,
               19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30],

  THEME_NAMES: {
    'deep-tech': 'Deep Tech',
    'corporate': 'Conebel Corporate',
    'glass': 'Glass Premium'
  },

  THEME_DEFAULTS: {
    bg: '#0A0E1A',
    cardBg: '#141B2E',
    accent: '#00D4FF',
    accentSec: '#7B61FF',
    pos: '#00E5A0',
    warn: '#FFB020',
    neg: '#FF4D6D',
    textMain: '#E8ECF5'
  },

  FORMATS: {
    currency: 'R$ (Moeda: R$ 0.000,00)',
    decimal: 'Número (2 Decimais: 0.000,00)',
    hl: 'Volume (Hectolitros: 0.000 hl)',
    int: 'Número (Sem Decimais: 0.000)'
  },

  BADGE_TYPES: {
    pos: 'Verde (Meta Superada / Excelente)',
    warn: 'Âmbar (Atenção / Atenção Parcial)',
    neg: 'Rosa/Vermelho (Alerta / Crítico)'
  },

  // Layout dos cards: 1 card único + 5 combos (2 metades cada)
  CARD_LAYOUT: [
    { type: 'single', kpiIds: ['kpi_saldo_total'], barClass: 'card-bar-cyan' },
    { type: 'combo', kpiIds: ['kpi_val_estoque_rs', 'kpi_val_estoque_hl'], barClass: 'card-bar-cyan' },
    { type: 'combo', kpiIds: ['kpi_venda_acumulada', 'kpi_meta_tendencia_mensal'], barClass: 'card-bar-emerald' },
    { type: 'combo', kpiIds: ['kpi_rshl_acumulado', 'kpi_meta_rshl_mensal'], barClass: 'card-bar-emerald' },
    { type: 'combo', kpiIds: ['kpi_inadimplencia', 'kpi_boletos_vencer'], barClass: 'card-bar-amber' },
    { type: 'combo', kpiIds: ['kpi_contas_pagas', 'kpi_cobranca_recebida'], barClass: 'card-bar-amber' }
  ]
};