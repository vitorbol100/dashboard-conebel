/* ============================================================
   HEADER / FOOTER — textos editáveis e persistentes
   ============================================================ */
Conebel.render.headerFooter = (function () {

  const MAP = [
    ['footerUpdateText', 'footerUpdate'],
    ['footerSourceText', 'footerSource'],
    ['footerCompanyText', 'footerCompany']
  ];

  function update() {
    const texts = Conebel.state.headerTexts || {};
    MAP.forEach(([elId, key]) => {
      const node = document.getElementById(elId);
      if (node && texts[key] !== undefined) node.textContent = texts[key];
    });
  }

  function init() {
    MAP.forEach(([elId, key]) => {
      const node = document.getElementById(elId);
      if (!node) return;
      node.setAttribute('contenteditable', 'true');
      node.addEventListener('blur', () => {
        Conebel.state.headerTexts[key] = node.textContent.trim();
        Conebel.store.save(Conebel.state);
      });
    });

    const title = document.getElementById('execTitle');
    const company = document.getElementById('execCompany');
    const tag1 = document.getElementById('execTag1');

    [[title, 'title'], [company, 'company'], [tag1, 'tag1']].forEach(([node, key]) => {
      if (!node) return;
      node.addEventListener('blur', () => {
        Conebel.state.headerTexts[key] = node.textContent.trim();
        Conebel.store.save(Conebel.state);
      });
    });
  }

  function applyHeaderTexts() {
    const t = Conebel.state.headerTexts || {};
    const set = (id, v) => { const n = document.getElementById(id); if (n && v) n.textContent = v; };
    set('execTitle', t.title);
    set('execCompany', t.company);
    set('execTag1', t.tag1);
  }

  return { update, init, applyHeaderTexts };
})();