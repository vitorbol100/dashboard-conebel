/* ============================================================
   SVG — helpers de desenho
   ============================================================ */
Conebel.svg = (function () {
  const NS = 'http://www.w3.org/2000/svg';

  function line(x1, y1, x2, y2, stroke, w) {
    const n = document.createElementNS(NS, 'line');
    n.setAttribute('x1', x1); n.setAttribute('y1', y1);
    n.setAttribute('x2', x2); n.setAttribute('y2', y2);
    n.setAttribute('stroke', stroke);
    n.setAttribute('stroke-width', w || 1);
    return n;
  }

  function rect(x, y, w, h, fill, rx) {
    const n = document.createElementNS(NS, 'rect');
    n.setAttribute('x', x); n.setAttribute('y', y);
    n.setAttribute('width', Math.max(w, 0));
    n.setAttribute('height', Math.max(h, 0));
    n.setAttribute('fill', fill);
    if (rx > 0) n.setAttribute('rx', rx);
    return n;
  }

  function circle(cx, cy, r, fill, stroke) {
    const n = document.createElementNS(NS, 'circle');
    n.setAttribute('cx', cx); n.setAttribute('cy', cy);
    n.setAttribute('r', r);
    n.setAttribute('fill', fill);
    n.setAttribute('stroke', stroke || '#000');
    n.setAttribute('stroke-width', 1.5);
    return n;
  }

  function text(x, y, content, anchor, fill, size, weight) {
    const n = document.createElementNS(NS, 'text');
    n.setAttribute('x', x); n.setAttribute('y', y);
    n.setAttribute('text-anchor', anchor || 'start');
    n.setAttribute('fill', fill);
    n.setAttribute('font-size', size);
    n.setAttribute('font-weight', weight || 400);
    n.setAttribute('font-family', 'Inter, sans-serif');
    n.textContent = content;
    return n;
  }

  function path(d, fill, stroke, strokeWidth, dash) {
    const n = document.createElementNS(NS, 'path');
    n.setAttribute('d', d);
    n.setAttribute('fill', fill || 'none');
    if (stroke) {
      n.setAttribute('stroke', stroke);
      n.setAttribute('stroke-width', strokeWidth || 2);
      n.setAttribute('stroke-linecap', 'round');
      n.setAttribute('stroke-linejoin', 'round');
    }
    if (dash) n.setAttribute('stroke-dasharray', dash);
    return n;
  }

  return { line, rect, circle, text, path, NS };
})();