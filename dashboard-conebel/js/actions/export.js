/* ============================================================
   EXPORT — PNG e impressão
   ============================================================ */
Conebel.actions.export = (function () {

  function exportPNG() {
    const wrapper = document.querySelector('.exec-wrapper');
    if (!wrapper) return;

    if (typeof html2canvas === 'undefined') {
      window.print();
      return;
    }

    Conebel.toast.show('Gerando imagem em alta resolução...', { type: 'warn' });

    const wasEditing = Conebel.actions.editMode.isActive();
    if (wasEditing) Conebel.actions.editMode.set(false);

    setTimeout(() => {
      html2canvas(wrapper, {
        scale: 2,
        backgroundColor: getComputedStyle(document.body).backgroundColor || '#0A0E1A',
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'Fluxo_de_Caixa_Conebel_' +
          new Date().toISOString().slice(0, 10) + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (wasEditing) Conebel.actions.editMode.set(true);
        Conebel.toast.show('Download do PNG concluído com sucesso!', { type: 'success' });
      }).catch(err => {
        console.error(err);
        if (wasEditing) Conebel.actions.editMode.set(true);
        window.print();
      });
    }, 150);
  }

  function init() {
    document.getElementById('btnExportPNG').addEventListener('click', exportPNG);
    document.getElementById('btnPrint').addEventListener('click', () => window.print());
  }

  return { init, exportPNG };
})();