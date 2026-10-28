/* ============================================================
   CARD ACTIONS — duplicar, excluir, arrastar
   ============================================================ */
Conebel.actions = Conebel.actions || {};

Conebel.actions.bindDrag = function (cardEl, dataObj, arrayKey, refreshFn) {
  cardEl.addEventListener('dragstart', e => {
    if (!Conebel.actions.editMode.isActive()) {
      e.preventDefault();
      return;
    }
    cardEl.classList.add('dragging');
    e.dataTransfer.setData('text/plain', dataObj.id);
  });

  cardEl.addEventListener('dragend', () => {
    cardEl.classList.remove('dragging');
    document.querySelectorAll('.drag-target').forEach(n => n.classList.remove('drag-target'));
  });

  cardEl.addEventListener('dragover', e => {
    if (!Conebel.actions.editMode.isActive()) return;
    e.preventDefault();
    cardEl.classList.add('drag-target');
  });

  cardEl.addEventListener('dragleave', () => cardEl.classList.remove('drag-target'));

  cardEl.addEventListener('drop', e => {
    if (!Conebel.actions.editMode.isActive()) return;
    e.preventDefault();
    cardEl.classList.remove('drag-target');

    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === dataObj.id) return;

    const list = Conebel.state[arrayKey];
    const fromIdx = list.findIndex(x => x.id === draggedId);
    const toIdx = list.findIndex(x => x.id === dataObj.id);
    if (fromIdx === -1 || toIdx === -1) return;

    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);

    Conebel.store.save(Conebel.state);
    refreshFn();
  });
};

Conebel.actions.bindCard = function (cardEl, dataObj, arrayKey, refreshFn) {
  const controls = document.createElement('div');
  controls.className = 'card-controls';
  controls.innerHTML = `
    <button class="btn-card-ctrl drag-handle" title="Arrastar">⠿</button>
    <button class="btn-card-ctrl btn-edit" title="Editar">✎</button>
    <button class="btn-card-ctrl btn-dup" title="Duplicar">⧉</button>
    <button class="btn-card-ctrl btn-del" title="Excluir">✕</button>
  `;
  cardEl.appendChild(controls);

  cardEl.draggable = true;

  controls.querySelector('.btn-edit').addEventListener('click', () => {
    Conebel.drawer.open(dataObj, arrayKey, refreshFn);
  });

  controls.querySelector('.btn-dup').addEventListener('click', () => {
    const copy = Conebel.store.clone(dataObj);
    copy.id = 'kpi_' + Date.now();
    copy.title = dataObj.title + ' (Cópia)';

    const list = Conebel.state[arrayKey];
    const idx = list.findIndex(x => x.id === dataObj.id);
    list.splice(idx + 1, 0, copy);

    Conebel.store.save(Conebel.state);
    refreshFn();
    Conebel.toast.show('Card duplicado', { type: 'success' });
  });

  controls.querySelector('.btn-del').addEventListener('click', () => {
    const list = Conebel.state[arrayKey];
    if (list.length <= 1) {
      Conebel.toast.show('Mantenha pelo menos um card visível.', { type: 'error' });
      return;
    }
    if (confirm(`Deseja realmente excluir o card "${dataObj.title}"?`)) {
      Conebel.state[arrayKey] = list.filter(x => x.id !== dataObj.id);
      Conebel.store.save(Conebel.state);
      refreshFn();
      Conebel.toast.show('Card excluído', { type: 'success' });
    }
  });

  Conebel.actions.bindDrag(cardEl, dataObj, arrayKey, refreshFn);
};