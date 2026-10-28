/* ============================================================
   RESET — restaurar padrão
   ============================================================ */
Conebel.actions.reset = (function () {

  function run() {
    const msg = 'Atenção: Isso irá restaurar todos os 11 cards, os 7 gráficos, ' +
      'valores e cores para o padrão original da Conebel. Deseja continuar?';
    if (!confirm(msg)) return;

    Conebel.state = Conebel.store.clone(Conebel.defaultState);
    Conebel.store.save(Conebel.state);

    Conebel.theme.switchTheme(Conebel.state.theme);
    Conebel.render.kpis();
    Conebel.render.charts();
    Conebel.render.headerFooter.update();
    Conebel.render.headerFooter.applyHeaderTexts();

    document.getElementById('loadedFileName').textContent = 'Nenhum arquivo carregado';
    Conebel.fileReader.setStatus('loading', 'Aguardando arquivo');
    document.getElementById('uploadSubText').textContent =
      'Arraste a planilha ou selecione um arquivo';
    document.getElementById('btnSelectFileLabel').textContent =
      'Selecionar arquivo (.xlsx / .csv)';

    Conebel.toast.show('Dashboard restaurado para o padrão inicial.', { type: 'success' });
  }

  function init() {
    document.getElementById('btnResetAll').addEventListener('click', run);
  }

  return { init, run };
})();