/* ============================================================
   TOAST — notificações
   ============================================================ */
Conebel.toast = (function () {

  function show(message, opts) {
    const options = opts || {};
    const type = options.type || 'info';
    const duration = options.duration || 3000;

    const stack = document.getElementById('toastStack');
    if (!stack) return;

    const node = document.createElement('div');
    node.className = 'toast ' + type;
    node.textContent = message;
    stack.appendChild(node);

    setTimeout(() => {
      node.style.opacity = '0';
      setTimeout(() => node.remove(), 220);
    }, duration);
  }

  return { show };
})();