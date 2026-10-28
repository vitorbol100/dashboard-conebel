/* ============================================================
   EDIT MODE
   ============================================================ */
Conebel.actions = Conebel.actions || {};

Conebel.actions.editMode = (function () {
  let isEditMode = false;

  function set(active) {
    isEditMode = active;
    document.body.classList.toggle('is-editing', active);

    const btn = document.getElementById('btnToggleEditMode');
    const label = document.getElementById('btnEditLabel');
    if (btn) btn.classList.toggle('active', active);
    if (label) label.textContent = active ? 'Concluir Edição' : 'Editar';

    Conebel.render.kpis();
    Conebel.render.charts();

    Conebel.toast.show(
      active
        ? 'Modo de Edição ATIVADO. Clique em qualquer texto ou use os botões dos cards.'
        : 'Modo de Edição DESATIVADO. Visualização executiva limpa.',
      { type: active ? 'warn' : 'success' }
    );
  }

  function init() {
    const btn = document.getElementById('btnToggleEditMode');
    if (btn) btn.addEventListener('click', () => set(!isEditMode));
  }

  return { init, set, isActive: () => isEditMode };
})();