(() => {
  'use strict';
  const slides = [...document.querySelectorAll('section.slide')];
  const $ = id => document.getElementById(id);
  let index = 0;
  for (let i = 0; i < slides.length; i++) $('jump').add(new Option(`${i + 1} · ${slides[i].dataset.title}${slides[i].dataset.optional ? ' (extra)' : ''}`, String(i)));
  function show(n) {
    index = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => { s.classList.toggle('active', i === index); s.setAttribute('aria-hidden', i === index ? 'false' : 'true'); });
    $('count').textContent = `${index + 1} / ${slides.length}`;
    $('prev').disabled = index === 0; $('next').disabled = index === slides.length - 1;
    $('jump').value = String(index);
    $('teacher-text').textContent = slides[index].dataset.teacher || 'Följ den synliga elevaktiviteten. Alla centrala steg finns på lektionsbilden.';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  $('prev').addEventListener('click', () => show(index - 1));
  $('next').addEventListener('click', () => show(index + 1));
  $('jump').addEventListener('change', () => show(Number($('jump').value)));
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.target.closest('button,input,select,textarea,summary,[contenteditable]')) return;
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
  });
  $('mode').addEventListener('click', e => {
    const on = document.body.classList.toggle('classroom');
    e.currentTarget.textContent = on ? 'Repetitionsläge' : 'Klassrumsläge';
    e.currentTarget.setAttribute('aria-pressed', String(on));
  });
  $('teacher-toggle').addEventListener('click', e => {
    const on = $('teacher').classList.toggle('open');
    e.currentTarget.textContent = on ? 'Dölj lärarstöd' : 'Visa lärarstöd';
    e.currentTarget.setAttribute('aria-expanded', String(on));
  });
  for (const button of document.querySelectorAll('[data-reveal]')) {
    const target = $(button.dataset.reveal);
    if (!target) throw new Error(`Saknad återkoppling ${button.dataset.reveal}`);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const on = target.classList.toggle('open');
      button.setAttribute('aria-expanded', String(on));
      button.textContent = on ? 'Dölj återkoppling' : 'Visa återkoppling';
    });
  }
  const svgNS = 'http://www.w3.org/2000/svg';
  function svgNode(svg, kind, props, t) {
    const node = document.createElementNS(svgNS, kind);
    for (const [k, v] of Object.entries(props)) node.setAttribute(k, String(v));
    if (t !== undefined) node.textContent = t;
    svg.append(node); return node;
  }
  function drawCircle(svg, angle, reflections) {
    svg.replaceChildren();
    const c = 170, r = 137, phi = angle * Math.PI / 180;
    const point = a => [c + r * Math.cos(a), c - r * Math.sin(a)];
    svgNode(svg, 'line', { x1: 15, y1: c, x2: 328, y2: c, stroke: '#6b8796', 'stroke-width': 1.5 });
    svgNode(svg, 'line', { x1: c, y1: 8, x2: c, y2: 331, stroke: '#6b8796', 'stroke-width': 1.5 });
    svgNode(svg, 'circle', { cx: c, cy: c, r, stroke: '#274e65', 'stroke-width': 2.8, fill: '#eff9fc' });
    for (const a of [0, 90, 180, 270]) {
      const [x, y] = point(a * Math.PI / 180);
      svgNode(svg, 'circle', { cx: x, cy: y, r: 4, fill: '#355c70' });
      svgNode(svg, 'text', { x: x + (a === 180 ? -34 : 8), y: y + (a === 90 ? -8 : 20), fill: '#355c70', 'font-size': 14 }, `${a}°`);
    }
    if (reflections) {
      for (const a of [Math.PI - phi, -phi]) {
        const [x, y] = point(a);
        svgNode(svg, 'line', { x1: c, y1: c, x2: x, y2: y, stroke: '#c17d30', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
        svgNode(svg, 'circle', { cx: x, cy: y, r: 5.3, fill: '#c17d30' });
      }
    }
    const [x, y] = point(phi);
    svgNode(svg, 'line', { x1: c, y1: c, x2: x, y2: y, stroke: '#12776e', 'stroke-width': 3.6 });
    svgNode(svg, 'line', { x1: x, y1: y, x2: x, y2: c, stroke: '#287aa0', 'stroke-width': 2.6, 'stroke-dasharray': '5 4' });
    svgNode(svg, 'line', { x1: c, y1: c, x2: x, y2: c, stroke: '#287aa0', 'stroke-width': 2.6 });
    svgNode(svg, 'circle', { cx: x, cy: y, r: 7, fill: '#087669', stroke: '#fff', 'stroke-width': 2.5 });
    svgNode(svg, 'text', { x: 320, y: 160, 'font-weight': 750, fill: '#31566a', 'font-size': 15 }, 'x');
    svgNode(svg, 'text', { x: 180, y: 14, 'font-weight': 750, fill: '#31566a', 'font-size': 15 }, 'y');
    svgNode(svg, 'text', { x: Math.max(22, Math.min(284, x + 8)), y: Math.max(25, Math.min(315, y - 12)), fill: '#087669', 'font-size': 17, 'font-weight': 800 }, 'P');
  }
  const circle = $('circle-plot');
  if (circle) {
    let reflections = false;
    const angleInput = $('angle');
    const fmt = n => Math.abs(n) < .0005 ? '0,000' : n.toFixed(3).replace('.', ',');
    const update = () => {
      const a = Number(angleInput.value), x = Math.cos(a * Math.PI / 180), y = Math.sin(a * Math.PI / 180);
      drawCircle(circle, a, reflections);
      $('angle-value').textContent = `${a}°`;
      $('x-value').textContent = fmt(x); $('y-value').textContent = fmt(y);
      $('tan-value').textContent = Math.abs(x) < 1e-9 ? 'ej definierad (x = 0)' : fmt(y / x);
    };
    angleInput.addEventListener('input', update);
    document.querySelectorAll('[data-angle]').forEach(b => b.addEventListener('click', () => { angleInput.value = b.dataset.angle; update(); }));
    const reflect = $('reflect');
    if (reflect) reflect.addEventListener('click', () => { reflections = !reflections; reflect.setAttribute('aria-pressed', String(reflections)); update(); });
    update();
  }
  show(0);
  window.lessonInfo = { slides, go: show };
})();
